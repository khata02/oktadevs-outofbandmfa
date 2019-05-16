// server.js
// where your node app starts

// init project
const request = require('request');
const requirejs = require('requirejs');
const APIKEY  = 'SSWS somekey'; //from .env file

var getuserid = function(promiseElement) {
  ////////////promise start////////////////
   var promise = new Promise(function(resolve, reject){
    
    var options = { 
  		method: 'GET',
    		url: 'https://oktadevs.oktapreview.com/api/v1/users/'+promiseElement.user, //from .env https://oktadevs.oktapreview.com
  		headers: 
  		   { 
  		     Authorization: APIKEY ,
  		     'Content-Type': 'application/json',
  		     Accept: 'application/json' 
  		 	  },
  		    json : true
  	}
		request(options, function (error, response, body) {
      if(body.errorCode) {
  			resolve(body.errorCode);
        //console.log(body.errorCode);
        //reject ()
  		}
  		else{
      promiseElement.id=body.id
			resolve(promiseElement)
      //console.log(body.id);
  		}
  	 })
   })
   ////////////promise end////////////////
   return promise;
}

var getfactors = function(promiseElement) {
  ////////////promise start////////////////
   var promise = new Promise(function(resolve, reject){
   var options = { 
		method: 'GET',
  	url: 'https://oktadevs.oktapreview.com/api/v1/users/'+promiseElement.id+'/factors', //from .env https://oktadevs.oktapreview.com
		headers: 
		   { 
		     Authorization: APIKEY ,
		     'Content-Type': 'application/json',
		     Accept: 'application/json' 
		 	  },
		json : true
	  }
		request(options, function (error, response, body) {
    		if(body.errorCode) {
          resolve(body.errorCode)
        }
        else{
            var returnedfactor={}
            for ( var factor = 0; factor < body.length; factor++) {
                
                returnedfactor.factor=factor
                
                returnedfactor.type=body[factor].factorType
                returnedfactor.factorid = body[factor].id
                promiseElement.returnedfactor=returnedfactor
                resolve(promiseElement)
                console.log(promiseElement)

                }     
        }
     })
   })
   return promise;
   ////////////promise end////////////////
}

var user = "Tarek.khaled@oktadevs.com" //From client side form
var promiseElement = {}

promiseElement.user=user;
getuserid(promiseElement)
.then(getfactors)
.then( function(result){console.log(result);}) 
.catch (function(errr) { console.log(l)}) 
   








