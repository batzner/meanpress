console.log('executing plot.js');
Chart.defaults.global.elements.line.fill = false;
Chart.defaults.global.elements.line.tension = 0;
Chart.defaults.global.elements.point.radius = 0;

const colors = ['#fe819d', '#36a2eb', '#ffce56', '#42C3CB', '#D081FE', '#FF0000', '#00FF00'];

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

plot();
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
        return $.getJSON(`data/${runGroup}/${value}/model.trainstate.json`).then(trainstate => {
            data[value] = Util.getPreprocessedLog(trainstate.log);
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
    let dataMap = Util.replaceClosestKeys(log[yKey], log[xKey]);
    let data = [];
    dataMap.forEach((value, key) => {
        data.push({x: key, y: value});
    });
    return data;
}

function plotLogs(logs) {
    const xKey = $('#x-axis-select').val();
    const yKey = $('#y-axis-select').val();

    const runValues = Object.keys(logs);
    const datasets = runValues.map((value, index) => {
        let data = getData(logs[value], xKey, yKey);
        data = data.filter(point => point.y < 25);
        data = getEquidistantPoints(data, 30);

        return {
            label: value,
            data: data,
            borderColor: colors[index],
            backgroundColor: colors[index]
        };
    });
    const yRange = Util.getYRange(datasets);

    new Chart('chart', {
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
                        min: yRange.min,
                        max: yRange.max,
                        callback: value => value.toFixed(2)
                    }
                }]
            }
        }
    });
}