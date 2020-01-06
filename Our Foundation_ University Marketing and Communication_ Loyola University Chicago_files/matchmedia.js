/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license 
Symmetri - look for updates here guys: https://github.com/paulirish/matchMedia.js */

window.matchMedia = window.matchMedia || (function(doc, undefined){
// ----------------------------------------------------------
// A short snippet for detecting versions of IE in JavaScript
// without resorting to user-agent sniffing
// ----------------------------------------------------------
// If you're not in IE (or IE version is less than 5) then:
// ie === undefined
// If you're in IE (>=5) then you can determine which version:
// ie === 7; // IE7
// Thus, to detect IE:
// if (ie) {}
// And to detect the version:
// ie === 6 // IE6
// ie > 7 // IE8, IE9 ...
// ie < 9 // Anything less than IE9
// ----------------------------------------------------------

// UPDATE: Now using Live NodeList idea from @jdalton

var ie = (function(){

    var undef,
	v = 3,
	div = document.createElement('div'),
	all = div.getElementsByTagName('i');

    while (
	div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	all[0]
    );

    return v > 4 ? v : undef;

}());

  var bool,
      docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');
  
  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  //fakeBody.style.background = "none!important";
  fakeBody.appendChild(div);
  
  return function(q){
	if(ie){
		if(ie < 8){
		    return { matches: false, media: q, ie: ie };
		}
	}    
    div.innerHTML = '­<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';
    
    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth == 42;  
    docElem.removeChild(fakeBody);
    
    return { matches: bool, media: q, ie: ie };
  };
  
})(document);
