/**
 * Displays seek form.
 * @namespace seek
 * @class View
 */
chess.view.seek.View = new Class({
    Extends:ludo.View,
    model:{
        name:'Seek',
        columns:['from_elo','to_elo','time','rated']
    },
    layout:{
        type:'linear',
        orientation:'vertical',
        validator:function(values){
            return values['from_elo'] < values['to_elo'];
        }
    },
    children:[
        {
            type:'form.Select',
            label:chess.getPhrase('Time'),
            suffix:'days',
            value:'1',
            dataSource:{
                type:'dataSource.Collection',
                resource:'TimeControl',
                service:'list',
                arguments:'correspondence'
            }
        },
        {
            type:'form.Number',
            label:chess.getPhrase('From elo'),
            minValue:500,
            maxValue:4000
        },
        {
            type:'form.Number',
            label:chess.getPhrase('To elo'),
            minValue:500,
            maxValue:4000
        },
        {
            type:'form.Checkbox',
            label:chess.getPhrase('Rated'),
            value:'1',
            checked:true
        }
    ]
});
