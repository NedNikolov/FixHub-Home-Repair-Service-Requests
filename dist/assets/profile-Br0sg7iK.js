import{r as b}from"./navbar-CFLUKmNY.js";import{i as v,s as d,a as g,g as w}from"./authGuard-BwdLiImT.js";const p="profile-images";function o(e,a=new Error(e)){return{data:null,error:a,message:e}}function y(e,a){const t=a.name.split(".").pop()?.toLowerCase()||"jpg";return`${e}/avatar-${Date.now()}.${t}`}async function h({fullName:e,avatarFile:a}={}){if(!v)return o("Supabase is not configured.");const{data:t,error:r}=await d.auth.getUser(),s=t?.user;if(r||!s)return o(r?.message||"You must be signed in to update your profile.",r);if(!e?.trim())return o("Please enter your full name.");if(a&&!a.type.startsWith("image/"))return o("Please choose an image file.");try{let i=s.user_metadata?.avatar_url||"";if(a){const m=y(s.id,a),{error:u}=await d.storage.from(p).upload(m,a,{cacheControl:"3600",upsert:!0});if(u)return o(u.message,u);i=d.storage.from(p).getPublicUrl(m).data?.publicUrl||""}const{data:n,error:l}=await d.auth.updateUser({data:{...s.user_metadata,fullName:e.trim(),avatar_url:i}});return l?o(l.message,l):{data:n?.user||n,error:null,message:"Profile updated successfully."}}catch(i){return o(i.message||"Unable to update your profile.",i)}}async function P(e){if(!v)return o("Supabase is not configured.");if(!e||e.length<8)return o("Password must be at least 8 characters.");try{const{data:a,error:t}=await d.auth.updateUser({password:e});return t?o(t.message,t):{data:a?.user||a,error:null,message:"Password updated successfully."}}catch(a){return o(a.message||"Unable to update your password.",a)}}const c=(e="")=>String(e).replace(/[&<>'"]/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[a]);function U(e){return e?.user_metadata?.fullName||e?.user_metadata?.name||""}function _(e){const a=U(e),t=e?.user_metadata?.avatar_url,r=(a||e.email||"U").trim().slice(0,1).toUpperCase();return`
    ${b()}
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
                    ${t?`<img src="${c(t)}" alt="Current profile picture" />`:`<span aria-hidden="true">${c(r)}</span>`}
                  </div>
                  <div>
                    <label for="avatar" class="form-label mb-1">Profile picture</label>
                    <input class="form-control" type="file" id="avatar" accept="image/*" aria-describedby="avatarHelp" />
                    <div id="avatarHelp" class="form-text">JPG, PNG, or another image format.</div>
                  </div>
                </div>
                <div class="mb-4">
                  <label for="fullName" class="form-label">Full name</label>
                  <input class="form-control" type="text" id="fullName" value="${c(a)}" autocomplete="name" required />
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
                <div><dt>Email address</dt><dd>${c(e.email||"Not available")}</dd></div>
                <div><dt>Account created</dt><dd>${e.created_at?new Date(e.created_at).toLocaleDateString():"Not available"}</dd></div>
                <div><dt>Last sign in</dt><dd>${e.last_sign_in_at?new Date(e.last_sign_in_at).toLocaleString():"Not available"}</dd></div>
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
    </main>`}function f(e,a){const t=document.getElementById("profileAlert");t&&(t.innerHTML=`<div class="alert alert-${a}" role="alert">${c(e)}</div>`)}function E(){const e=document.getElementById("profileForm"),a=document.getElementById("passwordForm"),t=document.getElementById("avatar");t?.addEventListener("change",()=>{const r=t.files?.[0];!r||!r.type.startsWith("image/")||(document.getElementById("avatarPreview").innerHTML=`<img src="${URL.createObjectURL(r)}" alt="Selected profile picture preview" />`)}),e?.addEventListener("submit",async r=>{if(r.preventDefault(),!e.checkValidity()){e.classList.add("was-validated");return}const s=e.querySelector('button[type="submit"]');s.disabled=!0,s.textContent="Saving...";const i=await h({fullName:document.getElementById("fullName").value,avatarFile:t.files?.[0]});s.disabled=!1,s.textContent="Save profile",f(i.message||i.error?.message,i.error?"danger":"success")}),a?.addEventListener("submit",async r=>{r.preventDefault();const s=document.getElementById("newPassword"),i=document.getElementById("confirmPassword");if(i.setCustomValidity(s.value===i.value?"":"Passwords do not match"),!a.checkValidity()){a.classList.add("was-validated");return}const n=a.querySelector('button[type="submit"]');n.disabled=!0,n.textContent="Updating...";const l=await P(s.value);n.disabled=!1,n.textContent="Update password",l.error||a.reset(),f(l.message||l.error?.message,l.error?"danger":"success")})}async function C(){if(!await g())return;const{data:a}=await w();if(!a?.user){window.location.href="/login.html";return}document.querySelector("#app").innerHTML=_(a.user),E()}C().catch(e=>{console.error("[profile] failed",e),window.location.href="/login.html"});
