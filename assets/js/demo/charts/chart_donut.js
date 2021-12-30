/*
 * charts/chart_donut.js
 *
 * Demo JavaScript used on charts-page for "Donut Chart".
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


    function LoadChart(value)
    {
        $.plot("#chart_donut", value, $.extend(true, {}, Plugins.getFlotDefaults(), {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.5,
                    radius: 1
                }
            },
            grid: {
                hoverable: true
            },
            tooltip: true,
            tooltipOpts: {
                content: '%p.0%, %s', // show percentages, rounding to 2 decimal places
                shifts: {
                    x: 20,
                    y: 0
                }
            }
        }));




    }

    
      


});