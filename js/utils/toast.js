import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`

      style: {
        background: '#03a9f4',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  },

  success(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`

      style: {
        background: '#4caf50',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  },

  error(message) {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`

      style: {
        background: 'ef5350',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  },
}
