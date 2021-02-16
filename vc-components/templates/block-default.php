


<div class="cartas">

    <h4 class="carta-title"> <span class="carta-main-col plato"><?= $params['headers']['texto_plato']->title; ?></span><span class="carta-sub-col precio"><?= $params['headers']['number_precio1']->title; ?></span><span class="carta-sub-col precio"><?= $params['headers']['number_precio2']->title; ?></span></h4>

    <?php foreach ($params['data'] as $x) { ?>

        <div class="carta-row">
            <span class="carta-main-col plato"><?= $x->texto_plato; ?><i></i>
                <br>
                <em><?= $x->texto_desc; ?></em>
            </span>
            <span class="carta-sub-col precio"><?= $x->number_precio1; ?></span>
            <span class="carta-sub-col precio"><?= $x->number_precio2; ?></span>
        </div>

    <?php } ?>

</div>

<!-- <pre><?= print_r($params['headers'], true); ?></pre>
<pre><?= print_r($params['data'], true); ?></pre> -->