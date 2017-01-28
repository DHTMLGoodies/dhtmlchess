chess.remote.Reader = new Class({
    Extends:Events,
	onLoadEvent:undefined,

    query : function(config) {

        this.onLoadEvent = config.eventOnLoad || 'load';

		jQuery.ajax({
			url: ludo.config.getUrl(),
			method: 'post',
			cache: false,
			dataType: 'json',
			data: config,
			success: function (json) {
				this.fireEvent(this.onLoadEvent, json.response != undefined ? json.response : json);
			}.bind(this),
			fail: function (text, error) {
				this.fireEvent('fail', [text, error, this]);
			}.bind(this)
		});


		// this.remoteHandler(config.resource).send(config.service, config.arguments, config.data);


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