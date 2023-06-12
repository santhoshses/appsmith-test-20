import React from "react";
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import "../widget/widget.css";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { cloneDeep, isEqual } from "lodash";
import { ReturnFontSize } from "../util";
import { Loader } from "./Loader";
import _ from "lodash";
import { ReactComponent as SearchIcon } from "assets/icons/ads/search.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import checkedImage from "assets/images/checked.png";
import uncheckedImage from "assets/images/unchecked.png";

interface stateProps {
  data: any;
  originalData: any;
  columnsDef: any;
  background: string | undefined;
  fontColor: string | undefined;
  fontSize: any;
  fontStyle: any;
  textAlign: any;
  dataPersistence: any;
  selectedRow: any;
  bg: any;
  buttonColor: any;
  saveButton: any;
  movableRowsToTable: any;
  newButton: any;
  resetButton: any;
  loading: any;
  // pm: any;
  pageSize: any;
  isgroupBy: any;
  ismultigroupBy: any;
  isrowMovable: any;
  multiSelectRow: any;
  resetButtonColor: any;
  saveButtonColor: any;
  newButtonColor: any;
  resetButtonEnable: any;
  newButtonEnable?: any;
  saveButtonEnable?: any;
  updateSelectedRow?: any;
  globalSearch?: any;
  filteredData?: any;
  isEditing?: any;
}
class TabulatorComponent extends React.Component<
  TabulatorComponentProps,
  stateProps
