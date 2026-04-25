/**
 * Global Reach - include.js
 * Handles Header/Footer injection and Dynamic Property Grids
 */

function includeHTML() {
  const includes = [
    { id: "header", file: "partials/header.html" }, 
    { id: "footer", file: "partials/footer.html" },
    { id: "contact-form-container", file: "partials/contact-form.html" }
  ];

  const loadPromises = includes.map(item => {
    const el = document.getElementById(item.id);
    if (!el) return Promise.resolve();

    return fetch(item.file)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load ${item.file}`);
        return response.text();
      })
      .then(html => {
        el.innerHTML = html;
        if (item.id === "header") initHeader();
      })
      .catch(err => console.error("Include error:", err));
  });

  // Once layout is ready, load the properties
  return Promise.all(loadPromises).then(() => {
    initDynamicGrid();
  });
}

/**
 * DYNAMIC GRID LOADER
 */
function initDynamicGrid() {
  const gridContainer = document.getElementById("opportunities-grid");
  if (!gridContainer) return;

  const urlPath = window.location.pathname.toLowerCase();
  let jsonFile = "";

  if (urlPath.includes("br") || urlPath.includes("brazil")) {
    jsonFile = "br";
  } else if (urlPath.includes("jp") || urlPath.includes("japan")) {
    jsonFile = "jp";
  } else if (urlPath.includes("nz") || urlPath.includes("new-zealand")) {
    jsonFile = "nz";
  } else if (urlPath.includes("uk")) {
    jsonFile = "uk";
  }

  if (!jsonFile) return;

  const jsonPath = `data/${jsonFile}-data.json`;

  fetch(jsonPath)
    .then(response => {
      if (!response.ok) throw new Error(`Data file not found`);
      return response.json();
    })
    .then(data => {
      
      let symbol = "R$"; 
      if (jsonFile === "uk") symbol = "£";
      if (jsonFile === "jp") symbol = "¥";
      if (jsonFile === "nz") symbol = "NZ$";

      const cardsHtml = data.map(prop => `
  <article class="property-card"
    data-price="${prop.price}"
    data-size="${prop.size}"
    data-location="${prop.subLocation}" 
    data-status="${prop.status}">
    
    <div class="property-image-container">
       <img src="${prop.image}" alt="${prop.title}" loading="lazy"
            onerror="this.src='https://via.placeholder.com'">
       <div class="property-overlay">
          <h3 class="sharp-text">${prop.title}</h3>
       </div>
    </div>

    <div class="property-info">
      <p class="prop-detail"><strong>${prop.summary}</strong></p>
      <p class="prop-detail">${prop.subLocation}</p>
      <p class="prop-detail">${symbol}${prop.price.toLocaleString()} | ${prop.size} sqm</p>

       <div style="margin-top:15px;">
         <a href="${prop.link}" class="btn-small">View Details</a>
       </div>
    </div>
  </article>
`).join("");

      gridContainer.innerHTML = cardsHtml;
    })
    .catch(err => console.warn("Grid error:", err));
}


/**
 * HEADER NAVIGATION LOGIC
 * Handles active states and mobile toggle
 */
function initHeader() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (!header) return;

  // --- SMART ACTIVE LINK DETECTION ---
  // Gets current filename (e.g. "br.html") or defaults to "index.html"
  const fullPath = window.location.pathname;
  const currentFile = fullPath.split("/").pop() || "index.html";
  
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav a");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    
    // Reset classes before checking
    link.classList.remove("active");
    link.removeAttribute("aria-current");

    // Match filename exactly with href
    if (href === currentFile) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Sticky Header on scroll
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-shrunk", window.scrollY > 50);
  });

  // Mobile Menu Toggle
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");
      mobileNav.style.display = isOpen ? "flex" : "none";
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.innerHTML = isOpen ? "✕" : "☰"; 
    });
  }
}

// Initial Run
document.addEventListener("DOMContentLoaded", includeHTML);
