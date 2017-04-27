$(document).ready(function() {
  var $nextButton = $('.module-sequence-footer-button--next');
  var nightOutItemsMin = 3;

  if ($('#alc-learn--night-out').length) {
    // Night out script

    // Hide the next button
    $nextButton.hide();

    // Make the elements draggable
    var drake = dragula([document.querySelector('#alc-learn--night-out__right'), document.querySelector('#alc-learn--night-out__left')]);

    // On every drop, if bag has enough element, show next button.
    drake.on('drop', function(el, target, source, sibling) {
      if ($('#alc-learn--night-out__left').children().length > nightOutItemsMin) {
        $nextButton.show();
      }
    });
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
