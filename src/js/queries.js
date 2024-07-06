const btnSearchMobile = document.querySelector('.btn__mobile-search');
const btnSearchClose = document.querySelector('.btn__mobile-close');
const constainerEl = document.querySelector('.container');

btnSearchMobile?.addEventListener('click', () => {
  constainerEl.classList.add('sidebar');
});

btnSearchClose?.addEventListener('click', () => {
  constainerEl.classList.remove('sidebar');
});

document.addEventListener('click', e => {
  // Checks if the clicked element or its parent has the class 'preview'.
  // If so, removes the 'sidebar' class from the container element.
  if (e.target.closest('.preview')) constainerEl.classList.remove('sidebar');

  if (
    e.target.closest('.search') ||
    e.target.closest('.search-results') ||
    e.target.closest('.btn__mobile-search') ||
    e.target.closest('.btn--inline')
  )
    return;
  // If the clicked element does not match any of the specified classes above,
  // removes the 'sidebar' class from the container element.
  // This effectively closes the sidebar for clicks outside of the specified elements.

  constainerEl.classList.remove('sidebar');
});
