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
                        "heading" => __("Listado de platos", "js_composer"),
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
                ),

            ));
        }



        public function render_shortcode($atts, $content, $tag)
        {
            ob_start();

            $atts = (shortcode_atts(array(
                'data_dishes_block'   => '',
            ), $atts));

            $result = $atts['data_dishes_block'];

            $result = str_replace('``', '"', $result);
            $result = str_replace('`{`', '[', $result);
            $result = str_replace('`}`', ']', $result);

            $data = json_decode($result);

            include( plugin_dir_path( __FILE__ ) . '/templates/block-default.php' );

            return ob_get_clean();
        }
    }


    vc_add_shortcode_param('data_dishes_block', 'data_dishes_block_settings_field', plugin_dir_url(__FILE__) . '/dishes.js?' . uniqid());
    function data_dishes_block_settings_field($settings, $value){
        return "
        <button id='add-row'>Add row</button>
        <button id='delete-row'>Delete row</button>
        <button id='savedata'>Save data</button>

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