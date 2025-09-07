// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Proteção contra manipulação automática de texto
document.addEventListener('DOMContentLoaded', function() {
    const protectedStat = document.getElementById('protected-stat');
    if (protectedStat) {
        const correctText = protectedStat.getAttribute('data-original-text') || 'Top 25';
        
        // Força o texto correto
        function forceCorrectText() {
            if (protectedStat.textContent !== correctText) {
                protectedStat.textContent = correctText;
            }
        }
        
        // Força imediatamente
        forceCorrectText();
        
        // Observa mudanças e corrige
        const observer = new MutationObserver(forceCorrectText);
        observer.observe(protectedStat, { 
            childList: true, 
            subtree: true, 
            characterData: true 
        });
        
        // Força periodicamente como backup
        setInterval(forceCorrectText, 100);
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.about-item, .service-card, .contact-item, .stat-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 100;
        const duration = 2000; // 2 seconds
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    });
};

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
        // Simulate form submission (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showNotification('Mensagem enviada com sucesso! Entraremos em contacto em breve.', 'success');
        contactForm.reset();
        
        // Generate WhatsApp message
        const whatsappMessage = `Olá! Sou ${data.name}.%0A%0AAssunto: ${data.subject}%0A%0AMensagem: ${data.message}%0A%0AEmail: ${data.email}${data.phone ? `%0ATelefone: ${data.phone}` : ''}`;
        
        // Optional: Open WhatsApp after form submission
        setTimeout(() => {
            if (confirm('Gostaria de continuar a conversa no WhatsApp?')) {
                window.open(`https://wa.me/244900000000?text=${whatsappMessage}`, '_blank');
            }
        }, 1500);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('Erro ao enviar mensagem. Tente novamente ou contacte-nos diretamente.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease-out;
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
        }
        
        .notification-content i:first-child {
            font-size: 1.2rem;
        }
        
        .notification-success i:first-child {
            color: #10b981;
        }
        
        .notification-error i:first-child {
            color: #ef4444;
        }
        
        .notification-info i:first-child {
            color: #3b82f6;
        }
        
        .notification-content span {
            flex: 1;
            color: #374151;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .notification-close:hover {
            background: #f3f4f6;
            color: #374151;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @media (max-width: 480px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Form field animations and validation
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    // Add placeholder attribute for label animation
    if (!field.placeholder) {
        field.placeholder = ' ';
    }
    
    // Real-time validation
    field.addEventListener('blur', () => {
        validateField(field);
    });
    
    field.addEventListener('input', () => {
        clearFieldError(field);
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um email válido.';
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{9,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um número de telefone válido.';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    `;
    
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroHeight = hero.offsetHeight;
    
    if (scrolled < heroHeight) {
        const parallaxSpeed = scrolled * 0.5;
        hero.style.transform = `translateY(${parallaxSpeed}px)`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loading styles if not present
    if (!document.querySelector('#loading-styles')) {
        const loadingStyle = document.createElement('style');
        loadingStyle.id = 'loading-styles';
        loadingStyle.textContent = `
            body:not(.loaded) * {
                animation-play-state: paused !important;
            }
            
            .loaded .hero-text,
            .loaded .hero-image {
                animation-play-state: running !important;
            }
        `;
        document.head.appendChild(loadingStyle);
    }
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Floating cards animation timing
document.querySelectorAll('.floating-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 2}s`;
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Performance optimization: Lazy load images and heavy content
const lazyElements = document.querySelectorAll('[data-src]');
const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
            lazyObserver.unobserve(element);
        }
    });
});

lazyElements.forEach(element => lazyObserver.observe(element));

// ========================= //
// ADVANCED SERVICES PAGE ANIMATIONS //
// ========================= //

// Enhanced Intersection Observer para animações específicas da página de serviços
const servicesObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animações staggered para grids
            if (entry.target.classList.contains('locations-grid') || 
                entry.target.classList.contains('sectors-grid') || 
                entry.target.classList.contains('process-steps')) {
                
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                });
            }
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observa elementos específicos da página de serviços - SIMPLIFICADO
document.addEventListener('DOMContentLoaded', function() {
    // Só executa se estivermos na página de serviços
    if (document.querySelector('.service-detail')) {
        console.log('Página de serviços carregada com sucesso!');
        
        // Garante que todos os elementos são visíveis
        const allElements = document.querySelectorAll('.service-detail-content-visible, .service-detail-images-visible, .section-header-visible, .locations-grid-visible');
        allElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    }
});

