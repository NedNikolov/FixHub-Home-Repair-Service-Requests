import{r as b}from"./navbar-CFLUKmNY.js";import{a as f,r as v}from"./authGuard-D0ph0jsb.js";function g(){return`
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

                <p class="text-center text-secondary mt-3 mb-0">Already have an account? <a href="/login.html">Login</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `}function y(){const e=document.getElementById("registerForm");if(!e)return;document.querySelectorAll(".password-toggle").forEach(r=>{r.addEventListener("click",()=>{const i=r.getAttribute("data-target"),o=document.querySelector(i);if(!o)return;const l=o.getAttribute("type")==="password";o.setAttribute("type",l?"text":"password");const n=r.querySelector("i");n&&(n.className=l?"bi bi-eye-slash":"bi bi-eye")})});const a=document.getElementById("password"),t=document.getElementById("confirmPassword");function s(){return!a||!t?!0:t.value===""?(t.setCustomValidity(""),!0):a.value!==t.value?(t.setCustomValidity("Passwords do not match"),!1):(t.setCustomValidity(""),!0)}a.addEventListener("input",()=>{s()}),t.addEventListener("input",()=>{s()}),e.addEventListener("submit",r=>{if(r.preventDefault(),r.stopPropagation(),s(),!e.checkValidity()){e.classList.add("was-validated");return}(async()=>{m();const i=e.querySelector('button[type="submit"]');i&&(i.disabled=!0,i.innerText="Creating account...");const o=document.getElementById("fullName")?.value?.trim(),l=document.getElementById("email")?.value?.trim(),n=a.value,{data:w,error:c,message:p}=await v(l,n,{data:{fullName:o}});if(i&&(i.disabled=!1,i.innerText="Create account"),c){d(p||c.message||"Registration failed","danger");return}d("Account created successfully. Redirecting to login...","success"),setTimeout(()=>{window.location.href="/login.html"},1400)})()})}function d(e,a="danger"){const t=document.getElementById("registerForm");if(!t)return;m();const s=document.createElement("div");s.className=`alert alert-${a} mt-3`,s.setAttribute("role","alert"),s.innerText=e,t.prepend(s)}function m(){const e=document.getElementById("registerForm");if(!e)return;const a=e.querySelector(".alert");a&&a.remove()}const u=document.querySelector("#app");u&&(console.debug("[register] rendering page"),u.innerHTML=`
    ${b()}
    <main>
      ${g()}
    </main>
  `,Promise.resolve().then(()=>{console.debug("[register] initializing form behavior"),y(),f().catch(()=>{})}));
