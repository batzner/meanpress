const ANIMATE_INTERVAL_MILLIS = 50;

const TEXT_INPUT = $('#text-input');
const TEXT_OUTPUT = $('#text-output');
const TEXT_BRIDGE = $('#text-input-output-bridge');

let pendingRequestId = null;
let result = null;

function onInput() {
    // Interpret an enter stroke at the end as a send click.
    let input = getCleanInput();
    if (input.indexOf('\n') >= 0) {
        // Remove the new lines
        TEXT_INPUT.html(input.replace('\n', ''));
        completeText();
    } else if (TEXT_OUTPUT.html().length) {
        // If we didn't start a new request and the TEXT_OUTPUT contains text, erase it.
        TEXT_BRIDGE.hide();
        // Shrink the text box height slowly
        TEXT_OUTPUT.slideToggle({
            start: () => TEXT_OUTPUT.html(''),
            always: () => TEXT_OUTPUT.show()
        });
    }
}

function getCleanInput() {
    let input = TEXT_INPUT.html();
    // Replace divs without a br tag with new lines
    input = input.replace(/<div>(?!<br)/g, '<div><br/>');
    // Replace new lines and
    input = input.replace(/<br ?\/?>/g, '\n');
    // Remove html tags (< will be escaped to &lt; anyways).
    input = input.replace(/<\/?\w*?\/?>/g, '');
    // Unescape html entities
    input = he.decode(input);
    return input;
}

function completeText() {
    $('#send-button').focus();
    let prime = $.trim(getCleanInput());

    const requestId = PostUtil.generateUUID();
    pendingRequestId = requestId;
    animateWaiting(requestId);

    console.log('Sending request', prime);
    $.get('http://ec2-35-167-199-162.us-west-2.compute.amazonaws.com/sample',
        {prime: prime, steps: 500, max_sentences: 50, dataset_name: 'sherlock'})
        .then(sampled => {
            if (pendingRequestId == requestId) {
                result = sampled;
                pendingRequestId = null;
            }
        });
}

function getNumToAdd(textLength) {
    return textLength < 300 ? 1 : 0;
}

function getRandomChange(text) {
    // Add some characters
    const numToAdd = getNumToAdd(text.length);
    let added = 0;
    while (added < numToAdd) {
        const prob = numToAdd - added;
        if (prob > 1 || Math.random() < prob) {
            // Add a character
            text += Math.random() < 0.167 ? ' ' : PostUtil.getRandomCharacter();
        }
        added += 1;
    }

    // Change some characters
    return text.split('').map(c => {
        if (c == ' ') return c;
        else if (Math.random() <= 0.2) {
            // Change every 10th character on average.
            return PostUtil.getRandomCharacter();
        }
        return c;
    }).join('');
}

function animateResult(result, deadline) {
    const missingMillis = deadline.getTime() - new Date().getTime();
    // Exit, if the deadline was reached
    if (missingMillis <= 0) {
        TEXT_OUTPUT.html(result);
        return;
    }

    let newOutput = TEXT_OUTPUT.html();
    // Calculate the number of steps missing to the deadline
    const steps = Math.ceil(missingMillis / ANIMATE_INTERVAL_MILLIS);
    const missingChars = result.length - newOutput.length;
    if (missingChars > 0) {
        // Add some random characters at the end
        const numToAdd = Math.ceil(missingChars / steps);
        newOutput += PostUtil.getRandomSentence(numToAdd);
    } else if (missingChars < 0) {
        // Remove some characters
        const toRemove = Math.ceil(-missingChars / steps);
        newOutput = newOutput.substr(0, newOutput.length - toRemove);
    }

    // Switch some characters to the correct version
    // Get the wrong characters
    const wrongIndices = [];
    Array.from(newOutput).forEach((char, index) => {
        if (index < result.length && char != result[index]) {
            wrongIndices.push(index);
        }
    });

    // Choose the characters to change
    const numToChange = Math.ceil(wrongIndices.length / steps);
    const changeIndices = _.sample(wrongIndices, numToChange);
    changeIndices.forEach(index => {
        // Replace the index
        newOutput = newOutput.substr(0, index) + result[index] + newOutput.substr(index + 1);
    });

    // Set the new output and schedule the next steps
    TEXT_OUTPUT.html(newOutput);
    setTimeout(() => animateResult(result, deadline), ANIMATE_INTERVAL_MILLIS);
}

function animateWaiting(requestId) {
    TEXT_OUTPUT.show();
    TEXT_BRIDGE.show();
    TEXT_OUTPUT.html('a');
    setTimeout(() => refreshAnimateWaiting(requestId), ANIMATE_INTERVAL_MILLIS);
}

function refreshAnimateWaiting(requestId) {
    if (pendingRequestId == requestId) {
        // Animate the text
        TEXT_OUTPUT.html(getRandomChange(TEXT_OUTPUT.html()));

        setTimeout(() => refreshAnimateWaiting(requestId), ANIMATE_INTERVAL_MILLIS);
    } else if (pendingRequestId == null) {
        // Display the result with an animation lasting one second
        const deadline = new Date(new Date().getTime() + 1000);
        animateResult(result, deadline);
    }
}