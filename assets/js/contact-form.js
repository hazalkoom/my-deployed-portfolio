/**
 * Contact Form Handler
 * Clean rebuild — Netlify Forms with proper validation
 */
(function () {
  "use strict";

  var COOLDOWN_MS = 5000;

  function initContactForm() {
    var form = document.querySelector('.php-email-form');
    if (!form) return;

    var statusDiv = document.getElementById('form-status');
    var statusMessage = document.getElementById('status-message');
    var submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    var lastSubmitTime = 0;

    // Real-time validation feedback
    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('invalid', function () {
        this.setAttribute('aria-invalid', 'true');
      });
      field.addEventListener('input', function () {
        if (this.validity.valid) {
          this.removeAttribute('aria-invalid');
        }
      });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Rate-limit
      if (Date.now() - lastSubmitTime < COOLDOWN_MS) {
        showStatus('warn', 'Please wait a few seconds before sending again.');
        return;
      }

      // Native HTML5 validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Loading state
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      try {
        var formData = new FormData(form);
        var response = await fetch(form.getAttribute('action') || '/', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        if (response.ok || response.redirected) {
          showStatus('success', '\u2713 Thank you! Your message has been sent. I\u2019ll get back to you soon!');
          form.reset();
          lastSubmitTime = Date.now();
        } else {
          throw new Error('Server responded with ' + response.status);
        }
      } catch (err) {
        showStatus('error', '\u2717 Error sending message. Please try again or email me at hazalkoom048@gmail.com');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    function showStatus(type, message) {
      if (!statusDiv || !statusMessage) return;
      statusDiv.style.display = 'block';

      var cls = 'alert ';
      if (type === 'success') cls += 'alert-success';
      else if (type === 'warn') cls += 'alert-warning';
      else cls += 'alert-danger';

      statusMessage.className = cls;
      statusMessage.textContent = message;
      statusMessage.setAttribute('role', 'alert');

      setTimeout(function () {
        statusDiv.style.display = 'none';
      }, 6000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm, { once: true });
  } else {
    initContactForm();
  }
})();
