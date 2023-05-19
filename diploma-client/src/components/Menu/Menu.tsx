import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {Typography} from "@material-ui/core";
import './Menu.scss'
import {Secured} from "../Secured";
import {Authority} from "../../types/Authority";
import {useToken} from "../../hooks/useToken";

export const Menu: FC = () => {
  const authInfo = useToken()
  const menuElements = [
    {
      title: 'Main page',
      ref: '/'
    },
    {
      title: 'Create article',
      ref: '/create',
      secured: true
    },
    {
      title: 'Administrators',
      ref: '/admins',
      secured: true,
      authorities: [Authority.ROOT]
    },
    {
      title: 'Add administrator',
      ref: '/create/admin',
      secured: true,
      authorities: [Authority.ROOT]
    },
    {
      title: 'Change password',
      ref: '/change-password',
      secured: true
    },
    {
      title: 'Languages',
      ref: '/languages',
      secured: true
    },
    {
      title: 'Add language',
      ref: '/languages/add',
      secured: true
    },
    {
      title: 'Upload file',
      ref: '/upload',
      secured: true
    }
  ]

  return (
    <div className="common__flex common__flex-center" style={{width: '100%'}}>
      {menuElements.map(it =>
        it.secured ?
          <Secured authorities={it.authorities}>
            <div style={{padding: '0 0.7em'}}>
              <Link to={it.ref} className="menu__link">
                <Typography variant="h6">
                  {it.title}
                </Typography>
              </Link>
            </div>
          </Secured>
          :
          <div style={{padding: '0 0.7em'}}>
            <Link to={it.ref} className="menu__link">
              <Typography variant="h6">
                {it.title}
              </Typography>
            </Link>
          </div>
      )}
      <div className="common__flex-justify-content-flex-end common-flex-1-1-auto">
        <Secured>
          <div style={{padding: '0 0.7em'}}>
            <Link to="/logout" className="menu__link">
              <Typography variant="h6">
                Logout
              </Typography>
            </Link>
          </div>
        </Secured>
        {authInfo.token ? null :
          <div style={{padding: '0 0.7em'}}>
            <Link to="/login" className="menu__link">
              <Typography variant="h6">
                Login
              </Typography>
            </Link>
          </div>
        }
      </div>
    </div>
  );
};