const signInForm = document.getElementById('sign-in-form');
const submitButton = signInForm.querySelector('button');

signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const signInFormElems = Array.from(signInForm.querySelectorAll('input'));
  let error;
  signInFormElems.forEach((item) => {
    if (!item.value) {
      item.style.cssText = 'background-color: lightyellow; border-color: red;';
      item.previousElementSibling.innerHTML = 'This must not be empty';
      error = true;
    }
  });

  if (error) return;
  submitData(signInForm);
});

async function submitData(form) {
  const signInError = document.getElementById('form-error');
  const json = JSON.stringify({
    email: form.email.value,
    password: form.password.value,
  });

  submitButton.disabled = true;
  submitButton.insertAdjacentHTML('beforeend', '<i class="fas fa-spinner fa-spin" style= "padding: 0 5px 0 10px;"></i>');
  const response = await fetch('/api/v1/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json,
  });

  if (response.status === 401) {
    submitButton.disabled = false;
    submitButton.lastElementChild.remove();
    return signInError.innerHTML = 'Invalid Email or Password';
  }
  if (response.status !== 200) return;
  const body = await response.json();
  localStorage.setItem('token', body.token);
  window.location.href = '/bookings.html';
}
