import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';
import { getCurrentUser, getSession } from '../services/authService.js';
import { initAuthGuard } from '../utils/authGuard.js';

const dashboardCards = [
  {
    sectionId: 'my-repair-requests',
    icon: 'bi-journal-text',
    title: 'My Repair Requests',
    description: 'Review the status, history, and notes for your submitted repair requests.',
    href: '/dashboard.html#my-repair-requests',
    buttonLabel: 'View requests',
  },
  {
    sectionId: 'create-new-request',
    icon: 'bi-plus-circle',
    title: 'Create New Request',
    description: 'Start a new repair request and add details when you are ready.',
    href: '/dashboard.html#create-new-request',
    buttonLabel: 'Start request',
  },
  {
    sectionId: 'profile',
    icon: 'bi-person-badge',
    title: 'Profile',
    description: 'Check your personal information and keep your account details up to date.',
    href: '/dashboard.html#profile',
    buttonLabel: 'Open profile',
  },
  {
    sectionId: 'account-settings',
    icon: 'bi-gear',
    title: 'Account Settings',
    description: 'Manage security preferences, notification settings, and account options.',
    href: '/dashboard.html#account-settings',
    buttonLabel: 'Open settings',
  },
];

function getDisplayName(user) {
  return user?.user_metadata?.fullName || user?.user_metadata?.name || user?.email || 'there';
}

function renderDashboard(user) {
  const app = document.querySelector('#app');
  if (!app) return;

  const displayName = getDisplayName(user);
  const dashboardCardsMarkup = dashboardCards
    .map(
      (card) => `
        <div class="col-12 col-md-6 col-xl-3">
          <article class="feature-card h-100 hover-lift dashboard-card">
            <div class="card-icon mb-3"><i class="bi ${card.icon}"></i></div>
            <h2 class="h4 fw-bold mb-2">${card.title}</h2>
            <p class="text-secondary mb-4">${card.description}</p>
            <a class="btn btn-outline-primary mt-auto align-self-start" href="${card.href}">${card.buttonLabel}</a>
          </article>
        </div>
      `,
    )
    .join('');

  const dashboardPlaceholdersMarkup = dashboardCards
    .map(
      (card) => `
        <div class="col-12 col-lg-6" id="${card.sectionId}">
          <section class="section-card h-100">
            <p class="text-uppercase text-secondary small fw-semibold mb-2">${card.title}</p>
            <h2 class="h4 fw-bold mb-3">Coming soon</h2>
            <p class="text-secondary mb-0">
              This section will host the ${card.title.toLowerCase()} workflow in a future update.
            </p>
          </section>
        </div>
      `,
    )
    .join('');

  app.innerHTML = `
    ${renderNavbar()}
    <main class="py-5 dashboard-page">
      <div class="container">
        <section class="section-card mb-4 mb-lg-5 dashboard-hero">
          <div class="row align-items-center g-4">
            <div class="col-lg-8">
              <span class="eyebrow">Dashboard</span>
              <h1 class="hero-title h2 fw-bold mb-3">Welcome back, ${displayName}</h1>
              <p class="text-secondary mb-0">
                Manage your FixHub account, keep track of repair requests, and adjust your profile from one place.
              </p>
            </div>
            <div class="col-lg-4">
              <div class="section-card dashboard-summary h-100">
                <p class="text-uppercase text-secondary small fw-semibold mb-2">Signed in as</p>
                <p class="h5 fw-bold mb-1">${displayName}</p>
                <p class="text-secondary mb-0">${user?.email || 'No email available'}</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Dashboard quick actions">
          <div class="row g-4">
            ${dashboardCardsMarkup}
          </div>
        </section>

        <section class="mt-4 mt-lg-5" aria-label="Dashboard placeholders">
          <div class="row g-4">
            ${dashboardPlaceholdersMarkup}
          </div>
        </section>
      </div>
    </main>
  `;
}

async function bootstrapDashboard() {
  const app = document.querySelector('#app');
  if (!app) return;

  app.innerHTML = `
    ${renderNavbar()}
    <main class="py-5">
      <div class="container">
        <div class="section-card py-5 text-center">
          <div class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
          <h1 class="h3 fw-bold mb-2">Loading dashboard</h1>
          <p class="text-secondary mb-0">Checking your session and preparing your account overview.</p>
        </div>
      </div>
    </main>
  `;

  const allowed = await initAuthGuard();
  if (!allowed) return;

  const sessionRes = await getSession();
  const userRes = await getCurrentUser();
  const user = userRes?.data?.user || sessionRes?.data?.session?.user || null;

  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  renderDashboard(user);
}

bootstrapDashboard().catch((error) => {
  console.error('[dashboard] failed to render', error);
  window.location.href = '/login.html';
});

export { renderDashboard };
