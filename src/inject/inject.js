chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      // This runs when page is done loading.

      // TODO Document whe the interval is cleared.
      clearInterval(readyStateCheckInterval);
    }
  }, 10);

  function addButtonsIfNotExist() {
    Array.prototype.slice.call(document.querySelectorAll('.comment-thread-container')).forEach(function(container) {
      if ($(container).has('button.ba-hide-comment-button').length == 0) {
        var $toggle = $('<button class="ba-hide-comment-button">Toggle comment</button>');
        $(container).prepend($toggle);
      }
    });
  }

  $(document).on('click', 'button', function(e) {
    var threadContainer = $(e.target).parent();
    var visible = !threadContainer.hasClass('ba-hidden');
    if (visible) {
      $(threadContainer).addClass('ba-hidden');
    } else {
      $(threadContainer).removeClass('ba-hidden');
    }
  });

  setInterval(addButtonsIfNotExist, 2000);

  console.log('Bitbucket Awesomizer loaded');
});
