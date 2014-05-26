(function() {
	var getParamValue = function(param) {
		var u = document.location.href;
		var reg = new RegExp('(\\?|&|^)'+ param +'=(.*?)(&|$)');
		matches = u.match(reg);
		return (matches && matches[2] != undefined) ? decodeURIComponent(matches[2]).replace(/\+/g,' ') : null;
	};


	Handlebars.registerHelper('technologies', function(experiences, options) {
	  var ret = "<ul>";
	  for(var i = 0, j = experiences.length; i < j; i++) {
	  	var experience = experiences[i];
	  	var highlightIds = experience.highlightIds;
	  	if (highlightIds) ret = ret + "<li class=\"highlightable\" data-highlightids=\"" + highlightIds + "\">";
	  	else ret = ret + "<li>"
	    ret = ret + options.fn(experience) + "</li>";
	  }

	  return ret + "</ul>";
	});
	
	// TEST
	if (!Modernizr.touch) {
		$('#header').on('click', 'a#contact', function() {
			$('footer').addClass('peep');
			setTimeout(function() {
				$('footer').removeClass('peep');
			});
		});
	}
	// /TEST


	Globals.MAIN_MEDIATOR.subscribe( 'templating-end', 
		function() {
			LazyShow.init();
			if (!Modernizr.touch) {
				$("#section2").highlight();
			}
	});
	

	var lang = getParamValue('lang') || CookiesManager.getCookie('lang') || Globals.DEFAULT_LANG;
	if (Globals.AVAILABLE_LANG.indexOf(lang) == -1) lang =Globals.DEFAULT_LANG;

	TemplateLoader.load(lang);
	$("#hero, header").smoothScroll({offset: 20});

}());

