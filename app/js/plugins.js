var Mediator = ( function( window, undefined ) {
    function Mediator() {
        this._topics = {};
    }

    Mediator.prototype.subscribe = function mediatorSubscribe( topic, callback ) {
        if( ! this._topics.hasOwnProperty( topic ) ) {
            this._topics[ topic ] = [];
        }

        this._topics[ topic ].push( callback );
        return true;
    };

    Mediator.prototype.unsubscribe = function mediatorUnsubscrive( topic, callback ) {
        if( ! this._topics.hasOwnProperty( topic ) ) {
            return false;
        }

        for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
            if( this._topics[ topic ][ i ] === callback ) {
                this._topics[ topic ].splice( i, 1 );
                return true;
            }
        }

        return false;
    };

    Mediator.prototype.publish = function mediatorPublish() {
        var args = Array.prototype.slice.call( arguments );
        var topic = args.shift();

        if( ! this._topics.hasOwnProperty( topic ) ) {
            return false;
        }

        for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
            this._topics[ topic ][ i ].apply( undefined, args );
        }
        return true;
    };

    return Mediator;

}(window));


var TemplateLoader = (function() {
    var defaultSuffix = '.html';
    var templateLoader = {};
    
    templateLoader.load = function(lang) {

        var templatedElements =  $(".templatedElement");

        var nbElemsToTemplate = templatedElements.length
          , nbElemsTemplated = 0;

        templatedElements.each(function(i, elem) {
            var $elem = $(elem);
            $elem.removeClass('lazyShowed');
            $elem.addClass('lazyShow');

            var templateId = $elem.data('template-id');

            getTemplate(templateId).then(function(template) {
                getResources(templateId, lang).then(function(context) {
                    $elem.html(template(context));
                    nbElemsTemplated++;
                    console.debug('Elements templated', nbElemsTemplated);
                    if (nbElemsTemplated === nbElemsToTemplate) {
                        console.debug('Publish "templating-end" event'); 
                        Globals.MAIN_MEDIATOR.publish('templating-end');
                    }
                });
            });
        });
    };

    var getTemplate = function(templateName, suffix) {

        var request = new XMLHttpRequest();
        var deferred = Q.defer();

        var onload = function() {
            if (request.status === 200) {
                var template = Handlebars.compile(request.responseText);
                deferred.resolve(template);
            } else {
                deferred.reject(new Error("Status code was " + request.status));
            }
        };

        var onerror = function() {
            deferred.reject(new Error("Can't XHR " + JSON.stringify(url)));
        };

        var onprogress = function(event) {
            deferred.notify(event.loaded / event.total);
        };

        var extension = suffix ? suffix : defaultSuffix;
        request.open('GET', 'partials/templates/' + templateName + extension, true);
        request.setRequestHeader('Accept','text/html');
        request.onload = onload;
        request.onerror = onerror;
        request.onprogress = onprogress;
        request.send();
        
        return deferred.promise;
    };

    var getResources = function(name, lang) {
        var request = new XMLHttpRequest();
        var deferred = Q.defer();

        var onload = function() {
            if (request.status === 200) {
                deferred.resolve(JSON.parse(request.responseText));
            } else {
                deferred.reject(new Error("Status code was " + request.status));
            }
        };

        var onerror = function() {
            deferred.reject(new Error("Can't XHR " + JSON.stringify(url)));
        };

        var onprogress = function(event) {
            deferred.notify(event.loaded / event.total);
        };

        var url = 'partials/resources/' + lang + '/' + name + '.json';
        request.open('GET', url, true);
        request.setRequestHeader('Accept','application/json');
        request.onload = onload;
        request.onerror = onerror;
        request.onprogress = onprogress;
        request.send();
        
        return deferred.promise;
    };

    

    return templateLoader;
}());


var LazyShow = (function(window) {
    var lazyShow = {};

    var addEventListener = function(evt, fn){
        window.addEventListener ? 
        this.addEventListener(evt, fn, false) : 
        (window.attachEvent) ? this.attachEvent('on' + evt, fn) : this['on' + evt] = fn;
    }
    , _has = function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    };

    function elementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top    >= 0
            && rect.left   >= 0
            && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
            );
    }

    var elems = new Array()
    , processScroll = function() {
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            if (elementInViewport(elem)) {
                console.debug('Is in view Show ', elem);
                elem.classList.remove('lazyShow');
                elem.classList.add('lazyShowed');
            }
        }
    };
    lazyShow.init = function() {
        console.debug("initialize lazyShow!");
        $('.lazyShow').each(function(i, elem) {
            elems.push(elem);
        });
        processScroll();
        addEventListener('scroll',processScroll);      
    };
    
    return lazyShow;

}(this));




var CookiesManager = (function() {
    var cookiesManager = {};
    
    cookiesManager.setCookie = function(cName, cValue, cExpiredays, cPath, cDomain) {
        var cExdate = new Date();
        cExdate.setDate(cExdate.getDate() + cExpiredays);
        // document.cookie = cName + "=" +escape(cValue)+((cExpiredays==null) ? "" : ";expires="+c_exdate.toUTCString()) +"; path="+ cPath +"; domain="+ cDomain;
        document.cookie = cName + "=" +escape(cValue)+((cExpiredays==null) ? "" : ";expires="+cExdate.toUTCString());
    };

    cookiesManager.getCookie = function(tag) {
        var value = null
        var myCookie = document.cookie + ";"
        var findTag = tag + "="
        var endPos
        if (myCookie.length > 0) {
            var beginPos = myCookie.indexOf(findTag)
            if (beginPos != -1) {
                beginPos = beginPos + findTag.length
                endPos = myCookie.indexOf(";",beginPos)
                if (endPos == -1)
                    endPos = myCookie.length
                value = unescape(myCookie.substring(beginPos,endPos))
            }
        }
        return value
    };

    cookiesManager.deleteCookie = function(cookie) {
        var yesterday = 24 * 60 * 60 * 1000
        var expireDate = new Date()
        expireDate.setTime (expireDate.getTime() - yesterday)
        document.cookie =cookie + "=" + escape("nothing") + ";" + "expires" + "=" + expireDate.toGMTString()
    };

    return cookiesManager;
}());

var MultiLanguages = (function() {
    var multiLanguages = {};

    $(document).on('click', 'a.flagAddon', function() {
        var lang = $(this).data('selectlanguage');
        TemplateLoader.load(lang);
        CookiesManager.setCookie('lang', lang, 10);
    });
}());

(function($){
    $.smootScroll = function(el, options){
        var base = this;
        
        base.$el = $(el);
        base.el = el;
        
        base.$el.data("smootScroll", base);
        
        base.init = function(){
            base.options = $.extend({},$.smootScroll.defaultOptions, options);
            base.$el.on('click', 'a[href*=#]:not([href=#])', scroll);
        };
        var scroll = function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
              if (target.length) {
                $('html,body').animate({
                  scrollTop: target.offset().top
                }, 
                base.options.duration, 
                base.options.easing);
                return false;
              }
            }
        };
        
        base.init();
    };
    
    
    $.smootScroll.defaultOptions = {
        duration: 1000,
        easing: 'swing'
    };

    $.fn.smootScroll = function(options){
        return this.each(function(){
            (new $.smootScroll(this, options));
        });
    };
    
})(jQuery);








// Avoid `console` errors in browsers that lack a console.
// Initialize default vars
var Globals = (function() {
    var method;
    var noop = function () {};
    var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    return {
        MAIN_MEDIATOR: new Mediator(),
        AVAILABLE_LANG: ["fr", "en"],
        DEFAULT_LANG: "fr"
    };
}());