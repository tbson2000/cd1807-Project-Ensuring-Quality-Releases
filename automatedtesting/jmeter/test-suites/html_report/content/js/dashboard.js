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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9259259259259259, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET api/Activities/{id}"], "isController": false}, {"data": [0.25, 500, 1500, "GET authors/books/{idBook}"], "isController": false}, {"data": [1.0, 500, 1500, "GET api/CoverPhotos"], "isController": false}, {"data": [1.0, 500, 1500, "GET api/Books/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "PUT api/Users/{id}"], "isController": false}, {"data": [0.75, 500, 1500, "PUT api/CoverPhotos/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "GET api/Users"], "isController": false}, {"data": [0.75, 500, 1500, "POST api/Activities"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE api/CoverPhotos/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "GET api/Users/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "PUT api/Authors/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "GET api/Activities"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE api/Books/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "PUT api/Activities/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "POST api/Books"], "isController": false}, {"data": [1.0, 500, 1500, "GET api/Authors/{id}"], "isController": false}, {"data": [0.5, 500, 1500, "GET api/Books"], "isController": false}, {"data": [1.0, 500, 1500, "PUT api/Books/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE api/Authors/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "POST api/Authors"], "isController": false}, {"data": [1.0, 500, 1500, "GET books/covers/{idBook}"], "isController": false}, {"data": [1.0, 500, 1500, "POST api/Users"], "isController": false}, {"data": [1.0, 500, 1500, "GET api/CoverPhotos/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE api/Users/{id}"], "isController": false}, {"data": [1.0, 500, 1500, "POST api/CoverPhotos"], "isController": false}, {"data": [0.75, 500, 1500, "GET api/Authors"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE api/Activities/{id}"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 54, 0, 0.0, 352.7222222222223, 229, 1620, 243.0, 629.5, 1307.5, 1620.0, 4.822720371528088, 168.34212358779138, 1.0956129431990713], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET api/Activities/{id}", 2, 0, 0.0, 238.0, 236, 240, 238.0, 240.0, 240.0, 240.0, 1.6835016835016834, 0.5770596590909092, 0.34031723484848486], "isController": false}, {"data": ["GET authors/books/{idBook}", 2, 0, 0.0, 1290.0, 960, 1620, 1290.0, 1620.0, 1620.0, 1620.0, 0.5768676088837611, 0.2923772353619844, 0.11604953850591289], "isController": false}, {"data": ["GET api/CoverPhotos", 2, 0, 0.0, 240.0, 236, 244, 240.0, 244.0, 244.0, 244.0, 1.0554089709762533, 21.375123680738785, 0.21231860158311344], "isController": false}, {"data": ["GET api/Books/{id}", 2, 0, 0.0, 242.5, 242, 243, 242.5, 243.0, 243.0, 243.0, 1.5987210231814548, 0.5558053557154277, 0.32474020783373303], "isController": false}, {"data": ["PUT api/Users/{id}", 2, 0, 0.0, 240.5, 238, 243, 240.5, 243.0, 243.0, 243.0, 1.455604075691412, 0.37242994905385735, 0.3482646470160116], "isController": false}, {"data": ["PUT api/CoverPhotos/{id}", 2, 0, 0.0, 421.0, 237, 605, 421.0, 605.0, 605.0, 605.0, 1.0723860589812333, 0.27438002680965146, 0.2764745308310992], "isController": false}, {"data": ["GET api/Users", 2, 0, 0.0, 282.0, 242, 322, 282.0, 322.0, 322.0, 322.0, 1.5128593040847202, 1.1582829046898637, 0.2954803328290469], "isController": false}, {"data": ["POST api/Activities", 2, 0, 0.0, 396.5, 231, 562, 396.5, 562.0, 562.0, 562.0, 1.694915254237288, 0.4336599576271187, 0.4667637711864407], "isController": false}, {"data": ["DELETE api/CoverPhotos/{id}", 2, 0, 0.0, 234.0, 231, 237, 234.0, 237.0, 237.0, 237.0, 1.3422818791946307, 0.27658347315436244, 0.27658347315436244], "isController": false}, {"data": ["GET api/Users/{id}", 2, 0, 0.0, 283.0, 245, 321, 283.0, 321.0, 321.0, 321.0, 1.4275517487508922, 0.4321689864382584, 0.28160688793718774], "isController": false}, {"data": ["PUT api/Authors/{id}", 2, 0, 0.0, 256.5, 243, 270, 256.5, 270.0, 270.0, 270.0, 1.0432968179447053, 0.2669372717788211, 0.25369229264475746], "isController": false}, {"data": ["GET api/Activities", 2, 0, 0.0, 277.5, 234, 321, 277.5, 321.0, 321.0, 321.0, 1.5710919088766695, 4.770043695993716, 0.3145252356637864], "isController": false}, {"data": ["DELETE api/Books/{id}", 2, 0, 0.0, 239.0, 231, 247, 239.0, 247.0, 247.0, 247.0, 1.6260162601626016, 0.3350482723577236, 0.3255208333333333], "isController": false}, {"data": ["PUT api/Activities/{id}", 2, 0, 0.0, 238.0, 232, 244, 238.0, 244.0, 244.0, 244.0, 2.3584905660377355, 0.6034419221698113, 0.6518094044811321], "isController": false}, {"data": ["POST api/Books", 2, 0, 0.0, 236.5, 232, 241, 236.5, 241.0, 241.0, 241.0, 1.6129032258064515, 0.41267641129032256, 0.5591607862903226], "isController": false}, {"data": ["GET api/Authors/{id}", 2, 0, 0.0, 240.5, 237, 244, 240.5, 244.0, 244.0, 244.0, 1.0526315789473684, 0.33922697368421056, 0.20970394736842107], "isController": false}, {"data": ["GET api/Books", 2, 0, 0.0, 1370.0, 1245, 1495, 1370.0, 1495.0, 1495.0, 1495.0, 0.8003201280512205, 699.1284795168067, 0.156312525010004], "isController": false}, {"data": ["PUT api/Books/{id}", 2, 0, 0.0, 244.5, 236, 253, 244.5, 253.0, 253.0, 253.0, 1.5974440894568689, 0.4087210463258786, 0.5553614217252396], "isController": false}, {"data": ["DELETE api/Authors/{id}", 2, 0, 0.0, 234.0, 231, 237, 234.0, 237.0, 237.0, 237.0, 1.0498687664041995, 0.21633038057742782, 0.2122293307086614], "isController": false}, {"data": ["POST api/Authors", 2, 0, 0.0, 237.0, 233, 241, 237.0, 241.0, 241.0, 241.0, 1.0593220338983051, 0.2710374735169492, 0.2575890492584746], "isController": false}, {"data": ["GET books/covers/{idBook}", 2, 0, 0.0, 258.0, 253, 263, 258.0, 263.0, 263.0, 263.0, 1.041124414367517, 0.3639868558042686, 0.20842822748568454], "isController": false}, {"data": ["POST api/Users", 2, 0, 0.0, 237.5, 234, 241, 237.5, 241.0, 241.0, 241.0, 1.4566642388929352, 0.3727012017479971, 0.3470957756737072], "isController": false}, {"data": ["GET api/CoverPhotos/{id}", 2, 0, 0.0, 242.5, 238, 247, 242.5, 247.0, 247.0, 247.0, 1.0587612493382743, 0.3680849655902594, 0.21506087877183694], "isController": false}, {"data": ["DELETE api/Users/{id}", 2, 0, 0.0, 281.0, 239, 323, 281.0, 323.0, 323.0, 323.0, 1.4684287812041115, 0.3025766336270191, 0.2939725587371512], "isController": false}, {"data": ["POST api/CoverPhotos", 2, 0, 0.0, 236.0, 229, 243, 236.0, 243.0, 243.0, 243.0, 1.0689470871191875, 0.2735001336183859, 0.27454402725815075], "isController": false}, {"data": ["GET api/Authors", 2, 0, 0.0, 563.0, 472, 654, 563.0, 654.0, 654.0, 654.0, 0.8631851532153647, 33.43915219033232, 0.17027675873974965], "isController": false}, {"data": ["DELETE api/Activities/{id}", 2, 0, 0.0, 264.5, 243, 286, 264.5, 286.0, 286.0, 286.0, 2.244668911335578, 0.4625245510662177, 0.46033249158249157], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 54, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
