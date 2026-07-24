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
      <div class="container">
        <div class="hero-card">
          <div class="row align-items-center g-4 g-lg-5">
            <div class="col-lg-7">
              <span class="eyebrow">Home Repair & Service Requests</span>
              <h1 class="hero-title fw-bold">FixHub keeps home repairs simple, fast, and organized.</h1>
              <p class="hero-lead mb-4">
                Request home repair services, track needed work, and manage the first step of your service journey in one clean interface.
              </p>
              <div class="d-flex flex-wrap gap-3">
                <a class="btn btn-dark btn-lg rounded-pill px-4" href="#contact">Request service</a>
                <a class="btn btn-outline-dark btn-lg rounded-pill px-4" href="#services">See services</a>
              </div>
              <div class="row g-3 metric-grid">
                <div class="col-12 col-sm-4">
                  <div class="metric">
                    <span class="metric-value">24/7</span>
                    <span class="metric-label">Support window</span>
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="metric">
                    <span class="metric-value">Fast</span>
                    <span class="metric-label">Quote turnaround</span>
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="metric">
                    <span class="metric-value">Clear</span>
                    <span class="metric-label">Service requests</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-5">
              <div class="section-card">
                <span class="service-pill mb-3"><i class="bi bi-clipboard-check"></i> Today&apos;s focus</span>
                <h2 class="h3 fw-bold">A lightweight starter with a practical structure.</h2>
                <p class="text-secondary mb-0">
                  Bootstrap 5 handles the responsive layout, Bootstrap Icons provide the visual language, and the source tree stays modular for future growth.
                </p>
              </div>
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
