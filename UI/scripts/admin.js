const token = localStorage.getItem('token');
const categories = document.getElementById('categories');
const parcelsTables = document.getElementById('parcelsTables').firstElementChild;
const confirmOrder = document.getElementById('confirm-order');
const modal = document.querySelector('.modal');
const signout = document.getElementById('signout');

signout.onclick = () => {
  localStorage.clear();
  window.location.href = '/';
};

let highlighted = categories.querySelector('ul').firstElementChild;

categories.addEventListener('click', (e) => {
  if (e.target.tagName !== 'LI') return;
  display(e.target);
});

function display(node) {
  if (highlighted) {
    highlighted.classList.remove('highlight');
    for (elem of parcelsTables.children) {
      if (highlighted.dataset.name === elem.id) elem.style.display = 'none';
    }
  }
  highlighted = node;
  highlighted.classList.add('highlight');
  for (elem of parcelsTables.children) {
    if (highlighted.dataset.name === elem.id) elem.style.display = '';
  }
}


document.addEventListener('DOMContentLoaded', async (e) => {
  const response = await fetchParcels();
  const body = await response.json();
  if (response.status === 401 || response.status === 403) {
    window.location.href = '/';
    return;
  }

  if (response.status === 404) {
    parcelsTables.innerHTML = '<div class="container"><h1>No orders have been made</h1></div>';
    return;
  }

  if (response.status !== 200) return;

  const pending = body.filter(parcel => parcel.status === 'recorded');
  const inTransit = body.filter(parcel => parcel.status === 'in transit');
  const delivered = body.filter(parcel => parcel.status === 'delivered');
  const cancelled = body.filter(parcel => parcel.status === 'cancelled');

  const pendingTable = parcelsTables.querySelector('#recorded-table');
  const transitingTable = parcelsTables.querySelector('#in-transit-table');
  const deliveredTable = parcelsTables.querySelector('#delivered-table');
  const cancelledTable = parcelsTables.querySelector('#cancelled-table');

  setTimeout(() => {
    document.getElementById('total-in-transit').innerHTML = inTransit.length;
    document.getElementById('total-delivered').innerHTML = delivered.length;
    document.getElementById('total-cancelled').innerHTML = cancelled.length;
    document.getElementById('total-pending').innerHTML = pending.length;

  }, 0);

  if (!pending[0]) pendingTable.innerHTML = '<h2>There are no pending orders</h2>';
  if (!inTransit[0]) transitingTable.innerHTML = '<h2>There are no transiting parcels</h2>';
  if (!cancelled[0]) cancelledTable.innerHTML = '<h2>There are no cancelled parcels</h2>';
  if (!delivered[0]) deliveredTable.innerHTML = '<h2>There are no delivered parcels</h2>';

  pending.forEach((parcel) => {
    const {
      userid, parcelid, parceldescription, parcelweight, price, pickuptime, pickupaddress, destination, status, presentlocation
    } = parcel;
    pendingTable.lastElementChild.insertAdjacentHTML('afterbegin',
      `<ul>
       <li>
           <div class="grid-container">
             <div class="grid-item">${userid}</div>
             <div class="grid-item">${parcelid}</div>
             <div class="grid-item">${parceldescription}</div>
             <div class="grid-item">${parcelweight}</div>
             <div class="grid-item">N${price}</div>
             <div class="grid-item">${pickupaddress}</div>
             <div class="grid-item">${destination}</div>
             <div class="grid-item">${new Date(pickuptime)}</div>
             <div class="grid-item">${status}</div>
             <div class="grid-item" id="button">
               <button onclick="updatePending(${parcelid})">update</button>
             </div>
           </div>
       </li>
     </ul>
`);
  });

  inTransit.forEach((parcel) => {
    const {
      userid, parcelid, parceldescription, parcelweight, price, pickupaddress, destination, status, presentlocation
    } = parcel;
    transitingTable.lastElementChild.insertAdjacentHTML('afterbegin',
      `<ul>
       <li>
           <div class="grid-container">
             <div class="grid-item">${userid}</div>
             <div class="grid-item">${parcelid}</div>
             <div class="grid-item">${parceldescription}</div>
             <div class="grid-item">${parcelweight}</div>
             <div class="grid-item">N${price}</div>
             <div class="grid-item">${pickupaddress}</div>
             <div class="grid-item">${destination}</div>
             <div class="grid-item">${status}</div>
             <div class="grid-item">${presentlocation}</div>
             <div class="grid-item" id="button">
             <button onclick="updateTransiting(${parcelid})">update</button>
             </div>
           </div>
       </li>
     </ul>
`);
  });

  cancelled.forEach((parcel) => {
    const {
      userid, parcelid, parceldescription, parcelweight, price, pickupaddress, destination, status, presentlocation
    } = parcel;
    cancelledTable.lastElementChild.insertAdjacentHTML('afterbegin',
      `<ul>
       <li>
           <div class="grid-container">
             <div class="grid-item">${userid}</div>
             <div class="grid-item">${parcelid}</div>
             <div class="grid-item">${parceldescription}</div>
             <div class="grid-item">${parcelweight}</div>
             <div class="grid-item">N${price}</div>
             <div class="grid-item">${pickupaddress}</div>
             <div class="grid-item">${destination}</div>
             <div class="grid-item">${status}</div>
             <div class="grid-item">${presentlocation}</div>
           </div>
       </li>
     </ul>
`);
  });

  delivered.forEach((parcel) => {
    const {
      userid, parcelid, parceldescription, parcelweight, price, pickupaddress,
      destination, status, receivedby, receivedat
    } = parcel;
    deliveredTable.lastElementChild.insertAdjacentHTML('afterbegin',
      `<ul>
       <li>
           <div class="grid-container">
             <div class="grid-item">${userid}</div>
             <div class="grid-item">${parcelid}</div>
             <div class="grid-item">${parceldescription}</div>
             <div class="grid-item">${parcelweight}</div>
             <div class="grid-item">N${price}</div>
             <div class="grid-item">${pickupaddress}</div>
             <div class="grid-item">${destination}</div>
             <div class="grid-item">${status}</div>
             <div class="grid-item">${receivedby}</div>
             <div class="grid-item">${new Date(receivedat)}</div>
           </div>
       </li>
     </ul>
`);
  });

});






