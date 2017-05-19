$(document).ready(function() {
  var $nextButton = $('.module-sequence-footer-button--next');
  var nightOutItemsMin = 3;

  function allowNext() {
    alert('Success!')
    $nextButton.show();
  }

  // Night out script
  if ($('.alc-learn--night-out').length) {
    // Hide the next button
    $nextButton.hide();

    // Make the elements draggable
    var drake = dragula([document.querySelector('.alc-learn--night-out__word-cloud'), document.querySelector('.alc-learn--night-out__response')]);

    // On every drop, if bag has enough element, show next button.
    drake.on('drop', function(el, target, source, sibling) {
      if ($('.alc-learn--night-out__response').children().length > nightOutItemsMin) {
        allowNext();
      }
    });
  }

  // Dialogue script
  if ($('#alc-learn--dialogue__slide-one').length) {
    // Hide the next button
    $nextButton.hide();

    var $compDialogue = $('#alc-learn--dialogue__comp');
    var $userDialogue = $('#alc-learn--dialogue__user');
    var delayTime = 500;

    var dialogue = {
      comp: {
        0: [
          'Hey, I’m tired AF. Wanna go head back to our suite?'
        ],
        1: [
          'That\'s great! At Yale we look out for each other. Make sure you and your friends have a plan for getting home safely.'
        ]
      },
      user: {
        0: [
          'Yeah, totally. I’m pretty tired to and I’ve got a PSET due tomorrow.',
          'The music just got good! But I can walk back with you if no one else is.',
          'Sure. Can we stop for food on the way?'
        ]
      }
    }

    // Whenever user selects a dialogue option, step the dialogue forward
    $userDialogue.on('click', '.dialogue-option', stepForward)

    function insertNext() {
      // Set computer prompt
      $compDialogue
      .html(dialogue.comp[currStep])
      .delay(delayTime)
      .fadeIn(function() {
        // Set user reponse options
        if (!dialogue.user[currStep]) {
          // If no options left, we've reached the end of the dialogue.
          allowNext();
        } else {
          // Populate reponse options
          dialogue.user[currStep].forEach(function(option) {
            $userDialogue
            .append("<button class='dialogue-option'>" + option + "</button>")
          })

          // Fade reponse options in
          $userDialogue.delay(delayTime).fadeIn()
      }

      // Prepare for next step of dialogue
      currStep++;
    })
  }

  function stepForward() {
    // If not initial step, clear dialogue from both comp and user
    if (currStep > 0) {
      $('.alc-learn--dialogue__both').fadeOut({
        queue: false
      }).empty().promise().done(function () {
        // Need promise so that callback only fires once https://stackoverflow.com/questions/8793246/jquery-animate-multiple-elements-but-only-fire-callback-once
        insertNext()
      });
    } else {
      insertNext()
    }
  }

  var currStep = 0;
  stepForward();
}
});
