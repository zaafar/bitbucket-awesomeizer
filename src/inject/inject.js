chrome.extension.sendMessage({}, function (response) {
    // TODO Refactor as a jQuery plugin, and apply it to each comment thread container element, such that `this` is the container element.  This is probably simpler code, but may be less performant (with polling)?

    var link = 'https://github.com/zaafar/bitbucket-awesomeizer';
    var commentMarkdown = `[\[==resolved==\]](${link})`;

    function init() {
        // Handles click events on "toggle" buttons.
        // TODO As a jQuery plugin, this attaches to the button when it is created.
        $(document).on('click', 'button.ba-hide-comment-button', e => {
            var $container = getClosestThreadContainer(e.target);

            // Mark the thread as "overridden".
            $container.addClass('user-override');

            updateUi($container);
        });

        // Handles click events on "resolve" buttons.
        // TODO As a jQuery plugin, this attaches to the button when it is created.
        $(document).on('click', 'button.ba-resolve-button', e => {
            var $container = getClosestThreadContainer(e.target);
            $container.find('.reply-link.execute.click')[0].click();
            var isoldEditor = $container.find('#id_new_comment').length >= 1;
            if (isoldEditor) {
                $container.find('#id_new_comment').text(commentMarkdown);
                $container.find('button[type="submit"].aui-button').click();
                $container.find('button.ba-resolve-button').remove();
                updateUi($container);
                return;
            }
            if ($container.find('div.ProseMirror').length == 0) {
                setTimeout(() => {
                    $container.find('div.ProseMirror')[0].innerText = commentMarkdown;
                    setTimeout(() => {
                        $container.find('.dwVXlo')[0].childNodes[0].click();
                    }, 50);
                }, 50);
            }
        });

        // Process all comment threads every 2 seconds.
        // TODO Find a way to listen to Bitbucket's events.
        // TODO As a jQuery plugin, each instance of the plugin is responsible for polling its own thread.  This global poller only instantiates new threads.
        // TODO Now that we have a "Resolved" button, does it make sense to automatically close threads that have received a "Resolved." comment manually?
        setInterval(() => {
            $('.comment-thread-container').each((index, container) => {
                var $container = $(container);
                var resolved = $container.text().toLowerCase().indexOf('[==resolved==]') >= 0;

                if (resolved && !$container.hasClass('user-override') && !$container.hasClass('ba-hidden')) {
                    // Hide all comments with the text `resolved.`, but not overridden.
                    // This also updates the buttons.
                    updateUi($container, resolved);
                }
                else {
                    // Only update the buttons.
                    updateButtons($container, resolved);
                }
            });
        }, 2000);
    }

    function updateUi($container, resolved = null) {
        updateVisibility($container).then($container => updateButtons($container, resolved));
    }

    /**
     * Shows or hides a comment thread container.
     */
    function updateVisibility($container) {
        var classList = $container[0].classList;
        var $comments = $container.find('.comments-list');
        return new Promise(resolve => {
            // Always toggle the "hidden" class when the comments are slid-up.
            var toggleHiddenClass = () => {
                classList.toggle('ba-hidden');
                resolve($container);
            };

            if (classList.contains('ba-hidden')) {
                // Show the comments.
                toggleHiddenClass();
                $comments.slideDown(100);
            }
            else {
                // Hide the comments.
                $comments.slideUp(100, toggleHiddenClass);
            }
        });
    }

    /**
     * Adds buttons for toggling comment visibility to each comment thread container.
     */
    function updateButtons($container, resolved = null) {
        if ($container.has('button.ba-hide-comment-button').length == 0) {
            initializeButtons($container, resolved);
        }

        // Set or update the "Toggle" button's text.
        $container.find('button.ba-hide-comment-button').text(toggleButtonText($container));
    }

    function toggleButtonText($container) {
        var action = $container[0].classList.contains('ba-hidden') ? 'Show' : 'Hide';
        var count = $container.find('.comment').length;
        var noun = count > 1 ? 'comments' : 'comment';
        return `${action}(${count})`;
    }

    function initializeButtons($container, resolved) {
        // The "toggle" button's label is set in updateButtons.
        var toggle = '<button class="ba-hide-comment-button">Toggle</button>';
        var resolve = resolved ? '' : '<button class="ba-resolve-button">Resolve</button>';
        $container.prepend(`<div class="ba-container">${toggle} ${resolve}</div>`);
    }

    function getClosestThreadContainer(element) {
        return $(element).closest('.comment-thread-container');
    }

    init();
    console.log('Bitbucket Helper loaded');
});
