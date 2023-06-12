import React, { lazy, Suspense } from "react";
import {
  merge,
  without,
  isEmpty,
  startCase,
  camelCase,
  isEqual,
  sortBy,
  clone,
  cloneDeep,
} from "lodash";

import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";
import type { DerivedPropertiesMap } from "utils/WidgetFactory";

import tablePropertyPaneConfig from "./tablePropertyPaneConfig";
import type { BatchPropertyUpdatePayload } from "actions/controlActions";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import Skeleton from "components/utils/Skeleton";
import { getEditorConfig } from "./getUpdatedColumnDef";
import derivedProperties from "widgets/TableWidget/widget/parseDerivedProperties";
import { retryPromise } from "utils/AppsmithUtils";

const TabulatorComponent = lazy(() =>
  retryPromise(() => import("../component")),
);

class TabulatorWidget extends BaseWidget<TabulatorWidgetProps, WidgetState> {
  constructor(props: TabulatorWidgetProps) {
    super(props);
    this.state = {
      columnDefinition: {},
      data: [],
      editedRow: this.props.editedRowIndex,
      bgColor: "",
      color: "",
      loading: false,
      derivedColumns: [],
      globalSearch: "",
      filteredData: [],
      originalData: [],
    };
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.resetEditedRowsData = this.resetEditedRowsData.bind(this);
    this.onSubmitSuccess = this.onSubmitSuccess.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
    this.updateSelectedRow = this.updateSelectedRow.bind(this);
    this.mergeEditedRowsData = this.mergeEditedRowsData.bind(this);
    this.setNewRow = this.setNewRow.bind(this);
    // this.updateComputedValues = this.updateComputedValues.bind(this);
    this.handleMenuDropdownClick = this.handleMenuDropdownClick.bind(this);
    this.handleCellInputChange = this.handleCellInputChange.bind(this);
    this.checkIfEditable = this.checkIfEditable.bind(this);
    this.handleCellOnBlur = this.handleCellOnBlur.bind(this);
    this.showFilteredTable = this.showFilteredTable.bind(this);
    this.setEditedRowsData = this.setEditedRowsData.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    window.localStorage.setItem("buttonBackgroundColor", "red");
    window.localStorage.setItem("buttonColor", "white");
  }
  rows: any = [];
  rowIndices: any = [];
  latestColumnDef: any = [];
  newRow = false;
  static getPropertyPaneConfig() {
    return tablePropertyPaneConfig;
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      sanitizedTableData: `{{(()=>{${derivedProperties.getSanitizedTableData}})()}}`,
      filteredTableData: `{{(()=>{ ${derivedProperties.getFilteredTableData}})()}}`,
      tableColumns: `{{(()=>{${derivedProperties.getTableColumns}})()}}`,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  componentDidMount() {
    this.setState({
      data: this.props.tableData,
      columnDefinition: this.props.primaryColumns,
    });
    this.setState({
      bgColor: window.localStorage.getItem("buttonBackgroundColor"),
    });
    this.setState({
      color: window.localStorage.getItem("buttonColor"),
    });
  }

  componentDidUpdate() {
    const isTableDataUpdated = isEqual(
      this.props.tableData,
      this.state.originalData,
    );
    this.setState({
      originalData: this.props.tableData,
    });

    if (!isTableDataUpdated) {
      this.resetEditedRowsData();
    }

    if (
      window.localStorage.getItem("buttonBackgroundColor") != this.state.bgColor
    ) {
      this.setState({
        bgColor: window.localStorage.getItem("buttonBackgroundColor"),
      });
    }
    if (window.localStorage.getItem("buttonColor") != this.state.color) {
      this.setState({
        color: window.localStorage.getItem("buttonColor"),
      });
    }

    if (this.props.tableData === undefined) {
      return;
    }
    const currentColumnDef = this.getColumnFromData(this.props.tableData);
    const temp1: any = [];
    this.latestColumnDef.forEach((item: any) => {
      temp1.push(item.field);
    });
    const temp2: any = [];
    currentColumnDef.forEach((item: any) => {
      temp2.push(item.field);
    });
    const isSameColumnDef = JSON.stringify(temp1) !== JSON.stringify(temp2);

    const columnDef = this.getColumnFromData(this.props.tableData);
    const currentFields: any = [];
    columnDef.forEach((item: any) => {
      currentFields.push(item.field);
    });

    const prevFields: any = Object.keys(this.props.primaryColumns);
    const isFieldsSame = isEqual(sortBy(currentFields), sortBy(prevFields));

    if (
      isSameColumnDef &&
      this.props.tableData &&
      this.props.tableData.length > 0
    ) {
      this.latestColumnDef = currentColumnDef;

      this.setState({
        data: this.props.tableData,
      });

      if (!isFieldsSame) {
        const noOfObjects = Object.keys(this.props.derivedColumns);
        noOfObjects.forEach((name: any) => {
          const item = clone(this.props.derivedColumns[name]);

          const tempObj: any = merge(item, {
            title: item.label,
            field: item.id,
            headerFilter: true,
          });
          columnDef.push(tempObj);
        });
        const derivedColumns = clone(this.props.derivedColumns);
        const columnOrder = clone(this.props.columnOrder);
        const columnDeField = columnDef.map((item: any) => {
          return item.field;
        });
        const updatedCustomColumnOrder = [];
        if (
          derivedColumns &&
          !isEmpty(derivedColumns) &&
          isEqual(columnDeField.sort(), columnOrder.sort())
        ) {
          for (let i = 0; i < this.props.columnOrder.length; i++) {
            const tempCustomColumn = columnDef.find(
              (item: any) => item.field == this.props.columnOrder[i],
            );
            updatedCustomColumnOrder.push(tempCustomColumn);
          }
        }
        const updatedColumnsDef = this.mergeExistingDefinition(
          updatedCustomColumnOrder && updatedCustomColumnOrder.length
            ? updatedCustomColumnOrder
            : columnDef,
        );
        this.updateAppsmithColumnDefinition(updatedColumnsDef);
      }
    }
    const isSame =
      JSON.stringify(this.props.primaryColumns) ===
      JSON.stringify(this.state.columnDefinition);
    const emptyCheck = isEmpty(this.props.primaryColumns);
    if (!isSame && !emptyCheck) {
      this.setState({ columnDefinition: this.props.primaryColumns });
    }
  }

  mergeExistingDefinition = (columnsDef: any) => {
    const updatedColumnsDef: any = [];
    columnsDef.forEach((columnDef: any) => {
      const item = clone(this.props.primaryColumns[columnDef.field]);
      let tempObj: any;

      if (item !== undefined) {
        tempObj = merge(columnDef, item);
        updatedColumnsDef.push(tempObj);
      } else {
        updatedColumnsDef.push(columnDef);
      }
    });
    return updatedColumnsDef;
  };

  updatePrimaryColumnDefinition = (columns: any) => {
    const propertiesToAdd: Record<string, unknown> = {};
    Object.entries(columns).forEach(([key, value]) => {
      const valueObj: any = value;
      Object.entries(valueObj).forEach(([childKey, childValue]) => {
        propertiesToAdd[`primaryColumns.${key}.${childKey}`] = childValue;
      });
    });

    const isSame =
      JSON.stringify(this.state.columnDefinition) ===
      JSON.stringify(propertiesToAdd);
    if (!isSame) {
      this.setState({ columnDefinition: propertiesToAdd });
      this.props.updateWidgetMetaProperty("tableData", columns);
    }
  };
  updateAppsmithColumnDefinition = (columns: any) => {
    const { primaryColumns = {} } = this.props;
    const propertiesToAdd: Record<string, unknown> = {};
    let columnObject: any = {};
    const newColumnIds: any = [];
    columns.forEach((element: any) => {
      columnObject = merge(element, {
        index: 0,
        width: 150,
        id: element.field,
        horizontalAlignment: element.horizontalAlignment || "LEFT",
        verticalAlignment: element.verticalAlignment || "CENTER",
        columnType: element.columnType || "text",
        textSize: element.textSize || "PARAGRAPH",
        enableFilter: element.enableFilter || false,
        enableSort: element.enableSort || false,
        isVisible: element.isVisible == undefined ? true : element.isVisible,
        isCellVisible: true,
        isDerived: element.isDerived || false,
        label: element.label || element.field,
      });
      Object.entries(columnObject).forEach(([key, value]) => {
        if (
          key != "computedValue" &&
          key != "options" &&
          key != "isCellVisible" &&
          key != "isDisabled" &&
          key != "menuButtonLabel" &&
          key != "menuItems" &&
          key != "cellBackground" &&
          key != "textColor" &&
          key != "summaryCalc" &&
          key != "dynamicLabel"
        ) {
          propertiesToAdd[`primaryColumns.${columnObject["field"]}.${key}`] =
            value;
        }
      });
      newColumnIds.push(element.field);
      // appsmithPrimaryColumns[columnObject];
    });

    const previousColumnIds = Object.keys(primaryColumns);
    const columnsIdsToDelete = without(previousColumnIds, ...newColumnIds);
    const pathsToDelete: string[] = [];
    if (columnsIdsToDelete.length > 0) {
      let i = 0;
      Object.entries(primaryColumns).forEach(() => {
        pathsToDelete.push(`primaryColumns.${columnsIdsToDelete[i]}`);
        i = i + 1;
      });
    }

    propertiesToAdd["columnOrder"] = newColumnIds;
    const propertiesToUpdate: BatchPropertyUpdatePayload = {
      modify: propertiesToAdd,
    };
    propertiesToUpdate.remove = pathsToDelete;
    this.setState({ columnDefinition: columns });
    super.batchUpdateWidgetProperty(propertiesToUpdate, false);
  };

  onSubmitSuccess(result: any, data: any, editedData?: any) {
    if (result.success) {
      this.props.updateWidgetMetaProperty("editedRowIndex", -1);
      this.props.updateWidgetMetaProperty("editedRowsData", undefined);

      this.setState({ editedRow: this.props.editedRowIndex });
      this.props.updateWidgetMetaProperty("selectedRow", []);
    } else {
      this.props.updateWidgetMetaProperty("editedTableData", data);
      this.props.updateWidgetMetaProperty("editedRowsData", editedData);
    }
    this.setState({ loading: false });
  }

  resetEditedRowsData() {
    this.props.updateWidgetMetaProperty("editedTableData", undefined);
    this.props.updateWidgetMetaProperty("editedRowsData", undefined);
  }

  setEditedRowsData(indexArray: any, table: any) {
    if (this.props.dataPersistence) {
      const restoreData = this.prepareRestoreRows(
        indexArray,
        table,
        this.newRow,
      );
      const mergedData = this.mergeEditedRowsData(restoreData);
      this.props.updateWidgetMetaProperty("editedTableData", table);
      this.props.updateWidgetMetaProperty("editedRowsData", mergedData);
      this.newRow = false;
    }
  }

  mergeEditedRowsData(data: any) {
    const editedRowsData = this.props.editedRowsData
      ? cloneDeep(this.props.editedRowsData)
      : [];
    const ids = new Set(data.map((d: any) => d.index));
    let modifiedData: any = [];
    if (data[0].newRow == true) {
      const currentIndex = data[0].index;
      editedRowsData.forEach((item: any) => {
        if (item.index >= currentIndex) {
          modifiedData.push({ ...item, index: item.index + 1 });
        } else {
          modifiedData.push(item);
        }
      });
    } else {
      modifiedData = [...editedRowsData];
    }
    const oldData =
      data[0].newRow == true
        ? [...modifiedData]
        : [...modifiedData.filter((d: any) => !ids.has(d.index))];
    const mergedData = [...data, ...oldData];

    return mergedData;
  }

  prepareRestoreRows(indexArray: any, table: any, newRow?: boolean) {
    const restoreArr = indexArray.map((i: any) => {
      return { index: i, data: table[i], newRow };
    });

    return restoreArr;
  }

  checkIfEditable(cell: any) {
    const rowIndex = cell.getRow().getPosition();
    const field = cell.getField();
    if (this.props.primaryColumns[field]?.isDisabled) {
      if (Array.isArray(this.props.primaryColumns[field].isDisabled)) {
        return !this.props.primaryColumns[field].isDisabled[rowIndex];
      } else {
        return !this.props.primaryColumns[field].isDisabled;
      }
    }

    return true;
  }

  handleResetClick() {
    if (this.props.onResetClick) {
      super.executeAction({
        triggerPropertyName: "onResetClick",
        dynamicString: this.props.onResetClick,
        event: {
          type: EventType.ON_CLICK,
          callback: (result) => result.success && this.resetEditedRowsData(),
        },
      });
    }
  }

  handleSaveClick() {
    const editedRows: any[] = [];
    const editedRowIndices: any[] = [];

    if (this.props.editedRowsData && this.props.editedRowsData.length > 0) {
      const editedRowsData = cloneDeep(this.props.editedRowsData);
      const sortedEditedRowsData = editedRowsData.sort(
        (a: any, b: any) => a.index - b.index,
      );
      sortedEditedRowsData.forEach((row: any) => {
        editedRows.push(row.data);
        editedRowIndices.push(row.index);
      });
    }
    this.props.updateWidgetMetaProperty("editedRows", editedRows);
    this.props.updateWidgetMetaProperty("editedRowIndices", editedRowIndices);
    if (this.props.onSaveClick) {
      this.setState({ loading: true });
      super.executeAction({
        triggerPropertyName: "onSaveClick",
        dynamicString: this.props.onSaveClick,
        event: {
          type: EventType.ON_CLICK,
          callback: (result) =>
            this.onSubmitSuccess(
              result,
              this.props.editedTableData,
              this.props.editedRowsData,
            ),
        },
      });
    }
  }

  handleSingleRowActions = (name: string, rowSelectedArray: number[]) => {
    this.props.updateWidgetMetaProperty("selectedRow", rowSelectedArray, {
      triggerPropertyName: "onRowSaveClick",
      dynamicString: this.props.onRowSaveClick,
      event: {
        type: EventType.ON_CLICK,
        callback: (result: any) => {
          result.success && this.resetEditedRowsData();
        },
      },
    });
  };

  handleResetEditedData = () => {
    this.resetEditedRowsData();
    this.props.updateWidgetMetaProperty("selectedRow", []);
  };

  handleCellInputChange(
    field: string,
    indexArray: any,
    table: any,
    rowIndex: any,
    rowInfo: any,
  ) {
    this.props.updateWidgetMetaProperty("actionRow", rowInfo);
    this.setEditedRowsData(indexArray, table);
    if (this.props.primaryColumns[field].onChange) {
      this.props.updateWidgetMetaProperty(
        "actionRowWithIndex",
        {
          data: rowInfo,
          index: rowIndex,
        },
        {
          triggerPropertyName: "onChange",
          dynamicString: this.props.primaryColumns[field].onChange,
          event: {
            type: EventType.ON_TEXT_CHANGE,
          },
        },
      );
    } else {
      this.props.updateWidgetMetaProperty("actionRowWithIndex", {
        data: rowInfo,
        index: rowIndex,
      });
    }
  }

  handleSelectChange(
    field: string,
    indexArray: any,
    table: any,
    rowIndex: any,
    rowInfo: any,
  ) {
    this.props.updateWidgetMetaProperty("actionRow", rowInfo);
    this.setEditedRowsData(indexArray, table);

    if (this.props.primaryColumns[field].onSelectChange) {
      this.props.updateWidgetMetaProperty(
        "actionRowWithIndex",
        {
          data: rowInfo,
          index: rowIndex,
        },
        {
          triggerPropertyName: "onSelectChange",
          dynamicString: this.props.primaryColumns[field].onSelectChange,
          event: {
            type: EventType.ON_TEXT_CHANGE,
            // callback: (result) => this.onChangeSuccess(result, restoreData),
          },
        },
      );
    } else {
      this.props.updateWidgetMetaProperty("actionRowWithIndex", {
        data: rowInfo,
        index: rowIndex,
      });
    }
  }

  handleCellOnBlur(
    field: string,
    indexArray: any,
    table: any,
    rowIndex: any,
    rowInfo: any,
  ) {
    this.props.updateWidgetMetaProperty("actionRow", rowInfo);
    this.props.updateWidgetMetaProperty("actionRowWithIndex", {
      data: rowInfo,
      index: rowIndex,
    });
    if (this.props.primaryColumns[field].onBlur) {
      super.executeAction({
        triggerPropertyName: "onBlur",
        dynamicString: this.props.primaryColumns[field].onBlur,
        event: {
          type: EventType.ON_BLUR,
        },
      });
    }
  }

  setNewRow() {
    this.newRow = true;
  }

  handleMenuDropdownClick(
    field: string,
    menuId: any,
    rowIndex: any,
    rowInfo: any,
  ) {
    this.props.updateWidgetMetaProperty("actionRow", rowInfo);
    this.props.updateWidgetMetaProperty("actionRowWithIndex", {
      data: rowInfo,
      index: rowIndex,
    });
    super.executeAction({
      triggerPropertyName: "onClick",
      dynamicString: this.props.primaryColumns[field].menuItems[menuId].onClick,
      event: {
        type: EventType.ON_CLICK,
      },
    });
  }

  buttonClick(rowIndex: number, field: string, rowInfo: any) {
    this.props.updateWidgetMetaProperty("actionRow", rowInfo);
    this.props.updateWidgetMetaProperty("actionRowWithIndex", {
      data: rowInfo,
      index: rowIndex,
    });
    if (this.props.primaryColumns[field].onClick) {
      super.executeAction({
        triggerPropertyName: "onClick",
        dynamicString: this.props.primaryColumns[field].onClick,
        event: {
          type: EventType.ON_CLICK,
          callback: (result: any) => this.resetSelectedRows(result, rowIndex),
        },
      });
    }
  }

  resetSelectedRows = (result: any, rowIndex: number) => {
    if (result.success) {
      if (this.props.selectedRow.indexOf(rowIndex) !== -1) {
        const selectedRowArray = [...this.props.selectedRow];
        selectedRowArray.splice(this.props.selectedRow.indexOf(rowIndex), 1);
        this.props.updateWidgetMetaProperty("selectedRow", selectedRowArray);
      }
    }
  };

  showFilteredTable(searchValue: string, data: any, hiddenColumns: string[]) {
    this.setState({ globalSearch: searchValue });
    const filterData: any = [];
    if (Array.isArray(data) && searchValue.length) {
      for (let i = 0; i < data.length; i++) {
        const keysArray: any = Object.keys(data[i]);
        for (const key of keysArray) {
          if (
            ("" + data[i][key])
              .toLowerCase()
              .includes(searchValue.toLowerCase()) &&
            !hiddenColumns.includes(key)
          ) {
            filterData.push(data[i]);
            break;
          }
        }
      }
      this.setState({ filteredData: filterData });
    }
  }

  getColumnDataFromProps(data: any) {
    const columns: any = [];
    if (Array.isArray(data)) {
      return data;
    }
    let columnOrderSort: any = {};
    let isColumnAvail = true;
    this.props.columnOrder.forEach((name: string) => {
      columnOrderSort[name] = data[name];
      if (data[name] === undefined) {
        isColumnAvail = false;
      }
    });
    if (!isColumnAvail) {
      columnOrderSort = data;
    }
    Object.entries(columnOrderSort).forEach(([key, value]) => {
      const editor = getEditorConfig(
        value,
        this.buttonClick,
        this.updateSelectedRow,
        this.handleMenuDropdownClick,
        this.handleCellInputChange,
        this.handleCellOnBlur,
        this.handleSelectChange,
        this.checkIfEditable,
        this.props.primaryColumns,
        this.props.selectedRow,
        this.props.multiSelectRow,
        this.props.singleSelectRow,
        this.props.cellBackground,
        this.props,
      );
      const keyName = this.props.primaryColumns[key];
      const excludeFilter = ["iconButton", "checkbox"];
      if (keyName === undefined) {
        return;
      }
      const customTooltip: any = value;
      const isValidFilter = excludeFilter.includes(keyName.columnType)
        ? false
        : this.props.isVisibleSearch;
      const configObj = Object.assign(editor, {
        title: Array.isArray(keyName.dynamicLabel)
          ? keyName.dynamicLabel[0]
            ? keyName.dynamicLabel[0]
            : keyName.label
          : keyName.dynamicLabel
          ? keyName.dynamicLabel
          : keyName.label,
        field: key,
        headerFilter: isValidFilter,
        tooltip: customTooltip.ToolTip ? customTooltip.ToolTip : true,
        headerTooltip: true,
        frozen: Array.isArray(keyName.isFrozen)
          ? keyName.isFrozen.includes(true)
          : keyName.isFrozen,
        visible: keyName.isVisible
          ? Array.isArray(keyName.isCellVisible)
            ? keyName.isCellVisible.includes(true)
            : keyName.isCellVisible
          : false,
        bottomCalc: Array.isArray(keyName.summaryCalc)
          ? keyName.summaryCalc[0]
          : keyName.summaryCalc,
      });

      columns.push(configObj);
    });

    return columns;
  }

  // updateComputedValues(data: any) {
  //   this.props.updateWidgetMetaProperty("tableData", data);
  // }

  updateSelectedRow(data: any) {
    this.props.updateWidgetMetaProperty("selectedRow", data);
  }

  getColumnFromData(data: any) {
    const columns: any = [];
    if (data && data.length > 0) {
      const item = data[0];
      Object.entries(item).forEach(([key]) => {
        columns.push({
          title: startCase(camelCase(key)),
          // editableTitle: true,
          field: key,
          headerFilter: this.props.isVisibleSearch,
          tooltip: true,
          headerTooltip: true,
        });
      });
    }

    return columns;
  }

  getColumnDefinition() {
    return isEmpty(this.state.columnDefinition)
      ? this.getColumnFromData(this.props.tableData)
      : this.getColumnDataFromProps(this.state.columnDefinition);
  }

  getPageView() {
    const columnDefinitions = this.getColumnDefinition();

    return (
      <Suspense fallback={<Skeleton />}>
        <TabulatorComponent
          accentColor={this.props.accentColor}
          addRowBelow={this.props.addRowBelow}
          bgColor={this.state.bgColor}
          cellBackground={this.props.cellBackground}
          color={this.state.color}
          columnDefinition={columnDefinitions}
          columnType={this.props.columnType}
          dataPersistence={this.props.dataPersistence}
          editedRowIndex={this.props.editedRowIndex}
          editedRows={this.props.editedRows}
          editedTableData={this.props.editedTableData}
          filteredData={this.state.filteredData}
          fontStyle={this.props.fontStyle}
          globalSearch={this.state.globalSearch}
          handleResetClick={this.handleResetClick}
          handleResetEditedData={this.handleResetEditedData}
          handleSaveClick={this.handleSaveClick}
          handleSingleRowActions={this.handleSingleRowActions}
          height={this.props.height}
          horizontalAlignment={this.props.horizontalAlignment}
          isAnimateLoading={this.props.animateLoading}
          isgroupBy={this.props.isgroupBy}
          ismultigroupBy={this.props.ismultigroupBy}
          isrowMovable={this.props.isrowMovable}
          loading={this.state.loading}
          movableRowsToTable={this.props.movableRowsToTable}
          multiSelectRow={this.props.multiSelectRow}
          newButtonColor={this.props.newButtonColor}
          newButtonEnable={this.props.newButtonEnable}
          newButtonLabel={this.props.newButton}
          pageSize={this.props.pageSize}
          primaryColumns={this.props.primaryColumns}
          resetButtonColor={this.props.resetButtonColor}
          // saveNewRow={this.saveNewRow}
          resetButtonEnable={this.props.resetButtonEnable}
          resetButtonLabel={this.props.resetButton}
          resetEditedRowsData={this.resetEditedRowsData}
          saveButtonColor={this.props.saveButtonColor}
          saveButtonEnable={this.props.saveButtonEnable}
          saveButtonLabel={this.props.saveButton}
          selectedRow={this.props.selectedRow}
          setNewRow={this.setNewRow}
          showFilteredTable={this.showFilteredTable}
          singleSelectRow={this.props.singleSelectRow}
          tableData={this.props.tableData}
          textColor={this.props.textColor}
          textSize={this.props.textSize}
          updateAppsmithColumnDefinition={this.updateAppsmithColumnDefinition}
          updateSelectedRow={this.updateSelectedRow}

          // updateComputedValue={this.updateComputedValues}
        />
      </Suspense>
    );
  }

  static getWidgetType(): string {
    return "TABULATOR_WIDGET";
  }
}

export interface TabulatorWidgetProps extends WidgetProps {
  height: number;
  tableData: any;
  saveButton: any;
  newButton: any;
  resetButton: any;
  cellBackground?: string;
  textColor?: string;
  textSize?: any;
  fontStyle?: any;
  horizontalAlignment?: any;
  editedRowIndex?: any;
  editedRowIndices?: any;
  editedRows?: any;
  editedTableData?: any;
  setNewRow?: any;
  movableRowsToTable: any;
  selectedRow?: any;
  columnOrder: any;
  isgroupBy: any;
  ismultigroupBy: any;
  isrowMovable: any;
  resetButtonColor: any;
  saveButtonColor: any;
  newButtonColor: any;
  resetButtonEnable: any;
  newButtonEnable: any;
  saveButtonEnable: any;
  multiSelectRow: any;
  singleSelectRow: boolean;
  dataPersistence?: any;
  globalSearch?: any;
  filteredArray?: any;
}

export default TabulatorWidget;
