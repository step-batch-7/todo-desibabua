const attachEnter = function(id) {
  if (event.key === 'Enter') {
    document.querySelector(id).click();
  }
};

const attachEvents = function() {
  document.querySelector('#inputBox').onkeydown = attachEnter.bind(
    null,
    '.greyButton'
  );
};
