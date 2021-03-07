import React from "react"
import { Container, Grid, GridColumn, List } from "semantic-ui-react"
import {Activity} from "../../../App/Models/Activity"
import ActivityDetails from "../details/ActivityDetails"
import ActivityForm from "../form/ActivityForm"
import ActivityList from "./ActivityList"

interface Props
{
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string)=>void;
    cancelSelectedActivity: ()=>void;
    openForm: boolean;
    handleOpenForm: (id? : string)=>void;
    handleCloseForm: ()=>void;
    editOrAddActivity: (activity: Activity)=>void;
    deleteActivity: (id: string)=>void;
}

export default function ActivityDashboard({activities, selectActivity, 
    selectedActivity, cancelSelectedActivity, openForm,
    handleCloseForm, handleOpenForm, editOrAddActivity, deleteActivity}: Props)
{
    return(
    <Container style={{marginTop: "7em"}}>
    
    <Grid>
        <Grid.Column width="10">
            <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity}/>
        </Grid.Column>
        <GridColumn width="6">
            {selectedActivity &&
            <ActivityDetails activity={selectedActivity} cancelSelectedActivity={cancelSelectedActivity}
                handleOpenForm={handleOpenForm} handleCloseForm={handleCloseForm}/>
            }
            {
                openForm&&
                <ActivityForm activity={selectedActivity} handleCloseForm={handleCloseForm}
                    editOrAddActivity={editOrAddActivity}/>
                
            }
        </GridColumn>
    </Grid>
    
   </Container>
)
}