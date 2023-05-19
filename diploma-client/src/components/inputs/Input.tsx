import React, {FC} from 'react';
import {createStyles, makeStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField"

export type InputProps = {
  value ?: string
  multiline ?: boolean
  name ?: string
  onChange ?: (value: any) => void
  type?: string
  onBlur?: any
  error?: boolean
  helperText?: string
}

const useStyles = makeStyles(theme => createStyles({
  root: {
    padding: '0.438em 0 0',
    height: '100%',
    width: '100%'
  },
  helperText: {
    position: 'absolute',
    top: '-1em'
  }
}))

export const Input: FC<InputProps> = props => {
  const classes = useStyles()
  return (
    // <input type="text" value={props.value} style={{width: '100%'}}/>
    <TextField value={props.value}
               name={props.name}
               onBlur={props.onBlur}
               error={props.error}
               FormHelperTextProps={{className: classes.helperText}}
               helperText={props.helperText}
               onChange={e => props.onChange?.(e.target.value)}
               classes={classes}
               multiline={props.multiline}
               inputProps={{
                 style: {padding: '0'}
               }}
               type={props.type || "text"} />
  );
};