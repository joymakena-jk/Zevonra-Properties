const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/*==============================
      TOAST HELPER
==============================*/
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message){

    if(!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);

}

/*==============================
      HERO SLIDER
==============================*/
const slides = document.querySelectorAll(".slide");
const subtitle = document.querySelector(".hero-subtitle");

const texts = [
    "Luxury Villas",
    "Urban Prestige",
    "Coastal Escapes"
];

let currentSlide = 0;
let heroTimer;

function showSlide(index){

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");

    if(!subtitle) return;

    if(prefersReducedMotion){
        subtitle.textContent = texts[index];
        return;
    }

    subtitle.style.opacity = 0;

    setTimeout(() => {
        subtitle.textContent = texts[index];
        subtitle.style.opacity = 1;
    }, 300);

}

function nextSlide(){

    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);

}

if(slides.length){

    showSlide(currentSlide);

    if(!prefersReducedMotion){
        heroTimer = setInterval(nextSlide, 5000);
    }

}

/*==============================
      NAVBAR SCROLL
==============================*/
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if(navbar){
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }

});

/*==============================
      ACTIVE NAV LINK
==============================*/
const navSections = document.querySelectorAll("main section[id], .hero[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    navSections.forEach(section => {

        const top = section.offsetTop - 160;

        if(window.scrollY >= top){
            current = section.getAttribute("id");
        }

    });

    navAnchors.forEach(link => {

        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + current){
            link.classList.add("active");
        }

    });

});

/*==============================
      MOBILE MENU
==============================*/
const menuBtn = document.getElementById("menuBtn");
const navLinksEl = document.getElementById("navLinks");

function closeMobileMenu(){

    if(!navLinksEl || !menuBtn) return;

    navLinksEl.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

}

if(menuBtn && navLinksEl){

    menuBtn.addEventListener("click", () => {

        const isOpen = navLinksEl.classList.toggle("active");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape"){
            closeMobileMenu();
        }
    });

}

/*==============================
      REVEAL ON SCROLL
==============================*/
const revealElements = document.querySelectorAll(".reveal");

if(prefersReducedMotion){

    revealElements.forEach(el => el.classList.add("in-view"));

} else {

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

}

/*==============================
      IMAGE LIGHTBOX
      (used by interiors, lifestyle,
      and gallery sections)
==============================*/
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, caption){

    if(!lightbox || !lightboxImage) return;

    lightboxImage.src = src;
    lightboxImage.alt = caption || "";
    if(lightboxCaption) lightboxCaption.textContent = caption || "";

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

}

function closeLightbox(){

    if(!lightbox) return;

    lightbox.classList.remove("active");
    document.body.style.overflow = "";

}

if(lightboxClose){
    lightboxClose.addEventListener("click", closeLightbox);
}

if(lightbox){

    lightbox.addEventListener("click", (e) => {
        if(e.target === lightbox){
            closeLightbox();
        }
    });

}

document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && lightbox && lightbox.classList.contains("active")){
        closeLightbox();
    }
});

// Wire up interior cards
document.querySelectorAll(".interior-card").forEach(card => {

    const activate = () => {
        const img = card.querySelector("img");
        const title = card.querySelector("h3");
        if(img) openLightbox(img.src, title ? title.textContent : "");
    };

    card.addEventListener("click", activate);
    card.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " "){
            e.preventDefault();
            activate();
        }
    });

});

// Wire up lifestyle cards
document.querySelectorAll(".lifestyle-card").forEach(card => {

    const activate = () => {
        const img = card.querySelector("img");
        const title = card.querySelector("h3");
        if(img) openLightbox(img.src, title ? title.textContent : "");
    };

    card.addEventListener("click", activate);
    card.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " "){
            e.preventDefault();
            activate();
        }
    });

});

/*==============================
      STAT COUNTERS
==============================*/
const statNumbers = document.querySelectorAll(".stat-num");

function animateStat(el){

    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";

    if(prefersReducedMotion){
        el.textContent = target.toLocaleString() + suffix;
        return;
    }

    const duration = 1800;
    const startTime = performance.now();

    function tick(now){

        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;

        if(progress < 1){
            requestAnimationFrame(tick);
        } else {
            el.textContent = target.toLocaleString() + suffix;
        }

    }

    requestAnimationFrame(tick);

}

if(statNumbers.length){

    const statObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){
                animateStat(entry.target);
                statObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));

}

/*==============================
      GALLERY SCROLL ARROWS
==============================*/
const galleryTrack = document.getElementById("galleryTrack");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");

function scrollGallery(direction){

    if(!galleryTrack) return;

    const firstItem = galleryTrack.querySelector(".gallery-item");
    const step = firstItem ? firstItem.getBoundingClientRect().width + 24 : 340;

    galleryTrack.scrollBy({
        left: direction * step,
        behavior: prefersReducedMotion ? "auto" : "smooth"
    });

}

