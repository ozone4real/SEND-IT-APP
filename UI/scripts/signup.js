const signUpForm = document.getElementById('sign-up-form');
const submitButton = signUpForm.querySelector('button');

/*
const loadSpinner = () => {
  const div = document.createElement('div');
  div.className = 'spinner';
  div.innerHTML = `<span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>`;

  return div;
};
*/

signUpForm.addEventListener('input', ({ target }) => {
  if (target.tagName !== 'INPUT') return;
  validate(target, signUpForm.button);
});

signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitData(signUpForm);
});

function validate(elem, button) {
  const validationPatterns = {
    fullname: /^[a-zA-Z-]+? [a-zA-Z-]+?( [a-zA-Z-]+?)?$/,
    email: /[-.\w]+@([\w-]+\.)+[\w-]{2,20}/,
    phoneNo: /^\d{10,20}$/,
    password: /.{7,}/
  };

  const errorMessages = {
    fullname:
      "Improper name pattern. There should be a space between first and last name. E.g: 'John Smith'",
    email: 'Invalid email',
    phoneNo: 'Invalid phone Number',
    password: 'Password too short. Should be at least 7 characters'
  };

  const validationPatternKeys = Object.keys(validationPatterns);

  validationPatternKeys.forEach((key) => {
    if (elem.name === key) {
      if (!validationPatterns[key].test(elem.value)) {
        elem.style.cssText =          'background-color: lightyellow; border-color: red;';
        elem.previousElementSibling.innerHTML = errorMessages[key];
        button.disabled = true;
        return;
      }
      elem.style.cssText = '';
      elem.previousElementSibling.innerHTML = '';
      button.disabled = false;
    }
  });
}

async function submitData(form) {
  const emailError = document.getElementById('email-error');
  const json = JSON.stringify({
    fullname: form.fullname.value,
    email: form.email.value,
    password: form.password.value,
    phoneNo: form.phoneNo.value
  });

  submitButton.disabled = true;
  submitButton.insertAdjacentHTML(
    'beforeend',
    '<i class="fas fa-spinner fa-spin" style= "padding: 0 5px 0 10px;"></i>'
  );
  const response = await fetch('/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json
  });

  if (response.status === 409) {
    submitButton.disabled = false;
    submitButton.lastElementChild.remove();
    return (emailError.innerHTML = 'Email Already Taken');
  }
  if (response.status !== 201) return;
  const body = await response.json();
  localStorage.setItem('token', body.token);
  window.location.href = '/bookings.html';
}
