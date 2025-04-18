// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // References to DOM elements
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navItems = document.querySelector('.nav-items');
    const navLinks = document.querySelectorAll('.nav-items a');
    const pdfViewButtons = document.querySelectorAll('.pdf-view');
    const pdfDownloadButtons = document.querySelectorAll('.pdf-download');
    const modal = document.getElementById('pdf-modal');
    const modalTitle = document.getElementById('modal-title');
    const pdfIframe = document.getElementById('pdf-iframe');
    const closeBtn = document.querySelector('.close-btn');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('section');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const html = document.querySelector('html');
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const tiltElements = document.querySelectorAll('.tilt-element');
    const heroSection = document.querySelector('.hero');
    const backToTopBtn = document.getElementById('backToTop');
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize particle background
    createParticles();
    
    // Initialize 3D tilt effect
    initTiltEffect();

    // Initialize animation on scroll
    initScrollAnimations();
    
    // Back to top button functionality
    window.addEventListener('scroll', () => {
        // Show back to top button when scrolled down 300px
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when button clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        if (html.getAttribute('data-theme') === 'light') {
            html.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Highlight active nav item based on scroll position
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navItems.classList.toggle('active');
    });

    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navItems.classList.remove('active');
        });
        
        // Smooth scroll for navigation links
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // PDF viewer modal functionality
    pdfViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfName = button.getAttribute('data-pdf');
            const projectName = button.closest('.project-card').querySelector('h3').textContent;
            
            modalTitle.textContent = projectName + ' - Documentation';
            pdfIframe.src = pdfName;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });
    
    // PDF download functionality
    pdfDownloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfName = button.getAttribute('data-pdf');
            
            // Create a temporary link to trigger download
            const tempLink = document.createElement('a');
            tempLink.href = pdfName;
            tempLink.download = pdfName;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        });
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        pdfIframe.src = '';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            pdfIframe.src = '';
        }
    });

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic form validation
            if (!name || !email || !subject || !message) {
                showFormAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state on button
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            
            // Prepare template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_name: 'Mohammed Azad',
                reply_to: email
            };
            
            // Send email using EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showFormAlert('Message sent successfully!', 'success');
                    contactForm.reset();
                    
                    // Restore button state
                    btnText.style.display = 'inline-block';
                    btnLoading.style.display = 'none';
                }, function(error) {
                    console.log('FAILED...', error);
                    showFormAlert('Failed to send message. Please try again later.', 'error');
                    
                    // Restore button state
                    btnText.style.display = 'inline-block';
                    btnLoading.style.display = 'none';
                });
        });
    }

    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper function to show form alerts
    function showFormAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create new alert
        const alert = document.createElement('div');
        alert.className = `form-alert ${type}`;
        alert.textContent = message;
        
        // Insert alert before the form
        contactForm.parentNode.insertBefore(alert, contactForm);
        
        // Auto remove alert after 3 seconds
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    // Custom cursor functionality
    function initCustomCursor() {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
        
        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, .hamburger, .theme-toggle, .project-card, .close-btn, .skill-tags span');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-grow');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-grow');
            });
        });
    }
    
    // Particle background for hero section
    function createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 5 + 2;
            
            // Random animation delay
            const delay = Math.random() * 5;
            
            particle.style.left = posX + '%';
            particle.style.top = posY + '%';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Add custom animation
            particle.style.animation = `float-particle ${Math.random() * 10 + 10}s linear infinite`;
            particle.style.animationDelay = delay + 's';
            
            heroSection.appendChild(particle);
        }
        
        // Add float-particle animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes float-particle {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.8;
                }
                50% {
                    transform: translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0.4;
                }
                90% {
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 3D Tilt effect
    function initTiltEffect() {
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleX = (y - centerY) / 10;
                const angleY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
    
    // Animation on scroll
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animation]');
        
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.getAttribute('data-animation');
                    
                    element.style.animation = `${animation} 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
                    
                    // Stop observing after animation is applied
                    observer.unobserve(element);
                }
            });
        }, observerOptions);
        
        // Add initial styles
        const style = document.createElement('style');
        style.innerHTML = `
            [data-animation] {
                opacity: 0;
            }
            
            [data-animation="fade-in"] {
                transform: translateY(20px);
            }
            
            [data-animation="slide-in-left"] {
                transform: translateX(-100px);
            }
            
            [data-animation="slide-in-right"] {
                transform: translateX(100px);
            }
            
            [data-animation="scale-in"] {
                transform: scale(0.8);
            }
        `;
        document.head.appendChild(style);
        
        // Start observing elements
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Enhance all internal navigation links with smooth scrolling
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return; // Skip empty links
            
            const targetSection = document.querySelector(targetId);
            if(!targetSection) return; // Skip if target doesn't exist
            
            // Scroll to the section with smooth animation
            window.scrollTo({
                top: targetSection.offsetTop - 80, // Offset for header
                behavior: 'smooth'
            });
            
            // Update URL without page reload
            history.pushState(null, null, targetId);
        });
    });
});

// Add a loading animation
window.addEventListener('load', () => {
    // Create preloader element
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="spinner"></div>
    `;
    
    // Add preloader styles
    const preloaderStyle = document.createElement('style');
    preloaderStyle.innerHTML = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        
        [data-theme="dark"] .preloader {
            background: #111827;
        }
        
        .spinner {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 4px solid rgba(79, 70, 229, 0.1);
            border-top-color: var(--primary-color);
            animation: spin 1s linear infinite;
            position: relative;
        }
        
        .spinner::before,
        .spinner::after {
            content: '';
            position: absolute;
            border-radius: 50%;
        }
        
        .spinner::before {
            top: -15px;
            left: -15px;
            right: -15px;
            bottom: -15px;
            border: 3px solid transparent;
            border-top-color: var(--secondary-color);
            animation: spin 1.5s linear reverse infinite;
        }
        
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        
        .preloader.fade-out {
            opacity: 0;
            visibility: hidden;
        }
    `;
    
    document.head.appendChild(preloaderStyle);
    document.body.prepend(preloader);
    
    // Remove preloader after page loads
    setTimeout(() => {
        preloader.classList.add('fade-out');
        
        // Remove from DOM after fade animation
        setTimeout(() => {
            preloader.remove();
        }, 800);
    }, 1500);
});

// Add typing animation to hero section
window.addEventListener('load', () => {
    // Wait until preloader is gone
    setTimeout(() => {
        const typeText = document.querySelector('.hero-text h2');
        if (typeText) {
            const text = typeText.innerHTML;
            typeText.innerHTML = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    typeText.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    // Add blinking cursor effect
                    typeText.innerHTML += '<span class="blinking-cursor">|</span>';
                    
                    // Add blinking cursor style
                    const style = document.createElement('style');
                    style.innerHTML = `
                        .blinking-cursor {
                            font-weight: 100;
                            color: var(--primary-color);
                            animation: blink 1s infinite;
                        }
                        
                        @keyframes blink {
                            0%, 100% {
                                opacity: 1;
                            }
                            50% {
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
            };
            
            setTimeout(typeWriter, 500);
        }
    }, 2300);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero');
    const scrollValue = window.scrollY;
    
    if (heroSection && scrollValue < heroSection.offsetHeight) {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            const speed = index % 5 === 0 ? 0.1 : index % 3 === 0 ? 0.15 : 0.2;
            particle.style.transform = `translateY(${scrollValue * speed}px)`;
        });
        
        // Move hero content in opposite direction for parallax effect
        const heroContent = document.querySelector('.hero-content');
        heroContent.style.transform = `translateY(${scrollValue * 0.4}px)`;
    }
});