import React, {FC} from 'react';
import {Button} from "@material-ui/core";

type Props = {
  value: string
  onClick ?: (file ?: File) => void
  component ?: any
}

export const UploadFileButton: FC<Props> = props => {
  return (
    <Button color="primary"
            variant="contained"
            component={props.component}>
      {props.value}
      <input type="file" hidden onChange={e => props.onClick?.(e.target.files?.[0])}/>
    </Button>
  );
};