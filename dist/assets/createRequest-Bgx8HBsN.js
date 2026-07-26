import{r as y}from"./navbar-CFLUKmNY.js";import{a as h,g as w}from"./authGuard-D0ph0jsb.js";import{c as q}from"./requestService-BRkUf_oY.js";import{u as P}from"./storageService-CIKyIHXb.js";function R(){return`
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
                  <div class="col-12">
                    <label for="images" class="form-label">Images</label>
                    <input type="file" class="form-control" id="images" accept="image/*" multiple />
                    <div class="form-text">Choose one or more image files. Only image files are accepted.</div>
                    <div id="imagePreview" class="row g-3 mt-1"></div>
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
  `}function f(l,c="danger"){const t=document.getElementById("requestForm");if(!t)return;const s=t.querySelector(".alert");s&&s.remove();const e=document.createElement("div");e.className=`alert alert-${c} mt-3`,e.innerText=l,t.appendChild(e)}async function I(){if(!await h())return;const t=(await w())?.data?.user||null;if(!t)return;const s=document.querySelector("#app");if(!s)return;s.innerHTML=`
    ${y()}
    ${R()}
  `;const e=document.getElementById("requestForm"),o=document.getElementById("images"),r=document.getElementById("imagePreview");e&&(o&&r&&o.addEventListener("change",()=>{const i=Array.from(o.files||[]);if(!i.length){r.innerHTML='<p class="text-secondary small mb-0">No images chosen yet.</p>';return}const n=i.map(a=>`
            <div class="col-6 col-md-4">
              <div class="border rounded p-2 h-100">
                <img src="${URL.createObjectURL(a)}" alt="Preview" class="img-fluid rounded" style="height: 120px; object-fit: cover; width: 100%;" />
                <p class="small text-secondary mt-2 mb-0">${a.name}</p>
              </div>
            </div>
          `).join("");r.innerHTML=n}),e.addEventListener("submit",async i=>{if(i.preventDefault(),i.stopPropagation(),!e.checkValidity()){e.classList.add("was-validated");return}const n={title:document.getElementById("title").value.trim(),category:document.getElementById("category").value,description:document.getElementById("description").value.trim(),address:document.getElementById("address").value.trim(),preferred_date:document.getElementById("preferredDate").value,status:document.getElementById("status").value,user_id:t.id,created_at:new Date().toISOString()},{data:a,error:d,message:g}=await q(n);if(d){f(g||d.message,"danger");return}const b=Array.isArray(a)?a[0]:a,m=Array.from(o?.files||[]);let u="Repair request created successfully.",p="success";if(m.length){const v=await P(m,b?.id,t.id);v.error&&(u=v.message||"Request created, but one or more images could not be uploaded.",p="warning")}f(u,p),e.reset(),r&&(r.innerHTML='<p class="text-secondary small mb-0">No images chosen yet.</p>'),setTimeout(()=>{window.location.href="/my-requests.html"},900)}))}I().catch(l=>{console.error("[createRequest] failed",l)});
