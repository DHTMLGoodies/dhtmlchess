// (C) dhtmlchess.com, Alf Kalleland 2017-01-30 03:33:52
chess.wordpress.CommentView=new Class({Extends:ludo.View,submodule:"wordpress.CommentView",layout:{type:"linear",orientation:"vertical",width:"matchParent",height:"matchParent"},currentLabel:"",currentComment:"",currentMove:undefined,notification:undefined,__children:function(){return[{name:"move",css:{"font-weight":"bold","padding-left":"4px"},layout:{height:30},html:this.currentLabel},{type:"form.Textarea",placeholder:"Enter Comment",name:"comment",layout:{weight:1},listeners:{key_up:this.saveComment.bind(this)}}]},__rendered:function(){this.parent();this.on("show",this.updateViews.bind(this))},setController:function(a){this.parent(a);a.on("fen",this.update.bind(this));a.on("newGame",this.update.bind(this));a.on("startOfGame",this.update.bind(this));a.on("dirty",this.update.bind(this))},onNewGame:function(){console.log("New game")},saveComment:function(){if(this.currentMove){this.controller.addCommentAfter(this.child.comment.val(),this.currentMove)}else{this.controller.currentModel.setGameComment(this.child.comment.val())}},update:function(b){if(!b){b=this.controller.currentModel}var a=b.getCurrentMove();if(!a&&b.model.moves.length>0&&b.model.moves[0].comment){a=b.model.moves[0]}this.currentMove=a;if(!a){this.currentLabel=chess.getPhrase("Game Comment")}else{this.currentLabel=chess.getPhrase("Annotate")+" "+a.lm;this.currentComment=a.comment}if(this.children.length){this.child.move.html(this.currentLabel);this.child.comment.val("");this.child.comment.val(this.currentComment)}},updateViews:function(){if(this.children.length){this.child.move.html(this.currentLabel);console.log("CMT",this.currentComment);if(this.currentComment){this.child.comment.val(this.currentComment)}}}});chess.wordpress.ComputerEval=new Class({Extends:ludo.View,sumodule:"wordpress.computereval",started:false,layout:{type:"linear",orientation:"vertical"},__children:function(){return[{name:"scoreBar",css:{margin:5},type:"chess.view.score.Bar",layout:{height:60},borderRadius:5,blackColor:"#444444",whiteColor:"#EEEEEE",markerColor:"#B71C1C",markerTextColor:"#FFF",stroke:"#222222",range:3},{name:"eval",layout:{weight:1}},{name:"startStopEngine",value:"Start",type:"form.Button",layout:{height:30}},{layout:{height:20},css:{"text-align":"right","font-style":"italic","font-size":"0.9em","padding-right":"4px"},html:'<a href="https://github.com/glinscott/Garbochess-JS" onclick="var w = window.open(this.href); return false">'+chess.getPhrase("GarboChess Javascript Engine")+"</a>"}]},setController:function(a){this.parent(a);a.on("engineupdate",this.receiveEngineUpdate.bind(this));a.on("fen",this.onPositionUpdate.bind(this))},receiveEngineUpdate:function(b){if(b=="Checkmate"){this.child["eval"].html("Checkmate");this.stopEngine();return}var f=b.replace(/.*?Score:([\-0-9]+?)[^0-9].*/g,"$1");var i=this.controller.getCurrentModel().getColorToMove();if(i=="black"){f*=-1}var d=(f/1000);if(d>100){d=100}if(d<-100){d=-100}d=d.toFixed(2);var h=b.replace(/Ply:([0-9]{1,2})[^0-9].*/g,"$1");var g=b.replace(/.*NPS\:([0-9]+?)[^0-9].+/g,"$1");var a=b.replace(/.*NPS\:[0-9]+?[^0-9](.+)/g,"$1");this.child["eval"].html("Depth: "+h+"<br>Nodes/s: "+g+"<br><strong>"+d+"</strong>"+a);this.child.scoreBar.setScore((f/1000));if((Math.abs(f)/1000)>1900){this.controller.sendMessage(chess.getPhrase("Engine stopped"));this.stopEngine()}},__rendered:function(){this.parent();this.on("hide",this.stopEngine.bind(this));this.child.startStopEngine.on("click",this.toggleEngine.bind(this))},onNextMove:function(f,a){console.log(arguments);if(this.started&&a.from){var k=this.controller;console.log(a);var j=this.getXY(a.from);var h=this.getXY(a.to);var d=GenerateValidMoves();var b=null;for(var g=0;g<d.length;g++){if((d[g]&255)==MakeSquare(j.y,j.x)&&((d[g]>>8)&255)==MakeSquare(h.y,h.x)){b=d[g]}}console.log(b);if(b!=null){k.engine.postMessage(FormatMove(b));MakeMove(b);k.searchAndRedraw.delay(20,k)}}},files:["a","b","c","d","e","f","g","h"],getXY:function(c){var a=c;a=a.replace(/[^a-z0-9]/g,"");var b=this.files.indexOf(a.substr(a.length-2,1));var d=a.substr(a.length-1,1)-1;return{x:b,y:7-d}},onPositionUpdate:function(b,a){if(this.started){var d=this.controller;d.ensureAnalysisStopped();d.initializeBackgroundEngine();d.engine.postMessage("position "+a);d.engine.postMessage("analyze")}},toggleEngine:function(){if(this.started){this.stopEngine()}else{this.startEngine()}},stopEngine:function(){if(!this.started){return}this.controller.stopEngine();this.started=false;this.child.startStopEngine.val("Start");this.controller.sendMessage(chess.getPhrase("Engine stopped"))},startEngine:function(){this.controller.startEngine();this.started=true;this.child.startStopEngine.val("Stop")}});chess.wordpress.DiscardDraftButton=new Class({Extends:ludo.form.Button,submodule:"wordpress.discarddraft",value:chess.getPhrase("Discard"),setController:function(a){this.parent(a);a.on("dirty",this.toggle.bind(this));a.on("clean",this.toggle.bind(this))},toggle:function(){var a=this.controller.getCurrentModel();if(!a){return
}var b=a.getMetadataValue("draft_id");if(!b){this.hide()}else{this.show()}}});chess.wordpress.DiscardDraftDialog=new Class({Extends:ludo.dialog.Confirm,submodule:"wordpress.discarddraftdialog",title:chess.getPhrase("Discard draft"),_html:chess.getPhrase("Are you sure you want to discard this draft?"),buttonConfig:"YesNo",autoRemove:false,layout:{width:300,height:150},resizable:false,modal:true});chess.wordpress.DraftButton=new Class({Extends:ludo.form.Button,submodule:"wordpress.savedraft",value:chess.getPhrase("Save Draft"),setController:function(a){this.parent(a)}});chess.wordpress.DraftListView=new Class({Extends:ludo.ListView,dataSource:{type:"chess.wordpress.Drafts"},emptyText:chess.getPhrase("No Drafts Found"),submodule:"wordpress.draftlist",loadMessage:chess.getPhrase("Loading drafts..."),__rendered:function(){this.parent();this.getDataSource().on("select",this.selectGame.bind(this))},setController:function(a){this.parent(a);a.on("draftsupdated",function(){this.getDataSource().load()}.bind(this))},itemRenderer:function(a){return'<div style="border-radius:5px;padding:4px;border:1px solid '+ludo.$C("border")+'"><strong>'+a.title+'</strong></div><div style="text-align:right;font-size:0.8em">Last updated '+a.updated+"</div>"},selectGame:function(a){this.fireEvent("selectDraft",a.game)}});chess.wordpress.Drafts=new Class({Extends:ludo.dataSource.JSONArray,submodule:"wordpress.drafts",postData:{action:"list_drafts"}});chess.wordpress.EditorHeading=new Class({Extends:ludo.View,submodule:"wordpress.editorheading",css:{"font-size":"11px","font-style":"italic","text-align":"right",padding:"5px"},__rendered:function(){this.parent();this.getNumberOfGames()},setController:function(a){this.parent(a)},getNumberOfGames:function(){jQuery.post(ludo.config.getUrl(),{action:"count_games"},function(a){if(a.success){this.html(chess.getPhrase("Games in Database: "+a.response))}}.bind(this))}});window.chess.isWordPress=true;chess.WPEditor=new Class({Extends:Events,renderTo:undefined,initialize:function(a){this.renderTo=jQuery(a.renderTo);if(a.docRoot){ludo.config.setDocumentRoot(a.docRoot)}var b=this.renderTo;b.css("height",(jQuery(document.body).height()));this.module=String.uniqueID();jQuery(document).ready(this.render.bind(this));jQuery(window).on("resize",this.onWinResize.bind(this))},onWinResize:function(){this.renderTo.css("height",(jQuery(document.body).height()))},render:function(){jQuery(document.body).addClass("ludo-twilight");this.renderTo.addClass("ludo-twilight");new chess.view.Chess({renderTo:jQuery(this.renderTo),layout:{type:"linear",orientation:"vertical",height:"matchParent",width:"matchParent"},children:[{layout:{type:"linear",orientation:"horizontal",weight:1},children:[{module:this.module,css:{overflow:"hidden"},submodule:"wordpress.dockinglayout",layout:{type:"docking",tabs:"left",width:300,resizable:true,minWidth:50},children:[{title:chess.getPhrase("Game Drafts"),id:"draftsDockingView",type:"FramedView",elCss:{"border-left-width":0},layout:{type:"fill"},children:[{type:"chess.wordpress.DraftListView",module:this.module,css:{padding:2},dataSource:{type:"chess.wordpress.Drafts"}}]},{type:"FramedView",layout:{type:"linear",orientation:"vertical",visible:true},elCss:{"border-left-width":0},title:chess.getPhrase("PGN Databases"),children:[{type:"chess.wordpress.PgnListView",module:this.module,layout:{weight:1}},{type:"form.Button",value:chess.getPhrase("New Database"),submodule:"chess.newDatabaseButton",module:this.module}]},{type:"FramedView",module:this.module,submodule:"wordpress.gamelisttab",title:chess.getPhrase("Games"),elCss:{"border-left-width":0},layout:{type:"linear",orientation:"vertical"},children:[{type:"form.Text",placeholder:"Search",id:"searchField",layout:{height:30},listeners:{key:function(a){ludo.$("gamelistgrid").getDataSource().search(a)}},elCss:{"border-bottom":"1px solid "+ludo.$C("border")}},{id:"gamelistgrid",type:"chess.wordpress.GameListGrid",module:this.module,layout:{weight:1},elCss:{"border-bottom":"1px solid "+ludo.$C("border")}},{type:"form.Button",module:this.module,value:chess.getPhrase("Standings"),submodule:"wordpress.standingsbutton",listeners:{rendered:function(){if(!this.controller.pgn){this.hide()}}}}]}]},{layout:{weight:1,type:"linear",orientation:"vertical"},css:{"border-left":"1px solid "+ludo.$C("border")},children:[{type:"chess.wordpress.EditorHeading",module:this.module,layout:{height:20}},{module:this.module,type:"chess.wordpress.MetadataTitle",css:{"text-align":"center"},layout:{height:45}},{type:"chess.view.board.Board",module:this.module,layout:{weight:1},squareStyles_white:{"background-color":"#a3a3a3"},squareStyles_black:{"background-color":"#888888"},elCss:{"margin-top":5},background:{borderRadius:ludo.isMobile?"0.5%":"1%",paint:{fill:"#1a2026"}},pieceLayout:"svg_darkgrey",labelOddStyles:ludo.isMobile?{color:"#fff"}:{color:"#fff"},labelEvenStyles:{color:"#fff"},labels:!ludo.isMobile,padding:ludo.isMobile?"1%":"3%",labelPos:ludo.isMobile?"inside":"outside",plugins:[{type:"chess.view.highlight.Arrow",styles:{fill:"#f77cc5",stroke:"#888"}},{type:"chess.view.highlight.ArrowTactic",styles:{fill:"#f77cc5",stroke:"#888"}},{type:"chess.view.highlight.SquareTacticHint"}]},{type:"chess.view.buttonbar.Bar",elCss:{"border-bottom":"1px solid "+ludo.$C("border")},layout:{height:40},module:this.module,borderRadius:"10%",styles:{button:{fill:"#666",stroke:"#bbb"},image:{fill:"#ccc"},buttonOver:{fill:"#777",stroke:"#a3a3a3"},imageOver:{fill:"#eee"},buttonDown:{fill:"#555",stroke:"#bbb"},imageDown:{fill:"#bbb"},buttonDisabled:{fill:"#888","fill-opacity":0.4,stroke:"#888"},imageDisabled:{fill:"#555","fill-opacity":0.4}}},{elCss:{"border-top":"1px solid "+ludo.$C("border")},layout:{type:"tabs",tabs:"top",height:250,resizable:true,resizePos:"above"},children:[{title:"Notations",type:"chess.view.notation.Panel",module:this.module,figurines:"svg_bw",showContextMenu:true},{type:"chess.wordpress.CommentView",title:chess.getPhrase("Annotate"),module:this.module},{title:chess.getPhrase("Computer Eval"),type:"wordpress.ComputerEval",module:this.module},{title:chess.getPhrase("Metadata"),module:this.module,type:"chess.wordpress.GameMetadata"}]},{elCss:{"border-top":"1px solid "+ludo.$C("border")},module:this.module,type:"chess.wordpress.WordPressMessage",layout:{height:20},css:{"line-height":"20px"}}]}]},{layout:{height:35,type:"linear",orientation:"horizontal"},css:{padding:4,"background-color":ludo.$C("border")},children:[{module:this.module,submodule:"wordpress.newgame",type:"form.Button",value:"New",layout:{width:80}},{module:this.module,submodule:"wordpress.newposition",type:"form.Button",value:"New Position",layout:{width:120}},{layout:{weight:1,height:25}},{type:"chess.wordpress.UpdateGameButton",module:this.module,layout:{width:80}},{module:this.module,hidden:true,type:"chess.wordpress.DiscardDraftButton",layout:{width:80}},{type:"chess.wordpress.PublishButton",module:this.module,layout:{width:80}},{type:"chess.wordpress.DraftButton",module:this.module,layout:{width:80}}]}]});
this.controller=new chess.wordpress.WordpressController({applyTo:[this.module],garboChess:ludo.config.getDocumentRoot()+"/garbochess/js/garbochess.js"})}});chess.wordpress.GameListGrid=new Class({Extends:chess.view.gamelist.Grid,headerMenu:false,submodule:"wordpress.gamelist",dataSource:{type:"ludo.dataSource.JSONArray",autoload:false,postData:{action:"list_of_games"}},emptyText:chess.getPhrase("No games"),loadMessage:chess.getPhrase("Loading games..."),cols:["white","black","round","result","last_moves"],__rendered:function(){this.parent();this.loadGames();this.on("show",this.loadGames.bind(this))},setController:function(a){this.parent(a);a.on("publish",function(){if(this.controller.pgn){this.getDataSource().load()}}.bind(this))},loadGames:function(){if(this.controller.pgn&&this.controller.pgn!=this.getDataSource().postData.pgn){this.load()}},load:function(){if(this.controller.pgn){this.getParent().setTitle(chess.getPhrase("PGN:")+" "+this.controller.pgn.pgn_name);this.getDataSource().postData.pgn=this.controller.pgn.id;this.getDataSource().load()}},selectGame:function(a){this.fireEvent("selectGame",[a,this.getDataSource().postData.pgn])}});chess.wordpress.GameList=new Class({Extends:ludo.dataSource.JSONArray,type:"chess.wordpress.GameList",autoload:false,singleton:true,resource:"Database",postData:{action:"list_of_games"},__construct:function(a){this.url=ludo.config.getUrl();this.parent(a)},loadPgn:function(a){this.postData.pgn=a;this.sendRequest(this.service,a)}});chess.wordpress.GameMetadata=new Class({Extends:ludo.View,submodule:"wordpress.gameMetadata",layout:{type:"table",simple:true,rowHeight:25,columns:[{width:100},{weight:1}]},css:{padding:4},__rendered:function(){this.parent();this.getForm().on("change",this.update.bind(this));this.on("show",this.populateForm.bind(this))},setController:function(a){this.parent(a);a.on("newGame",this.populateForm.bind(this));a.on("loadGame",this.populateForm.bind(this))},populateForm:function(){this.getForm().clear();this.getForm().populate({result:"*"});this.getForm().populate(this.controller.currentModel.getMetadata())},update:function(a,b){this.fireEvent("metadata",[a,b])},__children:function(){return[{type:"form.Label",label:chess.getPhrase("White")+"* :",labelFor:"white"},{type:"form.Text",name:"white",placeholder:"White Player"},{type:"form.Label",label:chess.getPhrase("Black")+"* :",labelFor:"black"},{type:"form.Text",name:"black",placeholder:"Black Player"},{type:"form.Label",label:chess.getPhrase("Result")+":",labelFor:"result"},{type:"form.Select",dataSource:{url:undefined,data:["*","1-0","1/2-1/2","0-1"]},name:"result"},{type:"form.Label",label:chess.getPhrase("Event")+" :",labelFor:"event"},{type:"form.Text",name:"event",placeholder:"Event"},{type:"form.Label",label:chess.getPhrase("Date")+":",labelFor:"date"},{type:"form.Text",name:"date",placeholder:"Date"},{type:"form.Label",label:chess.getPhrase("Round")+":",labelFor:"round"},{type:"form.Text",name:"round",placeholder:"Round"}]}});chess.wordpress.MetadataTitle=new Class({Extends:chess.view.metadata.Game,submodule:"wordpress.metadatatitle",metadata:undefined,dirty:false,css:{"line-height":"120%"},tpl:function(f){f=f||this.metadata;if(!f){return}if(f&&(f.white||f.black)){var c=f.white?f.white:"?";var a=f.black?f.black:"?";var d=c+" vs "+a+" "+f.result;if(this.dirty){d+="<sup>*</sup>"}if(f.pgn){d+='<br><span style="font-size:0.7em">PGN: '+f.pgn+"</span>"}return d}this.metadata=f},setController:function(a){this.parent(a);this.controller.on("clean",this.setClean.bind(this));this.controller.on("dirty",this.setDirty.bind(this));this.controller.on("updateMetadata",this.updateMetadata.bind(this))},setClean:function(){this.dirty=false;this.updateMetadata(this.controller.currentModel)},setDirty:function(){console.log("set dirty");this.dirty=true;this.updateMetadata(this.controller.currentModel)}});chess.wordpress.NewDatabaseDialog=new Class({Extends:ludo.dialog.Dialog,submodule:"wordpress.newdatabasedialog",layout:{width:400,height:150,type:"linear",orientation:"vertical"},buttonConfig:"OkCancel",title:chess.getPhrase("New Game Database"),css:{padding:5},__children:function(){return[{type:"form.Label",labelFor:"dbName",label:chess.getPhrase("New Game Database")},{name:"dbname",type:"form.Text",placeholder:chess.getPhrase("Name of new database"),required:true,validateKeyStrokes:true,validator:function(a){return a.trim().length>=5}}]},__rendered:function(){this.parent();this.okButton=this.getButton("ok");this.okButton.disable();this.getForm().on("valid",function(){this.okButton.enable()}.bind(this));this.getForm().on("invalid",function(){this.okButton.disable()}.bind(this));this.on("ok",function(){console.log("creating "+this.child.dbname.val());this.fireEvent("newdatabase",this.child.dbname.val())})}});chess.wordpress.PgnListView=new Class({Extends:ludo.ListView,swipable:true,submodule:"wordpress.pgnlistview",emptyText:chess.getPhrase("No Databases found"),itemRenderer:function(a){return'<div class="pgn_list_item"><div class="pgn_list_name"><strong>'+a.pgn_name+'</strong></div><div class="pgn_list_pgn_id">ID: '+a.id+'</div><div class="pgn_list_count_games">Games: '+a.count+'</div><div class="pgn_list_updated">Updated: '+a.updated+"</div></div>"
},backSideLeft:function(a){return'<div style="position:absolute;top:50%;margin-top:-10px;left:10px">'+chess.getPhrase("Archive Database")+"</div>"},backSideUndo:function(a){return'<div style="position:absolute;top:50%;margin-top:-10px;left:10px">'+chess.getPhrase("Undo")+"</div>"},__construct:function(a){this.dataSource={type:"chess.wordpress.PgnList",listeners:{select:this.selectPgn.bind(this)}};this.parent(a);this.on("swipe",function(b){jQuery.ajax({url:ludo.config.getUrl(),method:"post",dataType:"json",cache:false,data:{action:"archive_pgn",pgn:b.id},complete:function(c,f){if(f){var d=c.responseJSON;if(d.success){this.getDataSource().remove(b);this.controller.sendMessage(chess.getPhrase("PGN archived"))}else{this.controller.sendError("Unable to Archive: "+d.response);this.undoSwipe(b)}}else{this.controller.sendError(c.responseText);this.undoSwipe(b)}}.bind(this)})}.bind(this))},setController:function(a){this.parent(a);a.on("publish",function(){this.getDataSource().load()}.bind(this));a.on("new_pgn",function(){this.getDataSource().load()}.bind(this))},selectPgn:function(a){this.fireEvent("selectpgn",a)}});chess.wordpress.PgnList=new Class({Extends:ludo.dataSource.JSONArray,type:"chess.dataSource.PgnList",autoload:true,postData:{action:"list_pgns"}});chess.wordpress.PgnParserView=new Class({Extends:ludo.View,submodule:"wordpress.pgnparserview",parser:undefined,__construct:function(a){this.parent(a);this.parser=new chess.pgn.Parser()},__rendered:function(){this.parent();this.on("show",this.updatePgn.bind(this))},setController:function(a){this.parent(a)},updatePgn:function(){var a=this.parser.getPgn(this.controller.currentModel);this.html(a.replace(/\n/g,"<br>"))}});chess.wordpress.PgnStandings=new Class({submodule:"wordpress.pgnstandings",Extends:ludo.grid.Grid,currentPgn:undefined,dataSource:{type:"dataSource.JSONArray",autoload:false,postData:{action:"get_standings"}},headerMenu:false,sofiaRules:false,__columns:function(){return{player:{heading:"Player",sortable:true,width:200,key:"player"},w:{heading:"Wins",sortable:true,width:50},d:{heading:"Draws",sortable:true,width:50},l:{heading:"Losses",sortable:true,width:50},score:{heading:"Score",sortable:true,renderer:function(b,a){if(this.sofiaRules){return(a.w*3)+a.d}return a.w+(a.d/2)}.bind(this)}}},__construct:function(a){this.parent(a);this.setConfigParams(a,["sofiaRules"])},__rendered:function(){this.parent();this.getDataSource().setSortFn("score",{desc:function(d,c){var g=d.w+(d.d/2);var f=c.w+(c.d/2);return g<f?1:-1},asc:function(d,c){var g=d.w+(d.d/2);var f=c.w+(c.d/2);return g<f?-1:1}});this.getDataSource().on("load",this.autoSort.bind(this));this.on("show",this.updateStandings.bind(this))},setController:function(a){this.parent(a);a.on("pgn",this.setPgn.bind(this))},setPgn:function(a){if(a!=this.currentPgn){this.currentPgn=a}this.updateStandings()},autoSort:function(){this.getDataSource().by("score").descending().sort()},updateStandings:function(){if(!this.currentPgn){return}if(this.controller&&this.controller.pgn&&this.controller.pgn.id!=this.currentPgn){return}this.getDataSource().setPostParam("pgn",this.currentPgn);this.getDataSource().load()}});chess.wordpress.PublishButton=new Class({Extends:ludo.form.Button,submodule:"wordpress.publish",value:chess.getPhrase("Publish"),setController:function(a){this.parent(a);a.on("game",this.onNewGame.bind(this))},onNewGame:function(){}});chess.wordpress.PublishConfirmDialog=new Class({Extends:ludo.dialog.Confirm,autoremove:false,css:{padding:5}});chess.wordpress.PublishDialog=new Class({Extends:ludo.dialog.Dialog,submodule:"wordpress.publishdialog",modal:true,buttonConfig:"OkCancel",title:chess.getPhrase("Publish Game"),layout:{width:300,height:300,type:"linear",orientation:"vertical"},pgn:undefined,__rendered:function(){this.parent();this.child.searchField.on("key",function(a){this.child.list.getDataSource().search(a)}.bind(this));this.on("ok",this.onSelected.bind(this));this.getButton("ok").setEnabled(false)},onSelected:function(){this.fireEvent("selectpgn",this.pgn)},selectPgn:function(a){this.pgn=a.pgn_name;this.getButton("ok").setEnabled(true)},__children:function(){return[{name:"heading",html:chess.getPhrase("Select PGN"),layout:{height:25}},{name:"searchField",type:"form.Text",placeholder:"Search",layout:{height:30},elCss:{"border-top":"1px solid "+ludo.$C("border"),"border-bottom":"1px solid "+ludo.$C("border")}},{name:"list",type:"grid.Grid",columns:{pgn_name:{heading:"PGN"}},dataSource:{type:"chess.wordpress.PgnList",autoload:true,listeners:{select:this.selectPgn.bind(this)}},layout:{weight:1}}]},show:function(a){this.parent();if(a&&a.pgn){this.child.list.getDataSource().select({pgn_name:a.pgn})}}});chess.wordpress.UpdateGameButton=new Class({Extends:ludo.form.Button,submodule:"wordpress.updategame",value:chess.getPhrase("Update"),setController:function(a){this.parent(a);a.on("game",this.onNewGame.bind(this))},onNewGame:function(){}});chess.wordpress.WordpressController=new Class({Extends:chess.controller.AnalysisEngineController,posSetup:undefined,debug:true,newGameDialog:undefined,__construct:function(a){this.parent(a);
this.currentModel.setClean();this.currentModel.on("dirty",this.fireDirty.bind(this));this.currentModel.on("clean",this.fireClean.bind(this));this.updateButtonVisibility();this.currentModel.setClean()},fireDirty:function(){console.log("dirty");this.fireEvent("dirty")},fireClean:function(){console.log("clean");this.fireEvent("clean")},addView:function(a){success=this.parent(a);if(success){console.log(a.submodule);switch(a.submodule){case"wordpress.standingsbutton":this.views.standingsButton=a;a.on("click",this.showStandings.bind(this));break;case"wordpress.newposition":a.on("click",this.showPositionSetup.bind(this));break;case"wordpress.position":a.on("setPosition",this.onNewPositionClick.bind(this));break;case"wordpress.savedraft":this.views.saveDraftButton=a;a.on("click",this.saveDraft.bind(this));break;case"wordpress.gameMetadata":a.on("metadata",this.updateMetadata.bind(this));this.views.metadata=a;break;case"wordpress.pgnlistview":a.on("selectpgn",this.selectPgn.bind(this));break;case"wordpress.gamelist":this.views.gamelist=a;a.on("selectGame",this.selectGame.bind(this));break;case"wordpress.gamelisttab":this.views.gamelisttab=a;break;case"wordpress.dockinglayout":this.views.docking=a;break;case"wordpress.draftlist":this.views.draftlist=a;a.on("selectDraft",this.selectGame.bind(this));break;case"wordpress.publish":this.views.publishButton=a;a.on("click",this.publishGame.bind(this));break;case"wordpress.discarddraft":this.views.discardDraftButton=a;a.on("click",this.discardDraft.bind(this));break;case"wordpress.updategame":this.views.updateGameButton=a;a.on("click",this.saveUpdates.bind(this));break;case"wordpress.newgame":a.on("click",this.onNewGameClick.bind(this));break;case"chess.newDatabaseButton":a.on("click",this.showNewDatabaseDialog.bind(this));this.views.newDatabaseButton=a;break;case"wordpress.newdatabasedialog":a.on("newdatabase",this.createDatabase.bind(this));break}}},getDiscardDraftDialog:function(){if(this.discardDraftDialog==undefined){this.discardDraftDialog=new chess.wordpress.DiscardDraftDialog({listeners:{yes:this.discardDraftConfirmed.bind(this)},layout:{centerIn:this.views.board}})}return this.discardDraftDialog},discardDraft:function(){this.getDiscardDraftDialog().show()},discardDraftConfirmed:function(){this.disableButtons();jQuery.ajax({url:ludo.config.getUrl(),method:"post",cache:false,dataType:"json",data:{action:"discard_draft",draft_id:this.currentModel.getMetadataValue("draft_id")},complete:function(a,c){this.enableButtons();if(c){var b=a.responseJSON;if(b.success){this.fireEvent("wpmessage",chess.getPhrase("Draft discarded"));this.fireEvent("draftsupdated");this.currentModel.newGame()}else{this.fireEvent("wperror",b.response)}}else{this.fireEvent("wperror",a.responseText)}}.bind(this)})},newGameFen:undefined,getNewGameDialog:function(){if(this.newGameDialog==undefined){this.newGameDialog=new ludo.dialog.Confirm({html:chess.getPhrase("You have unsaved game data. Do you want to discard these?"),autoRemove:false,css:{padding:5},buttonConfig:"YesNo",layout:{centerIn:this.views.board,width:300,height:200},listeners:{yes:function(){this.currentModel.newGame();if(this.newGameFen){this.currentModel.setPosition(this.newGameFen)}this.updateButtonVisibility()}.bind(this),no:function(){}}})}return this.newGameDialog},showStandings:function(){if(this.standingsWindow==undefined){this.standingsWindow=new ludo.dialog.Dialog({title:chess.getPhrase("Standings"),autoRemove:false,layout:{type:"fill",left:100,top:100,width:500,height:400},buttonConfig:"Ok",children:[{type:"chess.wordpress.PgnStandings",module:this.module}]})}this.standingsWindow.setTitle(chess.getPhrase("Standings")+" - "+this.pgn.pgn_name);this.standingsWindow.children[0].setPgn(this.pgn.id);this.standingsWindow.show()},onNewPositionClick:function(a){this.newGameFen=a;if(this.currentModel.isDirty()){this.getNewGameDialog().show()}else{this.currentModel.setDefaultModel();this.currentModel.setPosition(a);this.updateButtonVisibility();this.views.metadata.show()}},showNewDatabaseDialog:function(){if(this.newDbDialog==undefined){this.newDbDialog=new chess.wordpress.NewDatabaseDialog({module:this.module,autoRemove:false});this.addView(this.newDbDialog)}this.newDbDialog.show();var b=this.views.newDatabaseButton.getEl().offset();var a=this.newDbDialog.getEl().outerHeight();this.newDbDialog.showAt(b.left,b.top-a)},createDatabase:function(a){console.log(a);jQuery.ajax({url:ludo.config.getUrl(),method:"post",dataType:"json",cache:false,data:{action:"new_pgn",pgn_name:a},complete:function(b,d){if(d){var c=b.responseJSON;this.enableButtons();if(c.response){if(c.success){this.fireEvent("new_pgn");this.fireEvent("wpmessage",chess.getPhrase("New Database created"))}else{this.fireEvent("wpmessage",chess.getPhrase(e.response))}}}else{this.fireEvent("wperror",b.responseText)}}.bind(this)})},onNewGameClick:function(){this.newGameFen=undefined;if(this.currentModel.isDirty()){this.getNewGameDialog().show()}else{this.currentModel.newGame();this.updateButtonVisibility();
this.views.metadata.show()}},getPublishDialog:function(){if(this.publishDialog==undefined){this.publishDialog=new chess.wordpress.PublishDialog({autoRemove:false,layout:{centerIn:this.views.board},listeners:{selectpgn:function(b){this.publish_pgn=b;var a=this.getPublishConfirmDialog();a.show();a.html(chess.getPhrase("Publish game in")+" <strong>"+this.publish_pgn+"</strong>?")}.bind(this)}})}return this.publishDialog},getPublishConfirmDialog:function(){if(this.publishConfirmDialog==undefined){this.publishConfirmDialog=new ludo.dialog.Confirm({html:"",autoRemove:false,css:{padding:5},buttonConfig:"YesNo",layout:{centerIn:this.views.board,width:300,height:200},listeners:{yes:function(){this.publishComplete(this.publish_pgn)}.bind(this),no:function(){this.hide()}}})}return this.publishConfirmDialog},publishGame:function(){var a=this.validateAndReturnModel();if(!a){return}this.getPublishDialog().show(this.currentModel.getMetadata())},publishComplete:function(b){this.currentModel.setMetadata({pgn:b});var a=this.validateAndReturnModel();if(!a){return}this.disableButtons();jQuery.ajax({url:ludo.config.getUrl(),method:"post",dataType:"json",cache:false,data:{action:"publish_game",game:JSON.stringify(a),pgn:b},complete:function(c,f){if(f){var d=c.responseJSON;this.enableButtons();if(d.response){if(d.success){this.currentModel.draft_id=undefined;this.fireEvent("wpmessage",chess.getPhrase("Game published"));this.fireEvent("draftsupdated");this.fireEvent("publish");this.currentModel.setMetadata({draft_id:undefined});this.currentModel.setMetadata({id:d.response});this.currentModel.setClean();this.updateButtonVisibility()}else{this.fireEvent("wpmessage",chess.getPhrase("Everything is up to date"))}}}else{this.fireEvent("wperror",c.responseText)}}.bind(this)})},selectPgn:function(a){if(this.views.standingsButton){this.views.standingsButton.show()}this.pgn=a;this.fireEvent("pgn",a);if(this.views.gamelisttab){this.views.gamelisttab.show();if(this.views.gamelist){this.views.gamelist.loadGames()}}},gameToLoad:undefined,getConfirmDialog:function(){if(this.confirmDialog==undefined){this.confirmDialog=new ludo.dialog.Confirm({html:chess.getPhrase("You have unsaved game data. Do you want to discard these?"),autoRemove:false,css:{padding:5},buttonConfig:"YesNo",layout:{centerIn:this.views.board,width:300,height:200},listeners:{yes:function(){this.loadPgn(this.gameToLoad);this.gameToLoad=undefined}.bind(this),no:function(){this.gameToLoad=undefined;this.hide()}}})}return this.confirmDialog},selectGame:function(a){if(this.currentModel.isDirty()){this.gameToLoad=a;this.getConfirmDialog().show();return}this.loadPgn(a)},loadPgn:function(a){if(a.pgn_id&&a.id){this.load({action:"game_by_id",pgn:a.pgn_id,id:a.id})}else{if(a.draft_id){this.load({action:"get_draft",draft_id:a.draft_id})}}},load:function(a){this.disableButtons();this.currentModel.beforeLoad();jQuery.ajax({url:ludo.config.getUrl(),method:"post",cache:false,dataType:"json",data:a,complete:function(d,b){this.currentModel.afterLoad();this.enableButtons();if(b=="success"){var f=d.responseJSON;if(f.success){if(this.views.docking){this.views.docking.getLayout().collapse()}var c=f.response;this.currentModel.populate(c);this.currentModel.setClean();this.updateButtonVisibility();this.fireEvent("game",c)}}else{this.fireEvent("wperrror",chess.getPhrase("Could not load game. Try again later"))}}.bind(this),fail:function(c,b){this.fireEvent(b)}.bind(this)})},updateButtonVisibility:function(){var a=this.currentModel.getMetadata();this.views.updateGameButton.hide();this.views.publishButton.hide();this.views.saveDraftButton.hide();this.views.discardDraftButton.toggle();if(a.pgn){this.views.updateGameButton.show()}else{this.views.publishButton.show();this.views.saveDraftButton.show()}},updateMetadata:function(a,b){if(this.currentModel){this.currentModel.setMetadataValue(a,b)}},deleteDraft:function(a){},saveUpdates:function(){var a=this.currentModel.modelForServer();if(!a){return}if(!a.white||!a.black){this.fireEvent("wperror","Metadata missing");this.views.metadata.show();return}this.disableButtons();jQuery.ajax({url:ludo.config.getUrl(),method:"post",cache:false,data:{action:"save_game",pgn:a.pgn_id,game:JSON.stringify(a)},complete:function(b,d){this.enableButtons();if(d){var c=b.responseJSON;if(c.success){this.fireEvent("wpmessage",chess.getPhrase("Game Saved"));this.fireEvent("publish");this.currentModel.setClean()}else{this.fireEvent("wpmessage",chess.getPhrase(c.response))}}}.bind(this)})},validateAndReturnModel:function(){var a=this.currentModel.modelForServer();if(!a){return false}if(!a.white||!a.black){this.fireEvent("wperror","Metadata missing");this.views.metadata.show();return false}if(a.id&&isNaN(a.id)){a.id=undefined}delete a.metadata;return a},saveDraft:function(){var a=this.validateAndReturnModel();if(!a){return}this.disableButtons();jQuery.ajax({url:ludo.config.getUrl(),dataType:"json",method:"post",data:{action:"save_draft",game:JSON.stringify(a)},complete:function(b,d){this.enableButtons();
if(d){var c=b.responseJSON;if(c.success){this.fireEvent("wpmessage",chess.getPhrase("Draft Saved"));this.fireEvent("draftsupdated");this.currentModel.setMetadata({draft_id:c.response.draft_id});this.currentModel.setClean()}else{this.fireEvent("wpmessage",chess.getPhrase("Everything is up to date"))}}else{this.fireEvent("wperror",b.responseText)}}.bind(this)})},sendMessage:function(a){this.fireEvent("wpmessage",a)},sendError:function(a){this.fireEvent("wperror",a)},disableButtons:function(){this.views.saveDraftButton.setEnabled(false);this.views.publishButton.setEnabled(false)},enableButtons:function(){this.views.saveDraftButton.enable.delay(1000,this.views.saveDraftButton);this.views.publishButton.enable.delay(1000,this.views.publishButton)},showPositionSetup:function(){if(this.posSetup==undefined){this.posSetup=new chess.view.position.Dialog({submodule:"wordpress.position",layout:{centerIn:this.views.board},listeners:{setPosition:this.receiveNewPosition.bind(this)}});this.posSetup.on("setPosition",this.onNewPositionClick.bind(this))}this.posSetup.show()},receiveNewPosition:function(a){this.currentModel.setPosition(a)}});chess.wordpress.WordPressMessage=new Class({Extends:ludo.View,css:{"text-align":"right","padding-right":"5px",color:"#EF9A9A","font-weight":"normal","font-size":"12px","line-height":"25px"},submodule:"wordpress.wordpressmessage",autoHideDelay:3000,startTime:undefined,__rendered:function(){this.parent();this.els.message=jQuery('<div style="position:absolute;right:5px"></div>');this.getBody().append(this.els.message)},setController:function(a){this.parent(a);a.on("wperror",this.showError.bind(this));a.on("wpmessage",this.showMessage.bind(this))},showError:function(a){this.getBody().css("color","#EF9A9A");this.els.message.html(a);this.animateIn();this.autoHide()},showMessage:function(a){this.getBody().css("color","#AED581");this.els.message.html(a);this.animateIn();this.autoHide()},autoHide:function(){this.startTime=new Date().getTime();this.autoHideComplete.delay(this.autoHideDelay,this)},animateIn:function(){var a=this.els.message;a.css("top",this.getBody().height());a.animate({top:0},{duration:200})},animateOut:function(){this.els.message.animate({top:this.getBody().height()},{duration:200})},autoHideComplete:function(){var a=new Date().getTime()-this.startTime;if(a>=this.autoHideDelay){this.animateOut()}}});