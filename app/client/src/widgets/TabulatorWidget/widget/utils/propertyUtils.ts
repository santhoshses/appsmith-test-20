import { Colors } from "constants/Colors";
import { get } from "lodash";
import { getBasePropertyPath } from "widgets/TableWidget/widget/propertyUtils";
import type { TabulatorWidgetProps } from "..";

export const hideByColumnType2 = (
  props: TabulatorWidgetProps,
  propertyPath: string,
  columnTypes: any,
  shouldUsePropertyPath?: boolean,
) => {
  const baseProperty = shouldUsePropertyPath
    ? propertyPath
    : getBasePropertyPath(propertyPath);
  const columnType = get(props, `${baseProperty}.columnType`, "");
  return !columnTypes.includes(columnType);
};

export const updateDerivedColumnsHook2 = (
  props: TabulatorWidgetProps,
  propertyPath: string,
  propertyValue: any,
): Array<{ propertyPath: string; propertyValue: any }> | undefined => {
  let propertiesToUpdate: Array<{
    propertyPath: string;
    propertyValue: any;
  }> = [];
  if (props && propertyValue) {
    // If we're adding a column, we need to add it to the `derivedColumns` property as well
    if (/^primaryColumns\.\w+$/.test(propertyPath)) {
      const newId = propertyValue.id;
      if (newId) {
        // sets default value for some properties
        //propertyValue.buttonColor = Colors.GREEN;
        //propertyValue.menuColor = Colors.GREEN;
        propertyValue.labelColor = Colors.WHITE;

        propertiesToUpdate = [
          {
            propertyPath: `derivedColumns.${newId}`,
            propertyValue,
          },
        ];
      }

      const oldColumnOrder = props.columnOrder || [];
      const newColumnOrder = [...oldColumnOrder, propertyValue.id];
      propertiesToUpdate.push({
        propertyPath: "columnOrder",
        propertyValue: newColumnOrder,
      });
    }
    // If we're updating a columns' name, we need to update the `derivedColumns` property as well.
    const regex = /^primaryColumns\.(\w+)\.(.*)$/;
    if (regex.test(propertyPath)) {
      const matches = propertyPath.match(regex);
      if (matches && matches.length === 3) {
        // updated to use column keys
        const columnId = matches[1];
        const columnProperty = matches[2];
        const primaryColumn = props.primaryColumns[columnId];
        const isDerived = primaryColumn ? primaryColumn.isDerived : false;

        const { derivedColumns = {} } = props;

        if (isDerived && derivedColumns && derivedColumns[columnId]) {
          propertiesToUpdate = [
            {
              propertyPath: `derivedColumns.${columnId}.${columnProperty}`,
              propertyValue: propertyValue,
            },
          ];
        }
      }
    }
    if (propertiesToUpdate.length > 0) return propertiesToUpdate;
  }
  return;
};
