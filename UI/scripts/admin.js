let dropDown;
document.addEventListener('click', (e) => { 
    if(e.target.id !== "ellipsis") return;
    displayDropDown(e.target);
});


function displayDropDown(node) {
    if(dropDown) dropDown.classList.remove('toggle-dropdown');
    dropDown = node;
    dropDown.classList.add('toggle-dropdown')
}

