import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../App/Stores/store";
import LoadingComponent from "../../Loading";


export default observer(function ActivityDetails() {
    
    const {activityStore} = useStore();
    const {selectedActivity: activity, handleOpenForm, cancelSelection, handleCloseForm} = activityStore;
    if(!activity){return (<LoadingComponent/>);}

    return (
        <Card fluid>
            {   <Image src={`./assets/Images/categoryImages/${activity.category}.jpg`} />}
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
                    <Button basic color="blue" content="Edit" onClick={()=>handleOpenForm(activity.id)} />
                    <Button basic color="grey" content="Cancel" onClick={()=>{cancelSelection(); handleCloseForm();}}/>

                </Button.Group>
            </Card.Content>
        </Card>
    )
});