chess.remote.Reader = new Class({
    Extends:Events,
	onLoadEvent:undefined,

    query : function(config) {

        this.onLoadEvent = config.eventOnLoad || 'load';
		this.remoteHandler(config.resource).send(config.service, config.arguments, config.data);
    },
	_remoteHandler:undefined,

	remoteHandler:function(resource){
		if(this._remoteHandler === undefined){
			this._remoteHandler = new ludo.remote.JSON({
				resource : resource,
				listeners:{
					"success": function(request){
						this.fireEvent(this.onLoadEvent, request.getResponseData());
					}.bind(this)
				}
			});
		}
        this._remoteHandler.setResource(resource);
		return this._remoteHandler;
	},

	getOnLoadEvent:function(){
		return this.onLoadEvent;
	}
});