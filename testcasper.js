var casper = require('casper').create({
	verbose : true,
	logLevel : 'error',
	pageSettings : {
		loadImages:false,
		loadPlugins:false
	}
});

var fs = require('fs');
var url = 'https://www.jobi.tn/#!/';
var jobs =[];
var entreprises = [];
var currentPage = 1;
var startPage = '';
var page;
var output=[];

function terminate (){
	console.log("that's all").exit;
};

function outputJSON (){

	output.push({
		jobs : jobs,
		entreprises : entreprises
	});
	return JSON.stringify(output);
};

function startPageFn(){
	var startPage=document.querySelector('li.waves-effect.hand.border.p-xs.bg-gray-soft');
	return Array.prototype.map.call(startPage,function(e){
		return e.innerText;
	});
};

function getJobs (){
	var jobs = document.querySelectorAll('.firstchar a');
	return Array.prototype.map.call(jobs,function(e){
		return e.innerHTML;
	});
};
function getEntreprises (){
	var jobs = document.querySelectorAll('a .font-1-2.p-none.firstchar.m-none.hand.hand.font-light.m-b-md.dosis');
	return Array.prototype.map.call(jobs,function(e){
		return e.innerHTML;
	});
};

var processPage = function() {
	
    
    jobs= this.evaluate (getJobs);
    entreprises = this.evaluate (getEntreprises);
    casper.wait(1000,function(){
        	console.log("waited 1 sec");
        });
 	//this.echo (jobs.length + 'jobs found:' );
    this.echo ('-'+ jobs.join('\n -'));
    //this.echo (entreprises.length + 'entreprises found:' );
    this.echo ('-'+ entreprises.join('\n -'));
    
      var data = outputJSON();
	fs.write ('data.json', data, "w");
	this.echo('\n exec terminated');
       
       

    // don't go too far down the rabbit hole
    if (currentPage >= 3 || !this.exists(".firstchar")) {
        return terminate.call(casper);
    }

    currentPage++;
    this.echo("requesting next page: " + currentPage);
    casper.waitForSelector('a.waves-effect.waves-teal.btn-flat i');

    this.thenClick("a.waves-effect.waves-teal.btn-flat i").then(function() {
    	casper.wait(2000,function(){
        	console.log("waited 1 sec");
        });
        this.waitFor(function() {
            return startPage != 1;
        }, processPage, terminate);
    });
};


casper.start(url, function() {
    this.echo(this.getTitle());
});
casper.then(function(){
	startPage=this.evaluate(startPageFn);
});
casper.waitForSelector('a.waves-effect.waves-teal.btn-flat i');

casper.waitForSelector('.firstchar', processPage,terminate);



casper.then( function() {
    
    page = this.evaluate (processPage);

   
});

casper.run(function(){

});