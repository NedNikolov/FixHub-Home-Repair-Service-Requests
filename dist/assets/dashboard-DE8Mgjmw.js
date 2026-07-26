import{r as n}from"./navbar-CFLUKmNY.js";import{a as c,b as l,g as d}from"./authGuard-BwdLiImT.js";const r=[{sectionId:"my-repair-requests",icon:"bi-journal-text",title:"My Repair Requests",description:"Review the status, history, and notes for your submitted repair requests.",href:"/my-requests.html",buttonLabel:"View requests"},{sectionId:"create-new-request",icon:"bi-plus-circle",title:"Create New Request",description:"Start a new repair request and add details when you are ready.",href:"/create-request.html",buttonLabel:"Start request"},{sectionId:"profile",icon:"bi-person-badge",title:"Profile",description:"Check your personal information and keep your account details up to date.",href:"/profile.html",buttonLabel:"Open profile"},{sectionId:"account-settings",icon:"bi-gear",title:"Account Settings",description:"Manage security preferences, notification settings, and account options.",href:"/profile.html#security",buttonLabel:"Open settings"},{sectionId:"admin-panel",icon:"bi-shield-lock",title:"Admin Panel",description:"Review requests, manage statuses, and inspect registered users from one place.",href:"/admin.html",buttonLabel:"Open admin"}];function p(e){return e?.user_metadata?.fullName||e?.user_metadata?.name||e?.email||"there"}function u(e){const i=document.querySelector("#app");if(!i)return;const s=p(e),o=r.map(a=>`
        <div class="col-12 col-md-6 col-xl-3">
          <article class="feature-card h-100 hover-lift dashboard-card">
            <div class="card-icon mb-3"><i class="bi ${a.icon}"></i></div>
            <h2 class="h4 fw-bold mb-2">${a.title}</h2>
            <p class="text-secondary mb-4">${a.description}</p>
            <a class="btn btn-outline-primary mt-auto align-self-start" href="${a.href}">${a.buttonLabel}</a>
          </article>
        </div>
      `).join(""),t=r.map(a=>`
        <div class="col-12 col-lg-6" id="${a.sectionId}">
          <section class="section-card h-100">
            <p class="text-uppercase text-secondary small fw-semibold mb-2">${a.title}</p>
            <h2 class="h4 fw-bold mb-3">Coming soon</h2>
            <p class="text-secondary mb-0">
              This section will host the ${a.title.toLowerCase()} workflow in a future update.
            </p>
          </section>
        </div>
      `).join("");i.innerHTML=`
    ${n()}
    <main class="py-5 dashboard-page">
      <div class="container">
        <section class="section-card mb-4 mb-lg-5 dashboard-hero">
          <div class="row align-items-center g-4">
            <div class="col-lg-8">
              <span class="eyebrow">Dashboard</span>
              <h1 class="hero-title h2 fw-bold mb-3">Welcome back, ${s}</h1>
              <p class="text-secondary mb-0">
                Manage your FixHub account, keep track of repair requests, and adjust your profile from one place.
              </p>
            </div>
            <div class="col-lg-4">
              <div class="section-card dashboard-summary h-100">
                <p class="text-uppercase text-secondary small fw-semibold mb-2">Signed in as</p>
                <p class="h5 fw-bold mb-1">${s}</p>
                <p class="text-secondary mb-0">${e?.email||"No email available"}</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Dashboard quick actions">
          <div class="row g-4">
            ${o}
          </div>
        </section>

        <section class="mt-4 mt-lg-5" aria-label="Dashboard placeholders">
          <div class="row g-4">
            ${t}
          </div>
        </section>
      </div>
    </main>
  `}async function m(){const e=document.querySelector("#app");if(!e||(e.innerHTML=`
    ${n()}
    <main class="py-5">
      <div class="container">
        <div class="section-card py-5 text-center">
          <div class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
          <h1 class="h3 fw-bold mb-2">Loading dashboard</h1>
          <p class="text-secondary mb-0">Checking your session and preparing your account overview.</p>
        </div>
      </div>
    </main>
  `,!await c()))return;const s=await l(),t=(await d())?.data?.user||s?.data?.session?.user||null;if(!t){window.location.href="/login.html";return}u(t)}m().catch(e=>{console.error("[dashboard] failed to render",e),window.location.href="/login.html"});