function updatePending(id) {
  modal.style.display = 'block';
  confirmOrder.innerHTML = `<form id="update-form" style="margin: 10% auto;">
        <h3>Update parcel ${id}</h3>
        <label>Status</label>
        <select name='status'>
        <option value="" disabled>status</option>
        <option value='in transit' selected="true">in transit</option>
        <option value='delivered' disabled>delivered</option>
        </select>
        <small></small>
        <input style="margin-bottom: 0;" type="text" name="presentLocation" placeholder="Present Location(town, state)">
        <button id="abort" type="button">Return</button> <button type="submit">Submit</button>
        </form>`;

  const abort = document.getElementById('abort');
  const updateForm = document.getElementById('update-form');

  abort.onclick = () => {
    modal.style.display = '';
  };

  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!updateForm.presentLocation.value) {
      updateForm.presentLocation.previousElementSibling.innerHTML = 'This must not be empty';
      return;
    }

    const json = JSON.stringify({
      presentLocation: updateForm.presentLocation.value,
      status: updateForm.status.value,
    });

    const response = await updateParcelRequest(`/api/v1/parcels/${id}/status`, json);
    const body = await response.json();

    if (response.status === 400) {
      updateForm.presentLocation.previousElementSibling.innerHTML = body.message;
      return;
    }

    if (response.status !== 200) return;
    confirmOrder.innerHTML = '<h2 style="color: green; text-align: center; margin: 25% auto;">Parcel successfully updated</h2>';
    window.location.href = '/admin.html';
  });
}




function updateTransiting(id) {
  modal.style.display = 'block';
  confirmOrder.innerHTML = `<form id="update-form" style="margin: 8% auto;">
          <h3>Update parcel ${id}</h3>
          <small id="updateError" style="display:block;"></small>
          <label>Status</label>
          <select name='status'>
          <option value="" disabled>status</option>
          <option value='in transit' selected="true">in transit</option>
          <option value='delivered'>delivered</option>
          </select>
          <input type="text" name="receivedBy" placeholder="receiver" style="display: none;">
          <input type="datetime-local" name="receivedAt" placeholder="Time of delivery" style="display: none;">
          <small></small>
          <input style="margin-bottom: 0;" type="text" name="presentLocation" placeholder="Present Location (town, state)">
          <button id="abort" type="button">Return</button> <button type="submit">Submit</button>
          </form>`;

  const abort = document.getElementById('abort');
  const updateForm = document.getElementById('update-form');

  abort.onclick = () => {
    modal.style.display = '';
  };

  let url = `api/v1/parcels/${id}/presentLocation`;
  updateForm.status.oninput = () => {
    if (updateForm.status.value === 'delivered') {
      updateForm.receivedBy.style.display = '';
      updateForm.receivedAt.style.display = '';
      updateForm.presentLocation.disabled = true;
      url = `api/v1/parcels/${id}/status`;
    } else {
      updateForm.receivedBy.style.display = 'none';
      updateForm.receivedAt.style.display = 'none';
      updateForm.presentLocation.disabled = false;
      url = `api/v1/parcels/${id}/presentLocation`;
    }
  };

  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!updateForm.presentLocation.value && !updateForm.presentLocation.disabled) {
      updateForm.presentLocation.previousElementSibling.innerHTML = 'This must not be empty';
      return;
    }

    const json = JSON.stringify({
      status: updateForm.status.value,
      receivedBy: updateForm.receivedBy.value,
      receivedAt: updateForm.receivedAt.value,
      presentLocation: updateForm.presentLocation.value,
    });

    const response = await updateParcelRequest(url, json);
    const body = await response.json();
    if (response.status === 400) {
      updateError.innerHTML = body.message;
      return;
    }

    if (response.status !== 200) {
      window.location.href = '/';
      return;
    }

    confirmOrder.innerHTML = '<h2 style="color: green; text-align: center; margin: 25% auto;">Parcel successfully updated</h2>';
    window.location.href = '/admin.html';

  });


}


async function fetchParcels() {
  const response = await fetch('/api/v1/parcels', {
    headers: {
      'x-auth-token': token,
    },
  });

  return response;
}

async function updateParcelRequest(url, json) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: json,
  });

  return response;
}
