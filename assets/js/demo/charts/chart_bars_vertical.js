/*
 * charts/chart_bars_vertical.js
 *
 * Demo JavaScript used on charts-page for "Vertical Bars".
 */

"use strict";

$(document).ready(function(){
    


    var _url = 'http://' + document.location.host + '/Home/GetData';
    $.ajax({
        url: _url,
        type: "GET",
        data: { 'id': 1 },
        async: true,
        contentType: "application/json; charset=utf-8",
        dataType: 'html',
        traditional: true,
        xhrFields: {
            withCredentials: false
        },
        traditional: true,
        success: function (result) {    
            LoadChart(JSON.parse(result))

        },
        error: function (error) {
            var x = error;
            alert("error " + x);
        }



    });

    function LoadChart(result)
    {
    // Sample Data
    //var d1 = [];
    //for (var i = 0; i <= 7; i += 1)
    //    d1.push([i, parseInt(Math.random() * 30)+1]);

    //var d2 = [];
    //for (var i = 0; i <= 7; i += 1)
    //    d2.push([i, parseInt(Math.random() * 30) + 1]);

    //var d3 = [];
    //for (var i = 0; i <= 7; i += 1)
    //    d3.push([i, parseInt(Math.random() * 30) + 1]);

    //var ds = new Array();

    //ds.push({
    //    label: "Activas",
    //    data: d1,
    //    bars: {
    //        show: true,
    //        barWidth: 0.2,
    //        order: 1
    //    }
    //});
    //ds.push({
    //    label: "Canceladas",
    //    data: d2,
    //    bars: {
    //        show: true,
    //        barWidth: 0.2,
    //        order: 2
    //    }
    //});
    //ds.push({
    //    label: "Pendientes",
    //    data: d3,
    //    bars: {
    //        show: true,
    //        barWidth: 0.2,
    //        order: 3
    //    }
        //});

        var ds = new Array();
        var x = 0;
        $.each(result, function (key, value) {
            //alert(key + ": " + value.label);
            var d1 = [];            

            d1.push([x, value.data]);
            ds.push({
                label: value.label,
                data: d1,
                bars: {
                    show: true,
                    barWidth: 0.5,
                    order: 1
                }
            });
            x++;
        });

    // Initialize Chart
    $.plot("#chart_bars_vertical", ds, $.extend(true, {}, Plugins.getFlotDefaults(), {
        series: {
            lines: { show: false },
            points: { show: false }
        },
        grid:{
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content: '%s: %y'
        }
    }));

}

});