document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
       const navbar = document.querySelector('.navbar');
       if (window.scrollY > 50) {
           navbar.classList.add('scrolled');
       } else {
           navbar.classList.remove('scrolled');
       }
   });
    // Mobile menu handling
   const hamburger = document.querySelector('.hamburger');
   const navLinks = document.querySelector('.nav-links');
   const dropdowns = document.querySelectorAll('.dropdown');
    // Toggle mobile menu
   hamburger.addEventListener('click', function() {
       navLinks.classList.toggle('active');
       hamburger.classList.toggle('active');
       
       // Animate hamburger
       const spans = hamburger.querySelectorAll('span');
       spans.forEach(span => span.classList.toggle('active'));
   });
    // Handle dropdown clicks on mobile
   dropdowns.forEach(dropdown => {
       dropdown.addEventListener('click', function(e) {
           if (window.innerWidth <= 968) {
               e.preventDefault();
               this.classList.toggle('active');
           }
       });
   });
    // Close mobile menu when clicking outside
   document.addEventListener('click', function(event) {
       if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
           navLinks.classList.remove('active');
           const spans = hamburger.querySelectorAll('span');
           spans.forEach(span => span.classList.remove('active'));
       }
   });
    // Smooth scroll for anchor links
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
       anchor.addEventListener('click', function (e) {
           e.preventDefault();
           const target = document.querySelector(this.getAttribute('href'));
           if (target) {
               target.scrollIntoView({
                   behavior: 'smooth'
               });
               // Close mobile menu after clicking a link
               navLinks.classList.remove('active');
           }
       });
   });
    // Portfolio filtering
   const filterButtons = document.querySelectorAll('.filter-btn');
   const portfolioItems = document.querySelectorAll('.portfolio-item');
    filterButtons.forEach(button => {
       button.addEventListener('click', () => {
           filterButtons.forEach(btn => btn.classList.remove('active'));
           button.classList.add('active');
           
           const filterValue = button.getAttribute('data-filter');
           
           portfolioItems.forEach(item => {
               if (filterValue === 'all' || item.classList.contains(filterValue)) {
                   item.style.display = 'block';
                   setTimeout(() => {
                       item.style.opacity = '1';
                       item.style.transform = 'scale(1)';
                   }, 10);
               } else {
                   item.style.opacity = '0';
                   item.style.transform = 'scale(0.8)';
                   setTimeout(() => {
                       item.style.display = 'none';
                   }, 300);
               }
           });
       });
   });
    // FAQ Accordion
   const faqItems = document.querySelectorAll('.faq-item');
   faqItems.forEach(item => {
       const question = item.querySelector('.faq-question');
       question.addEventListener('click', () => {
           const isActive = item.classList.contains('active');
           faqItems.forEach(faqItem => faqItem.classList.remove('active'));
           if (!isActive) item.classList.add('active');
       });
   });
    // Newsletter Form
   const newsletterForm = document.querySelector('.newsletter-form');
   if (newsletterForm) {
       newsletterForm.addEventListener('submit', function(e) {
           e.preventDefault();
           const email = this.querySelector('input[type="email"]').value;
           alert('Thank you for subscribing! You will receive updates at: ' + email);
           this.reset();
       });
   }
    // Active Navigation Handling
   function setActiveNav() {
       const scrollPosition = window.scrollY;
       const sections = document.querySelectorAll('section[id]');
       const navLinks = document.querySelectorAll('.nav-links a');
       
       if (scrollPosition < 100) {
           navLinks.forEach(link => link.classList.remove('active-nav'));
           document.querySelector('.nav-links a[href="#home"]').classList.add('active-nav');
           return;
       }
        sections.forEach(section => {
           const sectionTop = section.offsetTop - 100;
           const sectionHeight = section.offsetHeight;
           const sectionId = section.getAttribute('id');
           
           if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
               navLinks.forEach(link => {
                   link.classList.remove('active-nav');
                   if (link.getAttribute('href') === `#${sectionId}`) {
                       link.classList.add('active-nav');
                   }
               });
           }
       });
   }
    // Add scroll event listener for active nav
   window.addEventListener('scroll', setActiveNav);
   setActiveNav(); // Set active nav on page load
    // Contact Form Handling with EmailJS
   const contactForm = document.getElementById('contactForm');
   if (contactForm) {
       contactForm.addEventListener('submit', async function(e) {
           e.preventDefault();
           
           const nameInput = this.querySelector('#name');
           const emailInput = this.querySelector('#email');
           const subjectInput = this.querySelector('#subject');
           const messageInput = this.querySelector('#message');
           const submitBtn = this.querySelector('.submit-btn');
           
           // Basic validation
           if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
               showNotification('Please fill in all fields', 'error');
               return;
           }
            // Email validation
           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           if (!emailRegex.test(emailInput.value)) {
               showNotification('Please enter a valid email address', 'error');
               return;
           }
            // Change button state to loading
           const originalBtnText = submitBtn.innerHTML;
           submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
           submitBtn.disabled = true;
            try {
               // Send email using EmailJS
               await emailjs.send(
                   "YOUR_SERVICE_ID", // Add your EmailJS service ID
                   "YOUR_TEMPLATE_ID", // Add your EmailJS template ID
                   {
                       from_name: nameInput.value,
                       reply_to: emailInput.value,
                       subject: subjectInput.value,
                       message: messageInput.value,
                   }
               );
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
               this.reset();
               
           } catch (error) {
               showNotification('Failed to send message. Please try again.', 'error');
               console.error('Email error:', error);
               
           } finally {
               submitBtn.innerHTML = originalBtnText;
               submitBtn.disabled = false;
           }
       });
   }
    // Notification System
   function showNotification(message, type) {
   const existingNotification = document.querySelector('.notification');
   if (existingNotification) {
       existingNotification.remove();
   }
    const notification = document.createElement('div');
   notification.className = `notification ${type}`;
   notification.innerHTML = `
       <div class="notification-content">
           <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
           <span>${message}</span>
       </div>
   `;
    document.body.appendChild(notification);
   setTimeout(() => notification.classList.add('show'), 100);
   setTimeout(() => {
       notification.classList.remove('show');
       setTimeout(() => notification.remove(), 300);
   }, 5000);
   }
});
