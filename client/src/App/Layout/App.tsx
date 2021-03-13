import React, { useEffect } from 'react';
import "./style.css"

import NavBar from './Navbar';
import ActivityDashboard from '../../Features/activities/dashboard/ActivityDashboard';
import LoadingComponent from '../../Features/Loading';
import { useStore } from '../Stores/store';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

function App() {

  const {activityStore} = useStore();

  useEffect(() => 
  {

    activityStore.loadActivities();

    
  }, [activityStore])

  

  if(activityStore.isLoading)
  {
    return(
      <LoadingComponent content="Loading App"/>
    )
  }

  
  return (
    <>
      <NavBar/>
      <Container style={{marginTop: 50}} >
      <ActivityDashboard/>
      
      </Container>
      




    </>
  );
}

export default observer(App);
