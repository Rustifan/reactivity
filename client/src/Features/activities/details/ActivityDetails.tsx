import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../App/Stores/store";
import LoadingComponent from "../../Loading";


export default observer(function ActivityDetails() {
    
    const {id} = useParams<{id: string}>();
    const {activityStore} = useStore();
    const {selectedActivity: activity, isLoading, getActivity} = activityStore;
    useEffect(()=>
    {   if(id)
        {
            getActivity(id);

        }
    }, [getActivity,id])
    

    if(!activity || isLoading){return (<LoadingComponent/>);}

    return (
        <Card fluid>
            {   <Image src={`/assets/Images/categoryImages/${activity.category}.jpg`} />}
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths="2">
                    <Button basic color="blue" content="Edit" as={Link} to={"/editActivity/"+activity.id}  />
                    <Button basic color="grey" content="Cancel" />

                </Button.Group>
            </Card.Content>
        </Card>
    )
});