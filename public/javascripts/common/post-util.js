class PostUtil {
    static generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    static getRandomCharacter() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    static getRandomSentence(length) {
        let text = "";
        for (let i = 0; i < length; i++) {
            text += PostUtil.getRandomCharacter();
            // Append a space every 6 characters on average
            if (Math.random() < 0.1667) {
                text += ' ';
            }
        }
        return text;
    }

    static objectValues(obj) {
        return Object.keys(obj).map(key => obj[key]);
    }

    static replaceClosestKeys(map, dictionary) {
        // Creates a new Map with the values of dictionary as keys. Keys of obj and dictionary
        // must be integers.
        let result = new Map();
        let keys = Array.from(dictionary.keys());
        map.forEach((value, key) => {
            let closestKey = Math.min(...keys.filter(k => k >= key));
            result.set(dictionary.get(closestKey), value);
        });
        return result;
    }

    static getPreprocessedLog(log) {
        // Preprocess the log of a trainstate
        let result = {};

        // Convert the step keys to maps with integer keys
        Object.keys(log).forEach(seriesKey => {
            result[seriesKey] = PostUtil.parseSeriesToIntMap(log[seriesKey]);
        });

        // Exponentiate the losses to perplexities
        ['lossesTrain', 'lossesValid'].forEach(seriesKey => {
            let series = result[seriesKey];
            for (let entryKey of series.keys()) {
                series.set(entryKey, Math.pow(2, series.get(entryKey)));
            }
        });

        // Split up the epochs into floating point epochs
        const epochRanges = {};
        result.epochs.forEach((epoch, step) => {
            if (!epochRanges[epoch]) {
                epochRanges[epoch] = {min: step, max: step};
            } else if (step < epochRanges[epoch].min) {
                epochRanges[epoch].min = step;
            } else if (step > epochRanges[epoch].max) {
                epochRanges[epoch].max = step;
            }
        });
        result.epochs.forEach((epoch, step) => {
            let min = epochRanges[epoch].min;
            let max = epochRanges[epoch].max;
            let progress = max != min ? (step - min) / (max - min) : 0;
            result.epochs.set(step, epoch + progress);
        });


        // Create a new series secondsSinceStart out of the intervalSeconds
        result.secondsSinceStart = new Map();
        let currentSeconds = 0;
        Array.from(result.intervalSeconds.keys())
            .sort((a, b) => a - b)
            .forEach(step => {
                currentSeconds += result.intervalSeconds.get(step);
                result.secondsSinceStart.set(step, currentSeconds);
            });
        return result;
    }

    static getYRange(datasets) {
        let range = {min: null, max: null};
        datasets.forEach(dataset => {
            dataset.data.forEach(point => {
                range.min = range.min != null ? Math.min(range.min, point.y) : point.y;
                range.max = range.max != null ? Math.max(range.max, point.y) : point.y;
            });
        });
        return range;
    }

    static parseSeriesToIntMap(series) {
        let parsed = new Map();
        Object.keys(series).forEach(key => {
            parsed.set(parseInt(key), series[key]);
        });
        return parsed;
    }
}