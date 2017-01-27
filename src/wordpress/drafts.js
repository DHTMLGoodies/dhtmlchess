chess.wordpress.Drafts = new Class({
    Extends: ludo.dataSource.JSONArray,
    submodule:'wordpress.drafts',
    postData:{
        'action': 'list_drafts'
    }
});