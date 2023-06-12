import moment from "moment-timezone";
import _ from "lodash";
// import store from "../../../store";

export const getEditorConfig = (
  valueObj: any,
  buttonClick: any,
  updateSelectedRow: any,
  menuDropdownClick: any,
  cellInputChange: any,
  handleCellOnBlur: any,
  handleSelectChange: any,
  checkIfEditable: any,
  primaryColumns: any,
  selectedRow: any,
  multiRowSelect: boolean,
  singleRowSelect: boolean,
  tableBackground: any,
  props: any,
) => {
  let modifiedColumn: any = {};
  window.localStorage.setItem("valueObj", JSON.stringify(valueObj));
  const convertToArray = (option: string[]) => {
    if (Array.isArray(option)) {
      const object = option.reduce(
        //(obj, item: any) => Object.assign(obj, { [item.value]: item.label }),
        (obj, item: any) =>
          Object.assign(
            obj,
            valueObj.isNewDropdownFormat
              ? {
                  [item.value]: item.value + " (" + item.label + ")",
                }
              : { [item.value]: item.label },
          ),
        {},
      );
      return object;
    }
    // let valuesArray = [];
    // for (let i = 0; i < option?.length; i++) {
    //   valuesArray.push(Object.values(option[i])[1]);
    // }
  };

  const validateCellData = (cell: any) => {
    const rowData = cell.getRow().getData();
    cell
      .getRow()
      .getCells()
      .forEach((cell: any) => {
        const field = cell.getColumn().getField();

        if (
          field &&
          primaryColumns[field] &&
          primaryColumns[field].columnType == "checkbox"
        ) {
          if (!rowData.hasOwnProperty(field)) {
            rowData.field = false;
          } else {
            if (typeof rowData[field] !== "boolean") rowData[field] = false;
          }
          return;
        }
        if (rowData[field] == undefined) {
          rowData[field] = "";
        }
      });

    return rowData;
  };

  const cellBlur = (cell: any) => {
    const cells = cell.getTable().getEditedCells();
    const indexArray: any = [];
    cells.forEach(function (cell: any) {
      const row = cell.getRow();
      const index = row.getPosition();
      if (!indexArray.includes(index)) {
        indexArray.push(index);
      }
    });

    const rowData = validateCellData(cell);
    handleCellOnBlur(
      cell.getField(),
      indexArray,
      cell.getTable().getData(),
      cell.getRow().getPosition(),
      rowData,
    );
  };

  const cellChanged = (cell: any) => {
    const cells = cell.getTable().getEditedCells();
    const indexArray: any = [];
    cells.forEach(function (cell: any) {
      const row = cell.getRow();
      const index = row.getPosition();
      if (!indexArray.includes(index)) {
        indexArray.push(index);
      }
    });

    const rowData = validateCellData(cell);

    cellInputChange(
      cell.getField(),
      indexArray,
      cell.getTable().getData(),
      cell.getRow().getPosition(),
      rowData,
    );
  };

  const selectChanged = (cell: any) => {
    const cells = cell.getTable().getEditedCells();
    const indexArray: any = [];
    cells.forEach(function (cell: any) {
      const row = cell.getRow();
      const index = row.getPosition();
      if (!indexArray.includes(index)) {
        indexArray.push(index);
      }
    });
    const rowData = validateCellData(cell);
    handleSelectChange(
      cell.getField(),
      indexArray,
      cell.getTable().getData(),
      cell.getRow().getPosition(),
      rowData,
    );
  };

  const cellBlurAndInputChanged = (cell: any) => {
    cellBlur(cell);
    cellChanged(cell);
  };

  function dateHeaderFilterFunc(headerValue: any, rowValue: any) {
    return headerValue.includes(rowValue);
  }

  function checkForSeletedRow(cell: any) {
    if (cell.getRow().isSelected()) {
      return checkIfEditable(cell);
    }
    return false;
  }

  const dateEditor = (
    cell: any,
    onRendered: any,
    success: any,
    cancel: any,
  ) => {
    const division = document.createElement("div");
    const button = document.createElement("button");
    division.style.display = "flex";
    division.style.width = "80%";
    button.innerHTML = "X";
    button.style.padding = "1px 10px";
    button.style.borderRadius = "4px";
    button.style.backgroundColor = "red";
    button.style.color = "white";
    button.style.fontWeight = "800";
    button.style.margin = "2px 4px 3px 4px";
    const editor = document.createElement("input");
    division.appendChild(editor);
    division.appendChild(button);
    editor.style.flex = "1";
    const cellValue = cell.getValue();
    editor.type = "datetime-local";
    editor.style.width = "100%";
    editor.value = typeof cellValue !== "undefined" ? cellValue : "";

    function converttoslash(data: any) {
      let senddate = "";
      for (let i = 0; i < data.length; i++) {
        if (data[i] == "-") {
          senddate = senddate + "/";
        } else {
          senddate = senddate + data[i];
        }
      }
      const date = senddate.split("/").reverse().join("/");
      const firstPart = date.slice(0, 2);
      const thirdPart = date.slice(8);
      const type = valueObj.dateFormat
        ? valueObj.dateFormat
        : "DD/MM/YYYY, hh:mm A";
      const day = firstPart;
      const month = thirdPart.slice(1, 3);
      const year = thirdPart.slice(4);
      const hour = date.slice(3, 5);
      const minute = date.slice(6, 8);
      const second = "00";
      const newFormat = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
        0,
      );

      const value = moment(newFormat).format(type);

      return value;
    }

    function successFunc() {
      success(converttoslash(editor.value)); //if value has changed save value
    }

    function blurHandler() {
      if (
        ((cellValue === null || typeof cellValue === "undefined") &&
          editor.value !== "") ||
        editor.value !== cellValue
      ) {
        if (editor.value) success(converttoslash(editor.value));
        else cancel();
      } else {
        cancel(); //otherwise cancel edit
      }
    }

    editor.addEventListener("change", successFunc);
    editor.addEventListener("blur", blurHandler);

    onRendered(() => {
      editor.focus();
    });
    return division;
  };

  const objArray: any = [];

  const buttonAdding = (
    cell: any,
    onRendered: any,
    success: any,
    cancel: any,
  ) => {
    const Btn = document.createElement("input");
    const cellValue = cell.getValue();
    Btn.type = "button";
    Btn.value = cell.getValue();
    Btn.style.padding = "2px";
    Btn.style.marginLeft = "auto";

    function successFunc() {
      success(Btn.value); //if value has changed save value
    }

    function blurHandler() {
      if (
        ((cellValue === null || typeof cellValue === "undefined") &&
          Btn.value !== "") ||
        Btn.value !== cellValue
      ) {
        if (Btn.value) success(Btn.value);
        else cancel();
      } else {
        cancel(); //otherwise cancel edit
      }
    }

    Btn.addEventListener("change", successFunc);
    Btn.addEventListener("blur", blurHandler);

    onRendered(() => {
      Btn.focus();
    });
    return Btn;
  };

  const buttonFormatter = (cell: any) => {
    const value = cell.getValue();
    // eslint-disable-next-line prefer-const
    if (Array.isArray(valueObj.buttonColor)) {
      if (valueObj.buttonColor.length > 0) {
        const val = cell.getRow().getPosition();
        cell.getElement().style.color = valueObj.buttonColor[val];
      }
    }
    if (Array.isArray(valueObj.cellBackground)) {
      if (valueObj.cellBackground.length > 0) {
        const val = cell.getRow().getPosition();
        cell.getElement().style.backgroundColor = valueObj.cellBackground[val];
      }
    }
    if (valueObj.buttonColor) {
      const color = valueObj.buttonColor;
      cell.getElement().style.backgroundColor = color;
    }
    if (Array.isArray(valueObj.buttonLabel)) {
      if (valueObj.buttonLabel.length > 0) {
        const val = cell.getRow().getPosition();
        return valueObj.buttonLabel[val];
      }
    }
    if (valueObj.buttonLabelColor) {
      cell.getElement().style.color = valueObj.buttonLabelColor;
    }
    return value;
  };
  const formatter = (cell: any) => {
    const value = cell.getValue();
    if (valueObj["columnType"] === "input") {
      cell.getElement().addEventListener("keyup", function (e: any) {
        e.preventDefault();
        cell.getElement()?.classList?.remove("tabulator-editing");
        if (!_.includes(cell.getElement()?.classList, "cell-selected"))
          cell.getElement()?.classList?.add("cell-selected");
      });
      cell.getElement().addEventListener("change", function (e: any) {
        e.preventDefault();
        cell.getElement()?.classList?.add("cell-confirmed");
      });
      cell.getElement().addEventListener("blur", function (e: any) {
        e.preventDefault();
        cell.getElement()?.classList?.remove("cell-selected");
      });
    }

    if (Array.isArray(selectedRow) && selectedRow.length > 0) {
      for (let i = 0; i < selectedRow.length; i++) {
        if (selectedRow[i] === cell.getRow().getPosition())
          cell.getRow().select();
      }
    }

    if (Array.isArray(valueObj.textColor)) {
      if (valueObj.textColor.length > 0) {
        const val = cell.getRow().getPosition();
        cell.getElement().style.color = valueObj.textColor[val];
      }
    }
    if (Array.isArray(valueObj.cellBackground)) {
      if (valueObj.cellBackground.length > 0) {
        const val = cell.getRow().getPosition();
        cell.getElement().style.backgroundColor = valueObj.cellBackground[val];
      }
    }
    if (valueObj.textColor) {
      const color = valueObj.textColor;
      cell.getElement().style.color = color;
    }
    const editable =
      multiRowSelect || singleRowSelect
        ? checkForSeletedRow(cell)
        : checkIfEditable(cell);
    if (!editable) {
      // cell.getElement().style.backgroundColor = "gray";
      // cell.getElement().style.opacity = 0.7;
      // cursor = not allowed will dispatch events even it is not - allowed so using point events = none
      //cell.getElement().style.cursor = "not-allowed";
      cell.getElement().style.pointerEvents = "none";
    } else {
      if (valueObj.cellBackground) {
        cell.getElement().style.backgroundColor = valueObj.cellBackground;
      }
    }
    if (Array.isArray(valueObj.isCellVisible)) {
      if (valueObj.isCellVisible.length > 0) {
        const index = cell.getRow().getPosition();
        if (!valueObj.isCellVisible[index]) {
          // when using visibility=hidden opacity=0 display=none any of these to hide text border also getting hidden
          // so using backgound to color to hide and pointerevents to none.
          cell.getElement().style.color = valueObj.cellBackground
            ? valueObj.cellBackground
            : tableBackground
            ? tableBackground
            : "white";
          cell.getElement().style.pointerEvents = "none";
        }
      }
    }

    return value != "" ? value : "&nbsp;";
  };

  const checkBoxEditor = (cell: any, onRendered: any, success: any) => {
    const input = cell.getElement().querySelector("input");
    const value = input.checked ? input.checked : false;
    input.addEventListener("change", function () {
      success(value);
    });
    input.addEventListener("blur", function () {
      success(value);
    });
  };

  const checkBoxFormatter = (cell: any) => {
    if (Array.isArray(selectedRow) && selectedRow.length > 0) {
      for (let i = 0; i < selectedRow.length; i++) {
        if (selectedRow[i] === cell.getRow().getPosition())
          cell.getRow().select();
      }
    }
    const editable =
      multiRowSelect || singleRowSelect
        ? checkForSeletedRow(cell)
        : checkIfEditable(cell);

    const value = cell.getValue();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "tabulator-custom-checkbox";
    if (!editable) {
      cell.getElement().style.pointerEvents = "none";
      checkbox.disabled = true;
    } else {
      if (valueObj.cellBackground) {
        cell.getElement().style.backgroundColor = valueObj.cellBackground;
      }
    }
    checkbox.checked =
      value === true || value === "true" || value === "True" || value === 1
        ? true
        : false;

    if (Array.isArray(valueObj.isCellVisible)) {
      if (valueObj.isCellVisible.length > 0) {
        const index = cell.getRow().getPosition();
        if (!valueObj.isCellVisible[index]) {
          cell.getElement().style.color = valueObj.cellBackground
            ? valueObj.cellBackground
            : tableBackground
            ? tableBackground
            : "white";
          cell.getElement().style.pointerEvents = "none";
          checkbox.disabled = false;
        }
      }
    }
    return checkbox;
  };

  // const checkBoxFormatter = (
  //   cell: any,
  //   formatterParams: any,
  //   onRendered: any,
  // ) => {
  //   const value = cell.getValue(),
  //     element = cell.getElement(),
  //     empty = formatterParams.allowEmpty,
  //     truthy = formatterParams.allowTruthy,
  //     trueValueSet = Object.keys(formatterParams).includes("trueValue"),
  //     tick =
  //       typeof formatterParams.tickElement !== "undefined"
  //         ? formatterParams.tickElement
  //         : '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>',
  //     cross =
  //       typeof formatterParams.crossElement !== "undefined"
  //         ? formatterParams.crossElement
  //         : '<svg enable-background="new 0 0 24 24" height="14" width="14"  viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';

  //   const editable = handleCellClick(cell);
  //   if (!editable) {
  //     element.style.backgroundColor = "gray";
  //     element.style.opacity = 0.4;
  //     element.style.cursor = "not-allowed";
  //   }
  //   if (
  //     (trueValueSet && value === formatterParams.trueValue) ||
  //     (!trueValueSet &&
  //       ((truthy && value) ||
  //         value === true ||
  //         value === "true" ||
  //         value === "True" ||
  //         value === 1 ||
  //         value === "1"))
  //   ) {
  //     element.setAttribute("aria-checked", true);
  //     return tick || "";
  //   } else {
  //     if (
  //       empty &&
  //       (value === "null" ||
  //         value === "" ||
  //         value === null ||
  //         typeof value === "undefined")
  //     ) {
  //       element.setAttribute("aria-checked", "mixed");
  //       return "";
  //     } else {
  //       element.setAttribute("aria-checked", false);
  //       return cross || "";
  //     }
  //   }
  // };

  if (valueObj.hasOwnProperty("columnType")) {
    let editorConfig: any = {};
    if (valueObj["columnType"] === "text") {
      editorConfig = {
        title: valueObj.label,
        // validator:
        //   valueObj.regExp && valueObj.regExp.length > 0
        //     ? `regex:${valueObj.regExp}`
        //     : `regex:[\s\S]*`,
        formatter: "plaintext",
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        formatterParams: formatter,
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        cellClick: function (e: any, cell: any) {
          e.preventDefault();
          e.stopPropagation();
          const rowIndex = cell.getRow().getPosition();
          const editable =
            multiRowSelect || singleRowSelect
              ? checkForSeletedRow(cell)
              : checkIfEditable(cell);
          if (editable)
            buttonClick(rowIndex, cell.getField(), cell.getRow().getData());
        },
      };
    } else if (valueObj["columnType"] === "input") {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.isRequired === "true" &&
          valueObj.regExp &&
          valueObj.regExp.length > 0
            ? ["required", `regex:${valueObj.regExp}`]
            : valueObj.isRequired === "true"
            ? "required"
            : valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editor: "input",
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,

        cellEditCancelled: cellBlur,
        cellEdited: cellBlurAndInputChanged,
        formatter: formatter,
      };
    } else if (valueObj["columnType"] === "number") {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        editor: "number",
        editorParams: {
          min: valueObj.min,
          max: valueObj.max,
        },
        cellEditCancelled: cellBlur,
        cellEdited: cellChanged,
        formatter: formatter,
      };
    } else if (valueObj["columnType"] === "textarea") {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        editor: "textarea",
        cellEditCancelled: cellBlur,
        cellEdited: cellChanged,
        formatter: formatter,
      };
    } else if (valueObj["columnType"] === "checkbox") {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        editor: checkBoxEditor,
        formatter: checkBoxFormatter,
        cellEdited: cellChanged,
      };
    } else if (valueObj["columnType"] === "star") {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editor: true,
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        formatter: "star",
        hozAlign: "center",
      };
    } else if (valueObj["columnType"] === "button") {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editor: buttonAdding,
        formatter: buttonFormatter,
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        cellClick: function (e: any, cell: any) {
          e.preventDefault();
          e.stopPropagation();
          const rowIndex = cell.getRow().getPosition();
          const editable =
            multiRowSelect || singleRowSelect
              ? checkForSeletedRow(cell)
              : checkIfEditable(cell);
          if (editable)
            buttonClick(rowIndex, cell.getField(), cell.getRow().getData());
        },
      };
    } else if (valueObj["columnType"] === "select") {
      editorConfig = {
        title: valueObj.label,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        editor: "autocomplete",
        editorParams: {
          values: convertToArray(valueObj.options),
          allowEmpty: false,
          showListOnEmpty: true,
          valuesLookup: true,
        },
        formatter: formatter,
        headerFilter: "list",
        headerFilterFunc: "=",
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        cellEdited: selectChanged,
        headerFilterParams: convertToArray(valueObj.options),
      };
    } else if (valueObj["columnType"] === "iconButton") {
      editorConfig = {
        title: valueObj.label,
        validator: `regex:${valueObj.regExp}`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        formatter: function (cell: any) {
          if (Array.isArray(selectedRow) && selectedRow.length > 0) {
            for (let i = 0; i < selectedRow.length; i++) {
              if (selectedRow[i] === cell.getRow().getPosition())
                cell.getRow().select();
            }
          }
          const element = document.createElement("button");
          element.style.width = "100%";
          // element.className = "flex justify-center items-center";
          element.style.backgroundColor =
            valueObj.buttonColor === "" ||
            valueObj.buttonColor === undefined ||
            valueObj.buttonColor === null
              ? "transparent"
              : Array.isArray(valueObj.buttonColor)
              ? valueObj.buttonColor[0]
              : valueObj.buttonColor;
          element.innerHTML = `
          <span class="bp3-icon-standard bp3-icon-${
            valueObj.iconName ? valueObj.iconName : "add"
          } "></span>
          `;
          element.style.borderRadius =
            props.childStylesheet?.iconButton?.borderRadius;
          element.style.color = valueObj.textColor || "black";
          const editable =
            multiRowSelect || singleRowSelect
              ? checkForSeletedRow(cell)
              : checkIfEditable(cell);
          if (!editable) {
            // cell.getElement().style.backgroundColor = "gray";
            // cell.getElement().style.opacity = 0.7;
            // cursor = not allowed will dispatch events even it is not - allowed so using point events = none
            //cell.getElement().style.cursor = "not-allowed";
            cell.getElement().style.pointerEvents = "none";
          }
          if (Array.isArray(valueObj.isCellVisible)) {
            if (valueObj.isCellVisible.length > 0) {
              const index = cell.getRow().getPosition();
              if (!valueObj.isCellVisible[index]) {
                cell.getElement().style.color = valueObj.cellBackground
                  ? valueObj.cellBackground
                  : tableBackground
                  ? tableBackground
                  : "white";
                cell.getElement().style.pointerEvents = "none";
              }
            }
          }
          return element;
        },
        cellClick: function (e: any, cell: any) {
          e.preventDefault();
          e.stopPropagation();
          const rowIndex = cell.getRow().getPosition();
          const editable =
            multiRowSelect || singleRowSelect
              ? checkForSeletedRow(cell)
              : checkIfEditable(cell);
          if (editable)
            buttonClick(rowIndex, cell.getField(), cell.getRow().getData());
        },
      };
    } else if (valueObj["columnType"] === "autocomplete") {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editor: "autocomplete",
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        editorParams: {
          values: true,
          allowEmpty: true,
          freetext: true,
          showListOnEmpty: true,
        },
        formatter: formatter,
        headerFilterFunc: "=",
        headerFilterParams: {
          values: true,
          allowEmpty: true,
          showListOnEmpty: true,
        },
        cellEdited: cellChanged,
      };
    } else if (valueObj["columnType"] === "date") {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        editor: dateEditor,
        cellEditCancelled: cellBlur,
        cellEdited: cellChanged,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,

        // hozAlign: "center",
        // sorter: "date",
        formatter: formatter,
        headerFilter: "input",
        headerFilterFunc: dateHeaderFilterFunc,
      };
    } else if (valueObj["columnType"] === "progress") {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        sorter: "number",
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,
        cellEditCancelled: cellBlur,
        cellEdited: cellChanged,
        hozAlign: "left",
        formatter: "progress",
        editor: true,
      };
    } else if (valueObj["columnType"] === "menuButton") {
      let editable: boolean;
      for (const menuItems in valueObj.menuItems) {
        if (valueObj.menuItems[menuItems].isVisible) {
          objArray.push({
            label:
              `
          <span class="bp3-icon-standard bp3-icon-${
            valueObj.menuItems[menuItems].iconName &&
            valueObj.menuItems[menuItems].iconName
          } 
              "></span>
          ` + valueObj.menuItems[menuItems].label,
            action: function (e: any, cell: any) {
              menuDropdownClick(
                cell.getField(),
                valueObj.menuItems[menuItems].id,
                cell.getRow().getPosition(),
                cell.getRow().getData(),
              );
            },
            disabled: function (cell: any) {
              const rowIndex = cell.getRow().getPosition();
              if (Array.isArray(valueObj.menuItems[menuItems].isDisabled)) {
                return valueObj.menuItems[menuItems].isDisabled[rowIndex];
              } else {
                return valueObj.menuItems[menuItems].isDisabled;
              }
            },
            seperator: true,
          });
        }
      }
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        hozAlign: "left",
        clickMenu: function (cell: any) {
          editable =
            multiRowSelect || singleRowSelect
              ? checkForSeletedRow(cell)
              : checkIfEditable(cell);
          if (!editable) {
            return false;
          }
          return objArray;
        },
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,

        formatter: function (cell: any) {
          if (Array.isArray(selectedRow) && selectedRow.length > 0) {
            for (let i = 0; i < selectedRow.length; i++) {
              if (selectedRow[i] === cell.getRow().getPosition())
                cell.getRow().select();
            }
          }
          editable =
            multiRowSelect || singleRowSelect
              ? checkForSeletedRow(cell)
              : checkIfEditable(cell);
          if (!editable) {
            // cell.getElement().style.backgroundColor = "gray";
            // cell.getElement().style.opacity = 0.7;
            // cursor = not allowed will dispatch events even it is not - allowed so using point events = none
            //cell.getElement().style.cursor = "not-allowed";
            cell.getElement().style.pointerEvents = "none";
          }
          const rowIndex = cell.getRow().getPosition();
          // cell.getElement().style.backgroundColor = props.cellBackground
          //   ? props.cellBackground
          //   : "transparent";
          const element = document.createElement("button");
          // element.className = "flex justify-center items-center";
          element.style.padding = "0px 8px";
          // applying theming to the menu buttons
          element.style.backgroundColor =
            valueObj.menuColor === "" ||
            valueObj.menuColor === undefined ||
            valueObj.menuColor === null
              ? "transparent"
              : valueObj.menuColor;
          // ? Array.isArray(props.childStylesheet.menuButton.menuColor) &&
          //   props.childStylesheet.menuButton.menuColor.length
          //   ? props.childStylesheet.menuButton.menuColor[0]
          //   : props.childStylesheet.menuButton.menuColor.length === 7
          //   ? props.childStylesheet.menuButton.menuColor
          //   : store.getState().ui.appTheming.selectedTheme.properties.colors
          //       .primaryColor
          // : Array.isArray(valueObj.menuColor)
          // ? valueObj.menuColor[0]
          // : valueObj.menuColor;
          element.innerHTML = `
          <span class="bp3-icon-standard bp3-icon-${
            valueObj.iconName ? valueObj.iconName : "add"
          }
           "></span><span> &nbsp  ${
             Array.isArray(valueObj.menuButtonLabel) &&
             valueObj.menuButtonLabel.length > 0 &&
             valueObj.menuButtonLabel[rowIndex]
               ? valueObj.menuButtonLabel[rowIndex]
               : ""
           }</span>
          `;
          element.style.color = valueObj.textColor
            ? valueObj.textColor
            : "black";
          element.style.borderRadius =
            props.childStylesheet?.menuButton?.borderRadius;

          if (Array.isArray(valueObj.isCellVisible)) {
            if (valueObj.isCellVisible.length > 0) {
              const index = cell.getRow().getPosition();
              if (!valueObj.isCellVisible[index]) {
                cell.getElement().style.color = valueObj.cellBackground
                  ? valueObj.cellBackground
                  : tableBackground
                  ? tableBackground
                  : valueObj.cellBackground;
                cell.getElement().style.pointerEvents = "none";
              }
            }
          }
          return element;
        },
        cellClick: function (e: any, cell: any) {
          e.preventDefault();
          e.stopPropagation();
          // const rowIndex = cell.getRow().getPosition();
          const editable =
            multiRowSelect || singleRowSelect
              ? checkForSeletedRow(cell)
              : checkIfEditable(cell);
          if (editable) return objArray;
        },
      };
    } else {
      editorConfig = {
        title: valueObj.label,
        width: valueObj.columnWidth ? valueObj.columnWidth + "%" : 25 + "%",
        validator:
          valueObj.regExp && valueObj.regExp.length > 0
            ? `regex:${valueObj.regExp}`
            : `regex:[\s\S]*`,
        visible: Array.isArray(valueObj.isCellVisible)
          ? true
          : valueObj.isVisible && valueObj.isCellVisible,
        editable:
          multiRowSelect || singleRowSelect
            ? checkForSeletedRow
            : checkIfEditable,

        editor: "input",
        formatter: formatter,
      };
    }
    modifiedColumn = editorConfig;
  }
  return modifiedColumn;
};
