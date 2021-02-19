var dummy_data = '{"headers":[{"field":"handler","titleFormatter":"rowSelection","width":10,"headerSort":false,"rowHandle":true,"htmlOutput":false,"editor":false,"formatter":"handle","clipboard":false},{"title":"Plato","field":"texto_plato","headerSort":false,"htmlOutput":true,"editor":"input","editableTitle":true,"headerContextMenu":[{"label":"Ordenar columna","menu":[{"label":"ASC"},{"label":"DESC"}]},{"disabled":true,"label":"Eliminar columna"},{},{"label":"Guardar como cabeceras por defecto"}]},{"title":"Descripción","field":"texto_desc","headerSort":false,"htmlOutput":true,"editor":"input","editableTitle":true,"headerContextMenu":[{"label":"Ordenar columna","menu":[{"label":"ASC"},{"label":"DESC"}]},{"disabled":true,"label":"Eliminar columna"},{},{"label":"Guardar como cabeceras por defecto"}]},{"title":"Ración","field":"number_precio1","headerSort":false,"htmlOutput":true,"editor":"input","editableTitle":true,"width":100,"headerContextMenu":[{"label":"Ordenar columna","menu":[{"label":"ASC"},{"label":"DESC"}]},{"disabled":true,"label":"Eliminar columna"},{},{"label":"Guardar como cabeceras por defecto"}]},{"title":"½ Ración","field":"number_precio2","headerSort":false,"htmlOutput":true,"editor":"input","editableTitle":true,"width":100,"headerContextMenu":[{"label":"Ordenar columna","menu":[{"label":"ASC"},{"label":"DESC"}]},{"disabled":true,"label":"Eliminar columna"},{},{"label":"Guardar como cabeceras por defecto"}]}],"data":[{"id":1,"subtable":false},{"texto_plato":"1A","texto_desc":"2A","number_precio1":"3A","number_precio2":"4A","id":2},{"texto_plato":"1B","texto_desc":"2B","number_precio1":"3B","number_precio2":"4B","id":3},{"texto_plato":"1C","texto_desc":"2C","number_precio1":"3C","number_precio2":"4C","id":4},{"texto_plato":"1A","texto_desc":"2A","number_precio1":"3A","number_precio2":"4A","id":5},{"texto_plato":"1B","texto_desc":"2B","number_precio1":"3B","number_precio2":"4B","id":6},{"texto_plato":"1C","texto_desc":"2C","number_precio1":"3C","number_precio2":"4C","id":7},{"texto_plato":"1A","texto_desc":"2A","number_precio1":"3A","number_precio2":"4A","id":8},{"texto_plato":"1B","texto_desc":"2B","number_precio1":"3B","number_precio2":"4B","id":9},{"texto_plato":"1C","texto_desc":"2C","number_precio1":"3C","number_precio2":"4C","id":10},{"texto_plato":"1A","texto_desc":"2A","number_precio1":"3A","number_precio2":"4A","id":11},{"texto_plato":"1B","texto_desc":"2B","number_precio1":"3B","number_precio2":"4B","id":12},{"texto_plato":"1C","texto_desc":"2C","number_precio1":"3C","number_precio2":"4C","id":13}]}';

