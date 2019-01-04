const formatDate = date =>
  new Date(date)
    .toString()
    .split(" ")
    .slice(0, 5)
    .join(" ");

const getRequests = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      "x-auth-token": token
    }
  });

  const data = await response.json();

  return { response, data };
};

const createAndUpdateRequests = async (url, method, token, formData) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token
    },
    body: formData
  });

  const data = await response.json();
  return { response, data };
};

const loadButtonSpinner = button => {
  button.disabled = true;
  button.insertAdjacentHTML(
    "beforeend",
    '<i class="fas fa-spinner fa-spin" style= "padding: 0 5px 0 10px;"></i>'
  );
};

const removeButtonSpinner = button => {
  button.disabled = false;
  button.lastElementChild.remove();
};

const loadDivSpinner = div => {
  div.innerHTML =
    '<div style = "text-align: center; margin-top: 30%; color: #0B0B61;"><i class="fas fa-spinner fa-4x fa-pulse"></i></div>';
};

const displaySuccessMessage = (div, message) => {
  div.innerHTML = `<div style="color: green; text-align: center; margin: 25% auto;">
  <h2>${message}</h2>
  <div><i class="far fa-check-circle fa-4x"></i></div>
  </div>`;
};

const fillAdminTable = (table, parcelProps, parcel, buttonClickHandler) => {
  const detailsList = parcelProps
    .map(
      prop =>
        `<div class="grid-item"> ${
          prop === "pickuptime" || prop === "receivedat"
            ? formatDate(parcel[prop])
            : parcel[prop]
        }</div>`
    )
    .join("\n");

  let button;

  if (parcel.status === "in transit" || parcel.status === "pending") {
    button = `<div class="grid-item" id="button">
    <button onclick="${buttonClickHandler}(${parcel.parcelid})">update</button>
  </div>`;
  } else {
    button = "";
  }

  table.lastElementChild.insertAdjacentHTML(
    "afterbegin",
    `<ul>
   <li>
       <div class="grid-container">
         ${detailsList}
         ${button}
       </div>
   </li>
 </ul>
`
  );
};

const insertParcelData = (div, insertPos, parcelProps, parcel) => {
  const detailsList = parcelProps
    .map(
      prop =>
        `<li><b>${prop.label}:</b> ${
          prop.name === "receivedat" || prop.name === "pickuptime"
            ? formatDate([parcel[prop.name]])
            : parcel[prop.name]
        }</li>`
    )
    .join("\n");

  let buttons;

  if (parcel.status === "cancelled" || parcel.status === "delivered") {
    buttons = "";
  } else {
    buttons = `<li><button onclick= "cancelOrder(${
      parcel.parcelid
    })">Cancel</button>
    <button  onclick="changeDestination(${
      parcel.parcelid
    })">Change Destination</button>
    ${
      parcel.status === "in transit"
        ? `<button><a href="/track.html?parcelId=${
            parcel.parcelid
          }">Track</a></button>`
        : ""
    }
    </li>`;
  }

  div.insertAdjacentHTML(
    insertPos,
    `<ul>
    ${detailsList}
    ${buttons}
</ul>`
  );
};

const removeModal = elem => {
  elem.style.display = "";
};

const displayDiv = (divElems, currentElem) => {
  const toggleDisplay = display => {
    Array.from(divElems).forEach(elem => {
      if (highlighted.dataset.name === elem.id) elem.style.display = display;
    });
  };

  if (highlighted) {
    highlighted.classList.remove("highlight");
    toggleDisplay("none");
  }
  highlighted = currentElem;
  highlighted.classList.add("highlight");
  toggleDisplay("");
};
