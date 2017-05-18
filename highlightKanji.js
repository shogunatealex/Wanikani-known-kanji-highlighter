$(document).ready(function() {
        console.log('the DOM is ready');
    });
var testText = $('p:last').text();
//$('div, li, ol, p, h1, h2, h3, h4, h5, span, a, th, td, code, strong, em').css("color", "red");


var DOMlibrary = $('li, p, h1, h2, h3, h4, h5');
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
  // splits that text up into words
  var splitTempLibrary = tempLibrary.split(" "); //Here will be the split function for JAPANESE
  // push these objects into an array that holds each text item and it's element
  for(var i = 0; i < splitTempLibrary.length; i++){
    // cleans strings of punctuation
    var toPush = splitTempLibrary[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    // should be replaced with Red-black tree
    textObjectArray.push({text: toPush, class: uniqueClass});
  }
  textLibrary.push($(this).text());
  counter += 1;
 });

var objects = textObjectArray.filter(function(v){
  // grabs all objects with text of japanese
  return v["text"].toLowerCase() == "journey";
});
objects.forEach(function(match){

  var currentElement = $("." + match.class);
  console.log(match.text);
  var tempText = currentElement.text();
  tempText = tempText.replace(match.text,"<span style=\"color:blue\">" + match.text + "</span>");
  console.log(tempText);
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

$.getJSON("https://www.wanikani.com/api/user/4a5d0dbcc23712212e7684fe99935275/vocabulary", function(data){
  console.log(data);
  console.log(data.requested_information.general);
  $.each(data.requested_information.general,function(index){
    console.log(data.requested_information.general[index]);
  });
  $.each(data,function(index){
    console.log(data[index]);
  });
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
