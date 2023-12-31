import React from "react";
import type { WrappedFieldMetaProps } from "redux-form";
import { Field } from "redux-form";
import type { Intent } from "constants/DefaultTheme";
import { FieldError } from "design-system-old";
import {
  EditorModes,
  EditorSize,
  EditorTheme,
  TabBehaviour,
} from "components/editorComponents/CodeEditor/EditorConfig";
import type { EditorProps } from "components/editorComponents/CodeEditor";
import LazyCodeEditor from "components/editorComponents/LazyCodeEditor";

const renderComponent = (
  componentProps: FormTextAreaFieldProps &
    EditorProps & {
      meta: Partial<WrappedFieldMetaProps>;
    },
) => {
  const showError = componentProps.meta.touched && !componentProps.meta.active;
  const theme = EditorTheme.LIGHT;
  return (
    <>
      <LazyCodeEditor
        height={"156px"}
        hideEvaluatedValue
        showLightningMenu={false}
        {...componentProps}
        hinting={[]}
        mode={EditorModes.TEXT}
        size={EditorSize.EXTENDED}
        tabBehaviour={TabBehaviour.INDENT}
        theme={theme}
      />
      {!componentProps.hideErrorMessage && componentProps.meta.error && (
        <FieldError error={showError && componentProps.meta.error} />
      )}
    </>
  );
};

export type FormTextAreaFieldProps = {
  name: string;
  placeholder: string;
  label?: string;
  intent?: Intent;
  disabled?: boolean;
  autoFocus?: boolean;
  hideErrorMessage?: boolean;
};

function FormTextAreaField(props: FormTextAreaFieldProps) {
  return <Field component={renderComponent} {...props} asyncControl />;
}

export default FormTextAreaField;
