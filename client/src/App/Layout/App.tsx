import React from 'react';
import "./style.css"

import NavBar from './Navbar';
import ActivityDashboard from '../../Features/activities/dashboard/ActivityDashboard';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router';
import Home from '../../Features/Home/Home';
import ActivityForm from '../../Features/activities/form/ActivityForm';
import ActivityDetails from '../../Features/activities/details/ActivityDetails';
import TestErrors from '../../Features/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../Features/errors/NotFound';
import ServerError from '../../Features/errors/ServerError';

function App() {

  const key = useLocation().key;


  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <Route exact path="/" component={Home} />

      <Route path="/(.+)" render={() => {
        return (
          <>
            <NavBar />

            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route key={key} path={["/createActivity", "/editActivity/:id"]} component={ActivityForm} />
                <Route path="/errors" component={TestErrors} />
                <Route path="/server-error" component={ServerError}/>
                <Route component={NotFound}/>
              </Switch>
            </Container>
        </>
        )
      }}/>







          </>
        );
      }

export default observer(App);
