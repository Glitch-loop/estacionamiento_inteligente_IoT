// let dataChar = null;

// function renderChart(data, labels) {
//     if (dataChar != null) {
//         dataChar.destroy();
//     }
//     const ctx = document.getElementById('tipoExpiracion').getContext('2d');
//     dataChar = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Electrocardiograma',
//                 data: data,
//                 backgroundColor: 'transparent',
//                 fill: false,
//                 lineTension: 0,
//                 pointRadius: 1,
//                 pointHoverRadius: 10,
//                 pointHitRadius: 30,
//                 pointBorderWidth: 1,
//                 borderColor: 'rgba(230, 45, 87, 0.7)',
//                 borderWidth: 2
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//         }
//     })
// }

// function getChartDat() {
//     console.log('5 - obtenemos chart')
//     $.ajax({
//         url: 'http://localhost:3000/src/routes/obtenerData',
//         success: function (result) {
//             var labels = result.label;
//             var data = result.info;

//             renderChart(data, labels);
//         },

//         error: function (err) {
//             console.log(err);
//         }
//     });
// }

// $('#renderBtn').click(
//     function () {
//         getChartDat();
//     }
// );

let dataChar = null;

function renderChart(data, labels) {
    if (dataChar != null) {
        dataChar.destroy();
    }

    const ctx = document.getElementById('tipoExpiracion').getContext('2d');
    dataChar = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Uno', 'dos', 'tres'],
            datasets: [{
                label: 'Grafico 1',
                data: [12, 34, 23],
                backgroundColor: 'transparent',
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 10,
                pointHitRadius: 30,
                pointBorderWidth: 1,
                borderColor: 'rgba(230, 45, 87, 0.7)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    })

    const ctx2 = document.getElementById('lugaresMasReservados').getContext('2d');
    dataChar = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Uno', 'dos', 'tres'],
            datasets: [{
                label: 'Grafico 1',
                data: [12, 34, 23],
                backgroundColor: 'transparent',
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 10,
                pointHitRadius: 30,
                pointBorderWidth: 1,
                borderColor: 'rgba(230, 45, 87, 0.7)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    })
    const ctx3 = document.getElementById('historialLugares').getContext('2d');
    dataChar = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6],
            datasets: [{
                label: 'Grafico 1',
                data: [12, 34, 23, 34, 54, 76],
                backgroundColor: 'transparent',
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHoverRadius: 10,
                pointHitRadius: 30,
                pointBorderWidth: 1,
                borderColor: 'rgba(230, 45, 87, 0.7)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    })
}

function getChartDat() {
    $.ajax({
        url: 'http://localhost:3000/src/routes/obtenerData',
        success: function (result) {
            alert(result);
            console.log(result)
            var labels = result.label;
            var data = result.info;
            renderChart(data, labels);
        },

        error: function (err) {
            console.log(err);
        }
    });
}
