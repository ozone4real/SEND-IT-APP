const navLinks = document.getElementById('nav-links');
const navBar = document.getElementById('nav-bar');
const navContents = document.getElementById('nav-contents');
const account = document.getElementById('account');
const presentPage = document.getElementById('present');

document.addEventListener('click', (e) => {

  if (e.target.closest('#nav-bar')) {
    if (presentPage) presentPage.style.background = '#D8D8D8';
    navLinks.classList.toggle('responsive-nav');
    navContents.classList.toggle('responsive-nav');
    document.body.classList.toggle('preventScroll');
    return;
  }
  if (!e.target.closest('#nav-links')) {
    navLinks.classList.remove('responsive-nav');
    navContents.classList.remove('responsive-nav');
    document.body.classList.remove('preventScroll');
  }
});

const carousel = document.getElementById('container1');
setInterval(() => {
  carousel.classList.toggle('sliding');
}, 6000);

window.onscroll = (e) => {
  if (pageYOffset) {
    navLinks.classList.remove('responsive-nav');
    navContents.classList.remove('responsive-nav');
    document.body.classList.remove('preventScroll');
  }
};




document.addEventListener('DOMContentLoaded', async (e) => {
  await verifyUser();

  const userIcon = document.getElementById('user-icon');
  const accountMenu = document.getElementById('account-menu');
  userIcon.onclick = () => {
    accountMenu.classList.toggle('display-menu');
    const userIconPos = userIcon.getBoundingClientRect();

    accountMenu.style.left = `${userIconPos.left - (accountMenu.offsetWidth - userIcon.offsetWidth) / 2}px`;
  };

  const logout = document.getElementById('logout');
  logout.onclick = () => {
    localStorage.clear();
    window.location.href = '/';
  };
});


async function verifyUser() {
  const accountHTML = `<div class='user'>
  <span id="user-icon" class="fas fa-user-alt fa-2x"> </span>
  <ul id="account-menu">
  <li><a href="/signup.html">Sign up</a></li>
  <li><a href="signin.html">Sign in</a></li>
  </ul>
  </div>`;

  const token = localStorage.getItem('token');

  if (!token) {
    account.innerHTML = accountHTML;
    return;
  }

  const response = await fetch('/api/v1/user', {
    headers: {
      'x-auth-token': token,
    }
  });

  if (response.status !== 200) {
    account.innerHTML = accountHTML;
    return;
  }

  const body = await response.json();

  if (!body.isadmin) {
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
}
