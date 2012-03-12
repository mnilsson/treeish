#  treeish
#
#  jQuery plugin for rendering foldable trees
#
#  https://github.com/mnilsson/treeish
#
#  Copyright (c) 2012 Markus Nilsson <markus@mnilsson.se>
#
#  License: MIT <http://opensource.org/licenses/mit-license.php>
``

(($, window, document) ->

  pluginName = 'treeish'
  defaults =
    cookieId: '_treeish'

  class Treeish
    constructor: (@element, options) ->

      @options = $.extend {}, defaults, options

      @_defaults = defaults
      @_name = pluginName

      @init()

    # Add class for css and close all subtrees before running initialization
    init: ->
      $(@element).addClass 'treeish'
      $(@element).find("li").addClass('closed').find('ul').hide()
      @addHitareas()
      @bindEvents()
      @loadFromCookie()

    # Bind click events to hitareas
    bindEvents: ->
      s = this
      $(@element).find('>li:has(ul)').each (i, elm)->
        $('.hitarea', elm).click (li)->
          s._toggle(this)


    # Toggle open or closed and finally save to cookie
    _toggle: (elm, manual) ->
      if $(elm).parent().hasClass('closed')
        $(elm).html("-")
        $(elm).parent().removeClass('closed')
        $('>ul', $(elm).parent()).show()
      else if !$(elm).parent().hasClass('closed')
        $(elm).html("+")
        $(elm).parent().addClass('closed')
        $('>ul', $(elm).parent()).hide()
      @saveToCookie()

    # Add a span with the class hitarea in every li containing an ul
    addHitareas: ->
      $(@element).find('li:has(>ul)').prepend('<span class="hitarea">+</span>')

    # Save open node state to cookie
    saveToCookie: ->
      data = []
      $(@element).find('li>ul').each (i, e)->
        data[i] = if $(e).is(":visible") then 1 else 0
      $.cookie(@options.cookieId, data.join(""), {})

    # Load open nodes from cookie
    loadFromCookie: ->
      stored = $.cookie(@options.cookieId)
      s = this
      if stored
        data = stored.split("")
        $(@element).find('li>ul').each (i, e)->
          if parseInt(data[i]) == 1
            $(e).parent().removeClass('closed').find('>span.hitarea').html("-")
            $(e).show()


  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(this, "plugin_#{pluginName}")
        $.data(@, "plugin_#{pluginName}", new Treeish(@, options))

)(jQuery, window, document)

