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
    
    // Setup section navigation
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const sectionId = link.getAttribute('data-section');
            openSection(`${sectionId}Section`);
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
});