$(window).bind("load", function() {
  callWanikani(function(x){
    saveData(x,function(){
      searchData();
    })
  });
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
    //console.log(tree);
    //console.log("hello" == "hello");
    // grab all of the html pages text
    var DOMlibrary = $('tr, td, ruby, span, p, h1, h2, h3, h4, h5, a');
    var temp = $('body').find("*").contents().each(function(){
      if(this.nodeType == 3){
        var u = this.nodeValue;
        var tempU = "";
        console.log(u);
        for(var i = 0; i < u.length; i++){
          //console.log(u[i] + " " + i);
          //u[i] = u[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\n\r、1234567890?)(,}{})]/g,"");
          var checker = ["[", "]", "(", ")", ".", ",", ";", "}", "{", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0","#", "<", ":", "=", "!", "-", "_", "&", "@", "\"", "\'"];
          if(u[i] == "" || (u[i].toLowerCase() != u[i].toUpperCase()) || u[i] == " " || checker.indexOf(u[i]) > -1){
            tempU+= u[i];
          }
          else{
          //console.log(u[i]);
            //console.log(u[i]);
            var specificTree = tree["vocabulary-list"].filter(function(v){
              return v["character"] == u[i].toString();
            }); // end function
            if(specificTree.length > 0){
              var replace = new RegExp(specificTree[0].character.toString(), "g");
              //$(this).replaceWith(u.replace(replace,'|'));
              var color;
              if(specificTree[0].srs.toString() == "apprentice"){
                color = "#F300A2";
              }
              else if(specificTree[0].srs.toString() == "guru"){
                color ="#9F34B9";
              }
              else if(specificTree[0].srs.toString() == "master"){
                color = "#4765E0";
              }
              else if(specificTree[0].srs.toString() == "enlightened"){
                color ="#009CEA";
              }
              else if(specificTree[0].srs.toString() == "burned"){
                color = "#B04A49";
              }
              tempU += '<span style=\"color:' + color + '; padding:0; margin: 0; display: inline\">' + specificTree[0].character + '</span>';
              //$(this).replaceWith(tempU.replace(replace,'<span style=\"color:blue; padding:0; margin: 0; display: inline\">' + specificTree[0].character + '</span>'));
              //console.log(u.length);
            }
            else{
              tempU+=u[i];
            }

          } // end else
        } // end for
        $(this).replaceWith(tempU);
        //console.log(tempU);
      }
    })
    // console.log(temp);
    // var reg = /_link_/g;
    //
    // //temp[5].replaceWith(temp[5].nodeValue.replace("一", "<span>here</span>"));
    // console.log(temp);
    // var temp2 = $('li');
    //
    // console.log(temp2.contents());
    //
    // //DOMlibrary += $('li').children();
    // console.log(DOMlibrary);
    // // link through grabbing all their text
    // var textObjectArray = [];
    // var inTag = 0;
    // for (var i = 0; i < DOMlibrary.length; i++){
    //   var arrayIndex = i;
    //   var splitTempLibrary = DOMlibrary[i.toString()].innerHTML.split("");
    //   //DOMlibrary[i.toString()].innerHTML = DOMlibrary[i.toString()].innerHTML.replace("昨日", "<span style=\"color:blue\">replaced</span>");
    //
    //   //console.log(DOMlibrary[i.toString()].textContent);
    //   //console.log(DOMlibrary[i.toString()].innerHTML);
    //   //console.log(DOMlibrary[i.toString()].nodeName);
    //
    //   for(var j = 0; j < splitTempLibrary.length; j++){
    //     // cleans strings of punctuation
    //     var toPush = splitTempLibrary[j].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\n\r、]/g,"");
    //     if (toPush == "" || (toPush.toLowerCase() != toPush.toUpperCase()) || toPush == " "){
    //
    //     } // end if
    //     else if (toPush == ">"){
    //       inTag = 0;
    //     }
    //     else if (inTag == 1){
    //
    //     }
    //     else if (toPush == "<"){
    //         inTag = 1;
    //     }
    //     else{
    //
    //       var specificTree = tree["vocabulary-list"].filter(function(v){
    //         return v["character"] == toPush.toString();
    //       })
    //       if(specificTree.length > 0){
    //         //console.log(DOMlibrary);
    //         var color;
    //         if(specificTree[0].srs.toString() == "apprentice"){
    //           color = "#F300A2";
    //         }
    //         else if(specificTree[0].srs.toString() == "guru"){
    //           color ="#9F34B9";
    //         }
    //         else if(specificTree[0].srs.toString() == "master"){
    //           color = "#4765E0";
    //         }
    //         else if(specificTree[0].srs.toString() == "enlightened"){
    //           color ="#009CEA";
    //         }
    //         else if(specificTree[0].srs.toString() == "burned"){
    //           color = "#B04A49";
    //         }
    //         var replace = new RegExp(specificTree[0].character.toString(), "g");
    //         //DOMlibrary[i].innerHTML = DOMlibrary[i].innerHTML.replace(replace, "<span style=\"color: " + color + ";padding:0; margin: 0; display: inline\">" + specificTree[0].character + "</span>");
    //         //DOMlibrary[i].contents().filter(function(){return this.nodeType == 3;})[0].nodeValue = DOMlibrary[i].contents().filter(function(){return this.nodeType == 3;})[0].nodeValue.replace(replace, "<span style=\"color: " + color + ";padding:0; margin: 0; display: inline\">" + specificTree[0].character + "</span>");
    //
    //       }
    //       textObjectArray.push({text: toPush, DOMposition: arrayIndex});
    //     } // end else
    //     // should be replaced with Red-black tree
    //   } // end for j
    // } // end for i
    //
    // var counter = 0;





    // var objects = textObjectArray.filter(function(v){
    //   // grabs all objects with text of japanese
    //   return v["text"].toLowerCase() == "journey";
    // });


  }) // end chrome.storage.get
}; //end search data










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
