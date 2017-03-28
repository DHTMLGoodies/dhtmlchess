/**
 * Utility for mapping squares to board coordinates(pixels)
 * Created by alfmagne1 on 10/03/2017.
 */
chess.util.CoordinateUtil = {

    files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],

    centerOfSquare: function (square, boardSize, flip) {
        var ret = this.bottomLeftOfSquare(square, boardSize, flip);
        var h = boardSize / 16;
        ret.x += h;
        ret.y += h;
        return ret;
    },

    bottomLeftOfSquare: function (square, boardSize, flip) {
        var ret = {
            x: this.files.indexOf(square.substr(0, 1)),
            y: 8 - square.substr(1, 1)
        };
        if (flip) {
            ret.x = 7 - ret.x;
            ret.y = 7 - ret.y;
        }
        var s = (boardSize / 8);
        ret.x *= s;
        ret.y *= s;
        return ret;
    },

    /**
     * Properties can be arrowWidth, arrowHeight, lineWidth, offsetEnd, offsetStart, roundEdgeSize, arrowOffset
     * @param fromSquare
     * @param toSquare
     * @param {object} properties
     * @param {number} boardSize
     * @param {bool} flip
     */
    arrowPath: function (fromSquare, toSquare, properties, boardSize, flip) {
        var c = {
            start: this.centerOfSquare(fromSquare, boardSize, flip),
            end: this.centerOfSquare(toSquare, boardSize, flip)
        };
        c.oposite = c.start.y - c.end.y;
        c.adjacent = c.end.x - c.start.x;
        c.hyp = Math.sqrt(c.oposite * c.oposite + c.adjacent * c.adjacent);
        c.cos = this.getCos(c);
        c.sin = this.getSin(c);

        if (c.cos < 0 && c.sin >= 0) {
            c.angle = Math.acos(c.cos);
        } else {
            if (c.cos < 0) {
                c.angle = Math.acos(c.cos) * -1
            } else {
                c.angle = Math.asin(c.sin);
            }
        }

        var sz = boardSize / 8;
        var lw = properties.lineWidth || sz * 0.2;
        var ah = properties.arrowHeight || sz* .65;
        var aw = properties.arrowWidth || sz * .45;
        var res = properties.roundEdgeSize || lw / 1.5;
        var ao = properties.arrowOffset || 0;
        var oe = properties.offsetEnd || sz * .2;
        var os = properties.offsetStart || 0;

        var ret = [];

        var cos2 = Math.cos(c.angle + Math.PI / 2);
        var sin2 = Math.sin(c.angle + Math.PI / 2);

        if (oe != 0) {
            c.end.x -= oe * Math.cos(c.angle);
            c.end.y += oe * Math.sin(c.angle);
        }
        if (os != 0) {
            c.start.x += os * Math.cos(c.angle);
            c.start.y -= os * Math.sin(c.angle);
        }

        ret.push('M');
        ret.push(c.end.x);
        ret.push(c.end.y);

        ret.push('L');
        ret.push(c.end.x - ah * c.cos + (aw / 2 * cos2));
        ret.push(c.end.y + ah * c.sin - (aw / 2 * sin2));

        ret.push(c.end.x - (ah - ao) * c.cos + (lw / 2 * cos2));
        ret.push(c.end.y + (ah - ao) * c.sin - (lw / 2 * sin2));


        ret.push(c.start.x + (lw / 2 * cos2));
        ret.push(c.start.y - (lw / 2 * sin2));

        var nextTag = 'L';
        if (res > 0) {
            ret.push('C');
            ret.push(c.start.x - (res * c.cos) + (lw / 2 * cos2));
            ret.push(c.start.y + (res * c.sin) - (lw / 2 * sin2));
            ret.push(c.start.x - (res * c.cos) - (lw / 2 * cos2));
            ret.push(c.start.y + (res * c.sin) + (lw / 2 * sin2));
            ret.push(c.start.x - (lw / 2 * cos2));
            ret.push(c.start.y + (lw / 2 * sin2));
            nextTag = 'M';
        }


        ret.push(nextTag);
        ret.push(c.start.x - (lw / 2 * cos2));
        ret.push(c.start.y + (lw / 2 * sin2));

        ret.push('L');
        ret.push(c.end.x - (ah - ao) * c.cos - (lw / 2 * cos2));
        ret.push(c.end.y + (ah - ao) * c.sin + (lw / 2 * sin2));

        ret.push(c.end.x - ah * c.cos - (aw / 2 * cos2));
        ret.push(c.end.y + ah * c.sin + (aw / 2 * sin2));
        ret.push(c.end.x);
        ret.push(c.end.y);

        return ret.join(' ');
    },

    getSin: function (c) {
        return (c.start.y - c.end.y) / c.hyp;
    },

    getCos: function (c) {
        return (c.end.x - c.start.x) / c.hyp;
    }


};