const navCont = document.getElementById('nav-contents');
const navBar = document.getElementById('nav-bar');
const account = document.getElementById('account');

document.addEventListener('click', (e) => {

  if (e.target.closest('#nav-bar')) {
    return navCont.classList.toggle('responsive-nav');
  }
  if (!event.target.closest('#nav-contents')) navCont.classList.remove('responsive-nav');
});


const carousel = document.getElementById('container1');
setInterval(() => {
  carousel.classList.toggle('sliding');
}, 6000);

document.addEventListener('DOMContentLoaded', (e) => {
  verifyUser();
});

async function verifyUser() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const response = await fetch('/api/v1/user', {
    headers: {
      'x-auth-token': token,
    }
  });

  if (response.status !== 200) return;
  const body = await response.json();
  if(!body.isadmin) {
    account.innerHTML = `<div class='user'>
    <span id="user-icon" class="fas fa-user-alt fa-2x"> </span>
    <ul id="account-menu">
    <li><a href="/profile.html">My Profile</a></li>
    <li id = "logout">Logout</li>
    </ul>
    </div>`;
  } else {
    account.innerHTML = `<div class='user'>
    <span id="user-icon" class="fas fa-user-alt fa-2x"> </span>
    <ul id="account-menu">
    <li><a href="/profile.html">My Profile</a></li>
    <li><a href="/admin.html">Manage Parcels</a></li>
    <li id = "logout">Logout</li>
    </ul>
    </div>`;
  }

  const userIcon = document.getElementById('user-icon');
  const accountMenu = document.getElementById('account-menu');
  userIcon.onclick = () => {
    accountMenu.classList.toggle('display-menu');
    const userIconPos = userIcon.getBoundingClientRect();

    accountMenu.style.left = `${userIconPos.left - (accountMenu.offsetWidth - userIcon.offsetWidth)/2  }px`;
  };

  const logout = document.getElementById('logout');
  logout.onclick = () => {
    localStorage.clear();
    window.location.href = '/';
  };

}
