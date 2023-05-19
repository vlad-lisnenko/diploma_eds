import React, {FC, useEffect} from 'react';
import {DeleteAdminComponent} from "../DeleteAdminComponent/DeleteAdminComponent";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../redux/reducers/reducers";
import {deleteAdmin, fetchUsers} from "../../redux/actions/usersActions";

export const AdminsPage: FC = () => {
  const dispatch = useDispatch()
  const users = useSelector((state: State) => state.users.all)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  return !users ? null : users.length < 1 ? <UsersNotPresent /> :(
    <div className="common__height-100-width-100 common__padding-1em">
      <div className="common__flex-center">
        <div className="common__flex common__flex-column common__flex-align-items-flex-end">
          {users.map(it => <DeleteAdminComponent key={it.id} email={it.email} onDelete={() => dispatch(deleteAdmin(it.id))} />)}
        </div>
      </div>
    </div>
  );
};

const UsersNotPresent: FC = () => (
  <div className="common__flex-center">
    <div style={{fontSize: '20pt'}}>Users not present</div>
  </div>
)