> {
  constructor(props: TabulatorComponentProps) {
    super(props);
    this.state = {
      data: [],
      originalData: [],
      columnsDef: [],
      background: this.props.cellBackground,
      fontColor: this.props.textColor,
      fontSize: this.props.textSize,
      fontStyle: this.props.fontStyle,
      textAlign: this.props.horizontalAlignment,
      selectedRow: this.props.editedRowIndex,
      bg: this.props.bgColor,
      dataPersistence: this.props.dataPersistence,
      buttonColor: this.props.color,
      saveButton: this.props.saveButtonLabel,
      movableRowsToTable: this.props.movableRowsToTable,
      newButton: this.props.newButtonLabel,
      resetButton: this.props.resetButtonLabel,
      loading: this.props.loading,
      pageSize: this.props.pageSize,
      // pm: this.props.primaryColumns,
      isgroupBy: this.props.isgroupBy,
      ismultigroupBy: this.props.ismultigroupBy,
      isrowMovable: this.props.isrowMovable,
      multiSelectRow: this.props.multiSelectRow,
      resetButtonColor: this.props.resetButtonColor,
      saveButtonColor: this.props.saveButtonColor,
      newButtonColor: this.props.newButtonColor,
      resetButtonEnable: this.props.resetButtonEnable,
      newButtonEnable: this.props.newButtonEnable,
      saveButtonEnable: this.props.saveButtonEnable,
      updateSelectedRow: this.props.updateSelectedRow,
      globalSearch: "",
      filteredData: this.props.filteredData,
      isEditing: false,
    };
    this.shouldRestore = this.shouldRestore.bind(this);
    this.setIsEditing = this.setIsEditing.bind(this);
    this.returnPlaceholder = this.returnPlaceholder.bind(this);
  }
  el: any = React.createRef();
  tabulator: any = null;
  tableDataHolder: any = [];
  columnsDefHolder: any = [];
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
    this.forceUpdate();
  }
  shouldComponentUpdate(nextProps: any) {
    if (nextProps && nextProps.pageSize !== this.state.pageSize) {
      this.setState({ pageSize: nextProps.pageSize });
      this.forceUpdate();
    }
    if (nextProps && nextProps.loading !== this.state.loading) {
      this.setState({ loading: nextProps.loading });
      this.forceUpdate();
    }
    if (nextProps && nextProps.bgColor !== this.state.bg) {
      this.setState({ bg: nextProps.bgColor });
      this.forceUpdate();
    }
    if (nextProps && nextProps.newButtonLabel !== this.state.newButton) {
      this.setState({ newButton: nextProps.newButtonLabel });
      this.forceUpdate();
    }
    if (nextProps && nextProps.resetButtonLabel !== this.state.resetButton) {
      this.setState({ resetButton: nextProps.resetButtonLabel });
      this.forceUpdate();
    }
    if (
      nextProps &&
      nextProps.resetButtonColor !== this.state.resetButtonColor
    ) {
      this.setState({ resetButtonColor: nextProps.resetButtonColor });
      this.forceUpdate();
    }
    if (nextProps && nextProps.saveButtonColor !== this.state.saveButtonColor) {
      this.setState({ saveButtonColor: nextProps.saveButtonColor });
      this.forceUpdate();
    }
    if (nextProps && nextProps.globalSearch !== this.state.globalSearch) {
      this.setState({ globalSearch: nextProps.globalSearch });
      this.forceUpdate();
    }
    if (nextProps && nextProps.filteredData !== this.state.filteredData) {
      this.setState({ filteredData: nextProps.filteredData });
      this.generateGrid(
        nextProps.tableData,
        nextProps.columnDefinition,
        nextProps.cellBackground,
        nextProps.textColor,
        ReturnFontSize(nextProps.textSize),
        nextProps.fontStyle,
        nextProps.horizontalAlignment,
      );
      return true;
    }
    if (nextProps && nextProps.newButtonColor !== this.state.newButtonColor) {
      this.setState({ newButtonColor: nextProps.newButtonColor });
      this.forceUpdate();
    }
    if (nextProps && nextProps.saveButtonLabel !== this.state.saveButton) {
      this.setState({ saveButton: nextProps.saveButtonLabel });
      this.forceUpdate();
    }
    if (
      nextProps &&
      nextProps.resetButtonEnable !== this.state.resetButtonEnable
    ) {
      this.setState({ resetButtonEnable: nextProps.resetButtonEnable });
      this.forceUpdate();
    }
    if (nextProps && nextProps.newButtonEnable !== this.state.newButtonEnable) {
      this.setState({ newButtonEnable: nextProps.newButtonEnable });
      this.forceUpdate();
    }
    if (
      nextProps &&
      nextProps.saveButtonEnable !== this.state.saveButtonEnable
    ) {
      this.setState({ saveButtonEnable: nextProps.saveButtonEnable });
      this.forceUpdate();
    }
    if (nextProps && nextProps.dataPersistence !== this.state.dataPersistence) {
      this.setState({ dataPersistence: nextProps.dataPersistence });
      this.generateGrid(
        this.props.tableData,
        this.props.columnDefinition,
        this.state.background,
        this.state.fontColor,
        ReturnFontSize(nextProps.textSize),
        nextProps.fontStyle,
        this.state.textAlign,
      );
      return true;
    }
    if (nextProps && nextProps.multiSelectRow !== this.state.multiSelectRow) {
      this.setState({ multiSelectRow: nextProps.multiSelectRow });
      this.forceUpdate();
    }
    if (nextProps && nextProps.color !== this.state.buttonColor) {
      this.setState({ buttonColor: nextProps.color });
      this.forceUpdate();
    }
    if (nextProps && nextProps.editedRowIndex !== this.state.selectedRow) {
      this.setState({ selectedRow: nextProps.editedRowIndex });
    }
    if (nextProps && nextProps.cellBackground !== this.state.background) {
      this.setState({ background: nextProps.cellBackground });
      this.generateGrid(
        this.props.tableData,
        this.props.columnDefinition,
        nextProps.cellBackground,
        this.state.fontColor,
        ReturnFontSize(this.state.fontSize),
        this.state.fontStyle,
        this.state.textAlign,
      );
      return true;
    }
    if (nextProps && nextProps.textColor !== this.state.fontColor) {
      this.setState({ fontColor: nextProps.textColor });
      this.generateGrid(
        this.props.tableData,
        this.props.columnDefinition,
        this.state.background,
        nextProps.textColor,
        ReturnFontSize(this.state.fontSize),
        this.state.fontStyle,
        this.state.textAlign,
      );
      return true;
    }
    if (nextProps && nextProps.textSize !== this.state.fontSize) {
      this.setState({ fontSize: nextProps.textSize });
      this.generateGrid(
        this.props.tableData,
        this.props.columnDefinition,
        this.state.background,
        this.state.fontColor,
        ReturnFontSize(nextProps.textSize),
        this.state.fontStyle,
        this.state.textAlign,
      );
      return true;
    }
    if (nextProps && nextProps.fontStyle !== this.state.fontStyle) {
      this.setState({ fontStyle: nextProps.fontStyle });
      this.generateGrid(
        this.props.tableData,
        this.props.columnDefinition,
        this.state.background,
        this.state.fontColor,
        ReturnFontSize(nextProps.textSize),
        nextProps.fontStyle,
        this.state.textAlign,
      );
      return true;
    }
    if (nextProps && nextProps.horizontalAlignment !== this.state.textAlign) {
      this.setState({ textAlign: nextProps.horizontalAlignment });
      this.generateGrid(
        this.props.tableData,
        this.props.columnDefinition,
        this.state.background,
        this.state.fontColor,
        ReturnFontSize(nextProps.textSize),
        nextProps.fontStyle,
        nextProps.horizontalAlignment,
      );
      return true;
    }
    const isColumnDef = isEqual(
      nextProps.columnDefinition,
      this.columnsDefHolder,
    );
    if (
      nextProps &&
      nextProps.columnDefinition &&
      nextProps.columnDefinition.length > 0 &&
      !isColumnDef
    ) {
      this.columnsDefHolder = nextProps.columnDefinition;
      this.generateGrid(
        nextProps.tableData,
        nextProps.columnDefinition,
        this.state.background,
        this.state.fontColor,
        ReturnFontSize(nextProps.textSize),
        nextProps.fontStyle,
        nextProps.horizontalAlignment,
      );
    }
    const isSame = isEqual(nextProps.tableData, this.tableDataHolder);
    if (nextProps && nextProps.tableData && !isSame) {
      this.generateGrid(
        nextProps.tableData,
        nextProps.columnDefinition,
        nextProps.cellBackground,
        nextProps.textColor,
        ReturnFontSize(nextProps.textSize),
        nextProps.fontStyle,
        nextProps.horizontalAlignment,
      );
      return true;
    }
    // if (
    //   nextProps &&
    //   JSON.stringify(nextProps.primaryColumns) !== JSON.stringify(this.state.pm)
    // ) {
    //   this.setState({ pm: nextProps.primaryColumns });
    //   let changeData = false;
    //   let columnName = "";
    //   for (let i = 0; i < this.state.columnsDef.length; i++) {
    //     columnName = this.state.columnsDef[i].field;
    //     let flag = false;
    //     console.log(
    //       " changed columns ",
    //       columnName,
    //       this.state.data,
    //       this.props.primaryColumns,
    //     );
    //     for (let j = 0; j < this.state.data.length; j++) {
    //       if (
    //         this.props.primaryColumns[columnName].computedValue !== undefined &&
    //         this.props.primaryColumns[columnName].computedValue[j] !== null &&
    //         this.state.data[j][columnName] !==
    //           this.props.primaryColumns[columnName].computedValue[j]
    //       ) {
    //         console.log(
    //           " changed columns ",
    //           this.state.data[j][columnName],
    //           columnName,
    //         );
    //         flag = true;
    //         changeData = true;
    //         break;
    //       }
    //     }
    //     if (flag) break;
    //   }
    //   const data = [];
    //   console.log("** * ** * outside object ", columnName);
    //   if (changeData && columnName.length > 0) {
    //     for (let i = 0; i < this.props.tableData.length; i++) {
    //       const object = { ...this.props.tableData[i] };
    //       object[columnName] = this.props.primaryColumns[
    //         columnName
    //       ].computedValue[i];
    //       console.log(" * ** ** * ** *inside object", object);
    //       data.push(object);
    //     }
    //     this.props.updateComputedValue(data);
    //   }
    //   console.log(" * ** ** * ** *inside data", data, this.state.data);
    //   this.callFunction(data);
    //   return true;
    // }
    return false;
  }
  // callFunction(data: any) {
  //   this.tabulator.replaceData(data);
  // }
  shouldRestore(tableData: any, editedData: any) {
    const restore = editedData.some((data: any) => {
      return !_.isEqual(data.data, tableData[data.index]);
    });
    return restore;
  }
  returnPlaceholder() {
    let placeholder = "No Data Available";
    if (this.state.globalSearch && this.state.globalSearch.length > 0) {
      if (this.state.filteredData && this.state.filteredData.length > 0) {
        placeholder = "";
      }
    } else {
      if (this.state.data && this.state.data.length > 0) {
        placeholder = "";
      }
    }
    return placeholder;
  }

  setIsEditing(value: boolean) {
    this.setState({ isEditing: value });
    this.forceUpdate();
  }

  private generateGrid(
    data: any,
    columnsDef: any,
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
    }
    if (style.includes("ITALIC")) {
      italic = "italic";
    }
    let clonedData = cloneDeep(data);
    this.tableDataHolder = data;
    if (
      Array.isArray(columnsDef) &&
      columnsDef.length > 0 &&
      Array.isArray(data) &&
      data.length > 0
    ) {
      for (let i = 0; i < columnsDef.length; i++) {
        const columnName = columnsDef[i].field;
        for (let j = 0; j < data.length; j++) {
          if (
            this.props.primaryColumns[columnName] !== undefined &&
            this.props.primaryColumns[columnName].computedValue !== undefined &&
            this.props.primaryColumns[columnName].computedValue[j] !== null &&
            Array.isArray(
              this.props.primaryColumns[columnName].computedValue,
            ) &&
            data[j][columnName] !==
              this.props.primaryColumns[columnName].computedValue[j]
          ) {
            clonedData.map(
              (data: any, index: any) =>
                (data[columnName] = this.props.primaryColumns[
                  columnName
                ].computedValue[index]),
            );
          }
        }
      }
    }
    if (
      this.props.dataPersistence &&
      this.props.editedTableData &&
      this.props.editedTableData.length > 0
    ) {
      clonedData = cloneDeep(this.props.editedTableData);
    }
    const setIsEditing = this.setIsEditing;
    this.setState(
      { data: clonedData, originalData: data, columnsDef: columnsDef },
      () => {
        // Implementation of column name change in multi-level groupBy
        const multigroupbyColumn = this.props.columnDefinition.filter(
          (i: any) => (this.props.ismultigroupBy || []).includes(i.title),
        );

        const multilevelgroupby = [];
        for (let i = 0; i < multigroupbyColumn.length; i++) {
          multilevelgroupby.push(multigroupbyColumn[i].field);
        }

        this.tabulator = new Tabulator(this.el, {
          data: this.state.globalSearch.length
            ? this.state.filteredData
            : this.state.data,
          placeholder: this.returnPlaceholder(),
          selectable: "highlight",
          columns: this.props.multiSelectRow
            ? [
                {
                  // not using the rowselection formatter because event is not working to catch the row selection event.
                  // cannot attach event listener on default row selection checkbox's because sometime it catch the event
                  // and sometimes not.
                  formatter: (cell: any) => {
                    if (cell.getRow().isSelected()) {
                      cell.getElement().style.backgroundImage = `url(${checkedImage})`;
                      cell
                        .getElement()
                        ?.classList?.add("tabulator-row-selection-checked");
                    } else {
                      cell.getElement().style.backgroundImage = `url(${uncheckedImage})`;
                      cell
                        .getElement()
                        ?.classList?.add("tabulator-row-selection");
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const rowSelectInput: HTMLInputElement | null = document.getElementById(
                      "row-select-input-type",
                    );
                    const selectedRows = this.tabulator.getData().length;
                    rowSelectInput?.addEventListener("click", () => {
                      if (rowSelectInput.checked === true) {
                        this.props.updateSelectedRow([
                          ...Array(selectedRows).keys(),
                        ]);
                      } else this.props.updateSelectedRow([]);
                    });
                    if (rowSelectInput) {
                      if (selectedRows === this.props.selectedRow.length)
                        rowSelectInput.checked = true;
                      else false;
                    }
                    return cell.getValue();
                  },
                  frozen: true,
                  titleFormatter: (a: any, b: any) => {
                    return "<input type=checkbox id=row-select-input-type></input>";
                  },
                  align: "center",
                  width: 10,
                  headerSort: false,
                  cellClick: (e: any, cell: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cell.getRow().toggleSelect();
                    const selectedRowIndex = cell
                      .getTable()
                      .getSelectedRows()
                      .map((row: any) => row.getPosition());
                    this.props.updateSelectedRow(selectedRowIndex);
                  },
                },
                ...this.state.columnsDef,
              ]
            : this.props.addRowBelow && this.props.singleSelectRow
            ? [
                ...this.state.columnsDef,
                {
                  formatter: (cell: any) => {
                    const button = document.createElement("button");
                    button.innerText = "+";
                    button.style.width = "95%";
                    button.style.backgroundColor = cell.getRow().isSelected()
                      ? "blue"
                      : "lightblue";
                    button.style.color = cell.getRow().isSelected()
                      ? "white"
                      : "black";
                    button.style.padding = "2px";
                    button.style.borderRadius = "5px";
                    if (!this.props.selectedRow.length) {
                      button.style.backgroundColor = "lightblue";
                    }
                    return button;
                  },
                  tooltip: "Add row below",
                  frozen: true,
                  titleFormatter: function() {
                    return "<p></p>";
                  },
                  width: "5px",
                  cellClick: (e: any, cell: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cell.getRow().toggleSelect();
                    this.addrowBelow(cell);
                  },
                },
                {
                  formatter: (cell: any) => {
                    const button = document.createElement("button");
                    button.innerText = "Edit";
                    button.style.width = "100%";
                    button.style.backgroundColor = cell.getRow().isSelected()
                      ? "blue"
                      : "lightblue";
                    button.style.color = cell.getRow().isSelected()
                      ? "white"
                      : "black";
                    button.style.padding = "2px";
                    button.style.borderRadius = "5px";
                    if (!this.props.selectedRow.length) {
                      button.style.backgroundColor = "lightblue";
                    }
                    return button;
                  },
                  frozen: true,
                  titleFormatter: function() {
                    return "<p>edit</p>";
                  },
                  cellClick: (e: any, cell: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (
                      !this.props.selectedRow.length ||
                      (Array.isArray(this.props.editedTableData) &&
                        !this.props.editedTableData.length) ||
                      this.props.editedTableData === undefined
                    ) {
                      cell.getRow().toggleSelect();
                      const selectedRowArray = [cell.getRow().getPosition()];
                      if (this.props.selectedRow.length) {
                        selectedRowArray[0] !== this.props.selectedRow[0]
                          ? this.props.updateSelectedRow(selectedRowArray)
                          : this.props.updateSelectedRow([]);
                      } else {
                        this.props.updateSelectedRow(selectedRowArray);
                      }
                    } else {
                      toast.info("Please save/reset the changes!");
                    }
                  },
                },
                {
                  formatter: (cell: any) => {
                    const button = document.createElement("button");
                    button.innerText = "Save";
                    button.style.width = "100%";
                    button.style.backgroundColor = "lightgreen";
                    button.style.padding = "2px";
                    button.style.borderRadius = "5px";
                    if (
                      !cell.getRow().isSelected() ||
                      this.props.editedTableData === undefined ||
                      !(
                        Array.isArray(this.props.editedTableData) &&
                        this.props.editedTableData.length
                      )
                    ) {
                      cell.getElement().style.pointerEvents = "none";
                      button.disabled = true;
                      button.style.opacity = "0.3";
                    }
                    return button;
                  },
                  frozen: true,
                  titleFormatter: function() {
                    return "<p>save</p>";
                  },
                  cellClick: (e: any, cell: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cell.getRow().toggleSelect();
                    this.props.selectedRow.length &&
                      Array.isArray(this.props.editedTableData) &&
                      this.props.editedTableData.length &&
                      this.props.handleSingleRowActions("onRowSaveClick", []);
                  },
                },
                {
                  formatter: (cell: any) => {
                    const button = document.createElement("button");
                    button.innerText = "Reset";
                    button.style.width = "100%";
                    button.style.backgroundColor = "grey";
                    button.style.padding = "2px";
                    button.style.borderRadius = "5px";
                    if (
                      !cell.getRow().isSelected() ||
                      this.props.editedTableData === undefined ||
                      !(
                        Array.isArray(this.props.editedTableData) &&
                        this.props.editedTableData.length
                      )
                    ) {
                      cell.getElement().style.pointerEvents = "none";
                      button.disabled = true;
                      button.style.opacity = "0.3";
                    }
                    return button;
                  },
                  frozen: true,
                  titleFormatter: function() {
                    return "<p>reset</p>";
                  },
                  cellClick: (e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.props.editedTableData &&
                      Array.isArray(this.props.editedTableData) &&
                      this.props.editedTableData.length &&
                      this.props.handleResetEditedData();
                  },
                },
              ]
            : this.props.addRowBelow
            ? [
                ...this.state.columnsDef,
                {
                  formatter: (cell: any) => {
                    const button = document.createElement("button");
                    button.innerText = "+";
                    button.style.width = "95%";
                    button.style.backgroundColor = cell.getRow().isSelected()
                      ? "blue"
                      : "lightblue";
                    button.style.color = cell.getRow().isSelected()
                      ? "white"
                      : "black";
                    button.style.padding = "2px";
                    button.style.borderRadius = "5px";
                    if (!this.props.selectedRow.length) {
                      button.style.backgroundColor = "lightblue";
                    }
                    return button;
                  },
                  tooltip: "Add row below",
                  frozen: true,
                  width: "5px",
                  titleFormatter: function() {
                    return "<p></p>";
                  },
                  cellClick: (e: any, cell: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cell.getRow().toggleSelect();
                    this.addrowBelow(cell);
                  },
                },
              ]
            : this.props.singleSelectRow
            ? [
                ...this.state.columnsDef,
                {
                  formatter: (cell: any) => {
                    const button = document.createElement("button");
                    button.innerText = "Edit";
                    button.style.width = "100%";
                    button.style.backgroundColor = cell.getRow().isSelected()
                      ? "blue"
                      : "lightblue";
                    button.style.color = cell.getRow().isSelected()
                      ? "white"
                      : "black";
                    button.style.padding = "2px";
                    button.style.borderRadius = "5px";
                    if (!this.props.selectedRow.length) {
                      button.style.backgroundColor = "lightblue";
                    }
                    return button;
                  },
                  frozen: true,
                  titleFormatter: function() {
                    return "<p>edit</p>";
                  },
                  cellClick: (e: any, cell: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (
                      !this.props.selectedRow.length ||
                      (Array.isArray(this.props.editedTableData) &&
                        !this.props.editedTableData.length) ||
                      this.props.editedTableData === undefined
                    ) {
                      cell.getRow().toggleSelect();
                      const selectedRowArray = [cell.getRow().getPosition()];
                      if (this.props.selectedRow.length) {
                        selectedRowArray[0] !== this.props.selectedRow[0]
                          ? this.props.updateSelectedRow(selectedRowArray)
                          : this.props.updateSelectedRow([]);
                      } else {
                        this.props.updateSelectedRow(selectedRowArray);
                      }
                    } else {
                      toast.info("Please save/reset the changes!");
                    }
                  },
                },
                {
                  formatter: (cell: any) => {
                    const button = document.createElement("button");
                    button.innerText = "Save";
                    button.style.width = "100%";
                    button.style.backgroundColor = "lightgreen";
                    button.style.padding = "2px";
                    button.style.borderRadius = "5px";
                    if (
                      !cell.getRow().isSelected() ||
                      this.props.editedTableData === undefined ||
                      !(
                        Array.isArray(this.props.editedTableData) &&
                        this.props.editedTableData.length
                      )
                    ) {
                      cell.getElement().style.pointerEvents = "none";
                      button.disabled = true;
                      button.style.opacity = "0.3";
                    }
                    return button;
                  },
                  frozen: true,
                  titleFormatter: function() {
                    return "<p>save</p>";
                  },
                  cellClick: (e: any, cell: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cell.getRow().toggleSelect();
                    this.props.selectedRow.length &&
                      Array.isArray(this.props.editedTableData) &&
                      this.props.editedTableData.length &&
                      this.props.handleSingleRowActions("onRowSaveClick", []);
                  },
                },
                {
                  formatter: (cell: any) => {
                    const button = document.createElement("button");
                    button.innerText = "Reset";
                    button.style.width = "100%";
                    button.style.backgroundColor = "grey";
                    button.style.padding = "2px";
                    button.style.borderRadius = "5px";
                    if (
                      !cell.getRow().isSelected() ||
                      this.props.editedTableData === undefined ||
                      !(
                        Array.isArray(this.props.editedTableData) &&
                        this.props.editedTableData.length
                      )
                    ) {
                      cell.getElement().style.pointerEvents = "none";
                      button.disabled = true;
                      button.style.opacity = "0.3";
                    }
                    return button;
                  },
                  frozen: true,
                  titleFormatter: function() {
                    return "<p>reset</p>";
                  },
                  cellClick: (e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.props.editedTableData &&
                      Array.isArray(this.props.editedTableData) &&
                      this.props.editedTableData.length &&
                      this.props.handleResetEditedData();
                  },
                },
              ]
            : this.props.columnDefinition,
          layout: "fitDataStretch",
          movableColumns: true,
          groupBy: this.props.ismultigroupBy
            ? this.props.isgroupBy && this.props.ismultigroupBy.length
              ? multilevelgroupby
              : this.props.isgroupBy || multilevelgroupby
            : this.props.isgroupBy,
          movableRows: this.props.isrowMovable || this.props.movableRowsToTable,
          movableRowsConnectedTables: this.props.movableRowsToTable
            ? "#tabulator_table"
            : "",
          movableRowsReceiver: "add",
          movableRowsSender: "delete",
          //selectable: true,
          rowFormatter: (row: any) => {
            function hexToRgb(hex: string) {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                hex,
              );
              return result
                ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16),
                  }
                : null;
            }
            row.getElement().addEventListener("click", () => {
              const rgbCode = hexToRgb(this.props.accentColor);
              const rows = this.tabulator.getRows();
              if (row.getElement().getAttribute("selected") != "true") {
                rows.forEach((element: any) => {
                  element.getElement().setAttribute("selected", false);
                  element.getElement().style.backgroundColor = bgColor;
                  element.getElement().style.opacity = 1;
                });
                row.getElement().setAttribute("selected", true);
                row.getElement().style.backgroundColor = `rgba(${rgbCode?.r}, ${rgbCode?.g}, ${rgbCode?.b}, 0.2)`;
              } else {
                row.getElement().setAttribute("selected", false);
                row.getElement().style.backgroundColor = bgColor;
                row.getElement().style.opacity = 1;
              }
            });
            row.getElement().addEventListener("mouseover", () => {
              const rgbCode = hexToRgb(this.props.accentColor);
              row.getElement().style.backgroundColor = `rgba(${rgbCode?.r}, ${rgbCode?.g}, ${rgbCode?.b}, 0.2)`;
            });
            row.getElement().addEventListener("mouseleave", () => {
              if (row.getElement().getAttribute("selected") != "true") {
                row.getElement().style.backgroundColor = bgColor;
                row.getElement().style.opacity = 1;
              }
            });
            row.getElement().style.backgroundColor = bgColor;
            row.getElement().style.color = fontColor;
            row.getElement().style.fontSize = fontsize;
            row.getElement().style.fontWeight = weight;
            row.getElement().style.fontStyle = italic;
            row.getElement().style.textAlign = textAlign.toLowerCase();
            row.getElement().style.borderBottom = "1px ridge gray";
          },
          selectableRollingSelection: false,
          pagination: true,
          paginationSize: this.props.pageSize,
          paginationSizeSelector: true,
          paginationAddRow: "table",
        });

        this.tabulator.on("cellEditing", function() {
          setIsEditing(true);
        });

        this.tabulator.on("cellEditCancelled", function() {
          setIsEditing(false);
        });
        this.tabulator.on("cellEdited", function() {
          setIsEditing(false);
        });
      },
    );
  }
  deleteRow = () => {
    // const cells = this.tabulator.getEditedCells();
    // cells.forEach(function(cell: any) {
    //   // cell.clearEdited();
    //   const oldVal = cell.getOldValue();
    //   if (oldVal !== null) {
    //     cell.restoreOldValue();
    //   }
    // });
    // const oldData = [];
    // for (let i = 0; i < this.props.tableData.length; i++) {
    //   oldData.push({ ...this.props.tableData[i] });
    // }
    // this.props.resetEditedRowsData();
    //this.tabulator.replaceData(oldData);
    this.props.handleResetClick();
  };

  addRow = () => {
    if (
      this.tabulator &&
      this.tabulator.getData() &&
      this.tabulator.getData().length >= 0
    ) {
      const sampleRow = this.tabulator.getData()[0]
        ? this.tabulator.getData()[0]
        : this.props.primaryColumns;
      const newRow = { ...sampleRow };
      Object.keys(newRow).forEach((i: any) => (newRow[i] = ""));
      this.tabulator.addRow(newRow).then((row: any) => {
        row.scrollTo();
      });
      this.tabulator.redraw();
      this.props.setNewRow();
    }
  };

  addrowBelow = (cell: any) => {
    if (
      this.tabulator &&
      this.tabulator.getData() &&
      this.tabulator.getData().length >= 0
    ) {
      const sampleRow = this.tabulator.getData()[0]
        ? this.tabulator.getData()[0]
        : this.props.primaryColumns;
      const newRow = { ...sampleRow };
      Object.keys(newRow).forEach((i: any) => (newRow[i] = ""));
      this.tabulator.addRow(newRow, false, cell.getRow());
    }
  };

  updateFilteredTable(e: any) {
    this.setState({ globalSearch: e.target.value });
    const hiddenColumns: string[] = [];
    for (const column of this.tabulator.getColumns()) {
      if (column.isVisible()) {
        continue;
      }
      hiddenColumns.push(column.getField());
    }
    this.props.showFilteredTable(
      e.target.value,
      this.state.data,
      hiddenColumns,
    );
  }
  render() {
    return (
      <div className="w-full flex flex-col">
        <div className="flex bg-white max-w-max my-1">
          <SearchIcon
            className="ml-2 mt-1"
            style={{
              marginRight: "5px",
              transform: "translateY(4px)",
            }}
          />
          <input
            className="w-1/4 p-1 min-w-64"
            name="search"
            onChange={(e) => this.updateFilteredTable(e)}
            placeholder="Search...."
            value={this.state.globalSearch}
          />
        </div>
        <div id="tabulator_table" ref={(el) => (this.el = el)} />
        <div className="ml-auto mt-2">
          {/* <div className="flex flex-row">
            <button
              className="py-1 px-2 bg-green-300 rounded-md mr-2 hover:bg-green-600"
              onClick={() => {
                const selectedRowsIndex = this.tabulator
                  .getSelectedRows()
                  .map((row: any) => {
                    return row.getPosition();
                  });
                this.props.updateSelectedRow(selectedRowsIndex);
              }}
              style={{
                backgroundColor: this.props.saveButtonColor,
                display: this.props.multiSelectRow ? "inline" : "none",
                position: "absolute",
                left: 0,
                margin: "10px",
                border: "2px solid #ffoaof",
                borderTopColor: this.props.saveButtonColor,
                borderTopStyle: "solid",
                borderTopWidth: "2px",
                borderRightColor: this.props.saveButtonColor,
                borderRightStyle: "solid",
                borderRightWidth: "2px",
                borderBottomColor: this.props.saveButtonColor,
                borderBottomStyle: "solid",
                borderBottomWidth: "2px",
                borderLeftColor: this.props.saveButtonColor,
                borderLeftStyle: "solid",
                borderLeftWidth: "2px",
                color: " #ffffff",
                fontWeight: 600,
              }}
            >
              Select Rows
            </button>
          </div> */}
          {this.props.isAnimateLoading && this.props.loading ? (
            <Loader />
          ) : (
            this.props.saveButtonLabel &&
            this.props.saveButtonColor &&
            this.props.saveButtonLabel.length > 0 && (
              <button
                className={`py-1 px-2 bg-green-300 rounded-md mr-2 hover:bg-green-600
                ${this.props.loading && "disable-save-button"}
                ${this.state.isEditing && "disable-save-button"}`}
                onClick={() => {
                  const cells = this.tabulator.getEditedCells();
                  const aray: any = [];
                  cells.forEach(function(cell: any) {
                    const row = cell.getRow();
                    const index = row.getPosition();
                    if (!aray.includes(index)) {
                      aray.push(index);
                    }
                  });
                  this.props.handleSaveClick(aray, this.tabulator.getData());
                }}
                style={{
                  backgroundColor: this.props.saveButtonColor,
                  display: this.props.saveButtonEnable ? "inline" : "none",
                  border: "2px solid #ffoaof",
                  borderTopColor: this.props.saveButtonColor,
                  borderTopStyle: "solid",
                  borderTopWidth: "2px",
                  borderRightColor: this.props.saveButtonColor,
                  borderRightStyle: "solid",
                  borderRightWidth: "2px",
                  borderBottomColor: this.props.saveButtonColor,
                  borderBottomStyle: "solid",
                  borderBottomWidth: "2px",
                  borderLeftColor: this.props.saveButtonColor,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "2px",
                  color: " #ffffff",
                  fontWeight: 600,
                }}
              >
                {this.props.saveButtonLabel}
              </button>
            )
          )}
          {this.props.newButtonLabel &&
            this.props.newButtonColor &&
            this.props.newButtonLabel.length > 0 && (
              <button
                className="py-1 px-2 mr-2 rounded-md"
                onClick={this.addRow}
                style={{
                  backgroundColor: this.props.newButtonColor,
                  display: this.props.newButtonEnable ? "inline" : "none",
                  border: "2px solid #ffoaof",
                  borderTopColor: this.props.newButtonColor,
                  borderTopStyle: "solid",
                  borderTopWidth: "2px",
                  borderRightColor: this.props.newButtonColor,
                  borderRightStyle: "solid",
                  borderRightWidth: "2px",
                  borderBottomColor: this.props.newButtonColor,
                  borderBottomStyle: "solid",
                  borderBottomWidth: "2px",
                  borderLeftColor: this.props.newButtonColor,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "2px",
                  color: this.props.color,
                  fontWeight: 600,
                }}
              >
                {this.props.newButtonLabel}
              </button>
            )}
          {this.props.resetButtonLabel &&
            this.props.resetButtonColor &&
            this.props.resetButtonLabel.length > 0 && (
              <button
                className="py-1 px-2  rounded-md"
                onClick={this.deleteRow}
                style={{
                  backgroundColor: this.props.resetButtonColor,
                  display: this.props.resetButtonEnable ? "inline" : "none",
                  border: "2px solid #ffoaof",
                  borderTopColor: this.props.resetButtonColor,
                  borderTopStyle: "solid",
                  borderTopWidth: "2px",
                  borderRightColor: this.props.resetButtonColor,
                  borderRightStyle: "solid",
                  borderRightWidth: "2px",
                  borderBottomColor: this.props.resetButtonColor,
                  borderBottomStyle: "solid",
                  borderBottomWidth: "2px",
                  borderLeftColor: this.props.resetButtonColor,
                  borderLeftStyle: "solid",
                  borderLeftWidth: "2px",
                  color: this.props.color,
                  fontWeight: 600,
                }}
              >
                {this.props.resetButtonLabel}
              </button>
            )}
        </div>
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
  editedTableData: any;
  updateAppsmithColumnDefinition: (data: any) => void;
  cellBackground?: string;
  handleSaveClick: (indexArray: any, table: any) => void;
  textColor?: string;
  textSize?: any;
  fontStyle?: string;
  horizontalAlignment?: string;
  editedRowIndex?: any;
  bgColor?: any;
  color?: any;
  setNewRow?: any;
  movableRowsToTable?: any;
  newButtonLabel?: any;
  saveButtonLabel?: any;
  resetButtonLabel?: any;
  resetEditedRowsData?: any;
  loading?: any;
  isAnimateLoading: boolean;
  updateSelectedRow?: any;
  pageSize: any;
  isgroupBy: any;
  ismultigroupBy: any;
  isrowMovable: any;
  multiSelectRow: any;
  resetButtonColor?: any;
  saveButtonColor?: any;
  newButtonColor?: any;
  resetButtonEnable?: any;
  saveButtonEnable?: any;
  newButtonEnable?: any;
  dataPersistence?: any;
  showFilteredTable?: any;
  globalSearch?: any;
  filteredData?: any;
  selectedRow?: any;
  singleSelectRow?: boolean;
  addRowBelow?: boolean;
  // updateComputedValue: any;
  handleSingleRowActions: any;
  handleResetEditedData: any;
  accentColor: string;
  handleResetClick: any;
}

export default TabulatorComponent;
