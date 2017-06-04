var casper = require('casper').create({
	verbose : true,
	logLevel : 'error',
	pageSettings : {
		loadImages:false,
		loadPlugins:false
	}
});

var fs = require('fs');
var url = 'https://tanitjobs.com/search-results-jobs/';
var jobs =[];
var entreprises = [];
var urls = [];

function getUrls (){
	var jobs = document.querySelectorAll('.detail .title_offre');
	return Array.prototype.map.call(jobs,function(e){
		return e.href;
	});
};

function getJobs (){
	var jobs = document.querySelectorAll('.detail .title_offre');
	return Array.prototype.map.call(jobs,function(e){
		return e.innerHTML;
	});
};

function getEntreprises (){
	var jobs = document.querySelectorAll('#companytitle');
	return Array.prototype.map.call(jobs,function(e){
		return e.innerHTML;
	});
};

casper.start(url, function() {
    this.echo(this.getTitle());
});
casper.waitForSelector('.detail .title_offre', function(){
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