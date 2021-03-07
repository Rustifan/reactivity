import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./style.css"

import { Activity } from '../Models/Activity';
import NavBar from './Navbar';
import ActivityDashboard from '../../Features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from "uuid";

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {

    axios.get<Activity[]>("http://localhost:5000/api/activities").then((res) => {
      setActivities(res.data);

    });

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
    setActivities(activities.filter(x=>x.id!==id));
  }

  function editOrAddActivity(activity: Activity)
  {
    if(activity.id)
    {
      const newActivities = activities.filter((act)=>{return activity.id !==act.id;});
      newActivities.push(activity);
      setActivities(newActivities);
    }
    else
    {
      setActivities([...activities, {...activity,id: uuid()}]);
    }
    handleCloseForm();
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
