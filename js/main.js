// Main Portfolio Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners for UI elements
    
    // Section Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const closeButtons = document.querySelectorAll('.close-button');
    const mainContent = document.getElementById('mainContent');
    
    const exploreBtn = document.getElementById('exploreBtn');
    const contactBtn = document.getElementById('contactBtn');
    
    // Mobile menu elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Function to close all sections and show main content
    function closeAllSections() {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        // Show the main content when no sections are active
        mainContent.style.display = 'flex';
        
        // Remove class from body
        document.body.classList.remove('overlay-active');
        
        // Re-enable scrolling on body
        document.body.style.overflow = '';
        
        // Re-enable wheel events on the canvas
        const canvas = document.getElementById('canvas');
        canvas.style.pointerEvents = 'auto';
        
        // Close mobile menu if open
        mobileMenu.classList.remove('active');
    }
    
    // Function to open a section and hide main content
    function openSection(sectionId) {
        // First close all sections
        closeAllSections();
        
        // Hide the main content
        mainContent.style.display = 'none';
        
        // Then open the requested section
        const sectionElement = document.getElementById(sectionId);
        sectionElement.classList.add('active');
        
        // Add class to body to disable pointer events on canvas
        document.body.classList.add('overlay-active');
        
        // Disable body scrolling and enable only within the overlay
        document.body.style.overflow = 'hidden';
        
        // Disable wheel events on the canvas
        const canvas = document.getElementById('canvas');
        canvas.style.pointerEvents = 'none';
        
        // Add specific wheel event handling for the section
        sectionElement.addEventListener('wheel', function(event) {
            // Prevent the event from propagating to parent elements
            event.stopPropagation();
        }, { passive: false });
        
        // Add touch event handling for the section
        sectionElement.addEventListener('touchmove', function(event) {
            // Allow default behavior within the section but prevent propagation
            event.stopPropagation();
        }, { passive: true });
    }
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
        
        if (mobileMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnMenuBtn) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // Setup section navigation for both desktop and mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const sectionId = link.getAttribute('data-section');
            openSection(`${sectionId}Section`);
            
            // Close mobile menu if open
            mobileMenu.classList.remove('active');
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllSections();
        });
    });
    
    // CTA buttons
    exploreBtn.addEventListener('click', () => {
        openSection('aboutSection');
    });
    
    contactBtn.addEventListener('click', () => {
        openSection('contactSection');
    });
    
    // Add touch event listeners for better mobile experience
    document.addEventListener('touchstart', function(e) {
        // Prevent default behavior for certain elements to improve touch response
        if (e.target.classList.contains('nav-link') || 
            e.target.classList.contains('cta-button') || 
            e.target.classList.contains('close-button')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Detect mobile devices and optimize experience
    function isMobileDevice() {
        return (window.innerWidth <= 768 || 
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }
    
    // Set initial mobile optimizations
    if (isMobileDevice()) {
        // Reduce particle count on mobile for better performance
        const toggleParticlesBtn = document.getElementById('toggleParticles');
        if (toggleParticlesBtn) {
            // Trigger a click to reduce particles (assuming the first click reduces them)
            toggleParticlesBtn.click();
        }
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        // Delay execution to allow the browser to complete the orientation change
        setTimeout(function() {
            // Update any UI elements that need orientation-specific adjustments
            if (window.orientation === 90 || window.orientation === -90) {
                // Landscape mode
                document.body.classList.add('landscape');
                document.body.classList.remove('portrait');
            } else {
                // Portrait mode
                document.body.classList.add('portrait');
                document.body.classList.remove('landscape');
            }
        }, 300);
    });
    
    // Ensure proper display on initial load
    window.addEventListener('load', function() {
        // Force a resize event to ensure everything is sized correctly
        window.dispatchEvent(new Event('resize'));
        
        // Set initial orientation class
        if (window.orientation === 90 || window.orientation === -90) {
            document.body.classList.add('landscape');
        } else {
            document.body.classList.add('portrait');
        }
    });
});