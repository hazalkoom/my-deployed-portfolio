/**
 * Contact Form Handler
 * Optimized Portfolio 2025
 */

(function() {
  "use strict";

  // Handle contact form submission
  const contactForm = document.querySelector('.php-email-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const statusDiv = document.getElementById('form-status');
      const statusMessage = document.getElementById('status-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        // For Netlify forms, just submit normally
        const response = await fetch(contactForm.getAttribute('action') || window.location.href, {
          method: 'POST',
          body: formData
        });

        if (response.ok || contactForm.getAttribute('netlify')) {
          // Success
          statusDiv.style.display = 'block';
          statusMessage.className = 'alert alert-success';
          statusMessage.textContent = '✓ Thank you! Your message has been sent successfully. I\'ll get back to you soon!';
          
          // Clear form
          contactForm.reset();
          
          // Hide message after 5 seconds
          setTimeout(() => {
            statusDiv.style.display = 'none';
          }, 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Error
        statusDiv.style.display = 'block';
        statusMessage.className = 'alert alert-danger';
        statusMessage.textContent = '✗ Error sending message. Please try again or contact me directly at hazalkoom048@gmail.com';
        
        // Hide message after 5 seconds
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 5000);
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

})();
    } catch (e) {
      text = '';
    }
    setError(form, text || `Form submission failed: ${response.status} ${response.statusText}`);
  }

  window.addEventListener('load', function () {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitForm(form);
    });
  });
})();
