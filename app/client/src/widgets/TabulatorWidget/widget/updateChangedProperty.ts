export const updateDerivedColumnsHook = (
  props: any,
  propertyPath: string,
  propertyValue: any,
): Array<{ propertyPath: string; propertyValue: any }> | undefined => {
  if (props && propertyValue) {
    props.modifiedData = {
      name: propertyPath,
      value: propertyValue,
    };
  }
  return;
};
