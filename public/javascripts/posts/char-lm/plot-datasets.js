$(() => plotDataset());

function plotDataset() {
    const datasetName = $('#dataset-dropdown').find('.dropdown-toggle').val();
    $.getJSON(`assets/posts/char-lm/data/${datasetName}/model.trainstate.json`)
        .then(trainstate => {
            plotDatasetLog(PostUtil.getPreprocessedLog(trainstate.log));
        })
        .catch(console.error);
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

function plotDatasetLog(log) {
    let lossesTrain = getData(log, 'epochs', 'lossesTrain')
        .filter(point => {
            // Ignore and filter outliers completely
            return !(point.y > 30 || point.y < 0.01);
        });
    let lossesValid = getData(log, 'epochs', 'lossesValid')
        .filter(point => {
            // Ignore and filter outliers completely
            return !(point.y > 30 || point.y < 0.01);
        });

    const datasets = [{
        label: 'Training',
        data: getEquidistantPoints(lossesTrain, 30),
        borderColor: PostUtil.CHART_COLORS_BLUE[1],
        backgroundColor: PostUtil.CHART_COLORS_BLUE[1]
    }, {
        label: 'Validation',
        data: getEquidistantPoints(lossesValid, 30),
        borderColor: PostUtil.CHART_COLORS_BLUE[4],
        backgroundColor: PostUtil.CHART_COLORS_BLUE[4]
    }];

    PostUtil.clearChart('dataset-chart');
    const chartParams = {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Epoch'
                    }
                }],
                yAxes: [{
                    type: 'logarithmic',
                    ticks: {
                        callback: value => value.toFixed(2)
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Perplexity'
                    }
                }]
            }
        }
    };
    new Chart('dataset-chart', chartParams);
}