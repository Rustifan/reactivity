import React from 'react';
import "./style.css"

import NavBar from './Navbar';
import ActivityDashboard from '../../Features/activities/dashboard/ActivityDashboard';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router';
import Home from '../../Features/Home/Home';
import ActivityForm from '../../Features/activities/form/ActivityForm';
import ActivityDetails from '../../Features/activities/details/ActivityDetails';

function App() {

  const key = useLocation().key;

  
  return (
    <>
      
      <Route exact path="/" component={Home}/>

      <Route path="/(.+)" render={()=>{
        return(
        <>
        <NavBar/>
        
        <Container style={{marginTop: "7em"}}>
        <Route exact path="/activities" component={ActivityDashboard}/>
        <Route path ="/activities/:id" component={ActivityDetails}/>
        <Route key={key} path={["/createActivity", "/editActivity/:id"]} component={ActivityForm}/>
        </Container>
        </>
        )
      }}/>
      
      
      




    </>
  );
}

export default observer(App);
