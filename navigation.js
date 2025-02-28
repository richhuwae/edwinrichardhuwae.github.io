// navigation.js
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Check if the link has a target
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            // Only scroll if there's a valid target
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // If mobile nav is open, close it
                if (document.querySelector('nav ul').classList.contains('show')) {
                    document.querySelector('nav ul').classList.remove('show');
                    document.querySelector('.mobile-nav-toggle').classList.remove('active');
                }
            }
        });
    });

    // Navigation highlight on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav ul');
    
    mobileNavToggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        mobileNavToggle.classList.toggle('active');
    });
});