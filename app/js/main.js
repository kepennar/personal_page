(function() {
	var getParamValue = function(param) {
		var u = document.location.href;
		var reg = new RegExp('(\\?|&|^)'+ param +'=(.*?)(&|$)');
		matches = u.match(reg);
		return (matches && matches[2] != undefined) ? decodeURIComponent(matches[2]).replace(/\+/g,' ') : null;
	};

	Globals.MAIN_MEDIATOR.subscribe( 'templating-end', 
		function() {
			LazyShow.init();
	});
	
	var lang = getParamValue('lang') || CookiesManager.getCookie('lang') || Globals.DEFAULT_LANG;
	if (Globals.AVAILABLE_LANG.indexOf(lang) == -1) lang =Globals.DEFAULT_LANG;

	TemplateLoader.load(lang);
	$("#hero, header").smootScroll({offset: 20});

}());

