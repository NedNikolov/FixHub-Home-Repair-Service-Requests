import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';
import { getCurrentUser, getSession, logout } from '../services/authService.js';
import { initAuthGuard } from '../utils/authGuard.js';

async function renderDashboard() {
  const app = document.querySelector('#app');
  if (!app) return;

  app.innerHTML = `
    ${renderNavbar()}
    <main class="py-5">
      <div class="container">
        <div id="status" class="mb-4"></div>
        <div class="section-card p-4">
          <h2 class="mb-3">Dashboard</h2>
          <p class="text-secondary">Manage your FixHub account and service requests.</p>

          <div id="userInfo" class="mt-4"></div>

          <div class="mt-4">
            <button id="logoutBtn" class="btn btn-outline-dark">Logout</button>
          </div>
        </div>
      </div>
    </main>
  `;

  const status = document.getElementById('status');
  status.innerHTML = '<div class="text-secondary">Checking authentication...</div>';

  try {
    const sessionRes = await getSession();
    const userRes = await getCurrentUser();

    if (sessionRes?.data?.session == null && userRes?.data?.user == null) {
      // Not authenticated -> redirect to login
      window.location.href = '/login.html';
      return;
    }

    const user = userRes?.data?.user || sessionRes?.data?.session?.user;
    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `
      <p><strong>Name:</strong> ${user?.user_metadata?.fullName || user?.email || '—'}</p>
      <p><strong>Email:</strong> ${user?.email || '—'}</p>
    `;

    status.innerHTML = '<div class="text-success">Authenticated</div>';
  } catch (err) {
    status.innerHTML = '<div class="text-danger">Error checking session. Redirecting to login...</div>';
    setTimeout(() => (window.location.href = '/login.html'), 900);
    return;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', async () => {
    await logout();
    window.location.href = '/login.html';
  });
}

// initialize auth guard and then render dashboard content
Promise.resolve().then(() => initAuthGuard().then(renderDashboard).catch((e) => { console.error(e); renderDashboard(); }));
