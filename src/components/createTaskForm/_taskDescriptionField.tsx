import React, { FC, ReactElement } from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

import { ITextField } from './interfaces/ITextField';

export const TaskDescriptionField: FC<ITextField> = (props): ReactElement => {
  const { disabled = false, onChange = (e) => console.log(e) } = props;

  return (
    <TextField
      id="description"
      name="description"
      label="Description"
      placeholder="Description"
      variant="outlined"
      size="small"
      multiline
      rows={4}
      fullWidth
      disabled={disabled}
      onChange={onChange}
    />
  );
};

TaskDescriptionField.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};