import React from "react";
import { Button, Card, Icon, Image } from "semantic-ui-react";
import { Activity } from "../../../App/Models/Activity";

interface Props {
    activity: Activity;
    cancelSelectedActivity: ()=>void;
    handleOpenForm: (id?: string)=>void;
    handleCloseForm: ()=>void;
}

export default function ActivityDetails({ activity, cancelSelectedActivity, handleOpenForm, handleCloseForm }: Props) {
    return (
        <Card fluid>
            {   <Image src={`/assets/images/categoryImages/${activity.category}.jpg`} />}
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
                    <Button basic color="grey" content="Cancel" onClick={()=>{cancelSelectedActivity(); handleCloseForm();}}/>

                </Button.Group>
            </Card.Content>
        </Card>
    )
}