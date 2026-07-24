import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/styles.css';
import { renderNavbar } from './js/components/navbar.js';
import { renderHomePage } from './js/pages/home.js';

const app = document.querySelector('#app');

if (app) {
  app.innerHTML = `
    ${renderNavbar()}
    <main>
      ${renderHomePage()}
    </main>
  `;
}
