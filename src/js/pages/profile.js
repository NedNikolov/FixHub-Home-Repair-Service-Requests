import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';
import { getCurrentUser } from '../services/authService.js';
import { changePassword, updateProfile } from '../services/profileService.js';
import { initAuthGuard } from '../utils/authGuard.js';

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);

function displayName(user) {
  return user?.user_metadata?.fullName || user?.user_metadata?.name || '';
}

function renderProfile(user) {
  const name = displayName(user);
  const avatar = user?.user_metadata?.avatar_url;
  const initials = (name || user.email || 'U').trim().slice(0, 1).toUpperCase();
  return `
    ${renderNavbar()}
    <main class="py-5 profile-page">
      <div class="container">
        <div class="mb-4 mb-lg-5">
          <span class="eyebrow">Account</span>
          <h1 class="h2 fw-bold mb-1">Your profile</h1>
          <p class="text-secondary mb-0">Manage your details, profile photo, and password.</p>
        </div>
        <div id="profileAlert" aria-live="polite"></div>
        <div class="row g-4">
          <div class="col-12 col-lg-7">
            <section class="section-card p-4 p-lg-5" aria-labelledby="profileDetailsTitle">
              <h2 id="profileDetailsTitle" class="h4 fw-bold mb-4">Profile details</h2>
              <form id="profileForm" novalidate>
                <div class="d-flex align-items-center gap-3 mb-4">
                  <div id="avatarPreview" class="profile-avatar" aria-label="Profile picture preview">
                    ${avatar ? `<img src="${escapeHtml(avatar)}" alt="Current profile picture" />` : `<span aria-hidden="true">${escapeHtml(initials)}</span>`}
                  </div>
                  <div>
                    <label for="avatar" class="form-label mb-1">Profile picture</label>
                    <input class="form-control" type="file" id="avatar" accept="image/*" aria-describedby="avatarHelp" />
                    <div id="avatarHelp" class="form-text">JPG, PNG, or another image format.</div>
                  </div>
                </div>
                <div class="mb-4">
                  <label for="fullName" class="form-label">Full name</label>
                  <input class="form-control" type="text" id="fullName" value="${escapeHtml(name)}" autocomplete="name" required />
                  <div class="invalid-feedback">Please enter your full name.</div>
                </div>
                <button class="btn btn-primary" type="submit">Save profile</button>
              </form>
            </section>
          </div>
          <div class="col-12 col-lg-5">
            <section class="section-card p-4 h-100" aria-labelledby="accountInfoTitle">
              <h2 id="accountInfoTitle" class="h4 fw-bold mb-4">Account information</h2>
              <dl class="account-details mb-0">
                <div><dt>Email address</dt><dd>${escapeHtml(user.email || 'Not available')}</dd></div>
                <div><dt>Account created</dt><dd>${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}</dd></div>
                <div><dt>Last sign in</dt><dd>${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Not available'}</dd></div>
              </dl>
            </section>
          </div>
          <div class="col-12" id="security">
            <section class="section-card p-4 p-lg-5" aria-labelledby="passwordTitle">
              <h2 id="passwordTitle" class="h4 fw-bold mb-2">Change password</h2>
              <p class="text-secondary mb-4">Choose a strong password with at least 8 characters.</p>
              <form id="passwordForm" class="row g-3" novalidate>
                <div class="col-12 col-md-6">
                  <label for="newPassword" class="form-label">New password</label>
                  <input class="form-control" type="password" id="newPassword" minlength="8" autocomplete="new-password" required />
                  <div class="invalid-feedback">Use at least 8 characters.</div>
                </div>
                <div class="col-12 col-md-6">
                  <label for="confirmPassword" class="form-label">Confirm new password</label>
                  <input class="form-control" type="password" id="confirmPassword" minlength="8" autocomplete="new-password" required />
                  <div class="invalid-feedback">Passwords must match.</div>
                </div>
                <div class="col-12"><button class="btn btn-outline-primary" type="submit">Update password</button></div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>`;
}

function showAlert(message, variant) {
  const region = document.getElementById('profileAlert');
  if (region) region.innerHTML = `<div class="alert alert-${variant}" role="alert">${escapeHtml(message)}</div>`;
}

function initialiseForms() {
  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');
  const avatarInput = document.getElementById('avatar');
  avatarInput?.addEventListener('change', () => {
    const file = avatarInput.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    document.getElementById('avatarPreview').innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Selected profile picture preview" />`;
  });
  profileForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!profileForm.checkValidity()) { profileForm.classList.add('was-validated'); return; }
    const button = profileForm.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Saving...';
    const result = await updateProfile({ fullName: document.getElementById('fullName').value, avatarFile: avatarInput.files?.[0] });
    button.disabled = false; button.textContent = 'Save profile';
    showAlert(result.message || result.error?.message, result.error ? 'danger' : 'success');
  });
  passwordForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = document.getElementById('newPassword');
    const confirmation = document.getElementById('confirmPassword');
    confirmation.setCustomValidity(password.value === confirmation.value ? '' : 'Passwords do not match');
    if (!passwordForm.checkValidity()) { passwordForm.classList.add('was-validated'); return; }
    const button = passwordForm.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Updating...';
    const result = await changePassword(password.value);
    button.disabled = false; button.textContent = 'Update password';
    if (!result.error) passwordForm.reset();
    showAlert(result.message || result.error?.message, result.error ? 'danger' : 'success');
  });
}

async function initProfilePage() {
  const allowed = await initAuthGuard();
  if (!allowed) return;
  const { data } = await getCurrentUser();
  if (!data?.user) { window.location.href = '/login.html'; return; }
  document.querySelector('#app').innerHTML = renderProfile(data.user);
  initialiseForms();
}

initProfilePage().catch((error) => { console.error('[profile] failed', error); window.location.href = '/login.html'; });
