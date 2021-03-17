import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import { Button, Segment, Header } from "semantic-ui-react";
import { Activity } from "../../../App/Models/Activity";
import { useStore } from "../../../App/Stores/store";
import LoadingComponent from "../../Loading";
import {v4 as uuid} from "uuid"
import { Formik, Form} from "formik";
import * as Yup from "yup" 
import MyTextInPut from "../../../App/common/form/MyTextInput";
import MyTextArea from "../../../App/common/form/MyTextArea";
import MySelectInput from "../../../App/common/form/MySelectInput";
import { categoryOptions } from "../../../App/common/options/categoryOptions";
import MyDateInput from "../../../App/common/form/MyDateInput";


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
        date: null,
        description: "",
        city: "",
        venue: ""
    }

    const [activityState, setActivity] = useState(newActivity);

    const validationSchema = Yup.object({
        title: Yup.string().required(),
        category: Yup.string().required(),
        description: Yup.string().required(),

        date: Yup.string().required("Date is required").nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required()
    })
       

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

   function handleSubmitForm(activity: Activity)
   {
        if(activity.id.length===0)
        {
            let newActivity = {...activity, id: uuid()};
            addActivity(newActivity).then(()=>history.push("/activities/"+newActivity.id));
        }
        else
        {
            editActivity(activity).then(()=>history.push("/activities/"+activity.id));
        }
   }

    if(isLoading)
    {
        return(
            <LoadingComponent/>
        )
    }


   
    return(
    <Segment clearing>
        <Formik validationSchema={validationSchema} enableReinitialize initialValues={activityState} onSubmit={values=>{handleSubmitForm(values)}}>
            {({ handleSubmit, dirty, isSubmitting, isValid})=>(
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="false">
                    <Header content="Activity Details" sub color="teal"/>
                    
                    <MyTextInPut name="title" placeholder="Title"/>
                    <MyDateInput 
                    placeholderText="Date" 
                    name="date"
                    showTimeSelect
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa" />
                    <Header content="Location Details" sub color="teal"/>
                    <MyTextArea rows={2} placeholder="Description" name="description" />
                    <MySelectInput options={categoryOptions} placeholder="Category" name="category" />
                    <MyTextInPut placeholder="Venue" name="venue" />
                    <MyTextInPut placeholder="City" name="city" />
                    <Button disabled={!dirty || !isValid || isSubmitting} loading={updating} positive type="submit" floated="right" content="Submit" />
                    <Button floated="right" type="button" content="Cancel"/>
                </Form>
            )

            }
        </Formik>
        
    </Segment>
    )
});