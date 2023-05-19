import React, {FC} from 'react';
import {MaterialUICheckbox} from "./MaterialUICheckbox";

type Props = {
  onChange: (value: boolean) => void
  value ?: boolean
}

export const Checkbox: FC<Props> = props => {
  return (
    // <input type="checkbox"/>
    <MaterialUICheckbox onChange={props.onChange} value={props.value}/>
  );
};