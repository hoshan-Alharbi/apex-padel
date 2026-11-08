import { FOOTER, NAV, SITE } from '@/lib/site';

import { Logo } from '../Logo';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="nav-pill">
          <a href="#top" className="brand" aria-label={SITE.name}>
            <Logo size={30} />
            <span>{SITE.name}</span>
          </a>
          <nav className="site-nav" aria-label="أقسام الصفحة">
            <a href="#features" className="nav-link">
              {NAV.features}
            </a>
            <a href="#split" className="nav-link">
              {NAV.split}
            </a>
            <a href="#how" className="nav-link">
              {NAV.how}
            </a>
            <a href="#download" className="btn btn-primary btn-small">
              {NAV.download}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-row">
          <a href="#top" className="brand">
            <Logo size={28} />
            <span>{SITE.name}</span>
          </a>
          <nav className="footer-links" aria-label="روابط الصفحة">
            <a href="#features">{NAV.features}</a>
            <a href="#split">{NAV.split}</a>
            <a href="#how">{NAV.how}</a>
            <a href="#download">{NAV.download}</a>
          </nav>
        </div>
        <div className="footer-meta">
          <span>{FOOTER.rights}</span>
          <span>{FOOTER.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
