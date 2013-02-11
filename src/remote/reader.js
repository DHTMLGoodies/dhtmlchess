chess.remote.Reader = new Class({
    Extends:Events,
    url : window.chess.URL,
    params : {

    },
	onLoadEvent:undefined,
	resource:undefined,

    query : function(config) {
		this.resource = config.resource;
        this.onLoadEvent = config.eventOnLoad || 'load';
		this.remoteHandler().send(config.service, config.arguments, config.data);
    },
	_remoteHandler:undefined,

	remoteHandler:function(){
		if(this._remoteHandler === undefined){
			this._remoteHandler = new ludo.remote.JSON({
				url:window.chess.URL,
				resource : this.resource,
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