// Microinterações específicas para serviços
document.addEventListener('DOMContentLoaded', function() {
    // Só executa se estivermos na página de serviços
    if (!document.querySelector('.service-detail')) return;
    
    // Feedback visual para número de telefone
    const phoneNumber = document.querySelector('.phone-number');
    if (phoneNumber) {
        phoneNumber.style.cursor = 'pointer';
        phoneNumber.setAttribute('title', 'Clique para copiar o número');
        
        phoneNumber.addEventListener('click', function() {
            const number = this.textContent.trim();
            
            // Copia para clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(number).then(() => {
                    showPhoneFeedback('Número copiado!', 'success');
                }).catch(() => {
                    showPhoneFeedback('Erro ao copiar', 'error');
                });
            } else {
                // Fallback para navegadores antigos
                const textArea = document.createElement('textarea');
                textArea.value = number;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showPhoneFeedback('Número copiado!', 'success');
                } catch (err) {
                    showPhoneFeedback('Erro ao copiar', 'error');
                }
                document.body.removeChild(textArea);
            }
        });
    }
    
    // Efeito parallax suave nos headers com background
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const headers = document.querySelectorAll('.about-header-bg, .services-header-bg');
        
        headers.forEach(header => {
            const rate = scrolled * -0.3;
            header.style.transform = `translateY(${rate}px)`;
        });
        ticking = false;
    }
    
    function requestParallaxTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxTick);
    
    // Animação de entrada para ícones flutuantes
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Hover 3D para imagens
    const hoverImages = document.querySelectorAll('.hover-lift');
    hoverImages.forEach(img => {
        img.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
        });
    });
});

// Função para mostrar feedback do telefone
function showPhoneFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `phone-feedback phone-feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #ef4444, #f87171)'};
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 0.9rem;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        transform: translateX(0);
    `;
    
    document.body.appendChild(feedback);
    
    // Remove após 2.5 segundos
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => feedback.remove(), 300);
    }, 2500);
}

// CSS adicional para animações específicas da página de serviços
const servicesAnimationsCSS = `
    @keyframes slideInBounce {
        0% {
            opacity: 0;
            transform: translateX(100%) scale(0.8);
        }
        50% {
            transform: translateX(-10%) scale(1.05);
        }
        100% {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }
    
    @keyframes slideOutRight {
        to {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
        }
    }
    
    /* Hover effect para botões com shimmer */
    .btn-link {
        position: relative;
        overflow: hidden;
    }
    
    .btn-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(135, 206, 235, 0.3), transparent);
        transition: left 0.6s;
    }
    
    .btn-link:hover::before {
        left: 100%;
    }
    
    /* Animação de loading para lazy images */
    img[loading="lazy"] {
        transition: opacity 0.5s ease, filter 0.3s ease;
    }
    
    img[loading="lazy"]:not([src]) {
        opacity: 0;
        filter: blur(5px);
    }
    
    /* Melhora visual para elementos interativos */
    .sector-item, .delivery-type, .location-group, .step {
        position: relative;
        overflow: hidden;
    }
    
    .sector-item::after, .delivery-type::after, .location-group::after, .step::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(135, 206, 235, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.4s ease;
        pointer-events: none;
    }
    
    .sector-item:hover::after, .delivery-type:hover::after, 
    .location-group:hover::after, .step:hover::after {
        width: 200%;
        height: 200%;
    }
`;

// Adiciona CSS das animações específicas
const servicesStyle = document.createElement('style');
servicesStyle.textContent = servicesAnimationsCSS;
document.head.appendChild(servicesStyle);

