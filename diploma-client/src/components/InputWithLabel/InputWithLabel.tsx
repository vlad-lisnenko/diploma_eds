import React, {FC} from 'react';
import {Input, InputProps} from "../inputs/Input";

const alignItemsFlexEnd = {
  alignItems: 'flex-end',
}

type Props = {
  label: string
  inputType?: string
}

export const InputWithLabel: FC<Props & InputProps> = props => {
  return (
    <div className="common__flex" style={{padding: '1em 0'}}>
      <div className="common__padding-right-left-10px common__flex" style={alignItemsFlexEnd}>
        {props.label}
      </div>
        <div className="common__flex-justify-content-flex-end common-flex-1-1-auto">
          <div className="common__padding-right-left-10px">
            <Input value={props.value}
                   onChange={props.onChange}
                   onBlur={props.onBlur}
                   error={props.error}
                   helperText={props.helperText}
                   type={props.inputType}/>
          </div>
        </div>
    </div>
  );
};