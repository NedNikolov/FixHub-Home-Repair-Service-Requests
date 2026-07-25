import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';

function renderRegisterForm() {
  return `
    <section class="py-5 d-flex align-items-center" style="min-height: calc(100vh - 80px);">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="section-card p-4">
              <h2 class="mb-3">Create your account</h2>
              <p class="text-secondary mb-4">Join FixHub to manage service requests and connect with local professionals.</p>

              <form id="registerForm" novalidate>
                <div class="mb-3">
                  <label for="fullName" class="form-label">Full Name</label>
                  <div class="input-group has-validation">
                    <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                    <input type="text" class="form-control" id="fullName" name="fullName" placeholder="Your full name" required />
                    <div class="invalid-feedback">Please enter your full name.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group has-validation">
                    <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
                    <input type="email" class="form-control" id="email" name="email" placeholder="you@example.com" required />
                    <div class="invalid-feedback">Please provide a valid email.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group has-validation">
                    <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                    <input type="password" class="form-control" id="password" name="password" placeholder="Create a password" minlength="8" required />
                    <button type="button" class="btn btn-outline-secondary input-group-text password-toggle" data-target="#password" aria-label="Toggle password visibility">
                      <i class="bi bi-eye"></i>
                    </button>
                    <div class="invalid-feedback">Password must be at least 8 characters.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <div class="input-group has-validation">
                    <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                    <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="Repeat your password" minlength="8" required />
                    <button type="button" class="btn btn-outline-secondary input-group-text password-toggle" data-target="#confirmPassword" aria-label="Toggle password visibility">
                      <i class="bi bi-eye"></i>
                    </button>
                    <div class="invalid-feedback">Passwords must match.</div>
                  </div>
                </div>

                <div class="d-grid">
                  <button class="btn btn-primary btn-lg" type="submit">Create account</button>
                </div>

                <p class="text-center text-secondary mt-3 mb-0">Already have an account? <a href="#login">Login</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function initFormBehavior() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  // Password visibility toggles
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-target');
      const input = document.querySelector(targetSelector);
      if (!input) return;
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      const icon = btn.querySelector('i');
      if (icon) icon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
    });
  });

  // Real-time validation for password match
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  function validatePasswordMatch() {
    if (!password || !confirmPassword) return true;
    if (confirmPassword.value === '') {
      confirmPassword.setCustomValidity('');
      return true;
    }
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity('Passwords do not match');
      return false;
    }
    confirmPassword.setCustomValidity('');
    return true;
  }

  password.addEventListener('input', () => {
    validatePasswordMatch();
  });
  confirmPassword.addEventListener('input', () => {
    validatePasswordMatch();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    validatePasswordMatch();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // At this stage, client-side validation passed.
    // Do not connect to Supabase yet — placeholder behavior.
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Creating account...';
    }

    // Simulate success and reset form state
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Create account';
      }
      form.reset();
      form.classList.remove('was-validated');
      alert('Registration simulated — no backend connected.');
    }, 750);
  });
}

const app = document.querySelector('#app');
if (app) {
  app.innerHTML = `
    ${renderNavbar()}
    <main>
      ${renderRegisterForm()}
    </main>
  `;

  // init behavior after DOM injection
  initFormBehavior();
}

export { renderRegisterForm };
