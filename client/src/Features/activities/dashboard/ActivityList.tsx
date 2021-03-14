import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../App/Stores/store";

export default observer(function ActivityList() {
    
    const {activityStore}=useStore();
    const {updating, deletingId, activitiesByDate, deleteActivity}= activityStore;

    const activities = activitiesByDate();
    return (
        <Segment>
            
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                    <Item.Content>

                        <Item.Header as="a">{activity.title}</Item.Header>
                        <Item.Meta>{activity.date}</Item.Meta>
                        <Item.Description>
                            <div>{activity.description}</div>
                            <div>{activity.city}, {activity.venue}</div>
                        </Item.Description>
                        <Item.Extra>
                            <Button floated="right" content="View" color="blue" as={Link} to={`/activities/${activity.id}`} />
                            <Button loading = {updating && deletingId===activity.id} floated="right" content="Delete" color="red" onClick={()=>deleteActivity(activity.id)}/>
                            
                            <Label basic content={activity.category} />
                        </Item.Extra>
                    </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
});