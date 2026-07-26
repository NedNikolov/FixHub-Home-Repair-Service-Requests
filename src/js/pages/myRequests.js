import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';
import { initAuthGuard } from '../utils/authGuard.js';
import { getCurrentUser } from '../services/authService.js';
import { getMyRepairRequests, deleteRepairRequest } from '../services/requestService.js';

function renderRequestsPage(requests) {
  return `
    <main class="py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span class="eyebrow">My Requests</span>
            <h1 class="h2 fw-bold mb-1">Your repair requests</h1>
            <p class="text-secondary mb-0">Review, edit, or remove requests you submitted.</p>
          </div>
          <a class="btn btn-primary" href="/create-request.html">Create request</a>
        </div>

        ${requests.length ? `
          <div class="row g-4">
            ${requests.map((request) => `
              <div class="col-12 col-lg-6">
                <article class="section-card p-4 h-100">
                  <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <h2 class="h5 fw-bold mb-1">${request.title}</h2>
                      <p class="text-secondary mb-0">${request.category}</p>
                    </div>
                    <span class="badge text-bg-primary">${request.status}</span>
                  </div>
                  <p class="text-secondary mb-3">${request.description}</p>
                  <ul class="list-unstyled small text-secondary mb-3">
                    <li><strong>Address:</strong> ${request.address}</li>
                    <li><strong>Preferred date:</strong> ${request.preferred_date || 'Not set'}</li>
                    <li><strong>Created:</strong> ${request.created_at ? new Date(request.created_at).toLocaleString() : 'Unknown'}</li>
                  </ul>
                  <div class="d-flex gap-2">
                    <a class="btn btn-outline-primary btn-sm" href="/request-details.html?id=${request.id}">View</a>
                    <a class="btn btn-outline-secondary btn-sm" href="/request-details.html?id=${request.id}&edit=1">Edit</a>
                    <button class="btn btn-outline-danger btn-sm delete-request-btn" data-id="${request.id}">Delete</button>
                  </div>
                </article>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="section-card p-5 text-center">
            <h2 class="h5 fw-bold mb-2">No requests yet</h2>
            <p class="text-secondary mb-3">You have not created any repair requests yet.</p>
            <a class="btn btn-primary" href="/create-request.html">Create your first request</a>
          </div>
        `}
      </div>
    </main>
  `;
}

async function initMyRequestsPage() {
  const allowed = await initAuthGuard();
  if (!allowed) return;

  const userRes = await getCurrentUser();
  const user = userRes?.data?.user || null;
  if (!user) return;

  const app = document.querySelector('#app');
  if (!app) return;

  const { data, error } = await getMyRepairRequests(user.id);
  if (error) {
    app.innerHTML = `
      ${renderNavbar()}
      <main class="py-5">
        <div class="container">
          <div class="section-card p-5 text-center">
            <h1 class="h5 fw-bold mb-2">Unable to load requests</h1>
            <p class="text-secondary">${error.message}</p>
          </div>
        </div>
      </main>
    `;
    return;
  }

  app.innerHTML = `
    ${renderNavbar()}
    ${renderRequestsPage(data || [])}
  `;

  document.querySelectorAll('.delete-request-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      if (!id) return;
      const confirmed = window.confirm('Delete this request?');
      if (!confirmed) return;
      const { error } = await deleteRepairRequest(id, user.id);
      if (error) {
        window.alert(error.message);
        return;
      }
      window.location.reload();
    });
  });
}

initMyRequestsPage().catch((error) => {
  console.error('[myRequests] failed', error);
});
