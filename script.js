const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-category]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
const mobileDrawer = document.querySelector("[data-mobile-drawer]");
const drawerBackdrop = document.querySelector("[data-drawer-backdrop]");
const drawerLinks = document.querySelectorAll("[data-drawer-link]");
const sectionTransition = document.querySelector("[data-section-transition]");
const sectionLinks = document.querySelectorAll('a[href^="#"]:not(.skip-link)');
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const setDrawerState = (isOpen) => {
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  mobileDrawer?.classList.toggle("open", isOpen);
  mobileDrawer?.setAttribute("aria-hidden", String(!isOpen));
  if (mobileDrawer) {
    mobileDrawer.inert = !isOpen;
  }
  drawerBackdrop?.classList.toggle("visible", isOpen);
  document.body.classList.toggle("drawer-open", isOpen);
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setDrawerState(!isOpen);
});

menuClose?.addEventListener("click", () => setDrawerState(false));
drawerBackdrop?.addEventListener("click", () => setDrawerState(false));
drawerLinks.forEach((link) => link.addEventListener("click", () => setDrawerState(false)));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setDrawerState(false);
  }
});

const activateTransition = () => {
  if (!sectionTransition || reduceMotion.matches) {
    return;
  }

  sectionTransition.classList.remove("active");
  void sectionTransition.offsetWidth;
  sectionTransition.classList.add("active");
};

const markArrived = (target) => {
  if (reduceMotion.matches || !(target instanceof HTMLElement)) {
    return;
  }

  target.classList.remove("section-arrived");
  void target.offsetWidth;
  target.classList.add("section-arrived");
  window.setTimeout(() => target.classList.remove("section-arrived"), 1150);
};

const scrollToSection = (event) => {
  const link = event.currentTarget;
  const hash = link.getAttribute("href");

  if (!hash || hash === "#") {
    return;
  }

  const target = document.querySelector(hash);

  if (!target) {
    return;
  }

  event.preventDefault();
  setDrawerState(false);
  activateTransition();

  const headerHeight = header?.offsetHeight || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: reduceMotion.matches ? "auto" : "smooth",
  });

  window.setTimeout(() => {
    history.pushState(null, "", hash);
    markArrived(target);
  }, reduceMotion.matches ? 0 : 620);
};

sectionLinks.forEach((link) => link.addEventListener("click", scrollToSection));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activeFilter = button.dataset.filter;

    filterButtons.forEach((current) => {
      current.classList.toggle("active", current === button);
    });

    galleryItems.forEach((item) => {
      const shouldShow = activeFilter === "all" || item.dataset.category === activeFilter;
      item.classList.toggle("hidden", !shouldShow);
    });
  });
});
