var dummy_data='';

jQuery(document).ready(function ($) {

  if(typeof ajax_var === "undefined"){
    console.log('undefined ajax_var!!!');
    var ajax_var = {
      url: "/wp-admin/admin-ajax.php",
      action:"update_dishes_block_default_template",
      nonce: "ABCDEF"
    }
  }


  var $param_elem = $('[type="hidden"].data_dishes_block');
  var $param_elem_default_template = $('input[name="data_dishes_block_default_template"]');
  var $param_elem_table = $('[type="hidden"].data_dishes_block_table_field');
  var test =
    $param_elem.length === 0 || $param_elem_table.length === 0 ? true : false;

  var rowid = 0;

  var default_template = '';


  MicroModal.init({
    disableScroll: true,
    disableFocus: false,
    awaitCloseAnimation: false,
  });


  //DEFAULT HEADERS TEMPLATE
  if($param_elem_default_template.length!==0){
    if($param_elem_default_template.val()!=""){
      
      default_template = $param_elem_default_template.val();
      default_template = JSON.parse(decodeURIComponent(default_template));

    }
  }


  var cellClassFormatter = function(cell, formatterParams, onRendered){

    onRendered(function(){

      if(typeof cell._cell !== "undefined"){
        if(!cell._cell.column.definition.htmlOutput){
          $(cell.getElement()).addClass('customcss')
        }
      }

    });

    return cell.getValue(); //return the contents of the cell;
  };


  function definitions_header_text(params={}){
    return{
      title: typeof params.title !== "undefined"?params.title:'Titulo',
      field:typeof params.field !== "undefined"?params.field:'texto_'+random_uuid(),
      headerSort: false,
      htmlOutput: typeof params.htmlOutput !== "undefined"?params.htmlOutput:true,
      editor: true,
      editableTitle:true, 
      headerContextMenu: headerContextMenu,
      formatter:cellClassFormatter,
      editor:"input"
     
    }
  }

  function definitions_header_price(params={}){
    return{
      title:typeof params.title !== "undefined"?params.title:'Precio',
      field:typeof params.field !== "undefined"?params.field:'price_'+random_uuid(),
      headerSort: false,
      htmlOutput: typeof params.htmlOutput !== "undefined"?params.htmlOutput:true,  
      editor: true,
      editableTitle:true,
      width:100,
      headerContextMenu: headerContextMenu,
      formatter:cellClassFormatter,
      editor:"input"
    }  
  }

  var random_uuid = function(){
    return Date.now()+Math.floor(Math.random()*1000)
  }

  var headerContextMenu = [
    {
      disabled:true,
      label: "Settings",
      action: function (e, column) {
        openColSettings(column);
      },
    },
    {
      label: "Ordenar columna ASC",
      action: function (e, column) {
        table.setSort(column._column.definition.field, "asc");
        saveData(table);
      },
    },
    {
      label: "Ordenar columna DESC",
      action: function (e, column) {
        table.setSort(column._column.definition.field, "desc");
        saveData(table);
      },
    },
    {
      disabled:true,
      label: "Eliminar columna",
      action: function (e, column) {
 
        var new_data = []
        
        $.each(table.getData(true),function(i,x){
          delete x[column._column.field]
          new_data.push(x)
        })

        table.deleteColumn(column._column.field).then(function(){
          table.replaceData(new_data);
        })
        
      },
    },
    {
      label: function (component) {
        return !component._column.definition.htmlOutput
          ? "Mostrar columna"
          : "Ocultar columna";
      },
      action: function (e, column) {

          column._column.definition.htmlOutput=!column._column.definition.htmlOutput;

          $.each(column._column.cells,function(i,x){
            $(x.element).toggleClass("customcss")
          })
        saveData(table);
        table.redraw();
      },
      
    },

    {
      label: "Guardar como cabeceras por defecto",
      action: function (e, column) {

        var send_headers = table.getColumnDefinitions();

        send_headers = encodeURIComponent(JSON.stringify(send_headers));

          jQuery.ajax({
            type: "post",
            url: ajax_var.url,
            dataType : 'json',
            data:{
              action:ajax_var.action,
              nonce:ajax_var.nonce,
              headers:send_headers
            },
            success: function(result){
              saveData(table)
            }
          });
      },
    },


  ];

  var rowContextMenu = [
    {
      label: "Eliminar fila",
      action: function (e, row) {
        table.deleteRow(row.getData().id);
      },
    },
    {
      label: "Añadir nueva fila arriba",
      action: function (e, row) {
        table.addRow({}, true, row.getData().id);
      },
    },
    {
      label: "Añadir nueva fila debajo",
      action: function (e, row) {
        table.addRow({}, false, row.getData().id);
      },
    },
  ];


  var tabledata = loadData(test);

  var table = new Tabulator("#data_dishes_block_table", {
    data: tabledata['data'],
    rowContextMenu: rowContextMenu,
    columns: tabledata['headers'],
    tabEndNewRow: true,
    layout: "fitColumns",
    movableRows: true,
    movableColumns: true,
    columnHeaderSortMulti: false,
    clipboard: "paste",
    clipboardPasteAction: "insert",
    clipboardPasteParser: clipboardPasteParser,
    //rowFormatter: rowFormatter,

    cellEdited: function (data) {
      saveData(this);
    },
    columnTitleChanged: function (column) {
      saveData(this);
    },
    rowMoved: function (toTables) {
      saveData(this);
    },
    columnMoved: function (toTables) {
      saveData(this);
    },
    rowAdded: function (row) {
      row.update({ id: rowuid() });
      if (!pasteStart) {
        saveData(this);
      }
    },
    clipboardPasted: function (clipboard) {
      pasteStart = false;
      saveData(this);
    },
    dataLoaded: function () {
      saveData(this);
    },
    tableBuilt: function(){
      saveData(this);
    }
  });

  //Add row on "Add Row" button click
  $("#add-row").click(function () {
    table.addRow();
  });

  $("#add-col-text").click(function () {

    table.addColumn(definitions_header_text(), false).then(function(){
      table.redraw();
      saveData(table);
    })

  });

  $("#add-col-price").click(function () {

    table.addColumn(definitions_header_price(), false).then(function(){
      table.redraw();
      saveData(table);
    })

  });

  //Add row on "Add Row" button click
  $("#delete-row").click(function () {
    table.deleteRow(table.getSelectedData().map((x) => x.id));
    saveData(table);
  });

  $("#savedata").click(function () {
    console.log(saveData(table))
  });

  $("input:file").change(function () {
    var files = this.files;
    if (files.length === 0) {
      console.log("No file is selected");
      return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
      var _colHeaders = table.columnManager.columns.map((x) => x.field);
      var result = csvJSON(event.target.result, _colHeaders);
      table.setData(result);
    };

    reader.readAsText(files[0]);
  });

  function rowuid() {
    rowid += 1;
    return rowid;
  }

  function loadHeaders(saved_headers=[]) {

    var min_headers = [
      {
        field: "handler",
        width: 10,
        headerSort: false,
        rowHandle: true,
        htmlOutput: false,
        editor:false,
        formatter:"handle"
      },
      
      {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      headerSort: false,
      cellClick: function (e, cell) {
        cell.getRow().toggleSelect();
      },
      width: 10,
      htmlOutput: false,
      editor:false
    }]

    var default_headers = [
      definitions_header_text({title:'Plato',field:"texto_plato"}),
      definitions_header_text({title:'Descripción',field:"texto_desc"}),
      definitions_header_price({title:'Ración',field:"number_precio1"}),
      definitions_header_price({title:'½ Ración',field:"number_precio2"})
    ];

    var headers = [{}];


    if(saved_headers.length!=0){

      var formated_headers = [];

      $.each(saved_headers,function(i,x){
        //TEXTO
        if(x.field.search('texto')!==-1){
          formated_headers.push(definitions_header_text({title:x.title,field:x.field,htmlOutput:x.htmlOutput}));
        }
        //PRECIO
        else  if(x.field.search('number')!==-1){
          formated_headers.push(definitions_header_price({title:x.title,field:x.field,htmlOutput:x.htmlOutput}));
        }
      })

      headers = formated_headers;
    }else{
      headers = default_headers;
    }


    return min_headers.concat(headers);
  }

  function loadData(test = true) {
    var databag = {};
    var dummy = '';

    //Comprobamos si hay cabeceras establecidas por defecto (orden, nombre, visibilidad...), si las hay las usamos y si no las cargamos vacías para que se use las que hemos hardwired
    if(default_template!=""){
      dummy = JSON.stringify({headers:default_template,data:[{texto_plato:"",texto_desc:"",number_precio1:"",number_precio2:""}]})
    }else{
      dummy = JSON.stringify({headers:[],data:[{texto_plato:"",texto_desc:"",number_precio1:"",number_precio2:""}]})
    }


    //CARGA DE DATOS
    if (!test) {
      databag = $param_elem.val() !== "" ? decodeURIComponent($param_elem.val()) : dummy;
      databag = databag.replace("`]}`", '"}]');
    } else {
      databag = dummy_data !== "" ? dummy_data : dummy;
    }

    databag = JSON.parse(databag);

    databag.headers = databag.headers.filter(x=>x.editor!=false);


    databag.headers =  loadHeaders(databag.headers);

    databag.data = databag.data.map((x) =>
      true
        ? { ...x, id: rowuid(), subtable: false }
        : { ...x, id: rowuid(), subtable: false }
    );

    return databag;
  }

  function csvJSON(csv, _colHeaders) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var _colHeaders_i = 2;

      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        if (typeof _colHeaders[_colHeaders_i] !== "undefined") {
          obj[_colHeaders[_colHeaders_i]] = currentline[j];
          _colHeaders_i++;
        }
      }

      result.push(obj);
    }
    return JSON.stringify(result).replace(/\\r/g, "");
  }

  var pasteStart = false;

  function clipboardPasteParser(clipboard) {
    var _colHeaders = this.table.columnManager.columns.map((x) => x.field);

    clipboard = clipboard.split("\n");
    var data = [];

    $.each(clipboard, function (i, clip) {
      var _colHeaders_i = 2;
      var clipdata = {};

      $.each(clip.split("\t"), function (x, tab) {
        if (typeof _colHeaders[_colHeaders_i] !== "undefined") {
          (clipdata[_colHeaders[_colHeaders_i]] = tab), (_colHeaders_i += 1);
        }
      });
      data.push(clipdata);
    });

    if (data.length != 0) {
      pasteStart = true;
    }
    return data.length != 0 ? data : false;
  }

  function rowFormatter(row) {
    var data = row.getData();

    if (data.subtable != true) {
      var listHolder = document.createElement("div");
      listHolder.className = "dish-block-desc";
      listHolder.innerHTML =
        "<textarea data-rel='" +
        data.id +
        "'>" +
        (typeof data.extra === "undefined" ? "" : data.extra) +
        "</textarea>";
      row.getElement().appendChild(listHolder);
      row.update({ subtable: true });
    }
  }

  function escapeHtml(unsafe) {
    return unsafe.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function saveData(table) {
    var data_html = escapeHtml(table.getHtml());

    var data_result = {
      headers:table.getColumnDefinitions(),
      data:table.getData(true)
    }

    data_result = JSON.stringify(data_result)

    if (!test) {
      $param_elem.attr("value", encodeURIComponent(data_result));
      $param_elem_table.attr("value", data_html);
    }

    return data_result;
  }

  function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
      indexed_array[n["name"]] = n["value"];
    });

    return indexed_array;
  }

  function openColSettings(column) {
    MicroModal.show("modal-settings", {
      onShow: function (a, i) {

        document.getElementById("dishes-modal-settings").reset();
        $('#dishes-modal-settings [name="header"]').val(column._column.definition.title);

      },
      onClose: function (a, i, e) {
        var el_data = $(e.target).attr("data-rel");

        if (typeof el_data !== "undefined") {
          if (el_data == "save") {

            var form_data = getFormData($("#dishes-modal-settings"));
  
            column.updateDefinition({ title: form_data.header });

            saveData(table)
          }
        }
      },
    });
  }

});
