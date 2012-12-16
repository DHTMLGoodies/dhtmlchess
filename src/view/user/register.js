chess.view.user.Register = new Class({
    Extends:chess.view.Form,
    type:'chess.view.user.Register',
    width:400,
    height:200,
    labelWidth:130,

        resizable:false,
    title:'Register',
    form : {

    },
    elements:[
        {
            type:'text',
            label:'Username',
            name:'nick',
            stretchField:true
        },
        {
            label:'E-mail',
            name:'email',
            type:'text',
            stretchField:true
        },
        {
            label:'Password',
            type:'password',
            stretchField:true
        },
        {
            label:'Repeat password',
            type:'password',
            stretchField:true
        }
    ],

    setController : function(controller){
        this.parent(controller);
    },

    ludoConfig:function (config) {
        this.parent(config);
    },

    ludoEvents:function () {
        this.parent();
        this.addEvent('ok', this.register.bind(this));
    },

    ludoRendered:function () {
        this.parent();
        this.messageItem = this.addChild({
            height:25,
            css:{
                'color':'red'
            }
        })
    },
    register:function () {
        var values = this.getValues();
        for (var key in values) {
            if (values[key].length === 0) {
                this.messageItem.setHtml('All fields required');
                return;
            }
        }
        if (values.password.length < 5) {
            this.messageItem.setHtml('Password too short - Minimum 5 characters');
            return;
        }
        if (values.password !== values.repeat_password) {
            this.messageItem.setHtml('Password does not match');
            return;
        }
        this.fireEvent('register', [ values ]);
        this.hide();
    },

    buttonClick:function (button) {
        this.fireEvent(button.value.toLowerCase(), [this.getValues()]);
        if (button.value.toLowerCase() === 'cancel') {
            this.hide();
        }
    }

});