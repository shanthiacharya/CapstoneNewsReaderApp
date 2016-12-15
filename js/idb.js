
var indexedDBHelper = function(){
    var db=null;
    var lastIndex=0;

    var open = function(){
        var version = 1;

        var promise = new Promise(function(resolve, reject){
            //Opening the DB
            var request = indexedDB.open("NewsReaderData", version);

            //Handling onupgradeneeded
            //Will be called if the database is new or the version is modified
            request.onupgradeneeded = function(e) {
                db = e.target.result;

                e.target.transaction.onerror = indexedDB.onerror;

                //Deleting DB if already exists
                if(db.objectStoreNames.contains("NewsItems")) {
                    db.deleteObjectStore("NewsItems");
                }

                //Creating a new DB store with a paecified key property
                var store = db.createObjectStore("NewsItems",
                    {keyPath: "id"});
            };

            //If opening DB succeeds
            request.onsuccess = function(e) {
                db = e.target.result;
                console.log("success" + db);
                resolve();
            };

            //If DB couldn't be opened for some reason
            request.onerror = function(e){
                reject("Couldn't open DB");
            };
        });
        return promise;
    };

    var addnewsitem = function(caption,description) {
        //Creating a transaction object to perform read-write operations
        var trans = db.transaction(["NewsItems"], "readwrite");
        var store = trans.objectStore("NewsItems");
        lastIndex++;

        //Wrapping logic inside a promise
        var promise = new Promise(function(resolve, reject){

          //alert ( "id: " + lastIndex + "departure: " + departure + "arrival:" + arrival);
            //Sending a request to add an item
            //
            var request = store.put({
                 "id": lastIndex,
                "caption": caption,
                "description": description,
            });

            //success callback
            request.onsuccess = function(e) {
                resolve();
            };

            //error callback
            request.onerror = function(e) {
                console.log(e.value);
                reject("Couldn't add the passed item");
            };
        });

        return promise;
    };

// Match for selected station
var retreivenewsitem = function(id,caption) {
    var newsitemArr = [];

    //Creating a transaction object to perform Read/Write operations
    var trans = db.transaction(["NewsItems"], "readwrite");

    //Getting a reference of the todo store
    var store = trans.objectStore("NewsItems");

    //Wrapping all the logic inside a promise
    var promise = new Promise(function(resolve, reject){
        //Opening a cursor to fetch items from lower bound in the DB
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);

        //success callback
        cursorRequest.onsuccess = function(e) {
            var result = e.target.result;


            //Resolving the promise with todo items when the result id empty
            if(result === null || result === undefined){
                resolve(gtfsstationArr);
            }
            //print key values
            else{
              alert (result.value.id  + " " + result.value.caption)
              // for(var field in result.value) {
              //   // console.log(field+"="+result.value[field]);
              //
              // }
                result.continue();
            }
        };

        //Error callback
        cursorRequest.onerror = function(e){
            reject("Couldn't fetch items from the DB");
        };
    });
    return promise;
};







    var getAllnewsitems = function() {
        var newsitemArr = [];

        //Creating a transaction object to perform Read/Write operations
        var trans = db.transaction(["NewsItems"], "readwrite");

        //Getting a reference of the todo store
        var store = trans.objectStore("NewsItems");

        //Wrapping all the logic inside a promise
        var promise = new Promise(function(resolve, reject){
            //Opening a cursor to fetch items from lower bound in the DB
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            //success callback
            cursorRequest.onsuccess = function(e) {
                var result = e.target.result;

                //Resolving the promise with todo items when the result id empty
                if(result === null || result === undefined){
                    resolve(gtfsstationArr);
                }
                //Pushing result into the todo list
                else{
                    newsitemArr.push(result.value);
                    if(result.value.id > lastIndex){
                        lastIndex=result.value.id;
                    }
                    result.continue();
                }
            };

            //Error callback
            cursorRequest.onerror = function(e){
                reject("Couldn't fetch items from the DB");
            };
        });
        return promise;
    };

    var deletenewsitem = function(id) {

        var promise = new Promise(function(resolve, reject){
            var trans = db.transaction(["NewsItems"], "readwrite");
            var store = trans.objectStore("NewsItems");
            var request = store.delete(id);

            request.onsuccess = function(e) {
                resolve();
            };

            request.onerror = function(e) {
                console.log(e);
                reject("Couldn't delete the item");
            };
        });
        return promise;
    };

    return{
        open: open,
        addnewsitem: addnewsitem,
        retreivenewsitem:retreivenewsitem,
        getAllnewsitems: getAllnewsitems,
        deletenewsitem: deletenewsitem
    };

}();
