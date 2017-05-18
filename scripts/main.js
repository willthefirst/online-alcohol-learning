$(document).ready(function() {
  var $nextButton = $('.module-sequence-footer-button--next');
  var nightOutItemsMin = 3;

  // Night out script
  if ($('.alc-learn--night-out').length) {
    // Hide the next button
    $nextButton.hide();

    // Make the elements draggable
    var drake = dragula([document.querySelector('.alc-learn--night-out__word-cloud'), document.querySelector('.alc-learn--night-out__response')]);

    // On every drop, if bag has enough element, show next button.
    drake.on('drop', function(el, target, source, sibling) {
      if ($('.alc-learn--night-out__response').children().length > nightOutItemsMin) {
        alert('Success!')
        $nextButton.show();
      }
    });
  }

  // Dialogue script
  if ($('#alc-learn--dialogue').length) {
    // Hide the next button
    $nextButton.hide();
    var $compDialogue = $('#alc-learn--dialogue__comp');
    var $userDialogue = $('#alc-learn--dialogue__user');

    // var dialogue = [
    //   {
    //     m: 'Comp: question 1'
    //     answers: [
    //       {
    //         m: 'Yes'
    //         next: 'Yes > Question 2'
    //       }, {
    //         m: 'No',
    //         next: 'No > Question 2'
    //       }, {
    //         m: 'Maybe',
    //         next: 'Yes > Question 2'
    //       }
    //     ]
    //   }
    // ]


    $compDialogue.html('Comp 1');
  }


});
