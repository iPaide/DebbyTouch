const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-category]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
const mobileDrawer = document.querySelector("[data-mobile-drawer]");
const drawerBackdrop = document.querySelector("[data-drawer-backdrop]");
const drawerLinks = document.querySelectorAll("[data-drawer-link]");

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
