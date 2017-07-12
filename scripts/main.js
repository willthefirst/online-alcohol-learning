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

  function runDialogue(dialogue) {
    function stepForward() {
      // If not initial step, clear dialogue from both comp and user
      if (currLine > 0) {
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

    function insertNext() {
      // If there's a prompt, show it and the available answers
      if (dialogue[currLine].prompt) {
        $promptDialogue
        .append(
          '<div class="talk-bubble tri-right border round btm-left-in"><p>' +  dialogue[currLine].prompt + '</p></div>')
        .delay(delayTime)
        .children()
        .fadeIn().promise().done(function () {
          // Need promise so that callback only fires once https://stackoverflow.com/questions/8793246/jquery-animate-multiple-elements-but-only-fire-callback-once

          var colorSchemes = [
            'talk-bubble__color-1',
            'talk-bubble__color-2',
            'talk-bubble__color-3',
            'talk-bubble__color-4',
          ];

          // Populate reponse options
          dialogue[currLine].answers.forEach(function(answer) {
            $answersDialogue
            .append('<div class="dialogue-option talk-bubble tri-right border round btm-right-in ' + colorSchemes.splice(Math.random() * colorSchemes.length, 1) + '" data-next_label=' + answer.next + '><p>' + answer.m + '</p><div class="yoac-choose"> < </div></div>')
          })

          // Fade reponse options in
          $answersDialogue.delay(delayTime).children().fadeIn()
          // Prepare for next step of dialogue
          currLine++;
        })
      } else if (dialogue[currLine].moral) {
        // If it's the moral, we've reached the end
        $moralDialogue
        .html('<h3>' + dialogue[currLine].moral+ '</h3>')
        .delay(delayTime)
        .fadeIn(function() {
          allowNext();
        })
      }
    }

    // Hide the next button
    hideNext(0);

    var $promptDialogue = $('#alc-learn--dialogue__prompt');
    var $answersDialogue = $('#alc-learn--dialogue__answers');
    var $moralDialogue = $('#alc-learn--dialogue__moral');
    var delayTime = 400;
    var currLine = 0;

    // When user clicks on an answer, set currLine according to 'next' field, or just bump it otherwise
    $answersDialogue.on('click', '.dialogue-option', function() {
      var nextLabel = $(this).data().next_label;
      // Fade out dialogue that user has not selected
      $(this)
      .addClass('yoac__selected')
      .siblings()
      .not('.yoac__selected')
      .fadeOut({
        queue: false
      }).promise().done(function () {
        // Need promise so that callback only fires once https://stackoverflow.com/questions/8793246/jquery-animate-multiple-elements-but-only-fire-callback-once

        // Remove talk bubbles that were not selected from DOM
        $(this).remove()

        // If there's a specific response to the given answer, find it in dialogue array and update currLine to match
        if (nextLabel) {
          for (var line in dialogue) {
            if (dialogue[line].label === nextLabel) {
              currLine = line;
            }
          }
        } else {
          currLine++
        }
        console.log('abgm');
        stepForward(currLine);
      });

    })

    stepForward(currLine);
  }

  // Night out script
  if ($('.alc-learn--night-out').length) {
    var colors = [
      'blue',
      'blue-light',
      'yellow',
      'green',
      'rose',
      'peach',
      'purple',
      'white-blue',
      'tan',
      'neon'
    ];

    // Hide the next button
    hideNext(0);

    var nightOutItemsMin = 3;

    // Make the elements draggable
    var drake = dragula([document.querySelector('.alc-learn--night-out__word-cloud'), document.querySelector('.alc-learn--night-out__response')]);

    // On every drop, if bag has enough element, show next button.
    drake.on('drop', function(el, target, source, sibling) {
      if ($('.alc-learn--night-out__response').children().length >= nightOutItemsMin) {
        allowNext();
      }
    });

    // Shift position slightly and change color of each item
    $('.alc-learn--night-out__item').each(function(one, two) {
      var xChange = Math.random() * 20;
      var yChange = -(Math.random() * 20);

      $(this).css({
        '-webkit-transform': 'translate(' + xChange + 'px, ' + yChange + 'px)',
        'transform': 'translate(' + xChange + 'px, ' + yChange + 'px)',

      }).addClass('yoac-' + colors[Math.floor(Math.random()*colors.length)]);
    })
  }

  // Dialogue 1 Script
  if ($('#alc-learn--dialogue__slide-one').length) {
    runDialogue([
      {
        prompt: 'Hey I’m tired AF. Wanna head back to our suite?',
        answers: [
          {
            m: 'Yeah, totally. I’m pretty tired too.',
            next: 'tired_agree'
          },
          {
            m: 'The music just got good! But I heard Cory wanted to head out.  Let’s see if you two can walk home together.',
            next: 'tired_cory'

          },
          {
            m: 'Sure. Can we stop for food on the way?',
            next: 'tired_food'
          }
        ]
      },
      {
        label: 'tired_agree',
        moral: 'You don’t have be the ones to shut down the party!  If you’re ready to leave, do it.  You could head back to your suite to catch up on your favorite shows – or better yet, actually get some sleep.'
      },
      {
        label: 'tired_cory',
        moral: 'That’s great! At Yale we look out for each other. It’s fine if you don’t want to leave when your friend does, but make sure they have a way to get home safely.  Remember you can always call the Yale Nighttime Shuttle, which takes students door-to-door from 6pm to 6am.'
      },
      {
        label: 'tired_food',
        moral: 'That’s great! At Yale we look out for each other. And just because you’ve left a party, it doesn’t need to be the end of your night.  Get food (your froco may be serving late-night pancakes!), watch a movie, just hang.'
      }
    ])
  }

  // Dialogue 2 Script
  if ($('#alc-learn--dialogue__slide-two').length) {
    runDialogue(
      [
        {
          prompt: 'Hey we’re all doing shots. Take one!',
          answers: [
            {
              m: 'Oh, no thanks. I’m good.',
              next: 'shots_good'
            },
            {
              m: 'Nahh. I said I was going to stick to one beer tonight.',
              next: 'shots_beer'
            },
            {
              m: 'I’m actually heading out. Next time though?',
              next: 'shots_leaving'
            }
          ]
        },
        {
          label: 'shots_good',
          prompt: 'C’mon, we don’t want you to miss out!',
          answers: [
            {
              m: "I’m still gonna hang, but I actually don’t drink.",
              next: 'shots_moral'
            },
            {
              m: "Nah, I’m tryna hook up tonight.",
              next: 'shots_moral'
            },
            {
              m: "I’m heading out. Maybe next time.",
              next: 'shots_moral'
            },
            {
              m: "Nope, not tonight.",
              next: 'shots_moral'
            }
          ]
        },
        {
          label: 'shots_beer',
          prompt: 'C’mon, we don’t want you to miss out!',
          answers: [
            {
              m: "I would, but I’m feeling pretty good about this beer.",
              next: 'shots_moral'
            },
            {
              m: "I’m chillin’. I’ve got stuff to do tomorrow.",
              next: 'shots_moral'
            },
            {
              m: "Nah, I’m tryna hook up tonight.",
              next: 'shots_moral'
            },
            {
              m: "I’m heading out, maybe next time?",
              next: 'shots_moral'
            }
          ]
        },
        {
          label: 'shots_leaving',
          prompt: 'C’mon, we don’t want you to miss out!',
          answers: [
            {
              m: "Me either, but I’ll catch you this weekend.",
              next: 'shots_moral'
            },
            {
              m: "Nah, I’m tryna hook up tonight.",
              next: 'shots_moral'
            },
            {
              m: "Way too tired. See ya around.",
              next: 'shots_moral'
            }
          ]
        },
        {
          label: 'shots_moral',
          moral: 'People set limits on their drinking or choose not to drink for a variety of reasons. These reasons can change and evolve over time. Thinking about what you want to get out of your night can prepare you to make decisions in the moment.'
        }
      ]
    )
  }

  // Dialogue 3 Script
  if ($('#alc-learn--dialogue__slide-three').length) {
    runDialogue([
      {
        prompt: 'This week sucked. I’m going so hard tonight. Can’t wait to turn up.',
        answers: [
          {
            m: 'Wow. Sounds like you could actually use a low key night. Want to stay in instead?',
            next: 'hard_stay'
          },
          {
            m: 'I’m pumped for tonight too. Let’s get dinner and talk about your week before we go.',
            next: 'hard_dinner'

          },
          {
            m: 'I want you to let out some steam, for sure.  But you’ve been feeling this way a lot lately.  I’m kind of worried about you.',
            next: 'hard_steam'
          }
        ]
      },
      {
        label: 'hard_stay',
        moral: 'it’s worrying – you might not feel like you can address it directly, but proposing alternatives can help.  resources… '
      },
      {
        label: 'hard_dinner',
        moral: 'okay to party – but it sounds like your friend needs help in a way that alcohol can’t provide --  parties are often not the best places for support – make time beforehand to find out what’s going on with your friend -- '
      },
      {
        label: 'hard_steam',
        moral: 'sometimes it’s good to share your concern out loud – you might be validating your friend’s own worries, and help them take positive steps. resources are… '
      }
    ])
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

  if ($('#alc-learn--storyboard').length) {
    // Hide the next button
    hideNext(0);

    var storyboardMin = 4;

    // Make the elements draggable
    var drake = dragula([document.getElementById('alc-learn-storyboard__icon-container'), document.getElementById('alc-learn-storyboard__strip')]);

    // On every drop, if bag has enough element, show next button.
    drake.on('drop', function(el, target, source, sibling) {
      if ($('#alc-learn-storyboard__strip').children().length >= storyboardMin) {
        allowNext();
      }
    });
  }
});
