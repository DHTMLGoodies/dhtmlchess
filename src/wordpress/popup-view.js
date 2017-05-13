chess.wordpress.PopupView = new Class({
    Extends: ludo.View,
    pos: undefined,
    alignWith: undefined,
    arrowEl: undefined,
    posDelta: undefined,

    arrowSize: 20,

    __construct: function (config) {
        this.parent(config);
    },

    __rendered: function () {
        this.parent();
        this.$e.css('position', 'absolute');

        this.arrowEl = jQuery('<div class="wpc-popupview-arrow"></div>');
        this.$e.append(this.arrowEl);
        this.$e.css('overflow', 'visible');
        this.$b().css('overflow', 'visible');
    },


    showWith: function (el, pos) {
        this.show();
        this.pos = pos;
        this.alignWith = el;

        this.arrowEl[0].className = 'wpc-popupview-arrow';
        switch (pos) {
            case 'above':
                this.arrowEl.addClass('wpc-popupview-arrow-down');
                break;
            case 'below':
                this.arrowEl.addClass('wpc-popupview-arrow-up');
                break;
        }

        this.arrowEl[0].className = 'wpc-popupview-arrow';
        this.arrowEl.addClass('wpc-popupview-arrow-' + pos);

        var bw = this.arrowSize / 2;
        this.arrowEl.css({
            'border-left-width': bw,
            'border-right-width': bw,
            'border-top-width': bw,
            'border-bottom-width': bw,
            'margin-left': -bw

        });
        var offsetR = this.renderTo.offset();
        var offsetA = el.offset();
        this.posDelta = {
            y: offsetA.top - offsetR.top,
            x: offsetA.left - offsetR.left
        };


        this.updatePosition();
    },

    updatePosition: function () {
        var css = {};
        var el = this.alignWith;
        var pos = el.position();

        var widthThis = this.$e.width();
        var width = el.outerWidth();

        switch (this.pos) {
            case 'above':
                css.top = -this.$e.height() + this.posDelta.y - this.arrowEl.outerHeight();
                css.left = Math.max(0, this.posDelta.x - (widthThis / 2) + (el.width() / 2));
                break;

            default:

        }

        this.$e.css(css);
    }

});