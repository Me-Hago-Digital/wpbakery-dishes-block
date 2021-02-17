<div class="cartas <?= $extra_class.' '.$animation_classes;?>" id="<?= $element_id;?>">

    <div class="carta-row carta-title">

        <?php foreach ($params['order'] as $o) {

            if ($params['headers'][$o]->htmlOutput) {
                switch ($o) {
                    case "texto_plato": ?>
                        <span class="carta-main-col plato"><?= $params['headers']['texto_plato']->title; ?></span>
                    <?php break;
                    case "number_precio1": ?>
                        <span class="carta-sub-col precio"><?= $params['headers']['number_precio1']->title; ?></span>
                    <?php break;
                    case "number_precio2": ?>
                        <span class="carta-sub-col precio"><?= $params['headers']['number_precio2']->title; ?></span>
            <?php break;
                }
            }

        } ?>

    </div>



    <?php foreach ($params['data'] as $x) { ?>

        <div class="carta-row">

            <?php foreach ($params['order'] as $o) {

                if ($params['headers'][$o]->htmlOutput) { 

                    switch ($o) {
                        case "texto_plato": ?>
                                <span class="carta-main-col plato"><?= $x->texto_plato; ?><i></i>

                                    <?php if ($params['headers']["texto_desc"]->htmlOutput) { ?>
                                        <br>
                                        <em><?= $x->texto_desc; ?></em>
                                    <?php } ?>

                                </span>
                            <?php break;
                        case "number_precio1": ?>
                                <span class="carta-sub-col precio"><?= $x->number_precio1; ?></span>
                            <?php  break;
                        case "number_precio2": ?>
                                <span class="carta-sub-col precio"><?= $x->number_precio2; ?></span>
                    <?php  break;
                    }

                }

            } ?>

        </div>

    <?php } ?>

</div>