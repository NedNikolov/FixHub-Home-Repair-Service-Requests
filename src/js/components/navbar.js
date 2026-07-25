const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function renderNavbar() {
  const linksMarkup = navLinks
    .map(
      (link) => `
        <li class="nav-item">
          <a class="nav-link" href="${link.href}">${link.label}</a>
        </li>
      `,
    )
    .join('');

  return `
    <header class="sticky-top">
      <nav class="navbar navbar-expand-lg navbar-light py-3">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center gap-2" href="#home">
            <span class="brand-badge"><i class="bi bi-hammer"></i></span>
            <span>FixHub</span>
          </a>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#primaryNav"
            aria-controls="primaryNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="primaryNav">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1 mb-3 mb-lg-0">
              ${linksMarkup}
            </ul>

            <div class="d-flex flex-column flex-lg-row gap-2 ms-lg-3">
              <a class="btn btn-outline-dark rounded-pill px-4" href="/login.html">Login</a>
              <a class="btn btn-dark rounded-pill px-4" href="/register.html">Register</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `;
}
