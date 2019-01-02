const navLinks = document.getElementById('nav-links');
const navBar = document.getElementById('nav-bar');
const navContents = document.getElementById('nav-contents');
const user = document.querySelector('.user');
const presentPage = document.getElementById('present');

const removeClasses = () => {
  navLinks.classList.remove('responsive-nav');
  navContents.classList.remove('responsive-nav');
  document.body.classList.remove('preventScroll');
};


document.addEventListener('click', (e) => {
  if (e.target.closest('#nav-bar')) {
    if (presentPage) presentPage.style.background = '#D8D8D8';
    navLinks.classList.toggle('responsive-nav');
    navContents.classList.toggle('responsive-nav');
    document.body.classList.toggle('preventScroll');
    return;
  }
  if (!e.target.closest('#nav-links')) {
    removeClasses();
  }
});

const carousel = document.getElementById('container1');
setInterval(() => {
  carousel.classList.toggle('sliding');
}, 6000);

window.onscroll = (e) => {
  if (pageYOffset) {
    removeClasses();
  }
};

document.addEventListener('DOMContentLoaded', async (e) => {
  await verifyUser();

  const userIcon = document.getElementById('user-icon');
  const accountMenu = document.getElementById('account-menu');
  const accountMenuTip = document.querySelector('.tip');
  userIcon.onclick = () => {
    accountMenu.classList.toggle('display-menu');
    accountMenuTip.classList.toggle('display-tip');
    const userIconPos = userIcon.getBoundingClientRect();
    const accountMenuPos = accountMenu.getBoundingClientRect();

    accountMenu.style.left = `${userIconPos.left
      - (accountMenu.offsetWidth - userIcon.offsetWidth) / 2}px`;

    accountMenuTip.style.top = `${accountMenuPos.top
      - accountMenuTip.offsetHeight}px`;

    accountMenuTip.style.left = `${userIconPos.left
      - (accountMenuTip.offsetWidth - userIcon.offsetWidth) / 2}px`;
  };

  const logout = document.getElementById('logout');
  logout.onclick = () => {
    localStorage.clear();
    window.location.href = '/';
  };
});

async function verifyUser() {
  const accountHTML = `<div class='user'>
  <span id="user-icon" class="fas fa-user-circle fa-2x"> </span>
  <span class="tip"></span>
  <ul id="account-menu">
  <li><a href="/signup.html">Sign up</a></li>
  <hr>
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
      'x-auth-token': token
    }
  });

  if (response.status !== 200) {
    account.innerHTML = accountHTML;
    return;
  }

  const body = await response.json();

  if (!body.isadmin) {
    account.innerHTML = `<div class='user'>
    <span id="user-icon" class="fas fa-user-circle fa-2x"> </span>
    <span class="tip"></span>
    <div id="account-menu">
    <li><a href="/profile.html">My Profile</a></li>
    <hr>
    <li id = "logout">Logout</li>
    </div>
    </div>`;
  } else {
    account.innerHTML = `<div class='user'>
    <span id="user-icon" class="fas fa-user-circle fa-2x"> </span>
    <span class="tip"></span>
    <div id="account-menu">
    <li><a href="/profile.html">My Profile</a></li>
    <hr>
    <li><a href="/admin.html">Manage Parcels</a></li>
    <hr>
    <li id = "logout">Logout</li>
    </div>
    </div>`;
  }
}
