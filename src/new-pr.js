chrome.extension.sendMessage({}, response => {
    function reformat(old) {
        // Assumes the mis-formatted Jira issue keys are of the form `Aa 100` or `Aaa 100`.
        let matches = old.match(/^([A-Z][a-z]{1,2}) (\d+)/i);
    
        // A match has 3 elements; the whole string and each of the two parenthesis.
        if (matches.length === 3 && matches.index === 0) {
            let [match, project, id] = matches;
            project = project.toUpperCase();
            return matches.input.replace(match, `${project}-${id}`);
        }
    }
    
    function process() {
        let inputElement = document.querySelector('input#id_title');
        let corrected = reformat(inputElement.value);
        if (corrected) {
            inputElement.value = corrected;
            console.log('Bitbucket Awesomizer fixed badly formatted Jira issue key');
        }
    }
    
    setTimeout(process, 0);
});
