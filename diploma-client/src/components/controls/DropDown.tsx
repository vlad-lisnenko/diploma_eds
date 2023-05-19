import React, {FC} from 'react';
import {FormControl, MenuItem, Select} from "@material-ui/core";

type DropDownValue = {
  id: any
  value: any
  displayValue: any
}

type Props = {
  value: any
  values: DropDownValue[]
  handleChange: (value: DropDownValue) => void
}

export const DropDown: FC<Props> = props => {

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    props.handleChange(props.values.filter(it => it.id === event.target.value)[0])
  };

  return (
    <div>
      <FormControl>
        <Select value={props.value} onChange={handleChange}>
          {props.values.map((it, index) => <MenuItem key={index} value={it.id}>{it.displayValue}</MenuItem>)}
        </Select>
      </FormControl>
    </div>
  );
};