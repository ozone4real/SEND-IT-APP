
const navCont = document.getElementById('nav-contents');
const navBar = document.getElementById('nav-bar');

document.addEventListener('click', (e) => {
    
    if(e.target.closest('#nav-bar')) {
       return navCont.classList.toggle('responsive-nav');
    } 
    if(!event.target.closest('#nav-contents')) navCont.classList.remove('responsive-nav');
});


const carousel = document.getElementById('container1');
setInterval(() => {
    carousel.classList.toggle('sliding');
}, 6000);
