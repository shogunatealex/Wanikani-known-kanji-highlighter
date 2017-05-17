$(document).ready(function() {
        console.log('the DOM is ready');
    });
var testText = $('p:last').text();
//$('div, li, ol, p, h1, h2, h3, h4, h5, span, a, th, td, code, strong, em').css("color", "red");

var textObject = {
  text
}

var DOMlibrary = $('li, p, h1, h2, h3, h4, h5');
console.log(typeof(DOMlibrary));
console.log(DOMlibrary);
var textLibrary = [];
var counter = 0;
DOMlibrary.each(function(item){
  $(this).addClass("wanikani" + counter);
  counter += 1;
  var tempLibrary = $(this).text();
  var splitTempLibrary = tempLibrary.split(" ") //Here will be the split function for JAPANESE
   textLibrary.push($(this).text());
 });

$(".wanikani5").css("color","blue");
$(".wanikani5").children().css("color","blue");

console.log(textLibrary);




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
