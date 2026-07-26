import{r as h}from"./navbar-CFLUKmNY.js";import{i,s as o,a as f,g as v}from"./authGuard-D0ph0jsb.js";const u="repair_requests",y="user_roles";function c(e){return{data:null,error:new Error(e),message:e}}async function w(e){if(!i)return c("Supabase is not configured.");try{const{data:a,error:t}=await o.from(y).select("role").eq("user_id",e).maybeSingle();return t?{data:null,error:t,message:t.message}:{data:a,error:null,message:null}}catch(a){return{data:null,error:a,message:a.message}}}async function R(){if(!i)return c("Supabase is not configured.");try{const[{data:e,error:a},{data:t,error:s}]=await Promise.all([o.from("auth_users").select("id",{count:"exact"}),o.from(u).select("id,status",{count:"exact"})]);if(a)return{data:null,error:a,message:a.message};if(s)return{data:null,error:s,message:s.message};const r=t?.length||0,l=(t||[]).filter(n=>n.status==="Pending").length,d=(t||[]).filter(n=>n.status==="Completed").length;return{data:{totalUsers:e?.length||0,totalRequests:r,pendingRequests:l,completedRequests:d},error:null,message:null}}catch(e){return{data:null,error:e,message:e.message}}}async function $({search:e="",status:a=""}={}){if(!i)return c("Supabase is not configured.");try{let t=o.from(u).select("*").order("created_at",{ascending:!1});a&&(t=t.eq("status",a)),e&&(t=t.or(`title.ilike.%${e}%,description.ilike.%${e}%,address.ilike.%${e}%`));const{data:s,error:r}=await t;return r?{data:null,error:r,message:r.message}:{data:s,error:null,message:null}}catch(t){return{data:null,error:t,message:t.message}}}async function S(){if(!i)return c("Supabase is not configured.");try{const{data:e,error:a}=await o.from("auth_users").select("*").order("created_at",{ascending:!1});return a?{data:null,error:a,message:a.message}:{data:e,error:null,message:null}}catch(e){return{data:null,error:e,message:e.message}}}async function q(e,a){if(!i)return c("Supabase is not configured.");try{const{data:t,error:s}=await o.from(u).update({status:a}).eq("id",e).select();return s?{data:null,error:s,message:s.message}:{data:t,error:null,message:null}}catch(t){return{data:null,error:t,message:t.message}}}function P(e){const a=e||"Pending";return`<span class="badge bg-${{Pending:"warning","In Progress":"primary",Completed:"success",Rejected:"danger"}[a]||"secondary"}">${a}</span>`}function x({stats:e,requests:a,users:t}){return`
    <main class="py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span class="eyebrow">Admin</span>
            <h1 class="h2 fw-bold mb-1">Administration dashboard</h1>
            <p class="text-secondary mb-0">Manage repair requests, review users, and track platform activity.</p>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div class="col-12 col-md-6 col-lg-3">
            <div class="section-card p-4">
              <p class="text-secondary mb-1">Total Users</p>
              <h2 class="h3 fw-bold mb-0">${e.totalUsers}</h2>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="section-card p-4">
              <p class="text-secondary mb-1">Total Requests</p>
              <h2 class="h3 fw-bold mb-0">${e.totalRequests}</h2>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="section-card p-4">
              <p class="text-secondary mb-1">Pending Requests</p>
              <h2 class="h3 fw-bold mb-0">${e.pendingRequests}</h2>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="section-card p-4">
              <p class="text-secondary mb-1">Completed Requests</p>
              <h2 class="h3 fw-bold mb-0">${e.completedRequests}</h2>
            </div>
          </div>
        </div>

        <div class="section-card p-4 mb-4">
          <div class="row g-3 align-items-end">
            <div class="col-12 col-md-6">
              <label for="searchInput" class="form-label">Search requests</label>
              <input type="text" id="searchInput" class="form-control" placeholder="Search title, description, or address" />
            </div>
            <div class="col-12 col-md-4">
              <label for="statusFilter" class="form-label">Filter by status</label>
              <select id="statusFilter" class="form-select">
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <button id="applyFiltersBtn" class="btn btn-primary w-100">Apply</button>
            </div>
          </div>
        </div>

        <div class="section-card p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h5 fw-bold mb-0">Repair Requests</h2>
          </div>
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${a.length?a.map(s=>`
                  <tr>
                    <td>${s.title}</td>
                    <td>${s.user_id||"Unknown"}</td>
                    <td>${P(s.status)}</td>
                    <td>${s.category}</td>
                    <td>${s.created_at?new Date(s.created_at).toLocaleString():"Unknown"}</td>
                    <td>
                      <select class="form-select form-select-sm status-select" data-id="${s.id}">
                        <option value="Pending" ${s.status==="Pending"?"selected":""}>Pending</option>
                        <option value="In Progress" ${s.status==="In Progress"?"selected":""}>In Progress</option>
                        <option value="Completed" ${s.status==="Completed"?"selected":""}>Completed</option>
                        <option value="Rejected" ${s.status==="Rejected"?"selected":""}>Rejected</option>
                      </select>
                    </td>
                  </tr>
                `).join(""):'<tr><td colspan="6" class="text-center text-secondary">No requests found.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-card p-4">
          <h2 class="h5 fw-bold mb-3">Registered Users</h2>
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                ${t.length?t.map(s=>`
                  <tr>
                    <td>${s.email||"Unknown"}</td>
                    <td><span class="badge bg-secondary">${s.role||"user"}</span></td>
                    <td>${s.created_at?new Date(s.created_at).toLocaleString():"Unknown"}</td>
                  </tr>
                `).join(""):'<tr><td colspan="3" class="text-center text-secondary">No users found.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  `}async function g(e="",a=""){const t=document.querySelector("#app");if(!t)return;const[{data:s},{data:r},{data:l}]=await Promise.all([R(),$({search:e,status:a}),S()]);t.innerHTML=`
    ${h()}
    ${x({stats:s||{totalUsers:0,totalRequests:0,pendingRequests:0,completedRequests:0},requests:r||[],users:l||[]})}
  `,document.querySelectorAll(".status-select").forEach(d=>{d.addEventListener("change",async n=>{const m=n.target.getAttribute("data-id"),b=n.target.value,{error:p}=await q(m,b);if(p){window.alert(p.message);return}window.location.reload()})})}async function A(){if(!await f())return;const t=(await v())?.data?.user||null;if(!t)return;const{data:s,error:r}=await w(t.id);if(r||!s||s.role!=="admin"){window.location.href="/dashboard.html";return}const l=document.querySelector("#app");if(!l)return;l.innerHTML=`
    ${h()}
    <main class="py-5">
      <div class="container">
        <div class="section-card p-5 text-center">
          <div class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
          <h1 class="h3 fw-bold mb-2">Loading admin dashboard</h1>
          <p class="text-secondary mb-0">Checking your access and preparing the admin tools.</p>
        </div>
      </div>
    </main>
  `,await g();const d=document.getElementById("searchInput"),n=document.getElementById("statusFilter");document.getElementById("applyFiltersBtn")?.addEventListener("click",async()=>{await g(d?.value||"",n?.value||"")})}A().catch(e=>{console.error("[admin] failed",e)});
