/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9925925925925926, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET BOOK COVER by ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT BOOKS by ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET COVERPHOTOS"], "isController": false}, {"data": [1.0, 500, 1500, "POST BOOKS"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE AUTHOR by ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT USERS by ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST ACTIVITIES"], "isController": false}, {"data": [0.8, 500, 1500, "GET BOOK ID by AUTHOR"], "isController": false}, {"data": [1.0, 500, 1500, "PUT COVERPHOTO by ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET USERS"], "isController": false}, {"data": [1.0, 500, 1500, "GET AUTHOR ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET BOOK by ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET USERS by ID"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE USERS by ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST USERS"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE BOOK by ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET ACTIVITIES by ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT AUTHOR by ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST COVERPHOTOS"], "isController": false}, {"data": [1.0, 500, 1500, "POST AUTHOR"], "isController": false}, {"data": [1.0, 500, 1500, "GET ALL AUTHORS"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE COVERPHOTOS by ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT ACTIVITIES BY ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET ACTIVITES"], "isController": false}, {"data": [1.0, 500, 1500, "GET COVERPHOTOS by ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET BOOKS"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE ACTIVITIES by ID"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 135, 0, 0.0, 87.73333333333336, 60, 798, 65.0, 120.20000000000002, 149.19999999999987, 750.1199999999982, 47.05472289996514, 315.823171727954, 11.020281456953642], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET BOOK COVER by ID", 5, 0, 0.0, 67.4, 65, 70, 67.0, 70.0, 70.0, 70.0, 15.105740181268883, 5.292909743202417, 3.1303106117824773], "isController": false}, {"data": ["PUT BOOKS by ID", 5, 0, 0.0, 65.6, 63, 67, 66.0, 67.0, 67.0, 67.0, 15.290519877675841, 3.912222859327217, 5.426342698776758], "isController": false}, {"data": ["GET COVERPHOTOS", 5, 0, 0.0, 73.2, 66, 89, 70.0, 89.0, 89.0, 89.0, 14.124293785310734, 286.05832891949154, 2.9379634533898304], "isController": false}, {"data": ["POST BOOKS", 5, 0, 0.0, 65.6, 61, 73, 63.0, 73.0, 73.0, 73.0, 15.015015015015015, 3.841732357357357, 5.3109750375375375], "isController": false}, {"data": ["DELETE AUTHOR by ID", 5, 0, 0.0, 63.4, 61, 66, 64.0, 66.0, 66.0, 66.0, 15.290519877675841, 3.1506832951070334, 3.195479740061162], "isController": false}, {"data": ["PUT USERS by ID", 5, 0, 0.0, 68.4, 61, 79, 67.0, 79.0, 79.0, 79.0, 14.749262536873156, 3.77373709439528, 3.635462758112094], "isController": false}, {"data": ["POST ACTIVITIES", 5, 0, 0.0, 62.6, 60, 65, 63.0, 65.0, 65.0, 65.0, 15.723270440251572, 4.022946147798742, 4.440595518867925], "isController": false}, {"data": ["GET BOOK ID by AUTHOR", 5, 0, 0.0, 517.0, 316, 798, 467.0, 798.0, 798.0, 798.0, 5.005005005005005, 2.513255442942943, 1.0420576826826826], "isController": false}, {"data": ["PUT COVERPHOTO by ID", 5, 0, 0.0, 64.8, 62, 70, 65.0, 70.0, 70.0, 70.0, 14.084507042253522, 3.6036531690140845, 3.7384463028169015], "isController": false}, {"data": ["GET USERS", 5, 0, 0.0, 68.4, 61, 81, 66.0, 81.0, 81.0, 81.0, 15.015015015015015, 11.49587087087087, 3.035261824324324], "isController": false}, {"data": ["GET AUTHOR ID", 5, 0, 0.0, 70.6, 65, 79, 67.0, 79.0, 79.0, 79.0, 14.492753623188406, 4.670516304347826, 2.98629981884058], "isController": false}, {"data": ["GET BOOK by ID", 5, 0, 0.0, 64.6, 62, 70, 63.0, 70.0, 70.0, 70.0, 15.015015015015015, 5.231794294294294, 3.155499249249249], "isController": false}, {"data": ["GET USERS by ID", 5, 0, 0.0, 66.2, 63, 70, 66.0, 70.0, 70.0, 70.0, 14.970059880239521, 4.540723241017964, 3.058336452095808], "isController": false}, {"data": ["DELETE USERS by ID", 5, 0, 0.0, 66.8, 61, 79, 66.0, 79.0, 79.0, 79.0, 14.792899408284024, 3.048146264792899, 3.065481693786982], "isController": false}, {"data": ["POST USERS", 5, 0, 0.0, 63.8, 61, 69, 61.0, 69.0, 69.0, 69.0, 14.925373134328359, 3.8187966417910446, 3.6613805970149254], "isController": false}, {"data": ["DELETE BOOK by ID", 5, 0, 0.0, 66.2, 60, 80, 63.0, 80.0, 80.0, 80.0, 15.24390243902439, 3.1410775533536586, 3.15894150152439], "isController": false}, {"data": ["GET ACTIVITIES by ID", 5, 0, 0.0, 66.2, 64, 69, 66.0, 69.0, 69.0, 69.0, 15.432098765432098, 5.29272762345679, 3.2280815972222223], "isController": false}, {"data": ["PUT AUTHOR by ID", 5, 0, 0.0, 62.8, 61, 64, 64.0, 64.0, 64.0, 64.0, 15.384615384615385, 3.9362980769230766, 3.846153846153846], "isController": false}, {"data": ["POST COVERPHOTOS", 5, 0, 0.0, 63.4, 61, 65, 63.0, 65.0, 65.0, 65.0, 14.326647564469916, 3.6656070916905446, 3.7859285458452723], "isController": false}, {"data": ["POST AUTHOR", 5, 0, 0.0, 65.4, 61, 72, 63.0, 72.0, 72.0, 72.0, 15.060240963855422, 3.8533038403614457, 3.765060240963855], "isController": false}, {"data": ["GET ALL AUTHORS", 5, 0, 0.0, 139.0, 119, 158, 143.0, 158.0, 158.0, 158.0, 12.5, 697.63427734375, 2.55126953125], "isController": false}, {"data": ["DELETE COVERPHOTOS by ID", 5, 0, 0.0, 62.0, 60, 65, 62.0, 65.0, 65.0, 65.0, 14.245014245014245, 2.935251958689459, 3.0354122150997154], "isController": false}, {"data": ["PUT ACTIVITIES BY ID", 5, 0, 0.0, 64.8, 61, 69, 64.0, 69.0, 69.0, 69.0, 15.772870662460567, 4.035636829652997, 4.473087539432177], "isController": false}, {"data": ["GET ACTIVITES", 5, 0, 0.0, 80.4, 62, 142, 65.0, 142.0, 142.0, 142.0, 14.705882352941176, 44.562844669117645, 3.044577205882353], "isController": false}, {"data": ["GET COVERPHOTOS by ID", 5, 0, 0.0, 65.4, 64, 67, 66.0, 67.0, 67.0, 67.0, 14.285714285714285, 4.977678571428572, 3.0022321428571432], "isController": false}, {"data": ["GET BOOKS", 5, 0, 0.0, 122.2, 104, 137, 122.0, 137.0, 137.0, 137.0, 12.658227848101266, 1205.7332871835442, 2.5588409810126582], "isController": false}, {"data": ["DELETE ACTIVITIES by ID", 5, 0, 0.0, 62.6, 60, 64, 63.0, 64.0, 64.0, 64.0, 15.974440894568689, 3.291608426517572, 3.388328674121406], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 135, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
