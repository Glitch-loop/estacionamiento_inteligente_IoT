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


function getChartDat() {
    alert('Hola mundo')
}
// $('#renderBtn').click(
//     // function () {
//     //     console.log('Hola')
//     //     getChartDat();
//     // }
// );