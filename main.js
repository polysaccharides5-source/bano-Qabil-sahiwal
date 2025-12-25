// ===== NAVBAR TOGGLE =====
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
}

// ===== SMOOTH SCROLL TO SECTION =====
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// Auto-close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      document.getElementById('navLinks').style.display = 'none';
    }
  });
});

// ===== COUNTER ANIMATION ON SCROLL =====
const counters = document.querySelectorAll('.stat h4');
const speed = 200;

const countUp = (target, element) => {
  let count = 0;
  const increment = target / speed;
  const updateCounter = () => {
    if (count < target) {
      count += increment;
      element.textContent = Math.ceil(count);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + (element.parentElement.textContent.includes('%') ? '%' : '+');
    }
  };
  updateCounter();
};

// Trigger when in view
const observerOptions = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = +entry.target.getAttribute('data-target');
      countUp(target, entry.target);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

counters.forEach(counter => observer.observe(counter));

// ===== CONTACT FORM JS =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const msgBox = document.getElementById('formMsg');

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!name || !email || !message) {
      msgBox.style.cssText = 'color:#e74c3c;display:block;';
      msgBox.textContent = 'Please fill all required fields.';
      return;
    }
    if(!emailRegex.test(email)) {
      msgBox.style.cssText = 'color:#e74c3c;display:block;';
      msgBox.textContent = 'Please enter a valid email.';
      return;
    }

    msgBox.style.cssText = 'color:#27ae60;display:block;';
    msgBox.innerHTML = '<i class="fas fa-check-circle"></i> Message sent! We will reply soon.';
    contactForm.reset();
  });
}

// ===== APPLY FORM VALIDATION =====
const applyForm = document.getElementById('applyForm');
if (applyForm) {
  const fields = ['name','email','phone','age','education','course'];
  const errors = {};

  fields.forEach(f => errors[f] = document.getElementById(f+'Error'));

  function showError(field, msg) {
    errors[field].textContent = msg;
    errors[field].style.display = 'inline';
  }
  function hideError(field) {
    errors[field].style.display = 'none';
  }

  applyForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Name
    if(!applyForm.name.value.trim()) { showError('name','Name required'); valid=false; } else hideError('name');
    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(applyForm.email.value)) { showError('email','Invalid email'); valid=false; } else hideError('email');
    // Phone
    const phoneRegex = /^03[0-9]{2}-[0-9]{7}$/;
    if(!phoneRegex.test(applyForm.phone.value)) { showError('phone','Format: 03xx-xxxxxxx'); valid=false; } else hideError('phone');
    // Age
    const age = parseInt(applyForm.age.value);
    if(isNaN(age) || age<15 || age>35) { showError('age','Age 15-35 only'); valid=false; } else hideError('age');
    // Education
    if(!applyForm.education.value) { showError('education','Select education'); valid=false; } else hideError('education');
    // Course
    if(!applyForm.course.value) { showError('course','Select course'); valid=false; } else hideError('course');

    if(valid) {
      applyForm.style.display = 'none';
      document.getElementById('successMsg').style.display = 'block';
    }
  });

  // === File Validation + Preview ===
  const fileInputs = [
    { id: 'cnicFront', required: true, types: ['image/jpeg','image/png','application/pdf'] },
    { id: 'cnicBack',  required: true, types: ['image/jpeg','image/png','application/pdf'] },
    { id: 'userPhoto', required: true, types: ['image/jpeg','image/png'] },
    { id: 'lastCert',  required: false, types: ['image/jpeg','image/png','application/pdf'] }
  ];

  fileInputs.forEach(item => {
    const input = document.getElementById(item.id);
    if (input) {
      input.addEventListener('change', () => {
        const file = input.files[0];
        const errorSpan = document.getElementById(item.id+'Error');
        if(!file && item.required) {
          errorSpan.style.display = 'inline';
          return;
        }
        if(file && !item.types.includes(file.type)) {
          errorSpan.textContent = 'Invalid file type';
          errorSpan.style.display = 'inline';
          input.value = '';
          return;
        }
        hideError(item.id);
        // Preview images only
        if(file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-thumb';
            const previewRow = document.getElementById('previewRow');
            if (previewRow) {
              previewRow.appendChild(img);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });
}

// ===== VIDEO MODAL JS (for course pages) =====
const modal = document.getElementById('videoModal');
if (modal) {
  const playBtn = document.querySelector('.play-btn');
  const closeModal = document.querySelector('.close-modal');
  const video = modal.querySelector('video');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      video.play();
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
      video.pause();
      video.currentTime = 0;
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      video.pause();
      video.currentTime = 0;
    }
  });
}

// ===== SCROLL ANIMATION =====
const fadeElements = document.querySelectorAll('.fade-in-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});
