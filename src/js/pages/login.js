import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../css/styles.css';
import { renderNavbar } from '../components/navbar.js';

function renderLoginForm() {
  return `
    <section class="py-5 d-flex align-items-center" style="min-height: calc(100vh - 80px);">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="section-card p-4">
              <h2 class="mb-3">Welcome back</h2>
              <p class="text-secondary mb-4">Log in to your FixHub account to manage requests and connect with professionals.</p>

              <form id="loginForm" novalidate>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group has-validation">
                    <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
                    <input type="email" class="form-control" id="email" name="email" placeholder="you@example.com" required />
                    <div class="invalid-feedback">Please enter a valid email.</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group has-validation">
                    <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                    <input type="password" class="form-control" id="password" name="password" placeholder="Your password" minlength="8" required />
                    <button type="button" class="btn btn-outline-secondary input-group-text password-toggle" data-target="#password" aria-label="Toggle password visibility">
                      <i class="bi bi-eye"></i>
                    </button>
                    <div class="invalid-feedback">Please enter your password (min 8 characters).</div>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <a href="#forgot" class="text-decoration-none">Forgot Password?</a>
                </div>

                <div class="d-grid">
                  <button class="btn btn-primary btn-lg" type="submit">Login</button>
                </div>

                <p class="text-center text-secondary mt-3 mb-0">Don't have an account? <a href="/register.html">Register</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function initLoginBehavior() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  // Password visibility toggle
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Logging in...';
    }

    // Simulated login flow (no auth yet)
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Login';
      }
      form.reset();
      form.classList.remove('was-validated');
      alert('Login simulated — authentication not implemented yet.');
    }, 700);
  });
}

const app = document.querySelector('#app');
if (app) {
  app.innerHTML = `
    ${renderNavbar()}
    <main>
      ${renderLoginForm()}
    </main>
  `;

  initLoginBehavior();
}

export { renderLoginForm };
