chess.wordpress.NotationPanel = new Class({
    Extends: chess.view.notation.Panel,
    setController: function (controller) {
        this.parent(controller);
        controller.on('fen', this.showMoves.bind(this));
    }
    
});