if(galleryPrev){
    galleryPrev.addEventListener("click", () => scrollGallery(-1));
}

if(galleryNext){
    galleryNext.addEventListener("click", () => scrollGallery(1));
}

/*==============================
      GALLERY ROTATION + LIGHTBOX
      Each .gallery-item reads its
      data-images attribute (comma
      separated paths). If more than
      one path is listed, the tile
      cross-fades between them
      automatically. Click/Enter opens
      whichever image is currently
      showing in a full lightbox.
==============================*/
document.querySelectorAll(".gallery-item").forEach(item => {

    const raw = item.getAttribute("data-images") || "";
    const paths = raw.split(",").map(p => p.trim()).filter(Boolean);
    const baseImg = item.querySelector("img");
    const titleEl = item.querySelector("h3");

    let activeIndex = 0;
    const layers = [baseImg];

    if(paths.length > 1 && baseImg){

        baseImg.classList.add("gallery-crossfade", "active");

        // Build one stacked <img> per extra path for smooth cross-fading
        paths.slice(1).forEach(path => {

            const layer = document.createElement("img");
            layer.src = path;
            layer.alt = baseImg.alt;
            layer.classList.add("gallery-crossfade");
            item.appendChild(layer);
            layers.push(layer);

        });

        if(!prefersReducedMotion){

            setInterval(() => {

                layers[activeIndex].classList.remove("active");
                activeIndex = (activeIndex + 1) % layers.length;
                layers[activeIndex].classList.add("active");

            }, 3500 + Math.random() * 800);

        }

    }

    const activate = () => {
        const current = layers[activeIndex] || baseImg;
        if(current) openLightbox(current.src, titleEl ? titleEl.textContent : "");
    };

    item.addEventListener("click", activate);
    item.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " "){
            e.preventDefault();
            activate();
        }
    });

});

/*==============================
      PROPERTY MODAL
==============================*/
const propertyModal = document.getElementById("propertyModal");
const propertyModalClose = document.getElementById("propertyModalClose");
const modalPropertyImage = document.getElementById("modalPropertyImage");
const modalPropertyTitle = document.getElementById("modalPropertyTitle");
const modalPropertyLocation = document.getElementById("modalPropertyLocation");
const modalPropertyPrice = document.getElementById("modalPropertyPrice");
const modalPropertyDesc = document.getElementById("modalPropertyDesc");

function openPropertyModal(data){

    if(!propertyModal) return;

    modalPropertyImage.src = data.image;
    modalPropertyImage.alt = data.title;
    modalPropertyTitle.textContent = data.title;
    modalPropertyLocation.textContent = data.location;
    modalPropertyPrice.textContent = data.price;
    modalPropertyDesc.textContent = data.desc;

    propertyModal.classList.add("active");
    document.body.style.overflow = "hidden";

}

function closePropertyModal(){

    if(!propertyModal) return;

    propertyModal.classList.remove("active");
    document.body.style.overflow = "";

}

document.querySelectorAll(".view-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        const card = btn.closest(".property-card");
        const img = card ? card.querySelector("img") : null;

        openPropertyModal({
            image: img ? img.src : "",
            title: btn.dataset.title,
            location: btn.dataset.location,
            price: btn.dataset.price,
            desc: btn.dataset.desc
        });

    });

});

if(propertyModalClose){
    propertyModalClose.addEventListener("click", closePropertyModal);
}

if(propertyModal){

    propertyModal.addEventListener("click", (e) => {
        if(e.target === propertyModal){
            closePropertyModal();
        }
    });

}

document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && propertyModal && propertyModal.classList.contains("active")){
        closePropertyModal();
    }
});

/*==============================
      BACK TO TOP
==============================*/
const backToTop = document.getElementById("backToTop");

if(backToTop){

    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("visible", window.scrollY > 600);
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

}

/*==============================
      CONTACT FORM
      Demo mode: this form does not send to a
      real backend. It validates input and shows
      a success confirmation, so the interaction
      feels complete for portfolio/demo purposes.
      To wire up real delivery later, sign up at
      https://formspree.io, replace YOUR_FORM_ID in
      index.html's form action, and swap the
      simulated block below for a real fetch() call.
==============================*/
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if(contactForm){

    contactForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();

        if(!name || !email || !message){
            formMsg.textContent = "Please fill in your name, email, and message.";
            return;
        }

        const submitBtn = document.getElementById("contactSubmit");
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
        formMsg.textContent = "";

        setTimeout(() => {

            formMsg.textContent = "Thank you — your inquiry has been sent. We'll be in touch shortly.";
            showToast("Inquiry sent!");
            contactForm.reset();

            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;

        }, 900);

    });

}
