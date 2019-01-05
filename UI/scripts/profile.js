const profileHead = document.getElementById("head");
const profileBody = document.getElementById("body");
const token = localStorage.getItem("token");
const modal = document.querySelector(".modal");
const confirmOrder = document.getElementById("confirm-order");

let highlighted = profileHead.querySelector("ul").firstElementChild;
displayElemsOnClick(profileHead, profileBody.children);

document.addEventListener("DOMContentLoaded", async e => {
  const userInfo = document.querySelector(".info");
  userInfo.innerHTML =
    '<i style= "margin: 80px 40%;" class="fas fa-spinner fa-pulse fa-6x"></i>';

  const {
    response,
    data: { fullname, email, phoneno, registered }
  } = await getRequests("/api/v1/user/", token);

  if (response.status === 404) return (window.location.href = "../signup.html");

  userInfo.innerHTML = `<ul>
  <li id="username"><h2>${fullname.toUpperCase()}</h2></li>
  <li><b>Email: </b>${email}</li>
  <li id="user-cont"><b>Phone No:</b> <span id= 'contact-edit'><span id='num-edit'>${phoneno}</span>  <button style="display:inline; width: auto;" id="num-change"><i class="far fa-edit"></i></button></span></li>
  <li id="reg-date"><b>Date Registered: </b>${new Date(
    Date.parse(registered)
  )} </li>
  <li><b>Total Number of Parcel Orders:</b> <span id="total-parcels"></span></li>
</ul>`;

  const numEdit = document.getElementById("num-edit");
  const numChange = document.getElementById("num-change");
  const contactEdit = document.getElementById("contact-edit");

  numChange.onclick = e => {
    const numForm = document.createElement("form");
    numForm.style.display = "inline";
    numForm.innerHTML = `<small></small><input type="number" name = "contact" style="max-width: 150px; padding: 3px; display: inline;">
     <input type= "submit" value ="submit" name="submit" style="display:inline; padding: 3px; width: auto;">`;
    numForm.contact.value = numEdit.innerHTML;
    contactEdit.replaceWith(numForm);

    numForm.onsubmit = async e => {
      e.preventDefault();
      const { value } = numForm.contact;
      if (!/^\d{7,20}$/.test(value)) {
        numForm.contact.previousElementSibling.innerHTML =
          "Invalid phone number";
        return;
      }

      const submitButton = numForm.lastElementChild;
      const data = JSON.stringify({ phoneNo: value });

      submitButton.insertAdjacentHTML(
        "afterend",
        '<i class="fas fa-spinner fa-spin" style= "padding: 0 5px 0 10px;"></i>'
      );

      const { response: result } = await createAndUpdateRequests(
        "/api/v1/user/updatePhoneNo",
        "PUT",
        token,
        data
      );

      if (result.status !== 200) return;
      numForm.replaceWith(contactEdit);
      numEdit.innerHTML = value;
    };
  };

  const { response: result, data: parcelsBody } = await getRequests(
    "/api/v1/user/parcels",
    token
  );

  const unfulfilled = document.querySelector(".unfulfilled");
  const delivered = document.querySelector(".delivered");
  const totalParcels = document.getElementById("total-parcels");

  if (result.status === 404) {
    setTimeout(() => {
      totalParcels.innerHTML = "0";
    }, 0);

    unfulfilled.innerHTML = `<ul style="width: 100%; text-align: center; background: white;">
    <li><h2>You have no Unfulfilled orders<h2></li>
    <li><a href="/bookings.html" style="text-decoration:underline;">Create An Order Now</a></li>
    </ul>`;

    delivered.innerHTML = `<ul style="width: 100%; text-align: center; background: white;">
    <li><h2>You have no delivered orders<h2></li>
    </ul>`;

    return;
  }

  if (result.status !== 200) return;

  setTimeout(() => {
    totalParcels.innerHTML = parcelsBody.length;
  }, 0);

  const unfulfilledParcels = parcelsBody.filter(p => p.status !== "delivered");
  const deliveredParcels = parcelsBody.filter(p => p.status === "delivered");

  if (!unfulfilledParcels[0]) {
    unfulfilled.innerHTML = `<ul style="width: 100%; text-align: center; background: white;">
  <li><h2>You have no Unfulfilled orders<h2></li>
  <li><a href="/bookings.html" style="text-decoration:underline;">Create An Order Now</a></li>
  </ul>`;
  }

  if (!deliveredParcels[0]) {
    delivered.innerHTML = `<ul style="width: 100%; text-align: center; background: white;">
  <li><h2>You have no delivered orders<h2></li>
  </ul>`;
  }

  const parcelProps = [
    { name: "parcelid", label: "Parcel ID" },
    { name: "parceldescription", label: "Parcel Description" },
    { name: "parcelweight", label: "Weight category" },
    { name: "price", label: "Price" },
    { name: "pickupaddress", label: "Pickup Address" },
    { name: "destination", label: "Destination" },
    { name: "pickuptime", label: "Pickup Time" },
    { name: "status", label: "Status" }
  ];

  unfulfilledParcels.forEach(item => {
    if (item.status === "pending") {
      insertParcelData(unfulfilled, "afterbegin", parcelProps, item);
    }

    if (item.status === "cancelled") {
      insertParcelData(unfulfilled, "beforeend", parcelProps, item);
    }

    if (item.status === "in transit") {
      const transitingParcelProps = [...parcelProps];
      transitingParcelProps.push({
        name: "presentlocation",
        label: "Present Location"
      });
      insertParcelData(unfulfilled, "afterbegin", transitingParcelProps, item);
    }
  });

  deliveredParcels.forEach(item => {
    const deliveredParcelProps = [...parcelProps];
    deliveredParcelProps.push(
      { name: "receivedby", label: "Received By" },
      { name: "receivedat", label: "Time Received" }
    );
    insertParcelData(delivered, "afterbegin", deliveredParcelProps, item);
  });
});

