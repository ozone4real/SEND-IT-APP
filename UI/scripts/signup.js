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

signUpForm.addEventListener('input', (e) => {
  if (e.target.tagName !== 'INPUT') return;
  validate(e.target);
});

signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const signUpFormElems = Array.from(signUpForm.querySelectorAll('input'));
  let error;
  signUpFormElems.forEach((item) => {
    if (!item.value) {
      item.style.cssText = 'background-color: lightyellow; border-color: red;';
      item.previousElementSibling.innerHTML = 'This must not be empty';
      error = true;
      return;
    }
    validate(item);
  });
  if (error) return;
  submitData(signUpForm);
});


function validate(elem) {
  const patterns = {
    fullname: /^[a-zA-Z-]+? [a-zA-Z-]+?( [a-zA-Z-]+?)?$/,
    email: /[-.\w]+@([\w-]+\.)+[\w-]{2,20}/,
    phoneNo: /^\d{10,20}$/,
    password: /.{7,}/
  };

  const errorMessages = {
    fullname: 'Improper name pattern. There should be a space between first and last name. E.g: \'John Smith\'',
    email: 'Invalid email',
    phoneNo: 'Invalid phone Number',
    password: 'Password too short. Should be at least 7 characters'
  };

  for (key in patterns) {
    if (elem.name === key) {
      if (!patterns[key].test(elem.value)) {
        elem.style.cssText = 'background-color: lightyellow; border-color: red;';
        elem.previousElementSibling.innerHTML = errorMessages[key];
        error = true;
        return;
      }
      elem.style.cssText = '';
      elem.previousElementSibling.innerHTML = '';
    }
  }
}

async function submitData(form) {
  const emailError = document.getElementById('email-error');
  const json = JSON.stringify({
    fullname: form.fullname.value,
    email: form.email.value,
    password: form.password.value,
    phoneNo: form.phoneNo.value,
  });

  submitButton.disabled = true;
  submitButton.insertAdjacentHTML('beforeend', '<i class="fas fa-spinner fa-spin" style= "padding: 0 5px 0 10px;"></i>');
  const response = await fetch('/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json,
  });

  if (response.status === 409) {
    submitButton.disabled = false;
    submitButton.lastElementChild.remove();
    return emailError.innerHTML = 'Email Already Taken';
  }
  if (response.status !== 201) return;
  const body = await response.json();
  localStorage.setItem('token', body.token);
  window.location.href = '/bookings.html';
}
