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
        if (this.options.persist) this.loadFromCookie();
        return this._prerenderedNodes($(this.element).find("li"));
      };

      Treeish.prototype._prerenderedNodes = function(nodes) {
        var s;
        s = this;
        return nodes.each(function() {
          if (!$(this).hasClass('open')) {
            $(this).addClass('closed').find('ul').hide();
          } else {
            s._openNode($(this));
            $(this).parents('li').each(function() {
              s._openNode($(this));
              return $(this).find('>ul').show();
            });
          }
          return s._prerenderedNodes($(this).find('li'));
        });
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

      Treeish.prototype._toggle = function(elm) {
        if ($(elm).parent().hasClass('closed')) {
          this._openNode($(elm).parent());
        } else if (!$(elm).parent().hasClass('closed')) {
          this._closeNode($(elm).parent());
        }
        if (this.options.persist) return this.saveToCookie();
      };

      Treeish.prototype._openNode = function(elm) {
        $('>.hitarea', elm).html('-');
        $(elm).removeClass('closed').addClass('open');
        return $('>ul', elm).show();
      };

      Treeish.prototype._closeNode = function(elm) {
        $('>.hitarea', elm).html('+');
        $(elm).removeClass('open').addClass('closed');
        return $('>ul', elm).hide();
      };

      Treeish.prototype.addHitareas = function() {
        return $(this.element).find('li:has(>ul)').prepend('<span class="hitarea">+</span>');
      };

      Treeish.prototype.saveToCookie = function() {
        var data;
        data = [];
        $(this.element).find('li>ul').each(function(i, e) {
          return data[i] = $(e).parent().hasClass("open") ? 1 : 0;
        });
        $.cookie(this.options.cookieId, data.join(""), {});
        return console.log(data);
      };

      Treeish.prototype.loadFromCookie = function() {
        var data, s, stored;
        stored = $.cookie(this.options.cookieId);
        s = this;
        if (stored) {
          data = stored.split("");
          return $(this.element).find('li>ul').each(function(i, e) {
            if (parseInt(data[i]) === 1) {
              $(e).parent().removeClass('closed').addClass('open').find('>span.hitarea').html("-");
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
