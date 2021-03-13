import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../App/Models/Activity";
import { useStore } from "../../../App/Stores/store";



export default observer(function ActivityForm()
{

    const activityStore = useStore().activityStore;
    const {selectedActivity: activity, handleCloseForm, editOrAddActivity, updating} = activityStore;

    const newActivity: Activity = {
        id: "",
        category: "",
        title: "",
        date: "",
        description: "",
        city: "",
        venue: ""
    }

    const [activityState, setActivity] = useState(activity || newActivity);
    //eslint-disable-next-line
    useEffect(()=>{setActivity(activity || newActivity)},[activity]);

    function Change(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;

        setActivity({...activityState, [name]: value});
        
    }

    function Submit()
    {
        editOrAddActivity(activityState);
    }

    return(
    <Segment clearing>
        <Form onSubmit={Submit}>
            <Form.Input placeholder="Title" name="title" value={activityState.title} onChange={Change}/>
            <Form.Input placeholder="Date" type="date" name="date" value={activityState.date} onChange={Change}/>
            <Form.TextArea placeholder="Description" name="description" value={activityState.description} onChange={Change}/>
            <Form.Input placeholder="Category" name="category" value={activityState.category} onChange={Change}/>
            <Form.Input placeholder="Venue" name="venue" value={activityState.venue} onChange={Change}/>
            <Form.Input placeholder="City" name="city" value={activityState.city} onChange={Change}/>
            <Button loading={updating} positive type="submit" floated="right" content="Submit" />
            <Button onClick={handleCloseForm} floated="right" type="button" content="Cancel"/>
        </Form>
    </Segment>
    )
});