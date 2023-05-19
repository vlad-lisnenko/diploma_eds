import React, {FC} from 'react';
import {Checkbox} from "@material-ui/core";

type Props = {
  onChange: (value: boolean) => void
  value ?: boolean
}

export const MaterialUICheckbox: FC<Props> = props => {
  return (
    <Checkbox color="primary" checked={props.value} onChange={e => props.onChange(e.target.checked)} />
  );
};