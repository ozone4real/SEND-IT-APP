const signUpForm = document.getElementById("sign-up-form");
const submitButton = signUpForm.querySelector("button");

signUpForm.addEventListener("input", ({ target }) => {
  if (target.tagName !== "INPUT") return;
  validate(target, signUpForm.button);
});

signUpForm.addEventListener("submit", e => {
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
    email: "Invalid email",
    phoneNo: "Invalid phone Number",
    password: "Password too short. Should be at least 7 characters"
  };

  const validationPatternKeys = Object.keys(validationPatterns);

  validationPatternKeys.forEach(key => {
    if (elem.name === key) {
      if (!validationPatterns[key].test(elem.value)) {
        elem.style.cssText =
          "background-color: lightyellow; border-color: red;";
        elem.previousElementSibling.innerHTML = errorMessages[key];
        button.disabled = true;
        return;
      }
      elem.style.cssText = "";
      elem.previousElementSibling.innerHTML = "";
      button.disabled = false;
    }
  });
}

async function submitData(form) {
  const emailError = document.getElementById("email-error");
  const formData = JSON.stringify({
    fullname: form.fullname.value,
    email: form.email.value,
    password: form.password.value,
    phoneNo: form.phoneNo.value
  });

  loadButtonSpinner(submitButton);
  const { response, data: body } = await createAndUpdateRequests(
    "/api/v1/auth/signup",
    "POST",
    null,
    formData
  );

  if (response.status === 409) {
    removeButtonSpinner(submitButton);
    return (emailError.innerHTML = "Email Already Taken");
  }

  if (response.status !== 201) return;
  localStorage.setItem("token", body.token);
  window.location.href = "/bookings.html";
}
