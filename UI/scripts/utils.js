const isEmpty = (collection) => {
  const elems = Array.from(collection);
  elems.forEach((item) => {
    if (item.tagName !== 'INPUT' && item.tagName !== 'SELECT') return;
    if (!item.value) {
      item.style.cssText = 'background-color: lightyellow; border-color: red;';
      item.previousElementSibling.innerHTML = 'This must not be empty';
      return true;
    }
    return false;
  });
};
