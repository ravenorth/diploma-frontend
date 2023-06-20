import { Redirect, Route, Switch } from 'react-router-dom';
import styles from "./App.module.css"
import { MainLayout } from './main/MainLayout';
import '../../common/css/variables.css';
import { Router } from '../../core/router/router';
import { AuthLayout } from './auth/AuthLayout';

function App() {
  return (
    <div className={styles.content}>
      <Switch>
          <Redirect exact from={'/'} to={Router.Auth.url()}/>
          <Route exact path={[Router.Auth.url()]} >
              <AuthLayout />
          </Route>
          <Route path={[Router.Main.url()]}>
              <MainLayout />
          </Route>
      </Switch>
    </div>
  );
}

export {
  App,
}