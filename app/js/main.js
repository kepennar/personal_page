(function() {
    var lang = 'fr';

	$(".templatedElement").each(function(i, elem) {
		var $elem = $(elem);
		var templateId = $elem.data('template-id');

		templateLoader.getTemplate(templateId).then(function(template) {
	    	templateLoader.getResources(templateId, lang).then(function(context) {
	    		$elem.html(template(context));	
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

