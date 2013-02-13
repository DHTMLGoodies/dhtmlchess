/**
 * Displays seek form.
 * @namespace seek
 * @class View
 */
chess.seek.View = new Class({
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
            label:'Time:',
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
            label:'From elo',
            minValue:500,
            maxValue:4000
        },
        {
            type:'form.Number',
            label:'From elo',
            minValue:500,
            maxValue:4000
        },
        {
            type:'form.Checkbox',
            label:'Rated',
            value:'1',
            checked:true
        }
    ]
});
