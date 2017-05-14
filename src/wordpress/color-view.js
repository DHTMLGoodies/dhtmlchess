/**
 * Created by alfmagne1 on 10/05/2017.
 */
chess.wordpress.ColorView = new Class({
    Extends: ludo.FramedView,
    colors: [],
    colorContainer: undefined,
    selectedColor: undefined,
    selectedEl: undefined,
    parentDialog: undefined,
    css: {
        padding: 2
    },

    storageKey: undefined,

    userColors: undefined,

    __construct: function (config) {
        this.parent(config);
        this.colors = config.colors;
        this.storageKey = config.storageKey;
        this.parentDialog = config.dialog;

    },

    __rendered: function () {
        this.parent();
        this.colorContainer = jQuery('<div class="wpc-color-container"></div>').appendTo(this.$b());
        this.renderColors();
        this.$e.css('overflow', 'visible');
        this.$b().css('overflow', 'visible');
    },

    renderColors: function () {
        jQuery.each(this.colors, function (i, color) {
            this.colorContainer.append(this.getColorBox(color, false));
        }.bind(this));
        this.colorContainer.append('<div style="clear:both">');

        this.userColors = this.colorsFromStorage();

        for (var i = 0; i < 10; i++) {
            var clr = this.userColors.length > i ? this.userColors[i] : undefined;

            var colorBox = this.getColorBox(clr, true);
            colorBox.data('userColorIndex', i);
            this.colorContainer.append(colorBox);
        }
    },

    colorsFromStorage: function () {
        var colors = localStorage.getItem(this.storageKey) || '[]';
        colors = JSON.parse(colors);
        return colors;
    },

    resize: function (size) {
        this.parent(size);
    },


    getColorBox: function (color, custom) {

        var el = jQuery('<div class="wpc-color-box"></div>');
        if (color) {
            el.css('background-color', color);
            el.attr("title", color);
        } else {
            el.addClass('wpc-color-box-empty');
        }

        if (custom) {
            el.addClass('wpc-color-box-custom');
            el.attr("title", "Click to add color");
        }

        el.data('color', color);
        el.on('click', this.selectColor.bind(this));
        return el;
    },

    updateColor: function (el) {


    },


    selectColor: function (e) {
        var el = jQuery(e.target);
        var color = el.data('color');

        if (el.hasClass('wpc-color-box-empty')) {
            this.editColor(el);
            return;
        }

        if (this.selectedEl) {
            this.selectedEl.removeClass('wpc-color-box-selected');
        }

        if (color === this.selectedColor) {
            this.selectedColor = undefined;
            this.fireEvent('deselect');
            if (el.hasClass('wpc-color-box-custom')) {
                this.editColor(el);
            }
        } else {
            el.addClass('wpc-color-box-selected');
            this.selectedColor = color;
            this.fireEvent('select', color);
            this.selectedEl = el;
        }
    },

    editColor: function (el) {
        var color = el.data("color") || "";
        var colorView = this.editColorView();
        colorView.showWith(el, 'above');
        colorView.setColor(color, el);

    },

    _editColorView: undefined,

    editColorView: function () {
        if (this._editColorView === undefined) {
            this._editColorView = new chess.wordpress.ColorEditDialog({
                width: 200,
                height: 150,
                renderTo: this.parentDialog.$b(),
                listeners: {
                    'selectColor': this.onColorUpdate.bind(this)
                }
            });
        }
        return this._editColorView;
    },

    onColorUpdate: function (color, el) {
        el.css('background-color', color);
        el.data("color", color);
        el.attr("title", color);
        el.removeClass('wpc-color-box-empty');

        var index = el.data("userColorIndex");
        this.userColors[index] = color;
        localStorage.setItem(this.storageKey, JSON.stringify(this.userColors));
    },

    clear: function () {
        if (this.selectedEl) {
            this.selectedEl.removeClass('wpc-color-box-selected');
        }
        this.selectedColor = undefined;
        this.selectedEl = undefined;
    }
});