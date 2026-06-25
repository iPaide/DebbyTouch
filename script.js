import "./gsap.min.js?v=module-safe";
import "./ScrollTrigger.min.js?v=module-safe";

const header = document.querySelector("[data-header]");
const hero = document.querySelector(".hero");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-category]");
const galleryFigures = document.querySelectorAll(".gallery-item");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
const mobileDrawer = document.querySelector("[data-mobile-drawer]");
const drawerBackdrop = document.querySelector("[data-drawer-backdrop]");
const drawerLinks = document.querySelectorAll("[data-drawer-link]");
const sectionTransition = document.querySelector("[data-section-transition]");
const sectionLinks = document.querySelectorAll('a[href^="#"]:not(.skip-link)');
const magneticItems = document.querySelectorAll(".button, .nav-cta, .drawer-cta, .filter-button");
const depthItems = document.querySelectorAll(".service-card, .class-card, .gallery-item");
const luxuryVideos = document.querySelectorAll("[data-luxury-video]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeLightboxIndex = 0;

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

luxuryVideos.forEach((video) => {
  const motionLayer = video.closest(".class-motion");

  if (reduceMotion.matches) {
    video.pause();
    return;
  }

  const showPosterFallback = () => {
    if (video.readyState < 2) {
      motionLayer?.classList.add("video-fallback");
    }
  };

  const fallbackTimer = window.setTimeout(showPosterFallback, 1800);

  video.addEventListener("canplay", () => window.clearTimeout(fallbackTimer), { once: true });
  video.addEventListener("error", () => {
    window.clearTimeout(fallbackTimer);
    motionLayer?.classList.add("video-fallback");
  }, { once: true });
});

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
  if (lightbox?.classList.contains("open")) {
    if (event.key === "Escape") {
      closeLightbox();
    }
    if (event.key === "ArrowLeft") {
      showLightboxImage(activeLightboxIndex - 1);
    }
    if (event.key === "ArrowRight") {
      showLightboxImage(activeLightboxIndex + 1);
    }
    return;
  }

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

window.addEventListener("load", () => {
  if (!location.hash) {
    return;
  }

  const target = document.querySelector(location.hash);

  if (!target) {
    return;
  }

  window.setTimeout(() => {
    const headerHeight = header?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    markArrived(target);
  }, 90);
});

const runLuxuryMotion = () => {
  const { gsap } = window;

  if (!gsap || reduceMotion.matches) {
    return;
  }

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  gsap.set(".hero-content .eyebrow, .hero-content h1, .hero-content > p:not(.eyebrow), .hero-content .button", {
    autoAlpha: 0,
    y: 28,
  });

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to(".hero-content .eyebrow", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.15)
    .to(".hero-content h1", { autoAlpha: 1, y: 0, duration: 1.05 }, 0.32)
    .to(".hero-content > p:not(.eyebrow)", { autoAlpha: 1, y: 0, duration: 0.86 }, 0.58)
    .to(".hero-content .button", { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.1 }, 0.82);

  if (window.ScrollTrigger) {
    revealItems.forEach((item) => {
      gsap.fromTo(
        item,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            once: true,
            onEnter: () => item.classList.add("visible"),
          },
        }
      );
    });

    document.querySelectorAll(".section-heading, .section-copy, .bridal-copy, .class-copy").forEach((block) => {
      gsap.fromTo(
        block.children,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 82%",
            once: true,
          },
        }
      );
    });

    gsap.to(".portrait-frame img", {
      yPercent: -7,
      ease: "none",
      scrollTrigger: {
        trigger: ".about",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    gsap.to(".bridal-image img", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".bridal",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.7,
      },
    });
  }
};

runLuxuryMotion();

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

if (!reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  hero?.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;

    hero.style.setProperty("--hero-parallax-x", `${x}px`);
    hero.style.setProperty("--hero-parallax-y", `${y}px`);
  });

  hero?.addEventListener("pointerleave", () => {
    hero.style.setProperty("--hero-parallax-x", "0px");
    hero.style.setProperty("--hero-parallax-y", "0px");
  });

  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

      item.style.setProperty("--magnet-x", `${x}px`);
      item.style.setProperty("--magnet-y", `${y}px`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--magnet-x", "0px");
      item.style.setProperty("--magnet-y", "0px");
    });
  });

  depthItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      item.style.setProperty("--tilt-x", `${-y * 3.5}deg`);
      item.style.setProperty("--tilt-y", `${x * 4.5}deg`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
    });
  });
}

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

    if (window.gsap && !reduceMotion.matches) {
      window.gsap.fromTo(
        ".gallery-item:not(.hidden)",
        { autoAlpha: 0, y: 18, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.52, stagger: 0.06, ease: "power2.out" }
      );
    }
  });
});

const visibleGalleryItems = () => Array.from(galleryFigures).filter((item) => !item.classList.contains("hidden"));

const showLightboxImage = (index) => {
  const items = visibleGalleryItems();

  if (!items.length || !lightboxImage || !lightboxCaption) {
    return;
  }

  activeLightboxIndex = (index + items.length) % items.length;
  const item = items[activeLightboxIndex];
  const image = item.querySelector("img");
  const caption = item.querySelector("figcaption")?.textContent || image?.alt || "";

  if (!image) {
    return;
  }

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption;

  if (window.gsap && !reduceMotion.matches) {
    window.gsap.fromTo(lightboxImage, { autoAlpha: 0, scale: 1.02 }, { autoAlpha: 1, scale: 1, duration: 0.42, ease: "power2.out" });
  }
};

function openLightbox(item) {
  if (!lightbox) {
    return;
  }

  const items = visibleGalleryItems();
  const index = items.indexOf(item);

  showLightboxImage(index >= 0 ? index : 0);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

galleryFigures.forEach((item) => {
  item.addEventListener("click", () => openLightbox(item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(item);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => showLightboxImage(activeLightboxIndex - 1));
lightboxNext?.addEventListener("click", () => showLightboxImage(activeLightboxIndex + 1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});
