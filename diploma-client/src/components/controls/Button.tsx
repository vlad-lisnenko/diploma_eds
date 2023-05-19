import React, {FC} from 'react';
import {MaterialUIButton} from "./MaterialUIButton";

type Props = {
  value: string
  onClick ?: () => void
  disabled ?: boolean
  color ?: "primary" | "inherit" | "secondary" | "default"
  type ?: "button" | "submit" | "reset"
}

export const Button: FC<Props> = props => {
  return (
    <MaterialUIButton disabled={props.disabled}
                      color={props.color}
                      onClick={props.onClick}
                      value={props.value}
                      type={props.type}
                      children={props.children}/>
  );
};