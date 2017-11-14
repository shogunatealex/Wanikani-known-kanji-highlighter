$(document).ready(function() {
  callWanikani(function(x){
    saveData(x,function(){
      searchData();
    })
  });
    });
chrome.storage.sync.get("storage-initial", function(){
      console.log("Storage value initialized");
    });

// gets the vocab tree and stores it if it hasn't already been stored
function callWanikani (callback){
  var vocabList = [];
  // pull the storage initializer from storage
  chrome.storage.sync.get("storage-initial",function(storage){
    // if no vocabulary dictionary has been saved, start saving it.
    storage["storage-initial"] = 1;
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
      chrome.storage.sync.set({"storage-initial": 0} ,function(){
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

// called in function from stackoverflow to find text without disturbing dom
var matchText = function(node, regex, callback, excludeElements) {

    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
    var child;
    if (!node){
      child = null;
    }
    else{
      child = node.firstChild;
    }


    while (child) {
        switch (child.nodeType) {
        case 1:
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
                break;
            matchText(child, regex, callback, excludeElements);
            break;
        case 3:
            var bk = 0;
            child.data.replace(regex, function(all) {
                var args = [].slice.call(arguments),
                    offset = args[args.length - 2],
                    newTextNode = child.splitText(offset+bk), tag;
                bk -= child.data.length + all.length;

                newTextNode.data = newTextNode.data.substr(all.length);
                tag = callback.apply(window, [child].concat(args));
                child.parentNode.insertBefore(tag, newTextNode);
                child = newTextNode;
            });
            regex.lastIndex = 0;
            break;
        }

        child = child.nextSibling;
    }

    return node;
};

function searchData () {
  var apprentice,guru,master,enlighten,burned;
  // Create the start of the regex expression used to replace the known kanji
  apprentice = guru = master = enlighten = burned = "[";

  // grab the list of kanji that we know and have stored in chrome
  chrome.storage.local.get("vocabulary-list", function(tree){
    console.time('matchText');
    // go through list and seperate text out into regex expressions
    for (var x=0; x < tree["vocabulary-list"].length; x++){
      searchTerm = tree["vocabulary-list"][x].character;
      var memorizeLevel = tree["vocabulary-list"][x].srs;
      // gets filtered into different regex expressions, think harry potter
      if(memorizeLevel == "apprentice"){
        apprentice += searchTerm;
      }
      else if (memorizeLevel == "guru"){
        guru += searchTerm;
      }
      else if (memorizeLevel == "master"){
        master+= searchTerm;
      }
      else if (memorizeLevel == "enlighten"){
        enlighten += searchTerm;
      }
      else if (memorizeLevel == "burned"){
        burned += searchTerm;
      }
    } // end for
    // close off regex expression
    apprentice += "]";
    guru += "]";
    master += "]";
    enlighten += "]";
    burned += "]";
    // put these regex expressions into array to go through
    var kanjiList = [apprentice, guru, master, enlighten, burned];
    // go through each level and run a regex replace on it
    for(var i = 0; i < kanjiList.length; i++){
      matchText(document.getElementsByTagName("body")[0], new RegExp(kanjiList[i], "g"), function(node, match, offset) {
          var span = document.createElement("span");
          // give the replace kanji the appropriate color
          if(i==0){
            span.className = "wanikani-apprentice";
          }
          else if (i==1){
            span.className = "wanikani-guru";
          }
          else if (i==2){
            span.className = "wanikani-master";
          }
          else if (i==3){
            span.className = "wanikani-enlighten";
          }
          else if (i==4){
            span.className = "wanikani-burned";
          }

          span.textContent = match;
          return span;
      }); // end matchText
    } // end for
    console.timeEnd('matchText');
  }); //end chrome.storage.get
} // end searchData
