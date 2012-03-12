(function() {
  ;
  (function($, window, document) {
    var Treeish, defaults, pluginName;
    pluginName = 'treeish';
    defaults = {
      persist: false,
      cookieId: '_treeish'
    };
    Treeish = (function() {

      function Treeish(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      Treeish.prototype.init = function() {
        $(this.element).addClass('treeish');
        $(this.element).find("li").addClass('closed').find('ul').hide();
        this.addHitareas();
        this.bindEvents();
        if (this.options.persist) return this.loadFromCookie();
      };

      Treeish.prototype.bindEvents = function() {
        var s;
        s = this;
        return $(this.element).find('>li:has(ul)').each(function(i, elm) {
          return $('.hitarea', elm).click(function(li) {
            return s._toggle(this);
          });
        });
      };

      Treeish.prototype._toggle = function(elm, manual) {
        if ($(elm).parent().hasClass('closed')) {
          $(elm).html("-");
          $(elm).parent().removeClass('closed');
          $('>ul', $(elm).parent()).show();
        } else if (!$(elm).parent().hasClass('closed')) {
          $(elm).html("+");
          $(elm).parent().addClass('closed');
          $('>ul', $(elm).parent()).hide();
        }
        if (this.options.persist) return this.saveToCookie();
      };

      Treeish.prototype.addHitareas = function() {
        return $(this.element).find('li:has(>ul)').prepend('<span class="hitarea">+</span>');
      };

      Treeish.prototype.saveToCookie = function() {
        var data;
        data = [];
        $(this.element).find('li>ul').each(function(i, e) {
          return data[i] = $(e).is(":visible") ? 1 : 0;
        });
        return $.cookie(this.options.cookieId, data.join(""), {});
      };

      Treeish.prototype.loadFromCookie = function() {
        var data, s, stored;
        stored = $.cookie(this.options.cookieId);
        s = this;
        if (stored) {
          data = stored.split("");
          return $(this.element).find('li>ul').each(function(i, e) {
            if (parseInt(data[i]) === 1) {
              $(e).parent().removeClass('closed').find('>span.hitarea').html("-");
              return $(e).show();
            }
          });
        }
      };

      return Treeish;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Treeish(this, options));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
