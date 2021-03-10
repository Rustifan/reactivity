import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./style.css"

import { Activity } from '../Models/Activity';
import NavBar from './Navbar';
import ActivityDashboard from '../../Features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from "uuid";
import agent from '../Api/agent';
import LoadingComponent from '../../Features/Loading';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => 
  {

    agent.Activities.list()
    .then((res)=>
      {
      
      const activities: Activity[] = [];
      res.forEach((activity)=>
        {
          activity.date = activity.date.split("T")[0];
          activities.push(activity);
        });
      setActivities(activities);
      setLoading(false);  
    })

    
  }, [])

  function selectActivity(id: string)
  {
    const activity = activities.find((act)=>{return act.id===id});
  
    setSelectedActivity(activity);
  }

  function cancelSelection()
  {
    setSelectedActivity(undefined);
  }

  function handleOpenForm(id?: string)
  {
    
    id ? selectActivity(id) : cancelSelection();
    setOpenForm(true);
  }

  function handleCloseForm()
  {
    setOpenForm(false);
  }


  function deleteActivity(id: string)
  {
    setUpdating(true);
    agent.Activities.delete(id).then(()=>setUpdating(false));

    setActivities(activities.filter(x=>x.id!==id));
  }

  function editOrAddActivity(activity: Activity)
  {
    if(activity.id)
    {
      setUpdating(true);
      const newActivities = activities.filter((act)=>{return activity.id !==act.id;});
      newActivities.push(activity);
      agent.Activities.edit(activity).then(res=>setUpdating(false));
      
      setActivities(newActivities);
    }
    else
    {
      setUpdating(true);
      const id = uuid();
      const newActivity = {...activity, id};
      setActivities([...activities, newActivity]);
      agent.Activities.post(newActivity).then(res=>setUpdating(false));
    }
    handleCloseForm();
  }

  if(loading || updating)
  {
    return(
      <LoadingComponent content="Loading App"/>
    )
  }

  return (
    <>
      <NavBar handleOpenForm={handleOpenForm}/>
      
      <ActivityDashboard 
        activities={activities} 
        selectedActivity={selectedActivity}
        selectActivity={selectActivity} 
        cancelSelectedActivity={cancelSelection}
        openForm = {openForm}
        handleOpenForm={handleOpenForm}
        handleCloseForm={handleCloseForm}
        editOrAddActivity={editOrAddActivity}
        deleteActivity={deleteActivity}
        />





    </>
  );
}

export default App;
