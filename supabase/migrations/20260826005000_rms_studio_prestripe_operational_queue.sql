-- RMS Studio pre-Stripe operational queue
-- Applied to production on 2026-08-26.

create table if not exists public.rms_studio_drive_actions (
  id uuid primary key default gen_random_uuid(),
  action_key text not null unique,
  member_reference text not null,
  action_type text not null check (action_type in ('grant','revoke','change')),
  previous_folder_id text null,
  target_folder_id text null,
  target_tier text null,
  status text not null default 'pending' check (status in ('pending','complete','failed','canceled')),
  source_event_key text not null,
  error_message text null,
  created_at timestamptz not null default now(),
  completed_at timestamptz null
);

alter table public.rms_studio_drive_actions enable row level security;
revoke all on public.rms_studio_drive_actions from public,anon,authenticated;
grant select,insert,update on public.rms_studio_drive_actions to service_role;

create or replace function public.rms_studio_enqueue_drive_action()
returns trigger
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_previous text;
  v_target text;
  v_type text;
begin
  if new.processing_status <> 'pending_external_action' or new.member_reference is null then
    return new;
  end if;
  if new.event_type='membership_activated' then
    v_type:='grant';
    v_target:=public.rms_studio_tier_drive_folder(new.requested_tier);
  elsif new.event_type='membership_upgraded' then
    v_type:='change';
    select drive_folder_id into v_previous from public.rms_studio_access_audit where event_key=new.event_key order by created_at desc limit 1;
    v_target:=public.rms_studio_tier_drive_folder(new.requested_tier);
  elsif new.event_type='membership_canceled' then
    v_type:='revoke';
    select drive_folder_id into v_previous from public.rms_studio_access_audit where event_key=new.event_key order by created_at desc limit 1;
  else
    return new;
  end if;
  insert into public.rms_studio_drive_actions(action_key,member_reference,action_type,previous_folder_id,target_folder_id,target_tier,source_event_key)
  values('drive:'||new.event_key,new.member_reference,v_type,v_previous,v_target,new.requested_tier,new.event_key)
  on conflict(action_key) do nothing;
  return new;
end;$function$;

drop trigger if exists trg_rms_studio_enqueue_drive_action on public.rms_studio_pi_events;
create trigger trg_rms_studio_enqueue_drive_action after insert on public.rms_studio_pi_events for each row execute function public.rms_studio_enqueue_drive_action();

create or replace function public.rms_studio_complete_drive_action(p_action_key text,p_success boolean,p_error text default null)
returns jsonb
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  a public.rms_studio_drive_actions;
begin
  select * into a from public.rms_studio_drive_actions where action_key=p_action_key for update;
  if not found then raise exception 'Drive action not found'; end if;
  if a.status='complete' then return jsonb_build_object('ok',true,'duplicate',true,'action_key',p_action_key); end if;
  update public.rms_studio_drive_actions
  set status=case when p_success then 'complete' else 'failed' end,
      error_message=case when p_success then null else left(coalesce(p_error,'Drive action failed'),1000) end,
      completed_at=now()
  where action_key=p_action_key;
  if p_success then
    if a.action_type in ('grant','change') then
      update public.rms_studio_entitlements set entitlement_status='active',drive_folder_id=a.target_folder_id,access_last_verified_at=now(),updated_at=now() where member_reference=a.member_reference;
    elsif a.action_type='revoke' then
      update public.rms_studio_entitlements set entitlement_status='archived',drive_folder_id=null,access_last_verified_at=now(),updated_at=now() where member_reference=a.member_reference;
    end if;
    update public.rms_studio_pi_events set processing_status='complete',processed_at=now() where event_key=a.source_event_key;
    update public.rms_studio_access_audit set result='complete' where event_key=a.source_event_key;
  else
    update public.rms_studio_pi_events set processing_status='failed',processed_at=now() where event_key=a.source_event_key;
    update public.rms_studio_access_audit set result='failed' where event_key=a.source_event_key;
  end if;
  return jsonb_build_object('ok',p_success,'action_key',p_action_key,'member_reference',a.member_reference,'action_type',a.action_type);
end;$function$;

create or replace view public.rms_studio_new_this_week as
select asset_id,file_name,asset_type,genre,mood,bpm,musical_key,version,membership_tier,public_preview_allowed,created_at
from public.rms_studio_assets
where created_at >= date_trunc('week',now())
  and rights_review_status='cleared'
  and commercial_use_status='cleared'
  and third_party_content_status in ('none_declared','cleared')
order by created_at desc;

create or replace view public.rms_studio_public_preview_catalog as
select asset_id,file_name,asset_type,genre,mood,bpm,musical_key,version,created_at
from public.rms_studio_assets
where membership_tier='free_preview'
  and public_preview_allowed=true
  and rights_review_status='cleared'
  and commercial_use_status='cleared'
  and third_party_content_status in ('none_declared','cleared');

revoke all on public.rms_studio_new_this_week,public.rms_studio_public_preview_catalog from public,anon,authenticated;
grant select on public.rms_studio_new_this_week,public.rms_studio_public_preview_catalog to service_role;

create or replace function public.rms_studio_prestripe_certification_snapshot()
returns jsonb
language sql
security definer
set search_path to 'pg_catalog','public'
as $function$
select jsonb_build_object(
  'generated_at',now(),
  'storage_provider','google_drive',
  'master_folder_ready',true,
  'member_library_ready',true,
  'assets_total',(select count(*) from public.rms_studio_assets),
  'free_preview_assets',(select count(*) from public.rms_studio_public_preview_catalog),
  'new_this_week_assets',(select count(*) from public.rms_studio_new_this_week),
  'pending_drive_actions',(select count(*) from public.rms_studio_drive_actions where status='pending'),
  'failed_drive_actions',(select count(*) from public.rms_studio_drive_actions where status='failed'),
  'forbidden_artist_name_rows',(select count(*) from public.rms_studio_assets where upper(file_name) like '%DAION%' or upper(file_name) like '%AURALYN%'),
  'unresolved_rights_assets',(select count(*) from public.rms_studio_assets where rights_review_status<>'cleared' or commercial_use_status<>'cleared' or third_party_content_status='review_required'),
  'stripe_wired',false,
  'local_ingest_state','AWAITING_FOUNDER_WORKSTATION_SCAN',
  'drive_permission_worker_state','AWAITING_FOLDER_PERMISSION_WORKER',
  'certification_state',case
    when (select count(*) from public.rms_studio_assets where upper(file_name) like '%DAION%' or upper(file_name) like '%AURALYN%')>0 then 'ACTION REQUIRED'
    when (select count(*) from public.rms_studio_drive_actions where status='failed')>0 then 'ACTION REQUIRED'
    else 'PRE_STRIPE_READY'
  end
);
$function$;

revoke all on function public.rms_studio_complete_drive_action(text,boolean,text),public.rms_studio_prestripe_certification_snapshot() from public,anon,authenticated;
grant execute on function public.rms_studio_complete_drive_action(text,boolean,text),public.rms_studio_prestripe_certification_snapshot() to service_role;
