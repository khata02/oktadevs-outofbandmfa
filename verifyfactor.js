// server.js
// where your node app starts

// init project
const request = require('request');
const requirejs = require('requirejs');
const APIKEY  = 'SSWS 00lNNWJgpmwfS0sLHOHi1FdDvV6JbquH2u072mTwt3'; //from .env file

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

var callfactor = function(promiseElement) {
   var promise = new Promise(function(resolve, reject){
    ////////////promise start////////////////
    var options = { 
    method: 'POST',
      url: 'https://oktadevs.oktapreview.com/api/v1/users/'+promiseElement.userid+'/factors/'+promiseElement.factorid+'/verify', //from .env https://oktadevs.oktapreview.com
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
      promiseElement.body=body
      resolve(promiseElement)

      }
     });
  ////////////promise end////////////////
   })
   return promise;
}

var pollfactor =  function(promiseElement) {
  
  ////////////promise start////////////////
  var promise = new Promise(async function(resolve, reject){
  ////////////promise body////////////////
  
    console.log (promiseElement)
      ////////////switch star////////////////
          switch (promiseElement.factortype){
            case 'push':
                var options = { 
                  method: 'GET',
                  url: promiseElement.body._links.poll.href ,
                  headers: 
                     { 
                       Authorization: APIKEY ,
                       'Content-Type': 'application/json',
                       Accept: 'application/json' 
                      },
                  json:true
                }

                for(attempt=0;attempt<7;attempt++){
                    console.log (attempt)
                    await sleep(3000)
                      request(options, function (error, response, body) {
                          if(body.errorCode) {
                            console.log (error)
                            resolve (body.errorCode)
                          }
                          else{
                            promiseElement.pollstatus=body.factorResult
                            }
                        })
                }
                resolve (promiseElement)
                break;
            
            case 'sms':
              var options = { 
              method: 'POST',
              url: 'https://oktadevs.oktapreview.com/api/v1/users/'+promiseElement.userid+'/factors/'+promiseElement.factorid+'/verify', //from .env https://oktadevs.oktapreview.com
              headers: 
                { 
                  Authorization: APIKEY ,
                  'Content-Type': 'application/json',
                  Accept: 'application/json' 
                },
              body: { passCode: promiseElement.smscode },
              json : true
              }

              request(options, function (error, response, body) {
                  if(body.errorCode) {
                    resolve(body.errorCode)
                  }
                  else{
                    if(!body.factorResult){
                      promiseElement.pollstatus='ERROR'
                      resolve(promiseElement)
                    }
                    else{
                      promiseElement.pollstatus=body.factorResult
                      resolve(promiseElement)
                    }

                  }
              })
              break;
          

              default:
              console.log("Factor Not Valid")

          }
        ////////////switch end////////////////
    ////////////promise body////////////////
   })
  ////////////promise end////////////////
   return promise;
}


var factortype='push' //from client side form
var userid="00udqjj5o52mYb5Ke0h7" //from getuserfactors
var smscode ='' //from flient side form
var promiseElement ={}

switch (factortype){

case 'push':
  factorid = "opfkvk10nmDcCiVZC0h7" //from getfactors.js
  promiseElement.userid=userid
  promiseElement.factorid=factorid
  promiseElement.factortype=factortype
  callfactor(promiseElement)
  .then(pollfactor)
  .then(function(promiseElement){

          switch(promiseElement.pollstatus) {
          case "WAITING":
          //console.log(promiseElement)
          console.log ("STILL WAITING")
          break;
          case "TIMEOUT":
          //console.log(promiseElement)
          console.log ("TIMEOUT")
          break;

          case "SUCCESS":
          //console.log(promiseElement)
          console.log ("SUCCESS")
          break;

          case "REJECTED":
          //console.log(promiseElement)
          console.log ("REJECTED")
          break;
          
          default:
          //console.log(promiseElement)
          console.log("SOMETHING ELSE")
        }  
    })
break;

case 'sms':
  factorid = "smseu4hefzqRv5zbX0h7" //from getfactors.js
  promiseElement.userid=userid 
  promiseElement.factorid=factorid
  promiseElement.factortype=factortype
  promiseElement.smscode= smscode

  if(!smscode){
    callfactor(promiseElement)
    console.log('code not recieved from UI')
    break;
  }
  else{
  pollfactor(promiseElement)
  .then(function(promiseElement){
    if(promiseElement.pollstatus=='SUCCESS'){
      console.log('SUCCESS')
    }
    else
      console.log('ERROR')
    })

  }
break;

default:
console.log("no factor selected")

}










