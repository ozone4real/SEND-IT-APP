const numEdit = document.getElementById('num-edit');
const numChange = document.getElementById('num-change');
const contactEdit = document.getElementById('contact-edit')

numChange.onclick = (e) => {
    const numForm = document.createElement('form');
    numForm.style.display= 'inline';
    numForm.innerHTML = `<input type="number" name = "contact" style="max-width: 150px; padding: 3px; display: inline;"> <input type= "submit" value ="submit" style="display:inline; padding: 3px; width: auto;">`;
    numForm.contact.value= numEdit.innerHTML;
    contactEdit.replaceWith(numForm);

    numForm.onsubmit= (e) => {
        e.preventDefault();
        const value = numForm.contact.value;
        numForm.replaceWith(contactEdit);
        numEdit.innerHTML = value;
    }
}