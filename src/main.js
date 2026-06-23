import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. SCROLL FLUIDO INERZIALE (LENIS)
// ==========================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0, 0);

// ==========================================
// 2. GSAP - ANIMAZIONI DI ENTRATA
// ==========================================
const initGSAPAnimations = () => {
  const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
  heroTl.to(".hero-subtitle", { y: 0, opacity: 1, duration: 1, delay: 0.2 })
        .to(".line-inner", { y: "0%", duration: 1.2, stagger: 0.15 }, "-=0.8")
        .to(".hero-desc", { y: 0, opacity: 1, duration: 1 }, "-=0.8")
        .to(".btn", { y: 0, opacity: 1, duration: 1 }, "-=0.8");

  gsap.to(".gsap-card", {
    scrollTrigger: { trigger: "#apps", start: "top 75%" },
    y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out"
  });

  gsap.to(".gsap-review", {
    scrollTrigger: { trigger: "#reviews", start: "top 80%" },
    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out"
  });

  gsap.to(".gsap-fade p", {
    scrollTrigger: { trigger: "#about", start: "top 80%" },
    y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out"
  });
};

// ==========================================
// 3. INTERAZIONI FISICHE (CURSORE E MAGNETE)
// ==========================================
const initInteractions = () => {
  if (window.innerWidth <= 768) return;

  const cursor = document.querySelector('.custom-cursor');
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  document.querySelectorAll('a, .btn, button, .card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  const wrapper = document.querySelector('.magnetic-wrapper');
  const btn = document.querySelector('.magnetic-btn');
  if (wrapper && btn) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x / 3}px, ${y / 3}px)`;
    });
    wrapper.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  }
};

// ==========================================
// 4. INTERNATIONALIZATION (I18N)
// ==========================================
const initI18n = () => {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;

  // Recupera la preferenza salvata, altrimenti forza l'inglese di default
  let currentLang = localStorage.getItem('donza_lang') || 'en';
  
  const updateLanguage = (lang) => {
    document.documentElement.lang = lang; // Cambia il tag html lang
    
    // Trova tutti gli elementi con la classe .i18n
    const elements = document.querySelectorAll('.i18n');
    elements.forEach(el => {
      // Inserisce il testo dell'attributo corrispondente (data-en o data-it)
      el.innerHTML = el.getAttribute(`data-${lang}`);
    });
    
    // Il bottone mostra la lingua in cui *puoi* passare (es. se sei in EN, il bottone mostra "IT")
    langToggle.textContent = lang === 'en' ? 'IT' : 'EN';
  };

  // Esegui subito l'aggiornamento all'avvio
  updateLanguage(currentLang);

  // Al click, cambia lingua e salvala in memoria
  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'it' : 'en';
    localStorage.setItem('donza_lang', currentLang);
    updateLanguage(currentLang);
  });
};

// ==========================================
// SETUP COMPLETO ALL'AVVIO
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  initInteractions();
  initI18n(); // <-- Avvia il sistema multilingua
  setTimeout(initGSAPAnimations, 100);
});