module.exports = function(app){
    var shell = require('shelljs');

    // Timers
    var timeouts = [];
    var loopouts = [];

    function setLimit(json){
        var command = 'sudo tc qdisc change dev lo root netem ';

        /*Do not allow negative delay values*/
        if (json.limit != "" && json.limit >= 0) {
            command += 'limit ' + json.limit + ' ';
        }

        /*Do not allow negative delay values*/
        if (json.delay != "" && json.delay >= 0) {
            command += 'delay ' + json.delay + 'ms ';
        }

        /*Don't execute unless the user has inputted a value for delay*/
        if (json.delayvariance && json.delay != "") {
            command += json.delayvariance + 'ms ';
        }

        if(parseInt(json.jitter) === 1){
            command += 'distribution ' + json.distribution + ' ';
        }

        /*Do not allow loss-values over 100% or under 0%*/
        if (json.loss != "" && json.loss >= 0 && json.loss <= 100) {
            command += 'loss ' + json.loss + '% ';
        }

        /*Do not allow duplicate-values over 100% or under 0%*/
        if (json.duplicate != "" && json.duplicate >= 0 && json.duplicate <= 100) {
            command += 'duplicate ' + json.duplicate + '% ';
        }

        /*Do not allow reorder-values over 100% or under 0%*/
        if (json.reorder != "" && json.reorder >= 0 && json.reorder <= 100) {
            command += 'reorder ' + json.reorder + '% ';
        }

        /*Do not allow corrupt-values over 100% or under 0%*/
        if (json.corrupt != "" && json.corrupt >= 0 && json.corrupt <= 100) {
            command += 'corrupt ' + json.corrupt + '% ';
        }

        /*Do not allow negative rate values*/
        if (json.rate != "" && json.rate >= 0) {
            command += 'rate ' + json.rate + 'bit ';
        }

        if (command != 'sudo tc qdisc change dev lo root netem ') {
            shell.exec(command, {silent:true});
        }
    }

    function resetLimit() {
        for (var i = 0; i < timeouts.length; i++) {
          clearTimeout(timeouts[i]);
        }

        for (var z = 0; z < loopouts.length; z++) {
          clearInterval(loopouts[z]);
        }

        timeouts = [];
        loopouts = [];
        var command = 'sudo tc qdisc change dev lo root netem limit 1000 delay 0ms 0ms corrupt 0% duplicate 0% reorder 0% loss 0% rate 0bit';
        shell.exec(command, {silent:true});
    }
    
    app.put('/limit', function (req, res) {
        resetLimit();
        setLimit(req.body);
        var status = shell.exec('sudo tc qdisc show', {silent:true}).output;
        res.json(status);
    });

    app.put('/limit/reset', function(req, res) {
        resetLimit();
        var status = shell.exec('sudo tc qdisc show', {silent:true}).output;
        res.json(status);
    });
    
    app.put('/target', function (req, res) {
        var command = undefined;
        
        command = "line=\"$(grep -n '\\sbackend contriboardclient' /etc/haproxy/haproxy.cfg | cut -d : -f 1)\" ; line=$((line+1)) ; sed -i \"${line}s/.*/server target "+req.body.clienturl+"/\" /etc/haproxy/haproxy.cfg";
        shell.exec(command, {silent:true});
    
        command = "line=\"$(grep -n '\\sbackend contriboardapi' /etc/haproxy/haproxy.cfg | cut -d : -f 1)\" ; line=$((line+1)) ; sed -i \"${line}s/.*/server target "+req.body.apiurl+"/\" /etc/haproxy/haproxy.cfg";
        shell.exec(command, {silent:true});
    
        command = "line=\"$(grep -n '\\sbackend contriboardio' /etc/haproxy/haproxy.cfg | cut -d : -f 1)\" ; line=$((line+1)) ; sed -i \"${line}s/.*/server target "+req.body.iourl+"/\" /etc/haproxy/haproxy.cfg";
        shell.exec(command, {silent:true});
    
        var status = shell.exec('sudo service haproxy restart', {silent:true}).output;
        res.json(status);
    });
    
    app.put('/script', function(req, res){
        resetLimit();
        var loop = req.body.loop;
        var jsonscript = JSON.parse(req.body.jsonscript);
        var seconds = Object.keys(jsonscript);
        console.log('New script with timers at: ' +seconds.toString());
        seconds.forEach(function(i){
            timeouts.push(setTimeout(function(){
                console.log('');
                console.log('[S]['+i+' sec] Delayed trigger fired');
                setLimit(jsonscript[i]);
                if(loop){
                    loopouts.push(setInterval(function(){
                        console.log('');
                        console.log('[L]['+i+' sec] Delayed trigger fired');
                        setLimit(jsonscript[i]);
                        },1000*Math.max.apply(Math,seconds)));
                }
            },i*1000));
        });
        res.json('New script with timers at: ' + seconds.toString());
    });    
}
