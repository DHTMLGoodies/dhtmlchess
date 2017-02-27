// (C) dhtmlchess.com, Alf Kalleland 2017-02-27 01:31:41
/*
 * Copyright ©2017. dhtmlchess.com. All Rights Reserved.
 * This is a commercial software. See dhtmlchess.com for licensing options.
 *
 * You are free to use/try this software for 30 days without paying any fees.
 *
 * IN NO EVENT SHALL DHTML CHESS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL,
 * OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND
 * ITS DOCUMENTATION, EVEN IF DHTML CHESS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * DHTML CHESS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 * THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED HEREUNDER IS PROVIDED "AS IS".
 * DHTML CHESS HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 *
 */
 chess.WPTemplate=new Class({Extends:Events,renderTo:undefined,module:undefined,_ready:true,_loadCounter:0,th:undefined,themeObject:undefined,heading_tpl:undefined,initialize:function(a){this.renderTo=jQuery(a.renderTo);this.module=String.uniqueID();this.themeObject=chess.THEME;this.th=a.theme||a.defaultTheme;this.th="dc-"+this.th;if(a.heading_tpl!=undefined){this.heading_tpl=a.heading_tpl}if(a.css){var c=a.css.split(/;/g);jQuery.each(c,function(e,f){if(f){var d=f.split(/:/);this.renderTo.css(d[0],d[1])}}.bind(this))}if(!ludo.isMobile){if(a.width){this.renderTo.css("width",a.width)}if(a["float"]){this.renderTo.css("float",a["float"])}}chess.THEME_OVERRIDES=undefined;if(a.docRoot){ludo.config.setDocumentRoot(a.docRoot)}var b=a.theme;if(b){this._ready=false;jQuery("<link/>",{rel:"stylesheet",type:"text/css",href:ludo.config.getDocumentRoot()+"themes/"+b+".css",complete:function(){this.onload()}.bind(this)}).appendTo("head");jQuery.ajax({url:ludo.config.getDocumentRoot()+"themes/"+b+".js",dataType:"script",complete:function(){this.onload()}.bind(this)})}},onload:function(){this._loadCounter++;if(!this._ready&&this._loadCounter==2){this.render()}this._ready=this._loadCounter==2},canRender:function(){return this._ready}});window.chess.isWordPress=true;chess.WPGameTemplate=new Class({Extends:chess.WPTemplate,initialize:function(a){this.parent(a);this.model=a.model||undefined;this.gameId=a.gameId;if(!this.model&&!this.gameId){this.gameId=2}},loadGame:function(){if(this.gameId){jQuery.ajax({url:ludo.config.getUrl(),method:"post",cache:false,dataType:"json",data:{action:"game_by_id",id:this.gameId},complete:function(c,a){this.controller.currentModel.afterLoad();if(a=="success"){var d=c.responseJSON;if(d.success){var b=d.response;this.controller.currentModel.populate(b)}}else{this.fireEvent("wperrror",chess.getPhrase("Could not load game. Try again later"))}}.bind(this),fail:function(b,a){this.fireEvent(a)}.bind(this)})}else{if(this.model){this.controller.currentModel.populate(this.model)}}}});window.chess.isWordPress=true;chess.WPGame1=new Class({Extends:chess.WPGameTemplate,boardSize:undefined,initialize:function(b){this.parent(b);var a=this.renderTo.width();this.renderTo.css("height",Math.ceil(a-150+45+35));this.renderTo.css("position","relative");this.boardSize=a-150;this.bs=this.boardSize>400?this.boardSize:a;if(this.canRender()){this.render()}},render:function(){new chess.view.Chess({renderTo:jQuery(this.renderTo),cls:this.th,layout:{type:"linear",orientation:"vertical",height:"matchParent",width:"matchParent"},children:[{layout:{height:35,width:ludo.isMobile?"matchParent":this.boardSize},module:this.module,type:"chess.view.metadata.Game",tpl:this.heading_tpl||"{white} - {black}",cls:"metadata",css:{"text-align":"center","overflow-y":"auto","font-weight":"bold"}},{layout:{type:"linear",orientation:"horizontal",height:this.boardSize},children:[Object.merge({boardLayout:undefined,id:"tactics_board",type:"chess.view.board.Board",module:this.module,overflow:"hidden",pieceLayout:"svg3",boardCss:{border:0},labels:!ludo.isMobile,labelPos:"outside",layout:{weight:1,height:"wrap"},plugins:[Object.merge({type:"chess.view.highlight.Arrow"},this.arrow)]},this.board),{id:this.module+"-panel",name:"notation-panel",type:"chess.view.notation.Table",layout:{width:150},elCss:{"margin-left":"2px"},module:this.module}]},{css:{"margin-top":5},type:"chess.view.buttonbar.Bar",layout:{height:45,width:this.bs},module:this.module}]});this.controller=new chess.controller.Controller({applyTo:[this.module]});this.loadGame()}});chess.WPGame2=new Class({Extends:chess.WPGameTemplate,boardSize:undefined,initialize:function(b){this.parent(b);var a=this.renderTo.width();this.renderTo.css("height",a+275);this.boardSize=a;if(this.canRender()){this.render()}},render:function(){new chess.view.Chess({renderTo:jQuery(this.renderTo),cls:this.th,layout:{type:"linear",orientation:"vertical",height:"matchParent",width:"matchParent"},children:[{layout:{height:35,width:this.boardSize},module:this.module,type:"chess.view.metadata.Game",tpl:this.heading_tpl||"{white} - {black}",cls:"metadata",css:{"text-align":"center","overflow-y":"auto","font-size":"1em","font-weight":"bold"}},Object.merge({boardLayout:undefined,id:"tactics_board",type:"chess.view.board.Board",module:this.module,overflow:"hidden",pieceLayout:"svg3",boardCss:{border:0},labels:!ludo.isMobile,labelPos:"outside",layout:{weight:1,height:"wrap"},plugins:[Object.merge({type:"chess.view.highlight.Arrow"},this.arrow)]},this.board),{type:"chess.view.buttonbar.Bar",layout:{height:40,width:this.boardSize},module:this.module},{id:this.module+"-panel",name:"notation-panel",type:"chess.view.notation.Panel",layout:{height:200},elCss:{"margin-left":"2px"},module:this.module}]});this.controller=new chess.controller.Controller({applyTo:[this.module]});this.loadGame()}});window.chess.isWordPress=true;chess.WPGame3=new Class({Extends:chess.WPGameTemplate,boardSize:undefined,initialize:function(b){this.parent(b);var a=this.renderTo.width();
this.renderTo.css("height",a-150+42+35);this.boardSize=a-150;if(this.canRender()){this.render()}},render:function(){new chess.view.Chess({renderTo:jQuery(this.renderTo),cls:this.th,layout:{type:"linear",orientation:"vertical",height:"matchParent",width:"matchParent"},children:[{layout:{height:35,width:this.boardSize},module:this.module,type:"chess.view.metadata.Game",tpl:this.heading_tpl||"{white} - {black}",cls:"metadata",css:{"text-align":"center","overflow-y":"auto","font-size":"1em","font-weight":"bold"}},{layout:{type:"linear",orientation:"horizontal",height:this.boardSize},children:[Object.merge({boardLayout:undefined,id:"tactics_board",type:"chess.view.board.Board",module:this.module,overflow:"hidden",pieceLayout:"svg3",boardCss:{border:0},labels:!ludo.isMobile,labelPos:"outside",layout:{weight:1,height:"wrap"},plugins:[Object.merge({type:"chess.view.highlight.Arrow"},this.arrow)]},this.board),{id:this.module+"-panel",name:"notation-panel",type:"chess.view.notation.Table",layout:{width:150},elCss:{"margin-left":"2px"},module:this.module}]},{layout:{type:"linear",orientation:"horizontal",height:40,width:this.boardSize},css:{"margin-top":5},children:[{weight:1},{type:"chess.view.buttonbar.Bar",module:this.module,buttons:["start","previous"],width:85,buttonSize:function(a){return a}},{type:"chess.view.notation.LastMove",width:80,module:this.module},{type:"chess.view.buttonbar.Bar",module:this.module,buttons:["next","end"],width:85,buttonSize:function(a){return a}},{weight:1},{type:"chess.view.buttonbar.Bar",module:this.module,buttons:["flip"],width:42,buttonSize:function(a){return a*0.9}}]}]});this.controller=new chess.controller.Controller({applyTo:[this.module],examine:false,stockfish:ludo.config.getDocumentRoot()+"stockfish-js/stockfish.js"});this.loadGame()}});window.chess.isWordPress=true;chess.WPGame4=new Class({Extends:chess.WPGameTemplate,boardSize:undefined,initialize:function(b){this.parent(b);var a=this.renderTo.width();this.renderTo.css("height",a+40+35);this.boardSize=a;if(this.canRender()){this.render()}},render:function(){new chess.view.Chess({renderTo:jQuery(this.renderTo),cls:this.th,layout:{type:"linear",orientation:"vertical",height:"matchParent",width:"matchParent"},children:[{layout:{height:35,width:this.boardSize},module:this.module,type:"chess.view.metadata.Game",tpl:this.heading_tpl||"{white} - {black}",cls:"metadata",css:{"text-align":"center","overflow-y":"auto","font-size":"1em","font-weight":"bold"}},{layout:{type:"linear",orientation:"horizontal",height:this.boardSize},children:[Object.merge({boardLayout:undefined,id:"tactics_board",type:"chess.view.board.Board",module:this.module,overflow:"hidden",pieceLayout:"svg3",boardCss:{border:0},labels:!ludo.isMobile,labelPos:"outside",layout:{weight:1,height:"wrap"},plugins:[Object.merge({type:"chess.view.highlight.Arrow"},this.arrow)]},this.board)]},{layout:{type:"linear",orientation:"horizontal",height:40,width:this.boardSize},css:{"margin-top":5},children:[{weight:1},{type:"chess.view.buttonbar.Bar",module:this.module,buttons:["start","previous"],width:85,buttonSize:function(a){return a}},{type:"chess.view.notation.LastMove",width:80,module:this.module},{type:"chess.view.buttonbar.Bar",module:this.module,buttons:["next","end"],width:85,buttonSize:function(a){return a}},{weight:1},{type:"chess.view.buttonbar.Bar",module:this.module,buttons:["flip"],width:42,buttonSize:function(a){return a}}]}]});this.controller=new chess.controller.Controller({applyTo:[this.module]});this.loadGame()}});window.chess.isWordPress=true;chess.WPGame5=new Class({Extends:chess.WPGameTemplate,boardSize:undefined,buttonSize:45,boardWeight:1,notationWeight:1,initialize:function(b){this.parent(b);var a=this.renderTo.width();if(ludo.isMobile){this.notationWeight=0}this.boardSize=(a/(this.boardWeight+this.notationWeight));this.renderTo.css("height",this.boardSize+this.buttonSize);this.renderTo.css("position","relative");this.buttons=ludo.isMobile?["start","previous","next","end"]:["flip","start","previous","next","end"];this.configure();if(this.canRender()){this.render()}},configure:function(){this.board=Object.merge({boardLayout:undefined,vAlign:top,id:"tactics_board",type:"chess.view.board.Board",module:this.module,overflow:"hidden",pieceLayout:"svg_bw",background:{borderRadius:0},boardCss:{border:0},labels:!ludo.isMobile,labelPos:"outside",layout:{weight:this.boardWeight,height:"wrap"},plugins:[Object.merge({type:"chess.view.highlight.Arrow"},this.arrow)]},this.board);chess.THEME_OVERRIDES={"chess.view.board.Board":{background:{borderRadius:"1%"}},"chess.view.buttonbar.Bar":{borderRadius:"10%",styles:{button:{"fill-opacity":0,"stroke-opacity":0},image:{fill:"#777"},buttonOver:{"fill-opacity":0,"stroke-opacity":0},imageOver:{fill:"#555"},buttonDown:{"fill-opacity":0,"stroke-opacity":0},imageDown:{fill:"#444"},buttonDisabled:{"fill-opacity":0,"stroke-opacity":0},imageDisabled:{fill:"#555","fill-opacity":0.3}}}}},render:function(){new chess.view.Chess({renderTo:jQuery(this.renderTo),cls:this.th,layout:{type:"linear",orientation:"vertical",height:"matchParent",width:"matchParent"},children:[{layout:{height:this.boardSize,type:"linear",orientation:"horizontal"},children:ludo.isMobile?[this.board]:[this.board,{id:this.module+"-panel",name:"notation-panel",type:"chess.view.notation.Panel",layout:{weight:this.notationWeight,height:"matchParent"},elCss:{"margin-left":"2px"},module:this.module}]},{layout:{type:"linear",orientation:"horizontal",height:this.buttonSize},elCss:{"margin-top":10},children:ludo.isMobile?[{weight:1},{anchor:[0.5,0.5],type:"chess.view.buttonbar.Bar",buttons:["start","previous"],module:this.module,layout:{width:(this.buttonSize)*3},buttonSize:function(a){return a*0.9
}},{type:"chess.view.notation.LastMove",module:this.module,layout:{width:this.buttonSize*2},css:{border:"none"}},{anchor:[0.5,0.5],type:"chess.view.buttonbar.Bar",buttons:["next","end"],module:this.module,layout:{width:(this.buttonSize)*2},buttonSize:function(a){return a*0.9}},{weight:1}]:[{weight:1},{anchor:[1,0.5],type:"chess.view.buttonbar.Bar",buttons:this.buttons,module:this.module,layout:{width:(this.buttonSize-10)*5},buttonSize:function(a){return a*0.9}}]}]});this.controller=new chess.controller.Controller({applyTo:[this.module]});this.loadGame()}});window.chess.isWordPress=true;chess.WPViewer1=new Class({Extends:chess.WPTemplate,renderTo:undefined,pgn:undefined,controller:undefined,showLabels:undefined,module:undefined,boardSize:undefined,initialize:function(b){this.parent(b);this.renderTo=b.renderTo;var c=jQuery(this.renderTo);var a=c.width();if(ludo.isMobile){this.boardSize=a;c.css("height",Math.round(this.boardSize+340))}else{this.boardSize=a-150;c.css("height",Math.round(this.boardSize+375))}this.pgn=b.pgn;this.board=b.board||{};this.arrow=b.arrow||{};this.arrowSolution=b.arrowSolution||{};this.hint=b.hint||{};this.showLabels=!ludo.isMobile;if(this.canRender()){this.render()}},render:function(){new chess.view.Chess({cls:this.th,renderTo:jQuery(this.renderTo),layout:{type:"fill",height:"matchParent",width:"matchParent"},children:ludo.isMobile?this.mobileChildren():this.desktopChildren()});this.controller=new chess.controller.Controller({applyTo:[this.module],pgn:this.pgn.id,listeners:{}})},desktopChildren:function(){return[{layout:{type:"linear",orientation:"vertical"},children:[{layout:{height:35,width:this.boardSize},module:this.module,type:"chess.view.metadata.Game",tpl:this.heading_tpl||"{white} - {black}",cls:"metadata",css:{"text-align":"center","overflow-y":"auto","font-size":"1em","font-weight":"bold"}},{layout:{type:"linear",orientation:"horizontal",height:this.boardSize},children:[Object.merge({boardLayout:undefined,id:"tactics_board",type:"chess.view.board.Board",module:this.module,overflow:"hidden",pieceLayout:"svg3",boardCss:{border:0},labels:!ludo.isMobile,labelPos:"outside",layout:{weight:1,height:"wrap"},plugins:[Object.merge({type:"chess.view.highlight.Arrow"},this.arrow)]},this.board),{id:this.module+"-panel",name:"notation-panel",type:"chess.view.notation.Table",layout:{width:150},elCss:{"margin-left":"2px"},module:this.module}]},{type:"chess.view.buttonbar.Bar",layout:{height:40,width:this.boardSize},module:this.module},{title:this.pgn.name,module:this.module,layout:{height:300},type:"chess.WPGameGrid",css:{"overflow-y":"auto"},cols:["white","black","result"],dataSource:{id:"gameList",type:"chess.wordpress.GameList",module:this.module,autoload:true,postData:{pgn:this.pgn.id},listeners:{select:function(){ludo.$(this.module+"-panel").show()}.bind(this),load:function(a){if(a.length){ludo.get("gameList").selectRecord(a[0])}}},shim:{txt:""}}}]}]},mobileChildren:function(){return[{layout:{type:"linear",orientation:"vertical"},children:[Object.merge({boardLayout:undefined,id:"tactics_board",type:"chess.view.board.Board",module:this.module,overflow:"hidden",pieceLayout:"svg3",boardCss:{border:0},labels:!ludo.isMobile,labelPos:"outside",layout:{height:this.boardSize},plugins:[Object.merge({type:"chess.view.highlight.Arrow"},this.arrow)]},this.board),{layout:{height:40,type:"linear",orientation:"horizontal"},children:[{weight:1},{type:"chess.view.buttonbar.Bar",layout:{height:40,width:90},module:this.module,buttons:["start","previous"],buttonSize:function(a){return a*0.9}},{type:"chess.view.notation.LastMove",module:this.module,layout:{width:70},css:{"padding-top":4,"padding-bottom":4,border:"none"}},{type:"chess.view.buttonbar.Bar",layout:{height:40,width:90},module:this.module,buttons:["next","end"],buttonSize:function(a){return a*0.9}},{weight:1}]},{title:this.pgn.name,module:this.module,layout:{height:300},type:"chess.WPGameGrid",css:{"overflow-y":"auto"},cols:["white","black","result"],dataSource:{id:"gameList",type:"chess.wordpress.GameList",module:this.module,autoload:true,postData:{pgn:this.pgn.id},listeners:{load:function(a){if(a.length){ludo.get("gameList").selectRecord(a[0])}}},shim:{txt:""}}}]}]}});chess.WPGameGrid=new Class({Extends:chess.view.gamelist.Grid,headerMenu:false,dataSource:{type:"ludo.dataSource.JSONArray",autoload:false,postData:{action:"list_of_games"}},emptyText:chess.getPhrase("No games"),loadMessage:chess.getPhrase("Loading games..."),cols:["white","black","round","result","last_moves"],__construct:function(a){this.cols=a.cols||this.cols;this.parent(a)},loadGames:function(){if(this.getDataSource().postData.pgn){this.load()}},selectGame:function(a){this.fireEvent("selectGame",[a,this.getDataSource().postData.pgn])}});window.chess.isWordPress=true;chess.WPTactics1=new Class({Extends:chess.WPTemplate,renderTo:undefined,pgn:undefined,controller:undefined,showLabels:undefined,module:undefined,boardSize:undefined,boardId:undefined,random:false,initialize:function(b){this.parent(b);
this.renderTo=b.renderTo;var c=jQuery(this.renderTo);var a=c.width();c.css("height",Math.round(a+130));this.boardSize=a;if(b.random!=undefined){this.random=b.random}this.pgn=b.pgn;this.board=b.board||{};this.arrow=b.arrow||{};this.arrowSolution=b.arrowSolution||{};this.hint=b.hint||{};this.module=String.uniqueID();this.boardId="dc-"+String.uniqueID();this.showLabels=!ludo.isMobile;if(this.renderTo.substr&&this.renderTo.substr(0,1)!="#"){this.renderTo="#"+this.renderTo}if(this.canRender()){this.render()}},render:function(){new chess.view.Chess({cls:this.th,renderTo:jQuery(this.renderTo),layout:{type:"fill",height:"matchParent",width:"matchParent"},children:[{layout:{type:"linear",orientation:"vertical"},children:[{height:35,module:this.module,type:"chess.view.metadata.Game",tpl:this.heading_tpl||"#{index} - {white}",cls:"metadata",css:{"text-align":"center","overflow-y":"auto","font-size":"1.2em","font-weight":"bold"}},{layout:{type:"linear",orientation:"horizontal"},css:{"margin-top":2},height:30,children:[{weight:1},{module:this.module,layout:{width:80},type:"chess.view.button.TacticHint",value:chess.getPhrase("Hint")},{module:this.module,layout:{width:80},type:"chess.view.button.TacticSolution",value:chess.getPhrase("Solution")},{module:this.module,layout:{width:80},type:"form.Button",value:chess.getPhrase("Next Game"),listeners:{click:function(){this.controller.loadNextGameFromFile()}.bind(this)}},{weight:1}]},Object.merge({boardLayout:undefined,id:this.boardId,type:"chess.view.board.Board",module:this.module,overflow:"hidden",pieceLayout:"svg3",boardCss:{border:0},labels:!ludo.isMobile,labelPos:"outside",layout:{height:this.boardSize},plugins:[Object.merge({type:"chess.view.highlight.Arrow"},this.arrow),Object.merge({type:"chess.view.highlight.ArrowTactic"},this.arrowSolution),Object.merge({type:"chess.view.highlight.SquareTacticHint"},this.hint)]},this.board),{height:50,module:this.module,comments:false,figurines:"svg_egg",type:"chess.view.notation.TacticPanel"}]}]});var b="wp_"+this.pgn.id+"_tactics";new chess.view.message.TacticsMessage({renderTo:jQuery(document.body),module:this.module,autoHideAfterMs:1000,autoHideWelcomeAfterMs:1000,css:{"background-color":"#fff","border-radius":"5px","line-height":"50px"},layout:{centerIn:this.boardId,width:300,height:50}});this.controller=new chess.controller.TacticControllerGui({applyTo:[this.module],pgn:this.pgn.id,alwaysPlayStartingColor:true,autoMoveDelay:400,gameEndHandler:function(c){c.loadNextGameFromFile()},listeners:{startOfGame:function(){ludo.getLocalStorage().save(b,this.controller.getCurrentModel().getGameIndex())}.bind(this)}});var a=ludo.getLocalStorage().get(b,0);if(isNaN(a)){a=0}a=Math.max(0,a);if(a!=undefined){this.controller.getCurrentModel().setGameIndex(a)}else{a=0}if(this.random){this.controller.loadRandomGame()}else{this.controller.loadGameFromFile(a)}}});chess.WPFen=new Class({Extends:chess.WPTemplate,fen:undefined,initialize:function(b){this.parent(b);var a=this.renderTo.width();this.renderTo.css("height",a);this.fen=b.fen;if(this.canRender()){this.render()}},render:function(){new chess.view.Chess({cls:this.th,renderTo:jQuery(this.renderTo),layout:{type:"fill"},children:[{type:"chess.view.board.Board",fen:this.fen,layout:{width:"matchParent",height:"matchParent"}}]})}});chess.computer.Elo=new Class({K:30,PROVISIONAL:8,db:undefined,MIN_ELO:800,clearAll:function(){this.db.empty()},initialize:function(){this.db=ludo.getLocalStorage()},hasPlayedBefore:function(){return this.db.get("played","0")=="1"},getGameType:function(a,c){var b=a+(c*30);if(b<60*3){return"bullet"}if(b<=60*8){return"blitz"}return"classical"},getEloByTime:function(b,a){return this.getElo(this.getGameType(b,a))},getElo:function(a){return Math.max(this.MIN_ELO,this.db.getNumeric("elo"+a,1200))},saveResult:function(m,a,l,b){this.db.save("played","1");var i=this.incrementGames(l);var d;if(i<=this.PROVISIONAL){var j=this.db.get("provisional"+l,[]);var h=m==-1?a-400:m==0?a:a+400;h=Math.max(this.MIN_ELO,h);j.push(h);this.db.save("provisional"+l,j);var g=0;jQuery.each(j,function(c,e){g+=e});d=Math.max(this.MIN_ELO,g/j.length)}else{var f=this.getElo(l);if(b=="black"){a*=1.05}else{a-=(a*0.05)}var k=this.getRatingAdjustment(f,a,m);d=f+k}return this.db.save("elo"+l,d)},getRatingAdjustment:function(c,b,a){a+=1;a/=2;var d=this.getExpectedScore(c,b);return this.K*(a-d)},getExpectedScore:function(a,d){var c=Math.pow(10,a/400);var b=Math.pow(10,d/400);return c/(c+b)},incrementGames:function(a){var b=this.countGames(a)+1;this.db.save("games"+a,b);return b},countGames:function(a){return this.db.getNumeric("games"+a,0)}});chess.computer.Clock=new Class({Extends:Events,time:undefined,increment:undefined,turn:"white",savedTime:undefined,started:false,initialize:function(){this.tick()},tick:function(){if(this.started){this.validateTime();this.onChange()}this.tick.delay(100,this)},stop:function(){this.time[this.turn]=this.getTime(this.turn);this.started=false;this.savedTime=new Date().getTime();this.onChange()
},validateTime:function(){var a=this.getTime(this.turn);if(a==0){this.time[this.turn]=this.getTime(this.turn);this.onChange();this.fireEvent("end",this.turn);this.started=false}},wTime:function(){return this.getTime("white")},bTime:function(){return this.getTime("black")},inc:function(){return this.increment},setTime:function(b,a){a=a||0;this.time={};this.time.white=b*1000;this.time.black=b*1000;this.increment=a*1000;this.onChange()},start:function(b,a){if(arguments.length==2){this.setTime(b,a)}this.turn="white";this.savedTime=new Date().getTime();this.started=true;this.onChange()},tap:function(){this.time[this.turn]=this.getTime(this.turn)+this.increment;this.turn=this.turn=="white"?"black":"white";this.savedTime=new Date().getTime();this.onChange()},getTime:function(a){var b=this.time[a];if(this.turn==a&&this.started){b-=new Date().getTime()-this.savedTime}return Math.max(0,b)},onChange:function(){this.fireEvent("change",[this.turn,this.timeAsObject("white"),this.timeAsObject("black")])},timeAsObject:function(c){var f=this.getTime(c);var b=f<10000?parseInt((f/100)%10):undefined,g=parseInt((f/1000)%60),e=parseInt((f/(1000*60))%60),a=parseInt((f/(1000*60*60))%24);var d={h:a,m:this.pad(e,2),s:this.pad(g,2),d:b,totalSeconds:f/1000};d.string=(d.h>0?d.h+":":"")+d.m+":"+d.s+(d.totalSeconds<10?":"+d.d:"");return d},pad:function(a,b){var c=a+"";while(c.length<b){c="0"+c}return c}});chess.computer.ClockView=new Class({Extends:ludo.View,color:undefined,module:"chess",submodule:"computer.clockview",elo:undefined,pos:undefined,lastColor:undefined,__construct:function(a){this.parent(a);this.color=a.color;this.pos=a.pos},setColor:function(a){this.color=a;this.$b().removeClass("clock-turn");this.lastColor=undefined},__rendered:function(){this.parent();this.$e.addClass("dhtml-chess-clock");this.showTime()},setController:function(a){this.parent(a);a.clock.on("change",this.update.bind(this));this.elo=a.elo},update:function(b,a,c){var d=this.color=="white"?a:c;if(b!=this.lastColor){this.$b().removeClass("clock-turn");if(b==this.color){this.$b().addClass("clock-turn")}}this.$b().html(d.string);this.lastColor=b},resize:function(a){this.parent(a);this.getBody().css({"line-height":a.height+"px","font-size":(a.height*0.6)+"px"})},showTime:function(a){if(a==undefined){this.getBody().html("00:00")}else{}}});chess.computer.GameDialog=new Class({Extends:ludo.dialog.Dialog,module:"chess",submodule:"chess.computer.gamedialog",autoRemove:false,layout:{width:300,height:300,type:"table",simple:true,columns:[{weight:1},{width:50},{weight:1},{width:50}]},css:{padding:10},buttonConfig:"Ok",title:chess.getPhrase("New Game"),elo:undefined,color:undefined,modal:false,__construct:function(a){this.parent(a);this.elo=new chess.computer.Elo()},__rendered:function(){this.parent();this.$b().addClass("dhtml-chess-comp-dialog");this.on("ok",this.onNewGame.bind(this));this.selectColor("white");this.child["color-white"].$b().on("click",function(){this.selectColor("white")}.bind(this));this.child["color-black"].$b().on("click",function(){this.selectColor("black")}.bind(this))},selectColor:function(b){this.color=b;var a="dhtml-chess-comp-dialog-selected-color";this.child["color-black"].$b().removeClass(a);this.child["color-white"].$b().removeClass(a);this.child["color-"+b].$b().addClass(a)},__children:function(){return[{type:"form.Label",label:chess.getPhrase("Your color:"),layout:{colspan:4}},{name:"color-white",layout:{colspan:2,height:50},elCss:{margin:2},css:{"border-radius":"5px","background-color":"#CCC",color:"#444",cursor:"pointer","line-height":"45px",border:"2px solid transparent","text-align":"center"},html:chess.getPhrase("White")},{name:"color-black",layout:{colspan:2,height:50},elCss:{margin:"2px"},css:{"border-radius":"5px",cursor:"pointer","background-color":"#777",color:"#fff","line-height":"45px",border:"3px solid transparent","text-align":"center"},html:chess.getPhrase("Black")},{type:"form.Label",label:chess.getPhrase("Opponent rating:"),labelFor:"name",layout:{colspan:2}},{type:"form.Number",name:"stockfishElo",placeholder:chess.getPhrase("ex: 1400")},{layout:{colspan:1}},{layout:{colspan:4,height:20}},{type:"form.Label",label:chess.getPhrase("Time"),css:{"font-size":"1.3em"},layout:{colspan:2}},{type:"form.Label",label:chess.getPhrase("Increment"),layout:{colspan:2}},{type:"form.Select",name:"game-time",value:5,dataSource:{data:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,20,30,45,60,90,120]},listeners:{change:this.onTimeChange.bind(this)}},{html:chess.getPhrase("min"),css:{padding:5}},{type:"form.Select",name:"game-inc",value:3,dataSource:{data:[0,1,2,3,5,10,12,15,30]},listeners:{change:this.onTimeChange.bind(this)}},{html:chess.getPhrase("sec"),css:{padding:5}},{elCss:{"margin-top":10},css:{"text-align":"center"},name:"your-elo",layout:{colspan:4},html:"Your ratings"}]},onTimeChange:function(){var b=this.child["game-time"].val()/1;var d=this.child["game-inc"].val()/1;var a=this.elo.getGameType(b*60,d);var c=Math.round(this.elo.getElo(a));this.child["your-elo"].html("Your rating: "+c+" ("+a+")");
this.child.stockfishElo.val(c)},setController:function(a){this.parent(a);this.controller.on("newgamedialog",this.show.bind(this))},show:function(){this.parent();this.onTimeChange()},onNewGame:function(){this.fireEvent("newGame",{time:this.child["game-time"].val()/1,inc:this.child["game-inc"].val()/1,elo:this.child.stockfishElo.val()/1,color:this.color})}});chess.computer.DialogTimeButton=new Class({Extends:ludo.View,__construct:function(a){this.parent(a);this.time=a.time}});chess.computer.ComputerStatusDialog=new Class({Extends:ludo.dialog.Dialog,module:"chess",modal:true,submodule:"chess.computer.computerstatusdialog",title:"Loading Stockfish JS",updateFn:undefined,layout:{type:"relative",width:300,height:100},__children:function(){return[{name:"status",layout:{width:"matchParent",centerVertical:true},css:{"text-align":"center"}}]},setController:function(a){this.parent(a);this.updateFn=function(c,b){this.child.status.html(c);if(b){this.hide.delay(100,this)}}.bind(this);a.on("enginestatus",this.updateFn)},remove:function(){if(this.updateFn){this.controller.off("enginestatus",this.updateFn);this.updateFn=undefined}this.parent()}});chess.computer.GameOverDialog=new Class({Extends:ludo.dialog.Dialog,module:"chess",submodule:"chess.computer.gameoverdialog",autoRemove:false,hidden:true,layout:{width:300,height:200,type:"linear",orientation:"vertical"},buttonBar:{children:[{name:"rematch",value:chess.getPhrase("Rematch")},{value:chess.getPhrase("Exit")}]},__children:function(){return[{name:"title",css:{"margin-top":15,"text-align":"center","font-weight":"bold","font-size":"1.5em","line-height":"25px"},layout:{height:50}},{css:{"text-align":"center"},name:"rating"}]},__rendered:function(){this.parent();this.getButton("rematch").on("click",this.onNewGameClick.bind(this))},onNewGameClick:function(){this.fireEvent("newgame")},setController:function(a){this.parent(a);a.on("gameover",this.onGameOver.bind(this))},onGameOver:function(c,a,b){this.show();var e=c==1?chess.getPhrase("You Won"):c==0?chess.getPhrase("Game Drawn"):chess.getPhrase("You lost");this.setTitle(e);this.child.title.$b().removeClass("title-win");this.child.title.$b().removeClass("title-draw");this.child.title.$b().removeClass("title-loss");this.child.title.html(e);var d=b-a;if(c==0){this.child.title.$b().addClass("title-draw")}else{if(c==1){this.child.title.$b().addClass("title-win")}else{this.child.title.$b().addClass("title-loss")}}if(d>1){d='<span class="rating-change-win">+'+d+"</span>"}else{if(d==0){d='<span class="rating-change-draw">'+d+"</span>"}else{d='<span class="rating-change-loss">'+d+"</span>"}}this.child.rating.html(chess.getPhrase("New rating")+': <span class="new-rating">'+b+"</span> ("+d+")")}});chess.controller.PlayStockFishController=new Class({Extends:chess.controller.Controller,stockfish:undefined,history:undefined,engineStatus:{},whiteTime:1000*60,blackTime:1000*60,whiteIncrement:1,blackIncrement:1,debug:true,playerColor:"white",elo:undefined,clock:undefined,playingStrength:undefined,stockfishElo:undefined,gameType:undefined,turn:undefined,isPlaying:false,__construct:function(a){if(a.playerColor!=undefined){this.playerColor=a.playerColor}if(a.stockfish!=undefined){this.stockfish=a.stockfish}if(a.thinkingTime!=undefined){this.thinkingTime=a.thinkingTime}this.elo=new chess.computer.Elo();this.clock=new chess.computer.Clock();this.clock.on("end",this.onTimesUp.bind(this));this.parent(a);this.history=[]},addView:function(a){this.parent(a);switch(a.submodule){case"chess.computer.gamedialog":a.on("newGame",this.prepareNewGame.bind(this));break;case"computer.clockview":if(!a.isHidden()){if(a.pos=="top"){this.views.clockTop=a}else{this.views.clockBottom=a}}break;case"chess.computer.gameoverdialog":a.on("newgame",function(){this.fireEvent("newgamedialog")}.bind(this));break}},getSkillLevel:function(){if(this.stockfishElo<1400){return 0}var a=this.stockfishElo;if(a>2800){return 20}if(a>2700){return 19}if(a>2600){return 17}if(a>2500){return 15}if(a>2400){return 13}if(a>2300){return 11}if(a>2200){return 10}if(a>2100){return 9}if(a>2000){return 8}if(a>1900){return 6}if(a>1800){return 5}if(a>1700){return 4}if(a>1600){return 3}if(a>1500){return 2}return 1},prepareNewGame:function(a){this.turn="white";this.playerColor=a.color;this.stockfishElo=a.elo;this.history=[];this.clock.setTime(a.time*60,a.inc);this.clock.start();this.currentModel.newGame();this.gameType=this.elo.getGameType(a.time*60,a.inc);this.playingStrength=this.elo.getEloByTime(a.time*60,a.inc);this.isPlaying=true;console.log("stockfish",this.getSkillLevel());this.uciCmd("setoption name Mobility (Middle Game) value 150");this.uciCmd("setoption name Mobility (Endgame) value 150");this.uciCmd("setoption name Contempt Factor value 0");this.uciCmd("setoption name UCI_LimitStrength value 1200");this.uciCmd("setoption name Cowardice value 80");this.uciCmd("setoption name Skill Level value "+this.getSkillLevel());this.uciCmd("ucinewgame");if(a.color=="white"){this.views.board.flipToWhite();this.views.clockTop.setColor("black");
this.views.clockBottom.setColor("white")}else{this.views.board.flipToBlack();this.views.clockTop.setColor("white");this.views.clockBottom.setColor("black")}console.log(this.views.clockTop.id,this.views.clockTop.color);console.log(this.views.clockBottom.id,this.views.clockBottom.color);this.prepareMove()},promotion:function(a){},createEngine:function(){try{var b=this;this.engine=new Worker(this.stockfish);this.fireEvent("enginestatus",chess.getPhrase("loading StockfishJS"));this.uciCmd("uci");this.uciCmd("ucinewgame");this.engine.onmessage=function(c){var k=c.data;if(k=="uciok"){b.fireEvent("enginestatus",chess.getPhrase("StockfishJS loaded. Loading Opening Book"));if(!b.engineStatus.engineLoaded){b.engineStatus.engineLoaded=true;jQuery.ajax({url:ludo.config.getUrl()+"/stockfish-js/book.bin",complete:function(l){this.engine.postMessage({book:l.responseText});this.fireEvent("enginestatus",[chess.getPhrase("Stockfish Ready"),true]);this.fireEvent("newgamedialog")}.bind(b)})}}else{if(k=="readyok"){b.engineStatus.engineReady=true}else{var h=k.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);if(h){var f=h[1]+h[2]+(h[3]!=undefined?h[3]:"");if(b.turn!=b.playerColor){b.currentModel.move({from:h[1],to:h[2],promoteTo:h[3]})}}if(h=k.match(/^info .*\bscore (\w+) (-?\d+)/)){var d=k.replace(/.*pv(.+?)$/g,"$1").trim();var j=k.replace(/.*nps.*?([0-9]+?)[^0-9].+/g,"$1");var g=k.replace(/.*?depth ([0-9]+?)[^0-9].*/g,"$1").trim();var i={depth:g,bestMoves:d,nps:j,mate:false,currentPly:b.currentPly};if(h[1]=="cp"){var e=parseInt(h[2])*(b.colorToMove=="white"?1:-1);e=(e/100).toFixed(2)}else{if(h[1]=="mate"){i.mate=h[2]*(b.colorToMove=="white"?1:-1);e="#"+h[2]}}i.score=e;b.fireEvent("engineupdate",i)}}}};this.engine.error=function(c){this.fireEvent("message","Error from background worker:"+c.message)}.bind(this)}catch(a){this.backgroundEngineValid=false}},newGame:function(){this.history=[];this.currentModel.newGame();this.start();this.prepareMove()},start:function(){this.uciCmd("ucinewgame");this.uciCmd("isready");this.engineStatus.engineReady=false;this.engineStatus.search=null;this.prepareMove()},prepareMove:function(){var a=this.currentModel.turn();if(a!=this.playerColor){if(this.history==undefined){this.history=[]}this.uciCmd("position startpos moves "+this.history.join(" "));if(this.playingStrength<=1200){this.uciCmd("go depth "+this.strengthToDepth())}else{this.uciCmd("go wtime "+this.getWTime()+" winc "+this.getInc("white")+" btime "+this.getBTime()+" binc "+this.getInc("black"))}}},getWTime:function(){if(this.playerColor=="white"){return this.clock.wTime()}return this.strengthToTime()},getBTime:function(){if(this.playerColor=="black"){return this.clock.bTime()}return this.strengthToTime()},strengthToTime:function(){var a=this.stockfishElo;if(a<=800){return 500}if(a<=1000){return 1000}if(a<=1200){return 2000}if(a<=1400){return 3000}if(a<=1500){return 4000}if(a<=1600){return 5000}if(a<=1700){return 7000}if(a<=1800){return 9000}if(a<=1900){return 12000}return 20000},getInc:function(a){if(this.playerColor==a){return this.clock.inc()}return 0},strengthToDepth:function(){var b=this.stockfishElo;var c;for(var a in this._strengthToDepths){if(b<=a){c=this._strengthToDepths[a];break}}if(c==undefined){c=20}return c},_strengthToDepths:{800:1,900:2,1000:3,1200:4,1300:5,1400:6,1600:8,1700:10,1800:12,1900:13,2000:14,2100:16,2200:18,2250:20,2300:21,2400:22,2500:23,2600:23},uciCmd:function(a){this.engine.postMessage(a)},modelEventFired:function(d,c,b){if(d==="newMove"||d=="newGame"){if(d=="newGame"){if(this.playerColor=="white"){this.views.board.flipToWhite()}else{this.views.board.flipToBlack()}if(this.engine==undefined){this.createEngine()}}var e=c.turn();if(d=="newMove"){this.clock.tap();this.turn=this.turn=="white"?"black":"white";if(this.history==undefined){this.history=[]}this.history.push(b.from+b.to+(b.promoteTo?b.promoteTo:""));this.start();if(e!=this.playerColor){this.prepareMove()}}if(c.getResult()!=0){var a=c.getResult();this.onGameOver(a);return}if(e===this.playerColor){this.views.board.enableDragAndDrop(c)}else{this.views.board.disableDragAndDrop();if(d=="newGame"){this.prepareMove()}}}},onGameOver:function(a){if(!this.isPlaying){return}this.elo.saveResult(a,this.stockfishElo,this.gameType,this.playerColor);var c=Math.round(this.elo.getElo(this.gameType));var b=this.playerColor=="black"?a*-1:a;this.fireGameOverEvent.delay(300,this,[b,Math.round(this.playingStrength),c]);this.clock.stop();this.isPlaying=false},fireGameOverEvent:function(b,c,a){this.fireEvent("gameover",[b,c,a])},onTimesUp:function(a){this.onGameOver(a=="white"?-1:1)},claimDraw:function(){if(this.currentModel.canClaimDraw()){this.onGameOver(0)}},resign:function(){this.onGameOver(this.playerColor=="white"?-1:1)}});window.chess.isWordPress=true;chess.WPComp1=new Class({Extends:chess.WPTemplate,boardId:undefined,boardSize:undefined,isPreview:false,initialize:function(b){this.parent(b);var e=jQuery(this.renderTo);var a=e.width();var d=(a+50)/(a+200);var c=ludo.isMobile?a+150:a*d;
e.css("height",Math.round(c));if(b.isPreview){this.isPreview=b.isPreview}this.boardSize=ludo.isMobile?a:a-200;this.boardId="dhtml-chess-"+String.uniqueID();if(this.canRender()){this.render()}},render:function(){new chess.view.Chess({renderTo:jQuery(this.renderTo),layout:{width:"matchParent",height:"matchParent",type:"linear",orientation:"vertical"},children:[{hidden:!ludo.isMobile,type:"chess.computer.ClockView",module:this.module,color:"white",pos:"top",css:{"text-align":"center"},layout:{height:50,width:150,anchor:0.5,alignTop:"board",rightOf:"board"}},{layout:{weight:1,type:"linear",orientation:"horizontal"},children:[{id:this.boardId,type:"chess.view.board.Board",pieceLayout:"svg_egg",boardLayout:"wood",module:this.module,padding:ludo.isMobile?"1%":"2.5%",labels:!ludo.isMobile,background:{borderRadius:"1%",paint:{fill:"#444"}},layout:{height:"matchParent",weight:1},plugins:[{type:"chess.view.highlight.Arrow"}]},{width:205,hidden:ludo.isMobile,css:{"margin-left":5},layout:{type:"linear",orientation:"vertical"},children:[{id:"clockTop",module:this.module,type:"chess.computer.ClockView",color:"white",pos:"top",layout:{height:50,alignTop:"board",rightOf:"board"}},{weight:1},{id:"clockBottom",module:this.module,type:"chess.computer.ClockView",color:"black",pos:"bottom",layout:{height:50,alignBottom:"board",rightOf:"board"}}]}]},{hidden:!ludo.isMobile,type:"chess.computer.ClockView",module:this.module,color:"white",pos:"bottom",css:{"text-align":"center"},layout:{anchor:0.5,height:50,width:150,alignTop:"board",rightOf:"board"}},{css:{"margin-top":5},layout:{height:35,width:this.boardSize,type:"linear",orientation:"horizontal"},children:[{weight:1},{type:"form.Button",module:this.module,value:"Draw",listeners:{click:function(){this.controller.claimDraw()}.bind(this)}},{type:"chess.view.notation.LastMove",module:this.module,css:{"border-radius":"999px","background-color":"#ddd",color:"#444","border-color":"1px solid "+ludo.$C("border")},layout:{width:100,height:40}},{type:"form.Button",value:"Resign",module:this.module,listeners:{click:function(){this.controller.resign()}.bind(this)}},{weight:1}]},{module:this.module,submodule:"message",layout:{height:30}}]});this.controller=new chess.controller.PlayStockFishController({applyTo:[this.module],stockfish:ludo.config.getDocumentRoot()+"/stockfish-js/stockfish.js",playerColor:"white",listeners:{start:this.onNewGame.bind(this),engineupdate:this.updateMove.bind(this)},thinkingTime:3000});if(!this.isPreview){new chess.computer.GameOverDialog({module:this.module,layout:{centerIn:ludo.$(this.boardId)},movable:false,resizable:false});var b=new chess.computer.GameDialog({module:this.module,hidden:true,layout:{centerIn:ludo.$(this.boardId)},movable:false,resizable:false});var a=new chess.computer.ComputerStatusDialog({module:this.module,layout:{centerIn:ludo.$(this.boardId)},movable:false,resizable:false});a.show()}},setThinkingTime:function(a){this.controller.setThinkingTime(a)},updateMove:function(a){},onNewGame:function(a){if(a=="black"){ludo.get(this.boardId).flipToBlack()}else{ludo.get(this.boardId).flipToWhite()}}});