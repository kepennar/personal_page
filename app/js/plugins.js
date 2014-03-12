// Avoid `console` errors in browsers that lack a console.
(function() {
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
}());


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
    
    templateLoader.getTemplate = function(templateName, suffix) {

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

    templateLoader.getResources = function(name, lang) {
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

    var $q = function(q, res) {
        if (document.querySelectorAll) {
            res = document.querySelectorAll(q);
        } else {
            var d = document
            , a = d.styleSheets[0] || d.createStyleSheet();
            a.addRule(q,'f:b');
            for (var l = d.all, b = 0, c = [], f = l.length; b < f; b++) {
                l[b].currentStyle.f && c.push(l[b]);
            }
            a.removeRule(0);
            res = c;
        }
        return res;
    }
    , addEventListener = function(evt, fn){
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
    , query = $q('.lazyShow')
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
        for (var i = 0; i < query.length; i++) {
            elems.push(query[i]);
        }
        processScroll();
        addEventListener('scroll',processScroll);      
    };
    
    return lazyShow;

}(this));