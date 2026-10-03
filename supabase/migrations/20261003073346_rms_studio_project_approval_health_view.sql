
CREATE VIEW public.rms_studio_project_approval_health WITH (security_invoker=true) AS
SELECT r.id AS request_id,r.request_reference,r.service_key,r.request_status,r.payment_status,
 a.approval_id,a.decision AS latest_approval_decision,
 (a.decision='approved' AND a.service_key_snapshot=r.service_key AND a.quoted_price_cents_snapshot IS NOT DISTINCT FROM r.quoted_price_cents AND a.currency_snapshot=r.currency AND (a.expires_at IS NULL OR a.expires_at>now()) AND c.active AND c.founder_approved) IS TRUE AS approval_current,
 CASE WHEN a.approval_id IS NULL THEN 'awaiting_project_approval'
 WHEN a.decision<>'approved' THEN a.decision
 WHEN a.expires_at<=now() THEN 'approval_expired'
 WHEN a.service_key_snapshot IS DISTINCT FROM r.service_key OR a.quoted_price_cents_snapshot IS DISTINCT FROM r.quoted_price_cents OR a.currency_snapshot IS DISTINCT FROM r.currency THEN 'approval_scope_changed'
 WHEN NOT c.active OR NOT c.founder_approved THEN 'catalog_not_approved'
 WHEN r.quoted_price_cents>0 AND (r.payment_status<>'paid' OR (r.stripe_checkout_session_id IS NULL AND r.stripe_payment_intent_id IS NULL)) THEN 'awaiting_payment_reconciliation'
 WHEN r.request_status='delivered' AND nullif(btrim(r.delivery_evidence_reference),'') IS NULL THEN 'delivery_evidence_missing'
 ELSE 'approval_requirements_met' END AS approval_health
FROM public.rms_studio_service_requests r
JOIN public.rms_studio_service_catalog c USING(service_key)
LEFT JOIN LATERAL (SELECT * FROM public.rms_studio_project_approval_events e WHERE e.request_id=r.id ORDER BY e.approval_id DESC LIMIT 1) a ON true;
REVOKE ALL ON public.rms_studio_project_approval_health FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.rms_studio_project_approval_health TO service_role;
