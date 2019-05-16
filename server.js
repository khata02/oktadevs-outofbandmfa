// server.js
// where your node app starts

// init project
const request = require('request');
const requirejs = require('requirejs');



//const listener = app.listen(process.env.PORT, function() {
  //console.log('Your app is listening on port ' + listener.address().port);
//});


var userid = function(usernamefromform) {
   var promise = new Promise(function(resolve, reject){

    ////////////promise start////////////////
    var options = { 
		method: 'GET',
  		url: 'https://oktadevs.oktapreview.com/api/v1/users/'+usernamefromform,
		headers: 
		   { 
		     Authorization: 'SSWS 00lNNWJgpmwfS0sLHOHi1FdDvV6JbquH2u072mTwt3',
		     'Content-Type': 'application/json',
		     Accept: 'application/json' 
		 	},
		 json : true
		 };

		request(options, function (error, response, body) {
      if(body.errorCode) {
  			resolve(body.errorCode);
        //console.log(body.errorCode);
        //reject ()
  		}
  		else{
			resolve(body.id);
      //console.log(body.id);
  		}
  		
  	 });
	////////////promise end////////////////
   });
   return promise;
};

var factors = function(userid) {
   var promise = new Promise(function(resolve, reject){

   	////////////promise start////////////////
   	var options = { 
		method: 'GET',
  	url: 'https://oktadevs.oktapreview.com/api/v1/users/'+userid+'/factors',
		headers: 
		   { 
		     Authorization: 'SSWS 00lNNWJgpmwfS0sLHOHi1FdDvV6JbquH2u072mTwt3',
		     'Content-Type': 'application/json',
		     Accept: 'application/json' 
		 	},
		 json : true
		 };

		request(options, function (error, response, body) {
  		if(body.errorCode) {
        resolve(body.errorCode);
        //console.log(body.errorCode);
        //reject ()
      }
      else{

       var factorlist=[];
          for (var i = 0; i < body.length; i++) {
              var factoroptions=body[i];
              var factor = factoroptions.factorType;
              var factorid=factoroptions.id
              //console.log (factor);
              factorlist.push(factor+"@"+factorid)
              }

              factorlistJSON=JSON.stringify(factorlist);

              console.log (factorlistJSON);
              //resolve(factorlist);
      }
      
     });
	 ////////////promise end////////////////
   });
   return promise;
};



var user = "Tarek.khaled@oktadevs.com"

userid(user)
  // .then( function(result){console.log(result);}). to show result of function response / resolve
  .then(factors)
    .then( function(result){console.log(result);})
  .catch ( function(errr) { console.log(l)}) 
   








