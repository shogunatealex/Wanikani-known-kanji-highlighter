$(document).ready(function() {
        alert('the DOM is ready');
    });
var testText = $('p:last').text();
$('div, li, ol, p, h1, h2, h3, h4, h5, span, a, th, td, code, strong, em').css("color", "red");

var textLibrary = $('li, p, h1, h2, h3, h4, h5, span').text();
console.log(textLibrary);

//console.log(textLibrary);
