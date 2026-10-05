/* ==========================================================================
   Guia dos 30 Dias: comportamentos da página
   A página funciona normalmente sem este arquivo; ele só melhora a experiência.
   ========================================================================== */

(function () {
  "use strict";

  /* 1. Ano atual no rodapé ------------------------------------------------ */
  function setCurrentYear() {
    var el = document.getElementById("ano-atual");
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  /* 2. FAQ: mantém apenas uma pergunta aberta por vez --------------------- */
  function initFaqAccordion() {
    var items = document.querySelectorAll(".faq details");

    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  /* 3. Menu: destaca o link da seção que está na tela --------------------- */
  function initActiveNav() {
    if (!("IntersectionObserver" in window)) return;

    var links = document.querySelectorAll('.nav__links a[href^="#"]');
    var byId = {};

    links.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = byId[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("is-active");
              l.removeAttribute("aria-current");
            });
            link.classList.add("is-active");
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* Inicialização --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    setCurrentYear();
    initFaqAccordion();
    initActiveNav();
  });
})();
