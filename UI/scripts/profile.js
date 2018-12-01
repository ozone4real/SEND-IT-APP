const numEdit = document.getElementById('num-edit');
const numChange = document.getElementById('num-change');
const contactEdit = document.getElementById('contact-edit');
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
    if (highlighted.id === elem.id) elem.style.display = "";
  }
}

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
