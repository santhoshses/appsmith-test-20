import { IconNames } from "@blueprintjs/icons";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { get } from "lodash";
import moment from "moment";
// import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import type { TableWidgetProps } from "widgets/TableWidget/constants";
import {
  uniqueColumnNameValidation,
  updateColumnStyles,
  getBasePropertyPath,
  hideByColumnType,
  ColumnTypes,
  updateIconAlignmentHook,
  updateDerivedColumnsHook,
} from "widgets/TableWidget/widget/propertyUtils";
import { updateDerivedColumnsHook2 } from "./utils/propertyUtils";
import { hideByColumnType2 } from "./utils/propertyUtils";
import type { TabulatorWidgetProps } from ".";
import { getPrimaryColumnStylesheetValue } from "widgets/TableWidget/widget/helpers";

const ICON_NAMES = Object.keys(IconNames).map(
  (name: string) => IconNames[name as keyof typeof IconNames],
);

export default [
  {
    sectionName: "General",
    children: [
      {
        helpText:
          "Takes in an array of objects to display rows in the table. Bind data from an API using {{}}",
        propertyName: "tableData",
        label: "Table Data",
        controlType: "INPUT_TEXT",
        placeholderText: '[{ "name": "John" }]',
        inputType: "ARRAY",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.OBJECT_ARRAY,
          params: {
            default: [],
          },
        },
        evaluationSubstitutionType: EvaluationSubstitutionType.SMART_SUBSTITUTE,
      },
      {
        helpText: "Enter value for page size",
        propertyName: "pageSize",
        label: "Default Page Size",
        placeholderText: "Enter value",
        controlType: "INPUT_TEXT",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.NUMBER },
      },
      {
        helpText: "Columns",
        propertyName: "primaryColumns",
        controlType: "PRIMARY_COLUMNS",
        label: "Columns",
        updateHook: updateDerivedColumnsHook2,
        dependencies: ["derivedColumns", "columnOrder"],
        isBindProperty: false,
        isTriggerProperty: false,
        validation: {
          type: ValidationTypes.FUNCTION,
          params: {
            fn: uniqueColumnNameValidation,
            expected: {
              type: "Unique Column Names",
              example: "abc",
              autocompleteDataType: AutocompleteDataType.STRING,
            },
          },
        },
        panelConfig: {
          editableTitle: true,
          titlePropertyName: "label",
          panelIdPropertyName: "id",
          updateHook: updateDerivedColumnsHook2,
          dependencies: ["primaryColumns", "derivedColumns", "columnOrder"],
          children: [
            {
              sectionName: "Column Control",
              children: [
                {
                  propertyName: "columnType",
                  label: "Column Type",
                  controlType: "DROP_DOWN",
                  customJSControl: "COMPUTE_VALUE",
                  options: [
                    {
                      label: "Plain Text",
                      value: "text",
                    },
                    {
                      label: "Input",
                      value: "input",
                    },
                    {
                      label: "Textarea",
                      value: "textarea",
                    },
                    {
                      label: "Number",
                      value: "number",
                    },
                    {
                      label: "Select",
                      value: "select",
                    },
                    {
                      label: "Progress",
                      value: "progress",
                    },
                    {
                      label: "Date",
                      value: "date",
                    },
                    {
                      label: "Checkbox",
                      value: "checkbox",
                    },
                    // {
                    //   label: "Button",
                    //   value: "button",
                    // },
                    {
                      label: "Menu Button",
                      value: "menuButton",
                    },
                    {
                      label: "Autocomplete",
                      value: "autocomplete",
                    },
                    {
                      label: "Icon Button",
                      value: "iconButton",
                    },
                  ],
                  updateHook: updateDerivedColumnsHook2,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                    "childStylesheet",
                  ],
                  isBindProperty: false,
                  isTriggerProperty: false,
                },
                {
                  helpText: "Sets the format of the selected date",
                  propertyName: "dateFormat",
                  label: "Date Format",
                  controlType: "DROP_DOWN",
                  isJSConvertible: true,
                  optionWidth: "340px",
                  options: [
                    {
                      label: moment().format("YYYY-MM-DDTHH:mm:ss.sssZ"),
                      subText: "ISO 8601",
                      value: "YYYY-MM-DDTHH:mm:ss.sssZ",
                    },
                    {
                      label: moment().format("LLL"),
                      subText: "LLL",
                      value: "LLL",
                    },
                    {
                      label: moment().format("LL"),
                      subText: "LL",
                      value: "LL",
                    },
                    {
                      label: moment().format("YYYY-MM-DD HH:mm"),
                      subText: "YYYY-MM-DD HH:mm",
                      value: "YYYY-MM-DD HH:mm",
                    },
                    {
                      label: moment().format("YYYY-MM-DDTHH:mm:ss"),
                      subText: "YYYY-MM-DDTHH:mm:ss",
                      value: "YYYY-MM-DDTHH:mm:ss",
                    },
                    {
                      label: moment().format("YYYY-MM-DD hh:mm:ss A"),
                      subText: "YYYY-MM-DD hh:mm:ss A",
                      value: "YYYY-MM-DD hh:mm:ss A",
                    },
                    {
                      label: moment().format("DD/MM/YYYY HH:mm"),
                      subText: "DD/MM/YYYY HH:mm",
                      value: "DD/MM/YYYY HH:mm",
                    },
                    {
                      label: moment().format("D MMMM, YYYY"),
                      subText: "D MMMM, YYYY",
                      value: "D MMMM, YYYY",
                    },
                    {
                      label: moment().format("H:mm A D MMMM, YYYY"),
                      subText: "H:mm A D MMMM, YYYY",
                      value: "H:mm A D MMMM, YYYY",
                    },
                    {
                      label: moment().format("YYYY-MM-DD"),
                      subText: "YYYY-MM-DD",
                      value: "YYYY-MM-DD",
                    },
                    {
                      label: moment().format("MM-DD-YYYY"),
                      subText: "MM-DD-YYYY",
                      value: "MM-DD-YYYY",
                    },
                    {
                      label: moment().format("DD-MM-YYYY"),
                      subText: "DD-MM-YYYY",
                      value: "DD-MM-YYYY",
                    },
                    {
                      label: moment().format("MM/DD/YYYY"),
                      subText: "MM/DD/YYYY",
                      value: "MM/DD/YYYY",
                    },
                    {
                      label: moment().format("DD/MM/YYYY"),
                      subText: "DD/MM/YYYY",
                      value: "DD/MM/YYYY",
                    },
                    {
                      label: moment().format("DD/MM/YY"),
                      subText: "DD/MM/YY",
                      value: "DD/MM/YY",
                    },
                    {
                      label: moment().format("MM/DD/YY"),
                      subText: "MM/DD/YY",
                      value: "MM/DD/YY",
                    },
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: { type: ValidationTypes.TEXT },
                  hideSubText: true,
                },
                {
                  propertyName: "displayText",
                  label: "Display Text",
                  controlType: "COMPUTE_VALUE",
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook2,
                  hidden: (
                    props: TabulatorWidgetProps,
                    propertyPath: string,
                  ) => {
                    const baseProperty = getBasePropertyPath(propertyPath);
                    const columnType = get(
                      props,
                      `${baseProperty}.columnType`,
                      "",
                    );
                    return columnType !== "url";
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: false,
                  isTriggerProperty: false,
                },
                {
                  helpText:
                    "The value computed & shown in each cell. Use {{currentRow}} to reference each row in the table. This property is not accessible outside the column settings.",
                  propertyName: "computedValue",
                  label: "Computed Value",
                  controlType: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook2,
                  hidden: (
                    props: TabulatorWidgetProps,
                    propertyPath: string,
                  ) => {
                    return hideByColumnType2(props, propertyPath, [
                      ColumnTypes.DATE,
                      ColumnTypes.NUMBER,
                      ColumnTypes.TEXT,
                      "input",
                      "textarea",
                      "progress",
                      "autocomplete",
                      "select",
                      "number",
                      "checkbox",
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                {
                  helpText:
                    "Allows users to select a single option. Values must be unique",
                  updateHook: updateDerivedColumnsHook2,
                  propertyName: "options",
                  label: "Options",
                  controlType: "INPUT_TEXT",
                  inputType: "ARRAY",
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  hidden: (
                    props: TabulatorWidgetProps,
                    propertyPath: string,
                  ) => {
                    return hideByColumnType2(props, propertyPath, ["select"]);
                  },
                  placeholderText:
                    '[{ "label": "Option1", "value": "Option2" }]',
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.ARRAY,
                    params: {
                      unique: ["value"],
                      children: {
                        type: ValidationTypes.OBJECT,
                        params: {
                          required: true,
                          allowedKeys: [
                            {
                              name: "label",
                              type: ValidationTypes.TEXT,
                              params: {
                                default: "",
                                requiredKey: true,
                              },
                            },
                            {
                              name: "value",
                              type: ValidationTypes.TEXT,
                              params: {
                                default: "",
                                requiredKey: true,
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  evaluationSubstitutionType:
                    EvaluationSubstitutionType.SMART_SUBSTITUTE,
                },
                {
                  helpText: "minimum value property.",
                  propertyName: "min",
                  label: "Minimum Value",
                  controlType: "INPUT_TEXT",
                  validation: {
                    type: ValidationTypes.NUMBER,
                  },
                  updateHook: updateDerivedColumnsHook2,
                  hidden: (
                    props: TabulatorWidgetProps,
                    propertyPath: string,
                  ) => {
                    return hideByColumnType2(props, propertyPath, ["number"]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                {
                  helpText: "maximum value property.",
                  propertyName: "max",
                  label: "Maximum Value",
                  controlType: "INPUT_TEXT",
                  validation: {
                    type: ValidationTypes.NUMBER,
                  },
                  updateHook: updateDerivedColumnsHook2,
                  hidden: (
                    props: TabulatorWidgetProps,
                    propertyPath: string,
                  ) => {
                    return hideByColumnType2(props, propertyPath, ["number"]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                {
                  propertyName: "dynamicLabel",
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  label: "Dynamic Column Name",
                  helpText: "Controls the dynamic column header name",
                  updateHook: updateDerivedColumnsHook2,
                  controlType: "COMPUTE_VALUE",
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                    },
                  },
                },
                {
                  propertyName: "isCellVisible",
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnType",
                  ],
                  label: "Visible",
                  helpText: "Controls the visibility of the cell in the column",
                  updateHook: updateDerivedColumnsHook2,
                  defaultValue: true,
                  controlType: "SWITCH",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.BOOLEAN,
                    },
                  },
                },
                // {
                //   propertyName: "isCellVisible",
                //   dependencies: [
                //     "primaryColumns",
                //     "derivedColumns",
                //     "columnType",
                //   ],
                //   label: "Visible",
                //   helpText: "Controls the visibility of the cell in the column",
                //   updateHook:   updateDerivedColumnsHook2,
                //   defaultValue: true,
                //   controlType: "SWITCH",
                //   customJSControl: "COMPUTE_VALUE",
                //   isJSConvertible: true,
                //   isBindProperty: true,
                //   isTriggerProperty: false,
                //   validation: {
                //     type: ValidationTypes.TABLE_PROPERTY,
                //     params: {
                //       type: ValidationTypes.BOOLEAN,
                //     },
                //   },
                // },
                {
                  helpText: "Enter value for page size",
                  propertyName: "columnWidth",
                  label: "Column Width(%)",
                  placeholderText: "Enter value",
                  controlType: "INPUT_TEXT",
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: { type: ValidationTypes.NUMBER },
                },
                {
                  propertyName: "regExp",
                  label: "Regular Expression",
                  helpText: "Regular Expression for validation",
                  controlType: "INPUT_TEXT",
                  placeholderText: "/^[a-z]+$/i",
                  isBindProperty: true,
                  isTriggerProperty: false,
                  // validation: { type: ValidationTypes.TEXT },
                },
                // {
                //   helpText:
                //     "The error message to display if the regex or valid property check fails",
                //   propertyName: "errorMessage",
                //   label: "Error Message",
                //   controlType: "INPUT_TEXT",
                //   placeholderText: "Not a valid email!",
                //   inputType: "TEXT",
                //   isBindProperty: true,
                //   isTriggerProperty: false,
                //   validation: { type: ValidationTypes.TEXT },
                // },
                {
                  propertyName: "isDisabled",
                  label: "Disabled",
                  updateHook: updateDerivedColumnsHook2,
                  defaultValue: false,
                  controlType: "SWITCH",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.BOOLEAN,
                    },
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  // hidden: (props: TableWidgetProps, propertyPath: string) => {
                  //   return hideByColumnType(props, propertyPath, [
                  //     ColumnTypes.ICON_BUTTON,
                  //     ColumnTypes.MENU_BUTTON,
                  //     ColumnTypes.BUTTON,
                  //   ]);
                  // },
                },
                {
                  propertyName: "isFrozen",
                  helpText:
                    "Freeze a portion(either left or right most columns) of the tabulator to keep it visible while you scroll through the rest of the tabulator",
                  label: "Freeze",
                  updateHook: updateDerivedColumnsHook2,
                  defaultValue: false,
                  controlType: "SWITCH",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.BOOLEAN,
                    },
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnType",
                  ],
                },
                {
                  helpText: "Display the summary calculation of a column",
                  propertyName: "summaryCalc",
                  label: "Summary Calc",
                  updateHook: updateDerivedColumnsHook2,
                  controlType: "DROP_DOWN",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                    },
                  },
                  options: [
                    {
                      label: "No action",
                      value: "",
                    },
                    {
                      label: "Average",
                      value: "avg",
                    },
                    {
                      label: "Maximum",
                      value: "max",
                    },
                    {
                      label: "Minimum",
                      value: "min",
                    },
                    {
                      label: "Count",
                      value: "count",
                    },
                    {
                      label: "Sum",
                      value: "sum",
                    },
                    {
                      label: "Concatenate",
                      value: "concat",
                    },
                  ],
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnType",
                  ],
                },
                //     {
                //       propertyName: "isCompact",
                //       helpText: "Decides if menu items will consume lesser space",
                //       updateHook:   updateDerivedColumnsHook2,
                //       label: "Compact",
                //       controlType: "SWITCH",
                //       customJSControl: "COMPUTE_VALUE",
                //       isJSConvertible: true,
                //       isBindProperty: true,
                //       validation: {
                //         type: ValidationTypes.TABLE_PROPERTY,
                //         params: {
                //           type: ValidationTypes.BOOLEAN,
                //         },
                //       },
                //       isTriggerProperty: false,
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       hidden: (props: TableWidgetProps, propertyPath: string) => {
                //         return hideByColumnType(props, propertyPath, [
                //           ColumnTypes.MENU_BUTTON,
                //         ]);
                //       },
                //     },
                //     {
                //       propertyName: "inputFormat",
                //       label: "Original Date Format",
                //       controlType: "DROP_DOWN",
                //       options: [
                //         {
                //           label: "UNIX timestamp (s)",
                //           value: "Epoch",
                //         },
                //         {
                //           label: "UNIX timestamp (ms)",
                //           value: "Milliseconds",
                //         },
                //         {
                //           label: "YYYY-MM-DD",
                //           value: "YYYY-MM-DD",
                //         },
                //         {
                //           label: "YYYY-MM-DD HH:mm",
                //           value: "YYYY-MM-DD HH:mm",
                //         },
                //         {
                //           label: "ISO 8601",
                //           value: "YYYY-MM-DDTHH:mm:ss.SSSZ",
                //         },
                //         {
                //           label: "YYYY-MM-DDTHH:mm:ss",
                //           value: "YYYY-MM-DDTHH:mm:ss",
                //         },
                //         {
                //           label: "YYYY-MM-DD hh:mm:ss",
                //           value: "YYYY-MM-DD hh:mm:ss",
                //         },
                //         {
                //           label: "Do MMM YYYY",
                //           value: "Do MMM YYYY",
                //         },
                //         {
                //           label: "DD/MM/YYYY",
                //           value: "DD/MM/YYYY",
                //         },
                //         {
                //           label: "DD/MM/YYYY HH:mm",
                //           value: "DD/MM/YYYY HH:mm",
                //         },
                //         {
                //           label: "LLL",
                //           value: "LLL",
                //         },
                //         {
                //           label: "LL",
                //           value: "LL",
                //         },
                //         {
                //           label: "D MMMM, YYYY",
                //           value: "D MMMM, YYYY",
                //         },
                //         {
                //           label: "H:mm A D MMMM, YYYY",
                //           value: "H:mm A D MMMM, YYYY",
                //         },
                //         {
                //           label: "MM-DD-YYYY",
                //           value: "MM-DD-YYYY",
                //         },
                //         {
                //           label: "DD-MM-YYYY",
                //           value: "DD-MM-YYYY",
                //         },
                //         {
                //           label: "MM/DD/YYYY",
                //           value: "MM/DD/YYYY",
                //         },
                //         {
                //           label: "DD/MM/YYYY",
                //           value: "DD/MM/YYYY",
                //         },
                //         {
                //           label: "DD/MM/YY",
                //           value: "DD/MM/YY",
                //         },
                //         {
                //           label: "MM/DD/YY",
                //           value: "MM/DD/YY",
                //         },
                //       ],
                //       defaultValue: "YYYY-MM-DD HH:mm",
                //       customJSControl: "COMPUTE_VALUE",
                //       isJSConvertible: true,
                //       updateHook:   updateDerivedColumnsHook2,
                //       hidden: (props: TableWidgetProps, propertyPath: string) => {
                //         const baseProperty = getBasePropertyPath(propertyPath);
                //         const columnType = get(
                //           props,
                //           `${baseProperty}.columnType`,
                //           "",
                //         );
                //         return columnType !== "date";
                //       },
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       isBindProperty: true,
                //       validation: {
                //         type: ValidationTypes.TABLE_PROPERTY,
                //         params: {
                //           type: ValidationTypes.TEXT,
                //           params: {
                //             allowedValues: [
                //               "Epoch",
                //               "Milliseconds",
                //               "YYYY-MM-DD",
                //               "YYYY-MM-DD HH:mm",
                //               "YYYY-MM-DDTHH:mm:ss.sssZ",
                //               "YYYY-MM-DDTHH:mm:ss",
                //               "YYYY-MM-DD hh:mm:ss",
                //               "Do MMM YYYY",
                //               "DD/MM/YYYY",
                //               "DD/MM/YYYY HH:mm",
                //               "LLL",
                //               "LL",
                //               "D MMMM, YYYY",
                //               "H:mm A D MMMM, YYYY",
                //               "MM-DD-YYYY",
                //               "DD-MM-YYYY",
                //               "MM/DD/YYYY",
                //               "DD/MM/YYYY",
                //               "DD/MM/YY",
                //               "MM/DD/YY",
                //             ],
                //           },
                //         },
                //       },
                //       isTriggerProperty: false,
                //     },
                //     {
                //       propertyName: "outputFormat",
                //       label: "Display Date Format",
                //       controlType: "DROP_DOWN",
                //       customJSControl: "COMPUTE_VALUE",
                //       isJSConvertible: true,
                //       options: [
                //         {
                //           label: "UNIX timestamp (s)",
                //           value: "Epoch",
                //         },
                //         {
                //           label: "UNIX timestamp (ms)",
                //           value: "Milliseconds",
                //         },
                //         {
                //           label: "YYYY-MM-DD",
                //           value: "YYYY-MM-DD",
                //         },
                //         {
                //           label: "YYYY-MM-DD HH:mm",
                //           value: "YYYY-MM-DD HH:mm",
                //         },
                //         {
                //           label: "ISO 8601",
                //           value: "YYYY-MM-DDTHH:mm:ss.SSSZ",
                //         },
                //         {
                //           label: "YYYY-MM-DDTHH:mm:ss",
                //           value: "YYYY-MM-DDTHH:mm:ss",
                //         },
                //         {
                //           label: "YYYY-MM-DD hh:mm:ss",
                //           value: "YYYY-MM-DD hh:mm:ss",
                //         },
                //         {
                //           label: "Do MMM YYYY",
                //           value: "Do MMM YYYY",
                //         },
                //         {
                //           label: "DD/MM/YYYY",
                //           value: "DD/MM/YYYY",
                //         },
                //         {
                //           label: "DD/MM/YYYY HH:mm",
                //           value: "DD/MM/YYYY HH:mm",
                //         },
                //         {
                //           label: "LLL",
                //           value: "LLL",
                //         },
                //         {
                //           label: "LL",
                //           value: "LL",
                //         },
                //         {
                //           label: "D MMMM, YYYY",
                //           value: "D MMMM, YYYY",
                //         },
                //         {
                //           label: "H:mm A D MMMM, YYYY",
                //           value: "H:mm A D MMMM, YYYY",
                //         },
                //         {
                //           label: "MM-DD-YYYY",
                //           value: "MM-DD-YYYY",
                //         },
                //         {
                //           label: "DD-MM-YYYY",
                //           value: "DD-MM-YYYY",
                //         },
                //         {
                //           label: "MM/DD/YYYY",
                //           value: "MM/DD/YYYY",
                //         },
                //         {
                //           label: "DD/MM/YYYY",
                //           value: "DD/MM/YYYY",
                //         },
                //         {
                //           label: "DD/MM/YY",
                //           value: "DD/MM/YY",
                //         },
                //         {
                //           label: "MM/DD/YY",
                //           value: "MM/DD/YY",
                //         },
                //       ],
                //       defaultValue: "YYYY-MM-DD HH:mm",
                //       updateHook:   updateDerivedColumnsHook2,
                //       hidden: (props: TableWidgetProps, propertyPath: string) => {
                //         const baseProperty = getBasePropertyPath(propertyPath);
                //         const columnType = get(
                //           props,
                //           `${baseProperty}.columnType`,
                //           "",
                //         );
                //         return columnType !== "date";
                //       },
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnType",
                //       ],
                //       isBindProperty: true,
                //       validation: {
                //         type: ValidationTypes.TABLE_PROPERTY,
                //         params: {
                //           type: ValidationTypes.TEXT,
                //           params: {
                //             allowedValues: [
                //               "Epoch",
                //               "Milliseconds",
                //               "YYYY-MM-DD",
                //               "YYYY-MM-DD HH:mm",
                //               "YYYY-MM-DDTHH:mm:ss.sssZ",
                //               "YYYY-MM-DDTHH:mm:ss",
                //               "YYYY-MM-DD hh:mm:ss",
                //               "Do MMM YYYY",
                //               "DD/MM/YYYY",
                //               "DD/MM/YYYY HH:mm",
                //               "LLL",
                //               "LL",
                //               "D MMMM, YYYY",
                //               "H:mm A D MMMM, YYYY",
                //               "MM-DD-YYYY",
                //               "DD-MM-YYYY",
                //               "MM/DD/YYYY",
                //               "DD/MM/YYYY",
                //               "DD/MM/YY",
                //               "MM/DD/YY",
                //             ],
                //           },
                //         },
                //       },
                //       isTriggerProperty: false,
                //     },
                //     {
                //       propertyName: "onClick",
                //       label: "onClick",
                //       controlType: "ACTION_SELECTOR",
                //       updateHook:   updateDerivedColumnsHook2,
                //       hidden: (props: TableWidgetProps, propertyPath: string) => {
                //         const baseProperty = getBasePropertyPath(propertyPath);
                //         const columnType = get(
                //           props,
                //           `${baseProperty}.columnType`,
                //           "",
                //         );
                //         return columnType !== "image";
                //       },
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       isJSConvertible: true,
                //       isBindProperty: true,
                //       isTriggerProperty: true,
                //     },
                //   ],
                // },
                // {
                //   sectionName: "Styles",
                //   hidden: (props: TableWidgetProps, propertyPath: string) => {
                //     return hideByColumnType(
                //       props,
                //       propertyPath,
                //       [
                //         ColumnTypes.TEXT,
                //         ColumnTypes.DATE,
                //         ColumnTypes.NUMBER,
                //         ColumnTypes.URL,
                //       ],
                //       true,
                //     );
                //   },
                //   dependencies: ["primaryColumns", "derivedColumns"],
                //   children: [
                //     {
                //       propertyName: "horizontalAlignment",
                //       label: "Text Align",
                //       controlType: "ICON_TABS",
                //       options: [
                //         {
                //           icon: "LEFT_ALIGN",
                //           value: "LEFT",
                //         },
                //         {
                //           icon: "CENTER_ALIGN",
                //           value: "CENTER",
                //         },
                //         {
                //           icon: "RIGHT_ALIGN",
                //           value: "RIGHT",
                //         },
                //       ],
                //       defaultValue: "LEFT",
                //       isJSConvertible: true,
                //       customJSControl: "COMPUTE_VALUE",
                //       updateHook:   updateDerivedColumnsHook2,
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       isBindProperty: true,
                //       validation: {
                //         type: ValidationTypes.TABLE_PROPERTY,
                //         params: {
                //           type: ValidationTypes.TEXT,
                //           params: {
                //             allowedValues: ["LEFT", "CENTER", "RIGHT"],
                //           },
                //         },
                //       },
                //       isTriggerProperty: false,
                //     },
                //     {
                //       propertyName: "textSize",
                //       label: "Text Size",
                //       controlType: "DROP_DOWN",
                //       isJSConvertible: true,
                //       customJSControl: "COMPUTE_VALUE",
                //       options: [
                //         {
                //           label: "Heading 1",
                //           value: "HEADING1",
                //           subText: "24px",
                //           icon: "HEADING_ONE",
                //         },
                //         {
                //           label: "Heading 2",
                //           value: "HEADING2",
                //           subText: "18px",
                //           icon: "HEADING_TWO",
                //         },
                //         {
                //           label: "Heading 3",
                //           value: "HEADING3",
                //           subText: "16px",
                //           icon: "HEADING_THREE",
                //         },
                //         {
                //           label: "Paragraph",
                //           value: "PARAGRAPH",
                //           subText: "14px",
                //           icon: "PARAGRAPH",
                //         },
                //         {
                //           label: "Paragraph 2",
                //           value: "PARAGRAPH2",
                //           subText: "12px",
                //           icon: "PARAGRAPH_TWO",
                //         },
                //       ],
                //       updateHook:   updateDerivedColumnsHook2,
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       isBindProperty: true,
                //       isTriggerProperty: false,
                //       validation: {
                //         type: ValidationTypes.TABLE_PROPERTY,
                //         params: {
                //           type: ValidationTypes.TEXT,
                //           params: {
                //             allowedValues: [
                //               "HEADING1",
                //               "HEADING2",
                //               "HEADING3",
                //               "PARAGRAPH",
                //               "PARAGRAPH2",
                //             ],
                //           },
                //         },
                //       },
                //     },
                //     {
                //       propertyName: "fontStyle",
                //       label: "Font Style",
                //       controlType: "BUTTON_TABS",
                //       options: [
                //         {
                //           icon: "BOLD_FONT",
                //           value: "BOLD",
                //         },
                //         {
                //           icon: "ITALICS_FONT",
                //           value: "ITALIC",
                //         },
                //         {
                //           icon: "UNDERLINE",
                //           value: "UNDERLINE",
                //         },
                //       ],
                //       isJSConvertible: true,
                //       customJSControl: "COMPUTE_VALUE",
                //       updateHook:   updateDerivedColumnsHook2,
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       isBindProperty: true,
                //       isTriggerProperty: false,
                //       validation: {
                //         type: ValidationTypes.TABLE_PROPERTY,
                //         params: {
                //           type: ValidationTypes.TEXT,
                //         },
                //       },
                //     },
                //     {
                //       propertyName: "verticalAlignment",
                //       label: "Vertical Alignment",
                //       controlType: "ICON_TABS",
                //       options: [
                //         {
                //           icon: "VERTICAL_TOP",
                //           value: "TOP",
                //         },
                //         {
                //           icon: "VERTICAL_CENTER",
                //           value: "CENTER",
                //         },
                //         {
                //           icon: "VERTICAL_BOTTOM",
                //           value: "BOTTOM",
                //         },
                //       ],
                //       defaultValue: "LEFT",
                //       isJSConvertible: true,
                //       customJSControl: "COMPUTE_VALUE",
                //       updateHook:   updateDerivedColumnsHook2,
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       isBindProperty: true,
                //       validation: {
                //         type: ValidationTypes.TABLE_PROPERTY,
                //         params: {
                //           type: ValidationTypes.TEXT,
                //           params: {
                //             allowedValues: ["TOP", "CENTER", "BOTTOM"],
                //           },
                //         },
                //       },
                //       isTriggerProperty: false,
                //     },
                {
                  propertyName: "textColor",
                  label: "Text Color",
                  controlType: "COLOR_PICKER",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook2,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /^(?![<|{{]).+/,
                      },
                    },
                  },
                  isTriggerProperty: false,
                },
                {
                  propertyName: "cellBackground",
                  label: "Cell Background",
                  controlType: "COLOR_PICKER",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook2,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /^(?![<|{{]).+/,
                      },
                    },
                  },
                  isTriggerProperty: false,
                },
              ],
            },
            {
              propertyName: "isNewDropdownFormat",
              helpText: "Sets the format of Dropdown list as Value (Label)",
              label: "Select Dropdown Format",
              updateHook: updateDerivedColumnsHook2,
              defaultValue: false,
              controlType: "SWITCH",
              customJSControl: "COMPUTE_VALUE",
              isJSConvertible: true,
              isBindProperty: true,
              isTriggerProperty: false,
              hidden: (props: TabulatorWidgetProps, propertyPath: string) => {
                return hideByColumnType2(props, propertyPath, ["select"]);
              },
              validation: {
                type: ValidationTypes.TABLE_PROPERTY,
                params: {
                  type: ValidationTypes.BOOLEAN,
                },
              },
              dependencies: ["primaryColumns", "derivedColumns", "columnType"],
            },
            {
              sectionName: "Events",
              hidden: (props: TabulatorWidgetProps, propertyPath: string) => {
                return hideByColumnType2(props, propertyPath, ["text"], true);
              },
              dependencies: ["primaryColumns", "derivedColumns", "columnOrder"],
              children: [
                {
                  helpText: "Triggers an action when the cell is clicked",
                  propertyName: "onClick",
                  label: "onClick",
                  controlType: "ACTION_SELECTOR",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: true,
                },
              ],
            },
            {
              sectionName: "Events",
              hidden: (props: TabulatorWidgetProps, propertyPath: string) => {
                return hideByColumnType2(
                  props,
                  propertyPath,
                  ["checkbox"],
                  true,
                );
              },
              dependencies: ["primaryColumns", "derivedColumns", "columnOrder"],
              children: [
                {
                  helpText: "Triggers an action when the input is changed",
                  propertyName: "onChange",
                  label: "onChange",
                  controlType: "ACTION_SELECTOR",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: true,
                },
              ],
            },
            {
              sectionName: "Events",
              hidden: (props: TabulatorWidgetProps, propertyPath: string) => {
                return hideByColumnType2(props, propertyPath, ["input"], true);
              },
              dependencies: ["primaryColumns", "derivedColumns", "columnOrder"],
              children: [
                // Mandate cells in the column
                {
                  propertyName: "isRequired",
                  label: "Is Required",
                  controlType: "SWITCH",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook2,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /\w/,
                      },
                    },
                  },
                  isTriggerProperty: false,
                },
                {
                  helpText:
                    "Triggers an action when the input is changed and blurred",
                  propertyName: "onChange",
                  label: "onChange",
                  controlType: "ACTION_SELECTOR",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: true,
                },
                {
                  helpText: "Triggers an action when input is out of focus",
                  propertyName: "onBlur",
                  label: "onBlur",
                  controlType: "ACTION_SELECTOR",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: true,
                },
              ],
            },
            {
              sectionName: "Button Properties",
              hidden: (props: TableWidgetProps, propertyPath: string) => {
                return hideByColumnType(
                  props,
                  propertyPath,
                  [
                    ColumnTypes.BUTTON,
                    ColumnTypes.MENU_BUTTON,
                    ColumnTypes.ICON_BUTTON,
                  ],
                  true,
                );
              },
              children: [
                {
                  propertyName: "iconName",
                  label: "Icon",
                  helpText: "Sets the icon to be used for the icon button",
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.ICON_BUTTON,
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                  updateHook: updateIconAlignmentHook,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  controlType: "ICON_SELECT",
                  customJSControl: "COMPUTE_VALUE",
                  defaultIconName: "add",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        allowedValues: ICON_NAMES,
                        default: IconNames.ADD,
                      },
                    },
                  },
                },
                {
                  propertyName: "iconAlign",
                  label: "Icon Alignment",
                  helpText: "Sets the icon alignment of the menu button",
                  controlType: "ICON_ALIGN",
                  isBindProperty: false,
                  isTriggerProperty: false,
                  updateHook: updateDerivedColumnsHook2,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  validation: {
                    type: ValidationTypes.TEXT,
                    params: {
                      allowedValues: ["center", "left", "right"],
                    },
                  },
                },
                {
                  propertyName: "buttonLabel",
                  label: "Label",
                  controlType: "COMPUTE_VALUE",
                  defaultValue: "Action",
                  updateHook: updateDerivedColumnsHook2,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                {
                  propertyName: "menuButtonLabel",
                  label: "Label",
                  controlType: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook2,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                {
                  propertyName: "buttonColor",
                  getStylesheetValue: getPrimaryColumnStylesheetValue,
                  label: "Button Color",
                  controlType: "PRIMARY_COLUMNS_COLOR_PICKER",
                  helpText: "Changes the color of the button",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  updateHook: updateDerivedColumnsHook,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.BUTTON,
                      ColumnTypes.ICON_BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /^(?![<|{{]).+/,
                      },
                    },
                  },
                  isTriggerProperty: false,
                },
                {
                  helpText: "Show helper text with button on hover",
                  propertyName: "ToolTip",
                  label: "Tooltip",
                  controlType: "INPUT_TEXT",
                  placeholderText: "Tooltip for icon",
                  isBindProperty: true,
                  isTriggerProperty: false,
                },
                // {
                //   propertyName: "buttonVariant",
                //   label: "Button Variant",
                //   controlType: "DROP_DOWN",
                //   customJSControl: "COMPUTE_VALUE",
                //   isJSConvertible: true,
                //   helpText: "Sets the variant of the icon button",
                //   hidden: (props: TableWidgetProps, propertyPath: string) => {
                //     return hideByColumnType(props, propertyPath, [
                //       ColumnTypes.ICON_BUTTON,
                //     ]);
                //   },
                //   dependencies: [
                //     "primaryColumns",
                //     "derivedColumns",
                //     "columnOrder",
                //   ],
                //   options: [
                //     {
                //       label: "Primary",
                //       value: ButtonVariantTypes.PRIMARY,
                //     },
                //     {
                //       label: "Secondary",
                //       value: ButtonVariantTypes.SECONDARY,
                //     },
                //     {
                //       label: "Tertiary",
                //       value: ButtonVariantTypes.TERTIARY,
                //     },
                //   ],
                //   defaultValue: ButtonVariantTypes.PRIMARY,

                //   isBindProperty: true,
                //   isTriggerProperty: false,
                //   validation: {
                //     type: ValidationTypes.TABLE_PROPERTY,
                //     params: {
                //       type: ValidationTypes.TEXT,
                //       params: {
                //         default: ButtonVariantTypes.PRIMARY,
                //         allowedValues: [
                //           ButtonVariantTypes.PRIMARY,
                //           ButtonVariantTypes.SECONDARY,
                //           ButtonVariantTypes.TERTIARY,
                //         ],
                //       },
                //     },
                //   },
                // },
                // {
                //   propertyName: "borderRadius",
                //   label: "Border Radius",
                //   customJSControl: "COMPUTE_VALUE",
                //   isJSConvertible: true,
                //   helpText:
                //     "Rounds the corners of the icon button's outer border edge",
                //   controlType: "BORDER_RADIUS_OPTIONS",
                //   hidden: (props: TableWidgetProps, propertyPath: string) => {
                //     return hideByColumnType(props, propertyPath, [
                //       ColumnTypes.ICON_BUTTON,
                //     ]);
                //   },
                //   options: [
                //     ButtonBorderRadiusTypes.SHARP,
                //     ButtonBorderRadiusTypes.ROUNDED,
                //     ButtonBorderRadiusTypes.CIRCLE,
                //   ],
                //   dependencies: [
                //     "primaryColumns",
                //     "derivedColumns",
                //     "columnOrder",
                //   ],
                //   isBindProperty: true,
                //   isTriggerProperty: false,
                //   validation: {
                //     type: ValidationTypes.TABLE_PROPERTY,
                //     params: {
                //       type: ValidationTypes.TEXT,
                //       params: {
                //         allowedValues: ["CIRCLE", "SHARP", "ROUNDED"],
                //       },
                //     },
                //   },
                // },
                // {
                //   propertyName: "boxShadow",
                //   label: "Box Shadow",
                //   helpText:
                //     "Enables you to cast a drop shadow from the frame of the widget",
                //   controlType: "BOX_SHADOW_OPTIONS",
                //   customJSControl: "COMPUTE_VALUE",
                //   isJSConvertible: true,
                //   hidden: (props: TableWidgetProps, propertyPath: string) => {
                //     return hideByColumnType(props, propertyPath, [
                //       ColumnTypes.ICON_BUTTON,
                //     ]);
                //   },
                //   dependencies: [
                //     "primaryColumns",
                //     "derivedColumns",
                //     "columnOrder",
                //   ],
                //   isBindProperty: true,
                //   isTriggerProperty: false,
                //   validation: {
                //     type: ValidationTypes.TABLE_PROPERTY,
                //     params: {
                //       type: ValidationTypes.TEXT,
                //       params: {
                //         allowedValues: [
                //           "NONE",
                //           "VARIANT1",
                //           "VARIANT2",
                //           "VARIANT3",
                //           "VARIANT4",
                //           "VARIANT5",
                //         ],
                //       },
                //     },
                //   },
                // },
                // {
                //   propertyName: "boxShadowColor",
                //   helpText: "Sets the shadow color of the widget",
                //   label: "Shadow Color",
                //   controlType: "COLOR_PICKER",
                //   customJSControl: "COMPUTE_VALUE",
                //   isJSConvertible: true,
                //   hidden: (props: TableWidgetProps, propertyPath: string) => {
                //     return hideByColumnType(props, propertyPath, [
                //       ColumnTypes.ICON_BUTTON,
                //     ]);
                //   },
                //   dependencies: [
                //     "primaryColumns",
                //     "derivedColumns",
                //     "columnOrder",
                //   ],
                //   isBindProperty: true,
                //   validation: {
                //     type: ValidationTypes.TABLE_PROPERTY,
                //     params: {
                //       type: ValidationTypes.TEXT,
                //       params: {
                //         regex: /^(?![<|{{]).+/,
                //       },
                //     },
                //   },
                //   isTriggerProperty: false,
                // },
                {
                  propertyName: "buttonLabelColor",
                  label: "Label Color",
                  controlType: "COLOR_PICKER",
                  isJSConvertible: true,
                  customJSControl: "COMPUTE_VALUE",
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  updateHook: updateDerivedColumnsHook2,
                  isBindProperty: true,
                  isTriggerProperty: false,
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /^(?![<|{{]).+/,
                      },
                    },
                  },
                },

                {
                  propertyName: "menuColor",
                  helpText:
                    "Sets the custom color preset based on the menu button variant",
                  label: "Menu Color",
                  controlType: "PRIMARY_COLUMNS_COLOR_PICKER",
                  customJSControl: "COMPUTE_VALUE",
                  isJSConvertible: true,
                  isBindProperty: true,
                  getStylesheetValue: getPrimaryColumnStylesheetValue,
                  isTriggerProperty: false,
                  placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
                  validation: {
                    type: ValidationTypes.TABLE_PROPERTY,
                    params: {
                      type: ValidationTypes.TEXT,
                      params: {
                        regex: /^(?![<|{{]).+/,
                      },
                    },
                  },
                  hidden: (
                    props: TabulatorWidgetProps,
                    propertyPath: string,
                  ) => {
                    return hideByColumnType2(props, propertyPath, [
                      ColumnTypes.MENU_BUTTON,
                    ]);
                  },
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  // Remove menu Style once Custom is Chosen
                  updateHook: updateDerivedColumnsHook,
                },
                //     {
                //       propertyName: "menuVariant",
                //       label: "Menu Variant",
                //       controlType: "DROP_DOWN",
                //       helpText: "Sets the variant of the menu button",
                //       options: [
                //         {
                //           label: "Primary",
                //           value: ButtonVariantTypes.PRIMARY,
                //         },
                //         {
                //           label: "Secondary",
                //           value: ButtonVariantTypes.SECONDARY,
                //         },
                //         {
                //           label: "Tertiary",
                //           value: ButtonVariantTypes.TERTIARY,
                //         },
                //       ],
                //       isJSConvertible: true,
                //       updateHook:   updateDerivedColumnsHook2,
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       hidden: (props: TableWidgetProps, propertyPath: string) => {
                //         return hideByColumnType(props, propertyPath, [
                //           ColumnTypes.MENU_BUTTON,
                //         ]);
                //       },
                //       isBindProperty: true,
                //       isTriggerProperty: false,
                //       validation: {
                //         type: ValidationTypes.TEXT,
                //         params: {
                //           default: ButtonVariantTypes.PRIMARY,
                //           allowedValues: [
                //             ButtonVariantTypes.PRIMARY,
                //             ButtonVariantTypes.SECONDARY,
                //             ButtonVariantTypes.TERTIARY,
                //           ],
                //         },
                //       },
                //     },
                //     {
                //       propertyName: "borderRadius",
                //       label: "Border Radius",
                //       helpText:
                //         "Rounds the corners of the icon button's outer border edge",
                //       controlType: "BUTTON_BORDER_RADIUS_OPTIONS",
                //       isBindProperty: false,
                //       isTriggerProperty: false,
                //       updateHook:   updateDerivedColumnsHook2,
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       hidden: (props: TableWidgetProps, propertyPath: string) => {
                //         return hideByColumnType(props, propertyPath, [
                //           ColumnTypes.MENU_BUTTON,
                //         ]);
                //       },
                //       validation: {
                //         type: ValidationTypes.TEXT,
                //         params: {
                //           allowedValues: ["CIRCLE", "SHARP", "ROUNDED"],
                //         },
                //       },
                //     },
                //     {
                //       propertyName: "boxShadow",
                //       label: "Box Shadow",
                //       helpText:
                //         "Enables you to cast a drop shadow from the frame of the widget",
                //       controlType: "BOX_SHADOW_OPTIONS",
                //       isBindProperty: false,
                //       isTriggerProperty: false,
                //       updateHook:   updateDerivedColumnsHook2,
                //       hidden: (props: TableWidgetProps, propertyPath: string) => {
                //         return hideByColumnType(props, propertyPath, [
                //           ColumnTypes.MENU_BUTTON,
                //         ]);
                //       },
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       validation: {
                //         type: ValidationTypes.TEXT,
                //         params: {
                //           allowedValues: [
                //             "NONE",
                //             "VARIANT1",
                //             "VARIANT2",
                //             "VARIANT3",
                //             "VARIANT4",
                //             "VARIANT5",
                //           ],
                //         },
                //       },
                //     },
                //     {
                //       propertyName: "boxShadowColor",
                //       helpText: "Sets the shadow color of the widget",
                //       label: "Shadow Color",
                //       controlType: "COLOR_PICKER",
                //       isBindProperty: false,
                //       isTriggerProperty: false,
                //       updateHook:   updateDerivedColumnsHook2,
                //       hidden: (props: TableWidgetProps, propertyPath: string) => {
                //         return hideByColumnType(props, propertyPath, [
                //           ColumnTypes.MENU_BUTTON,
                //         ]);
                //       },
                //       dependencies: [
                //         "primaryColumns",
                //         "derivedColumns",
                //         "columnOrder",
                //       ],
                //       validation: {
                //         type: ValidationTypes.TEXT,
                //         params: {
                //           regex: /^(?![<|{{]).+/,
                //         },
                //       },
                //     },

                {
                  helpText: "Triggers an action when the button is clicked",
                  propertyName: "onClick",
                  label: "onClick",
                  controlType: "ACTION_SELECTOR",
                  additionalAutoComplete: (props: TableWidgetProps) => ({
                    currentRow: Object.assign(
                      {},
                      ...Object.keys(props.primaryColumns).map((key) => ({
                        [key]: "",
                      })),
                    ),
                  }),
                  isJSConvertible: true,
                  dependencies: [
                    "primaryColumns",
                    "derivedColumns",
                    "columnOrder",
                  ],
                  isBindProperty: true,
                  isTriggerProperty: true,
                  hidden: (props: TableWidgetProps, propertyPath: string) => {
                    return hideByColumnType(props, propertyPath, [
                      ColumnTypes.BUTTON,
                      ColumnTypes.ICON_BUTTON,
                    ]);
                  },
                },
              ],
            },
            {
              sectionName: "Menu Items",
              hidden: (props: TableWidgetProps, propertyPath: string) => {
                return hideByColumnType(
                  props,
                  propertyPath,
                  [ColumnTypes.MENU_BUTTON],
                  true,
                );
              },
              updateHook: updateDerivedColumnsHook2,
              children: [
                {
                  helpText: "Menu items",
                  propertyName: "menuItems",
                  controlType: "MENU_ITEMS",
                  label: "",
                  isBindProperty: false,
                  isTriggerProperty: false,
                  dependencies: ["derivedColumns", "columnOrder"],
                  panelConfig: {
                    editableTitle: true,
                    titlePropertyName: "label",
                    panelIdPropertyName: "id",
                    updateHook: updateDerivedColumnsHook2,
                    dependencies: [
                      "primaryColumns",
                      "derivedColumns",
                      "columnOrder",
                    ],
                    children: [
                      {
                        sectionName: "General",
                        children: [
                          {
                            propertyName: "label",
                            helpText: "Sets the label of a menu item",
                            label: "Label",
                            controlType: "INPUT_TEXT",
                            placeholderText: "Enter label",
                            isBindProperty: true,
                            isTriggerProperty: false,
                            validation: { type: ValidationTypes.TEXT },
                            updateHook: updateDerivedColumnsHook2,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                          // {
                          //   propertyName: "backgroundColor",
                          //   helpText:
                          //     "Sets the background color of a menu item",
                          //   label: "Background color",
                          //   controlType: "PRIMARY_COLUMNS_COLOR_PICKER_V2",
                          //   isBindProperty: true,
                          //   isTriggerProperty: false,
                          //   validation: {
                          //     type: ValidationTypes.TABLE_PROPERTY,
                          //     params: {
                          //       type: ValidationTypes.TEXT,
                          //       params: {
                          //         regex: /^(?![<|{{]).+/,
                          //       },
                          //     },
                          //   },
                          //   updateHook: updateDerivedColumnsHook2,

                          //   dependencies: [
                          //     "primaryColumns",
                          //     "derivedColumns",
                          //     "columnOrder",
                          //   ],
                          // },
                          {
                            propertyName: "textColor",
                            helpText: "Sets the text color of a menu item",
                            label: "Text color",
                            controlType: "COLOR_PICKER",
                            isBindProperty: false,
                            isTriggerProperty: false,
                            updateHook: updateDerivedColumnsHook2,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                          {
                            propertyName: "isDisabled",
                            helpText: "Disables input to the widget",
                            label: "Disabled",
                            controlType: "SWITCH",
                            isJSConvertible: true,
                            isBindProperty: true,
                            isTriggerProperty: false,
                            customJSControl: "COMPUTE_VALUE",
                            validation: {
                              type: ValidationTypes.TABLE_PROPERTY,
                              params: {
                                type: ValidationTypes.BOOLEAN,
                              },
                            },
                            updateHook: updateDerivedColumnsHook2,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                          {
                            propertyName: "isVisible",
                            helpText: "Controls the visibility of the widget",
                            label: "Visible",
                            controlType: "SWITCH",
                            isJSConvertible: true,
                            isBindProperty: true,
                            isTriggerProperty: false,
                            validation: { type: ValidationTypes.BOOLEAN },
                            updateHook: updateDerivedColumnsHook2,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                        ],
                      },
                      {
                        sectionName: "Icon Options",
                        children: [
                          {
                            propertyName: "iconName",
                            label: "Icon",
                            helpText:
                              "Sets the icon to be used for a menu item",
                            controlType: "ICON_SELECT",
                            isBindProperty: false,
                            isTriggerProperty: false,
                            validation: { type: ValidationTypes.TEXT },
                            updateHook: updateDerivedColumnsHook2,
                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                          // {
                          //   propertyName: "iconColor",
                          //   helpText: "Sets the icon color of a menu item",
                          //   label: "Icon color",
                          //   controlType: "COLOR_PICKER",
                          //   isBindProperty: false,
                          //   isTriggerProperty: false,
                          //   updateHook:   updateDerivedColumnsHook2,

                          //   dependencies: [
                          //     "primaryColumns",
                          //     "derivedColumns",
                          //     "columnOrder",
                          //   ],
                          // },
                          {
                            propertyName: "iconAlign",
                            label: "Icon alignment",
                            helpText: "Sets the icon alignment of a menu item",
                            controlType: "ICON_ALIGN",
                            isBindProperty: false,
                            isTriggerProperty: false,
                            validation: { type: ValidationTypes.TEXT },
                            updateHook: updateDerivedColumnsHook2,

                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                        ],
                      },
                      {
                        sectionName: "Events",
                        children: [
                          {
                            helpText:
                              "Triggers an action when the menu item is clicked",
                            propertyName: "onClick",
                            label: "onItemClick",
                            controlType: "ACTION_SELECTOR",
                            isJSConvertible: true,
                            isBindProperty: true,
                            isTriggerProperty: true,
                            dependencies: [
                              "primaryColumns",
                              "derivedColumns",
                              "columnOrder",
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            {
              sectionName: "Events",
              hidden: (props: TabulatorWidgetProps, propertyPath: string) => {
                return hideByColumnType2(props, propertyPath, ["select"], true);
              },
              dependencies: ["primaryColumns", "derivedColumns", "columnOrder"],
              children: [
                {
                  helpText:
                    "Triggers an action when the input is changed and blurred",
                  propertyName: "onSelectChange",
                  label: "onSelectChange",
                  controlType: "ACTION_SELECTOR",
                  isJSConvertible: true,
                  isBindProperty: true,
                  isTriggerProperty: true,
                },
              ],
            },
          ],
        },
      },
      {
        propertyName: "dataPersistence",
        label: "Data Persistence",
        helpText: "Enable/disable data persistence ",
        controlType: "SWITCH",
        isBindProperty: true,
        isJSConvertible: false,
        isTriggerProperty: false,
        defaultValue: true,
      },
      {
        propertyName: "singleSelectRow",
        label: "Enable single row selection",
        controlType: "SWITCH",
        defaultValue: false,
        isBindProperty: true,
        isTriggerProperty: false,
        hidden: (props: TabulatorWidgetProps) => {
          return props.multiSelectRow;
        },
        dependencies: ["multiSelectRow"],
      },
      {
        propertyName: "multiSelectRow",
        label: "Enable multi row selection",
        controlType: "SWITCH",
        defaultValue: false,
        isBindProperty: true,
        isTriggerProperty: false,
        hidden: (props: TabulatorWidgetProps) => {
          return props.singleSelectRow;
        },
        dependencies: ["singleSelectRow"],
      },
      {
        propertyName: "addRowBelow",
        label: "Add Row Enable",
        controlType: "SWITCH",
        defaultValue: false,
        isBindProperty: true,
        isTriggerProperty: false,
        hidden: (props: TabulatorWidgetProps) => {
          return props.multiSelectRow;
        },
        dependencies: ["multiSelectRow"],
      },
      {
        helpText: "Enable groupBy",
        propertyName: "isgroupBy",
        dependencies: ["primaryColumns"],
        label: "Group By",
        controlType: "GROUP_BY_DROPDOWN",
        isBindProperty: true,
        isTriggerProperty: false,
        isJSConvertible: true,
      },
      {
        helpText: "Multi-level groupBy has higher precendence than groupBy",
        propertyName: "ismultigroupBy",
        dependencies: ["primaryColumns"],
        label: "Multi-level Group By",
        controlType: "INPUT_TEXT",
        placeholderText: `["column1", "column2"]`,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.ARRAY },
      },
      {
        helpText: "Row movable",
        propertyName: "isrowMovable",
        label: "Movable Row",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
      },
      {
        propertyName: "movableRowsToTable",
        label: "Moving Rows To Other Table",
        controlType: "SWITCH",
        helpText: "Moving Rows To Other Table",
        defaultValue: false,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
    ],
  },
  {
    sectionName: "Buttons",
    children: [
      {
        propertyName: "resetButtonEnable",
        label: "Reset Button Enable",
        helpText: "Sets the visibility of reset button",
        controlType: "SWITCH",
        isBindProperty: true,
        isJSConvertible: true,
        isTriggerProperty: false,
        defaultValue: false,
      },
      {
        propertyName: "resetButton",
        label: "Reset Button Label",
        helpText: "Sets the label of the reset button",
        controlType: "INPUT_TEXT",
        placeholderText: "Reset",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "resetButtonColor",
        helpText: "Changes the color of the reset button",
        label: "Reset Button Color",
        controlType: "COLOR_PICKER",
        isBindProperty: true,
        isTriggerProperty: false,
      },
      {
        propertyName: "saveButtonEnable",
        label: "Save Button Enable",
        helpText: "Sets the visibility of save button",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        isJSConvertible: true,
        defaultValue: false,
      },
      {
        propertyName: "saveButton",
        label: "Save Button Label",
        helpText: "Sets the label of the save button",
        controlType: "INPUT_TEXT",
        placeholderText: "Save",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "saveButtonColor",
        helpText: "Changes the color of the save button",
        label: "Save Button Color",
        controlType: "COLOR_PICKER",
        isBindProperty: true,
        isTriggerProperty: false,
      },
      {
        propertyName: "newButtonEnable",
        label: "New Button Enable",
        helpText: "Sets the visibility of new button",
        controlType: "SWITCH",
        isBindProperty: true,
        isTriggerProperty: false,
        isJSConvertible: true,
        defaultValue: false,
      },
      {
        propertyName: "newButton",
        label: "New Button Label",
        helpText: "Sets the label of the new button",
        controlType: "INPUT_TEXT",
        placeholderText: "New",
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.TEXT },
      },
      {
        propertyName: "newButtonColor",
        helpText: "Changes the color of the new button",
        label: "New Button Color",
        controlType: "COLOR_PICKER",
        isBindProperty: true,
        isTriggerProperty: false,
      },
      {
        propertyName: "animateLoading",
        label: "Save Button Animation",
        controlType: "SWITCH",
        helpText: "Controls the loading of the widget",
        defaultValue: true,
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: false,
        validation: { type: ValidationTypes.BOOLEAN },
      },
    ],
  },

  {
    sectionName: "Events",

    children: [
      {
        helpText: "Triggers an action when save button clicked",
        propertyName: "onSaveClick",
        label: "onSaveClick",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
      {
        helpText: "Triggers an action when reset button clicked",
        propertyName: "onResetClick",
        label: "onResetClick",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
      },
      {
        helpText: "Triggers an action when single row save button clicked",
        propertyName: "onRowSaveClick",
        label: "onRowSaveClick",
        controlType: "ACTION_SELECTOR",
        isJSConvertible: true,
        isBindProperty: true,
        isTriggerProperty: true,
        hidden: (props: TabulatorWidgetProps) => {
          return !props.singleSelectRow;
        },
        dependencies: ["singleSelectRow"],
      },

      // {
      //   helpText: "Triggers an action when a new cell value is created",
      //   propertyName: "createNewRow",
      //   label: "createNewRow",
      //   controlType: "ACTION_SELECTOR",
      //   isJSConvertible: true,
      //   isBindProperty: true,
      //   isTriggerProperty: true,
      // },
    ],
  },
  {
    sectionName: "Header options",
    children: [
      {
        helpText: "Toggle visibility of the search box",
        propertyName: "isVisibleSearch",
        label: "Search",
        controlType: "SWITCH",
        isBindProperty: false,
        isTriggerProperty: false,
      },
    ],
  },

  {
    sectionName: "Styles",
    children: [
      {
        propertyName: "cellBackground",
        helpText: "Changes the background color of the table",
        label: "Cell Background Color",
        controlType: "COLOR_PICKER",
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "textColor",
        helpText: "Changes the text color of the table",
        label: "Text Color",
        controlType: "COLOR_PICKER",
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "textSize",
        label: "Text Size",
        controlType: "DROP_DOWN",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns", "derivedColumns"],
        options: [
          {
            label: "Heading 1",
            value: "HEADING1",
            subText: "24px",
            icon: "HEADING_ONE",
          },
          {
            label: "Heading 2",
            value: "HEADING2",
            subText: "18px",
            icon: "HEADING_TWO",
          },
          {
            label: "Heading 3",
            value: "HEADING3",
            subText: "16px",
            icon: "HEADING_THREE",
          },
          {
            label: "Paragraph",
            value: "PARAGRAPH",
            subText: "14px",
            icon: "PARAGRAPH",
          },
          {
            label: "Paragraph 2",
            value: "PARAGRAPH2",
            subText: "12px",
            icon: "PARAGRAPH_TWO",
          },
        ],
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "fontStyle",
        label: "Font Style",
        controlType: "BUTTON_TABS",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns", "derivedColumns"],
        options: [
          {
            icon: "BOLD_FONT",
            value: "BOLD",
          },
          {
            icon: "ITALICS_FONT",
            value: "ITALIC",
          },
        ],
        isBindProperty: false,
        isTriggerProperty: false,
      },
      {
        propertyName: "horizontalAlignment",
        label: "Text Align",
        controlType: "ICON_TABS",
        updateHook: updateColumnStyles,
        dependencies: ["primaryColumns", "derivedColumns"],
        options: [
          {
            icon: "LEFT_ALIGN",
            value: "LEFT",
          },
          {
            icon: "CENTER_ALIGN",
            value: "CENTER",
          },
          {
            icon: "RIGHT_ALIGN",
            value: "RIGHT",
          },
        ],
        defaultValue: "LEFT",
        isBindProperty: false,
        isTriggerProperty: false,
      },
    ],
  },
];
