import React, { lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

const UserListRouter = () => {
  const {path} = useRouteMatch()
  return (
  <Switch>
    <Route path={path} exact component={lazy(() => import(`./UserList`))}/>
    <Route path={`${path}/edit-profile/:userId`} component={lazy(() => import(`./EditProfile`))} />
  </Switch>)
}

export default UserListRouter;