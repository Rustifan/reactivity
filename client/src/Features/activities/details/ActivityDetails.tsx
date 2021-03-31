import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../App/Stores/store";
import LoadingComponent from "../../Loading";
import ActivityDetailedChat from "./activityDetailedChat";
import ActivityDetailedHeader from "./activityDetailedHeader";
import ActivityDetailedInfo from "./activityDetailedInfo";
import ActivityDetailedSidebar from "./activityDetailedSidebar";


export default observer(function ActivityDetails() {
    
    const {id} = useParams<{id: string}>();
    const {activityStore} = useStore();
    const {selectedActivity: activity, isLoading, getActivity, clearSelectedActivity} = activityStore;
    useEffect(()=>
    {   if(id)
        {
            getActivity(id);

        }
        return clearSelectedActivity;
    }, [getActivity,id, clearSelectedActivity])
    

    if(!activity || isLoading){return (<LoadingComponent/>);}

    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivityDetailedChat activityId={activity.id}/>
            </Grid.Column>
            <Grid.Column width="6">
                <ActivityDetailedSidebar activity={activity}/>
            </Grid.Column>
        </Grid>
    )
});