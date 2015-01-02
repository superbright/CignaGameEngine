var fs = require('fs');

var baseUrl = 'http://app.radiantevent.com/cigna/disneyMarathon/dev';
var _ = require('lodash');
var restler = require('restler');

module.exports = {
    
    getRegistration: function(cb) {

    },

    addRegistration: function(filepath, opts, cb) {

        fs.stat(filepath, function(err, stats) {
            restler.post(baseUrl + '/addReg.php', {
                multipart: true,
                data: _.extend(opts, {
                    signatureFile: restler.file(filepath, null, stats.size, null, "image/png")
                })
            }).on("complete", function(data) {
                console.log(data);
            });
        }); 
    },

    addParticipation: function(filepath, opts, cb) {

        fs.stat(filepath, function(err, stats) {
            console.log("add addParticipation");
            restler.post(baseUrl + '/addParticipation.php', {
                multipart: true,
                data: _.extend(opts, {
                    accessCode: '1234012',
                    mediaFile_1: restler.file(filepath, null, stats.size, null, "image/jpg")    
                })
            }).on("complete", function(data) {
                console.log('completed')
                cb(null, data);
            }).on('error', function(err) {
                console.log(err);
                cb(err);
            });
        });

    }

}

