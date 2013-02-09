chess.remote.Reader = new Class({
    Extends:Events,
    url : window.chess.URL,
    params : {

    },

    query : function(requestId, event) {

        event = event || 'load';
        var req = new Request.JSON({
            url : '../Game/' + this.params.id,
            data : this.params,
            onSuccess : function(json){
                 this.fireEvent(event, json.data);
            }.bind(this)
        });
        req.send();
    }


});