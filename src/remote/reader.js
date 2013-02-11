chess.remote.Reader = new Class({
    Extends:Events,
    url : window.chess.URL,
    params : {

    },
	onLoadEvent:undefined,

    query : function(requestId, event) {
        this.onLoadEvent = event || 'load';
		this.remoteHandler().send('read', this.params.id);
    },
	_remoteHandler:undefined,

	remoteHandler:function(){
		if(this._remoteHandler === undefined){
			this._remoteHandler = new ludo.remote.JSON({
				url:window.chess.ROOT + '/router.php',
				resource : 'Game',
				listeners:{
					"success": function(request){
						this.fireEvent(this.onLoadEvent, request.getResponseData());
					}.bind(this)
				}
			});
		}
		return this._remoteHandler;
	},

	getOnLoadEvent:function(){
		return this.onLoadEvent;
	}


});