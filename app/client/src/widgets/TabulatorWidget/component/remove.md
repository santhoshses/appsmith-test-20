/* eslint-disable */
import React from "react";
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { cloneDeep, isEqual, difference, get } from "lodash";
import moment from "moment";
import { AnyIfEmpty } from "react-redux";
import flatpickr from "flatpickr";
import { ReturnFontSize } from "../util";

interface stateProps {
  data: any;
  columnDefinition: any;
  primaryColumns: any;
  isAdded: string;
  background: string | undefined;
  fontColor: string | undefined;
  fontSize: any;
  fontStyle: any;
  textAlign: any;
}
class TabulatorComponent extends React.Component<
  TabulatorComponentProps,
  stateProps
> {
  constructor(props: TabulatorComponentProps) {
    super(props);
    this.state = {
      data: [],
      columnDefinition: {},
      primaryColumns: {},
      isAdded: "New",
      background: this.props.cellBackground,
      fontColor: this.props.textColor,
      fontSize: this.props.textSize,
      fontStyle: this.props.fontStyle,
      textAlign: this.props.horizontalAlignment,
    };
  }
  el: any = React.createRef();
  tabulator: any = null;
  tableColumns: any = [];
  localPrimaryColumns: any = {};

  componentDidMount() {
    if (this.props.tableData) {
      this.generateGrid(
        this.props.tableData,
        this.props.columnDefinition,
        this.state.background ? this.state.background : "white",
        this.state.fontColor ? this.state.fontColor : "black",
        this.state.fontSize ? ReturnFontSize(this.state.fontSize) : "16px",
        this.state.fontStyle ? this.state.fontStyle : "normal",
        this.state.textAlign,
      );
    }
  }

  // shouldComponentUpdate(nextProps: any) {
  //   if (nextProps && nextProps.cellBackground !== this.state.background) {
  //     this.setState({ background: nextProps.cellBackground });
  //     this.generateGrid(
  //       this.props.tableData,
  //       this.props.primaryColumns,
  //       nextProps.cellBackground,
  //       this.state.fontColor,
  //       ReturnFontSize(this.state.fontSize),
  //       this.state.fontStyle,
  //       this.state.textAlign,
  //     );
  //     return true;
  //   }
  //   if (nextProps && nextProps.textColor !== this.state.fontColor) {
  //     this.setState({ fontColor: nextProps.textColor });
  //     this.generateGrid(
  //       this.props.tableData,
  //       this.props.primaryColumns,
  //       this.state.background,
  //       nextProps.textColor,
  //       ReturnFontSize(this.state.fontSize),
  //       this.state.fontStyle,
  //       this.state.textAlign,
  //     );
  //     return true;
  //   }
  //   if (nextProps && nextProps.textSize !== this.state.fontSize) {
  //     this.setState({ fontSize: nextProps.textSize });
  //     this.generateGrid(
  //       this.props.tableData,
  //       this.props.primaryColumns,
  //       this.state.background,
  //       this.state.fontColor,
  //       ReturnFontSize(nextProps.textSize),
  //       this.state.fontStyle,
  //       this.state.textAlign,
  //     );
  //     return true;
  //   }
  //   if (nextProps && nextProps.fontStyle !== this.state.fontStyle) {
  //     this.setState({ fontStyle: nextProps.fontStyle });
  //     this.generateGrid(
  //       this.props.tableData,
  //       this.props.primaryColumns,
  //       this.state.background,
  //       this.state.fontColor,
  //       ReturnFontSize(nextProps.textSize),
  //       nextProps.fontStyle,
  //       this.state.textAlign,
  //     );
  //     return true;
  //   }
  //   if (nextProps && nextProps.horizontalAlignment !== this.state.textAlign) {
  //     this.setState({ textAlign: nextProps.horizontalAlignment });
  //     this.generateGrid(
  //       this.props.tableData,
  //       this.props.primaryColumns,
  //       this.state.background,
  //       this.state.fontColor,
  //       ReturnFontSize(nextProps.textSize),
  //       nextProps.fontStyle,
  //       nextProps.horizontalAlignment,
  //     );
  //     return true;
  //   }

  //   this.updateColumnDefinitionFromWidget(nextProps);

  //   const isSame = isEqual(nextProps.tableData, this.state.data);
  //   if (nextProps && nextProps.tableData && !isSame) {
  //     this.generateGrid(
  //       nextProps.tableData,
  //       nextProps.primaryColumns,
  //       nextProps.cellBackground,
  //       nextProps.textColor,
  //       ReturnFontSize(nextProps.textSize),
  //       nextProps.fontStyle,
  //       nextProps.horizontalAlignment,
  //     );
  //     return true;
  //   }
  //   return false;
  // }

  private dateEditor(
    cell: any,
    onRendered: any,
    success: any,
    cancel: any,
    editorParams: any,
  ) {
    var editor = document.createElement("input");
    editor.value = cell.getValue();

    var datepicker = flatpickr(editor, {
      enableTime: true,
      dateFormat: "j-n-Y H:i",
      onClose: (selectedDates, dateStr, instance) => {
        success(dateStr);
        instance.destroy();
      },
    });

    onRendered(() => {
      editor.focus();
    });

    return editor;
  }

  // private updateColumnDefinitionFromWidget(columnDefinition: any) {
  //   const updateData = (cell: any) => {
  //     let rowId = cell.getData().id;
  //     let columnId = cell.getField();
  //     let value = cell.getValue();
  //     this.updatePropertiesMeta(rowId, columnId, value);
  //   };
  //   console.log(columnDefinition, "columnDefinition from compo");
  //   const oldPrimaryColumns = this.localPrimaryColumns;
  //   let diff: any = [];
  //   Object.entries(columnDefinition.primaryColumns).forEach(([key, value]) => {
  //     const values: any = value;
  //     Object.entries(values).forEach(([childKey, childValue]) => {
  //       console.log(childKey, childValue);
  //       const temp: string = childKey;
  //       const isPropertyAvail = oldPrimaryColumns.hasOwnProperty(key);
  //       if (isPropertyAvail) {
  //         const column = oldPrimaryColumns[key];
  //         const isColumnPropertyAvail = column.hasOwnProperty(childKey);
  //         if (isColumnPropertyAvail) {
  //           if (oldPrimaryColumns[key][childKey] !== childValue) {
  //             let old: boolean = false;
  //             if (typeof childValue === "object") {
  //               old =
  //                 JSON.stringify(oldPrimaryColumns[key][childKey]) ===
  //                 JSON.stringify(childValue);
  //             }
  //             if (!old) {
  //               const temp1 = {
  //                 [childKey]: childValue,
  //               };
  //               const path: any = {
  //                 [key]: temp1,
  //               };
  //               if (childKey !== "computedValue") {
  //                 diff.push(path);
  //               }
  //             }
  //           }
  //         }
  //       }
  //     });
  //   });
  //   console.log(diff, "diff");
  //   if (diff.length > 0) {
  //     this.localPrimaryColumns = columnDefinition.primaryColumns;
  //     const tableDef = this.tabulator.getColumnDefinitions();
  //     this.props.updateAppsmithColumnDefinition(tableDef);

  //     diff.forEach((element: any) => {
  //       Object.entries(element).forEach(([key, value]) => {
  //         const valueObj: any = value;
  //         if (valueObj.hasOwnProperty("columnType")) {
  //           let editor = valueObj["columnType"];
  //           let editorConfig: any = {};
  //           if (valueObj["columnType"] === "text") {
  //             editorConfig = { editor: false };
  //           } else if (valueObj["columnType"] === "input") {
  //             editorConfig = {
  //               editor: "input",
  //               cellEdited: function(cell: any) {
  //                 updateData(cell);
  //               },
  //             };
  //           } else if (valueObj["columnType"] === "star") {
  //             editorConfig = {
  //               editor: true,
  //               width: 200,
  //               formatter: "star",
  //               hozAlign: "center",
  //               cellEdited: function(cell: any) {
  //                 updateData(cell);
  //               },
  //             };
  //           } else if (valueObj["columnType"] === "select") {
  //             editorConfig = {
  //               editor: "select",
  //               editorParams: { values: true },
  //               cellEdited: function(cell: any) {
  //                 updateData(cell);
  //               },
  //             };
  //           } else if (valueObj["columnType"] === "autocomplete") {
  //             editorConfig = {
  //               editor: "autocomplete",
  //               editorParams: { values: true },
  //               cellEdited: function(cell: any) {
  //                 updateData(cell);
  //               },
  //             };
  //           } else if (valueObj["columnType"] === "date") {
  //             editorConfig = {
  //               editor: this.dateEditor,
  //               hozAlign: "center",
  //               sorter: "date",
  //               width: 140,
  //               cellEdited: function(cell: any) {
  //                 updateData(cell);
  //               },
  //             };
  //           } else if (valueObj["columnType"] === "progress") {
  //             editorConfig = {
  //               sorter: "number",
  //               hozAlign: "left",
  //               formatter: "progress",
  //               width: 140,
  //               editor: true,
  //             };
  //           } else {
  //             editorConfig = {
  //               editor: true,
  //               cellEdited: function(cell: any) {
  //                 updateData(cell);
  //               },
  //             };
  //           }
  //           tableDef.forEach((element: any) => {
  //             if (element.field === key) {
  //               Object.assign(element, editorConfig);
  //             }
  //           });
  //           this.updateTabulatorColumnDefinition(tableDef);
  //         }
  //       });
  //     });
  //   }

  //   debugger;
  // }

  updateTabulatorColumnDefinition(columns: any) {
    this.tabulator.setColumns(columns);
  }

  updatePropertiesMeta(rowId: any, columnId: any, value: any) {
    this.props.updateProperties(rowId, columnId, value);
  }

  private generateGrid(
    data: any,
    columnDefinition: any,
    bgColor: any,
    fontColor: any,
    fontsize: any,
    style: string,
    textAlign: string,
  ) {
    if (!textAlign) {
      textAlign = "left";
    }
    let weight = "normal";
    let italic = "normal";
    if (style.includes("BOLD")) {
      weight = "bold";
    } else if (style.includes("ITALIC")) {
      italic = "italic";
    }
    const clonedData = cloneDeep(data);
    // this.localPrimaryColumns = primaryColumns;
    this.setState({ data: clonedData }, () => {
      console.log(this.state.data, "generateGrid");
      this.tabulator = new Tabulator(this.el, {
        data: this.state.data,
        layout: "fitColumns",
        movableColumns: true,
        tabEndNewRow: true,
        columns: columnDefinition,
        rowFormatter: function(row) {
          row.getElement().style.backgroundColor = bgColor;
          row.getElement().style.color = fontColor;
          row.getElement().style.fontSize = fontsize;
          row.getElement().style.fontWeight = weight;
          row.getElement().style.fontStyle = italic;
          row.getElement().style.textAlign = textAlign.toLowerCase();
          row.getElement().style.border = "1px ridge gray";
        },
        selectable: 1,
        selectableRollingSelection: false,
        // autoColumns: true,
        // autoColumnsDefinitions: (definitions: any) => {
        //   this.tableColumns = [];
        //   definitions.forEach((column: any) => {
        //     this.tableColumns.push(column);
        //     column.headerFilter = true;
        //   });

        //   console.log(this.tableColumns, "this.tableColumns");
        //   this.props.updateAppsmithColumnDefinition(this.tableColumns);
        //   return definitions;
        // },
      });
    });
    const tableDataModified =
      JSON.stringify(data) !== JSON.stringify(this.state.data);
    if (!tableDataModified) {
      return;
    }
  }
  addRow = () => {
    this.props.addNewRow();
  };

  saveRow = () => {
    this.props.saveNewRow();
  };

  render() {
    return (
      <div className="w-full flex flex-col">
        <div ref={(el) => (this.el = el)} id="tabulator_table" />
        {this.props.tableData && this.props.tableData.length > 0 && (
          <div className="ml-auto mt-2">
            <button
              className="p-1 bg-green-300 rounded-md mr-2 hover:bg-green-600"
              onClick={this.props.handleSaveClick}
            >
              Save
            </button>
            <button
              className="p-1 bg-green-300 rounded-md  hover:bg-green-600"
              onClick={this.addRow}
            >
              New
            </button>
          </div>
        )}
      </div>
    );
  }
}

export interface TabulatorComponentProps {
  columnDefinition: any;
  columnType: string;
  height: number;
  primaryColumns: any;
  tableData: any;
  updateAppsmithColumnDefinition: (data: any) => void;
  cellBackground?: string;
  updateProperties: (rowId: any, columnId: any, value: any) => void;
  handleSaveClick: () => void;
  addNewRow: () => void;
  saveNewRow: () => void;
  textColor?: string;
  textSize?: any;
  fontStyle?: string;
  horizontalAlignment?: string;
}

export default TabulatorComponent;
