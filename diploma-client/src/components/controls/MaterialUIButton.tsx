import React, {FC} from 'react';
import {Button} from "@material-ui/core";

type Props = {
  value: string
  onClick ?: () => void
  disabled ?: boolean
  color ?: "primary" | "inherit" | "secondary" | "default"
  type ?: "button" | "submit" | "reset"
}

export const MaterialUIButton: FC<Props> = props => {
  return (
    <Button type={props.type} disabled={props.disabled} color={props.color || 'primary'} variant="contained" onClick={props.onClick}>{props.value}</Button>
  );
};