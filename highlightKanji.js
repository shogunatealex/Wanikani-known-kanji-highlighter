$(document).ready(function() {
        console.log('the DOM is ready');
    });
var testText = $('p:last').text();
//$('div, li, ol, p, h1, h2, h3, h4, h5, span, a, th, td, code, strong, em').css("color", "red");


chrome.storage.sync.get("storage-initial", function(){
      console.log("Storage value initialized");
    });




// gets the vocab tree and stores it if it hasn't already been stored
function callWanikani (callback){
  var vocabList = [];
  // pull the storage initializer from storage
  chrome.storage.sync.get("storage-initial",function(storage){
    // if no vocabulary dictionary has been saved, start saving it.
    if(storage["storage-initial"] == 0){
      // call the wanikani server to get the users vocab list up to their level
      $.getJSON("https://www.wanikani.com/api/user/4a5d0dbcc23712212e7684fe99935275/kanji", function(data){
        console.log(data);
        // console.log(data.requested_information.general);
        // take each item and strip it to its CHARACTER and SRS level
        $.each(data.requested_information,function(index){
          var char = data.requested_information[index].character;
          var hasData = data.requested_information[index].user_specific;
          // checks if user hasn't seen the word yet. In that case can't call user_specific as it is Null
          if(!hasData){
            console.log("here");
          }
          //push to vocab list
          vocabList.push({character: data.requested_information[index].character,
                          srs:  !hasData? "null" : hasData.srs});
        });
        // call to function that sves this data.
        console.log("Length is" + vocabList.length);
        callback(vocabList);
      });

      //tells the console that it doesn't need to keep reloading the library from wanikani.
      chrome.storage.sync.set({"storage-initial": 1} ,function(){
        console.log("Dictionary should be stored");
      })

    }
    else{
      console.log(storage);
      console.log("Already stored");
      callback(vocabList);
    }
  console.log(vocabList);
  });
}

function saveData(vocabList, callback){
  // will receive this only if the data doesn't need to be saved
  if(vocabList.length == 0){
    console.log("data not saved");
    // move on to searching the data
    callback();
  }
  else{
    // save the data locally as sync doesn't have enough space
    chrome.storage.local.set({"vocabulary-list" : vocabList}, function(){
      console.log("Data saved");
    });
    callback();
  }
}



function searchData () {
  // retrieve the data saved locally
  chrome.storage.local.get("vocabulary-list", function(tree){
    console.log(tree);
    console.log("hello" == "hello");
    var specificTree = tree["vocabulary-list"].filter(function(v){
      return v["character"] == "食べる";
    })
    console.log(specificTree);
    // grab all of the html pages text
    var DOMlibrary = $('span, ul, p, h1, h2, h3, h4, h5');
    console.log(typeof(DOMlibrary));
    console.log(DOMlibrary);
    var textLibrary = [];
    var counter = 0;
    var textObjectArray = []
    DOMlibrary.each(function(item){
      var uniqueClass = "wanikani" + counter;
      $(this).addClass(uniqueClass);
      // takes DOM object and grabs it's text
      var tempLibrary = $(this).text();
      // splits that text up into words (right now splits by every character)
      var splitTempLibrary = tempLibrary.split(''); //Here will be the split function for JAPANESE
      // push these objects into an array that holds each text item and it's element
      for(var i = 0; i < splitTempLibrary.length; i++){
        // cleans strings of punctuation
        var toPush = splitTempLibrary[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\n\r、]/g,"");
        if (toPush == "" || (toPush.toLowerCase() != toPush.toUpperCase()) || toPush == " "){

        }
        else{
          console.log(toPush);
          textObjectArray.push({text: toPush, class: uniqueClass});
        }
        // should be replaced with Red-black tree
      }
      textLibrary.push($(this).text());
      counter += 1;
     });
     console.log(textObjectArray);
     tree["vocabulary-list"].forEach(function(word){
       var temp = textObjectArray.filter(function(v){
         return v["text"] == word.character;
       })
       if(temp.length > 0){
         console.log("something here");
         //console.log(temp);
         temp.forEach(function(match){

           var currentElement = $("." + match.class);
           //console.log(match.text);
           var tempText = currentElement.text();
           tempText = tempText.replace(match.text,"<span style=\"color:blue\">" + match.text + "</span>");
           //console.log(tempText);
           if(currentElement.is('li')){
             currentElement.children().html(tempText);
           }
           else{
             currentElement.html(tempText);
           }
           // changes their overarching classes to blue;

            //$("." + match.class).css("color","blue");
            //$("." + match.class).children().css("color","blue");
           //console.log($("." + match.class));
         })
       }
       else{
         console.log("nothing here");
       }
     })
    // var objects = textObjectArray.filter(function(v){
    //   // grabs all objects with text of japanese
    //   return v["text"].toLowerCase() == "journey";
    // });


  })
};


callWanikani(function(x){
  saveData(x,function(){
    searchData();
  })
});







//https://www.wanikani.com/api/user/4a5d0dbcc23712212e7684fe99935275/vocabulary/1
//console.log(objects);

 //console.log(textObjectArray);






// console.log(textLibrary);
// var seperatedTextLibrary = [];
// textLibrary.forEach(function(item){
//   var temp = item.split(" ");
//   for(var i = 0; i < temp.length; i++){
//     if(temp[i] == "" || temp[i] == " "){
//
//     }
//     else{
//       seperatedTextLibrary.push(temp[i].toUpperCase());
//     }
//   }
// });
// if(seperatedTextLibrary.indexOf("JAPANESE".toUpperCase()) > -1){
//   console.log("here");
// }
// console.log(seperatedTextLibrary);
// var newTextLibrary = textLibrary.split(" ");
// var x = 0;
// console.log("\n\n\n");
// console.log(newTextLibrary);
// newTextLibrary.forEach(function(library){
//   var temp = library.split(" ");
//   for(var i = 0; i < temp.length; i++){
//     x += 1;
//     console.log(x);
//   }
// });
//console.log(textLibrary);
