/**
 * Updates PR title <input> to correctly formatted Jira issue keys.
 *
 * TODO Watch the source-branch selector to update the title on change.
 */
chrome.extension.sendMessage({}, response => {
    function reformat(old) {
        // Assumes the mis-formatted Jira issue keys are of the form `Aa 100` or `Aaa 100`.
        let matches = old.match(/^([A-Z][a-z]{1,2}) (\d+)/i);

        // A match has 3 elements; the whole string and each of the two parenthesis.
        if (matches && matches.length === 3 && matches.index === 0) {
            let [match, project, id] = matches;
            project = project.toUpperCase();
            return matches.input.replace(match, `${project}-${id}`);
        }

        return false;
    }

    function process() {
        let inputElement = document.querySelector('input#id_title');
        let old = inputElement.value;
        let corrected = reformat(old);
        // console.log({old, corrected});
        if (corrected) {
            clearInterval(watcher);
            inputElement.value = corrected;
            console.log(`Bitbucket Helper fixed badly formatted Jira issue key.  It was "${old}"`);
        }
    }

    let watcher = setInterval(process, 100);
});
