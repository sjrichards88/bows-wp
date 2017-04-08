/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/*
File: flexie.js

About: Version
	1.0.3

Project: Flexie

Description:
	Legacy support for the CSS3 Flexible Box Model

License:
	The MIT License
	
	Copyright (c) 2010 Richard Herrera

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/*
Class: Flexie
	Scoped to the Flexie Global Namespace
*/

/*jslint evil: true, regexp: false, plusplus: false */
/*global window, document */

var Flexie = (function (win, doc) {
	
	// Scope public properties
	var FLX = {},
	
	    // Each Flexie-modified DOM node gets a unique identifier
	    FLX_DOM_ID = 0,
	    FLX_DOM_ATTR = "data-flexie-id",
	    FLX_PARENT_ATTR = "data-flexie-parent",
	    
	    // Store support for flexbox
	    SUPPORT,
	    
	    // Store reference to engine
	    ENGINE,
	
	    ENGINES = {
			"NW" : {
				s : "*.Dom.select"
			},
			"DOMAssistant" : {
				s : "*.$",
				m : "*.DOMReady"
			},
			"Prototype" : {
				s : "$$",
				m : "document.observe",
				p : "dom:loaded",
				c : "document"
			},
			"YAHOO" : {
				s : "*.util.Selector.query",
				m : "*.util.Event.onDOMReady",
				c : "*.util.Event"
			},
			"MooTools" : {
				s : "$$",
				m : "window.addEvent",
				p : "domready"
			},
			"Sizzle" : {
				s : "*"
			},
			"jQuery" : {
				s : "*",
				m : "*(document).ready"
			},
			"dojo" : {
				s : "*.query",
				m : "*.addOnLoad"
			}
		},
	    
	    // Store reference to library
	    LIBRARY,
	    
	    // Regular Expressions
	    PIXEL = /^-?\d+(?:px)?$/i,
	    NUMBER = /^-?\d/,
	    SIZES = /width|height|margin|padding|border/,
	    MSIE = /(msie) ([\w.]+)/,
	    WHITESPACE_CHARACTERS = /\t|\n|\r/g,
	    RESTRICTIVE_PROPERTIES = /^max\-([a-z]+)/,
	    PROTOCOL = /^https?:\/\//i,
	    LEADINGTRIM = /^\s\s*/,
	    TRAILINGTRIM = /\s\s*$/,
	    ONLY_WHITESPACE = /^\s*$/,
	    CSS_SELECTOR = /\s?(\#|\.|\[|\:(\:)?[^first\-(line|letter)|before|after]+)/g,
		
	    // String constants
	    EMPTY_STRING = "",
	    SPACE_STRING = " ",
	    PLACEHOLDER_STRING = "$1",
	    PADDING_RIGHT = "paddingRight",
	    PADDING_BOTTOM = "paddingBottom",
	    PADDING_LEFT = "paddingLeft",
	    PADDING_TOP = "paddingTop",
	    BORDER_RIGHT = "borderRightWidth",
	    BORDER_BOTTOM = "borderBottomWidth",
	    BORDER_LEFT = "borderLeftWidth",
	    BORDER_TOP = "borderTopWidth",
	    HORIZONTAL = "horizontal",
	    VERTICAL = "vertical",
	    INLINE_AXIS = "inline-axis",
	    BLOCK_AXIS = "block-axis",
	    INHERIT = "inherit",
	    LEFT = "left",
		
	    END_MUSTACHE = "}",
		
	    PREFIXES = " -o- -moz- -ms- -webkit- -khtml- ".split(SPACE_STRING),
		
	    DEFAULTS = {
			orient : HORIZONTAL,
			align : "stretch",
			direction : INHERIT,
			pack : "start"
	    },
	    
	    // Global reference objects
	    FLEX_BOXES = [],
	    POSSIBLE_FLEX_CHILDREN = [],
	    DOM_ORDERED,
	    
	    RESIZE_LISTENER,
	    
	    // Minification optimizations
	    TRUE = true,
	    FALSE = false,
	    NULL = null,
	    UNDEFINED,
	    
	    // If IE, which version?
	    BROWSER = {
			IE : (function () {
				var ie, ua = win.navigator.userAgent,
				    match = (MSIE).exec(ua.toLowerCase());
			
				if (match) {
					ie = parseInt(match[2], 10);
				}
			
				return ie;
			}())
	    },
	    
	    /*
	    selectivizr v1.0.0 - (c) Keith Clark, freely distributable under the terms 
	    of the MIT license.
        
	    selectivizr.com
	    */
	    selectivizrEngine;
	
	function trim (string) {
		if (string) {
			string = string.replace(LEADINGTRIM, EMPTY_STRING).replace(TRAILINGTRIM, EMPTY_STRING);
		}
		
		return string;
	}
	
	// --[ determineSelectorMethod() ]--------------------------------------
	// walks through the engines object testing for an suitable
	// selector engine.
	
	// Moving outside Selectivizr scope because detection is needed before running selectivizrEngine
	function determineSelectorMethod() {
		// compatiable selector engines in order of CSS3 support
		var engines = ENGINES, method,
			engine, obj;
		
		for (engine in engines) {
			if (engines.hasOwnProperty(engine)) {
				obj = engines[engine];

				if (win[engine] && !method) {
					method = eval(obj.s.replace("*", engine));
					
					if (method) {
						ENGINE = engine;
						break;
					}
				}
			}
		}
		
		return method;
	}
	
	// Event handler for onload/onresize events
	function addEvent(type, func) {
		type = "on" + type;
		var oldevent = win[type];

		if (typeof win[type] !== "function") {
			win[type] = func;
		} else {
			win[type] = function () {
				if (oldevent) {
					oldevent();
				}
				func();
			};
		}
	}
	
	function attachLoadMethod(handler) {
		if (!ENGINE) {
			LIBRARY = determineSelectorMethod();
		}
		
		// compatiable selector engines in order of CSS3 support
		var engines = ENGINES,
		    method, caller, args,
		    engine, obj;
		
		for (engine in engines) {
			if (engines.hasOwnProperty(engine)) {
				obj = engines[engine];

				if (win[engine] && !method && obj.m) {
					method = eval(obj.m.replace("*", engine));
					caller = obj.c ? eval(obj.c.replace("*", engine)) : win;
					args = [];
					
					if (method && caller) {
						if (obj.p) {
							args.push(obj.p);
						}
						args.push(handler);
						method.apply(caller, args);
						break;
					}
				}
			}
		}
		
		if (!method) {
			addEvent("load", handler);
		}
	}
	
	function buildSelector (node) {
		var selector = node.nodeName.toLowerCase();
		
		if (node.id) {
			selector += "#" + node.id;
		} else if (node.FLX_DOM_ID) {
			selector += "[" + FLX_DOM_ATTR + "='" + node.FLX_DOM_ID + "']";
		}
		
		return selector;
	}
	
	function setFlexieId (node) {
		if (!node.FLX_DOM_ID) {
			FLX_DOM_ID = (FLX_DOM_ID + 1);
			
			node.FLX_DOM_ID = FLX_DOM_ID;
			node.setAttribute(FLX_DOM_ATTR, node.FLX_DOM_ID);
		}
	}
	
	function buildSelectorTree(text) {
		var rules = [], ruletext, rule,
		    match, selector, proptext, splitprop, properties,
		    i, j, x;
		
		// Tabs, Returns
		text = text.replace(WHITESPACE_CHARACTERS, EMPTY_STRING);
		
		// Leading / Trailing Whitespace
		text = text.replace(/\s?(\{|\:|\})\s?/g, PLACEHOLDER_STRING);
		
		ruletext = text.split(END_MUSTACHE);

		for (i in ruletext) {
			if (ruletext.hasOwnProperty(i)) {
				text = ruletext[i];

				if (text) {
					rule = [text, END_MUSTACHE].join(EMPTY_STRING);
					
					match = (/(\@media[^\{]+\{)?(.*)\{(.*)\}/).exec(rule);
					
					if (match && match[3]) {
						selector = match[2];
						proptext = match[3].split(";");
						properties = [];
						
						for (j in proptext) {
							if (proptext.hasOwnProperty(j)) {
								x = proptext[j];
								splitprop = x.split(":");
								
								if (splitprop.length && splitprop[1]) {
									properties.push({
										property : splitprop[0],
										value : splitprop[1]
									});
								}
							}
						}
						
						if (selector && properties.length) {
							rules.push({
								selector : selector,
								properties : properties
							});
						}
					}
				}
			}
		}
		
		return rules;
	}
	
	function findFlexboxElements(rules) {
		var selectors, properties,
		    property, value, shortProp,
		    selectorSplit = /\s?,\s?/,
		    createUniqueObject, addRules, key,
		    uniqueChildren = {}, uniqueBoxes = {},
		    i, j, rule, k, l, selector, m, n, prop;
		
		createUniqueObject = function (selector, rules, prop, value) {
			var unique, i, j, rule;

			unique = {
				selector : trim(selector),
				properties : []
			};

			for (i = 0, j = rules.properties.length; i < j; i++) {
				rule = rules.properties[i];

				unique.properties.push({
					property : trim(rule.property),
					value : trim(rule.value)
				});
			}
			
			if (prop && value) {
				unique[prop] = value;
			}
			
			return unique;
		};
		
		addRules = function (selector, rules, prop, value) {
			var box = (prop && value) ? uniqueChildren[selector] : uniqueBoxes[selector],
			    exists, x, i, j, rule, k, l;
			
			if (box) {
				for (i = 0, j = rules.properties.length; i < j; i++) {
					rule = rules.properties[i];

					for (k = 0, l = box.properties.length; k < l; k++) {
						x = box.properties[k];

						if (rule.property === x.property) {
							exists = k;
							return false;
						}
					}
					
					if (exists) {
						box.properties[exists] = rule;
					} else {
						box.properties.push(rule);
					}
				}
				
				if (prop && value) {
					box[prop] = value;
				}
			} else {
				if (prop && value) {
					uniqueChildren[selector] = createUniqueObject(selector, rules, prop, value);
				} else {
					uniqueBoxes[selector] = createUniqueObject(selector, rules, NULL, NULL);
				}
			}
		};

		for (i = 0, j = rules.length; i < j; i++) {
			rule = rules[i];

			selectors = trim(rule.selector).replace(selectorSplit, ",").split(selectorSplit);

			for (k = 0, l = selectors.length; k < l; k++) {
				selector = trim(selectors[k]);
				properties = rule.properties;

				for (m = 0, n = properties.length; m < n; m++) {
					prop = properties[m];
					property = trim(prop.property);
					value = trim(prop.value);

					if (property) {
						shortProp = property.replace("box-", EMPTY_STRING);

						switch (shortProp) {
						case "display" :
							if (value === "box") {
								addRules(selector, rule, NULL, NULL);
							}
							break;

						case "orient" :
						case "align" :
						case "direction" :
						case "pack" :
							addRules(selector, rule, NULL, NULL);
							break;

						case "flex" :
						case "flex-group" :
						case "ordinal-group" :
							addRules(selector, rule, shortProp, value);
							break;
						}
					}
				}
			}
		}

		for (key in uniqueBoxes) {
			if (uniqueBoxes.hasOwnProperty(key)) {
				FLEX_BOXES.push(uniqueBoxes[key]);
			}
		}

		for (key in uniqueChildren) {
			if (uniqueChildren.hasOwnProperty(key)) {
				POSSIBLE_FLEX_CHILDREN.push(uniqueChildren[key]);
			}
		}
		
		return {
			boxes : FLEX_BOXES,
			children : POSSIBLE_FLEX_CHILDREN
		};
	}
	
	function matchFlexChildren(parent, lib, possibleChildren) {
		var caller, unique, matches = [],
			i, j, child,
			k, l, node,
			key;

		for (i = 0, j = possibleChildren.length; i < j; i++) {
			child = possibleChildren[i];

			if (child.selector) {
				caller = lib(child.selector);
				caller = caller[0] ? caller : [caller];

				if (caller[0]) {

					for (k = 0, l = caller.length; k < l; k++) {
						node = caller[k];

						if (node.nodeName !== UNDEFINED) {
							switch (node.nodeName.toLowerCase()) {
							case "script" :
							case "style" :
							case "link" :
								break;

							default :
								if (node.parentNode === parent) {
									// Flag each unique node with FLX_DOM_ID
									setFlexieId(node);

									unique = {};

									for (key in child) {
										if (child.hasOwnProperty(key)) {
											unique[key] = child[key];
										}
									}

									unique.match = node;
									matches.push(unique);
								}
								break;
							}
						}
					}
				}
			} else {
				// Flag each unique node with FLX_DOM_ID
				setFlexieId(child);
				
				matches.push({
					match : child,
					selector : buildSelector(child)
				});
			}
		}
		
		return matches;
	}
	
	function getParams(params) {
		var key;
		
		for (key in params) {
			if (params.hasOwnProperty(key)) {
				params[key] = params[key] || DEFAULTS[key];
			}
		}
		
		return params;
	}
	
	function buildFlexieCall(flexers) {
		var selector, properties, property, value, shortProp,
			display, orient, align, direction, pack,
			lib, caller, children,
			box, params, flexboxes = {},
			match, childMatch, nestedFlexboxes,
			flexieParentSelector = "[" + FLX_PARENT_ATTR + "]",
			i, j, flex, k, l, prop,
			target, key, m, n, child, o, p, existing;
		
		// No boxflex? No dice.
		if (!flexers) {
			return;
		}

		for (i = 0, j = flexers.boxes.length; i < j; i++) {
			flex = flexers.boxes[i];
			flex.selector = trim(flex.selector);
			
			selector = flex.selector;
			properties = flex.properties;
			
			display = orient = align = direction = pack = NULL;
			
			for (k = 0, l = properties.length; k < l; k++) {
				prop = properties[k];

				property = trim(prop.property);
				value = trim(prop.value);
				
				if (property) {
					shortProp = property.replace("box-", EMPTY_STRING);
					
					switch (shortProp) {
					case "display" :
						if (value === "box") {
							display = value;
						}
						break;
						
					case "orient" :
						orient = value;
						break;

					case "align" :
						align = value;
						break;

					case "direction" :
						direction = value;
						break;

					case "pack" :
						pack = value;
						break;
					}
				}
			}
			
			// Determine library
			lib = LIBRARY;
			
			// Call it.
			caller = lib(flex.selector);
			
			// In an array?
			caller = caller[0] ? caller : [caller];
			
			for (k = 0, l = caller.length; k < l; k++) {
				target = caller[k];

				// If is DOM object
				if (target.nodeType) {
					// Flag each unique node with FLX_DOM_ID
					setFlexieId(target);
					
					// Find possible child node matches
					children = matchFlexChildren(target, lib, flexers.children);
					
					// Find any nested flexbox elements
					nestedFlexboxes = selector + " " + flexieParentSelector;

					// Make sure there is some value associated with box properties
					params = {
						target : target,
						selector : selector,
						properties : properties,
						children : children,
						display : display,
						orient : orient,
						align : align,
						direction: direction,
						pack : pack,
						nested : nestedFlexboxes
					};

					match = flexboxes[target.FLX_DOM_ID];

					if (match) {
						for (key in params) {
							if (params.hasOwnProperty(key)) {
								value = params[key];

								switch (key) {
								case "selector" :
									if (value && !(new RegExp(value).test(match[key]))) {
										match[key] += ", " + value;
									}
									break;
								
								case "children" :
									for (m = 0, n = params[key].length; m < n; m++) {
										child = params[key][m];
										childMatch = FALSE;
										
										for (o = 0, p = match[key].length; o < p; o++) {
											existing = match[key][o];

											if (child.match.FLX_DOM_ID === existing.match.FLX_DOM_ID) {
												childMatch = TRUE;
											}
										}
										
										if (!childMatch) {
											match[key].push(child);
										}
									}
									break;
									
								default :
									if (value) {
										match[key] = value;
									}
									break;
								}
							}
						}
					} else {
						flexboxes[target.FLX_DOM_ID] = getParams(params);
						flexboxes[target.FLX_DOM_ID].target.setAttribute(FLX_PARENT_ATTR, TRUE);
					}
				}
			}
		}
		
		DOM_ORDERED = LIBRARY(flexieParentSelector);
		FLEX_BOXES = {};
		
		for (i = 0, j = DOM_ORDERED.length; i < j; i++) {
			target = DOM_ORDERED[i];

			FLEX_BOXES[target.FLX_DOM_ID] = flexboxes[target.FLX_DOM_ID];
		}
		
		// Loop through each match, initialize constructor
		for (key in FLEX_BOXES) {
			if (FLEX_BOXES.hasOwnProperty(key)) {
				flex = FLEX_BOXES[key];

				// One final check to ensure each flexbox has a display property
				if (flex.display === "box") {
					// Constructor
					box = new FLX.box(flex);
				}
			}
		}
	}
	
	function calcPx(element, props, dir) {
		var dim = dir.replace(dir.charAt(0), dir.charAt(0).toUpperCase()),
		    value = element["offset" + dim] || 0,
		    i, j, prop;
		
		if (value) {
			for (i = 0, j = props.length; i < j; i++) {
				prop = parseFloat(element.currentStyle[props[i]]);

				if (!isNaN(prop)) {
					value -= prop;
				}
			}
		}
		
		return value;
	}
	
	function getTrueValue(element, name) {
		var left, rsLeft,
		    ret = element.currentStyle && element.currentStyle[name],
		    style = element.style;

		if (!PIXEL.test(ret) && NUMBER.test(ret)) {

			// Remember the original values
			left = style.left;
			rsLeft = element.runtimeStyle.left;

			// Put in the new values to get a computed value out
			element.runtimeStyle.left = element.currentStyle.left;
			style.left = ret || 0;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left || 0;
			element.runtimeStyle.left = rsLeft;
		}

		return ret;
	}
	
	function unAuto(element, prop, name) {
		var props;
		
		switch (name) {
		case "width" :
			props = [PADDING_LEFT, PADDING_RIGHT, BORDER_LEFT, BORDER_RIGHT];
			prop = calcPx(element, props, name);
			break;

		case "height" :
			props = [PADDING_TOP, PADDING_BOTTOM, BORDER_TOP, BORDER_BOTTOM];
			prop = calcPx(element, props, name);
			break;

		default :
			prop = getTrueValue(element, name);
			break;
		}

		return prop;
	}
	
	function getPixelValue(element, prop, name) {
		if (PIXEL.test(prop)) {
			return prop;
		}
		
		// if property is auto, do some messy appending
		if (prop === "auto" || prop === "medium") {
			prop = unAuto(element, prop, name);
		} else {
			prop = getTrueValue(element, name);
		}
		
		return prop;
	}
	
	function getComputedStyle(element, property, returnAsInt) {
		var value;
		
		if (element === UNDEFINED) {
			return;
		}
		
		if (win.getComputedStyle) {
			value = win.getComputedStyle(element, NULL)[property];
		} else {
			if (SIZES.test(property)) {
				value = getPixelValue(element, (element && element.currentStyle) ? element.currentStyle[property] : 0, property);
			} else {
				value = element.currentStyle[property];
			}
		}
		
		if (returnAsInt) {
			value = parseInt(value, 10);
			
			if (isNaN(value)) {
				value = 0;
			}
		}
		
		return value;
	}
	
	function clientWidth(element) {
		return element.innerWidth || element.clientWidth;
	}
	
	function clientHeight(element) {
		return element.innerHeight || element.clientHeight;
	}
	
	function appendProperty(target, prop, value, prefixName) {
		var cssText = [],
			i, j, prefix;
		
		for (i = 0, j = PREFIXES.length; i < j; i++) {
			prefix = PREFIXES[i];
			cssText.push((prefixName ? prefix : EMPTY_STRING) + prop + ":" + (!prefixName ? prefix : EMPTY_STRING) + value);
		}

		target.style.cssText += cssText.join(";");
		return target;
	}
	
	function appendPixelValue(target, prop, value) {
		var targets = target && target[0] ? target : [target],
			i, j;
		
		for (i = 0, j = targets.length; i < j; i++) {
			target = targets[i];

			if (target && target.style) {
				target.style[prop] = (value ? (value + "px") : EMPTY_STRING);
			}
		}
	}
	
	function calculateSpecificity (selector) {
		var selectorGrid, matrix, total,
			i, j, chunk;
		
		selectorGrid = selector.replace(CSS_SELECTOR, function (e, f) {
			return "%" + f;
		}).replace(/\s|\>|\+|\~/g, "%").split(/%/g);
		
		matrix = {
			_id : 100,
			_class : 10,
			_tag : 1
		};
		
		// Start with rule index position
		total = 0;
		
		// Add each selector value to total.
		for (i = 0, j = selectorGrid.length; i < j; i++) {
			chunk = selectorGrid[i];

			if ((/#/).test(chunk)) {
				total += matrix._id;
			} else if ((/\.|\[|\:/).test(chunk)) {
				total += matrix._class;
			} else if ((/[a-zA-Z]+/).test(chunk)) {
				total += matrix._tag;
			}
		}
		
		return total;
	}
	
	function filterDuplicates (matches, children, type) {
		var filteredMatches = [], exists,
		    spec = (type ? "ordinal" : "flex") + "Specificity",
		    i, j, x, k, l, f;
		
		for (i = 0, j = matches.length; i < j; i++) {
			x = matches[i];

			if ((!type && x.flex) || (type && x["ordinal-group"])) {
				x[spec] = x[spec] || calculateSpecificity(x.selector);
				
				exists = FALSE;
			
				for (k = 0, l = filteredMatches.length; k < l; k++) {
					f = filteredMatches[k];

					if (f.match === x.match) {
						if (f[spec] < x[spec]) {
							filteredMatches[j] = x;
						}
					
						exists = TRUE;
						return FALSE;
					}
				}
			
				if (!exists) {
					filteredMatches.push(x);
				}
			}
		}
		
		return filteredMatches;
	}
	
	function createMatchMatrix(matches, children, type) {
		var groups = {}, keys = [], totalRatio = 0,
			group, order = "ordinal-group",
			BoxOrdinalAttr = "data-" + order,
			i, j, kid, k, l, x, key;
		
		// Filter dupes
		matches = filterDuplicates(matches, children, type);

		for (i = 0, j = children.length; i < j; i++) {
			kid = children[i];

			for (k = 0, l = matches.length; k < l; k++) {
				x = matches[k];

				if (type) {
					// If no value declared, it's the default.
					group = x[order] || "1";
					
					if (x.match === kid) {
						x.match.setAttribute(BoxOrdinalAttr, group);
						
						groups[group] = groups[group] || [];
						groups[group].push(x);
					}
				} else {
					// If no value declared, it's the default.
					group = x.flex || "0";
					
					if (x.match === kid && (!x[group] || (x[group] && parseInt(x[group], 10) <= 1))) {
						totalRatio += parseInt(group, 10);

						groups[group] = groups[group] || [];
						groups[group].push(x);
					}
				}
			}
			
			if (type && !kid.getAttribute(BoxOrdinalAttr)) {
				group = "1";
				kid.setAttribute(BoxOrdinalAttr, group);
				
				groups[group] = groups[group] || [];
				groups[group].push({
					match : kid
				});
			}
		}

		for (key in groups) {
			if (groups.hasOwnProperty(key)) {
				keys.push(key);
			}
		}

		keys.sort(function (a, b) {
			return b - a;
		});

		return {
			keys : keys,
			groups : groups,
			total : totalRatio
		};
	}
	
	function attachResizeListener(construct, params) {
		if (!RESIZE_LISTENER) {
			var storedWidth, storedHeight,
			    currentWidth, currentHeight,
			    docBody = doc.body,
			    docEl = doc.documentElement,
			    resizeTimer,
			    innerWidth = "innerWidth", innerHeight = "innerHeight",
			    clientWidth = "clientWidth", clientHeight = "clientHeight";
			
			addEvent("resize", function () {
				if (resizeTimer) {
					window.clearTimeout(resizeTimer);
				}

				resizeTimer = window.setTimeout(function () {
					currentWidth = win[innerWidth] || docEl[innerWidth] || docEl[clientWidth] || docBody[clientWidth];
					currentHeight = win[innerHeight] || docEl[innerHeight] || docEl[clientHeight] || docBody[clientHeight];
					
					if (storedWidth !== currentWidth || storedHeight !== currentHeight) {
						FLX.updateInstance(NULL, NULL);
						
						storedWidth = currentWidth;
						storedHeight = currentHeight;
					}
				}, 250);
			});
			
			RESIZE_LISTENER = TRUE;
		}
	}
	
	function cleanPositioningProperties (children) {
		var i, j, kid, w, h;
		
		for (i = 0, j = children.length; i < j; i++) {
			kid = children[i];

			w = kid.style.width;
			h = kid.style.height;
			
			kid.style.cssText = EMPTY_STRING;
			
			kid.style.width = w;
			kid.style.height = h;
		}
	}
	
	function sanitizeChildren (target, nodes) {
		var children = [], node, i, j;
		
		for (i = 0, j = nodes.length; i < j; i++) {
			node = nodes[i];
			
			if (node) {
				switch (node.nodeName.toLowerCase()) {
				case "script" :
				case "style" :
				case "link" :
					break;

				default :
					if (node.nodeType === 1) {
						children.push(node);
					} else if ((node.nodeType === 3) && (node.isElementContentWhitespace || (ONLY_WHITESPACE).test(node.data))) {
						target.removeChild(node);
						i--;
					}
					break;
				}
			}
		}
		
		return children;
	}
	
	function parentFlex (target) {
		var totalFlex = 0,
		    parent = target.parentNode,
		    obj,
		    matrix,
		    isNested;
		
		while (parent.FLX_DOM_ID) {
			obj = FLEX_BOXES[parent.FLX_DOM_ID];
			matrix = createMatchMatrix(obj.children, sanitizeChildren(parent, parent.childNodes), NULL);
			
			totalFlex += matrix.total;
			isNested = TRUE;
			
			parent = parent.parentNode;
		}
		
		return {
			nested : isNested,
			flex : totalFlex
		};
	}
	
	function dimensionValues (target, prop) {
		var parent = target.parentNode,
		    obj, dimension, i, j, rule;
		
		if (parent.FLX_DOM_ID) {
			obj = FLEX_BOXES[parent.FLX_DOM_ID];
			
			for (i = 0, j = obj.properties.length; i < j; i++) {
				rule = obj.properties[i];

				if ((new RegExp(prop)).test(rule.property)) {
					dimension = TRUE;
					return FALSE;
				}
			}
		}
		
		return dimension;
	}
	
	function updateChildValues (params) {
		var i, j, x;

		if (params.flexMatrix) {
			for (i = 0, j = params.children.length; i < j; i++) {
				x = params.children[i];
				x.flex = params.flexMatrix[i];
			}
		}
		
		if (params.ordinalMatrix) {
			for (i = 0, j = params.children.length; i < j; i++) {
				x = params.children[i];
				x["ordinal-group"] = params.ordinalMatrix[i];
			}
		}
		
		return params;
	}
	
	function ensureStructuralIntegrity (params, instance) {
		var target = params.target;
		
		if (!target.FLX_DOM_ID) {
			target.FLX_DOM_ID = target.FLX_DOM_ID || (++FLX_DOM_ID);
		}
		
		if (!params.nodes) {
			params.nodes = sanitizeChildren(target, target.childNodes);
		}
		
		if (!params.selector) {
			params.selector = buildSelector(target);
			target.setAttribute(FLX_PARENT_ATTR, TRUE);
		}
		
		if (!params.properties) {
			params.properties = [];
		}
		
		if (!params.children) {
			params.children = matchFlexChildren(target, LIBRARY, sanitizeChildren(target, target.childNodes));
		}
		
		if (!params.nested) {
			params.nested = params.selector + " [" + FLX_PARENT_ATTR + "]";
		}
		
		params.target = target;
		params._instance = instance;
		
		return params;
	}
	
	selectivizrEngine = (function () {
		var RE_COMMENT = /(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*?/g,
			RE_IMPORT = /@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))\s*([^;]*);/g,
			RE_ASSET_URL = /(behavior\s*?:\s*)?\burl\(\s*(["']?)(?!data:)([^"')]+)\2\s*\)/g,
			RE_SELECTOR_GROUP = /((?:^|(?:\s*\})+)(?:\s*@media[^\{]+\{)?)\s*([^\{]*?[\[:][^{]+)/g,
			
			// Whitespace normalization regexp's
			RE_TIDY_TRAILING_WHITESPACE = /([(\[+~])\s+/g,
			RE_TIDY_LEADING_WHITESPACE = /\s+([)\]+~])/g,
			RE_TIDY_CONSECUTIVE_WHITESPACE = /\s+/g,
			RE_TIDY_TRIM_WHITESPACE = /^\s*((?:[\S\s]*\S)?)\s*$/;

		// --[ trim() ]---------------------------------------------------------
		// removes leading, trailing whitespace from a string
		function trim(text) {
			return text.replace(RE_TIDY_TRIM_WHITESPACE, PLACEHOLDER_STRING);
		}

		// --[ normalizeWhitespace() ]------------------------------------------
		// removes leading, trailing and consecutive whitespace from a string
		function normalizeWhitespace(text) {
			return trim(text).replace(RE_TIDY_CONSECUTIVE_WHITESPACE, SPACE_STRING);
		}

		// --[ normalizeSelectorWhitespace() ]----------------------------------
		// tidys whitespace around selector brackets and combinators
		function normalizeSelectorWhitespace(selectorText) {
			return normalizeWhitespace(selectorText.replace(RE_TIDY_TRAILING_WHITESPACE, PLACEHOLDER_STRING).replace(RE_TIDY_LEADING_WHITESPACE, PLACEHOLDER_STRING));
		}

		// --[ patchStyleSheet() ]----------------------------------------------
		// Scans the passed cssText for selectors that require emulation and
		// creates one or more patches for each matched selector.
		function patchStyleSheet(cssText) {
			return cssText.replace(RE_SELECTOR_GROUP, function (m, prefix, selectorText) {
				var selectorGroups, selector,
					i, j, group;
				
				selectorGroups = selectorText.split(",");
				
				for (i = 0, j = selectorGroups.length; i < j; i++) {
					group = selectorGroups[i];
					selector = normalizeSelectorWhitespace(group) + SPACE_STRING;
				}
				
				return prefix + selectorGroups.join(",");
			});
		}
		
		// --[ getXHRObject() ]-------------------------------------------------
		function getXHRObject() {
			if (win.XMLHttpRequest) {
				return new win.XMLHttpRequest();
			}
			
			try	{ 
				return new win.ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) { 
				return NULL;
			}
		}

		function parseInlineStyles ( text ) {
			var reg = /<style[^<>]*>([^<>]*)<\/style[\s]?>/img,
				match = reg.exec(text),
				stylesheets = [],
				rawCSSText;

			while (match) {
				rawCSSText = match[1];

				if (rawCSSText) {
					stylesheets.push(rawCSSText);
				}

				match = reg.exec(text);
			}

			return stylesheets.join("\n\n");
		}
		
		// --[ loadStyleSheet() ]-----------------------------------------------
		function loadStyleSheet(url) {
			var xhr = getXHRObject(),
				responseText;
			
			xhr.open("GET", url, FALSE);
			xhr.send();

			responseText = (xhr.status === 200) ? xhr.responseText : EMPTY_STRING;

			if (url === window.location.href) {
				responseText = parseInlineStyles(responseText);
			}

			return responseText;
		}
		
		// --[ resolveUrl() ]---------------------------------------------------
		// Converts a URL fragment to a fully qualified URL using the specified
		// context URL. Returns null if same-origin policy is broken
		function resolveUrl(url, contextUrl) {
			
			// IE9 returns a false positive sometimes(?)
			if (!url) {
				return;
			}
			
			function getProtocolAndHost(url) {
				return url.substring(0, url.indexOf("/", 8));
			}

			// absolute path
			if (PROTOCOL.test(url)) {
				return getProtocolAndHost(contextUrl) === getProtocolAndHost(url) ? url : NULL;
			}

			// root-relative path
			if (url.charAt(0) === "/")	{
				return getProtocolAndHost(contextUrl) + url;
			}

			// relative path
			var contextUrlPath = contextUrl.split("?")[0]; // ignore query string in the contextUrl
			if (url.charAt(0) !== "?" && contextUrlPath.charAt(contextUrlPath.length - 1) !== "/") {
				contextUrlPath = contextUrlPath.substring(0, contextUrlPath.lastIndexOf("/") + 1);
			}

			return contextUrlPath + url;
		}
		
		// --[ parseStyleSheet() ]----------------------------------------------
		// Downloads the stylesheet specified by the URL, removes it's comments
		// and recursivly replaces @import rules with their contents, ultimately
		// returning the full cssText.
		function parseStyleSheet( url ) {
			if (url) {
				return loadStyleSheet(url).replace(RE_COMMENT, EMPTY_STRING).
				replace(RE_IMPORT, function( match, quoteChar, importUrl, quoteChar2, importUrl2, media ) {
					var cssText = parseStyleSheet(resolveUrl(importUrl || importUrl2, url));
					return (media) ? "@media " + media + " {" + cssText + "}" : cssText;
				}).
				replace(RE_ASSET_URL, function( match, isBehavior, quoteChar, assetUrl ) { 
					quoteChar = quoteChar || EMPTY_STRING;
					return isBehavior ? match : " url(" + quoteChar + resolveUrl(assetUrl, url, true) + quoteChar + ") "; 
				});
			}
			return EMPTY_STRING;
		}
		
		// --[ init() ]---------------------------------------------------------
		return function () {
			// honour the <base> tag
			var url, stylesheets = [], stylesheet, i, j,
			    baseTags = doc.getElementsByTagName("BASE"),
			    baseUrl = (baseTags.length > 0) ? baseTags[0].href : doc.location.href,
			    externalStyles = doc.styleSheets,
			    cssText, tree, flexers;
			
			for (i = 0, j = externalStyles.length; i < j; i++) {
				stylesheet = externalStyles[i];

				if (stylesheet != NULL) {
					stylesheets.push(stylesheet);
				}
			}

			// Add self to test for inline styles
			stylesheets.push(window.location);

			for (i = 0, j = stylesheets.length; i < j; i++) {
				stylesheet = stylesheets[i];

				if (stylesheet) {
					url = resolveUrl(stylesheet.href, baseUrl);

					if (url) {
						cssText = patchStyleSheet(parseStyleSheet(url));
					}

					if (cssText) {
						tree = buildSelectorTree(cssText);
						flexers = findFlexboxElements(tree);
					}
				}
			}
			
			buildFlexieCall(flexers);
		};
	}());
	
	// Flexie box constructor
	FLX.box = function (params) {
		return this.renderModel(params);
	};
	
	FLX.box.prototype = {
		properties : {
			boxModel : function (target, children, params) {
				var selectors, stylesheet, paddingFix, generatedRules,
					i, j, selector;

				target.style.display = "block";
				
				if (BROWSER.IE === 8) {
					target.style.overflow = "hidden";
				}

				// We'll be using floats, so the easiest way to retain layout
				// is the dreaded clear fix:
				if (!params.cleared) {
					selectors = params.selector.split(/\s?,\s?/);
					stylesheet = doc.styleSheets;
					stylesheet = stylesheet[stylesheet.length - 1];
					paddingFix = "padding-top:" + (getComputedStyle(target, PADDING_TOP, NULL) || "0.1px;");
				
					generatedRules = [
						"content: '.'",
						"display: block",
						"height: 0",
						"overflow: hidden"
					].join(";");
				
					for (i = 0, j = selectors.length; i < j; i++) {
						selector = selectors[i];

						if (stylesheet.addRule) {
							if (BROWSER.IE < 8) {
								target.style.zoom = "1";

								if (BROWSER.IE === 6) {
									stylesheet.addRule(selector.replace(/\>|\+|\~/g, ""), paddingFix + "zoom:1;", 0);
								} else if (BROWSER.IE === 7) {
									stylesheet.addRule(selector, paddingFix + "display:inline-block;", 0);
								}
							} else {
								stylesheet.addRule(selector, paddingFix, 0);
								stylesheet.addRule(selector + ":before", generatedRules, 0);
								stylesheet.addRule(selector + ":after", generatedRules + ";clear:both;", 0);
							}
						} else if (stylesheet.insertRule) {
							stylesheet.insertRule(selector + "{" + paddingFix + "}", 0);
							stylesheet.insertRule(selector + ":after{" + generatedRules + ";clear:both;}", 0);
						}
					}
					
					params.cleared = TRUE;
				}
			},
			
			boxDirection : function (target, children, params) {
				var nestedSelector, nested,
					i, j, kid, node;
				
				if ((params.direction === "reverse" && !params.reversed) || (params.direction === "normal" && params.reversed)) {
					children = children.reverse();

					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];
						target.appendChild(kid);
					}
					
					// box-direction is inheritable.
					// We need to see if there are any nested flexbox elements
					nestedSelector = LIBRARY(params.nested);
					
					for (i = 0, j = nestedSelector.length; i < j; i++) {
						node = nestedSelector[i];

						nested = FLEX_BOXES[node.FLX_DOM_ID];
						
						if (nested && nested.direction === INHERIT) {
							nested.direction = params.direction;
						}
					}

					params.reversed = !params.reversed;
				}
			},
			
			boxOrient : function (target, children, params) {
				var self = this, wide, high,
					i, j, kid;

				wide = {
					pos : "marginLeft",
					opp : "marginRight",
					dim : "width",
					out : "offsetWidth",
					func : clientWidth,
					pad : [PADDING_LEFT, PADDING_RIGHT, BORDER_LEFT, BORDER_RIGHT]
				};

				high = {
					pos : "marginTop",
					opp : "marginBottom",
					dim : "height",
					out : "offsetHeight",
					func : clientHeight,
					pad : [PADDING_TOP, PADDING_BOTTOM, BORDER_TOP, BORDER_BOTTOM]
				};

				if (!SUPPORT) {
					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];

						kid.style[(BROWSER.IE >= 9) ? "cssFloat" : "styleFloat"] = LEFT;

						if (params.orient === VERTICAL || params.orient === BLOCK_AXIS) {
							kid.style.clear = LEFT;
						}
						
						if (BROWSER.IE === 6) {
							kid.style.display = "inline";
						}
					}
				}

				switch (params.orient) {
				case VERTICAL :
				case BLOCK_AXIS:
					self.props = high;
					self.anti = wide;
					break;
				
				default :
					self.props = wide;
					self.anti = high;
					break;
				}
			},
			
			boxOrdinalGroup : function (target, children, params) {
				var organizeChildren,
				    matrix;

				if (!children.length) {
					return;
				}
				
				organizeChildren = function (matrix) {
					var keys = matrix.keys,
						iterator = params.reversed ? keys : keys.reverse(),
						i, j, key, k, l, kid;

					for (i = 0, j = iterator.length; i < j; i++) {
						key = iterator[i];

						for (k = 0, l = children.length; k < l; k++) {
							kid = children[k];

							if (key === kid.getAttribute("data-ordinal-group")) {
								target.appendChild(kid);
							}
						}
					}
				};

				matrix = createMatchMatrix(params.children, children, TRUE);

				if (matrix.keys.length > 1) {
					organizeChildren(matrix);
				}
			},
			
			boxFlex : function (target, children, params) {
				var self = this,
				    testForRestrictiveProperties,
				    findTotalWhitespace,
				    distributeRatio,
				    matrix,
				    restrict,
				    whitespace,
				    distro;

				if (!children.length) {
					return;
				}
				
				testForRestrictiveProperties = function (matrix) {
					var flexers = matrix.groups,
					    keys = matrix.keys,
					    max, i, j, key,
					    k, l, x, m, n, rule;
					
					for (i = 0, j = keys.length; i < j; i++) {
						key = keys[i];

						for (k = 0, l = flexers[key].length; k < l; k++) {
							x = flexers[key][k];
							max = NULL;
							
							for (m = 0, n = x.properties.length; m < n; m++) {
								rule = x.properties[m];

								if ((RESTRICTIVE_PROPERTIES).test(rule.property)) {
									max = parseFloat(rule.value);
								}
							}
							
							if (!max || x.match[self.props.out] > max) {
								appendPixelValue(x.match, self.props.pos, NULL);
							}
							
						}
					}
				};

				findTotalWhitespace = function (matrix) {
					var groupDimension = 0,
					    whitespace,
					    ration,
					    i, j, kid,
					    k, l, pad;

					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];

						groupDimension += getComputedStyle(kid, self.props.dim, TRUE);
						
						for (k = 0, l = self.props.pad.length; k < l; k++) {
							pad = self.props.pad[k];

							groupDimension += getComputedStyle(kid, pad, TRUE);
						}
						
						groupDimension += getComputedStyle(kid, self.props.pos, TRUE);
						groupDimension += getComputedStyle(kid, self.props.opp, TRUE);
					}

					whitespace = target[self.props.out] - groupDimension;
					
					for (i = 0, j = self.props.pad.length; i < j; i++) {
						pad = self.props.pad[i];
						whitespace -= getComputedStyle(target, pad, TRUE);
					}
					
					ration = (whitespace / matrix.total);

					return {
						whitespace : whitespace,
						ration : ration
					};
				};

				distributeRatio = function (matrix, whitespace) {
					var flexers = matrix.groups,
					    keys = matrix.keys,
					    flex, specificity,
					    ration = whitespace.ration,
					    widthRation, trueDim, newDimension,
					    i, j, key, k, l, x;

					for (i = 0, j = keys.length; i < j; i++) {
						key = keys[i];
						widthRation = (ration * key);

						for (k = 0, l = flexers[key].length; k < l; k++) {
							x = flexers[key][k];

							if (x.match) {
								flex = x.match.getAttribute("data-flex");
								specificity = x.match.getAttribute("data-specificity");

								if (!flex || (specificity <= x.flexSpecificity)) {
									x.match.setAttribute("data-flex", key);
									x.match.setAttribute("data-specificity", x.flexSpecificity);
									
									trueDim = getComputedStyle(x.match, self.props.dim, TRUE);
									newDimension = Math.max(0, (trueDim + widthRation));
									appendPixelValue(x.match, self.props.dim, newDimension);
								}
							}
						}
					}
				};

				matrix = createMatchMatrix(params.children, children, NULL);

				if (matrix.total) {
					params.hasFlex = TRUE;
					
					restrict = testForRestrictiveProperties(matrix);
					whitespace = findTotalWhitespace(matrix);
				
					// Distribute the calculated ratios among the children
					distro = distributeRatio(matrix, whitespace);
				}
			},
			
			boxAlign : function (target, children, params) {
				var self = this,
				    targetDimension,
				    kidDimension,
				    flexCheck = parentFlex(target),
				    i, j, pad, k, l, kid;
				
				if (!SUPPORT && !flexCheck.flex && (params.orient === VERTICAL || params.orient === BLOCK_AXIS)) {
					if (!dimensionValues(target, self.anti.dim)) {
						appendPixelValue(target, self.anti.dim, NULL);
					}
					appendPixelValue(children, self.anti.dim, NULL);
				}
				
				// Remove padding / border from target dimension
				targetDimension = target[self.anti.out];

				for (i = 0, j = self.anti.pad.length; i < j; i++) {
					pad = self.anti.pad[i];
					targetDimension -= getComputedStyle(target, pad, TRUE);
				}

				switch (params.align) {
				case "start" :
					break;
				
				case "end" :
					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];

						kidDimension = targetDimension - kid[self.anti.out];
						kidDimension -= getComputedStyle(kid, self.anti.opp, TRUE);
						appendPixelValue(kid, self.anti.pos, kidDimension);
					}
					break;

				case "center" :
					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];

						kidDimension = (targetDimension - kid[self.anti.out]) / 2;
						appendPixelValue(kid, self.anti.pos, kidDimension);
					}
					break;
				
				default :
					for (i = 0, j = children.length; i < j; i++) {
						kid = children[i];

						switch (kid.nodeName.toLowerCase()) {
						case "button" :
						case "input" :
						case "select" :
							break;

						default :
							var subtract = 0;

							for (k = 0, l = self.anti.pad.length; k < l; k++) {
								pad = self.anti.pad[k];

								subtract += getComputedStyle(kid, pad, TRUE);
								subtract += getComputedStyle(target, pad, TRUE);
							}

							kid.style[self.anti.dim] = "100%";
							kidDimension = kid[self.anti.out] - subtract;
							appendPixelValue(kid, self.anti.dim, NULL);

							kidDimension = targetDimension;
							kidDimension -= getComputedStyle(kid, self.anti.pos, TRUE);

							for (k = 0, l = self.anti.pad.length; k < l; k++) {
								pad = self.anti.pad[k];

								kidDimension -= getComputedStyle(kid, pad, TRUE);
							}

							kidDimension -= getComputedStyle(kid, self.anti.opp, TRUE);
							kidDimension = Math.max(0, kidDimension);
							
							appendPixelValue(kid, self.anti.dim, kidDimension);
							break;
						}
					}
					break;
				}
			},
			
			boxPack : function (target, children, params) {
				var self = this,
				    groupDimension = 0,
				    firstComputedMargin = 0,
				    targetPadding = 0,
				    totalDimension,
				    fractionedDimension,
				    currentDimension,
				    remainder,
				    length = children.length - 1,
				    kid, i, j, value, pad;

				for (i = 0, j = children.length; i < j; i++) {
					kid = children[i];

					groupDimension += kid[self.props.out];
					groupDimension += getComputedStyle(kid, self.props.pos, TRUE);
					groupDimension += getComputedStyle(kid, self.props.opp, TRUE);
				}

				firstComputedMargin = getComputedStyle(children[0], self.props.pos, TRUE);
				totalDimension = target[self.props.out] - groupDimension;
				
				// Remove padding / border from target dimension
				for (i = 0, j = self.props.pad.length; i < j; i++) {
					pad = self.props.pad[i];
					totalDimension -= getComputedStyle(target, pad, TRUE);
				}
				
				// If totalDimension is less than 0, we have a problem...
				if (totalDimension < 0) {
					totalDimension = Math.max(0, totalDimension);
				}

				switch (params.pack) {
				case "end" :
					appendPixelValue(children[0], self.props.pos, targetPadding + firstComputedMargin + totalDimension);
					break;

				case "center" :
					if (targetPadding) {
						targetPadding /= 2;
					}
					
					appendPixelValue(children[0], self.props.pos, targetPadding + firstComputedMargin + Math.floor(totalDimension / 2));
					break;

				case "justify" :
					fractionedDimension = Math.floor((targetPadding + totalDimension) / length);
					remainder = (fractionedDimension * length) - totalDimension;
					
					i = children.length - 1;
					
					while (i) {
						kid = children[i];
						currentDimension = fractionedDimension;

						if (remainder) {
							currentDimension++;
							remainder++;
						}
						
						value = getComputedStyle(kid, self.props.pos, TRUE) + currentDimension;
						appendPixelValue(kid, self.props.pos, value);
						
						i--;
					}
					
					break;
				}
				
				target.style.overflow = "";
			}
		},

		setup : function (target, children, params) {
			var self = this, matrix, flexCheck,
				key, func;
			
			if (!target || !children || !params) {
				return;
			}
			
			if (SUPPORT && SUPPORT.partialSupport) {
				matrix = createMatchMatrix(params.children, children, NULL);
				flexCheck = parentFlex(target);
				children = sanitizeChildren(target, target.childNodes);
				
				self.properties.boxOrient.call(self, target, children, params);
				
				if (!matrix.total || !LIBRARY(params.nested).length) {
					if ((params.align === "stretch") && !SUPPORT.boxAlignStretch && (!flexCheck.nested || !flexCheck.flex)) {
						self.properties.boxAlign.call(self, target, children, params);
					}

					if ((params.pack === "justify") && !SUPPORT.boxPackJustify && !matrix.total) {
						self.properties.boxPack.call(self, target, children, params);
					}
				}
			} else if (!SUPPORT) {
				for (key in self.properties) {
					if (self.properties.hasOwnProperty(key)) {
						func = self.properties[key];
						func.call(self, target, sanitizeChildren(target, target.childNodes), params);
					}
				}
			}
		},

		trackDOM : function (params) {
			attachResizeListener(this, params);
		},

		updateModel : function (params) {
			var self = this,
			    target = params.target,
			    children = params.nodes;
			
			// Null properties
			cleanPositioningProperties(children);
			
			if (params.flexMatrix || params.ordinalMatrix) {
				params = updateChildValues(params);
			}

			self.setup(target, children, params);
			self.bubbleUp(target, params);
		},

		renderModel : function (params) {
			var self = this,
			    target = params.target,
			    nodes = target.childNodes;
			
			// Sanity check.
			if (!target.length && !nodes) {
				return false;
			}
			
			params = ensureStructuralIntegrity(params, this);
			
			// Setup properties
			self.updateModel(params);
			
			// Resize / DOM Polling Events
			// Delay for an instant because IE6 is insane.
			win.setTimeout(function () {
				self.trackDOM(params);
			}, 0);
			
			return self;
		},
		
		bubbleUp : function (target, params) {
			var self = this, flex,
			    parent = params.target.parentNode;
			
			while (parent) {
				flex = FLEX_BOXES[parent.FLX_DOM_ID];
				
				if (flex) {
					cleanPositioningProperties(flex.nodes);
					self.setup(flex.target, flex.nodes, flex);
				}
				
				parent = parent.parentNode;
			}
		}
	};
	
	FLX.updateInstance = function (target, params) {
		var box, key;
		
		if (target) {
			box = FLEX_BOXES[target.FLX_DOM_ID];
			
			if (box && box._instance) {
				box._instance.updateModel(box);
			} else if (!box) {
				box = new FLX.box(params);
			}
		} else {
			for (key in FLEX_BOXES) {
				if (FLEX_BOXES.hasOwnProperty(key)) {
					box = FLEX_BOXES[key];

					if (box && box._instance) {
						box._instance.updateModel(box);
					}
				}
			}
		}
	};
	
	FLX.getInstance = function (target) {
		return FLEX_BOXES[target.FLX_DOM_ID];
	};
	
	FLX.destroyInstance = function (target) {
		var box, destroy, i, j, x, key;
		
		destroy = function (box) {
			box.target.FLX_DOM_ID = NULL;
			box.target.style.cssText = EMPTY_STRING;
			
			for (i = 0, j = box.children.length; i < j; i++) {
				x = box.children[i];
				x.match.style.cssText = EMPTY_STRING;
			}
		};
		
		if (target) {
			box = FLEX_BOXES[target.FLX_DOM_ID];
			
			if (box) {
				destroy(box);
			}
		} else {
			for (key in FLEX_BOXES) {
				if (FLEX_BOXES.hasOwnProperty(key)) {
					destroy(FLEX_BOXES[key]);
				}
			}
			
			FLEX_BOXES = [];
		}
	};

	FLX.flexboxSupport = function () {
		var partialSupportGrid = {},
		    height = 100,
		    childHeight,
		    dummy = doc.createElement("flxbox"),
		    child = '<b style="margin: 0; padding: 0; display:block; width: 10px; height:' + (height / 2) + 'px"></b>',
		    tests, result, key, value;

		dummy.style.width = dummy.style.height = height + "px";
		dummy.innerHTML = (child + child + child);

		appendProperty(dummy, "display", "box", NULL);
		appendProperty(dummy, "box-align", "stretch", TRUE);
		appendProperty(dummy, "box-pack", "justify", TRUE);

		doc.body.appendChild(dummy);
		childHeight = dummy.firstChild.offsetHeight;
		
		tests = {
			boxAlignStretch : function () {
				return (childHeight === 100);
			},
			
			boxPackJustify : function () {
				var totalOffset = 0,
					i, j;
				
				for (i = 0, j = dummy.childNodes.length; i < j; i++) {
					totalOffset += dummy.childNodes[i].offsetLeft;
				}
				
				return (totalOffset === 135);
			}
		};
		
		for (key in tests) {
			if (tests.hasOwnProperty(key)) {
				value = tests[key];

				result = value();
				
				if (!result) {
					partialSupportGrid.partialSupport = TRUE;
				}
				
				partialSupportGrid[key] = result;
			}
		}
		
		doc.body.removeChild(dummy);
		return ~ (dummy.style.display).indexOf("box") ? partialSupportGrid : FALSE;
	};
	
	FLX.init = function () {
		FLX.flexboxSupported = SUPPORT = FLX.flexboxSupport();

		if ((!SUPPORT || SUPPORT.partialSupport) && LIBRARY) {
			selectivizrEngine();
		}
	};
	
	// Flexie Version
	FLX.version = "1.0.3";

	// Load when the DOM is ready
	attachLoadMethod(FLX.init);
	
	return FLX;
}(this, document));
/*
 *  jQuery OwlCarousel v1.3.3
 *
 *  Copyright (c) 2013 Bartosz Wojciechowski
 *  http://www.owlgraphic.com/owlcarousel/
 *
 *  Licensed under MIT
 *
 */

/*JS Lint helpers: */
/*global dragMove: false, dragEnd: false, $, jQuery, alert, window, document */
/*jslint nomen: true, continue:true */

if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {

    var Carousel = {
        init : function (options, el) {
            var base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function () {
            var base = this, url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },

        logIn : function () {
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"));
            base.$elem.data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },

        setVars : function () {
            var base = this;
            if (base.$elem.children().length === 0) {return false; }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function () {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display", "block");

            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }
        },

        eachMoveUpdate : function () {
            var base = this;

            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },

        updateVars : function () {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },

        reload : function () {
            var base = this;
            window.setTimeout(function () {
                base.updateVars();
            }, 0);
        },

        watchVisibility : function () {
            var base = this;

            if (base.$elem.is(":visible") === false) {
                base.$elem.css({opacity: 0});
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function () {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1}, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function () {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },

        baseClass : function () {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);

            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }

            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function () {
            var base = this, width, i;

            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            width = $(base.options.responsiveBaseWidth).width();

            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                //Reorder array by screen size
                base.options.itemsCustom.sort(function (a, b) {return a[0] - b[0]; });

                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }

            } else {

                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }

                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }

                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },

        response : function () {
            var base = this,
                smallDelay,
                lastWindowWidth;

            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },

        updatePosition : function () {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },

        appendItemsSizes : function () {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function (index) {
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth})
                    .data("owl-item", Number(index));

                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },

        appendWrapperSizes : function () {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function () {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function () {
            var base = this;
            base.itemWidth = Math.round(base.$elem.width() / base.options.items);
        },

        max : function () {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function () {
            return 0;
        },

        loops : function () {
            var base = this,
                prev = 0,
                elWidth = 0,
                i,
                item,
                roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>", {
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
            });

            base.buttonNext = $("<div/>", {
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html("");

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class" : "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function () {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }
            }
            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },

        stop : function () {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },

        checkAp : function () {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },

        play : function () {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.next(true);
            }, base.options.autoPlay);
        },

        swapSpeed : function (action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },

        removeTransition : function () {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function (pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },

        transition3d : function (value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.$owlWrapper.css({"left" : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = "  -moz-transform:" + translate3D +
                                  "; -ms-transform:"     + translate3D +
                                  "; -o-transform:"      + translate3D +
                                  "; -webkit-transform:" + translate3D +
                                  "; transform:"         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);

            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ["s", "e", "x"];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.$elem.on("dragstart.owl", function (event) { event.preventDefault(); });
            base.$elem.on("mousedown.disableTextSelect", function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;

                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }

                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off("touchmove.owl");
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    owlStopEvent;

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.$elem.on("owl.next", function () {
                base.next();
            });
            base.$elem.on("owl.prev", function () {
                base.prev();
            });
            base.$elem.on("owl.play", function (event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function () {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function (event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function (event, item) {
                base.jumpTo(item);
            });
        },

        stopOnHover : function () {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function () {
                    base.stop();
                });
                base.$elem.on("mouseout", function () {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);

                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }

                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");

                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: "fade", "backSlide", "goDown", "fadeUp"
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin + "px",
                    "-moz-perspective-origin" : origin + "px",
                    "perspective-origin" : origin + "px"
                });
            function transStyles(prevPos) {
                return {
                    "position" : "relative",
                    "left" : prevPos + "px"
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                "position" : "",
                "left" : ""
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function () {
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarousel = function (options) {
        return this.each(function () {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarousel", carousel);
        });
    };

    $.fn.owlCarousel.options = {

        items : 5,
        itemsCustom : false,
        itemsDesktop : [1199, 4],
        itemsDesktopSmall : [979, 3],
        itemsTablet : [768, 2],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : false,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        autoPlay : false,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
    };
}(jQuery, window, document));
//Js Revealing module pattern
var core = function($) {

    var init = function() {
    	//List functions here
    	initNavScroll();
		initHomeCarousel();
		initScrollUp();
		initScrollTo();
		initGallery();
		initBackgroundImageCarousel();
    };

    var initNavScroll = function() {

    	function navFunction() {
    		if ($(window).scrollTop() > 0) {
    			$('header .navbar-default').addClass('scrolled');
    		} else {
    			$('header .navbar-default').removeClass('scrolled');
    		}
    	}

    	window.addEventListener('scroll', navFunction);
    	window.addEventListener('load', navFunction);

    };

    var initHomeCarousel = function() {
    	$("#home-carousel").owlCarousel({
    		items: 1,
    		singleItem: true,
    		autoPlay: true,
    		transitionStyle : "fade"
    	});
    };

    var initScrollUp = function() {

    	var scrollUpElement = $('.scroll-up');

    	function scrollUp() {

    		if ( $(window).scrollTop() > $(window).height() / 1.5 ) {
    			scrollUpElement.fadeIn();
    		} else {
    			scrollUpElement.fadeOut();
    		}

    	}

    	scrollUpElement.on('click', function(e) {
    		e.preventDefault();
    		$('body, html').animate({ 
    			scrollTop: '0px' 
    		}, 600);
    	});

    	window.addEventListener('scroll', scrollUp);
    	window.addEventListener('load', scrollUp);

    };

    var initScrollTo = function() {

    	$('.scroll-down').on('click', function() {
    		var target = $(this).attr('href');
    		$('html, body').animate({
    			scrollTop: $(target).offset().top - 50
    		}, 500)
    	});

    };

    var initGallery = function() {

    	// Lazy load images
    	$('.modal-custom .carousel').each(function() {
	    	$(this).on('slid.bs.carousel', function () {
	    		var nextImage = $('.item.active').next('.item').find('img');
	    		var prevImage = $('.item.active').prev('.item').find('img');

	    		if (nextImage.length > 0) {
	    			nextImage.attr('src', nextImage.attr('data-src'));
	    		}	    		

	    		if (prevImage.length > 0) {
	    			prevImage.attr('src', prevImage.attr('data-src'));
	    		}

			});
    	});

    	$('.modal-custom.gallery').each(function() {
    		$(this).on('show.bs.modal', function (e) {
    			var nextImage = $('.item.active').next('.item').find('img');
    			var prevImage = $('.item.active').prev('.item').find('img');

    			if (nextImage.length > 0) {
    				nextImage.attr('src', nextImage.attr('data-src'));
    			}	    		

    			if (prevImage.length > 0) {
    				prevImage.attr('src', prevImage.attr('data-src'));
    			}
    		});
    	});

    	// Carousel indicators, load image from data-src
    	$('.carousel-control-grid li').on('click', function() {
    		var img = $($(this).attr('data-target') + ' .carousel-inner .item')
    			.eq($(this).attr('data-slide-to'))
    			.children('img');
    		img.attr('src', img.attr('data-src'));
    		// $(this).siblings().removeClass('active');
    		// $(this).addClass('active');
    	});
	};

    // Simple custom carousel thats positioned abosolutey and fills relative parent
	var initBackgroundImageCarousel = function() {

		var settings = {
			containerClass: '.c-bg-carousel',
			carouselItemClass: '.c-bg-carousel__item',
			transitionSpeed: 2000,
			interval: 5000,
			auto: false
		};

		$(settings.containerClass).each(function() {

			// Grab array of images 
			var $this = $(this),
				items = $this.find(settings.carouselItemClass);

			// Check if items exist
			if (items.length > 0) {

				// Set first item opacity to 1
				items.css('opacity', '0');
				items.eq(0).css('opacity', '1').addClass('active');
				// Preload last image incase previous button clicked first
				items.eq(items.length-1).css('background-image', 'url('+items.eq(items.length-1).attr('data-src')+')');
				// Preload next image
				items.eq(1).css('background-image', 'url('+items.eq(items.length-1).attr('data-src')+')');
				// Set transition and speed
				items.css({
					'transition': 'opacity '+(settings.transitionSpeed / 1000)+'s ease-in-out',
					'-webkit-transition': 'opacity '+(settings.transitionSpeed / 1000)+'s ease-in-out',
					'-moz-transition': 'opacity '+(settings.transitionSpeed / 1000)+'s ease-in-out',
					'-ms-transition': 'opacity '+(settings.transitionSpeed / 1000)+'s ease-in-out'
				});

				if (settings.auto !== false) {

					// Set var i = 1 skipping first item
					var i = 1;
					// Continuously loop with interval speed and change items opacity
					setInterval(function() {
						items.eq(i-1).css('opacity', '0');
						items.eq(i).css('opacity', '1');
						i++;
						if (i >= items.length) i = 0;
					}, settings.interval + settings.transitionSpeed)

				} else {

					// Update slide when click arrows
					$this.find('.c-bg-carousel__control').on('click', function(e) {
						e.preventDefault();
						var activeItem = $this.find(settings.carouselItemClass+'.active');
						if ($(this).hasClass('next')) {
							// Show next slide and set to active slide
							var nextSlide = activeItem.next();
							if (nextSlide.length == 0) var nextSlide = items.eq(0);
							activeItem.removeClass('active').css('opacity', '0');
							nextSlide.addClass('active').css('opacity', '1');

							// Load next slide image worked out from new active
							var nextNextSlide = nextSlide.next();
							
							if (nextNextSlide.css('background-image') == 'none') {
								nextNextSlide.css('background-image', 'url('+nextNextSlide.attr('data-src')+')');
							}	 

						} else {
							// Show previous slide and set to active slide
							var prevSlide = activeItem.prev();
							if (prevSlide.length == 0) var prevSlide = items.eq(items.length-1);
							activeItem.removeClass('active').css('opacity', '0');
							prevSlide.addClass('active').css('opacity', '1');

							// Load previous slide image worked out from new active
							var prevPrevSlide = prevSlide.prev();
							if (prevPrevSlide.css('background-image') == 'none') {
								prevPrevSlide.css('background-image', 'url('+prevPrevSlide.attr('data-src')+')');
							}
						}
					});

				}
			}
		});

	};

    return {
    	init: init
    };

} (jQuery);

jQuery(function() { 
	core.init(); 
});