/* KEVOS context-menu deterrent. Does not prevent copying via developer tools or screenshots. */
(function () {
  'use strict';
  // Capture handles right-click, keyboard context-menu and supported pen/touch events.
  document.addEventListener('contextmenu', function (event) {
    if (event.cancelable) event.preventDefault();
  }, { capture: true });
})();
