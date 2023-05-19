import React, {FC} from 'react';
import {Input, InputProps} from "./Input";

export const InputWithMargins: FC<InputProps> = props => (
  <div style={{padding: '0 0.7em', width: '50%'}}>
    <Input {...props}/>
  </div>
);