chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            // This runs when page is done loading.

            // TODO Document why the interval is cleared.
            clearInterval(readyStateCheckInterval);
        }
    }, 10);

    var COMMENT_TITLE = 'Toggle comments ';

    /**
     * Add buttons for toggling comment visibility to each comment thread container.
     */
    function addButtonsIfNotExist() {
        [].slice.call(document.querySelectorAll('.comment-thread-container')).forEach(function(container) {
            if ($(container).has('button.ba-hide-comment-button').length == 0) {
                var resolveButton = container.innerText.toLowerCase().indexOf('resolved.') == -1 ? '<button class="ba-resolve-button">resolve</button>' : '';
                var $toggle = $('<div class="ba-container"><button class="ba-hide-comment-button"></button>' + resolveButton + '</div>');
                $(container).prepend($toggle);
            }
            // Do this no matter whether we're adding the button or not - always needs to be updated
            // because the number of comments could have changed.
            var commentsCount = $(container).find('.comment').length;
            $(container).find('button.ba-hide-comment-button').text(COMMENT_TITLE + '(' + commentsCount + ')');
        });
    }

    /**
     * Hide all comments that have the text `resolved.` in them.
     *  - ignores buttons that the user has clicked, indicated by `user-override`.
     *
     * Case insensitive.
     */
    function hideResolved() {
        [].slice.call(document.querySelectorAll('.comment-thread-container')).forEach(function(container) {
            if (container.innerText.toLowerCase().indexOf('resolved.') != -1 && !$(container).hasClass('user-override')) {
                $(container).addClass('ba-hidden');
            }
        });
    }

    /**
     * Handles clicks on the toggle buttons which are prepended to each comment thread container.
     */
    $(document).on('click', 'button.ba-hide-comment-button', function handleToggleButtonClick(e) {
        var threadContainer = $(e.target).closest('.comment-thread-container');
        var visible = !threadContainer.hasClass('ba-hidden');
        if (visible) {
            $(threadContainer).addClass('ba-hidden').addClass('user-override');
        } else {
            $(threadContainer).removeClass('ba-hidden').addClass('user-override');
        }
    });

    /**
     * Handles clicks on the resolve buttons which are prepended to each comment thread container.
     */
    $(document).on('click', 'button.ba-resolve-button', function(e) {
        var container = $(e.target).closest('.comment-thread-container');
        var replyButton = $(container).find('.reply-link.execute.click')[0];
        replyButton.click();
        container.find('#id_new_comment').text('Resolved. This thread was resolved by Bitbucket Awesomizer. [Download from the chrome webstore and make bitbucket awesome!](https://chrome.google.com/webstore/detail/bitbucket-awesomizer/fpcpncnhbbmlmhgicafejpabkdjenloi?authuser=1)');
        var submitButton = container.find('button[type="submit"].aui-button');
        submitButton.trigger('click');
        // $(e.target).remove();
    });

    // We don't yet have a way to be event-driven, so need to poll for changes.
    setInterval(function() {
        addButtonsIfNotExist();
        hideResolved();
    }, 2000);

    console.log('Bitbucket Awesomizer loaded')
});
