import { observer } from "mobx-react-lite"
import React from "react"
import { Container, Grid, GridColumn } from "semantic-ui-react"
import { useStore } from "../../../App/Stores/store"
import ActivityDetails from "../details/ActivityDetails"
import ActivityForm from "../form/ActivityForm"
import ActivityList from "./ActivityList"



export default observer(function ActivityDashboard()
{
    const {activityStore} = useStore();
    const {selectedActivity, openForm} = activityStore;

    return(
    <Container style={{marginTop: "7em"}}>
    
    <Grid>
        <Grid.Column width="10">
            <ActivityList/>
        </Grid.Column>
        <GridColumn width="6">
            {selectedActivity &&
            <ActivityDetails/>
            }
            {
                openForm&&
                <ActivityForm/>
                
            }
        </GridColumn>
    </Grid>
    
   </Container>
)
});

