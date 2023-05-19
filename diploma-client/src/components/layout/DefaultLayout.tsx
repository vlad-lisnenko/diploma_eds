import React, {FC} from 'react';
import {CurrentDictionary} from "../CurrentDictionary/CurrentDictionary";
import {LanguagesAlphabets} from '../LanguagesAlphabets/LanguagesAlphabets';
import {Header} from "../Header/Header";
import {NotificationPopup} from "../NotificationPopup/NotificationPopup";
import {Button} from "../controls/Button";
import {State} from "../../redux/reducers/reducers";
import {useDispatch, useSelector} from "react-redux";
import {dialogActions} from "../../redux/actions/dialogActions";

type Props = {
  render: () => JSX.Element
  hideDictionaryComponents?: boolean
}

export const DefaultLayout: FC<Props> = props => {
  return (
    <div className="default-layout common__flex common__flex-column" style={{height: '100%'}}>
      <Dialog />
      <div>
        <Header/>
      </div>
      <NotificationPopup/>
      {props.hideDictionaryComponents ? null :
        <>
          <div className="common__flex-center common__padding-1em">
            <CurrentDictionary />
          </div>
          <div className="common__flex-center">
            <LanguagesAlphabets />
          </div>
        </>
      }
      <div className="default-layout__content common-flex-1-1-auto" style={{width: '100%'}}>
        {props.render()}
      </div>
      <div className="default-layout__footer" style={{padding: '3em 0'}}>

      </div>
    </div>
  );
};


const Dialog:FC = () => {
  const showDialog = useSelector((state: State) => state.dialog.dialogVisible)
  const dispatch = useDispatch()

  return !showDialog ? null : (
    <div style={{
      position: "absolute",
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1
    }}>
      <div className="common__flex-center common__flex-align-items-center" style={{height: '100%'}}>
        <div className="common__padding-1em" style={{backgroundColor: '#fff', width: '40%', borderRadius: '7px'}}>
          <div style={{padding: '1rem', fontSize: '2em'}}>Are you sure that you want to create language?</div>
          <div className="common__padding-1em">After creation you will not be able to edit language field, but you will be able to edit alphabet field.</div>
          <div style={{padding: '1em'}}>
            <div className="common__flex">
              <div style={{paddingRight: '1em'}}>
                <Button value="Yes" onClick={() => {
                  dispatch(dialogActions.hideDialog())
                  dispatch(dialogActions.dialogResultYes())
                }} />
              </div>
              <div style={{paddingLeft: '1em'}}>
                <Button value="No" color="secondary" onClick={() => {
                  dispatch(dialogActions.hideDialog())
                  dispatch(dialogActions.dialogResultNo())
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}