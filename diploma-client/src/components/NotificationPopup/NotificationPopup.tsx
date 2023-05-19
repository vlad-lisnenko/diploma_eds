import React, {FC} from 'react';
import {Notification} from "../Notification/Notification";
import {useSelector} from "react-redux";
import {State} from "../../redux/reducers/reducers";

export const NotificationPopup: FC = () => {
  const showNotification = useSelector((state: State) => state.notification.visible)
  const message = useSelector((state: State) => state.notification.message)

  return !showNotification || !message ? null : (
    <div style={{width: '100%'}}
         className="common__flex common__flex-justify-content-flex-end common-relative">
      <div style={{position: 'absolute', margin: '1em'}}>
        <Notification message={message} />
      </div>
    </div>
  );
};