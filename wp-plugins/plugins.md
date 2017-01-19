##Local Paths
To determine the local server path to your plugin, you’ll use the plugin_dir_path() function. This function extracts the physical location relative to the plugins directory from its file name.

```php
<?php echo plugin_dir_path( __FILE__ ); ?>
```

You can see that you pass the __FILE__ PHP constant to the plugin_dir_path() function. This returns the full local server path to your plugin directory:

URL PATHS
To determine the full URL to any file in your plugin directory, you’ll use the plugins_url() function as shown here:

```php
<?php echo '<img src="' .plugins_url( 'images/icon.png', __FILE__ ). '">'; ?>
```

You can see the plugins_url() function accepts two parameters. The first parameter is the path relative to the plugins URL. The second parameter is the plugin file that you want to be relative to. In this case, you’ll use the __FILE__ PHP constant. The preceding example will return a full URL to your plugin’s icon.png file located in the images directory, as shown here:

```php
<img src="http://example.com/wp-content/plugins/halloween-plugin/images/icon.png">
```


###Other functions

* admin_url() — Admin URL (http://example.com/wp-admin/)
* site_url() — Site URL for the current site (http://example.com)
* home_url() — Home URL for the current site (http://example.com)
* includes_url() — Includes directory URL (http://example.com/wp-includes/)
* content_url() — Content directory URL (http://example.com/wp-content/)
* wp_upload_dir() — Returns an array with location information on the configured uploads directory


###Hooks

```
<?php add_action( $tag, $function_to_add, $priority, $accepted_args ); ?>
```


Two types of hooks can be used: actions and filters.

* Action hooks are triggered by events in WordPress. For example, an Action hook is triggered when a new post is published
* Filter hooks are used to modify WordPress content before saving it to the database or displaying it to the screen


####Filter hook in action

```
<?php add_filter( 'the_content', 'prowp_function' ); ?>
```

The add_filter() function is used to execute a Filter action. You are using the filter called the_content, which is the filter for your post content. This tells WordPress that every time the content is displayed, it needs to pass through your custom function called prowp_function(). The add_filter() function can accept four parameters:

1. filter_action (string): The filter to use
2. custom_filter_function (string): The custom function to pass the filter through
3. priority (integer): The priority in which this filter should run. When multiple callback functions are attached to the same hook, the priority parameter determines the execution order
4. accepted args (integer): The number of arguments the function accepts

Here’s an example of the_content filter in action:

```
<?php
add_filter( 'the_content', 'prowp_profanity_filter' );

function prowp_profanity_filter( $content ) {

    $profanities = array( 'sissy', 'dummy' );
    $content= str_ireplace( $profanities, '[censored]', $content );

    return $content;

}
?>
```

####The Action hook

The Action hook is triggered by events in WordPress.

WordPress doesn’t require any return values from your Action hook function; the WordPress Core just notifies your code that a specific event has taken place

The add_action() function accepts four parameters just like the add_filter() function

Example:

```
<?php
add_action( 'comment_post', 'prowp_email_new_comment' );

function prowp_email_new_comment() {
    wp_mail( 'me@example.com', 'New blog comment',
    'There is a new comment on your website: http://example.com' );
}
?>
```

####Some of the more common Filter hooks are:

* the_content — Applied to the content of the post or page before displaying
* the_content_rss — Applied to the content of the post or page for RSS inclusion
* the_title — Applied to the post or page title before displaying
* comment_text — Applied to the comment text before displaying
* wp_title — Applied to the page <title> before displaying
* the_permalink — Applied to the permalink URL

```
<?php
add_filter ( 'the_content', 'prowp_subscriber_footer' );

function prowp_subscriber_footer( $content ) {

    if( is_single() ) {

        $content.= '<h3>Enjoyed this article?</h3>';
        $content.= '<p>Subscribe to my
            <a href="http://example.com/feed">RSS feed</a>!</p>';
    }

    return $content;
}
?>
```

```
<?php
add_filter( 'the_title', 'prowp_custom_title' );

function prowp_custom_title( $title ) {

    $title .= ' - By Example.com';
    return $title;

}
?>
```

The default_content Filter hook is useful for setting the default content when creating a new post or page. This is helpful if you have a set format for all of your posts as it can save you valuable writing time:

```
<?php
add_filter( 'default_content', 'prowp_default_content' );

function prowp_default_content( $content ) {

    $content = 'For more great content please subscribe to my RSS feed';
    return $content;

}
?>
```


####Popular action hooks
* publish_post — Triggered when a new post is published.
* create_category — Triggered when a new category is created.
* switch_theme — Triggered when you switch themes.
* admin_head — Triggered in the <head> section of the admin dashboard.
* wp_head — Triggered in the <head> section of your theme.
* wp_footer — Triggered in the footer section of your theme usually directly before the &lt;/body> tag.
* init — Triggered after WordPress has finished loading, but before any headers are sent. Good place to intercept $_GET and $_POST HTML requests.
* admin_init: Same as init but only runs on admin dashboard pages.
* user_register: Triggered when a new user is created.
* comment_post: Triggered when a new comment is created.

```
<?php
add_action( 'wp_head', 'prowp_custom_css' );

function prowp_custom_css() {
 ?>
    <style type="text/css">
    a {
        font-size: 14px;
        color: #000000;
        text-decoration: none;
    }
    a:hover {
        font-size: 14px
        color: #FF0000;
        text-decoration: underline;
    }
    </style>
<?php
}
?>
```

```
<?php
add_action( 'wp_footer', 'prowp_site_analytics' );

function prowp_site_analytics()  {
?>
    <script type="text/javascript">
    var gaJsHost = (("https:" == document.location.protocol) ?
      "https://ssl." : "http://www.");
    document.write(unescape("%3Cscript src='" + gaJsHost +
      'google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
    </script>
    <script type="text/javascript">
    var pageTracker = _gat._getTracker("UA-XXXXXX-XX");
    pageTracker._trackPageview();
    </script>
<?php
}
?>
```

The admin_head Action hook is very similar to the wp_head hook, but rather than hooking into the theme header, it hooks into the admin dashboard header. This is useful if your plugin requires custom CSS on the admin dashboard, or any other custom header code.

http://codex.wordpress.org/Plugin_API/Filter_Reference
http://codex.wordpress.org/Plugin_API/Action_Reference
http://wordpress.org/extend/plugins/


##Plugin Settings










