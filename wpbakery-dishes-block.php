<?php
/*
Plugin Name: WPBakery Dishes Block
Plugin URI: https://example.com/
Description: Añade al WPBakery un bloque especialmente diseñado para cartas de restaurantes
Version: 1.0
Author: Javier Rodríguez
Author URI: https://example.com/
License: GPLv2 or later
Text Domain: wpbakery_dishes_block
*/


include_once('updater.php');

if (is_admin()) { // note the use of is_admin() to double check that this is happening in the admin
  $config = array(
    'slug' => plugin_basename(__FILE__), // this is the slug of your plugin
    'proper_folder_name' => 'wpbakery-dishes-block', // this is the name of the folder your plugin lives in
    'api_url' => 'https://api.github.com/repos/Me-Hago-Digital/wpbakery-dishes-block', // the GitHub API url of your GitHub repo
    'raw_url' => 'https://raw.githubusercontent.com/Me-Hago-Digital/wpbakery-dishes-block/master', // the GitHub raw url of your GitHub repo
    'github_url' => 'https://github.com/Me-Hago-Digital/wpbakery-dishes-block', // the GitHub url of your GitHub repo
    'zip_url' => 'https://github.com/Me-Hago-Digital/wpbakery-dishes-block/zipball/master', // the zip url of the GitHub repo
    'sslverify' => true, // whether WP should check the validity of the SSL cert when getting an update, see https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/2 and https://github.com/jkudish/WordPress-GitHub-Plugin-Updater/issues/4 for details
    'requires' => '3.0', // which version of WordPress does your plugin require?
    'tested' => '3.3', // which version of WordPress is your plugin tested up to?
    'readme' => 'README.md', // which file to use as the readme for the version number
    'access_token' => '', // Access private repositories by authorizing under Plugins > GitHub Updates when this example plugin is installed
  );
  new WP_GitHub_Updater($config);
}



function update_dishes_block_default_template() {
    // Check for nonce security
    $nonce = sanitize_text_field( $_POST['nonce'] );

    if ( ! wp_verify_nonce( $nonce, 'my-ajax-nonce' )) {
        die ( 'Busted!');
    }

	update_option("wpbakery_dishes_block_default_template",$_POST['headers']);
	
	$template = json_decode(urldecode(get_option("wpbakery_dishes_block_default_template")));

	echo json_encode([results=>$template]);

    wp_die();
}
add_action( 'wp_ajax_nopriv_update_dishes_block_default_template', 'update_dishes_block_default_template' );
add_action( 'wp_ajax_update_dishes_block_default_template', 'update_dishes_block_default_template' );


add_action('admin_enqueue_scripts', 'enqueue_tabulator_js',9999,1 );
function enqueue_tabulator_js() {
    wp_enqueue_script('jstabulator2', plugin_dir_url( __FILE__ ).'/vc-components/assets/tabulator/js/tabulator.min.js', array('jquery'), false, true);
	wp_enqueue_style( 'jstabulator', plugin_dir_url( __FILE__ ) . '/vc-components/assets/tabulator/css/tabulator.min.css',false,'1.1','all');
    wp_enqueue_script('micromodal', plugin_dir_url( __FILE__ ).'/vc-components/assets/micromodal/micromodal.min.js', array('jquery'), false, true);
	wp_enqueue_style( 'micromodal', plugin_dir_url( __FILE__ ) . '/vc-components/assets/micromodal/styles.css"',false,'1.1','all');
	wp_enqueue_style( 'wpbakery-dishes-block', plugin_dir_url( __FILE__ ) . '/vc-components/assets/styles.css"',false,'1.1','all');

    wp_localize_script( 'jstabulator2', 'ajax_var', array(
        'url'    => admin_url( 'admin-ajax.php' ),
        'nonce'  => wp_create_nonce( 'my-ajax-nonce' ),
        'action' => 'update_dishes_block_default_template'
    ) );


}

add_action('wp_enqueue_scripts', 'wpbakery_dishes_block_styles',9999,1 );
function wpbakery_dishes_block_styles() {
	wp_enqueue_style( 'dishes_block', plugin_dir_url( __FILE__ ) . '/vc-components/assets/styles.css',false,'1.1','all');
}

include( plugin_dir_path( __FILE__ ) . '/vc-components/vc-dishes-block.php' );

