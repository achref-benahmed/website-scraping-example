var casper = require('casper').create({
	verbose : true,
	logLevel : 'error',
	pageSettings : {
		loadImages:false,
		loadPlugins:false
	}
});

var fs = require('fs');
var url = 'http://www.keejob.com/offres-emploi/jobs/advanced/results/';
var jobs =[];
var entreprises = [];
var urls = [];

function getUrls (){
	var jobs = document.querySelectorAll('.span8 h6 a');
	return Array.prototype.map.call(jobs,function(e){
		return e.href;
	});
};

function getJobs (){
	var jobs = document.querySelectorAll('.span8 h6 a');
	return Array.prototype.map.call(jobs,function(e){
		return e.innerHTML.trim();
	});
};

function getEntreprises (){
	var jobs = document.querySelectorAll('.span12 a');
	return Array.prototype.map.call(jobs,function(e){
		return e.innerHTML.trim();
	});
};

casper.start(url, function() {
    this.echo(this.getTitle());
});
casper.waitForSelector('.span8 h6 a', function(){
	console.log('selector loaded');
})

casper.then( function() {
	urls= this.evaluate (getUrls);
    jobs= this.evaluate (getJobs);
    entreprises = this.evaluate (getEntreprises);
    this.echo (jobs.length + 'jobs found:' );
    this.echo ('-'+ urls.join('\n -'));
    this.echo ('-'+ jobs.join('\n -'));
//    this.echo (entreprises.length + 'entreprises found:' );
    this.echo ('-'+ entreprises.join('\n -')).exit;
});

casper.run();