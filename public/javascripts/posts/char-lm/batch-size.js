console.log('executing batch-size.js');
printEpochTimes('batch_size', [1, 10, 20, 50, 100, 200, 500, 2000]);

function printEpochTimes(parameter, values) {
    values.map(value => {
        // get the data and push the trainstates
        return $.getJSON(`data/${parameter}/${value}/model.trainstate.json`).then(trainstate => {
            let log = Util.getPreprocessedLog(trainstate.log);

            let maxEpoch = Math.max(...log.epochs.values());
            if (maxEpoch == 1) maxEpoch = 2;

            let allowedSteps = Array.from(log.epochs.keys())
                .filter(step => log.epochs.get(step) < maxEpoch);
            let maxStep = Math.max(...allowedSteps);

            // Filter the steps to exclude the last (possibly incomplete) epoch
            let secondsSteps = Array.from(log.secondsSinceStart.keys())
                .filter(step => step <= maxStep);
            let totalSeconds = log.secondsSinceStart.get(Math.max(...secondsSteps));

            console.log(value, totalSeconds / ((maxEpoch - 1) * 60) + ' minutes');
        });
    });
}