chess.UserAvatarView = new Class({
    Extends: ludo.View,
    avatarSize: 32,
    auto:true,

    __construct: function (config) {
        this.parent(config);
        if (config.avatarSize != undefined) this.avatarSize = config.avatarSize;
        if (config.auto != undefined) this.auto = config.auto;
    },

    setAvatar: function (imageTag) {
        var src = imageTag.replace(/.*?src=["']([^"']+?)["'].*/gi, '$1');
        this.$b().css('background-image', 'url(' + src + ')');
    },

    __rendered: function () {
        this.parent();
        this.$b().addClass('wpc-avatar');
        if(this.auto)this.loadAvatar();
    },

    loadAvatar: function () {

        jQuery.ajax({
            url: ludo.config.getUrl(),
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'wpc_userinfo',
                size: this.avatarSize
            },
            complete: function (response, success) {

                if (success) {
                    var json = response.responseJSON;
                    this.setAvatar(json.response.avatar);
                } else {

                }

            }.bind(this)
        });

    }

});