import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';
import { initAuthGuard } from '../utils/authGuard.js';
import { createRepairRequest } from '../services/requestService.js';
import { getCurrentUser } from '../services/authService.js';

function renderCreateRequestPage() {
  return `
    <main class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <div class="section-card p-4 p-lg-5">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span class="eyebrow">New Request</span>
                  <h1 class="h2 fw-bold mb-1">Create a repair request</h1>
                  <p class="text-secondary mb-0">Share the details of the issue so the right help can be arranged.</p>
                </div>
                <a class="btn btn-outline-secondary" href="/my-requests.html">View my requests</a>
              </div>

              <form id="requestForm" novalidate>
                <div class="row g-3">
                  <div class="col-12">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="title" required />
                    <div class="invalid-feedback">Please provide a title.</div>
                  </div>
                  <div class="col-12 col-md-6">
                    <label for="category" class="form-label">Category</label>
                    <select class="form-select" id="category" required>
                      <option value="">Select a category</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Painting">Painting</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="General Repair">General Repair</option>
                      <option value="Other">Other</option>
                    </select>
                    <div class="invalid-feedback">Please choose a category.</div>
                  </div>
                  <div class="col-12 col-md-6">
                    <label for="preferredDate" class="form-label">Preferred Date</label>
                    <input type="date" class="form-control" id="preferredDate" required />
                    <div class="invalid-feedback">Please select a preferred date.</div>
                  </div>
                  <div class="col-12">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" rows="5" required></textarea>
                    <div class="invalid-feedback">Please describe the problem.</div>
                  </div>
                  <div class="col-12">
                    <label for="address" class="form-label">Address</label>
                    <input type="text" class="form-control" id="address" required />
                    <div class="invalid-feedback">Please provide an address.</div>
                  </div>
                  <div class="col-12">
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="status" required>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div class="mt-4 d-flex gap-2">
                  <button class="btn btn-primary" type="submit">Create Request</button>
                  <a class="btn btn-outline-secondary" href="/my-requests.html">Cancel</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

function showAlert(message, variant = 'danger') {
  const form = document.getElementById('requestForm');
  if (!form) return;
  const existing = form.querySelector('.alert');
  if (existing) existing.remove();
  const wrapper = document.createElement('div');
  wrapper.className = `alert alert-${variant} mt-3`;
  wrapper.innerText = message;
  form.appendChild(wrapper);
}

async function initCreateRequestPage() {
  const allowed = await initAuthGuard();
  if (!allowed) return;

  const userRes = await getCurrentUser();
  const user = userRes?.data?.user || null;
  if (!user) return;

  const app = document.querySelector('#app');
  if (!app) return;

  app.innerHTML = `
    ${renderNavbar()}
    ${renderCreateRequestPage()}
  `;

  const form = document.getElementById('requestForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const payload = {
      title: document.getElementById('title').value.trim(),
      category: document.getElementById('category').value,
      description: document.getElementById('description').value.trim(),
      address: document.getElementById('address').value.trim(),
      preferred_date: document.getElementById('preferredDate').value,
      status: document.getElementById('status').value,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    const { error, message } = await createRepairRequest(payload);
    if (error) {
      showAlert(message || error.message, 'danger');
      return;
    }

    showAlert('Repair request created successfully.', 'success');
    form.reset();
    setTimeout(() => {
      window.location.href = '/my-requests.html';
    }, 800);
  });
}

initCreateRequestPage().catch((error) => {
  console.error('[createRequest] failed', error);
});
