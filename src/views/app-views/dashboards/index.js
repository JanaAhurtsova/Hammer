import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const Dashboards = ({ match }) => {
  return(
  <Suspense fallback={<Loading cover="content"/>}>
    <Switch>
      <Route path={`${match.url}/planner`} component={lazy(() => import(`./planner`))} />
      <Redirect from={`${match.url}`} to={`${match.url}/planner`} />
    </Switch>
  </Suspense>
)};

export default Dashboards;