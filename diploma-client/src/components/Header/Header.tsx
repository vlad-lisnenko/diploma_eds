import makeStyles from '@material-ui/core/styles/makeStyles';
import React, {FC} from 'react';
import {AppBar, createStyles, Theme, Toolbar} from "@material-ui/core";
import {Menu} from '../Menu/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0
    }
  }),
);



export const Header: FC = () => {
  const classes = useStyles()

  return (
    <AppBar position="static">
      <Toolbar classes={classes}>
        <div style={{padding: '0 0.7em', width: '100%'}}>
          <Menu/>
        </div>
      </Toolbar>
    </AppBar>
  );
};