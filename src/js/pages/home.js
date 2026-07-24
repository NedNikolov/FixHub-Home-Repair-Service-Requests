const serviceCards = [
  {
    icon: 'bi-water',
    title: 'Emergency repairs',
    description: 'Fast responses for leaks, electrical issues, broken fixtures, and urgent home problems.',
  },
  {
    icon: 'bi-tools',
    title: 'Routine maintenance',
    description: 'Scheduled upkeep for small fixes, seasonal checks, and preventative service requests.',
  },
  {
    icon: 'bi-house-heart',
    title: 'Home improvement',
    description: 'Simple upgrades and refresh work to keep your space functional, safe, and comfortable.',
  },
];

export function renderHomePage() {
  const cardsMarkup = serviceCards
    .map(
      (card) => `
        <div class="col-md-4">
          <article class="feature-card h-100">
            <div class="service-pill mb-3"><i class="bi ${card.icon}"></i> Service</div>
            <h2 class="h4 fw-bold">${card.title}</h2>
            <p class="text-secondary mb-0">${card.description}</p>
          </article>
        </div>
      `,
    )
    .join('');

  return `
    <section class="hero" id="home">
      <div class="container hero-container">
        <div class="row align-items-center g-4 g-xl-5">
          <div class="col-lg-7">
            <span class="eyebrow">Trusted Home Repair Platform</span>
            <h1 class="hero-title fw-bold">Need Something Repaired?</h1>
            <p class="hero-lead mb-4">
              FixHub helps homeowners submit repair requests in minutes, connect with the right professionals, and stay updated from request to resolution.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <a class="btn btn-primary btn-lg rounded-pill px-4" href="#contact">Create Request</a>
              <a class="btn btn-outline-primary btn-lg rounded-pill px-4" href="#about">Learn More</a>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="hero-visual" aria-hidden="true">
              <article class="visual-card visual-card-primary">
                <div class="visual-icon-wrap">
                  <i class="bi bi-house-gear-fill"></i>
                </div>
                <h2 class="h4 fw-bold mb-2">Smart Request Flow</h2>
                <p class="text-secondary mb-0">Submit issues, add details, and keep every repair request organized in one place.</p>
              </article>

              <article class="visual-card visual-card-floating">
                <div class="d-flex align-items-center gap-3">
                  <div class="mini-icon"><i class="bi bi-lightning-charge-fill"></i></div>
                  <div>
                    <p class="mini-label mb-1">Urgent jobs</p>
                    <p class="mini-value mb-0">Fast dispatch support</p>
                  </div>
                </div>
              </article>

              <article class="visual-card visual-card-floating alt">
                <div class="d-flex align-items-center gap-3">
                  <div class="mini-icon"><i class="bi bi-shield-check"></i></div>
                  <div>
                    <p class="mini-label mb-1">Reliable tracking</p>
                    <p class="mini-value mb-0">Clear status updates</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5" id="services">
      <div class="container">
        <div class="section-title">
          <span class="eyebrow">Services</span>
          <h2 class="h1 fw-bold mt-2 mb-0">What FixHub can organize</h2>
        </div>
        <div class="row g-4">
          ${cardsMarkup}
        </div>
      </div>
    </section>

    <section class="py-5" id="about">
      <div class="container">
        <div class="section-card">
          <span class="eyebrow">About</span>
          <h2 class="h1 fw-bold mt-2">Built as a clean foundation for a real service platform.</h2>
          <p class="text-secondary mb-0">
            This starter is intentionally simple: no backend logic yet, just a maintainable frontend architecture ready for pages, services, utilities, and future integrations.
          </p>
        </div>
      </div>
    </section>

    <section class="py-5" id="contact">
      <div class="container">
        <div class="section-card contact-strip">
          <div class="row align-items-center g-4">
            <div class="col-lg-8">
              <span class="eyebrow">Contact</span>
              <h2 class="h1 fw-bold mt-2 mb-2">Ready to turn this starter into your booking flow?</h2>
              <p class="text-secondary mb-0">Add forms, routing, or authenticated dashboards later without reshaping the base structure.</p>
            </div>
            <div class="col-lg-4 text-lg-end">
              <a class="btn btn-light btn-lg rounded-pill px-4" href="#register">Get started</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
