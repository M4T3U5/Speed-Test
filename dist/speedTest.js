
//var HTTPApiEndPoint = "http://192.168.1.6:8766/dataflow";
//var HTTPApiEndPoint = "http://192.168.1.22:8766/dataflow";
var HTTPApiEndPoint = "http://localhost:8766/dataflow";
var HTTPSApiEndPoint = "https://localhost:8767";
var WSApiEndPoint = "ws://localhost:8765";

// generate an 1MB upload payload
var payload = generate1MegaBytePayload();

// this method will create an upload, download and ping gauges for GUI
uploadGauge = getInitializedGauge('uploadGauge');
downloadGauge = getInitializedGauge('downloadGauge');
pingGauge = getInitializedGauge('pingGauge');

function startTest(){

    // UPLOAD TEST

    // DOWNLOAD TEST
    doDownloadTest();
    doUploadTest();
}

function generate1MegaBytePayload() {
    var string = ""
    for (var i = 0; i < 1000000; i++){
        string += "Z";
    }
    return string;
}


// this function is responsible to execute download speed test

async function doDownloadTest(){
    var i = 0;
    var soma = 0;

    const interval = setInterval( async function() {
        if (i == 50){
            clearInterval(interval);
            return true;
        }
        else{
            i++;

            var t0 = performance.now();
            await getHTTPDataFromServer();
            var t1 = performance.now();
            console.log(i);
        
            var dowloadSpeed = calculateDataTransferSpeed(t0, t1);

            soma += dowloadSpeed;

            var avg = soma / i;

            updateGauge(downloadGauge , avg);
        
            document.getElementById("downloadGaugeValue").innerHTML = avg.toFixed(2);
        }
    }, 150);
}

// this function is responsible to execute upload speed test
function doUploadTest() {

    var i = 0;
    var soma = 0;

    const interval = setInterval(async function() {
        if (i == 50){
            clearInterval(interval);
        }
        else{
            
            i++;

            var t0 = performance.now();
            postHTTPDataToServer();
            var t1 = performance.now();

            var uploadSpeed = calculateDataTransferSpeed(t0, t1);

            soma += uploadSpeed;

            var avg = soma / i;
        
            updateGauge(uploadGauge , avg);
        
            document.getElementById("uploadGaugeValue").innerHTML = avg.toFixed(2);
        }
    }, 150);
}

function getInitializedGauge (gaugeId) {

    var opts = {
    };
    var target = document.getElementById(gaugeId);
    var gauge = new Gauge(target).setOptions(opts);
    gauge.maxValue = 1000;
    gauge.setMinValue(0);
    gauge.set(0);
    gauge.animationSpeed = 20;
    return gauge;
}

function updateGauge(gauge, value){
    gauge.set(value);
}

function calculateDataTransferSpeed(startTime, finalTime){
    // the transfered data is 1MB, and time is measured in miliseconds

    // convert miliseconds to seconds
        var spentTimeInSeconds = (finalTime - startTime) / 1000;
    
    // transform MB in Mbps
        var MegabitsPerSecond = (1 / spentTimeInSeconds) * 8;

        console.log(MegabitsPerSecond);
        return MegabitsPerSecond;
}

// GET data from speedtest server (Download client-side)

async function getHTTPDataFromServer(){
    $.ajax({
        async: false,
        type: 'GET',
        url: HTTPApiEndPoint,
        success: function(data) {
             return data
        }
   });

}

// POST data from speedtest server (Upload client-side)
async function postHTTPDataToServer(){
    $.ajax({
        async: false,
        type: 'POST',
        url: HTTPApiEndPoint,
        data: {myData: payload},
        success: function(data) {
             return data
        }
   });
}

//     return new Promise (function(resolve, reject){
//         $.post(HTTPApiEndPoint, { myData: payload },
//             function(data, status, jqXHR) {// success callback
//                 console.log("POST->"+i)
//                 resolve(status);
//              })         
//     })
// }



// implements for future with webSocket
function waitForSocketConnection(socket, callback){
    setTimeout(
        function(){
            if (socket.readyState === 1) {
                if(callback !== undefined){
                    callback();
                }
                return;
            } else {
                
            }
        }, 5000);
};
