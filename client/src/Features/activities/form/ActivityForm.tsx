import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import { Button, Segment, Header } from "semantic-ui-react";
import {  ActivityFormValues } from "../../../App/Models/Activity";
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
import { Link } from "react-router-dom";


export default observer(function ActivityForm()
{

    const activityStore = useStore().activityStore;
    const { isLoading, addActivity, editActivity,  getActivity} = activityStore;
  
    const {id} = useParams<{id:string}>();
    const history = useHistory();


    const [activityState, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

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
                setActivity(new ActivityFormValues(activity));
            })
        }

    },[id, getActivity]);

   function handleSubmitForm(activity: ActivityFormValues)
   {
        if(!activity.id)
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
        <Formik validationSchema={validationSchema} enableReinitialize initialValues={activityState} onSubmit={values=>{handleSubmitForm(new ActivityFormValues(values))}}>
            {({ handleSubmit, dirty, isSubmitting, isValid})=>(
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                    <Header content="Activity Details" sub color="teal"/>
                    
                    <MyTextInPut name="title" placeholder="Title"/>
                    <MyDateInput 
                    placeholderText="Date" 
                    name="date"
                    showTimeSelect
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa" />
                    <MyTextArea rows={2} placeholder="Description" name="description" />
                    <MySelectInput options={categoryOptions} placeholder="Category" name="category" />
                    <Header content="Location Details" sub color="teal"/>

                    <MyTextInPut placeholder="Venue" name="venue" />
                    <MyTextInPut placeholder="City" name="city" />
                    <Button disabled={!dirty || !isValid || isSubmitting} loading={isSubmitting} positive type="submit" floated="right" content="Submit" />
                    <Button as={Link} to="/activities" floated="right" type="button" content="Cancel"/>
                </Form>
            )

            }
        </Formik>
        
    </Segment>
    )
});