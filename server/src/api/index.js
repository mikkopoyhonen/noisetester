module.exports = function(app){
    var shell = require('shelljs');
   app.locals.limit = {
    limit: '',
    loss: '',
    delay: '',
    delayvariance: '',
    duplicate: '',
    corrupt: '',
    reorder: '',
    rate: ''
}

function setLimit(json){
    console.log(json);
    var command = 'sudo tc qdisc change dev lo root netem ';
    /*When the user has NOT inputted any values to any of the fields in configure - index.jade
    let's assume that they want to clear their loss and delay, and reset the lingering variables*/
    if (json.loss == "" && json.delay == "" && json.delayvariance == "" 
        && json.duplicate == "" && json.limit == "" && json.corrupt == ""
        && json.reorder == "" && json.rate == "") {
        app.locals.limit.limit = '';
        app.locals.limit.loss = '';
        app.locals.limit.delay = '';
        app.locals.limit.delayvariance = '';
        app.locals.limit.duplicate = '';
        app.locals.limit.corrupt = '';
        app.locals.limit.reorder = '';
        app.locals.limit.rate = '';
    }

    /*Do not allow negative delay values*/
    if (json.limit != "" && json.limit >= 0) {
        app.locals.limit.limit = json.limit;
        command += 'limit ' + json.limit + ' ';
    }
    else if (app.locals.limit.limit != '') {
        command += 'limit ' + app.locals.limit.limit + ' ';
    }

    /*Do not allow negative delay values*/
    if (json.delay != "" && json.delay >= 0) {
        app.locals.limit.delay = json.delay;
        command += 'delay ' + json.delay + 'ms ';
    }
    else if (app.locals.limit.delay != '') {
        command += 'delay ' + app.locals.limit.delay + 'ms ';
    }

    /*Don't execute unless the user has inputted a value for delay*/
    if (json.delayvariance != "" && json.delay != "") {
        app.locals.limit.delayvariance = json.delayvariance;
        command += json.delayvariance + 'ms ';
    }
    else if (app.locals.limit.delayvariance != '') {
        command += app.locals.limit.delayvariance + 'ms ';
    }

    if(parseInt(json.jitter) === 1){
        command += 'distribution ' + json.distribution + ' ';
    }

    /*Do not allow loss-values over 100% or under 0%*/
    if (json.loss != "" && json.loss >= 0 && json.loss <= 100) {
        app.locals.limit.loss = json.loss;
        command += 'loss ' + json.loss + '% ';
    }
    else if (app.locals.limit.loss != '') {
        command += 'loss ' + app.locals.limit.loss + '% ';
    }

    /*Do not allow loss-values over 100% or under 0%*/
    if (json.duplicate != "" && json.duplicate >= 0 && json.duplicate <= 100) {
        app.locals.limit.duplicate = json.duplicate;
        command += 'duplicate ' + json.duplicate + '% ';
    }
    else if (app.locals.limit.duplicate != '') {
        command += 'duplicate ' + app.locals.limit.duplicate + '% ';
    }

    /*Do not allow loss-values over 100% or under 0%*/
    if (json.reorder != "" && json.reorder >= 0 && json.reorder <= 100) {
        app.locals.limit.reorder = json.reorder;
        command += 'reorder ' + json.reorder + '% ';
    }
    else if (app.locals.limit.reorder != '') {
        command += 'reorder ' + app.locals.limit.reorder + '% ';
    }

    /*Do not allow loss-values over 100% or under 0%*/
    if (json.corrupt != "" && json.corrupt >= 0 && json.corrupt <= 100) {
        app.locals.limit.corrupt = json.corrupt;
        command += 'corrupt ' + json.corrupt + '% ';
    }
    else if (app.locals.limit.corrupt != '') {
        command += 'corrupt ' + app.locals.limit.corrupt + '% ';
    }

    /*Do not allow negative delay values*/
    if (json.rate != "" && json.rate >= 0) {
        app.locals.limit.rate = json.rate;
        command += 'rate ' + json.rate + 'bit ';
    }
    else if (app.locals.limit.rate != '') {
        command += 'rate ' + app.locals.limit.rate + 'bit ';
    }

    if (command != 'sudo tc qdisc change dev lo root netem ') {
        shell.exec(command, {silent:true});
    }
    console.log(command);
}
    
    app.put('/limit', function (req, res) {
        setLimit(req.body);
        var status = shell.exec('sudo tc qdisc show', {silent:true}).output;
        res.json(status);
    });
    
    app.put('/target', function (req, res) {
        var command = undefined;
        
        command = "sudo sed -i '24s/.*/server target " + req.body.clienturl + "/' /etc/haproxy/haproxy.cfg";
        shell.exec(command, {silent:true});
    
        command = "sudo sed -i '27s/.*/server target " + req.body.apiurl + "/' /etc/haproxy/haproxy.cfg";
        shell.exec(command, {silent:true});
    
        command = "sudo sed -i '30s/.*/server target " + req.body.iourl + "/' /etc/haproxy/haproxy.cfg";
        shell.exec(command, {silent:true});
    
        var status = shell.exec('sudo service haproxy restart', {silent:true}).output;
        res.json(status);
    });
    
    // Timers
    var timeouts = [];
    var loopouts = [];
    app.put('/script', function(req, res){
        for (var i = 0; i < timeouts.length; i++) {
          clearTimeout(timeouts[i]);
        }

        for (var z = 0; z < loopouts.length; z++) {
          clearInterval(loopouts[z]);
        }

        timeouts = [];
        loopouts = [];
        var loop = req.body.loop;
        var jsonscript = JSON.parse(req.body.jsonscript);
        var seconds = Object.keys(jsonscript);
        console.log('loop:' +loop);
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
