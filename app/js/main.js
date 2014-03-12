(function() {
	var lang = 'fr';
	var mainMediator = new Mediator();

	mainMediator.subscribe( 'templating-end', function() {LazyShow.init();});
	

	var templatedElements =  $(".templatedElement");
	var nbElemsToTemplate = templatedElements.length
	  , nbElemsTemplated = 0;

	templatedElements.each(function(i, elem) {
		var $elem = $(elem);
		var templateId = $elem.data('template-id');

		TemplateLoader.getTemplate(templateId).then(function(template) {
			TemplateLoader.getResources(templateId, lang).then(function(context) {
				$elem.html(template(context));
				nbElemsTemplated++;
				console.debug('Elements templated', nbElemsTemplated);
				if (nbElemsTemplated === nbElemsToTemplate) {
					console.debug('Publish "templating-end" event'); 
					mainMediator.publish('templating-end');
				}
			});
		});
	});
	skrollr.init({
		mobileCheck: function() {
			return false;
		},
		forceHeight: false
	});
}());

