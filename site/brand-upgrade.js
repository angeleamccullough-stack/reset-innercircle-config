(() => {
  const brand = document.querySelector('.brand');
  if (brand && !brand.querySelector('.official-brand-logo')) {
    brand.innerHTML = `<img class="official-brand-logo" src="/reset-inner-circle-logo.svg" alt="Reset Inner Circle — Be You On Purpose" width="240" height="127">`;
    brand.classList.add('brand-official');
  }

  const footer = document.querySelector('footer .footer');
  if (footer && !footer.querySelector('.footer-brand-system')) {
    footer.innerHTML = `
      <div class="footer-brand-system">
        <a href="#top" class="footer-logo soundable" aria-label="Reset Inner Circle home">
          <img src="/reset-inner-circle-logo.svg" alt="Reset Inner Circle — Be You On Purpose" width="240" height="127">
        </a>
        <p>Reset Society | Be You On Purpose ✨ Remember · Embody · Stand · Elevate · Truth.</p>
      </div>
      <nav class="footer-links" aria-label="Footer shortcuts">
        <a class="soundable track" data-event="footer_network_click" data-placement="footer" href="#network">Network</a>
        <a class="soundable track" data-event="footer_studio_click" data-placement="footer" href="#studio">Studio</a>
        <a class="soundable track" data-event="footer_services_click" data-placement="footer" href="#services">Services</a>
      </nav>
      <div class="owner">Stewarded by<br><strong>Angelea McCullough, Founder of RMS Global Publishing</strong></div>`;
  }

  if (!document.querySelector('script[src="/studio-upgrade.js"]')) {
    const script = document.createElement('script');
    script.src = '/studio-upgrade.js';
    script.defer = true;
    document.body.appendChild(script);
  }
})();