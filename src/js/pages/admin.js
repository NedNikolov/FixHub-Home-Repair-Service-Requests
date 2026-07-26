import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';
import { initAuthGuard } from '../utils/authGuard.js';
import { getCurrentUser } from '../services/authService.js';
import { getCurrentUserRole, getAdminStats, getAllRequests, getAllUsers, updateRequestStatus } from '../services/adminService.js';

function getStatusBadge(status) {
  const normalized = status || 'Pending';
  const variants = {
    Pending: 'warning',
    'In Progress': 'primary',
    Completed: 'success',
    Rejected: 'danger',
  };
  return `<span class="badge bg-${variants[normalized] || 'secondary'}">${normalized}</span>`;
}

function renderAdminPage({ stats, requests, users }) {
  return `
    <main class="py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span class="eyebrow">Admin</span>
            <h1 class="h2 fw-bold mb-1">Administration dashboard</h1>
            <p class="text-secondary mb-0">Manage repair requests, review users, and track platform activity.</p>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div class="col-12 col-md-6 col-lg-3">
            <div class="section-card p-4">
              <p class="text-secondary mb-1">Total Users</p>
              <h2 class="h3 fw-bold mb-0">${stats.totalUsers}</h2>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="section-card p-4">
              <p class="text-secondary mb-1">Total Requests</p>
              <h2 class="h3 fw-bold mb-0">${stats.totalRequests}</h2>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="section-card p-4">
              <p class="text-secondary mb-1">Pending Requests</p>
              <h2 class="h3 fw-bold mb-0">${stats.pendingRequests}</h2>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="section-card p-4">
              <p class="text-secondary mb-1">Completed Requests</p>
              <h2 class="h3 fw-bold mb-0">${stats.completedRequests}</h2>
            </div>
          </div>
        </div>

        <div class="section-card p-4 mb-4">
          <div class="row g-3 align-items-end">
            <div class="col-12 col-md-6">
              <label for="searchInput" class="form-label">Search requests</label>
              <input type="text" id="searchInput" class="form-control" placeholder="Search title, description, or address" />
            </div>
            <div class="col-12 col-md-4">
              <label for="statusFilter" class="form-label">Filter by status</label>
              <select id="statusFilter" class="form-select">
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <button id="applyFiltersBtn" class="btn btn-primary w-100">Apply</button>
            </div>
          </div>
        </div>

        <div class="section-card p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h5 fw-bold mb-0">Repair Requests</h2>
          </div>
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${requests.length ? requests.map((request) => `
                  <tr>
                    <td>${request.title}</td>
                    <td>${request.user_id || 'Unknown'}</td>
                    <td>${getStatusBadge(request.status)}</td>
                    <td>${request.category}</td>
                    <td>${request.created_at ? new Date(request.created_at).toLocaleString() : 'Unknown'}</td>
                    <td>
                      <select class="form-select form-select-sm status-select" data-id="${request.id}">
                        <option value="Pending" ${request.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${request.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${request.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Rejected" ${request.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                      </select>
                    </td>
                  </tr>
                `).join('') : `<tr><td colspan="6" class="text-center text-secondary">No requests found.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-card p-4">
          <h2 class="h5 fw-bold mb-3">Registered Users</h2>
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                ${users.length ? users.map((user) => `
                  <tr>
                    <td>${user.full_name || user.id || 'Unknown'}</td>
                    <td><span class="badge bg-secondary">${user.role || 'user'}</span></td>
                    <td>${user.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown'}</td>
                  </tr>
                `).join('') : `<tr><td colspan="3" class="text-center text-secondary">No users found.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  `;
}

async function loadAdminData(search = '', status = '') {
  const app = document.querySelector('#app');
  if (!app) return;

  const [{ data: statsData }, { data: requestsData }, { data: usersData }] = await Promise.all([
    getAdminStats(),
    getAllRequests({ search, status }),
    getAllUsers(),
  ]);

  app.innerHTML = `
    ${renderNavbar()}
    ${renderAdminPage({ stats: statsData || { totalUsers: 0, totalRequests: 0, pendingRequests: 0, completedRequests: 0 }, requests: requestsData || [], users: usersData || [] })}
  `;

  document.querySelectorAll('.status-select').forEach((select) => {
    select.addEventListener('change', async (event) => {
      const id = event.target.getAttribute('data-id');
      const statusValue = event.target.value;
      const { error } = await updateRequestStatus(id, statusValue);
      if (error) {
        window.alert(error.message);
        return;
      }
      window.location.reload();
    });
  });
}

async function initAdminPage() {
  const allowed = await initAuthGuard();
  if (!allowed) return;

  const userRes = await getCurrentUser();
  const user = userRes?.data?.user || null;
  if (!user) return;

  const { data, error } = await getCurrentUserRole(user.id);
  if (error || !data || data.role !== 'admin') {
    window.location.href = '/dashboard.html';
    return;
  }

  const app = document.querySelector('#app');
  if (!app) return;

  app.innerHTML = `
    ${renderNavbar()}
    <main class="py-5">
      <div class="container">
        <div class="section-card p-5 text-center">
          <div class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
          <h1 class="h3 fw-bold mb-2">Loading admin dashboard</h1>
          <p class="text-secondary mb-0">Checking your access and preparing the admin tools.</p>
        </div>
      </div>
    </main>
  `;

  await loadAdminData();

  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const applyFiltersBtn = document.getElementById('applyFiltersBtn');

  applyFiltersBtn?.addEventListener('click', async () => {
    await loadAdminData(searchInput?.value || '', statusFilter?.value || '');
  });
}

initAdminPage().catch((error) => {
  console.error('[admin] failed', error);
});
