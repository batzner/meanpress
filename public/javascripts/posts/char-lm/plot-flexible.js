Chart.defaults.global.maintainAspectRatio = false;
Chart.defaults.global.elements.line.fill = false;
Chart.defaults.global.elements.line.tension = 0;
Chart.defaults.global.elements.point.radius = 0;

const runGroupValues = {
    batch_size: ['1', '10', '20', '50', '100', '200', '500', '2000'],
    learning_rate_512: ['0.001', '0.005', '0.01', '0.05'],
    learning_rate_decay: ['0.5', '0.8', '0.9', '0.97'],
    num_timesteps: ['40', '80', '120', '160'],
    num_neurons_1024_failed_starts: ['01-first-naive', '02-lr=0.005', '03-lr=0.001', '04-init_scale=0.005'],
    learning_rate_1024: ['0.01', '0.001', '0.005'],
    num_neurons: ['512', '1024'],
    output_keep_prob: ['0.3', '0.5', '0.8'],
    num_layers: ['2', '3', '4'],
    reset_state_interval_tokens: ['never', 'always', '320', '1120', '2080'],
    wiki: ['small', 'medium', 'medium-with-reset']
};

const BATCH_SIZE_EPOCH_MINUTES = {
    '1': 29.8,
    '10': 13.8,
    '20': 7.3,
    '50': 3.1,
    '100': 1.9,
    '200': 1.5,
    '500': 1.1,
    '2000': 0.87
};

const BATCH_SIZE_COLORS = {
    '1': '#FFCDD2',
    '10': '#E57373',
    '20': '#C8E6C9',
    '50': '#66BB6A',
    '100': '#2E7D32',
    '200': '#123317',
    '500': '#BBDEFB',
    '2000': '#2196F3'
};

const Y_AXIS_RANGE_SLIDER = $('#y-axis-range');

$(function (){
    // Initialize the range slider
    Y_AXIS_RANGE_SLIDER.ionRangeSlider({
        type: 'double',
        min: 0,
        max: 100,
        onFinish: plot
    });

    plot();
});
//getLogs('batch_size', [1, 10, 20, 50, 100, 200, 500, 2000]).then(plotLogs);
//getLogs('learning_rate_512', ['0.001', '0.005', '0.01', '0.05']).then(plotLogs);
//getLogs('learning_rate_decay', ['0.5', '0.8', '0.9', '0.97']).then(plotLogs);
//getLogs('num_timesteps', ['40', '80', '120', '160']).then(plotLogs);
//getLogs('num_neurons/1024/failed_starts', ['01-first-naive', '02-lr=0.005', '03-lr=0.001',
//    '04-init_scale=0.005']).then(plotLogs);
//getLogs('learning_rate_1024', ['0.01', '0.001', '0.005']).then(plotLogs);
//getLogs('num_neurons', ['512', '1024']).then(plotLogs);
//getLogs('output_keep_prob', ['0.3', '0.5', '0.8']).then(plotLogs);
//getLogs('num_layers', ['2', '3', '4']).then(plotLogs);
//getLogs('reset_state_interval_tokens', ['never', 'always', '320', '1120', '2080']).then(plotLogs);

function plot() {
    getLogs($('#run-group-select').val()).then(plotLogs);
}

function getLogs(runGroup) {
    const values = runGroupValues[runGroup];
    // Store the data locally so that we don't interfere with the global logs until all data are loaded.
    let data = {};
    return Promise.all(values.map(value => {
        // get the data and push the trainstates
        return $.getJSON(`assets/posts/char-lm/data/${runGroup}/${value}/model.trainstate.json`)
            .then(trainstate => {
                data[value] = PostUtil.getPreprocessedLog(trainstate.log);
            });
    })).then(() => {
        return data;
    });
}

function getEquidistantPoints(data, numPoints) {
    if (data.length <= numPoints) return data;

    // Get the range
    const {minX, maxX} = data.reduce((reduced, point) => {
        if (point.x < reduced.minX) reduced.minX = point.x;
        if (point.x > reduced.maxX) reduced.maxX = point.x;
        return reduced;
    }, {minX: data[0].x, maxX: data[0].x});

    // Sample the points
    let points = [];
    const stepSize = (maxX - minX) / (numPoints - 1);
    data.sort((a, b) => a.x - b.x).forEach(point => {
        if (point.x >= minX + points.length * stepSize - 10 ** -8) {
            points.push(point);
        }
    });
    return points;
}

function getData(log, xKey, yKey) {
    let dataMap = PostUtil.replaceClosestKeys(log[yKey], log[xKey]);
    let data = [];
    dataMap.forEach((value, key) => {
        data.push({x: key, y: value});
    });
    return data;
}

function updateSlider(yMin, yMax) {
    // Force some absolute limits on the slider values
    yMax = Math.min(30, yMax);

    const decimals = yMax - yMin > 2 ? 0 : 1;
    $('#y-axis-range').data('ionRangeSlider').update({
        min: yMin.toFixed(decimals),
        max: yMax.toFixed(decimals)
    })
}

function plotLogs(logs) {
    const xKey = $('#x-axis-select').val();
    const yKey = $('#y-axis-select').val();

    // Filter the data points with the y-axis range slider
    const yRangeSliderMin = Y_AXIS_RANGE_SLIDER.data('ionRangeSlider').result.from;
    const yRangeSliderMax = Y_AXIS_RANGE_SLIDER.data('ionRangeSlider').result.to;
    // Record the data's min and max to update the slider limits
    let yRange = {min: null, max: null};

    const runValues = Object.keys(logs);
    const datasets = runValues.map((value, index) => {
        let data = getData(logs[value], xKey, yKey);

        data = data.filter(point => {
            if (yRange.min == null || point.y < yRange.min) yRange.min = point.y;
            if (yRange.max == null || point.y > yRange.max) yRange.max = point.y;
            // Return the actual filter condition
            return yRangeSliderMin <= point.y && point.y <= yRangeSliderMax;
        });
        data = getEquidistantPoints(data, 30);

        return {
            label: value,
            data: data,
            borderColor: BATCH_SIZE_COLORS[value],
            backgroundColor: BATCH_SIZE_COLORS[value]
        };
    });

    updateSlider(yRange.min, yRange.max);

    PostUtil.clearChart('flexible-chart');
    new Chart('flexible-chart', {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }],
                yAxes: [{
                    type: 'logarithmic',
                    ticks: {
                        min: Math.max(yRange.min, yRangeSliderMin),
                        max: Math.min(yRange.max, yRangeSliderMax),
                        callback: value => value.toFixed(2)
                    }
                }]
            }
        }
    });
}