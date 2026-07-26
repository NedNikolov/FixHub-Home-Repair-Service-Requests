import{r as m}from"./navbar-CFLUKmNY.js";import{a as u,l as p}from"./authGuard-BwdLiImT.js";function g(){return`
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
  `}function b(){const i=document.getElementById("loginForm");i&&(document.querySelectorAll(".password-toggle").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-target"),a=document.querySelector(t);if(!a)return;const s=a.getAttribute("type")==="password";a.setAttribute("type",s?"text":"password");const o=e.querySelector("i");o&&(o.className=s?"bi bi-eye-slash":"bi bi-eye")})}),i.addEventListener("submit",e=>{if(e.preventDefault(),e.stopPropagation(),!i.checkValidity()){i.classList.add("was-validated");return}(async()=>{c();const t=i.querySelector('button[type="submit"]');t&&(t.disabled=!0,t.innerText="Logging in...");const a=document.getElementById("email")?.value?.trim(),s=document.getElementById("password")?.value,{data:o,error:n,message:d}=await p(a,s);if(t&&(t.disabled=!1,t.innerText="Login"),n){r(d||n.message||"Login failed","danger");return}r("Login successful — redirecting...","success"),setTimeout(()=>{window.location.href="/dashboard.html"},800)})()}))}function r(i,e="danger"){const t=document.getElementById("loginForm");if(!t)return;c();const a=document.createElement("div");a.className=`alert alert-${e} mt-3`,a.setAttribute("role","alert"),a.innerText=i,t.prepend(a)}function c(){const i=document.getElementById("loginForm");if(!i)return;const e=i.querySelector(".alert");e&&e.remove()}const l=document.querySelector("#app");l&&(console.debug("[login] rendering page"),l.innerHTML=`
    ${m()}
    <main>
      ${g()}
    </main>
  `,Promise.resolve().then(()=>{console.debug("[login] initializing form behavior"),b(),u().catch(()=>{})}));
