import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../App/Models/Activity";
import { useStore } from "../../../App/Stores/store";
import LoadingComponent from "../../Loading";
import {v4 as uuid} from "uuid"



export default observer(function ActivityForm()
{

    const activityStore = useStore().activityStore;
    const { isLoading, addActivity, editActivity, updating, getActivity} = activityStore;
  
    const {id} = useParams<{id:string}>();
    const history = useHistory();
    const newActivity: Activity = {
        id: "",
        category: "",
        title: "",
        date: "",
        description: "",
        city: "",
        venue: ""
    }

    const [activityState, setActivity] = useState(newActivity);

    useEffect(()=>
    {
        
        if(id)
        {
            getActivity(id).then((activity)=>
            {
                setActivity(activity!);
            })
        }

    },[id, getActivity]);

    function Change(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;

        setActivity({...activityState, [name]: value});
        
    }

    if(isLoading)
    {
        return(
            <LoadingComponent/>
        )
    }


    function Submit()
    {
        if(activityState.id.length > 0)
        {
            editActivity(activityState)
            .then(()=>
            {
                history.push("/activities/"+activityState.id)             
            })
            
        }
        else
        {
            const newId = uuid();
           
            addActivity({...activityState, id: newId})
            .then(()=>
            {
                history.push("/activities/"+newId)             

            })
        }
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
            <Button floated="right" type="button" content="Cancel"/>
        </Form>
    </Segment>
    )
});