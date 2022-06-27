import { memo, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

function ProtectedRoute(props) {
  const { children } = props;
  const { loggedIn } = useContext(AppContext);

  return (
    <Route exact path="/">
      {() => loggedIn ? children : <Redirect to="./sign-in" />}
    </Route>
  );
}

export default memo(ProtectedRoute);