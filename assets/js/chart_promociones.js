/*
 * charts/chart_filled_green.js
 *
 * Demo JavaScript used on charts-page for "Filled Chart (Green)".
 */

"use strict";

$(document).ready(function () {


    function randNum3() {
        return ((Math.floor(Math.random() * (1 + 40 - 20))) + 20) * 300;
    }

    function gd(year, month, day) {
        return new Date(year, month - 1, day).getTime();
    }

    function chart24(trx, premios) {

        var plot = $.plot($("#chart-24h"),
            [{ data: trx, label: "Transacciones" },
            { data: premios, label: "Premios" }], {
                series: {
                    lines: {
                        show: true,
                        lineWidth: 2,
                        fill: true,
                        fillColor: { colors: [{ opacity: 0.1 }, { opacity: 0.1 }] }
                    },
                    points: {
                        show: true,
                        lineWidth: 2
                    },
                    shadowSize: 0
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    borderWidth: 0,
                },
                legend: {
                    show: false
                },
                colors: ["#bdea74", "#2FABE9"],
                xaxis: { ticks: 10, tickDecimals: 0, tickColor: "#fff" },
                yaxis: { ticks: 5, tickDecimals: 0, tickColor: "#e1e6ef" },
            });

        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 5,
                border: '1px solid #fdd',
                padding: '2px',
                'background-color': '#dfeffc',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        $("#chart-24h").bind("plothover", function (event, pos, item) {

            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint !== item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY, item.series.label + " of " + x + " = " + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }

    function chartWeek(trx, premios) {

        var dayOfWeek = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"];

        var plot = $.plot($("#chart-week"),
            [{ data: trx, label: "Transacciones" },
            { data: premios, label: "Premios" }], {
                series: {
                    lines: {
                        show: true,
                        lineWidth: 3,
                        fill: false
                    },
                    points: {
                        show: true,
                        lineWidth: 3,
                        fill: true,
                        fillColor: "#fff"
                    },
                    shadowSize: 0
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "#e1e6ef",
                    borderWidth: 0,
                },
                colors: ["#c0cadd", "#2FABE9"],
                xaxis: {
                    mode: "time",
                    tickFormatter: function (val, axis) {
                        return dayOfWeek[new Date(val).getDay()];
                    },
                    font: {
                        color: "#c0cadd"
                    },
                    ticks: 7,
                    tickColor: "#fff",
                    alignTicksWithAxis: 1,
                    autoscaleMargin: 0.02,
                },
                yaxis: {
                    font: {
                        color: "#c0cadd"
                    },
                    ticks: 4,
                    tickDecimals: 0,
                },
            });

        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 5,
                border: '1px solid #fdd',
                padding: '2px',
                'background-color': '#dfeffc',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        $("#chart-week").bind("plothover", function (event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint !== item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY,
                                item.series.label + " of " + x + " = " + y);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }

        });

    }

    function chartMonth(trx, premios) {

        var plot = $.plot($("#chart-month"),
            [{
                data: premios,
                bars: {
                    show: true,
                    fill: false,
                    barWidth: 0.1,
                    align: "center",
                    lineWidth: 16
                }
            }, {
                data: trx,
                label: "Transacciones",
                lines: {
                    show: true,
                    lineWidth: 0.5
                },
                points: {
                    show: true,
                    lineWidth: 0.5,
                    fill: true
                },
                shadowSize: 0
            }
            ], {
                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "#e1e6ef",
                    borderWidth: 0,
                    labelMargin: 10,
                    margin: {
                        top: 0,
                        left: 5,
                        bottom: 0,
                        right: 0
                    }
                },
                legend: {
                    show: false
                },
                colors: ["rgba(192, 202, 221, 0.3)", "#c0cadd", "#c0cadd"],
                xaxis: { ticks: 5, tickDecimals: 0, tickColor: "#fff" },
                yaxis: { ticks: 3, tickDecimals: 0 },
            }
        );

        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 5,
                border: '1px solid #fdd',
                padding: '2px',
                'background-color': '#dfeffc',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        $("#chart-month").bind("plothover", function (event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint !== item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY,
                                item.series.label + " of " + x + " = " + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }

        });

    }


    function init24h() {
        //var data1 = [[1, 5 + randNum3()], [2, 10 + randNum3()], [3, 15 + randNum3()], [4, 20 + randNum3()], [5, 25 + randNum3()], [6, 30 + randNum3()], [7, 35 + randNum3()], [8, 40 + randNum3()], [9, 45 + randNum3()], [10, 50 + randNum3()], [11, 55 + randNum3()], [12, 60 + randNum3()], [13, 65 + randNum3()], [14, 70 + randNum3()], [15, 75 + randNum3()], [16, 80 + randNum3()], [17, 85 + randNum3()], [18, 90 + randNum3()], [19, 85 + randNum3()], [20, 80 + randNum3()], [21, 75 + randNum3()], [22, 80 + randNum3()], [23, 75 + randNum3()], [24, 70 + randNum3()]];
        //var data2 = [[1, 5 + randNum3()], [2, 10 + randNum3()], [3, 15 + randNum3()], [4, 20 + randNum3()], [5, 25 + randNum3()], [6, 30 + randNum3()], [7, 35 + randNum3()], [8, 40 + randNum3()], [9, 45 + randNum3()], [10, 50 + randNum3()], [11, 55 + randNum3()], [12, 60 + randNum3()], [13, 65 + randNum3()], [14, 70 + randNum3()], [15, 75 + randNum3()], [16, 80 + randNum3()], [17, 85 + randNum3()], [18, 90 + randNum3()], [19, 85 + randNum3()], [20, 80 + randNum3()], [21, 75 + randNum3()], [22, 80 + randNum3()], [23, 75 + randNum3()], [24, 70 + randNum3()]];
        var uri = '/api/Chart/d24hStats/';
        $.getJSON(uri).done(function (data) {
            chart24(data.trx, data.premios);
        });
    }

    function initWeek() {
        //var data1 = [[gd(2013, 1, 2), 1690.25], [gd(2013, 1, 3), 1596.3], [gd(2013, 1, 4), 1159.65], [gd(2013, 1, 5), 1668.15], [gd(2013, 1, 6), 1656.1], [gd(2013, 1, 7), 1668.65], [gd(2013, 1, 8), 1668.15]];
        //var data2 = [[gd(2013, 1, 2), 690.25], [gd(2013, 1, 3), 1496.3], [gd(2013, 1, 4), 959.65], [gd(2013, 1, 5), 1368.15], [gd(2013, 1, 6), 656.1], [gd(2013, 1, 7), 668.65], [gd(2013, 1, 8), 668.15]];
        var uri = '/api/Chart/WeekStats/';
        $.getJSON(uri).done(function (data) {
            chartWeek(data.trx, data.premios);
        });

        

    }

    function initMonth() {
        var uri = '/api/Chart/MonthStats/';
        $.getJSON(uri).done(function (data) {
            chartMonth(data.trx, data.premios);
        });
    }

    /* ---------- Init Main Chart ---------- */
    init24h();
    initWeek();
    initMonth();


    // Sample Data

    //var d1 = [[1262304000000, 17], [1264982400000, 600], [1267401600000, 1200], [1270080000000, 1000], [1272672000000, 2000], [1275350400000, 2300], [1277942400000, 2700], [1280620800000, 2000], [1283299200000, 1300], [1285891200000, 1000], [1288569600000, 2300], [1291161600000, 2000]];

    //// Random data for "Server load"
    //var data_server_load = [];
    //d1.forEach(function (entry) {
    //    var y = Math.floor(500 - 15 + Math.random() * 300);
    //    data_server_load.push([entry[0], y]);
    //});


    //var data1 = [
    //	{
    //	    label: "Total clicks", data: d1, color: App.getLayoutColorCode('green'), lines: { fill: true }, points: { show: false }
    //	},
    //    {
    //        label: "Server load", data: data_server_load, color: App.getLayoutColorCode('blue')
    //    }
    //];


    //$.plot("#chart_transacciones", data1, $.extend(true, {}, Plugins.getFlotDefaults(), {
    //    xaxis: {
    //        min: (new Date(2009, 12, 1)).getTime(),
    //        max: (new Date(2010, 11, 2)).getTime(),
    //        mode: "time",
    //        tickSize: [1, "day"],
    //        tickLength: 0
    //    },
    //    series: {
    //        lines: {
    //            show: true,
    //            lineWidth: 1.5
    //        },
    //        points: {
    //            show: true,
    //            radius: 2.5,
    //            lineWidth: 1.1
    //        }
    //    },
    //    grid: {
    //        hoverable: true,
    //        clickable: true
    //    },
    //    tooltip: true,
    //    tooltipOpts: {
    //        content: '%s: %y'
    //    }

    //}));
    // Sample Data

    //var d1 = [[1262304000000, 17], [1264982400000, 600], [1267401600000, 1200], [1270080000000, 1000], [1272672000000, 2000], [1275350400000, 2300], [1277942400000, 2700], [1280620800000, 2000], [1283299200000, 1300], [1285891200000, 1000], [1288569600000, 2300], [1291161600000, 2000]];

    //// Random data for "Server load"
    //var data_server_load = [];
    //d1.forEach(function (entry) {
    //    var y = Math.floor(500 - 15 + Math.random() * 300);
    //    data_server_load.push([entry[0], y]);
    //});


    //var data1 = [
    //	{
    //	    label: "Total clicks", data: d1, color: App.getLayoutColorCode('green'), lines: { fill: true }, points: { show: false }
    //	},
    //    {
    //        label: "Server load", data: data_server_load, color: App.getLayoutColorCode('blue')
    //    }
    //];


    //$.plot("#chart_transacciones", data1, $.extend(true, {}, Plugins.getFlotDefaults(), {
    //    xaxis: {
    //        min: (new Date(2009, 12, 1)).getTime(),
    //        max: (new Date(2010, 11, 2)).getTime(),
    //        mode: "time",
    //        tickSize: [1, "day"],
    //        tickLength: 0
    //    },
    //    series: {
    //        lines: {
    //            show: true,
    //            lineWidth: 1.5
    //        },
    //        points: {
    //            show: true,
    //            radius: 2.5,
    //            lineWidth: 1.1
    //        }
    //    },
    //    grid: {
    //        hoverable: true,
    //        clickable: true
    //    },
    //    tooltip: true,
    //    tooltipOpts: {
    //        content: '%s: %y'
    //    }

    //}));


});