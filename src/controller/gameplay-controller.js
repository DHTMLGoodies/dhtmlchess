chess.controller.GameplayController = new Class({
    Extends:chess.controller.Controller,

    fireModelEvent:function (event, model, param) {
        if (model.getId() == this.currentModel.getId()) {
            if (!Browser.ie)console.log(event);
            this.fireEvent(event, [model, param]);
        }
    }
});