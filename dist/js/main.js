'use strict';


var reg;
var sub;
var isSubscribed = false;
var subscribeButton = document.querySelector('#subscribeBtn');
var closeButton = document.querySelector('#closeBtn');

$(document).ready(function(){


  console.log("Document Ready");
  var newsArr =  new Array();


/* Database Stuff */

if("indexedDB" in window) {
        console.log("Indexed DB is supported");
        indexedDBHelper.open().then(function(db) {
        console.log("Success!", db);

        }, function(error) {
          console.error("Failed!", error);
        });

    }

// function fetchNews(saveToDatabase) {
//     getNewsJSONArray().then(function(response) {
//         console.log("Success!", response);
//         newsArr = JSON.parse(response);
//         console.log("Success!", newsArr);
//         displayNewsList(newsArr);
//     }, function(error) {
//       console.error("Failed!", error);
//     });
// }



  if ($("body").data("title") === "newsList") {
    getNewsJSONArray().then(function(response) {
        console.log("Success!", response);
        newsArr = JSON.parse(response);
        console.log("Success!", newsArr);
        displayNewsList(newsArr);
    }, function(error) {
      console.error("Failed!", error);
    });
}
else
    if ($("body").data("title") === "newsListDetail") {
      /* Get news id */
       var newsid = window.location.hash.substring(1);
       console.log("News Id", newsid);
      getNewsDetailJSONArray().then(function(response) {
          console.log("Success!", response);
          newsArr = JSON.parse(response);
          console.log("Success!", newsArr);
          var filterednewsArr = newsArr.filter (function (value) {
                 if(value.id == newsid) {
                     console.log("value same", newsid,value.id);
                     return true
                 } else
                 {
                       console.log("value not same", newsid, value.id);
                       return false;
                 }
               });
          console.log("Success!", filterednewsArr[0].paragraphs);
          displayNewsDetail(filterednewsArr);
      }, function(error) {
        console.error("Failed!", error);
      });
    }


/* get JSON Array for news list */
  function getNewsJSONArray() {
      var url = "./data/newsitems.json";
     // Return a new promise.
     return new Promise(function(resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          resolve(req.response);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };
      // Handle network errors
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      // Make the request
      req.send();
    });
  }

  /* get JSON Array for news detail */
    function getNewsDetailJSONArray() {


        var url = "./data/newsitemdetails.json";
       // Return a new promise.
       return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function() {
          // This is called even on 404 etc
          // so check the status
          if (req.status == 200) {
            // Resolve the promise with the response text
            resolve(req.response);
          }
          else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error
            reject(Error(req.statusText));
          }
        };
        // Handle network errors
        req.onerror = function() {
          reject(Error("Network Error"));
        };
        // Make the request
        req.send();
      });
    }


  /* Handlebar template for news list */
    function displayNewsList(context) {
        // Grab the template script
        var theTemplateScript = $("#news-template").html();
        // Compile the template
        var theTemplate = Handlebars.compile(theTemplateScript);
        // Pass our data to the template
        var theCompiledHtml = theTemplate(context);
        // Add the compiled html to the page
        $('.content-placeholder').html(theCompiledHtml);
    }



    /* Handlebar template for news detail */
      function displayNewsDetail(context) {
          // Grab the template script
          var theTemplateScript = $("#newsdetail-template").html();
          // Compile the template
          var theTemplate = Handlebars.compile(theTemplateScript);
          // Pass our data to the template
          var theCompiledHtml = theTemplate(context);
          // Add the compiled html to the page
          $('.content-placeholder').html(theCompiledHtml);
      }




});

var redirecttoDetailsPage = function(someValue) {
    // Work with that value
    console.log(someValue);
    var obj = someValue;
    console.log("id: " + obj.id )
    window.location.href = "newsdetail.html"+"#" + obj.id;

  // $(location).href ="restuarantdetail.html"
}

function handleEnterKey(e,someValue) {

  // Work with that value
  console.log(someValue);
  var obj = someValue;
  console.log("id: " + obj.id )
    if (e.keyCode == 13){
    window.location.href = "newsdetail.html"+"#" + obj.id;

    }

}

Handlebars.registerHelper('json', function(context) {

  return JSON.stringify(context).replace(/"/g, '&quot;');
});


Handlebars.registerHelper('eachToDisplayProperty', function(context) {
    var ret = "";
    var parsed = JSON.parse(context);
    var arr = [];

    for(var x in parsed){
      arr.push(parsed[x]);
    }
    console.log ("context :" + arr);
    // var subArray =context[0];
    // console.log ("context :" + context[0]);
    // for(var i = 0; i < subArray.length; i++) {
    //   console.log ("Sub Value :" + subArray[i]);
    //       ret = subArray[i];
    // }
    return ret;
});


function getselectedNewsItem() {
  var newsitemid = window.location.hash.substring(1);
  return newsitemid;
}






if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(serviceWorkerRegistration) {
    reg = serviceWorkerRegistration;
    console.log('Service Worker is ready :^)', reg);
    // reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
    //   console.log('endpoint:', sub.endpoint);
    // });
  }).catch(function(error) {
    console.log('Service Worker Error :^(', error);
  });
}
if (subscribeButton) {
  subscribeButton.addEventListener('click', function() {
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  });
}

function subscribe() {
  reg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription){
    sub = pushSubscription;
    console.log('Subscribed! Endpoint:', sub.endpoint);
    // subscribeButton.textContent = 'Unsubscribe';
    subscribeButton.innerHTML = 'Unsubscribe';
    isSubscribed = true;
  });
}

function unsubscribe() {
  sub.unsubscribe().then(function(event) {
    // subscribeButton.textContent = 'Subscribe';
    subscribeButton.innerHTML = 'Subscribe';
    console.log('Unsubscribed!', event);
    isSubscribed = false;
  }).catch(function(error) {
    console.log('Error unsubscribing', error);
    // subscribeButton.textContent = 'Subscribe';
      subscribeButton.innerHTML = 'Subscribe';
  });
}
if (closeButton) {
    closeButton.addEventListener('click', function() {
    console.log('close clicked');
    window.location.href = "index.html";

});
}
