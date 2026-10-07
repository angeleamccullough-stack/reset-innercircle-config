(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('membership') === 'success') {
    document.getElementById('successBanner')?.classList.add('show');
  }
})();
