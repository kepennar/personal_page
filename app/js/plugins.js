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

var templateLoader = (function() {
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
