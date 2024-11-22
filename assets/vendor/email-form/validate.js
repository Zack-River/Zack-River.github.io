(function () {
  "use strict";

  let forms = document.querySelectorAll('.email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptcha, { action: 'email_form_submit' })
                .then(token => {
                  formData.set('recaptcha-response', token);
                  email_form_submit(thisForm, action, formData);
                })
            } catch (error) {
              displayError(thisForm, 'Recaptcha execution failed: ' + error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha JavaScript API URL is not loaded!');
        }
      } else {
        email_form_submit(thisForm, action, formData);
      }
    });
  });

  function email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (response.ok) {
          return response.json();  // Parse response as JSON
        } else {
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
      })
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.success) {
          data.message = "Message sent successfully!";  // Replace the message
          thisForm.querySelector('.sent-message').textContent = data.message;
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset(); 
        } else {
          throw new Error(data.message || 'Form submission failed with no error message returned.');
        }
      })
      .catch((error) => {
        displayError(thisForm, error.message);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();