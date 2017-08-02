jQuery(function($) {
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
    // alert('Success!')
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
        .html('<p>' + dialogue[currLine].moral+ '</p>')
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
      'green',
      'rose',
      'teal-dark',
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
        // Specific for Night Out #2
        if ($('#alc-learn--night-out__slide-two').length > 0) {
          $('.alc-learn--night-out__word-cloud').fadeOut(function() {
            $('.alc-learn--night-out__success').fadeIn()
          });
        }

        // General
        allowNext();
      }
    });

    // Shift position slightly and change color of each item
    $('.alc-learn--night-out__item').each(function(one, two) {
      var xChange = Math.random() * 12;
      var yChange = -(Math.random() * 12);

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
        moral: 'You don’t have to shut down the party!  If you’re ready to leave, do it.  You could head back to your suite to catch up on your favorite shows – or better yet, actually get some sleep.'
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
              m: "I’m still gonna hang, but I don’t drink.",
              next: 'shots_moral_easy'
            },
            {
              m: "Nah, I’m tryna hook up tonight.",
              next: 'shots_moral_sober'
            },
            {
              m: "I’m heading out. Maybe next time.",
              next: 'shots_moral_call'
            },
            {
              m: "Nope, not tonight.",
              next: 'shots_moral_easy_alt'
            }
          ]
        },
        {
          label: 'shots_beer',
          prompt: 'C’mon, we don’t want you to miss out!',
          answers: [
            {
              m: "I would, but I’m feeling pretty good about this beer.",
              next: 'shots_moral_shots'
            },
            {
              m: "I’m chillin’. I’ve got stuff to do tomorrow.",
              next: 'shots_moral_plans'
            },
            {
              m: "Nah, I’m tryna hook up tonight.",
              next: 'shots_moral'
            },
            {
              m: "I’m heading out, maybe next time?",
              next: 'shots_moral_call'
            }
          ]
        },
        {
          label: 'shots_leaving',
          prompt: 'C’mon, we don’t want you to miss out!',
          answers: [
            {
              m: "Me either, but I’ll catch you this weekend.",
              next: 'shots_moral_call'
            },
            {
              m: "Nah, I’m tryna hook up tonight.",
              next: 'shots_moral_mindful'
            },
            {
              m: "Way too tired. See ya around.",
              next: 'shots_moral_call'
            }
          ]
        },
        {
          label: 'shots_moral_easy',
          moral: 'Great answer! It might not be easy to tell, but there are lots of students who choose not to drink on campus and still have active social lives. Setting those boundaries doesn’t mean that you can’t still hang out with friends who are drinking and have a good time!'
        },
        {
          label: 'shots_moral_sober',
          moral: "Good thinking! Sober (or relatively sober) hookups allow you to be more attentive to your partner's desires. That’s more fun for everyone!"
        },
        {
          label: 'shots_moral_call',
          moral: "Good call! You shouldn’t have to leave a gathering because of pressure from others, but if you feel uncomfortable, that’s always an option. Better to find someplace where your decisions are respected!"
        },
        {
          label: 'shots_moral_easy_alt',
          moral: "That’s great! It might not be easy to tell, but there are lots of students who choose not to drink, either on some nights or always, and who still have active social lives. Setting those boundaries doesn’t mean that you can’t still hang out with friends who are drinking and have a good time!"
        },
        {
          label: 'shots_moral_shots',
          moral: "That’s great! It might not be easy to tell, but there are lots of students who choose not to drink, either on some nights or always, and who still have active social lives. Setting those boundaries doesn’t mean that you can’t still hang out with friends who are drinking and have a good time!"
        },
        {
          label: 'shots_moral_plans',
          moral: "Great response – whether or not you actually have big plans for tomorrow. If you do, it’s smart to slow down on drinking, since heavy drinking can affect sleep quality and a hangover is generally bad news for next day tasks. And even if you don’t have plans, saying so can be a good way to deflect pressure."
        },
        {
          label: 'shots_moral_mindful',
          moral: "Good thinking! If you drink, you should extra mindful of your actions and interactions with others. Plus, heavy drinking will seriously detract from a hookup. Staying sober means it’s easy to be more attentive to your partner's desires–and that’s more fun for everyone!"
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
            m: 'Wow. Sounds like you had a rough week. Any chance you wanna do a low key night with me instead? Maybe stay in and watch a movie?',
            next: 'hard_stay'
          },
          {
            m: 'I’m pumped for tonight too. Sorry to hear about your week! Wanna grab dinner and talk about it before?',
            next: 'hard_dinner'

          },
          {
            m: 'I want you to let out some steam, for sure.  But I feel like I’ve heard this from a you a lot lately. I’m kind of worried about you.',
            next: 'hard_steam'
          }
        ]
      },
      {
        label: 'hard_stay',
        moral: 'Great answer! It can be worrying to hear a friend use alcohol as a coping mechanism. Sometimes it feels hard to address it directly, but proposing alternatives can help. If you continue to be concerned, Yale has many resources, including your residential college Dean and FroCo, to help students who are stressed for any reason.'
      },
      {
        label: 'hard_dinner',
        moral: 'Good thinking! Parties can be fun, but often aren’t the best places for the kind of support it sounds like your friend is looking for. Making time with them beforehand to find out what’s going on can be a good way to check in and provide help they need.  If you feel that they need more, Yale has many resources, including your residential college Dean and FroCo, to help students who are stressed for any reason.'
      },
      {
        label: 'hard_steam',
        moral: 'Good thinking! Sometimes it’s good to share your concern out loud – you might be validating your friend’s own worries, and help them take positive steps. Those might include reaching out to some of Yale’s many resources, including your residential college Dean and FroCo, who are there to help students who are stressed for any reason.'
      }
    ])
  }

  // Reorder script
  if ($('#alc-learn--reorder').length) {
    // Hide the next button
    hideNext(0);

    $successMessage = $('#alc-learn--reorder__success');

    // Make the elements draggable
    var drake = dragula([document.getElementById('alc-learn--reorder__list')]);

    // On every drop, check for correct order, if good, allowNext
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

  if ($('.alc-learn--storyboard').length) {
    // Hide the next button
    hideNext(0);

    var storyboardMin = 4;

    // Make the elements draggable
    var drake = dragula([document.getElementById('alc-learn-storyboard__icon-container'), document.getElementById('alc-learn-storyboard__strip')]);

    // On every drop, if bag has enough element, show next button.
    drake.on('drop', function(el, target, source, sibling) {
      $('.alc-learn-storyboard__strip-instructions').fadeOut();

      if ($('#alc-learn-storyboard__strip').children().length >= storyboardMin) {
        allowNext();
      }
    });
  }
});
