import { observer } from "mobx-react-lite"
import React from "react"
import { useEffect } from "react"
import { Container, Grid, GridColumn } from "semantic-ui-react"
import { useStore } from "../../../App/Stores/store"
import LoadingComponent from "../../Loading"
import ActivityFilters from "./ActivityFilters"
import ActivityList from "./ActivityList"
import "react-calendar/dist/Calendar.css"


export default observer(function ActivityDashboard()
{
    const {activityStore} = useStore();

    useEffect(() => 
    {

        if(activityStore.activityMap.size <= 1)
        {
            activityStore.loadActivities();

        }

        
    }, [activityStore])

    

    if(activityStore.isLoading)
    {
        return(
        <LoadingComponent content="Loading Activities..."/>
        )
    }
    

    return(
    <Container style={{marginTop: "7em"}}>
    
    <Grid>
        <Grid.Column width="10">
            <ActivityList/>
        </Grid.Column>
        <GridColumn width="6">
            <ActivityFilters/>
        </GridColumn>
    </Grid>
    
   </Container>
)
});

