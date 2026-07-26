import{r as b}from"./navbar-CFLUKmNY.js";import{a as $,g as I}from"./authGuard-D0ph0jsb.js";import{a as R,b as P,u as E,d as x}from"./requestService-BRkUf_oY.js";import{u as D,d as U}from"./storageService-CIKyIHXb.js";function y(e){return new URLSearchParams(window.location.search).get(e)}function B(e,o=!1,t=[]){const s=t.length?`
        <div class="mt-4">
          <h2 class="h6 fw-bold mb-3">Uploaded Images</h2>
          <div class="row g-3">
            ${t.map(d=>`
                  <div class="col-12 col-md-6">
                    <div class="border rounded p-2 h-100">
                      <img src="${d.image_url}" alt="Repair request image" class="img-fluid rounded" style="height: 180px; object-fit: cover; width: 100%;" />
                      <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="small text-secondary">${d.storage_path||"Image"}</span>
                        <button class="btn btn-outline-danger btn-sm delete-image-btn" data-id="${d.id}">Delete</button>
                      </div>
                    </div>
                  </div>
                `).join("")}
          </div>
        </div>
      `:`
        <div class="mt-4">
          <h2 class="h6 fw-bold mb-2">Uploaded Images</h2>
          <p class="text-secondary mb-0">No images have been uploaded for this request yet.</p>
        </div>
      `;return`
    <main class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <div class="section-card p-4 p-lg-5">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span class="eyebrow">Request Details</span>
                  <h1 class="h2 fw-bold mb-1">${o?"Edit request":e.title}</h1>
                  <p class="text-secondary mb-0">${o?"Update the request details below.":"Review the full request details."}</p>
                </div>
                <a class="btn btn-outline-secondary" href="/my-requests.html">Back</a>
              </div>

              ${o?`
                <form id="editForm" novalidate>
                  <div class="row g-3">
                    <div class="col-12">
                      <label for="title" class="form-label">Title</label>
                      <input type="text" class="form-control" id="title" value="${e.title}" required />
                    </div>
                    <div class="col-12 col-md-6">
                      <label for="category" class="form-label">Category</label>
                      <select class="form-select" id="category" required>
                        <option value="Plumbing" ${e.category==="Plumbing"?"selected":""}>Plumbing</option>
                        <option value="Electrical" ${e.category==="Electrical"?"selected":""}>Electrical</option>
                        <option value="Painting" ${e.category==="Painting"?"selected":""}>Painting</option>
                        <option value="Cleaning" ${e.category==="Cleaning"?"selected":""}>Cleaning</option>
                        <option value="General Repair" ${e.category==="General Repair"?"selected":""}>General Repair</option>
                        <option value="Other" ${e.category==="Other"?"selected":""}>Other</option>
                      </select>
                    </div>
                    <div class="col-12 col-md-6">
                      <label for="preferredDate" class="form-label">Preferred Date</label>
                      <input type="date" class="form-control" id="preferredDate" value="${e.preferred_date||""}" required />
                    </div>
                    <div class="col-12">
                      <label for="description" class="form-label">Description</label>
                      <textarea class="form-control" id="description" rows="5" required>${e.description}</textarea>
                    </div>
                    <div class="col-12">
                      <label for="address" class="form-label">Address</label>
                      <input type="text" class="form-control" id="address" value="${e.address}" required />
                    </div>
                    <div class="col-12">
                      <label for="status" class="form-label">Status</label>
                      <select class="form-select" id="status" required>
                        <option value="Pending" ${e.status==="Pending"?"selected":""}>Pending</option>
                        <option value="In Progress" ${e.status==="In Progress"?"selected":""}>In Progress</option>
                        <option value="Completed" ${e.status==="Completed"?"selected":""}>Completed</option>
                        <option value="Cancelled" ${e.status==="Cancelled"?"selected":""}>Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div class="mt-4 d-flex gap-2">
                    <button class="btn btn-primary" type="submit">Save Changes</button>
                    <button class="btn btn-outline-danger" type="button" id="deleteBtn">Delete</button>
                  </div>
                </form>
              `:`
                <dl class="row mb-0">
                  <dt class="col-sm-4">Title</dt>
                  <dd class="col-sm-8">${e.title}</dd>
                  <dt class="col-sm-4">Category</dt>
                  <dd class="col-sm-8">${e.category}</dd>
                  <dt class="col-sm-4">Description</dt>
                  <dd class="col-sm-8">${e.description}</dd>
                  <dt class="col-sm-4">Address</dt>
                  <dd class="col-sm-8">${e.address}</dd>
                  <dt class="col-sm-4">Preferred Date</dt>
                  <dd class="col-sm-8">${e.preferred_date||"Not set"}</dd>
                  <dt class="col-sm-4">Status</dt>
                  <dd class="col-sm-8">${e.status}</dd>
                  <dt class="col-sm-4">Created</dt>
                  <dd class="col-sm-8">${e.created_at?new Date(e.created_at).toLocaleString():"Unknown"}</dd>
                </dl>
              `}

              ${s}

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
  `}function i(e,o="danger"){const t=document.querySelector(".section-card");if(!t)return;const s=t.querySelector(".alert");s&&s.remove();const d=document.createElement("div");d.className=`alert alert-${o} mt-3`,d.innerText=e,t.appendChild(d)}async function C(){if(!await $())return;const t=(await I())?.data?.user||null;if(!t)return;const s=y("id"),d=y("edit")==="1",u=document.querySelector("#app");if(!u)return;const{data:g,error:f}=await R(s,t.id);if(f||!g){u.innerHTML=`
      ${b()}
      <main class="py-5">
        <div class="container">
          <div class="section-card p-5 text-center">
            <h1 class="h5 fw-bold mb-2">Request not found</h1>
            <p class="text-secondary">${f?.message||"The request you requested is not available."}</p>
          </div>
        </div>
      </main>
    `;return}const{data:h}=await P(s,t.id);u.innerHTML=`
    ${b()}
    ${B(g,d,h||[])}
  `;const v=document.getElementById("editForm"),n=document.getElementById("imageInput"),c=document.getElementById("imageUploadPreview");n&&c&&n.addEventListener("change",()=>{const l=Array.from(n.files||[]);c.innerHTML=l.length?l.map(a=>`
                <div class="col-6 col-md-4">
                  <div class="border rounded p-2">
                    <img src="${URL.createObjectURL(a)}" alt="Preview" class="img-fluid rounded" style="height: 100px; object-fit: cover; width: 100%;" />
                    <p class="small text-secondary mt-2 mb-0">${a.name}</p>
                  </div>
                </div>
              `).join(""):'<p class="text-secondary small mb-0">No images selected yet.</p>'});const p=document.getElementById("imageUploadForm");p&&p.addEventListener("submit",async l=>{l.preventDefault();const a=Array.from(n?.files||[]);if(!a.length){i("Please select at least one image.","warning");return}const{error:r,message:m}=await D(a,s,t.id);if(r){i(m||r.message,"danger");return}i("Images uploaded successfully.","success"),p.reset(),c&&(c.innerHTML=""),window.location.reload()}),document.querySelectorAll(".delete-image-btn").forEach(l=>{l.addEventListener("click",async()=>{const a=l.getAttribute("data-id");if(!a||!window.confirm("Delete this image?"))return;const{error:m,message:w}=await U(a,t.id);if(m){i(w||m.message,"danger");return}i("Image deleted successfully.","success"),window.location.reload()})}),v&&(v.addEventListener("submit",async l=>{l.preventDefault(),l.stopPropagation();const a={title:document.getElementById("title").value.trim(),category:document.getElementById("category").value,description:document.getElementById("description").value.trim(),address:document.getElementById("address").value.trim(),preferred_date:document.getElementById("preferredDate").value,status:document.getElementById("status").value},{error:r}=await E(s,a,t.id);if(r){i(r.message,"danger");return}i("Request updated successfully.","success"),setTimeout(()=>{window.location.href=`/request-details.html?id=${s}`},600)}),document.getElementById("deleteBtn").addEventListener("click",async()=>{if(!window.confirm("Delete this request?"))return;const{error:a}=await x(s,t.id);if(a){i(a.message,"danger");return}window.location.href="/my-requests.html"}))}C().catch(e=>{console.error("[requestDetails] failed",e)});
