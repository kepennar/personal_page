(function() {
	Globals.MAIN_MEDIATOR.subscribe( 'templating-end', function() {LazyShow.init();});
	
	var lang = CookiesManager.getCookie('lang') || Globals.DEFAULT_LANG;
	TemplateLoader.load(lang);

}());

