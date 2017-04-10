var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function getRandomNumber(upperBound) {
    return Math.floor(Math.random() * upperBound);
}

app.post('/demo', function(request, response) {
        var records = [],
            memUpperBound = 40000,
            throughputUpperBound = 20000,
            packetUpperBound = 1000,
            errorUpperBound = 5;

        for (var ts = request.body.startTime; ts < request.body.endTime; ts += 1000) {
            records.push({
                timestamp: (new Date(ts)).toISOString(),
                memory_usage: getRandomNumber(memUpperBound),
                memory_available: getRandomNumber(memUpperBound),
                cpu_usage: Math.random().toFixed(2),
                network_throughput: {
                    "in": getRandomNumber(throughputUpperBound),
                    out: getRandomNumber(throughputUpperBound)
                },
                network_packet: {
                    "in": getRandomNumber(packetUpperBound),
                    out: getRandomNumber(packetUpperBound)
                },
                errors: {
                    system: getRandomNumber(errorUpperBound),
                    sensor: getRandomNumber(errorUpperBound),
                    component: getRandomNumber(errorUpperBound)
                }
            });

        }

        response.json({
            header: {
                target_name: request.body.serverID,
                time_range: {
                    start: new Date(request.body.startTime).toISOString(),
                    end: new Date(request.body.endTime).toISOString()
                },
                recordCount: records.length
            },
            data: records
        });
});

app.use(express.static(__dirname + "/public"));

app.listen(3000);
console.log('Server running on port 3000..');