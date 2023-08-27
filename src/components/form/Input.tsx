import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {
  ControllerRenderProps,
  FieldError,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

type Props<TFieldValues> = {
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
  fieldError: FieldError | undefined;
} & TextFieldProps;

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
  },
  errorMessage: {
    color: theme.palette.error.main,
    margin: theme.spacing(1, 0),
  },
}));

const FormInput = <TFieldValues extends FieldValues>({
  field,
  fieldError,
  ...textFieldProps
}: Props<TFieldValues>) => {
  const classes = useStyles();

  return (
    <div
      className={classes.container}
      style={{ width: textFieldProps.fullWidth ? '100%' : 'inherit' }}
    >
      <TextField
        {...field}
        {...textFieldProps}
        error={fieldError !== undefined}
      />
      {fieldError && (
        <p className={classes.errorMessage}>{fieldError?.message}</p>
      )}
    </div>
  );
};

export default FormInput;
