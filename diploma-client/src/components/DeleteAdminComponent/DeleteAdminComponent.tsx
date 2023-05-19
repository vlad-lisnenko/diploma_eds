import React, {FC} from 'react';
import {Button} from "../controls/Button";

type Props = {
  email: string
  onDelete: () => void
}

export const DeleteAdminComponent: FC<Props> = props => {
  return (
    <div className="common__padding-1em">
      <div className="common__flex common__padding-1em common__flex-align-items-center">
        <div>
          {props.email}
        </div>
        <div style={{paddingLeft: '1em'}}>
          <Button value="Delete" color="secondary" onClick={props.onDelete} />
        </div>
      </div>
    </div>
  );
};