jQuery(document).ready(function ($) {
  var current_selected_row;

  $("#modal-copypaste").on("paste", function (evt) {
    catchPaste(evt, this, function (clipData) {
      var data_clip = clipboardPasteParser(clipData, table);

      if (data_clip != false) {
        var position = table.getRowPosition(current_selected_row, true);
        table.addData(data_clip, false);
        saveData(table);
      }

      MicroModal.close("modal-copypaste");
    });
  });

  var $param_elem = $('[type="hidden"].data_dishes_block');
  var $param_elem_default_template = $(
    'input[name="data_dishes_block_default_template"]'
  );
  var $param_elem_table = $('[type="hidden"].data_dishes_block_table_field');
  var test =
    $param_elem.length === 0 || $param_elem_table.length === 0 ? true : false;

  var rowid = 0;

  var default_template = "";

  MicroModal.init({
    disableScroll: true,
    disableFocus: false,
    awaitCloseAnimation: false,
  });

  //DEFAULT HEADERS TEMPLATE
  if ($param_elem_default_template.length !== 0) {
    if ($param_elem_default_template.val() != "") {
      default_template = $param_elem_default_template.val();
      default_template = JSON.parse(decodeURIComponent(default_template));
    }
  }

  var cellClassFormatter = function (cell, formatterParams, onRendered) {
    onRendered(function () {
      if (typeof cell._cell !== "undefined") {
        if (!cell._cell.column.definition.htmlOutput) {
          $(cell.getElement()).addClass("customcss");
        }
      }
    });

    return cell.getValue(); //return the contents of the cell;
  };

  function definitions_header_text(params = {}) {
    return {
      title: typeof params.title !== "undefined" ? params.title : "Titulo",
      field:
        typeof params.field !== "undefined"
          ? params.field
          : "texto_" + random_uuid(),
      headerSort: false,
      htmlOutput:
        typeof params.htmlOutput !== "undefined" ? params.htmlOutput : true,
      editor: true,
      editableTitle: true,
      headerContextMenu: headerContextMenu,
      formatter: cellClassFormatter,
      editor: "textarea",
    };
  }

  function definitions_header_price(params = {}) {
    return {
      title: typeof params.title !== "undefined" ? params.title : "Precio",
      field:
        typeof params.field !== "undefined"
          ? params.field
          : "price_" + random_uuid(),
      headerSort: false,
      htmlOutput:
        typeof params.htmlOutput !== "undefined" ? params.htmlOutput : true,
      editor: true,
      editableTitle: true,
      width: 100,
      headerContextMenu: headerContextMenu,
      formatter: cellClassFormatter,
      editor: "input",
    };
  }

  var random_uuid = function () {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  var headerContextMenu = [
    {
      disabled: function (component) {
        return table.getHistoryUndoSize()===0;
      },
      label: "Deshacer",
      action: function (e, row) {
        table.undo();
      },
    },
    {
      disabled: function (component) {
        return table.getHistoryRedoSize()===0;
      },
      label: "Rehacer",
      action: function (e, row) {
        table.redo();
      },
    },

    {
      label: "Ordenar columna",
      menu: [
        {
          label: "ASC",
          action: function (e, column) {
            table.setSort(column._column.definition.field, "asc");
            saveData(table);
          },
        },
        {
          label: "DESC",
          action: function (e, column) {
            table.setSort(column._column.definition.field, "desc");
            saveData(table);
          },
        },
      ],
    },




    {
      disabled: true,
      label: "Eliminar columna",
      action: function (e, column) {
        var new_data = [];

        $.each(table.getData(true), function (i, x) {
          delete x[column._column.field];
          new_data.push(x);
        });

        table.deleteColumn(column._column.field).then(function () {
          table.replaceData(new_data);
        });
      },
    },
    {
      label: function (component) {
        return !component._column.definition.htmlOutput
          ? "Mostrar columna"
          : "Ocultar columna";
      },
      action: function (e, column) {
        column._column.definition.htmlOutput = !column._column.definition
          .htmlOutput;

        $.each(column._column.cells, function (i, x) {
          $(x.element).toggleClass("customcss");
        });
        saveData(table);
        table.redraw();
      },
    },

    {
      disabled: function () {
        return typeof ajax_var === "undefined";
      },
      label: "Guardar como cabeceras por defecto",
      action: function (e, column) {
        var send_headers = table.getColumnDefinitions();

        send_headers = encodeURIComponent(JSON.stringify(send_headers));

        jQuery.ajax({
          type: "post",
          url: ajax_var.url,
          dataType: "json",
          data: {
            action: ajax_var.action,
            nonce: ajax_var.nonce,
            headers: send_headers,
          },
          success: function (result) {
            saveData(table);
          },
        });
      },
    },
  ];

  var rowContextMenu = [

    {
      disabled: function (component) {
        return table.getHistoryUndoSize()===0;
      },
      label: "Deshacer",
      action: function (e, row) {
        table.undo();
      },
    },
    {
      disabled: function (component) {
        return table.getHistoryRedoSize()===0;
      },
      label: "Rehacer",
      action: function (e, row) {
        table.redo();
      },
    },

    {
      label: "Copiar",
      action: function (e, row) {
        table.copyToClipboard("selected");
      },
    },
    {
      label: "Eliminar fila",
      action: function (e, row) {

        if(table.getSelectedRows().length!=0){
          table.deleteRow(table.getSelectedRows());
        }else{
          table.deleteRow(row.getData().id);
        }

        if(!table.getDataCount()>0){
          table.addRow({id:1});
        }else{
          saveData(table);
        }



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
    {
      label: "Importar contenido",
      menu: [
        {
          label: "Desde el portapapeles (Añade el contenido)",
          action: function (e, row) {
            current_selected_row = row;

            MicroModal.show("modal-copypaste", {
              onShow: function (a, i) {
                $("#modal-settings-content").focus();
              },
              onClose: function (a, i, e) {},
            });
          },
        },
        {
          label: "Desde un CSV (Reemplaza todo el contenido)",
          action: function (e, row) {
            document.getElementById("dishes-block-files").click();
          },
        },
      ],
    },
  ];

  var tabledata = loadData(test);

  var table = new Tabulator("#data_dishes_block_table", {
    data: tabledata["data"],
    rowContextMenu: rowContextMenu,
    columns: tabledata["headers"],
    tabEndNewRow: true,
    layout: "fitColumns",
    movableRows: true,
    movableColumns: true,
    columnHeaderSortMulti: false,
    clipboardPasteAction: "insert",
    clipboard:true,
    clipboardCopyRowRange:"selected",
    clipboardCopyStyled:false,
    history:true,
    clipboardCopyConfig:{
      columnHeaders:false, //do not include column headers in clipboard output
      columnGroups:false, //do not include column groups in column headers for printed table
      rowGroups:false, //do not include row groups in clipboard output
      columnCalcs:false, //do not include column calculation rows in clipboard output
      dataTree:false, //do not include data tree in printed table
      formatCells:false, //show raw cell values without formatter
  },

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
    tableBuilt: function () {
      saveData(this);
    },
  });

  //Add row on "Add Row" button click
  $("#add-row").click(function () {
    table.addRow();
  });

  $("#add-col-text").click(function () {
    table.addColumn(definitions_header_text(), false).then(function () {
      table.redraw();
      saveData(table);
    });
  });

  $("#add-col-price").click(function () {
    table.addColumn(definitions_header_price(), false).then(function () {
      table.redraw();
      saveData(table);
    });
  });

  //Add row on "Add Row" button click
  $("#delete-row").click(function () {
    table.deleteRow(table.getSelectedData().map((x) => x.id));
    saveData(table);
  });

  $("#savedata").click(function () {
    console.log(saveData(table));
  });

  $("#dishes-block-files").change(function () {
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

  function loadHeaders(saved_headers = []) {
    var min_headers = [
      {
        field: "handler",
        titleFormatter: "rowSelection",
        width: 10,
        headerSort: false,
        rowHandle: true,
        htmlOutput: false,
        editor: false,
        formatter: "handle",
        clipboard:false,
        cellClick: function (e, cell) {
           cell.getRow().toggleSelect();
         },
      },
    ];

    var default_headers = [
      definitions_header_text({ title: "Plato", field: "texto_plato" }),
      definitions_header_text({ title: "Descripción", field: "texto_desc" }),
      definitions_header_price({ title: "Ración", field: "number_precio1" }),
      definitions_header_price({ title: "½ Ración", field: "number_precio2" }),
    ];

    var headers = [{}];

    if (saved_headers.length != 0) {
      var formated_headers = [];

      $.each(saved_headers, function (i, x) {
        //TEXTO
        if (x.field.search("texto") !== -1) {
          formated_headers.push(
            definitions_header_text({
              title: x.title,
              field: x.field,
              htmlOutput: x.htmlOutput,
            })
          );
        }
        //PRECIO
        else if (x.field.search("number") !== -1) {
          formated_headers.push(
            definitions_header_price({
              title: x.title,
              field: x.field,
              htmlOutput: x.htmlOutput,
            })
          );
        }
      });

      headers = formated_headers;
    } else {
      headers = default_headers;
    }

    return min_headers.concat(headers);
  }

  function loadData(test = true) {
    var databag = {};
    var dummy = "";

    //Comprobamos si hay cabeceras establecidas por defecto (orden, nombre, visibilidad...), si las hay las usamos y si no las cargamos vacías para que se use las que hemos hardwired
    if (default_template != "") {
      dummy = JSON.stringify({
        headers: default_template,
        data: [
          {
            texto_plato: "",
            texto_desc: "",
            number_precio1: "",
            number_precio2: "",
          },
        ],
      });
    } else {
      dummy = JSON.stringify({
        headers: [],
        data: [
          {
            texto_plato: "",
            texto_desc: "",
            number_precio1: "",
            number_precio2: "",
          },
        ],
      });
    }

    //CARGA DE DATOS
    if (!test) {
      databag =
        $param_elem.val() !== ""
          ? decodeURIComponent($param_elem.val())
          : dummy;
      databag = databag.replace("`]}`", '"}]');
    } else {
      databag = dummy_data !== "" ? dummy_data : dummy;
    }

    databag = JSON.parse(databag);

    databag.headers = databag.headers.filter((x) => x.editor != false);

    databag.headers = loadHeaders(databag.headers);

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
      var _colHeaders_i = 1;

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

  function clipboardPasteParser(clipboard, table) {
    var _colHeaders = table.columnManager.columns.map((x) => x.field);


    clipboard2 = splitNewLine(clipboard);


    var data = [];

    $.each(clipboard2, function (i, row) {
      var _colHeaders_i = 1;
      var clipdata = {};
      

      $.each(row, function (x, tab) {
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

  function escapeHtml(unsafe) {
    return unsafe.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function saveData(table) {
    var data_html = escapeHtml(table.getHtml());

    var data_result = {
      headers: table.getColumnDefinitions(),
      data: table.getData(true),
    };

    data_result = JSON.stringify(data_result);

    if (!test) {
      $param_elem.attr("value", encodeURIComponent(data_result));
      $param_elem_table.attr("value", data_html);
    }

    return data_result;
  }

  function catchPaste(evt, elem, callback) {
    if (navigator.clipboard && navigator.clipboard.readText) {
      // modern approach with Clipboard API
      navigator.clipboard.readText().then(callback);
    } else if (evt.originalEvent && evt.originalEvent.clipboardData) {
      // OriginalEvent is a property from jQuery, normalizing the event object
      callback(evt.originalEvent.clipboardData.getData("text"));
    } else if (evt.clipboardData) {
      // used in some browsers for clipboardData
      callback(evt.clipboardData.getData("text/plain"));
    } else if (window.clipboardData) {
      // Older clipboardData version for Internet Explorer only
      callback(window.clipboardData.getData("Text"));
    } else {
      // Last resort fallback, using a timer
      setTimeout(function () {
        callback(elem.value);
      }, 100);
    }
  }

  function splitNewLine(str){

    var myregexp = /(?:(\t)|(\r?\n)|"((?:[^"]+|"")*)"|([^\t\r\n]+))/ig;
    var match = myregexp.exec(str);
    var emptyRow = [];
    var row = emptyRow.slice();
    var rows = [];
    var prevTab = false;
    while (match != null) {
      if (match[4]) {
        // Unquoted data
        row.push(match[4]);
        prevTab = false;
      } else if (match[3]) {
        // Quoted data (replace escaped double quotes with single)
        row.push(match[3].replace(/""/g, "'"));
        prevTab = false;
      } else if (match[1]) {
        // Tab seperator
        if (prevTab) {
          // Two tabs means empty data
          row.push('');
        }
        prevTab = true;
      } else if (match[2]) {
        // End of the row
        if (prevTab) {
          // Previously had a tab, so include the empty data
          row.push('');
        }
        prevTab = false;
        rows.push(row);
        
        // Here we are ensuring the new empty row doesn't reference the old one.
        row = emptyRow.slice();
      }
      match = myregexp.exec(str);
    }
    
    // Handles missing new line at end of string
    if (row.length) {
      if (prevTab) {
        // Previously had a tab, so include the empty data
        row.push('');
      }
      rows.push(row);
    }
  
    return rows;
  
  }

});
