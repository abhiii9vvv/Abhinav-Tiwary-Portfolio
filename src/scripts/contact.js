// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.php-email-form');
    const loading = document.querySelector('.loading');
    const errorMessage = document.querySelector('.error-message');
    const sentMessage = document.querySelector('.sent-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            loading.classList.remove('form-status-hidden');
            loading.classList.add('form-status-visible');
            errorMessage.classList.add('form-status-hidden');
            sentMessage.classList.add('form-status-hidden');

            // Get form data
            const formData = new FormData(form);
            
            // Send to Formspree (replace YOUR_FORM_ID with actual ID)
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                loading.classList.add('form-status-hidden');
                
                if (response.ok) {
                    sentMessage.classList.remove('form-status-hidden');
                    sentMessage.classList.add('form-status-visible');
                    form.reset();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Something went wrong');
                    });
                }
            })
            .catch(error => {
                loading.classList.add('form-status-hidden');
                errorMessage.classList.remove('form-status-hidden');
                errorMessage.classList.add('form-status-visible');
                errorMessage.textContent = 'Oops! There was a problem submitting your form. Please try again.';
                // Form submission error handled silently
            });
        });
    }
});

// Smooth scrolling for navigation links (REMOVED - handled by main.js)
// Duplicate functionality removed to prevent conflicts

// Mobile nav toggle logic handled centrally in main.js
