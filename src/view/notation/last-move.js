chess.view.notation.LastMove = new Class({
    Extends: ludo.View,
    module:'chess',
    type: 'chess.view.notation.LastMove',
    lastIndex: 1,
    figurines: 'svg_bw',
    boxWidth: undefined,
    curPos: undefined,
    figurineHeight:20,

    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['figurineHeight', 'figurines']);
    },
    setController: function (controller) {
        this.parent(controller);
        controller.on('fen', this.update.bind(this));
        controller.on('newmove', this.update.bind(this));
    },

    update: function (model) {


        var fen = model.getCurrentPosition();

        var tokens = fen.split(/\s/g);
        var fm = tokens[tokens.length - 1];
        var m = fm * 2;
        var c = tokens[tokens.length - 5];
        if (c == 'b') {
            m++;

        } else {
            fm--;
        }

        if (m != this.lastIndex) {

            var cm = model.getCurrentMove();

            var pos = -1;
            var dom = this.getDOMForMove(cm, fm, c);
            var el;

            if (m > this.lastIndex) {
                pos = -2;
                this.els.right.html(dom);
                el = this.els.right;
            } else {
                pos = 0;
                this.els.left.html(dom);
                el = this.els.left;
            }

            this.animate(pos, el);
            this.lastIndex = m;
        }
    },

    animate: function (pos, el) {
        this.els.mc.animate({
            left: pos * this.boxWidth
        }, {
            duration: 100,
            complete: function () {
                this.els.center.html(el.html());
                this.els.mc.css('left', -this.boxWidth);
                this.curPos = pos;

            }.bind(this)
        });
    },

    getDOMForMove: function (move, num, color) {

        if (!move)return '';

        var ret = '';
        ret += '<span class="dhtml-chess-notation-last-move-num">' + num + '</span>. ';
        if (color == 'w')ret += ' ..';

        if (this.figurines && move['m'].indexOf('O') == -1 && move.p.type != 'p') {
            var p = move.p;
            var c = p.color.substr(0, 1);
            var t = p.type == 'n' ? 'n' : p.type.substr(0, 1);
            var src = ludo.config.getDocumentRoot() + '/images/' + this.figurines + '45' + c + t + '.svg';
            ret += '<img width="' + this.figurineHeight + '" height="' + this.figurineHeight + '" style="vertical-align:text-bottom;height:' + this.figurineHeight + 'px" src="' + src + '">';
            ret += (move['m'].substr(p.type == 'p' ? 0 : 1));
        } else {
            ret += move['m'];
        }
        return ret;
    },

    resize: function (size) {
        this.parent(size);
        var w = this.$b().width();
        this.els.mc.css({
            'line-height': (size.height) + 'px',
            'font-size': (size.height * 0.4) + 'px',
            left: -w
        });
        this.els.left.css({
            width: w
        });
        this.els.center.css({
            width: w
        });
        this.els.right.css({
            width: w
        });
        this.boxWidth = w;
    },

    __rendered: function () {
        this.parent();

        this.$b().addClass('dhtml-chess-notation-last-move');
        this.els.mc = jQuery('<div></div>');
        this.els.mc.css({
            position: 'absolute',
            height: '100%',
            width: '300%'
        });
        this.$b().append(this.els.mc);

        this.els.left = jQuery('<div></div>');
        this.els.left.css({
            height: '100%', 'float': 'left'
        });
        this.els.mc.append(this.els.left);
        this.els.center = jQuery('<div></div>');
        this.els.center.css({
            height: '100%', 'float': 'left'
        });
        this.els.mc.append(this.els.center);
        this.els.right = jQuery('<div></div>');
        this.els.right.css({
            height: '100%', 'float': 'left'
        });
        this.els.mc.append(this.els.right);
    }
});