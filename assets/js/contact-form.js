(function () {
  "use strict";

  function qs(root, sel) {
    return root.querySelector(sel);
  }

  function setVisible(el, visible) {
    if (!el) return;
    el.classList.toggle('d-block', visible);
    if (!visible) el.classList.remove('d-block');
  }

  function setError(form, message) {
    const loading = qs(form, '.loading');
    const error = qs(form, '.error-message');
    const sent = qs(form, '.sent-message');

    if (loading) loading.classList.remove('d-block');
    if (sent) sent.classList.remove('d-block');

    if (error) {
      error.textContent = message;
      error.classList.add('d-block');
    }
  }

  async function submitForm(form) {
    const action = form.getAttribute('action') || '/';

    const loading = qs(form, '.loading');
    const error = qs(form, '.error-message');
    const sent = qs(form, '.sent-message');

    if (loading) loading.classList.add('d-block');
    if (error) error.classList.remove('d-block');
    if (sent) sent.classList.remove('d-block');

    const formData = new FormData(form);

    const body = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value);
    });

    let response;
    try {
      response = await fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });
    } catch (e) {
      setError(form, 'Network error. Please try again.');
      return;
    }

    if (loading) loading.classList.remove('d-block');

    if (response.ok) {
      if (sent) sent.classList.add('d-block');
      form.reset();
      return;
    }

    let text = '';
    try {
      text = (await response.text()).trim();
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
