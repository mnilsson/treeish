# **treeish**
#
#  jQuery plugin for rendering foldable trees
#
#  https://github.com/mnilsson/treeish
#
#  Copyright (c) 2012 Markus Nilsson <markus@mnilsson.se>
#
#  License: MIT <http://opensource.org/licenses/mit-license.php>
``
#### Options
#   - persist - If true save the state of the tree to a coocie
#   - cookieId - Name of the cookie to persist to
#
(($, window, document) ->

  pluginName = 'treeish'
  defaults =
    persist: false
    cookieId: '_treeish',
    cookiePath: '/'

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
      if @options.persist
        @loadFromCookie()
      @_prerenderedNodes $(@element).find("li")


    _prerenderedNodes: (nodes)->
      s = this
      nodes.each ->
        if !$(this).hasClass('open')
          $(this).addClass('closed').find('ul').hide()
        else
          s._openNode $(this)
          $(this).parents('li').each ->
            s._openNode $(this)
            $(this).find('>ul').show()
        s._prerenderedNodes $(this).find('li')

    # Bind click events to hitareas
    bindEvents: ->
      s = this
      $(@element).find('>li:has(ul)').each (i, elm)->
        $('.hitarea', elm).click (li)->
          s._toggle(this)


    # Toggle open or closed and finally save to cookie
    # The element sent in is the hitarea
    _toggle: (elm) ->
      if $(elm).parent().hasClass('closed')
        @_openNode($(elm).parent())
      else if !$(elm).parent().hasClass('closed')
        @_closeNode($(elm).parent())
      if @options.persist
        @saveToCookie()

    _openNode: (elm) ->
      $('>.hitarea', elm).html('-')
      $(elm).removeClass('closed').addClass('open')
      $('>ul', elm).show()

    _closeNode: (elm) ->
      $('>.hitarea', elm).html('+')
      $(elm).removeClass('open').addClass('closed')
      $('>ul', elm).hide()

    # Add a span with the class hitarea in every li containing an ul
    addHitareas: ->
      $(@element).find('li:has(>ul)').prepend('<span class="hitarea">+</span>')

    # Save open node state to cookie
    saveToCookie: ->
      data = []
      $(@element).find('li>ul').each (i, e)->
        data[i] = if $(e).parent().hasClass("open") then 1 else 0
      $.cookie(@options.cookieId, data.join(""), {path: @options.cookiePath})
      console.log data

    # Load open nodes from cookie
    loadFromCookie: ->
      stored = $.cookie(@options.cookieId)
      s = this
      if stored
        data = stored.split("")
        $(@element).find('li>ul').each (i, e)->
          if parseInt(data[i]) == 1
            $(e).parent().removeClass('closed').addClass('open').find('>span.hitarea').html("-")
            $(e).show()


  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(this, "plugin_#{pluginName}")
        $.data(@, "plugin_#{pluginName}", new Treeish(@, options))

)(jQuery, window, document)

