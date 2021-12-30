// Chart.js scripts
// -- Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
// -- Area Chart Example


$.getJSON('GetHomeInformation', function (data) {
    var labels = new Array(12); quantity = new Array(12);
    for (var i = 0; i < data.ClientsByMonth.length; i++) {
        labels[i] = data.ClientsByMonth[i].YearMonthString;
        quantity[i] = data.ClientsByMonth[i].Quantity;
        
    }
    var dataToTimelineChart = { Labels: labels, Quantity: quantity, max: Math.max.apply(null, quantity)}
    CreateTimeLineGraphic(dataToTimelineChart);
    FillInfoBoxes(data);
    CreatePieChart(data);
})

function FillInfoBoxes(data) {
    $('#totalClients .mr-5').text('Total de Clientes: ' + data.TotalClients);
    $('#clientsWithTemporaryCode .mr-5').text(data.ClientsWithTemporaryCode)
    $('#newClientsInTheMonth .mr-5').text('Clientes registrados en el mes: ' + data.ClientsByMonth[data.ClientsByMonth.length - 1].Quantity);
    $('#blockedClients .mr-5').text('Clientes Bloqueados: ' + data.BlockedClients);
    $('#clientsWithTemporaryCode .mr-5').text('Clientes con Reservas: ' + data.TotalClientsWithTemporaryCode);
}

function CreateTimeLineGraphic(data) {
    var info;
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.Labels,
            datasets: [{
                label: "Clientes",
                lineTension: 0.3,
                backgroundColor: "rgba(2,117,216,0.2)",
                borderColor: "rgba(2,117,216,1)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(2,117,216,1)",
                pointBorderColor: "rgba(255,255,255,0.8)",
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                pointHitRadius: 20,
                pointBorderWidth: 2,
                data: data.Quantity
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    time: {
                        unit: 'Mes'
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 12
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: data.max,
                        maxTicksLimit: 5
                    },
                    gridLines: {
                        color: "rgba(0, 0, 0, .125)"
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });
}


//// -- Bar Chart Example
//var ctx = document.getElementById("myBarChart");
//var myLineChart = new Chart(ctx, {
//  type: 'bar',
//  data: {
//    labels: ["January", "February", "March", "April", "May", "June"],
//    datasets: [{
//      label: "Revenue",
//      backgroundColor: "rgba(2,117,216,1)",
//      borderColor: "rgba(2,117,216,1)",
//      data: [4215, 5312, 6251, 7841, 9821, 14984]
//    }]
//  },
//  options: {
//    scales: {
//      xAxes: [{
//        time: {
//          unit: 'month'
//        },
//        gridLines: {
//          display: false
//        },
//        ticks: {
//          maxTicksLimit: 6
//        }
//      }],
//      yAxes: [{
//        ticks: {
//          min: 0,
//          max: 15000,
//          maxTicksLimit: 5
//        },
//        gridLines: {
//          display: true
//        }
//      }]
//    },
//    legend: {
//      display: false
//    }
//  }
//});
// -- Pie Chart Example


function CreatePieChart(data) {
    
    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Usado', 'No Usado'],
            datasets: [{
                data: [data.ClientsTriedValidateTokens, (data.TotalClients - data.ClientsTriedValidateTokens)],
                backgroundColor: ['#007bff', '#dc3545']
            }]
        }
    });
}

