$(document).ready(function() {
  if ($('#alc-learn--night-out').length) {
    // Night out script
    dragula([document.querySelector('#left'), document.querySelector('#right')]);

  }

  if ($('#alc-learn--dialogue').length) {
    // Dialogue script
    var dialogue = {
      comp: {
        d1: 'Want to have sex?'

      },
      user: {
        d2: [{

        }]
      }
    }
  }
});
