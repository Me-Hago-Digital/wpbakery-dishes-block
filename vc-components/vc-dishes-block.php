<?php

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


if (!class_exists('VcDishesBlock')) {

    class VcDishesBlock extends WPBakeryShortCode{
        function __construct()
        {
            add_action('init', array($this, 'create_shortcode'), 999);
            add_shortcode('vc_dishes_block', array($this, 'render_shortcode'));
        }

        public function create_shortcode()
        {
            if (!defined('WPB_VC_VERSION')) {
                return;
            }

            vc_map(array(
                'name'          => __('Platos ', 'wpbakery_reextras'),
                'base'          => 'vc_dishes_block',
                'description'      => __('', 'wpbakery_reextras'),
                'category'      => __('Componentes extra', 'wpbakery_reextras'),
                'params' => array(

                    array(
                        "type" => "data_dishes_block",
                        "class" => "",
                        "heading" => __("Listado de platos", "wpbakery_reextras"),
                        "param_name" => "data_dishes_block",
                        "value" => '',
                    ),

                    array(
                        "type" => "data_dishes_block_table",
                        "holder" => "div",
                        "class" => "",
                        "param_name" => "content",
                        "value" => '',
                    ),

                    array(
                      'type'          => 'textfield',
                      'heading'       => __( 'ID del elemento', 'wpbakery_reextras' ),
                      'param_name'    => 'element_id',
                      'value'             => __( '', 'wpbakery_reextras' ),
                      'description'   => __( 'Enter element ID (Note: make sure it is unique and valid).', 'sodawebmedia' ),
                      'group'         => __( 'Opciones de Diseño', 'wpbakery_reextras'),
                  ),
                  array(
                      'type'          => 'textfield',
                      'heading'       => __( 'Clase CSS extra', 'wpbakery_reextras' ),
                      'param_name'    => 'extra_class',
                      'value'             => __( '', 'wpbakery_reextras' ),
                      'description'   => __( 'Style particular content element differently - add a class name and refer to it in custom CSS.', 'sodawebmedia' ),
                      'group'         => __( 'Opciones de Diseño', 'wpbakery_reextras'),
                  ),   
                  
                  array(
                    'type' => 'animation_style',
                    'heading' => __( 'Animation Style', 'text-domain' ),
                    'param_name' => 'animation',
                    'description' => __( 'Choose your animation style', 'text-domain' ),
                    'admin_label' => false,
                    'weight' => 0,
                    'group' => __( 'Opciones de Diseño', 'wpbakery_reextras'),
                  ),


                ),

            ));
        }



        public function render_shortcode($atts, $content, $tag)
        {
            ob_start();

            $atts = (shortcode_atts(array(
                'data_dishes_block'   => '',
                'extra_class'   => '',
                'element_id'   => '',
                'animation' => '',
            ), $atts));

            $extra_class = esc_attr($atts['extra_class']);
            $element_id = esc_attr($atts['element_id']);

            // Build the animation classes
            $animation_classes = $this->getCSSAnimation( $atts['animation'] );

            $result = $atts['data_dishes_block'];
            $data = json_decode(urldecode($result));

            $params=[
              'headers'=>$data->headers,
              'data'=>$data->data
            ];


            $new_headers = [];
            $params['order']=[];

            foreach($params['headers'] as $x){
              if(isset($x->field)&&$x->field!="handler"){
                array_push($params['order'],$x->field);
                $new_headers[$x->field]=$x;
              }
            }

            $params['headers'] = $new_headers;

            include( plugin_dir_path( __FILE__ ) . '/templates/block-default.php' );

            return ob_get_clean();
        }
    }


    vc_add_shortcode_param('data_dishes_block', 'data_dishes_block_settings_field', plugin_dir_url(__FILE__) . '/dishes.js?' . uniqid());
    function data_dishes_block_settings_field($settings, $value){
        return "

        <div class='modal micromodal-slide' id='modal-copypaste' aria-hidden='true'>
        <div class='modal__overlay' tabindex='-1' data-micromodal-close>
          <div class='modal__container' role='dialog' aria-modal='true' aria-labelledby='modal-copypaste-title'>
            <main class='modal__content' id='modal-copypaste-content'>
              <p style='font-size: 26px;font-weight: bold;color: rgba(0,0,0,.7);'>Ctrl+V</p>
              <p>Haz click aquí</p>
            </main>
          </div>
        </div>
      </div>
    
        <div class='modal micromodal-slide' id='modal-settings' aria-hidden='true'>
        <div class='modal__overlay' tabindex='-1' data-micromodal-close>
          <div class='modal__container' role='dialog' aria-modal='true' aria-labelledby='modal-settings-title'>
            <header class='modal__header'>
              <h2 class='modal__title' id='modal-settings-title'>
                Actualización de cabecera
              </h2>
              <button class='modal__close' aria-label='Close modal' data-micromodal-close></button>
            </header>
            <main class='modal__content' id='modal-settings-content'>
              <p>
                <form id='dishes-modal-settings'>
                <input type='text' name='header'>
                </form>
              </p>
            </main>
            <footer class='modal__footer'>
              <button class='modal__btn modal__btn-primary' data-micromodal-close data-rel='save'>Guardar</button>
            </footer>
          </div>
        </div>
      </div>


        <button id='add-row'>Add row</button>
        <button id='delete-row'>Delete row</button>

        <input id='dishes-block-files' type='file' style='display:none'>


        <div id='data_dishes_block_table'></div>

        <input value='" . esc_attr(get_option("wpbakery_dishes_block_default_template")) . "' type='hidden' name='data_dishes_block_default_template'>

        <input value='" . esc_attr($value) . "' type='hidden' name='" . esc_attr($settings['param_name']) . "' class='wpb_vc_param_value wpb-textinput " . esc_attr($settings['param_name']) . " " . esc_attr($settings['type']) . "_field'>
    ";
    }
    
    vc_add_shortcode_param('data_dishes_block_table', 'data_dishes_block_table_settings_field_table');
    function data_dishes_block_table_settings_field_table($settings, $value){
        return '
            <input value="' . esc_attr($value) . '" type="hidden" name="' . esc_attr($settings['param_name']) . '" class="wpb_vc_param_value wpb-textinput ' . esc_attr($settings['param_name']) . ' ' . esc_attr($settings['type']) . '_field">
        ';
    }

    new VcDishesBlock();

}

?>