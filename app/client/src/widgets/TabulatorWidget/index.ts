import Widget from "./widget";
import IconSVG from "./icon.svg";
import { Colors } from "constants/Colors";
import { BlueprintOperationTypes } from "widgets/constants";
import type { WidgetProps } from "widgets/BaseWidget";
import { cloneDeep, set } from "lodash";
import {
  combineDynamicBindings,
  getDynamicBindings,
} from "utils/DynamicBindingUtils";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "Tabulator", // The display name which will be made in uppercase and show in the widgets panel ( can have spaces )
  iconSVG: IconSVG,
  needsMeta: true, // Defines if this widget adds any meta properties
  isCanvas: false, // Defines if this widget has a canvas within in which we can drop other widgets
  defaults: {
    widgetName: "Tabulator",
    rows: 28,
    columns: 34,
    version: 1,
    height: 400,
    label: "Data",
    cellBackground: Colors.WHITE,
    textColor: "black",
    horizontalAlignment: "LEFT",
    fontStyle: "",
    editedRowIndex: -1,
    editedRowIndices: [],
    saveButton: "Save",
    saveButtonColor: Colors.GREEN,
    newButton: "New",
    newButtonColor: Colors.ROYAL_BLUE,
    resetButton: "Reset",
    resetButtonColor: Colors.LIGHT_GREYISH_BLUE,
    editedRows: [],
    editedRowsData: [],
    actionRow: {},
    actionRowWithIndex: {},
    selectedRow: [],
    animateLoading: false,
    pageSize: 10,
    dataPersistence: true,
    movableRows: false,
    resizableColumnFit: true,
    groupBy: "",
    tableData: [
      {
        name: "Billy Bob",
        age: 12,
        gender: "male",
        height: 95,
        col: "red",
        dob: "14/05/2010",
      },
      {
        name: "Jenny Jane",
        age: 42,
        gender: "female",
        height: 142,
        col: "blue",
        dob: "30/07/1954",
      },
      {
        name: "Steve McAlistaire",
        age: 35,
        gender: "male",
        height: 176,
        col: "green",
        dob: "04/11/1982",
      },
    ],
    derivedColumns: {},
    columnOrder: ["name", "age", "gender", "height", "col", "dob"],
    columnType: "text",
    dynamicBindingPathList: [
      {
        key: "primaryColumns.name.computedValue",
      },
      {
        key: "primaryColumns.age.computedValue",
      },
      {
        key: "primaryColumns.gender.computedValue",
      },
      {
        key: "primaryColumns.height.computedValue",
      },
      {
        key: "primaryColumns.col.computedValue",
      },
      {
        key: "primaryColumns.dob.computedValue",
      },
    ],
    primaryColumns: {
      name: {
        index: 0,
        width: 350,
        id: "name",
        horizontalAlignment: "LEFT",
        verticalAlignment: "CENTER",
        columnType: "text",
        textSize: "PARAGRAPH",
        enableFilter: true,
        enableSort: true,
        isVisible: true,
        isCellVisible: true,
        isDerived: false,
        label: "name",
        field: "name",
        title: "name",
        headerFilter: true,
        sorter: "string",
        computedValue:
          "{{Tabulator1.sanitizedTableData.map((currentRow) => ( currentRow.name))}}",
      },
      age: {
        index: 1,
        width: 150,
        id: "age",
        horizontalAlignment: "LEFT",
        verticalAlignment: "CENTER",
        columnType: "text",
        textSize: "PARAGRAPH",
        enableFilter: true,
        enableSort: true,
        isVisible: true,
        isCellVisible: true,
        isDerived: false,
        label: "age",
        field: "age",
        title: "age",
        headerFilter: true,
        sorter: "string",
        computedValue:
          "{{Tabulator1.sanitizedTableData.map((currentRow) => ( currentRow.age))}}",
      },
      gender: {
        index: 2,
        width: 150,
        id: "gender",
        horizontalAlignment: "LEFT",
        verticalAlignment: "CENTER",
        columnType: "text",
        textSize: "PARAGRAPH",
        enableFilter: true,
        enableSort: true,
        isVisible: true,
        isCellVisible: true,
        isDerived: false,
        label: "gender",
        field: "gender",
        title: "gender",
        headerFilter: true,
        sorter: "string",
        computedValue:
          "{{Tabulator1.sanitizedTableData.map((currentRow) => ( currentRow.gender))}}",
      },
      height: {
        index: 3,
        width: 150,
        id: "height",
        horizontalAlignment: "LEFT",
        verticalAlignment: "CENTER",
        columnType: "text",
        textSize: "PARAGRAPH",
        enableFilter: true,
        enableSort: true,
        isVisible: true,
        isCellVisible: true,
        isDerived: false,
        label: "height",
        field: "height",
        title: "height",
        headerFilter: true,
        sorter: "string",
        computedValue:
          "{{Tabulator1.sanitizedTableData.map((currentRow) => ( currentRow.height))}}",
      },
      col: {
        index: 4,
        width: 150,
        id: "col",
        horizontalAlignment: "LEFT",
        verticalAlignment: "CENTER",
        columnType: "text",
        textSize: "PARAGRAPH",
        enableFilter: true,
        enableSort: true,
        isVisible: true,
        isCellVisible: true,
        isDerived: false,
        label: "col",
        field: "col",
        title: "col",
        headerFilter: true,
        sorter: "string",
        computedValue:
          "{{Tabulator1.sanitizedTableData.map((currentRow) => ( currentRow.col))}}",
      },
      dob: {
        index: 5,
        width: 150,
        id: "dob",
        horizontalAlignment: "LEFT",
        verticalAlignment: "CENTER",
        columnType: "date",
        textSize: "PARAGRAPH",
        enableFilter: true,
        enableSort: true,
        isVisible: true,
        isCellVisible: true,
        isDerived: false,
        label: "dob",
        field: "dob",
        title: "dob",
        headerFilter: true,
        sorter: "string",
        computedValue:
          "{{Tabulator1.sanitizedTableData.map((currentRow) => ( currentRow.dob))}}",
      },
    },
  },

  blueprint: {
    operations: [
      {
        type: BlueprintOperationTypes.MODIFY_PROPS,
        fn: (widget: WidgetProps & { children?: WidgetProps[] }) => {
          const primaryColumns = cloneDeep(widget.primaryColumns);
          const columnIds = Object.keys(primaryColumns);
          columnIds.forEach((columnId) => {
            set(
              primaryColumns,
              `${columnId}.computedValue`,
              `{{${widget.widgetName}.sanitizedTableData.map((currentRow) => ( currentRow.${columnId}))}}`,
            );
            set(primaryColumns, `${columnId}.labelColor`, Colors.WHITE);

            Object.keys(
              widget.childStylesheet[primaryColumns[columnId].columnType] || [],
            ).map((propertyKey) => {
              const { jsSnippets, stringSegments } = getDynamicBindings(
                widget.childStylesheet[primaryColumns[columnId].columnType][
                  propertyKey
                ],
              );

              const js = combineDynamicBindings(jsSnippets, stringSegments);

              set(
                primaryColumns,
                `${columnId}.${propertyKey}`,
                `{{${widget.widgetName}.sanitizedTableData.map((currentRow) => ( ${js}))}}`,
              );
            });
          });
          const updatePropertyMap = [
            {
              widgetId: widget.widgetId,
              propertyName: "primaryColumns",
              propertyValue: primaryColumns,
            },
          ];
          return updatePropertyMap;
        },
      },
    ],
    isSortable: true,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
  },
};

export default Widget;
