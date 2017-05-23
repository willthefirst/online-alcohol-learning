$(document).ready(function() {
  var $nextButton = {};
  var checksMax = 5;

  // Because of a race condition with Canvas, check for the next button about 5 times to hide it.
  function hideNext(checkCurr) {
    console.log('Checked for the next button ' + checkCurr + ' times.');
    $nextButton = $('.module-sequence-footer-button--next');
    $nextButton.hide();

    if ($nextButton.length < 1 && checkCurr < checksMax) {
      setTimeout(function () {
        hideNext(checkCurr + 1);
      }, 100);
    }
  }

  function allowNext() {
    alert('Success!')
    $nextButton.show();
  }

  // General dialogue sequence
  function runDialogue(dialogue) {
    // Hide the next button
    hideNext(0);

    var $compDialogue = $('#alc-learn--dialogue__comp');
    var $userDialogue = $('#alc-learn--dialogue__user');
    var delayTime = 100;

    // Whenever user selects a dialogue option, step the dialogue forward
    $userDialogue.on('click', '.dialogue-option', function() {
      var option = $(this).data().option;
      stepForward(option)
    })

    function insertNext(prevChoice) {
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
          // If next step has conditional dialogue, manipulate the dialogue array
          if (Array.isArray(dialogue.user[currStep][0])) {
            // set currStep to the appropriate array within currStep
            console.log(dialogue.user);
            dialogue.user[currStep] = dialogue.user[currStep][prevChoice]
          }

          // Populate reponse options
          dialogue.user[currStep].forEach(function(option, key) {
            $userDialogue
            .append("<button class='dialogue-option' data-option=" + key + ">" + option + "</button>")
          })

          // Fade reponse options in
          $userDialogue.delay(delayTime).fadeIn()
        }

        // Prepare for next step of dialogue
        currStep++;
      })
    }

    function stepForward(option) {
      // If not initial step, clear dialogue from both comp and user
      if (currStep > 0) {
        $('.alc-learn--dialogue__both').fadeOut({
          queue: false
        }).empty().promise().done(function () {
          // Need promise so that callback only fires once https://stackoverflow.com/questions/8793246/jquery-animate-multiple-elements-but-only-fire-callback-once
          insertNext(option)
        });
      } else {
        insertNext(option)
      }
    }

    var currStep = 0;
    stepForward();
  }

  // Night out script
  if ($('.alc-learn--night-out').length) {
    // Hide the next button
    hideNext(0);

    var nightOutItemsMin = 3;

    // Make the elements draggable
    var drake = dragula([document.querySelector('.alc-learn--night-out__word-cloud'), document.querySelector('.alc-learn--night-out__response')]);

    // On every drop, if bag has enough element, show next button.
    drake.on('drop', function(el, target, source, sibling) {
      if ($('.alc-learn--night-out__response').children().length > nightOutItemsMin) {
        allowNext();
      }
    });
  }

  // Dialogue 1 Script
  if ($('#alc-learn--dialogue__slide-one').length) {
    runDialogue({
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
    })
  }

  // Dialogue 2 Script
  if ($('#alc-learn--dialogue__slide-two').length) {
    runDialogue({
      comp: {
        0: [
          'Hey we’re all doing shots. Take one!'
        ],
        1: [
          'C’mon, we don’t want you to miss out!'
        ],
        2: [
          'People set limits on their drinking or choose not to drink for a variety of reasons. These reasons can change and evolve over time. Thinking about what you want to get out of your night can prepare you to make decisions in the moment.'
        ]
      },
      user: {
        0: [
          'Oh, no thanks. I’m good.',
          'Nahh. I said I was going to stick to one beer tonight.',
          'I’m actually heading out. Next time though?'
        ],
        1: [
          [
            "I’m still gonna hang, but I actually don’t drink.",
            "Nah, I’m tryna hook up tonight.",
            "I’m heading out. Maybe next time.",
            "Nope, not tonight."
          ],
          [
            "I would, but I’m feeling pretty good about this beer.",
            "I’m chillin’. I’ve got stuff to do tomorrow.",
            "Nah, I’m tryna hook up tonight.",
            "I’m heading out. Maybe next time."
          ],
          [
            "Me either, but I’ll catch you this weekend.",
            "Nah, I’m tryna hook up tonight.",
            "Way too tired. See ya around."
          ]
        ]
      }
    })
  }


  // Dialogue 3 Script
  if ($('#alc-learn--dialogue__slide-three').length) {
    runDialogue({
      comp: {
        0: [
          'This week sucked. I’m going so hard tonight. Can’t wait to turn up.'
        ],
        1: [
          'Alcohol isn’t a great coping mechanism. Yale has many resources, including your residential college Dean and FroCo, to help students who are stressed for any reason.'
        ]
      },
      user: {
        0: [
          'Wow. Sounds like you could use a low key night. Want to stay in instead?',
          'I’m pumped for tonight too. But, let’s get dinner and talk about your week before we go.',
          'I want you to let out some steam, but are you sure getting trashed will make you feel better?'
        ]
      }
    })
  }

  // Reorder script
  if ($('#alc-learn--reorder').length) {
    // Hide the next button
    hideNext(0);

    $successMessage = $('#alc-learn--reorder__success');

    // Make the elements draggable
    var drake = dragula([document.getElementById('alc-learn--reorder__list'), document.getElementById('alc-learn--reorder__list')]);

    // On every drop, if bag has enough element, show next button.
    drake.on('drop', function(el, target, source, sibling) {
      var listItems = $('#alc-learn--reorder__list').children();
      var currOrder = [];

      for (var i = 0; i < listItems.length; i++) {
        currOrder.push($(listItems[i]).data().order);
      }

      if (currOrder.toString() === currOrder.slice(0).sort().toString()) {
        $successMessage.fadeIn(allowNext)
      }
    });
  }
});
