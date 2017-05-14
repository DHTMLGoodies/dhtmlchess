/**
 * Created by alfmagne1 on 13/05/2017.
 */

chess.wordpress.ColorEditDialog = new Class({
    Extends: chess.view.popup.View,
    color: undefined,
    cls: 'wpc-color-edit-dialog',
    selectedEl:undefined,
    layout: {
        type: 'linear', orientation: 'vertical'
    },

    __construct: function (config) {
        this.parent(config);
        this.color = config.color;
    },

    __rendered: function () {
        this.parent();
        this.$b().css('padding', 4);
    },

    setColor: function (color, el) {
        this.selectedEl = el;
        ludo.$('wpc-color-preview').$b().css('background-color', color ? color : 'transparent');
        ludo.$('rgbcolor').val(color ? color : '');

    },

    onBtnClick: function () {
        if (this.color) {
            this.fireEvent('selectColor', [this.color, this.selectedEl]);
        }
        this.hide();
    },

    onColorChange: function (color) {
        var pattern = /^#[a-f0-9]{3}$/;
        var pattern2 = /^#[a-f0-9]{6}$/;

        if (pattern.test(color) || pattern2.test(color)) {
            this.color = color;
            ludo.$('wpc-color-preview').$b().css('background-color', color);

        }
    },
    __children: function () {
        return [
            {
                type: 'form.Label',
                label: 'Select color'
            },
            {
                name: 'rgbcolor',
                type: 'form.Text',
                maxLength: 7,
                placeholder: '#RRGGBB',
                listeners: {
                    key: this.onColorChange.bind(this)
                }
            },
            {
                id: 'wpc-color-preview',
                css: {
                    border: '1px solid #aaa',
                    'border-radius': '5px',
                    'overflow': 'hidden',
                    'text-align' : 'center'
                },
                layout: {weight: 1}
            },
            {
                layout: {
                    type: 'linear', orientation: 'horizontal', height: 30
                },
                css: {
                    'padding-top': 4
                },
                children: [
                    {
                        weight: 1

                    },
                    {
                        type: 'form.Button', value: 'Cancel',
                        listeners: {
                            click: this.hide.bind(this)
                        }
                    },
                    {
                        type: 'form.Button', value: 'OK',
                        listeners: {
                            click: this.onBtnClick.bind(this)
                        }
                    }
                ]
            }

        ]

    }

});