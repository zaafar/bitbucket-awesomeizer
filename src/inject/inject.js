chrome.extension.sendMessage({}, function (response) {

    function init() {
        // Handles click events on "toggle" buttons.
        $(document).on('click', 'button.ba-hide-comment-button', e => {
            var $container = getClosestThreadContainer(e.target);

            // Mark the thread as "overridden".
            $container.addClass('user-override');

            updateUi($container);
        });

        // Process all comment threads every 2 seconds.
        setInterval(() => {
            $('.comment-thread-container').each((index, container) => {
                var $container = $(container);
                var hidden_comments_list = getLocalStorageItem();
                var current_comment_key = getLocalStorageKey($container);
                var is_hidden_comment = hidden_comments_list.indexOf(current_comment_key) > -1;

                if (is_hidden_comment && !$container.hasClass('user-override') && !$container.hasClass('ba-hidden')) {
                    // This also updates the buttons.
                    updateUi($container);
                } else {
                    // Only update the buttons.
                    updateButtons($container);
                }
            });
        }, 2000);
    }

    function getLocalStorageKey(container) {
        var comment_list = container.find('.comments-list');
        var comments = comment_list.find('.comment');
        var first_comment_id = comments[0].firstElementChild.id;
        var total_comments = comments.length;
        return first_comment_id + total_comments;
    }

    function getLocalStorageItem() {
        var hidden_comments_list = localStorage.getItem('hidden_comments_list');
        if (hidden_comments_list) {
            return JSON.parse(hidden_comments_list);
        }
        return [];
    }

    function addToLocalStorage(comment_id) {
        old_hidden_comments = getLocalStorageItem();
        if (old_hidden_comments.indexOf(comment_id) < 0) {
            // Making sure list never increase a specific size.
            if (old_hidden_comments.length >= 500)
                old_hidden_comments.shift();
            old_hidden_comments.push(comment_id);
        }

        new_hidden_comments = JSON.stringify(old_hidden_comments);
        localStorage.setItem('hidden_comments_list', new_hidden_comments);
    }

    function removeFromLocalStorage(comment_id) {
        var index = getLocalStorageItem().indexOf(comment_id);
        if (index >= 0) {
            var hidden_comments_list = getLocalStorageItem();
            hidden_comments_list.splice(index, 1);
            if (hidden_comments_list) {
                localStorage.setItem('hidden_comments_list', JSON.stringify(hidden_comments_list));
            } else {
                localStorage.setItem('hidden_comments_list', "[]");
            }
        }
    }

    function updateUi($container) {
        updateVisibility($container).then($container => updateButtons($container));
    }

    /**
     * Shows or hides a comment thread container.
     */
    function updateVisibility($container) {
        var classList = $container[0].classList;
        var comment_list = $container.find('.comments-list');
        var is_last_comment = $container[0].nextElementSibling == null;
        var current_comment_key = getLocalStorageKey($container);
        return new Promise(resolve => {
            // Always toggle the "hidden" class when the comments are slid-up.
            var toggleHiddenClass = () => {
                classList.toggle('ba-hidden');
                if ($container.hasClass('ba-hidden')) {
                    addToLocalStorage(current_comment_key);
                    if (is_last_comment)
                        $container[0].style.paddingTop = "30px";
                } else {
                    removeFromLocalStorage(current_comment_key);
                    if (is_last_comment)
                        $container[0].style.paddingTop = "";
                }
                resolve($container);
            };

            if (classList.contains('ba-hidden')) {
                // Show the comment list.
                toggleHiddenClass();
                comment_list.slideDown(100);
            }
            else {
                // Hide the comment list.
                comment_list.slideUp(100, toggleHiddenClass);
            }
        });
    }

    /**
     * Adds buttons for toggling comment visibility to each comment thread container.
     */
    function updateButtons($container) {
        if ($container.has('button.ba-hide-comment-button').length == 0) {
            //buttons not found, lets initialize Buttons
            var toggle = '<button class="ba-hide-comment-button">Toggle</button>';
            $container.prepend(`<div class="ba-container">${toggle}</div>`);
        }

        // Set or update the "Toggle" button's text.
        $container.find('button.ba-hide-comment-button').text(toggleButtonText($container));
    }

    function toggleButtonText($container) {
        var action = $container[0].classList.contains('ba-hidden') ? 'Show' : 'Hide';
        var count = $container.find('.comment').length;
        return `${action}(${count})`;
    }

    function getClosestThreadContainer(element) {
        return $(element).closest('.comment-thread-container');
    }

    init();
    console.log('Bitbucket Helper loaded');
});
