import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';
import { initAuthGuard } from '../utils/authGuard.js';
import { getCurrentUser } from '../services/authService.js';
import { getRepairRequestById, updateRepairRequest, deleteRepairRequest, getRepairRequestImages } from '../services/requestService.js';
import { uploadRepairRequestImages, deleteRepairRequestImage } from '../services/storageService.js';

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function renderDetailsPage(request, isEditing = false, images = []) {
  const imagesMarkup = images.length
    ? `
        <div class="mt-4">
          <h2 class="h6 fw-bold mb-3">Uploaded Images</h2>
          <div class="row g-3">
            ${images
              .map(
                (image) => `
                  <div class="col-12 col-md-6">
                    <div class="border rounded p-2 h-100">
                      <img src="${image.image_url}" alt="Repair request image" class="img-fluid rounded" style="height: 180px; object-fit: cover; width: 100%;" />
                      <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="small text-secondary">${image.storage_path || 'Image'}</span>
                        <button class="btn btn-outline-danger btn-sm delete-image-btn" data-id="${image.id}">Delete</button>
                      </div>
                    </div>
                  </div>
                `,
              )
              .join('')}
          </div>
        </div>
      `
    : `
        <div class="mt-4">
          <h2 class="h6 fw-bold mb-2">Uploaded Images</h2>
          <p class="text-secondary mb-0">No images have been uploaded for this request yet.</p>
        </div>
      `;

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

              ${imagesMarkup}

              <div class="mt-4 border-top pt-4">
                <h2 class="h6 fw-bold mb-2">Upload More Images</h2>
                <p class="text-secondary small">Select image files to attach to this request.</p>
                <form id="imageUploadForm" novalidate>
                  <input type="file" id="imageInput" class="form-control" accept="image/*" multiple />
                  <div id="imageUploadPreview" class="row g-3 mt-2"></div>
                  <button class="btn btn-primary mt-3" type="submit">Upload Images</button>
                </form>
              </div>
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

  const { data: imagesData } = await getRepairRequestImages(id, user.id);

  app.innerHTML = `
    ${renderNavbar()}
    ${renderDetailsPage(data, isEditing, imagesData || [])}
  `;

  const editForm = document.getElementById('editForm');
  const imageInput = document.getElementById('imageInput');
  const imageUploadPreview = document.getElementById('imageUploadPreview');

  if (imageInput && imageUploadPreview) {
    imageInput.addEventListener('change', () => {
      const files = Array.from(imageInput.files || []);
      imageUploadPreview.innerHTML = files.length
        ? files
            .map(
              (file) => `
                <div class="col-6 col-md-4">
                  <div class="border rounded p-2">
                    <img src="${URL.createObjectURL(file)}" alt="Preview" class="img-fluid rounded" style="height: 100px; object-fit: cover; width: 100%;" />
                    <p class="small text-secondary mt-2 mb-0">${file.name}</p>
                  </div>
                </div>
              `,
            )
            .join('')
        : '<p class="text-secondary small mb-0">No images selected yet.</p>';
    });
  }

  const imageUploadForm = document.getElementById('imageUploadForm');
  if (imageUploadForm) {
    imageUploadForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const files = Array.from(imageInput?.files || []);
      if (!files.length) {
        showMessage('Please select at least one image.', 'warning');
        return;
      }

      const { error, message } = await uploadRepairRequestImages(files, id, user.id);
      if (error) {
        showMessage(message || error.message, 'danger');
        return;
      }

      showMessage('Images uploaded successfully.', 'success');
      imageUploadForm.reset();
      if (imageUploadPreview) imageUploadPreview.innerHTML = '';
      window.location.reload();
    });
  }

  document.querySelectorAll('.delete-image-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const imageId = button.getAttribute('data-id');
      if (!imageId) return;
      const confirmed = window.confirm('Delete this image?');
      if (!confirmed) return;

      const { error, message } = await deleteRepairRequestImage(imageId, user.id);
      if (error) {
        showMessage(message || error.message, 'danger');
        return;
      }

      showMessage('Image deleted successfully.', 'success');
      window.location.reload();
    });
  });

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
