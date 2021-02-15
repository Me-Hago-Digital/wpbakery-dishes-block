jQuery(document).ready(function ($) {
    var rowid = 0;
  

    
    var $param_elem = $('[type="hidden"].data_dishes_block');
    var $param_elem_table = $('[type="hidden"].data_dishes_block_table_field');
    var test =
      $param_elem.length === 0 || $param_elem_table.length === 0 ? true : false;
  
    var tabledata = loadData(test);
  
    var headerContextMenu = [
      {
        label: "Ordenar columna ASC",
        action: function (e, column) {
          table.setSort(column._column.definition.field, "asc");
        },
      },
      {
        label: "Ordenar columna DESC",
        action: function (e, column) {
          table.setSort(column._column.definition.field, "desc");
        },
      },
      {
        label: function (component) {
          return table.columnManager.columnsByField.extra.visible
            ? "Ocultar descripción"
            : "Mostrar descripción";
        },
        action: function (e, column) {
          if (table.columnManager.columnsByField.extra.visible) {
            table.columnManager.columnsByField.extra.hide();
          } else {
            table.columnManager.columnsByField.extra.show();
          }
          table.redraw();
        },
      },
    ];
  
    var tableHeaders = loadHeaders(headerContextMenu);
  
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
  
    var table = new Tabulator("#data_dishes_block_table", {
      data: tabledata,
      rowContextMenu: rowContextMenu,
      columns: tableHeaders,
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
  
      rowMoved: function (toTables) {
        saveData(this);
      },
      columnMoved: function (toTables) {
        saveData(this);
      },
      dataSorted: function (toTables) {
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
      dataLoaded: function(){
        saveData(this);
      }
    });
  
  
    //Add row on "Add Row" button click
    $("#add-row").click(function () {
      table.addRow();
    });
    //Add row on "Add Row" button click
    $("#delete-row").click(function () {
      table.deleteRow(table.getSelectedData().map((x) => x.id));
      saveData(table);
    });
    $("#savedata").click(function () {
      saveData(table);
    });
    $("body").on("blur", "textarea", function () {
      var id = parseInt($(this).attr("data-rel"));
  
      var row = table.getRow(id);
      row.update({ extra: $(this).val() });
      saveData(table);
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
  
    function loadHeaders(headerContextMenu) {
      var headers = [
        {
          formatter: "rowSelection",
          titleFormatter: "rowSelection",
          headerSort: false,
          cellClick: function (e, cell) {
            cell.getRow().toggleSelect();
          },
          width: 50,
          htmlOutput:false
        },
        {
          title: "",
          field: "handler",
          width: 50,
          headerSort: false,
          rowHandle: true,
          htmlOutput:false
        },
        {
          title: "Plato",
          field: "plato",
          headerSort: false,
          editor: true,
          headerContextMenu: headerContextMenu,
        },
        {
          title: "Extra",
          field: "extra",
          headerSort: false,
          editor: true,
          visible: true,
          headerContextMenu: headerContextMenu,
        },
        {
          title: "Precio",
          field: "precio",
          headerSort: false,
          editor: true,
          width: 100,
          headerContextMenu: headerContextMenu,
        },
      ];
      return headers;
    }
  
    function loadData(test = true) {
      var databag = [];
  
      if (!test) {
        var data_el = $param_elem.val() !== "" ? $param_elem.val() : "[{}]";
        databag = data_el.replace("`]}`", '"}]');
  
        databag = JSON.parse(databag);
      } else {
        var dummydata = [
          {
            extra: "ALERGIAS VARIAS",
            id: 1,
            plato: "A",
            precio: "2",
            subtable: true,
          },
          { id: 2, extra: "ESTO ES UAN DESCRIPCION", subtable: true, plato: "B" },
          { id: 3, plato: "C", extra: "OTRAS ALERGIAS", subtable: true },
          { id: 4, plato: "D", subtable: true },
        ];
  
        databag = dummydata;
      }
  
      databag = databag.map((x) =>
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
        return unsafe
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
     }
  
  
    function saveData(table) {
      var data_json = JSON.stringify(table.getData(true));
      var data_html = escapeHtml(table.getHtml());
  
      if (!test) {
        $param_elem.attr("value", data_json);
        $param_elem_table.attr("value", data_html);
        //console.log('saved!',data_html)
      }

      console.log('saved!')

      return data_json;
    }
  
  });
  