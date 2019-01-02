const lagos = [
  'Agege',
  'Ajeromi-Ifelodun',
  'Alimosho',
  'Amuwo-Odofin',
  'Apapa',
  'Badagry',
  'Epe',
  'Eti Osa',
  'Ibeju-Lekki',
  'Ifako-Ijaiye',
  'Ikeja',
  'Ikorodu',
  'Kosofe',
  'Lagos Island',
  'Lagos Mainland',
  'Mushin',
  'Ojo',
  'Oshodi-Isolo',
  'Shomolu',
  'Surulere'
];
const lG1 = document.getElementById('lg1');
const lG2 = document.getElementById('lg2');
const bookingForm = document.getElementById('booking-form');
const submitButton = bookingForm.querySelector('button');
const modal = document.querySelector('.modal');
const confirmOrder = document.getElementById('confirm-order');
const token = localStorage.getItem('token');

lagos.forEach((item) => {
  lG1.insertAdjacentHTML(
    'beforeend',
    `<option value =${item}>${item}</option>`
  );
  lG2.insertAdjacentHTML(
    'beforeend',
    `<option value =${item}>${item}</option>`
  );
});


bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const bookingFormElems = Array.from(bookingForm.elements);
  let error;
  bookingFormElems.forEach((item) => {
    if (item.tagName !== 'INPUT' && item.tagName !== 'SELECT') return;
    if (!item.value) {
      item.style.cssText = 'background-color: lightyellow; border-color: red;';
      item.previousElementSibling.innerHTML = 'This must not be empty';
      error = true;
    }
  });

  if (error) return;

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

  submitButton.disabled = true;
  submitButton.insertAdjacentHTML(
    'beforeend',
    '<i class="fas fa-spinner fa-spin" style= "padding: 0 5px 0 10px;"></i>'
  );

  const response = await createOrder('/api/v1/parcels/confirm', json);
  const body = await response.json();

  if (response.status === 401 || response.status === 403) {
    window.location.href = '/signup.html';
    return;
  }

  const formError = document.getElementById('form-error');
  if (response.status === 400) {
    submitButton.disabled = false;
    submitButton.lastElementChild.remove();
    formError.innerHTML = body.message;
    return;
  }

  if (response.status !== 200) return;

  modal.style.display = 'block';

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

  const cancel = document.getElementById('cancel');
  const confirm = document.getElementById('confirm');

  cancel.onclick = (e) => {
    modal.style.display = '';
    submitButton.disabled = false;
    submitButton.lastElementChild.remove();
  };

  confirm.onclick = async (e) => {
    confirmOrder.innerHTML =      '<div style = "text-align: center; margin-top: 30%; color: #0B0B61;"><i class="fas fa-spinner fa-6x fa-pulse"></i></div>';
    const result = await createOrder('api/v1/parcels', json);
    if (result.status === 401 || result.status === 403) {
      window.location.href = '/signup.html';
      return;
    }
    if (result.status !== 201) return;
    await result.json();
    confirmOrder.innerHTML = `<div style="color: green; text-align: center; margin: 25% auto;">
    <h1>Order successfully placed</h1>
    <div><i class="far fa-check-circle fa-5x"></i></div>
    </div>`;
    window.location.href = '/profile.html';
  };
});

async function createOrder(url, json) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: json
  });

  return response;
}
