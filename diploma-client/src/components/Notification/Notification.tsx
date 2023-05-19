import React, {FC} from 'react';
import './Notification.scss'

type Props = {
  message: string
}

export const Notification: FC<Props> = props => {
  return (
    <div className="notification">
      {props.message}
    </div>
  );
};