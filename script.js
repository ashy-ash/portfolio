document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll micro-animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the appear class to trigger the CSS transition
                entry.target.classList.add('appear');
                // Unobserve after it appears so the animation doesn't replay on every scroll up/down
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements to be animated on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
    
    // Smooth scrolling for anchor links (if browser doesn't natively support scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
