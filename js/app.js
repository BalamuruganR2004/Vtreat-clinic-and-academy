document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. LENIS SMOOTH SCROLL INITIALIZATION
  // ==========================================
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      if (lenis) lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Integrate Lenis with GSAP ScrollTrigger
  if (lenis && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      if (lenis) lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ==========================================
  // 2. NAV & MOBILE MENU INTERACTION
  // ==========================================
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  window.toggleMobileMenu = function() {
    if (mobileMenu) mobileMenu.classList.toggle('is-open');
    if (menuToggle) menuToggle.classList.toggle('is-active');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', window.toggleMobileMenu);
  }

  // Close mobile menu on Escape keypress
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
      window.toggleMobileMenu();
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('is-open')) {
      const clickedToggle = menuToggle && (menuToggle === e.target || menuToggle.contains(e.target));
      const clickedMenu = mobileMenu === e.target || mobileMenu.contains(e.target);
      if (!clickedToggle && !clickedMenu) {
        window.toggleMobileMenu();
      }
    }
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  });

  // ==========================================
  // 3. CINEMATIC LOADER ANIMATION (GSAP)
  // ==========================================
  gsap.registerPlugin(ScrollTrigger);

  // ==========================================
  // 3. CINEMATIC LOADER ANIMATION (GSAP)
  // ==========================================
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Custom Cursor
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    
    if (dot && ring) {
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
      
      const xDotTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
      const yDotTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
      const xRingTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
      const yRingTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
      
      window.addEventListener('mousemove', (e) => {
        dot.classList.remove('is-hidden');
        ring.classList.remove('is-hidden');
        xDotTo(e.clientX);
        yDotTo(e.clientY);
        xRingTo(e.clientX);
        yRingTo(e.clientY);
      });
      
      document.addEventListener('mouseleave', () => {
        dot.classList.add('is-hidden');
        ring.classList.add('is-hidden');
      });

      // Wire up interactive cursor sizing
      const hoverElements = document.querySelectorAll('a, button, .btn, .sig-timeline-step, .ba-tab-btn, .course-card, .treatment-card, .faq-btn');
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('is-hovering');
          ring.classList.add('is-hovering');
        });
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('is-hovering');
          ring.classList.remove('is-hovering');
        });
      });

      // Before & After slider: show "DRAG"
      const baSliderEl = document.getElementById('ba-slider');
      if (baSliderEl) {
        baSliderEl.addEventListener('mouseenter', () => {
          ring.classList.add('has-text');
          ring.setAttribute('data-text', 'DRAG');
        });
        baSliderEl.addEventListener('mouseleave', () => {
          ring.classList.remove('has-text');
          ring.removeAttribute('data-text');
        });
      }

      // Gallery slots: show "VIEW"
      const gallerySlots = document.querySelectorAll('[id^="gallery-img-"]');
      gallerySlots.forEach(slot => {
        slot.addEventListener('mouseenter', () => {
          ring.classList.add('has-text');
          ring.setAttribute('data-text', 'VIEW');
        });
        slot.addEventListener('mouseleave', () => {
          ring.classList.remove('has-text');
          ring.removeAttribute('data-text');
        });
      });
    }

    const loaderTimeline = gsap.timeline({
      onComplete: () => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('is-hidden');
        
        // Luxury zoom out hero entrance
        gsap.fromTo('.hero__bg-image', { scale: 1.15 }, { scale: 1, duration: 2.5, ease: 'power3.out' });
        initScrollAnimations();
      }
    });

    // Initial fade-in of loader elements
    loaderTimeline.to('#loader-logo', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
      .to('.loader__bar-track', { opacity: 1, duration: 0.4 }, '-=0.4')
      .to('#loader-tagline', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');

    // Progress bar fill & percent value counter
    const progressObj = { value: 0 };
    loaderTimeline.to(progressObj, {
      value: 100,
      duration: 2.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        const fill = document.getElementById('loader-fill');
        const percent = document.getElementById('loader-percent');
        const val = Math.floor(progressObj.value);
        if (fill) fill.style.width = `${val}%`;
        if (percent) percent.textContent = `${val}%`;
      }
    });

    // Hide loader elegantly by shifting up
    loaderTimeline.to('#loader', { yPercent: -100, duration: 1.0, ease: 'power4.inOut' }, '+=0.2');
  } else {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('is-hidden');
  }

  
  // ==========================================
  // 4. GSAP SCROLLTRIGGER ANIMATIONS (CINEMATIC)
  // ==========================================
  function initScrollAnimations() {
    // Stats increment counters (Premium ease)
    const statsNumbers = document.querySelectorAll('.stats__number');
    statsNumbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'), 10);
      const span = num.querySelector('span');
      const suffix = span ? span.textContent : '';
      
      num.textContent = '0' + suffix;
      const countObj = { value: 0 };
      
      gsap.to(countObj, {
        value: target,
        scrollTrigger: {
          trigger: num,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        duration: 2.5,
        ease: 'power4.out',
        onUpdate: () => {
          num.innerHTML = Math.floor(countObj.value).toLocaleString() + `<span>${suffix}</span>`;
        }
      });
    });

    // Editorial Text Line reveals (Dynamic line wrapping)
    const titleElements = document.querySelectorAll('.section-title');
    titleElements.forEach(title => {
      const originalHTML = title.innerHTML;
      // Wrap content in line mask elements
      title.innerHTML = `<span class="line-mask"><span class="line-mask-inner">${originalHTML}</span></span>`;
      const inner = title.querySelector('.line-mask-inner');
      
      gsap.to(inner, {
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
          onEnter: () => inner.classList.add('is-visible')
        }
      });
    });

    // Image Unfold reveals
    const visualImages = document.querySelectorAll('.about__image-wrap img, .case-study-visual img, .sig-card-visual img, .why-choose img');
    visualImages.forEach(img => {
      img.classList.add('img-reveal-unfold');
      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: 'top 85%',
          onEnter: () => img.classList.add('is-visible')
        }
      });
    });

    // Premium reveal for cards and details
    const revealElements = document.querySelectorAll('.why-card, .course-card, .treatment-card, .consult-step, .consultation__step, .editorial-story, .trust-plaque');
    revealElements.forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Parallax Gallery Items
    const galleryItems = document.querySelectorAll('[id^="gallery-img-"]');
    galleryItems.forEach((item, index) => {
      const speed = (index % 3 + 1) * 0.05; // Different speeds
      gsap.to(item, {
        y: () => -(window.innerHeight * speed),
        ease: 'none',
        scrollTrigger: {
          id: 'gallery-parallax-' + index,
          trigger: '.social-proof',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });

    // Hero Text Staggered Reveal
    const heroReveals = document.querySelectorAll('.hero-reveal');
    if (heroReveals.length > 0) {
      gsap.fromTo(heroReveals, 
        { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.5, stagger: 0.2, ease: 'power4.out', delay: 0.5 }
      );
    }
    
    // Hero Image Parallax
    const heroBg = document.querySelector('.hero__bg-image');
    if (heroBg) {
      gsap.to(heroBg, {
        y: '25%', // move image down slightly as user scrolls down
        ease: 'none',
        scrollTrigger: {
          id: 'hero-parallax',
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Scroll Progress bar percentage
    const scrollBar = document.querySelector('.scroll-progress');
    if (scrollBar) {
      gsap.to(scrollBar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });
    }

    // Initialize Micro-Interactions
    initMicroInteractions();
  }

  // ==========================================
  // 4.5 MICRO-INTERACTIONS & PARTICLES
  // ==========================================
  function initMicroInteractions() {
    // Magnetic Buttons (With dynamic quickTo physics damping)
    const magnets = document.querySelectorAll('.magnetic-btn');
    magnets.forEach(btn => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power2.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power2.out" });
      
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        xTo(x * 0.35);
        yTo(y * 0.35);
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          duration: 0.8,
          x: 0,
          y: 0,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });

    // 3D Card Tilt Effect
    const tiltCards = document.querySelectorAll('.tilt-card, .course-card, .treatment-card, .why-card');
    tiltCards.forEach(card => {
      card.classList.add('tilt-card');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Soft tilt limits (Max 7 degrees)
        const rotX = -(y / (rect.height / 2)) * 7;
        const rotY = (x / (rect.width / 2)) * 7;
        
        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      });
    });

    // Specular Highlight (Mouse tracking on cards)
    const cards = document.querySelectorAll('.specular-highlight');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });

    // Hero Gold Dust Particles
    const heroSection = document.querySelector('.hero');
    if(heroSection) {
      const particleCount = 25;
      for(let i=0; i<particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'gold-dust-particle';
        p.style.position = 'absolute';
        p.style.width = Math.random() * 3 + 1 + 'px';
        p.style.height = p.style.width;
        p.style.background = 'rgba(201, 162, 76, ' + (Math.random() * 0.5 + 0.2) + ')';
        p.style.borderRadius = '50%';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.pointerEvents = 'none';
        p.style.zIndex = 2;
        p.style.boxShadow = '0 0 10px rgba(201, 162, 76, 0.8)';
        
        // Random float animation
        p.animate([
          { transform: `translate(0, 0)`, opacity: 0 },
          { opacity: 1, offset: 0.1 },
          { transform: `translate(${Math.random() * 100 - 50}px, -${Math.random() * 200 + 100}px)`, opacity: 0 }
        ], {
          duration: Math.random() * 10000 + 10000,
          iterations: Infinity,
          delay: Math.random() * 5000,
          easing: 'ease-in-out'
        });
        
        heroSection.appendChild(p);
      }
    }
  }

  // ==========================================
  // 5. TREATMENTS TAB MENU PANELS
  // ==========================================
  const treatmentTabBtns = document.querySelectorAll('.treatment-tab-btn');
  const treatmentPanels = document.querySelectorAll('.treatment-panel');

  treatmentTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      treatmentTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const targetTab = btn.getAttribute('data-tab');
      treatmentPanels.forEach(panel => {
        if (panel.id === `panel-${targetTab}`) {
          panel.style.display = 'block';
          gsap.fromTo(panel, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 6. COURSES FILTER PATHWAYS
  // ==========================================
  const courseTabBtns = document.querySelectorAll('.course-tab-btn');
  const courseCards = document.querySelectorAll('.course-card');

  courseTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      courseTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      const hideCards = [];
      const showCards = [];
      
      courseCards.forEach(card => {
        const track = card.getAttribute('data-track');
        if (filter === 'all' || track === filter) {
          showCards.push(card);
        } else {
          hideCards.push(card);
        }
      });
      
      if (hideCards.length > 0) {
        gsap.to(hideCards, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          display: 'none',
          overwrite: 'auto'
        });
      }
      
      if (showCards.length > 0) {
        gsap.fromTo(showCards, {
          opacity: 0,
          scale: 0.8
        }, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          display: 'block',
          stagger: 0.05,
          overwrite: 'auto'
        });
      }
    });
  });

  // ==========================================
  // 7. FAQ ACCORDION TRANSITIONS
  // ==========================================
  const faqBtns = document.querySelectorAll('.faq-btn');
  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const answer = parent.querySelector('.faq-answer');
      const icon = btn.querySelector('.fa-chevron-down');
      
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
      
      // Accordion mode: close others
      document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.style.maxHeight = '0px';
      });
      document.querySelectorAll('.faq-btn i').forEach(ico => {
        ico.style.transform = 'rotate(0deg)';
      });
      
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // ==========================================
  // 8. DRAGGABLE BEFORE/AFTER SLIDER
  // ==========================================
  const baSlider = document.getElementById('ba-slider');
  const baBefore = document.getElementById('ba-before-img') || document.getElementById('ba-before');
  const baDivider = document.getElementById('ba-divider');

  if (baSlider && baBefore && baDivider) {
    const handleSliderMove = (e) => {
      if (e.type === 'touchmove') {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
      const rect = baSlider.getBoundingClientRect();
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      let x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      
      baDivider.style.left = `${percentage}%`;
      baBefore.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    };

    baSlider.addEventListener('mousemove', handleSliderMove);
    baSlider.addEventListener('touchmove', handleSliderMove, { passive: false });
  }

  // ==========================================
  // 9. CONTACT FORM VALIDATION & WHATSAPP
  // ==========================================
  const enquiryForm = document.getElementById('enquiry-form');
  const formFeedback = document.getElementById('form-feedback');
  const btnWhatsapp = document.getElementById('btn-whatsapp');

  if (enquiryForm && formFeedback) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('form-name').value.trim();
      const phoneVal = document.getElementById('form-phone').value.trim();
      
      if (!nameVal || !phoneVal) {
        formFeedback.style.display = 'block';
        formFeedback.style.color = '#e74c3c';
        formFeedback.textContent = 'Name and Phone Number are required fields.';
        return;
      }
      
      formFeedback.style.display = 'block';
      formFeedback.style.color = 'var(--color-primary)';
      formFeedback.textContent = 'Thank you! Your enquiry has been received. Our team will contact you shortly.';
      
      enquiryForm.reset();
    });
  }

  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', () => {
      const nameVal = document.getElementById('form-name').value.trim();
      const emailVal = document.getElementById('form-email').value.trim();
      const phoneVal = document.getElementById('form-phone').value.trim();
      const cityVal = document.getElementById('form-city').value.trim();
      const interestVal = document.getElementById('form-interest').value;
      const messageVal = document.getElementById('form-message').value.trim();
      
      if (!nameVal || !phoneVal) {
        formFeedback.style.display = 'block';
        formFeedback.style.color = '#e74c3c';
        formFeedback.textContent = 'Name and Phone Number are required to send via WhatsApp.';
        return;
      }
      
      let text = `Hi V-Treat! I'm submitting an enquiry.\n\n`;
      text += `Name: ${nameVal}\n`;
      text += `Phone: ${phoneVal}\n`;
      if (emailVal) text += `Email: ${emailVal}\n`;
      if (cityVal) text += `City: ${cityVal}\n`;
      if (interestVal) text += `Interest: ${interestVal}\n`;
      if (messageVal) text += `Message: ${messageVal}\n`;
      
      const encodedText = encodeURIComponent(text);
      const url = `https://wa.me/917904280255?text=${encodedText}`;
      window.open(url, '_blank');
    });
  }

  // ==========================================
  // 10. AI ASSISTANT CHATBOT DECISION TREE
  // ==========================================
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotPanel = document.getElementById('chatbot-panel');
  const chatbotClose = document.getElementById('chatbot-close');
  const messagesContainer = document.getElementById('chatbot-messages');
  const repliesContainer = document.getElementById('chatbot-replies');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');

  const chatFlow = {
    start: {
      msg: "Hi, I am the V-Treat Assistant. I can help you find the right Academy course or book a clinic treatment. What brings you here today?",
      replies: [
        { text: "Join the Academy", next: "join" },
        { text: "Book Clinic Treatment", next: "book" },
        { text: "Course fees & details", next: "fees" },
        { text: "Talk to us on WhatsApp", next: "whatsapp_general" }
      ]
    },
    join: {
      msg: "V-Treat Academy is the premier training institute in Madurai, offering verified live patient training. We have two tracks: Medical and Non-Medical. Which track are you interested in?",
      replies: [
        { text: "Medical Track (Doctors)", next: "medical_track" },
        { text: "Non-Medical Track", next: "non_medical_track" },
        { text: "Go Back", next: "start" }
      ]
    },
    medical_track: {
      msg: "For MBBS, BDS, and AYUSH graduates, we offer premium Fellowships and PG Diplomas with extensive patient hands-on. Would you like to check fees or speak with our admission counselor?",
      replies: [
        { text: "Check Course Fees", next: "fees" },
        { text: "Speak with Counselor", next: "whatsapp_counselor" },
        { text: "Go Back", next: "join" }
      ]
    },
    non_medical_track: {
      msg: "For beauty professionals, nurses, and entrepreneurs, we offer Board Certified PMU, Microblading, and Korean Skincare masterclasses. Would you like to check fees or speak with our admission counselor?",
      replies: [
        { text: "Check Course Fees", next: "fees" },
        { text: "Speak with Counselor", next: "whatsapp_counselor" },
        { text: "Go Back", next: "join" }
      ]
    },
    fees: {
      msg: "Course fees vary by duration (1 to 6 months) and track. Installment plans are available. Let's redirect you to WhatsApp for the current fee structure brochure.",
      replies: [
        { text: "Get Fee Brochure (WhatsApp)", next: "whatsapp_fees" },
        { text: "Go Back", next: "start" }
      ]
    },
    book: {
      msg: "V-Treat Clinic is a doctor-led multi-speciality center for skin, hair, laser, PMU, dental, and wellness. Which department are you looking for?",
      replies: [
        { text: "Skin & Laser Care", next: "clinic_skin" },
        { text: "Dental Care", next: "clinic_dental" },
        { text: "Hair & Scalp Care", next: "clinic_hair" },
        { text: "Permanent Makeup (PMU)", next: "clinic_pmu" },
        { text: "Go Back", next: "start" }
      ]
    },
    clinic_skin: {
      msg: "Excellent. All our clinical skin and laser procedures are performed by qualified doctors under strict sterilization. Would you like to check slot availability on WhatsApp?",
      replies: [
        { text: "Book Skin Appt (WhatsApp)", next: "whatsapp_book_skin" },
        { text: "Go Back", next: "book" }
      ]
    },
    clinic_dental: {
      msg: "Excellent. We provide comprehensive family dental care, smile designing, and advanced implants. Would you like to check slot availability on WhatsApp?",
      replies: [
        { text: "Book Dental Appt (WhatsApp)", next: "whatsapp_book_dental" },
        { text: "Go Back", next: "book" }
      ]
    },
    clinic_hair: {
      msg: "Excellent. We offer clinical hair restoration, scalp detox, PRP, and hair transplant programs. Would you like to check slot availability on WhatsApp?",
      replies: [
        { text: "Book Hair Appt (WhatsApp)", next: "whatsapp_book_hair" },
        { text: "Go Back", next: "book" }
      ]
    },
    clinic_pmu: {
      msg: "Excellent. We offer eyebrow microblading/shading, lip blush, and defined eyeliner services. Would you like to check slot availability on WhatsApp?",
      replies: [
        { text: "Book PMU Appt (WhatsApp)", next: "whatsapp_book_pmu" },
        { text: "Go Back", next: "book" }
      ]
    }
  };

  const whatsappRedirects = {
    whatsapp_general: "Hi V-Treat! I have a general enquiry about your clinic and academy services.",
    whatsapp_counselor: "Hi V-Treat! I'd like to speak with an admissions counselor about your academy courses.",
    whatsapp_fees: "Hi V-Treat! I would like to receive the course fee structure brochure for V-Treat Academy.",
    whatsapp_book_skin: "Hi V-Treat! I would like to book an appointment for Skin & Laser care consultation.",
    whatsapp_book_dental: "Hi V-Treat! I would like to book a Dental Care appointment consultation.",
    whatsapp_book_hair: "Hi V-Treat! I would like to book a Hair & Scalp Care appointment consultation.",
    whatsapp_book_pmu: "Hi V-Treat! I would like to book a Permanent Makeup (PMU) appointment consultation."
  };

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg--${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'ai-msg__bubble';
    bubble.textContent = text;
    
    const time = document.createElement('span');
    time.className = 'ai-msg__time';
    time.textContent = 'Just now';
    
    msgDiv.appendChild(bubble);
    msgDiv.appendChild(time);
    messagesContainer.appendChild(msgDiv);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-msg ai-msg--bot typing-indicator';
    typingDiv.innerHTML = `
      <div class="ai-msg__bubble" style="padding: 10px 15px;">
        <span class="dot" style="display:inline-block; width:6px; height:6px; background:#C9A24C; border-radius:50%; margin-right:3px; animation: bounce 1.4s infinite both;"></span>
        <span class="dot" style="display:inline-block; width:6px; height:6px; background:#C9A24C; border-radius:50%; margin-right:3px; animation: bounce 1.4s infinite both; animation-delay: .2s;"></span>
        <span class="dot" style="display:inline-block; width:6px; height:6px; background:#C9A24C; border-radius:50%; animation: bounce 1.4s infinite both; animation-delay: .4s;"></span>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingDiv;
  }

  function handleNode(nodeKey) {
    repliesContainer.innerHTML = '';
    const indicator = showTypingIndicator();
    
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
      
      if (whatsappRedirects[nodeKey]) {
        const text = whatsappRedirects[nodeKey];
        const encodedText = encodeURIComponent(text);
        const url = `https://wa.me/917904280255?text=${encodedText}`;
        
        appendMessage('bot', `Opening WhatsApp for: "${text}"...`);
        window.open(url, '_blank');
        handleNode('start');
        return;
      }
      
      const node = chatFlow[nodeKey];
      if (node) {
        appendMessage('bot', node.msg);
        
        node.replies.forEach(reply => {
          const btn = document.createElement('button');
          btn.className = 'ai-quick-btn';
          btn.textContent = reply.text;
          btn.addEventListener('click', () => {
            appendMessage('user', reply.text);
            handleNode(reply.next);
          });
          repliesContainer.appendChild(btn);
        });
      }
    }, 800);
  }

  function handleUserInput() {
    const text = chatbotInput.value.trim();
    if (!text) return;
    
    appendMessage('user', text);
    chatbotInput.value = '';
    
    const lowercase = text.toLowerCase();
    
    if (lowercase.includes('course') || lowercase.includes('academy') || lowercase.includes('learn') || lowercase.includes('study')) {
      handleNode('join');
    } else if (lowercase.includes('book') || lowercase.includes('appointment') || lowercase.includes('clinic') || lowercase.includes('treatment') || lowercase.includes('consult')) {
      handleNode('book');
    } else if (lowercase.includes('fee') || lowercase.includes('cost') || lowercase.includes('price')) {
      handleNode('fees');
    } else if (lowercase.includes('dental') || lowercase.includes('tooth') || lowercase.includes('teeth')) {
      handleNode('clinic_dental');
    } else if (lowercase.includes('skin') || lowercase.includes('laser') || lowercase.includes('peel') || lowercase.includes('facial')) {
      handleNode('clinic_skin');
    } else if (lowercase.includes('hair') || lowercase.includes('scalp') || lowercase.includes('prp')) {
      handleNode('clinic_hair');
    } else if (lowercase.includes('pmu') || lowercase.includes('microblade') || lowercase.includes('eyebrow')) {
      handleNode('clinic_pmu');
    } else if (lowercase.includes('whatsapp') || lowercase.includes('contact') || lowercase.includes('phone') || lowercase.includes('number') || lowercase.includes('call')) {
      handleNode('whatsapp_general');
    } else {
      const indicator = showTypingIndicator();
      setTimeout(() => {
        if (indicator.parentNode) indicator.parentNode.removeChild(indicator);
        appendMessage('bot', "I'm not sure I understood that fully. You can choose one of the options below or type something like 'book appointment' or 'academy courses'.");
        handleNode('start');
      }, 800);
    }
  }

  // Wire up chatbot open/close
  if (chatbotToggle && chatbotPanel) {
    chatbotToggle.addEventListener('click', () => {
      const isOpen = chatbotPanel.style.display === 'flex';
      chatbotPanel.style.display = isOpen ? 'none' : 'flex';
      
      // If opening and it is first load, wire up initial buttons
      if (!isOpen && messagesContainer.children.length <= 1) {
        const initBtns = repliesContainer.querySelectorAll('.ai-quick-btn');
        initBtns.forEach(btn => {
          const val = btn.getAttribute('data-value');
          btn.addEventListener('click', () => {
            appendMessage('user', btn.textContent);
            if (val === 'join') handleNode('join');
            else if (val === 'book') handleNode('book');
            else if (val === 'fees') handleNode('fees');
            else if (val === 'whatsapp') handleNode('whatsapp_general');
          });
        });
      }
    });
  }

  if (chatbotClose && chatbotPanel) {
    chatbotClose.addEventListener('click', () => {
      chatbotPanel.style.display = 'none';
    });
  }

  if (chatbotSend) {
    chatbotSend.addEventListener('click', handleUserInput);
  }

  if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserInput();
    });
  }

  // ==========================================
  // 11. DYNAMIC REAL CLIENT PHOTO INJECTION
  // ==========================================
  // ==========================================
  // 11. DYNAMIC REAL CLIENT PHOTO INJECTION
  // ==========================================
  const pngKeys = [
    'photo_academy_certificate_ceremony',
    'photo_botox_injection_close',
    'photo_career_launch_diploma',
    'photo_gallery_clinic_reception',
    'photo_gallery_doctor_consultation',
    'photo_gallery_graduation_group',
    'photo_gallery_skincare_products',
    'photo_gallery_student_practicing',
    'photo_gallery_treatment_room_wide',
    'photo_laser_machine_luxury',
    'result_acne_scar_reduction_stages',
    'result_active_acne_clearance',
    'result_dental_smile_makeover',
    'result_melasma_pigmentation_cheek',
    'result_pigmentation_and_under_eye_dark_circles',
    'result_severe_acne_and_pigmentation_female',
    'result_wellness_iv_drip'
  ];

  const getImgSrc = (key) => {
    const ext = pngKeys.includes(key) ? 'png' : 'jpg';
    return `images/${key}.${ext}`;
  };

  // Create hidden store element for check.js compatibility
  const storeDiv = document.createElement('div');
  storeDiv.id = 'image-store';
  storeDiv.style.display = 'none';
  document.body.appendChild(storeDiv);

      // 1. DYNAMIC LOGOS, FAVICON & HERO INJECTION
      const heroBgElement = document.getElementById('hero-bg-image');
      if (heroBgElement && getImgSrc('photo_gallery_treatment_room_wide')) {
        heroBgElement.src = getImgSrc('photo_gallery_treatment_room_wide');
        heroBgElement.style.display = 'block';
      }

      const loaderLogoContainer = document.getElementById('loader-logo-container');
      if (loaderLogoContainer && getImgSrc('logo_vtreat_academy_shield')) {
        loaderLogoContainer.innerHTML = `<img src="${getImgSrc('logo_vtreat_academy_shield')}" alt="V-Treat Clinic & Academy Shield Logo"  class="img-contain">`;
      }

      const navbarLogoContainer = document.getElementById('navbar-logo-container');
      if (navbarLogoContainer && getImgSrc('logo_vtreat_academy_shield')) {
        navbarLogoContainer.innerHTML = `<img src="${getImgSrc('logo_vtreat_academy_shield')}" alt="V-Treat Crest Logo"  class="img-contain">`;
      }

      const footerLogoContainer = document.getElementById('footer-logo-container');
      if (footerLogoContainer && getImgSrc('logo_vtreat_academy_shield')) {
        footerLogoContainer.innerHTML = `<img src="${getImgSrc('logo_vtreat_academy_shield')}" alt="V-Treat Crest Logo"  class="img-contain">`;
      }

      if (getImgSrc('logo_vtreat_academy_shield')) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = getImgSrc('logo_vtreat_academy_shield');
      }

      // 2. TREATMENTS FEATURED IMAGES INJECTION

      const menuImgSkin = document.getElementById('menu-treatment-img-skin');
      if (menuImgSkin && getImgSrc('result_active_acne_clearance')) {
        menuImgSkin.innerHTML = `<img src="${getImgSrc('result_active_acne_clearance')}" alt="Severe Acne outcome"  class="img-clinical">`;
      }
      const menuImgHair = document.getElementById('menu-treatment-img-hair');
      if (menuImgHair && getImgSrc('result_hair_transplant_growth_vertex')) {
        menuImgHair.innerHTML = `<img src="${getImgSrc('result_hair_transplant_growth_vertex')}" alt="Hair transplant outcome"  class="img-clinical">`;
      }
      const menuImgLaser = document.getElementById('menu-treatment-img-laser');
      if (menuImgLaser && getImgSrc('result_melasma_pigmentation_cheek')) {
        menuImgLaser.innerHTML = `<img src="${getImgSrc('result_melasma_pigmentation_cheek')}" alt="Laser pigmentation outcome"  class="img-clinical">`;
      }
      const menuImgPMU = document.getElementById('menu-treatment-img-pmu');
      if (menuImgPMU && getImgSrc('result_eyebrow_microblading_pmu_female')) {
        menuImgPMU.innerHTML = `<img src="${getImgSrc('result_eyebrow_microblading_pmu_female')}" alt="Eyebrow microblading outcome"  class="img-portrait">`;
      }
      const menuImgDental = document.getElementById('menu-treatment-img-dental');
      if (menuImgDental && getImgSrc('result_dental_smile_makeover')) { 
        menuImgDental.innerHTML = `<img src="${getImgSrc('result_dental_smile_makeover')}" alt="Dental clinical precision"  class="img-portrait">`;
      }
      const menuImgWellness = document.getElementById('menu-treatment-img-wellness');
      if (menuImgWellness && getImgSrc('result_wellness_iv_drip')) {
        menuImgWellness.innerHTML = `<img src="${getImgSrc('result_wellness_iv_drip')}" alt="Wellness outcome"  class="img-cover">`;
      }

      const treatImgSkin = document.getElementById('treatment-img-skin');
      if (treatImgSkin && getImgSrc('result_active_acne_clearance')) {
        treatImgSkin.innerHTML = `<img src="${getImgSrc('result_active_acne_clearance')}" alt="Severe Acne outcome"  class="img-clinical">`;
      }
      const treatImgHair = document.getElementById('treatment-img-hair');
      if (treatImgHair && getImgSrc('result_hair_transplant_growth_vertex')) {
        treatImgHair.innerHTML = `<img src="${getImgSrc('result_hair_transplant_growth_vertex')}" alt="Hair transplant outcome"  class="img-clinical">`;
      }
      const treatImgLaser = document.getElementById('treatment-img-laser');
      if (treatImgLaser && getImgSrc('result_melasma_pigmentation_cheek')) {
        treatImgLaser.innerHTML = `<img src="${getImgSrc('result_melasma_pigmentation_cheek')}" alt="Laser pigmentation outcome"  class="img-clinical">`;
      }
      const treatImgPMU = document.getElementById('treatment-img-pmu');
      if (treatImgPMU && getImgSrc('result_eyebrow_microblading_pmu_female')) {
        treatImgPMU.innerHTML = `<img src="${getImgSrc('result_eyebrow_microblading_pmu_female')}" alt="Eyebrow microblading outcome"  class="img-portrait">`;
      }
      const treatImgDental = document.getElementById('treatment-img-dental');
      if (treatImgDental && getImgSrc('result_dental_smile_makeover')) { 
        treatImgDental.innerHTML = `<img src="${getImgSrc('result_dental_smile_makeover')}" alt="Dental clinical precision"  class="img-portrait">`;
      }
      const treatImgWellness = document.getElementById('treatment-img-wellness');
      if (treatImgWellness && getImgSrc('result_wellness_iv_drip')) {
        treatImgWellness.innerHTML = `<img src="${getImgSrc('result_wellness_iv_drip')}" alt="Wellness outcome"  class="img-cover">`;
      }

      // 3. BEFORE/AFTER SWITCHER WIRING
      const baTransformations = {
        acne: {
          key: 'result_active_acne_clearance',
          labelBefore: 'Before (Severe Acne)',
          labelAfter: 'After (Clear Skin)',
          title: 'Severe Acne Treatment',
          concern: 'Grade 4 Active Acne & Inflammation',
          treatment: 'Advanced Chemical Peels + Laser Genesis',
          duration: '6 Sessions (12 Weeks)',
          outcome: '90% clearance of active acne with normalized sebum production.',
          narrative: 'This patient presented with severe cystic acne. Our personalized treatment protocol targeted both the active bacteria and underlying inflammation, resulting in clear, healthy skin without excessive scarring.'
        },
        melasma: {
          key: 'result_melasma_pigmentation_cheek',
          labelBefore: 'Before (Melasma)',
          labelAfter: 'After (Radiant Skin)',
          title: 'Melasma & Pigmentation Reversal',
          concern: 'Deep Epidermal Melasma & Sun Damage',
          treatment: 'Q-Switch Laser + Specialized Depigmentation Peels',
          duration: '8 Sessions (16 Weeks)',
          outcome: 'Significant reduction in dark patches and restored even skin tone.',
          narrative: 'The patient struggled with stubborn melasma that did not respond to topical creams. A combination of laser therapy and targeted peels broke down the deep pigment safely.'
        },
        scars: {
          key: 'result_acne_scar_reduction_stages',
          labelBefore: 'Before (Deep Scars)',
          labelAfter: 'After (Smooth Texture)',
          title: 'Advanced Scar Revision',
          concern: 'Boxcar & Rolling Acne Scars',
          treatment: 'MNRF (Micro-Needling Radio Frequency) + PRP',
          duration: '4 Sessions (16 Weeks)',
          outcome: '70% improvement in skin texture and scar depth reduction.',
          narrative: 'Through collagen induction therapy using MNRF combined with the healing power of PRP, we effectively remodeled the skin tissue to create a significantly smoother surface.'
        },
        pigment: {
          key: 'result_pigmentation_and_under_eye_dark_circles',
          labelBefore: 'Before (Dark Circles)',
          labelAfter: 'After (Brightened Eyes)',
          title: 'Periorbital Rejuvenation',
          concern: 'Severe Under-Eye Dark Circles & Hollowness',
          treatment: 'Under-Eye Fillers + Light Chemical Peels',
          duration: '2 Sessions (4 Weeks)',
          outcome: 'Instant volume restoration and fading of hyperpigmentation.',
          narrative: 'By addressing both volume loss (hollowness) and pigment deposition, this treatment instantly refreshed the patient\'s appearance, removing the tired look entirely.'
        }
      };

      const baTabBtns = document.querySelectorAll('.ba-tab-btn');
      const baBeforeImg = document.getElementById('ba-before-img');
      const baAfterImg = document.getElementById('ba-after-img');
      const baLabelBefore = document.getElementById('ba-label-before');
      const baLabelAfter = document.getElementById('ba-label-after');
      
      const csTitle = document.getElementById('cs-title');
      const csConcern = document.getElementById('cs-concern');
      const csTreatment = document.getElementById('cs-treatment');
      const csDuration = document.getElementById('cs-duration');
      const csOutcome = document.getElementById('cs-outcome');
      const csNarrative = document.getElementById('cs-narrative');

      const selectTransformation = (type) => {
        const config = baTransformations[type];
        if (!config) return;
        
        // Stagger fade-out for case context
        gsap.to('.case-study-context', {
          opacity: 0,
          x: 20,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            const imgSrc = getImgSrc(config.key);
            if (imgSrc) {
              if (baBeforeImg) baBeforeImg.style.backgroundImage = `url(${imgSrc})`;
              if (baAfterImg) baAfterImg.style.backgroundImage = `url(${imgSrc})`;
            }
            if (baLabelBefore) baLabelBefore.textContent = config.labelBefore;
            if (baLabelAfter) baLabelAfter.textContent = config.labelAfter;
            
            // Update context
            if (csTitle) csTitle.textContent = config.title;
            if (csConcern) csConcern.textContent = config.concern;
            if (csTreatment) csTreatment.textContent = config.treatment;
            if (csDuration) csDuration.textContent = config.duration;
            if (csOutcome) csOutcome.textContent = config.outcome;
            if (csNarrative) csNarrative.textContent = config.narrative;
            
            // Stagger fade-in case study details
            gsap.to('.case-study-context', {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: 'power3.out'
            });

            // Spark stats counter animation
            const percentMatch = config.outcome.match(/(\d+)%/);
            if (percentMatch && csOutcome) {
              const targetPercent = parseInt(percentMatch[1], 10);
              const countVal = { value: 0 };
              gsap.to(countVal, {
                value: targetPercent,
                duration: 1.5,
                ease: 'power3.out',
                onUpdate: () => {
                  csOutcome.innerHTML = config.outcome.replace(`${targetPercent}%`, `<strong>${Math.floor(countVal.value)}%</strong>`);
                }
              });
            }
          }
        });
      };

      baTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          baTabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const transformType = btn.getAttribute('data-transform');
          selectTransformation(transformType);
        });
      });

      // Initialize default transformation
      selectTransformation('acne');

      // ==========================================
      // SIGNATURE INTERACTIVE JOURNEY TIMELINE
      // ==========================================
      const sigSteps = [
        {
          phase: "Phase 01 — Career Exploration",
          title: "Discover Clinic & Academy Menu",
          desc: "Explore advanced cosmetic dermatology, clinical cosmetology, and PMU pathways. Discover the V-Treat dual ecosystem combining doctor-supervised treatments with high-end vocational courses designed to elevate your future.",
          metric1Val: "50+", metric1Lbl: "Aesthetic Services",
          metric2Val: "12+", metric2Lbl: "Curriculums",
          photoKey: "photo_classroom_wide_all_students"
        },
        {
          phase: "Phase 02 — Institutional Quality",
          title: "MBBS Doctor Supervision",
          desc: "Build confidence under the direct guidance of practicing medical professionals. Our academy ensures that every treatment parameters and clinical protocols are audited to guarantee hospital-grade safety.",
          metric1Val: "100%", metric1Lbl: "Doctor Supervised",
          metric2Val: "ISO 9001", metric2Lbl: "Quality Certified",
          photoKey: "photo_founder_official_portrait"
        },
        {
          phase: "Phase 03 — Practical Case Studies",
          title: "Clinical Patient Exposure",
          desc: "Bridge theory and practice by working on real clinical cases. Observe treatments of active acne, laser resurfacing, and microblading in real-time, building a premium clinical portfolio.",
          metric1Val: "Real Patients", metric1Lbl: "Hands-on Exposure",
          metric2Val: "2000+", metric2Lbl: "Happy Patients",
          photoKey: "photo_clinical_training_ring_light"
        },
        {
          phase: "Phase 04 — Valid Credentials",
          title: "Skill TN Approved Certification",
          desc: "Graduate with credentials that open doors. V-Treat provides government-recognized and board-certified vocational certifications that validate your clinical expertise nationally.",
          metric1Val: "State Approved", metric1Lbl: "TN Skill Board",
          metric2Val: "MSME", metric2Lbl: "Registered Institute",
          photoKey: "photo_career_launch_diploma"
        },
        {
          phase: "Phase 05 — Industry Integration",
          title: "Elite Alumni Networks",
          desc: "Tap into our placement portal linking you to top cosmetic hospitals, skin clinics, and premium studios across tier-1 cities, ensuring a direct entry into a high-paying job market.",
          metric1Val: "95%", metric1Lbl: "Placement Success",
          metric2Val: "12+", metric2Lbl: "Hiring Partners",
          photoKey: "photo_graduation_dr_kokila"
        },
        {
          phase: "Phase 06 — Business Setup",
          title: "Entrepreneurship Mentorship",
          desc: "Launch your independent practice with confidence. Receive comprehensive guidance on laser machine procurement, clinical licensing, treatment pricing structures, and local marketing setups.",
          metric1Val: "1-on-1 Guidance", metric1Lbl: "Doctor Mentorship",
          metric2Val: "Sourcing", metric2Lbl: "Machine Sourcing",
          photoKey: "photo_theory_class_laptop"
        },
        {
          phase: "Phase 07 — Professional Growth",
          title: "Scale and Thrive",
          desc: "Scale your revenue by offering premium, cash-only aesthetic and dental procedures. V-Treat alumni report immediate earnings growth, starting independent salons or expanding existing dental/medical clinics.",
          metric1Val: "3 Months Avg.", metric1Lbl: "Launch Window",
          metric2Val: "High ROI", metric2Lbl: "Cash Flow Growth",
          photoKey: "photo_graduation_dr_prathiksha"
        }
      ];

      const sigTimelineSteps = document.querySelectorAll('.sig-timeline-step');
      const sigProgress = document.getElementById('sig-progress');

      window.selectJourneyStep = (index) => {
        // Toggle active timeline classes
        sigTimelineSteps.forEach((step, i) => {
          if (i <= index) {
            step.classList.add('active');
          } else {
            step.classList.remove('active');
          }
        });

        // Update timeline progress bar
        if (sigProgress) {
          const widthPct = (index / (sigSteps.length - 1)) * 100;
          sigProgress.style.width = `${widthPct}%`;
        }

        // Fade transitions for card storyboard details
        gsap.to('#sig-card', {
          opacity: 0,
          y: 20,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            const data = sigSteps[index];
            document.getElementById('sig-phase').textContent = data.phase;
            document.getElementById('sig-title').textContent = data.title;
            document.getElementById('sig-desc').textContent = data.desc;
            document.getElementById('sig-metric-1-val').textContent = data.metric1Val;
            document.getElementById('sig-metric-1-lbl').textContent = data.metric1Lbl;
            document.getElementById('sig-metric-2-val').textContent = data.metric2Val;
            document.getElementById('sig-metric-2-lbl').textContent = data.metric2Lbl;

            // Render photo
            const visualContainer = document.getElementById('sig-visual');
            const photoUrl = getImgSrc(data.photoKey);
            if (visualContainer) {
              if (photoUrl) {
                visualContainer.innerHTML = `<img src="${photoUrl}" class="sig-card-img img-reveal-unfold is-visible" alt="${data.title}">`;
              } else {
                visualContainer.innerHTML = `<div style="background: var(--color-plum-light); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><span class="text-gold" style="font-size: 3rem;"><i class="fa-solid fa-compass"></i></span></div>`;
              }
            }

            // Animate card layout in
            gsap.to('#sig-card', {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out'
            });
          }
        });
      };

      // Set up Timeline step clicks
      sigTimelineSteps.forEach((step, idx) => {
        step.addEventListener('click', () => {
          window.selectJourneyStep(idx);
        });
      });

      // Initialize Journey Step 0
      window.selectJourneyStep(0);

      // About Section
      const aboutContainer = document.getElementById('about-image-container');
      if (aboutContainer && getImgSrc('photo_founder_official_portrait')) {
        aboutContainer.innerHTML = `
          <img src="${getImgSrc('photo_founder_official_portrait')}" alt="Dr. Aishwarya Selvam official portrait" class="about__image img-portrait" >
          <div class="about__image-accent"></div>
        `;
      }

      // USP Cards Background overlays
      const trainingCard = document.getElementById('usp-training-card');
      if (trainingCard && getImgSrc('photo_clinical_training_ring_light')) {
        trainingCard.addEventListener('mouseenter', () => {
          trainingCard.style.backgroundImage = `linear-gradient(rgba(23, 8, 40, 0.88), rgba(23, 8, 40, 0.88)), url(${getImgSrc('photo_clinical_training_ring_light')})`;
        });
        trainingCard.addEventListener('mouseleave', () => {
          trainingCard.style.backgroundImage = 'none';
        });
      }
      const mentorshipCard = document.getElementById('usp-mentorship-card');
      if (mentorshipCard && getImgSrc('photo_theory_class_laptop')) {
        mentorshipCard.addEventListener('mouseenter', () => {
          mentorshipCard.style.backgroundImage = `linear-gradient(rgba(23, 8, 40, 0.88), rgba(23, 8, 40, 0.88)), url(${getImgSrc('photo_theory_class_laptop')})`;
        });
        mentorshipCard.addEventListener('mouseleave', () => {
          mentorshipCard.style.backgroundImage = 'none';
        });
      }

      // Journey Section Step Images
      const journeyImg1 = document.getElementById('journey-img-1');
      if (journeyImg1 && getImgSrc('photo_classroom_wide_all_students')) {
        journeyImg1.innerHTML = `
          <img src="${getImgSrc('photo_classroom_wide_all_students')}" alt="Classroom lecture with Dr. Aishwarya Selvam" class="about__image img-cover" >
          <div class="about__image-accent"></div>
          <div class="journey__step-number" style="position: absolute; bottom: 15px; left: 15px; background: rgba(23,8,40,0.7); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: var(--radius-sm); color: var(--color-gold); font-weight: bold; font-size: var(--text-lg); border: 1px solid rgba(201,162,76,0.3);">01</div>
        `;
      }
      const journeyImg2 = document.getElementById('journey-img-2');
      if (journeyImg2 && getImgSrc('photo_clinical_training_ring_light')) {
        journeyImg2.innerHTML = `
          <img src="${getImgSrc('photo_clinical_training_ring_light')}" alt="Live patient clinical cosmetology training" class="about__image img-cover" >
          <div class="about__image-accent"></div>
          <div class="journey__step-number" style="position: absolute; bottom: 15px; left: 15px; background: rgba(23,8,40,0.7); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: var(--radius-sm); color: var(--color-gold); font-weight: bold; font-size: var(--text-lg); border: 1px solid rgba(201,162,76,0.3);">02</div>
        `;
      }
      const journeyImg3 = document.getElementById('journey-img-3');
      if (journeyImg3 && getImgSrc('photo_career_launch_diploma')) {
        journeyImg3.innerHTML = `
          <img src="${getImgSrc('photo_career_launch_diploma')}" alt="Certified outcomes" class="about__image img-portrait" >
          <div class="about__image-accent"></div>
          <div class="journey__step-number" style="position: absolute; bottom: 15px; left: 15px; background: rgba(23,8,40,0.7); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: var(--radius-sm); color: var(--color-gold); font-weight: bold; font-size: var(--text-lg); border: 1px solid rgba(201,162,76,0.3);">03</div>
        `;
      }

      // Admissions Pathway Image
      const admissionImg = document.getElementById('admission-img');
      if (admissionImg && getImgSrc('photo_academic_training_collage')) {
        admissionImg.innerHTML = `
          <img src="${getImgSrc('photo_academic_training_collage')}" alt="Academic training collage showing lab work, classroom lecture, and study discussion" class="about__image img-cover" >
          <div class="about__image-accent"></div>
        `;
      }

      // Founder Section Collage
      const founderMain = document.getElementById('founder-main-container');
      if (founderMain && getImgSrc('photo_founder_official_portrait')) {
        founderMain.innerHTML = `<img src="${getImgSrc('photo_founder_official_portrait')}" alt="Dr. Aishwarya Selvam official portrait"  class="img-portrait">`;
      }
      const founderSecondary = document.getElementById('founder-secondary-container');
      if (founderSecondary && getImgSrc('photo_theory_class_laptop')) {
        founderSecondary.innerHTML = `<img src="${getImgSrc('photo_theory_class_laptop')}" alt="Dr. Aishwarya teaching classroom"  class="img-cover">`;
      }

      // Success Stories Graduation images
      const successKeys = ['photo_graduation_dr_kokila', 'photo_graduation_dr_prathiksha', 'photo_graduation_mrs_keerthana'];
      for (let i = 1; i <= 3; i++) {
        const successImg = document.getElementById(`success-img-${i}`);
        const photoKey = successKeys[i - 1];
        if (successImg && getImgSrc(photoKey)) {
          successImg.innerHTML = `<img src="${getImgSrc(photoKey)}" alt="V-Treat Academy graduate" class="img-portrait">`;
        }
      }

      // Masonry Gallery Section (9 slots)
      const galleryItems = [
        { id: 1, key: "photo_classroom_wide_all_students", caption: "The Environment — Academy Discovery" },
        { id: 2, key: "photo_theory_class_anatomy", caption: "The Mentorship — Anatomy Masterclass" },
        { id: 3, key: "photo_theory_class_laptop", caption: "The Methodology — Digital Theory" },
        { id: 4, key: "photo_academic_training_collage", caption: "The Immersion — Hands-on Experience" },
        { id: 5, key: "photo_clinical_training_ring_light", caption: "Clinical Practice — Live Patient Exposure" },
        { id: 6, key: "result_acne_scar_reduction_stages", caption: "Real Results — Advanced Skin Procedures" },
        { id: 7, key: "result_hair_transplant_growth_vertex", caption: "Real Results — Hair Restoration" },
        { id: 8, key: "result_eyebrow_microblading_pmu_female", caption: "Real Results — Permanent Makeup (PMU)" },
        { id: 9, key: "photo_graduation_dr_kokila", caption: "The Success — Graduation & Placement" },
        { id: 10, key: "result_active_acne_clearance", caption: "Real Results — Active Acne Clearance" },
        { id: 11, key: "result_melasma_pigmentation_cheek", caption: "Real Results — Melasma Treatment" },
        { id: 12, key: "result_pigmentation_and_under_eye_dark_circles", caption: "Real Results — Under Eye Rejuvenation" },
        { id: 13, key: "result_male_hair_vertex_balding", caption: "Real Results — Male Hair Restoration" },
        { id: 14, key: "result_female_hair_thinning_part", caption: "Real Results — Female Hair Thinning" },
        { id: 15, key: "result_dental_smile_makeover", caption: "Real Results — Dental Makeover" }
      ];

      for (const item of galleryItems) {
        const slotEl = document.getElementById(`gallery-img-${item.id}`);
        if (slotEl && getImgSrc(item.key)) {
          slotEl.innerHTML = `
            <img src="${getImgSrc(item.key)}" alt="${item.caption}" class="gallery-img">
            <div class="gallery-overlay">
              <span class="gallery-caption">${item.caption}</span>
            </div>
          `;
        }
      }

      // ==========================================
      // 12. PERFORMANCE FRAME RATE GUARD
      // ==========================================
      let lastFrameTime = performance.now();
      let frameCount = 0;
      let fpsCheckStartTime = performance.now();
      let performanceGuardTriggered = false;
      const fpsThreshold = 45;
      const evaluationPeriod = 2000; // 2 seconds

      function monitorPerformance(time) {
        frameCount++;
        
        if (time - fpsCheckStartTime >= evaluationPeriod) {
          const averageFps = (frameCount * 1000) / (time - fpsCheckStartTime);
          
          if (averageFps < fpsThreshold && !performanceGuardTriggered) {
            performanceGuardTriggered = true;
            triggerPerformanceGuard();
          } else {
            frameCount = 0;
            fpsCheckStartTime = time;
          }
        }
        
        if (!performanceGuardTriggered) {
          requestAnimationFrame(monitorPerformance);
        }
      }

      function triggerPerformanceGuard() {
        console.warn("Performance guard triggered: average FPS dropped below 45fps. Disabling heavy animations.");
        
        // 1. Remove gold dust particles
        document.querySelectorAll('.gold-dust-particle').forEach(p => p.remove());
        
        // 2. Kill parallax scroll triggers
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.getAll().forEach(t => {
            if (t.vars.id && (t.vars.id === 'hero-parallax' || t.vars.id.startsWith('gallery-parallax'))) {
              t.kill();
            }
          });
        }
        
        // 3. Clear transforms on target elements to reset to default layouts
        if (typeof gsap !== 'undefined') {
          gsap.set('[id^="gallery-img-"]', { clearProps: 'y,transform' });
          gsap.set('.hero__bg-image', { clearProps: 'y,transform' });
        }
      }

      // Delay start of performance monitoring by 4 seconds to bypass initial page load lag
      setTimeout(() => {
        lastFrameTime = performance.now();
        fpsCheckStartTime = performance.now();
        frameCount = 0;
        requestAnimationFrame(monitorPerformance);
      }, 4000);
});
