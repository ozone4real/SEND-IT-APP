const lagos = [
  "Agege",
  "Ajeromi-Ifelodun",
  "Alimosho",
  "Amuwo-Odofin",
  "Apapa",
  "Badagry",
  "Epe",
  "Eti Osa",
  "Ibeju-Lekki",
  "Ifako-Ijaiye",
  "Ikeja",
  "Ikorodu",
  "Kosofe",
  "Lagos Island",
  "Lagos Mainland",
  "Mushin",
  "Ojo",
  "Oshodi-Isolo",
  "Shomolu",
  "Surulere"
];
const lG1 = document.getElementById("lg1");
const lG2 = document.getElementById("lg2");
const bookingForm = document.getElementById("booking-form");
const submitButton = bookingForm.querySelector("button");
const modal = document.querySelector(".modal");
const confirmOrder = document.getElementById("confirm-order");
const token = localStorage.getItem("token");

lagos.forEach(item => {
  lG1.insertAdjacentHTML(
    "beforeend",
    `<option value =${item}>${item}</option>`
  );
  lG2.insertAdjacentHTML(
    "beforeend",
    `<option value =${item}>${item}</option>`
  );
});

bookingForm.addEventListener("submit", async e => {
  e.preventDefault();
  const {
    address1,
    city1,
    lg1,
    address2,
    city2,
    lg2,
    pickupTime,
    parcelDescription,
    parcelWeight
  } = bookingForm;

  const json = JSON.stringify({
    pickupAddress: `${address1.value}, ${city1.value}, ${lg1.value}`,
    destination: `${address2.value}, ${city2.value}, ${lg2.value}`,
    pickupTime: pickupTime.value,
    parcelDescription: parcelDescription.value,
    parcelWeight: parcelWeight.value
  });

  loadButtonSpinner(submitButton);

  const { response, data: body } = await createAndUpdateRequests(
    "/api/v1/parcels/confirm",
    "POST",
    token,
    json
  );

  if (response.status === 401 || response.status === 403) {
    window.location.href = "/signup.html";
    return;
  }

  const formError = document.getElementById("form-error");
  if (response.status === 400) {
    removeButtonSpinner(submitButton);
    formError.innerHTML = body.message;
    return;
  }

  if (response.status !== 200) return;

  modal.style.display = "block";

  confirmOrder.innerHTML = `<ul>
<h3 style = "text-align: center;">Confirm order details</h3>
<li><b>Pickup Address:</b> ${body.pickupAddress}</li>
<li><b>Destination:</b> ${body.destination}</li>
<li><b>Pickup Time:</b> ${new Date(Date.parse(body.pickupTime))}</li>
<li><b>Parcel Description:</b> ${body.parcelDescription}</li>
<li><b>Weight Category:</b> ${body.parcelWeight}</li>
<li><b>Distance:</b> ${body.distance}km</li>
<li><b>Price:</b> N${body.price}</li>
<li><button id= "cancel">Cancel</button> <button id = "confirm">Confirm</button></li>
</ul>`;

  const cancel = document.getElementById("cancel");
  const confirm = document.getElementById("confirm");

  cancel.onclick = e => {
    modal.style.display = "";
    removeButtonSpinner(submitButton);
  };

  confirm.onclick = async e => {
    confirmOrder.innerHTML =
      '<div style = "text-align: center; margin-top: 30%; color: #0B0B61;"><i class="fas fa-spinner fa-6x fa-pulse"></i></div>';

    const { response: result } = await createAndUpdateRequests(
      "/api/v1/parcels",
      "POST",
      token,
      json
    );

    if (result.status === 401 || result.status === 403) {
      window.location.href = "/signup.html";
      return;
    }

    if (result.status !== 201) return;
    displaySuccessMessage(confirmOrder, "Order successfully placed");
    window.location.href = "/profile.html";
  };
});
