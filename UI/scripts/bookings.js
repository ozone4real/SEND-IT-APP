const lagos = ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'];
const lg1 = document.getElementById('lg1');
const lg2 = document.getElementById('lg2');
lagos.forEach(item => {
    lg1.insertAdjacentHTML('beforeend', `<option value =${item.toLocaleLowerCase()}>${item}</option>`)
    lg2.insertAdjacentHTML('beforeend', `<option value =${item.toLocaleLowerCase()}>${item}</option>`)
})
