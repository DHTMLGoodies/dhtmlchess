<html>
<head>

<script type="text/javascript" src="../../jquery/jquery-3.1.0.min.js"></script>
    <script type="text/javascript" src="cssjson.js"></script>
    <script type="text/javascript">
    $.ajax({
        url:'style.css',
        complete:function(content) {
            var css = content.responseText;

            var json = CSSJSON.toJSON(css);

            var cssRules = {};

            jQuery.each(json.children, function(key, rules){
                cssRules[key] = rules.attributes;

            });
            console.log(json.children);

            $.ajax({
                method:'post',
                url:'controller.php',
                data:{
                    save:'1',
                    data:JSON.stringify(cssRules)
                },
                complete:function(){
                    console.log('completed', arguments)
                }
            });

        }


    });
    </script>

</head>
</html>