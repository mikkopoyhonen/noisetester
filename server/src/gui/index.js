module.exports = function(app){
    app.get('/', function (req, res) {
        res.redirect('/gui/welcome');
    });
    
    app.get('/gui/welcome', function (req, res) {
        res.render('welcome');
    });
    
    app.get('/gui/config/manual', function (req, res) {
        res.render('config_manual');
    });
    
    app.get('/gui/target', function (req, res) {
        res.render('target');
    });
    
    app.get('/gui/config/script', function (req, res) {
        res.render('config_script');
    });
}
