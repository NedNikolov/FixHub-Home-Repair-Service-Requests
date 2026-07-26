const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

let currentUser = null;

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

  queueMicrotask(() => updateNavbarForAuth(currentUser));

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
            <ul id="primaryNavList" class="navbar-nav ms-auto align-items-lg-center gap-lg-1 mb-3 mb-lg-0">
              ${linksMarkup}
            </ul>

            <div id="navAuthArea" class="d-flex flex-column flex-lg-row gap-2 ms-lg-3">
              <a class="btn btn-outline-dark rounded-pill px-4" href="/login.html">Login</a>
              <a class="btn btn-dark rounded-pill px-4" href="/register.html">Register</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `;
}

export function updateNavbarForAuth(user) {
  currentUser = user || null;
  const navList = document.getElementById('primaryNavList');
  const authArea = document.getElementById('navAuthArea');
  if (!navList || !authArea) return;

  // Update main nav links
  if (user) {
    navList.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="/dashboard.html">Dashboard</a></li>
      <li class="nav-item"><a class="nav-link" href="/my-requests.html">My Requests</a></li>
      <li class="nav-item"><a class="nav-link" href="/create-request.html">Create Request</a></li>
      <li class="nav-item"><a class="nav-link" href="/profile.html">Profile</a></li>
      <li class="nav-item"><a class="nav-link" href="/admin.html">Admin</a></li>
    `;

    authArea.innerHTML = `
      <button id="nav-logout" class="btn btn-outline-dark rounded-pill px-4">Logout</button>
    `;

    // attach logout handler via event delegation if present
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
      // leave actual handler to authGuard to attach, but expose the button
    }
  } else {
    navList.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="/index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
      <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
      <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
    `;

    authArea.innerHTML = `
      <a class="btn btn-outline-dark rounded-pill px-4" href="/login.html">Login</a>
      <a class="btn btn-dark rounded-pill px-4" href="/register.html">Register</a>
    `;
  }
}
