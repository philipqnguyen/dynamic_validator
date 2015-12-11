var dynamicValidator = (function ($) {
  var app = {
    params: function () {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
    },

    insertImage: function (selector, image) {
      $(selector).closest('.dynamic-validator').append("<img height='15' width='15' class='validation-image' src=" + image + '>');
    },

    clearImage: function (selector) {
      $(selector).closest('.dynamic-validator').find('.validation-image').remove();
    },

    buildQueries: function (elementOptions) {
      var queries = elementOptions['getFromCurrentQueries'];
      var queryString = '';
      var query;
      for (var i = 0; i < queries.length; i++) {
        query = queries[i] + '=' + this.params()[queries[i]];
        if (queryString !== '') {
          queryString += '&';
        }
        queryString += query;
      }
      if (elementOptions['appendQueries'] !== '') {
        if (queryString !== '') {
          queryString += '&';
        }
        queryString += elementOptions['appendQueries'];
      }
      return queryString;
    },

    buildUrl: function (elementOptions) {
      var val = $(elementOptions['selector']).val();
      var valName = elementOptions['valueName']
      return elementOptions['path'] + '?' + valName + '=' + val + '&' + this.buildQueries(elementOptions);
    },

    runCheck: function (elementOptions) {
      var self = this;
      this.clearImage(elementOptions['selector']);
      this.insertImage(elementOptions['selector'], self.options.loadingImage);
      $.ajax({
        method: 'GET',
        url: self.buildUrl(elementOptions)
      })
      .done(function (data) {
        self.clearImage(elementOptions['selector']);
        if (data.result === true) {
          self.insertImage(elementOptions['selector'], self.options.successImage);
          $(elementOptions['selector']).trigger('dynamicValidator:true');
        } else {
          self.clearImage(elementOptions['selector']);
          self.insertImage(elementOptions['selector'], self.options.failImage);
          $(elementOptions['selector']).trigger('dynamicValidator:false');
        }
      })
      .fail(function (data) {
        self.clearImage(elementOptions['selector']);
        self.insertImage(elementOptions['selector'], self.options.failImage);
        $(elementOptions['selector']).trigger('dynamicValidator:false');
      });
    },

    eventType: function (selector) {
      var eventType;
      if ($(selector).prop('type') === 'text' ) {
        eventType = 'keyup';
      } else {
        eventType = 'change';
      }
      return eventType;
    },

    onKeyUp: function (elementOptions) {
      var self = this;
      $(elementOptions['selector']).on(self.eventType(elementOptions['selector']), function () {
        window.clearTimeout(self.timer)
        self.timer = undefined;
        self.timer = window.setTimeout(function () {
          self.runCheck(elementOptions);
        }, self.options.keyUpDelay);
      });
    },

    parseSelectorsAndPaths: function () {
      var selectorsAndPaths = this.options.selectorsAndPaths;
      for (var i = 0; i < selectorsAndPaths.length; i++) {
        var selectorAndPath = selectorsAndPaths[i];
        var elementOptions = {
          valueName: 'Value',
          getFromCurrentQueries: [],
          appendQueries: '',
          path: '/',
          selector: '#selector'
        };
        for (var key in selectorAndPath) {
          elementOptions[key] = selectorAndPath[key];
        }
        if ($(elementOptions['selector']).length > 0) {
          this.onKeyUp(elementOptions);
        }
      }
    },

    options: {
      keyUpDelay: 1000,
      selectorsAndPaths: [],
      loadingImage: "src/images/fancybox_loading.gif",
      successImage: "src/images/check_64.png",
      failImage: "src/images/red_x_small.png"
    },
  };

  return {
    init: function (options) {
      if ($('.dynamic-validator').length < 1) {
        return false;
      }
      for (var key in options) {
        app.options[key] = options[key]
      }
      app.parseSelectorsAndPaths();
    }
  };
}(jQuery));
