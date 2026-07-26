import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';
import { initAuthGuard } from '../utils/authGuard.js';
import { getCurrentUser } from '../services/authService.js';
import { getRepairRequestById, updateRepairRequest, deleteRepairRequest } from '../services/requestService.js';

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function renderDetailsPage(request, isEditing = false) {
  return `
    <main class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <div class="section-card p-4 p-lg-5">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span class="eyebrow">Request Details</span>
                  <h1 class="h2 fw-bold mb-1">${isEditing ? 'Edit request' : request.title}</h1>
                  <p class="text-secondary mb-0">${isEditing ? 'Update the request details below.' : 'Review the full request details.'}</p>
                </div>
                <a class="btn btn-outline-secondary" href="/my-requests.html">Back</a>
              </div>

              ${isEditing ? `
                <form id="editForm" novalidate>
                  <div class="row g-3">
                    <div class="col-12">
                      <label for="title" class="form-label">Title</label>
                      <input type="text" class="form-control" id="title" value="${request.title}" required />
                    </div>
                    <div class="col-12 col-md-6">
                      <label for="category" class="form-label">Category</label>
                      <select class="form-select" id="category" required>
                        <option value="Plumbing" ${request.category === 'Plumbing' ? 'selected' : ''}>Plumbing</option>
                        <option value="Electrical" ${request.category === 'Electrical' ? 'selected' : ''}>Electrical</option>
                        <option value="Painting" ${request.category === 'Painting' ? 'selected' : ''}>Painting</option>
                        <option value="Cleaning" ${request.category === 'Cleaning' ? 'selected' : ''}>Cleaning</option>
                        <option value="General Repair" ${request.category === 'General Repair' ? 'selected' : ''}>General Repair</option>
                        <option value="Other" ${request.category === 'Other' ? 'selected' : ''}>Other</option>
                      </select>
                    </div>
                    <div class="col-12 col-md-6">
                      <label for="preferredDate" class="form-label">Preferred Date</label>
                      <input type="date" class="form-control" id="preferredDate" value="${request.preferred_date || ''}" required />
                    </div>
                    <div class="col-12">
                      <label for="description" class="form-label">Description</label>
                      <textarea class="form-control" id="description" rows="5" required>${request.description}</textarea>
                    </div>
                    <div class="col-12">
                      <label for="address" class="form-label">Address</label>
                      <input type="text" class="form-control" id="address" value="${request.address}" required />
                    </div>
                    <div class="col-12">
                      <label for="status" class="form-label">Status</label>
                      <select class="form-select" id="status" required>
                        <option value="Pending" ${request.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${request.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${request.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${request.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div class="mt-4 d-flex gap-2">
                    <button class="btn btn-primary" type="submit">Save Changes</button>
                    <button class="btn btn-outline-danger" type="button" id="deleteBtn">Delete</button>
                  </div>
                </form>
              ` : `
                <dl class="row mb-0">
                  <dt class="col-sm-4">Title</dt>
                  <dd class="col-sm-8">${request.title}</dd>
                  <dt class="col-sm-4">Category</dt>
                  <dd class="col-sm-8">${request.category}</dd>
                  <dt class="col-sm-4">Description</dt>
                  <dd class="col-sm-8">${request.description}</dd>
                  <dt class="col-sm-4">Address</dt>
                  <dd class="col-sm-8">${request.address}</dd>
                  <dt class="col-sm-4">Preferred Date</dt>
                  <dd class="col-sm-8">${request.preferred_date || 'Not set'}</dd>
                  <dt class="col-sm-4">Status</dt>
                  <dd class="col-sm-8">${request.status}</dd>
                  <dt class="col-sm-4">Created</dt>
                  <dd class="col-sm-8">${request.created_at ? new Date(request.created_at).toLocaleString() : 'Unknown'}</dd>
                </dl>
              `}
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

function showMessage(message, variant = 'danger') {
  const container = document.querySelector('.section-card');
  if (!container) return;
  const existing = container.querySelector('.alert');
  if (existing) existing.remove();
  const wrapper = document.createElement('div');
  wrapper.className = `alert alert-${variant} mt-3`;
  wrapper.innerText = message;
  container.appendChild(wrapper);
}

async function initRequestDetailsPage() {
  const allowed = await initAuthGuard();
  if (!allowed) return;

  const userRes = await getCurrentUser();
  const user = userRes?.data?.user || null;
  if (!user) return;

  const id = getQueryParam('id');
  const isEditing = getQueryParam('edit') === '1';
  const app = document.querySelector('#app');
  if (!app) return;

  const { data, error } = await getRepairRequestById(id, user.id);
  if (error || !data) {
    app.innerHTML = `
      ${renderNavbar()}
      <main class="py-5">
        <div class="container">
          <div class="section-card p-5 text-center">
            <h1 class="h5 fw-bold mb-2">Request not found</h1>
            <p class="text-secondary">${error?.message || 'The request you requested is not available.'}</p>
          </div>
        </div>
      </main>
    `;
    return;
  }

  app.innerHTML = `
    ${renderNavbar()}
    ${renderDetailsPage(data, isEditing)}
  `;

  const editForm = document.getElementById('editForm');
  if (editForm) {
    editForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const payload = {
        title: document.getElementById('title').value.trim(),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value.trim(),
        address: document.getElementById('address').value.trim(),
        preferred_date: document.getElementById('preferredDate').value,
        status: document.getElementById('status').value,
      };

      const { error } = await updateRepairRequest(id, payload, user.id);
      if (error) {
        showMessage(error.message, 'danger');
        return;
      }

      showMessage('Request updated successfully.', 'success');
      setTimeout(() => {
        window.location.href = `/request-details.html?id=${id}`;
      }, 600);
    });

    document.getElementById('deleteBtn').addEventListener('click', async () => {
      const confirmed = window.confirm('Delete this request?');
      if (!confirmed) return;
      const { error } = await deleteRepairRequest(id, user.id);
      if (error) {
        showMessage(error.message, 'danger');
        return;
      }
      window.location.href = '/my-requests.html';
    });
  }
}

initRequestDetailsPage().catch((error) => {
  console.error('[requestDetails] failed', error);
});
