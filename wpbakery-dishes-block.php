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


add_action('admin_enqueue_scripts', 'enqueue_tabulator_js',9999,1 );
function enqueue_tabulator_js() {
    wp_enqueue_script('jstabulator', plugin_dir_url( __FILE__ ).'/vc-components/assets/tabulator/js/tabulator.min.js', array('jquery'), false, true);
	wp_enqueue_style( 'jstabulator', plugin_dir_url( __FILE__ ) . '/vc-components/assets/tabulator/css/tabulator.min.css',false,'1.1','all');
    wp_enqueue_script('micromodal', plugin_dir_url( __FILE__ ).'/vc-components/assets/micromodal/micromodal.min.js', array('jquery'), false, true);
	wp_enqueue_style( 'micromodal', plugin_dir_url( __FILE__ ) . '/vc-components/assets/micromodal/styles.css"',false,'1.1','all');
	wp_enqueue_style( 'wpbakery-dishes-block', plugin_dir_url( __FILE__ ) . '/vc-components/assets/styles.css"',false,'1.1','all');
}

include( plugin_dir_path( __FILE__ ) . '/vc-components/vc-dishes-block.php' );