function cancelOrder(id) {
  modal.style.display = "block";

  confirmOrder.innerHTML = `<div style="text-align: center; margin: 25% auto;">
  <h2>Are you sure you want to cancel this order (Parcel ID: ${id})?</h2>
  <button onclick="removeModal(modal)">No! Return</button><button id="confirm-cancel">Yes! Cancel</button>
  </div>`;

  const confirmCancel = document.getElementById("confirm-cancel");

  confirmCancel.onclick = async () => {
    loadDivSpinner(confirmOrder);

    const {
      response,
      data: { message }
    } = await createAndUpdateRequests(
      `/api/v1/parcels/${id}/cancel`,
      "PUT",
      token
    );

    if (response.status !== 200) {
      confirmOrder.innerHTML = `<div style="text-align: center; margin: 25% auto;">
      <h4>Couldn't cancel order presently. ${message}</h4>
      <button id="abort">Return</button>
      </div>`;
      return;
    }

    displaySuccessMessage(confirmOrder, "Order successfully cancelled");
    location.href = "/profile.html";
  };
}

function changeDestination(id) {
  modal.style.display = "block";

  confirmOrder.innerHTML = `<form id="update-form" style="margin: 20% auto;">
  <label><h3>New Destination for parcel (ID: ${id})</h3></label>
  <small></small>
  <input style="margin-bottom:0;" type="text" name="destination" placeholder="New Destination" required>
  <button type="button" onclick="removeModal(modal)">Return</button> <button type="submit">Submit</button>
  </form>`;

  const updateForm = document.getElementById("update-form");

  updateForm.addEventListener("submit", async e => {
    e.preventDefault();
    const json = JSON.stringify({
      destination: updateForm.destination.value
    });

    const submitButton = updateForm.lastElementChild;

    loadButtonSpinner(submitButton);

    const {
      response,
      data: { message, destination, price }
    } = await createAndUpdateRequests(
      `/api/v1/parcels/${id}/confirmUpdate`,
      "PUT",
      token,
      json
    );

    if (response.status === 400) {
      removeButtonSpinner(submitButton);
      updateForm.destination.previousElementSibling.innerHTML = message;
      return;
    }

    if (response.status !== 200) {
      confirmOrder.innerHTML = `<h3 style="color: red; text-align: center; margin: 25% auto;">${message}</h3>`;
      return;
    }

    confirmOrder.innerHTML = `<ul style="margin: 20% auto">
    <h2 style = "text-align: center;">Confirm Update</h2>
    <li><b>New destination:</b> ${destination}</li>
    <li><b>New price:</b> N${price}</li>
    <li><button id= "cancel">Cancel</button> <button id = "confirm">Confirm</button></li>
    </ul>`;

    const cancelUpdate = document.getElementById("cancel");
    const confirmUpdate = document.getElementById("confirm");

    cancelUpdate.onclick = () => {
      modal.style.display = "";
    };

    confirmUpdate.onclick = async () => {
      loadDivSpinner(confirmOrder);

      const {
        response: result,
        data: { message: errorMessage }
      } = await createAndUpdateRequests(
        `/api/v1/parcels/${id}/destination`,
        "PUT",
        token,
        json
      );

      if (result.status !== 200) {
        confirmOrder.innerHTML = `<h3 style="color: red; text-align: center; margin: 25% auto;">${errorMessage}</h3>`;
        return;
      }
      displaySuccessMessage(confirmOrder, "Destination successfully changed");
      window.location.href = "/profile.html";
    };
  });
}
