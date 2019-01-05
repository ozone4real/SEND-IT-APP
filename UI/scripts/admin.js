const token = localStorage.getItem("token");
const categories = document.getElementById("categories");
const parcelsTables = document.getElementById("parcelsTables")
  .firstElementChild;
const confirmOrder = document.getElementById("confirm-order");
const modal = document.querySelector(".modal");
const signOutButton = document.getElementById("signout");

handleSignOut(signOutButton);

let highlighted = categories.querySelector("ul").firstElementChild;
displayElemsOnClick(categories, parcelsTables.children);

document.addEventListener("DOMContentLoaded", async e => {
  const { response, data: body } = await getRequests("/api/v1/parcels", token);
  if (response.status === 401 || response.status === 403) {
    window.location.href = "/";
    return;
  }

  if (response.status === 404) {
    parcelsTables.innerHTML =
      '<div class="container"><h1>No orders have been made</h1></div>';
    return;
  }

  if (response.status !== 200) return;

  const pending = body.filter(parcel => parcel.status === "pending");
  const inTransit = body.filter(parcel => parcel.status === "in transit");
  const delivered = body.filter(parcel => parcel.status === "delivered");
  const cancelled = body.filter(parcel => parcel.status === "cancelled");

  const pendingTable = parcelsTables.querySelector("#pending-table");
  const transitingTable = parcelsTables.querySelector("#in-transit-table");
  const deliveredTable = parcelsTables.querySelector("#delivered-table");
  const cancelledTable = parcelsTables.querySelector("#cancelled-table");

  setTimeout(() => {
    document.getElementById("total-in-transit").innerHTML = inTransit.length;
    document.getElementById("total-delivered").innerHTML = delivered.length;
    document.getElementById("total-cancelled").innerHTML = cancelled.length;
    document.getElementById("total-pending").innerHTML = pending.length;
  }, 0);

  if (!pending[0]) {
    pendingTable.innerHTML = "<h2>There are no pending orders</h2>";
  }
  if (!inTransit[0]) {
    transitingTable.innerHTML = "<h2>There are no transiting parcels</h2>";
  }
  if (!cancelled[0]) {
    cancelledTable.innerHTML = "<h2>There are no cancelled parcels</h2>";
  }
  if (!delivered[0]) {
    deliveredTable.innerHTML = "<h2>There are no delivered parcels</h2>";
  }

  pending.forEach(parcel => {
    const parcelProps = [
      "userid",
      "parcelid",
      "parceldescription",
      "parcelweight",
      "price",
      "pickupaddress",
      "destination",
      "pickuptime",
      "status"
    ];
    fillAdminTable(pendingTable, parcelProps, parcel, "updatePending");
  });

  inTransit.forEach(parcel => {
    const parcelProps = [
      "userid",
      "parcelid",
      "parceldescription",
      "parcelweight",
      "price",
      "pickupaddress",
      "destination",
      "status",
      "presentlocation"
    ];

    fillAdminTable(transitingTable, parcelProps, parcel, "updateTransiting");
  });

  cancelled.forEach(parcel => {
    const parcelProps = [
      "userid",
      "parcelid",
      "parceldescription",
      "parcelweight",
      "price",
      "pickupaddress",
      "destination",
      "status",
      "presentlocation"
    ];

    fillAdminTable(cancelledTable, parcelProps, parcel);
  });

  delivered.forEach(parcel => {
    const parcelProps = [
      "userid",
      "parcelid",
      "parceldescription",
      "parcelweight",
      "price",
      "pickupaddress",
      "destination",
      "status",
      "receivedby",
      "receivedat"
    ];

    fillAdminTable(deliveredTable, parcelProps, parcel);
  });
});

function updatePending(id) {
  modal.style.display = "block";
  confirmOrder.innerHTML = `<form id="update-form" style="margin: 10% auto;">
        <h3>Update parcel ${id}</h3>
        <label>Status</label>
        <select name='status' required>
        <option value="" disabled>status</option>
        <option value='in transit' selected="true">in transit</option>
        <option value='delivered' disabled>delivered</option>
        </select>
        <small></small>
        <input style="margin-bottom: 0;" type="text" name="presentLocation" placeholder="Present Location(town, state)" required>
        <button type="button" onclick="removeModal(modal)">Return</button> <button type="submit" name="submitButton">Submit</button>
        </form>`;

  const updateForm = document.getElementById("update-form");

  updateForm.addEventListener("submit", async e => {
    e.preventDefault();

    loadButtonSpinner(updateForm.submitButton);

    const json = JSON.stringify({
      presentLocation: updateForm.presentLocation.value,
      status: updateForm.status.value
    });

    const { response, data: body } = await createAndUpdateRequests(
      `/api/v1/parcels/${id}/status`,
      "PUT",
      token,
      json
    );

    if (response.status === 400) {
      removeButtonSpinner(updateForm.submitButton);
      updateForm.presentLocation.previousElementSibling.innerHTML =
        body.message;
      return;
    }

    if (response.status !== 200) return;
    displaySuccessMessage(confirmOrder, "Parcel successfully updated");
    window.location.href = "/admin.html";
  });
}

function updateTransiting(id) {
  modal.style.display = "block";
  confirmOrder.innerHTML = `<form id="update-form" style="margin: 8% auto;">
          <h3>Update parcel ${id}</h3>
          <small id="updateError" style="display:block;"></small>
          <label>Status</label>
          <select name='status' required>
          <option value="" disabled>status</option>
          <option value='in transit' selected="true">in transit</option>
          <option value='delivered'>delivered</option>
          </select>
          <input type="text" name="receivedBy" placeholder="receiver" style="display: none;">
          <input type="datetime-local" name="receivedAt" placeholder="Time of delivery" style="display: none;" >
          <small></small>
          <input style="margin-bottom: 0;" type="text" name="presentLocation" placeholder="Present Location (town, state)" required>
          <button type="button" onclick="removeModal(modal)">Return</button> <button type="submit" name="submitButton">Submit</button>
          </form>`;

  const updateForm = document.getElementById("update-form");

  let url = `api/v1/parcels/${id}/presentLocation`;

  updateForm.status.oninput = () => {
    const toggleUpdateForm = (display, isdisabled, isrequired, fetchUrl) => {
      updateForm.receivedBy.style.display = updateForm.receivedAt.style.display = display;
      updateForm.receivedBy.required = updateForm.receivedAt.required = isrequired;
      updateForm.presentLocation.disabled = isdisabled;
      url = fetchUrl;
    };

    if (updateForm.status.value === "delivered") {
      toggleUpdateForm("", true, true, `api/v1/parcels/${id}/status`);
      updateError.innerHTML = "";
    } else {
      toggleUpdateForm(
        "none",
        false,
        false,
        `api/v1/parcels/${id}/presentLocation`
      );
    }
  };

  updateForm.addEventListener("submit", async e => {
    e.preventDefault();

    loadButtonSpinner(updateForm.submitButton);

    const json = JSON.stringify({
      status: updateForm.status.value,
      receivedBy: updateForm.receivedBy.value,
      receivedAt: updateForm.receivedAt.value,
      presentLocation: updateForm.presentLocation.value
    });

    const { response, data: body } = await createAndUpdateRequests(
      url,
      "PUT",
      token,
      json
    );

    if (response.status === 400) {
      removeButtonSpinner(updateForm.submitButton);
      updateError.innerHTML = body.message;
      return;
    }

    if (response.status !== 200) {
      window.location.href = "/";
      return;
    }
    displaySuccessMessage(confirmOrder, "Parcel successfully updated");
    window.location.href = "/admin.html";
  });
}
