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

const valueCards = [
  {
    icon: 'bi-person-check',
    title: 'Trusted Professionals',
    description: 'Connect with experienced repair specialists who bring dependable service to every job.',
  },
  {
    icon: 'bi-lightning-charge-fill',
    title: 'Fast Response',
    description: 'Move from request to action quickly with a platform designed for urgent home issues.',
  },
  {
    icon: 'bi-shield-lock-fill',
    title: 'Secure Platform',
    description: 'Keep requests and customer details protected with a clean, reliable digital flow.',
  },
  {
    icon: 'bi-camera-fill',
    title: 'Photo Uploads',
    description: 'Share visual details with your request so repairs can be diagnosed more accurately.',
  },
];

const popularServices = [
  { icon: 'bi-lightning-charge', title: 'Electrical' },
  { icon: 'bi-droplet-fill', title: 'Plumbing' },
  { icon: 'bi-brush-fill', title: 'Painting' },
  { icon: 'bi-house-gear-fill', title: 'Renovation' },
  { icon: 'bi-snow2', title: 'HVAC' },
  { icon: 'bi-window', title: 'Windows & Doors' },
];

const howItWorksSteps = [
  { icon: 'bi-person-plus-fill', title: 'Create Account' },
  { icon: 'bi-journal-plus', title: 'Submit Request' },
  { icon: 'bi-cloud-upload-fill', title: 'Upload Photos' },
  { icon: 'bi-person-badge-fill', title: 'Technician Review' },
  { icon: 'bi-check2-circle', title: 'Repair Completed' },
];

const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#privacy-policy' },
  { label: 'Terms of Service', href: '#terms-of-service' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com', icon: 'bi-github' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'bi-facebook' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'bi-linkedin' },
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

  const valueCardsMarkup = valueCards
    .map(
      (card) => `
        <div class="col-md-6 col-xl-3">
          <article class="feature-card h-100 hover-lift">
            <div class="card-icon mb-3"><i class="bi ${card.icon}"></i></div>
            <h2 class="h4 fw-bold">${card.title}</h2>
            <p class="text-secondary mb-0">${card.description}</p>
          </article>
        </div>
      `,
    )
    .join('');

  const popularServicesMarkup = popularServices
    .map(
      (service) => `
        <div class="col-sm-6 col-lg-4">
          <article class="feature-card service-card h-100 hover-lift">
            <div class="service-card-top">
              <div class="card-icon mb-3"><i class="bi ${service.icon}"></i></div>
              <h3 class="h4 fw-bold mb-0">${service.title}</h3>
            </div>
            <p class="text-secondary mb-4">Explore tailored repair and maintenance support for this service category.</p>
            <a class="btn btn-outline-primary rounded-pill px-4 mt-auto align-self-start" href="#contact">Learn More</a>
          </article>
        </div>
      `,
    )
    .join('');

  const howItWorksMarkup = howItWorksSteps
    .map(
      (step, index) => `
        <div class="col-12 col-lg step-col">
          <article class="feature-card step-card h-100 hover-lift">
            <div class="step-badge mb-3">Step ${index + 1}</div>
            <div class="card-icon mb-3"><i class="bi ${step.icon}"></i></div>
            <h3 class="h4 fw-bold mb-0">${step.title}</h3>
          </article>
          ${index < howItWorksSteps.length - 1 ? '<div class="step-connector d-none d-lg-flex"><i class="bi bi-arrow-right-short"></i></div>' : ''}
        </div>
      `,
    )
    .join('');

  const footerQuickLinks = footerLinks
    .map(
      (link) => `
        <li><a class="footer-link" href="${link.href}">${link.label}</a></li>
      `,
    )
    .join('');

  const footerLegalLinks = legalLinks
    .map(
      (link) => `
        <li><a class="footer-link" href="${link.href}">${link.label}</a></li>
      `,
    )
    .join('');

  const footerSocialLinks = socialLinks
    .map(
      (link) => `
        <a class="social-link" href="${link.href}" aria-label="${link.label}" target="_blank" rel="noreferrer">
          <i class="bi ${link.icon}"></i>
        </a>
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

    <section class="py-5" id="why-choose">
      <div class="container">
        <div class="section-title text-center text-lg-start">
          <span class="eyebrow">Why Choose FixHub</span>
          <h2 class="h1 fw-bold mt-2 mb-0">Why Choose FixHub</h2>
        </div>
        <div class="row g-4">
          ${valueCardsMarkup}
        </div>
      </div>
    </section>

    <section class="py-5" id="popular-services">
      <div class="container">
        <div class="section-title text-center text-lg-start">
          <span class="eyebrow">Popular Services</span>
          <h2 class="h1 fw-bold mt-2 mb-0">Popular Services</h2>
        </div>
        <div class="row g-4">
          ${popularServicesMarkup}
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

    <section class="py-5" id="how-it-works">
      <div class="container">
        <div class="section-title text-center">
          <span class="eyebrow">How It Works</span>
          <h2 class="h1 fw-bold mt-2 mb-0">How It Works</h2>
        </div>
        <div class="row g-4 step-flow align-items-stretch">
          ${howItWorksMarkup}
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="container">
        <div class="row g-4 g-lg-5">
          <div class="col-lg-4">
            <a class="footer-brand d-inline-flex align-items-center gap-2 text-decoration-none mb-3" href="#home">
              <span class="brand-badge"><i class="bi bi-hammer"></i></span>
              <span class="footer-brand-text">FixHub</span>
            </a>
            <p class="footer-description mb-0">
              A modern home repair platform built to help homeowners create requests, track progress, and complete repairs with confidence.
            </p>
          </div>

          <div class="col-6 col-lg-2">
            <h3 class="footer-heading">Quick Links</h3>
            <ul class="list-unstyled footer-list mb-0">
              ${footerQuickLinks}
            </ul>
          </div>

          <div class="col-6 col-lg-2">
            <h3 class="footer-heading">Legal</h3>
            <ul class="list-unstyled footer-list mb-0">
              ${footerLegalLinks}
            </ul>
          </div>

          <div class="col-lg-4">
            <h3 class="footer-heading">Social</h3>
            <div class="d-flex flex-wrap gap-3 mb-4">
              ${footerSocialLinks}
            </div>
            <p class="footer-copyright mb-0">© 2026 FixHub</p>
          </div>
        </div>
      </div>
    </footer>
  `;
}
