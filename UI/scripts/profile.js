const profileHead = document.getElementById('head');
const profileBody = document.getElementById('body');

let highlighted = profileHead.querySelector('ul').firstElementChild;

profileHead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'LI') return;
  display(e.target);
});

function display(node) {
  if (highlighted) {
    highlighted.classList.remove('highlight');
    for (elem of profileBody.children) {
      if (highlighted.id === elem.id) elem.style.display = 'none';
    }
  }
  highlighted = node;
  highlighted.classList.add('highlight');
  for (elem of profileBody.children) {
    if (highlighted.id === elem.id) elem.style.display = '';
  }
}


document.addEventListener('DOMContentLoaded', async (e) => {
  const userInfo = document.querySelector('.info');
  const token = localStorage.getItem('token');

  const response = await fetch('/api/v1/user/', {
    headers: {
      'x-auth-token': token
    },
  });

  if (response.status === 404) return window.location.href = '../signup.html';

  const body = await response.json();

  userInfo.innerHTML = `<ul>
  <li id="username"><h2>${body.fullname.toUpperCase()}</h2></li>
  <li><b>Email: </b>${body.email}</li>
  <li id="user-cont"><b>Phone No:</b> <span id= 'contact-edit'><span id='num-edit'>${body.phoneno}</span>  <button id="num-change">Change?</button></span></li>
  <li id="reg-date"><b>Date Registered: </b>${new Date(Date.parse(body.registered))} </li>
  <li id= "total-parcels"><b>Total Number of Parcel Orders:</b> </li>
</ul>`;

  const numEdit = document.getElementById('num-edit');
  const numChange = document.getElementById('num-change');
  const contactEdit = document.getElementById('contact-edit');


  numChange.onclick = (e) => {
    const numForm = document.createElement('form');
    numForm.style.display = 'inline';
    numForm.innerHTML = '<input type="number" name = "contact" style="max-width: 150px; padding: 3px; display: inline;"> <input type= "submit" value ="submit" style="display:inline; padding: 3px; width: auto;">';
    numForm.contact.value = numEdit.innerHTML;
    contactEdit.replaceWith(numForm);

    numForm.onsubmit = (e) => {
      e.preventDefault();
      const value = numForm.contact.value;
      numForm.replaceWith(contactEdit);
      numEdit.innerHTML = value;
    };
  };

});
