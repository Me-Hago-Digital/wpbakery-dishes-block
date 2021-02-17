<?php



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

        <div id='data_dishes_block_table'></div>

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