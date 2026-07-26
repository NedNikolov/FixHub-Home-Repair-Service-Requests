import{r as l}from"./navbar-CFLUKmNY.js";import{a as o,g as u}from"./authGuard-BwdLiImT.js";import{g as m,d as b}from"./requestService-CJ-6GFK_.js";function p(t){return`
    <main class="py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span class="eyebrow">My Requests</span>
            <h1 class="h2 fw-bold mb-1">Your repair requests</h1>
            <p class="text-secondary mb-0">Review, edit, or remove requests you submitted.</p>
          </div>
          <a class="btn btn-primary" href="/create-request.html">Create request</a>
        </div>

        ${t.length?`
          <div class="row g-4">
            ${t.map(e=>`
              <div class="col-12 col-lg-6">
                <article class="section-card p-4 h-100">
                  <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <h2 class="h5 fw-bold mb-1">${e.title}</h2>
                      <p class="text-secondary mb-0">${e.category}</p>
                    </div>
                    <span class="badge text-bg-primary">${e.status}</span>
                  </div>
                  <p class="text-secondary mb-3">${e.description}</p>
                  <ul class="list-unstyled small text-secondary mb-3">
                    <li><strong>Address:</strong> ${e.address}</li>
                    <li><strong>Preferred date:</strong> ${e.preferred_date||"Not set"}</li>
                    <li><strong>Created:</strong> ${e.created_at?new Date(e.created_at).toLocaleString():"Unknown"}</li>
                  </ul>
                  <div class="d-flex gap-2">
                    <a class="btn btn-outline-primary btn-sm" href="/request-details.html?id=${e.id}">View</a>
                    <a class="btn btn-outline-secondary btn-sm" href="/request-details.html?id=${e.id}&edit=1">Edit</a>
                    <button class="btn btn-outline-danger btn-sm delete-request-btn" data-id="${e.id}">Delete</button>
                  </div>
                </article>
              </div>
            `).join("")}
          </div>
        `:`
          <div class="section-card p-5 text-center">
            <h2 class="h5 fw-bold mb-2">No requests yet</h2>
            <p class="text-secondary mb-3">You have not created any repair requests yet.</p>
            <a class="btn btn-primary" href="/create-request.html">Create your first request</a>
          </div>
        `}
      </div>
    </main>
  `}async function f(){if(!await o())return;const s=(await u())?.data?.user||null;if(!s)return;const a=document.querySelector("#app");if(!a)return;const{data:c,error:r}=await m(s.id);if(r){a.innerHTML=`
      ${l()}
      <main class="py-5">
        <div class="container">
          <div class="section-card p-5 text-center">
            <h1 class="h5 fw-bold mb-2">Unable to load requests</h1>
            <p class="text-secondary">${r.message}</p>
          </div>
        </div>
      </main>
    `;return}a.innerHTML=`
    ${l()}
    ${p(c||[])}
  `,document.querySelectorAll(".delete-request-btn").forEach(i=>{i.addEventListener("click",async()=>{const n=i.getAttribute("data-id");if(!n||!window.confirm("Delete this request?"))return;const{error:d}=await b(n,s.id);if(d){window.alert(d.message);return}window.location.reload()})})}f().catch(t=>{console.error("[myRequests] failed",t)});
