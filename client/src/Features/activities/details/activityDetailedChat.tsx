import { Formik, Form, Field, FieldProps } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Segment, Header, Comment, Button, Loader} from 'semantic-ui-react'
import MyTextArea from '../../../App/common/form/MyTextArea'
import { useStore } from '../../../App/Stores/store'
import * as Yup from "yup"

interface Props
{
    activityId: string;
}

export default observer(function ActivityDetailedChat({activityId}: Props) {
    const {commentStore} = useStore();

    useEffect(()=>
    {
        if(activityId)
        {
            commentStore.createHubConnection(activityId);
        }
        return ()=>
        {
            commentStore.clearComments();
        }
    }, [activityId, commentStore])

    const validationScheema = Yup.object(
    {
        body: Yup.string().required()
    });

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    {commentStore.comments.map(comment=>(
                        <Comment key={comment.id}>
                        <Comment.Avatar src={comment.image || '/assets/Images/user.png'}/>
                        <Comment.Content>
                            <Comment.Author as={Link} to={"/profiles/"+comment.username}>{comment.displayName}</Comment.Author>
                            <Comment.Metadata>
                                <div>{comment.createdAt}</div>
                            </Comment.Metadata>
                            <Comment.Text style={{whiteSpace: "pre-wrap"}}>{comment.body}</Comment.Text>
                        </Comment.Content>
                    </Comment>
                    ))}
                    

                    <Formik onSubmit={(values, {resetForm})=>commentStore.addComment(values)
                        .then(()=>resetForm())}
                            initialValues={{body: ""}}
                            validationSchema={validationScheema}
                    >
                        {({isSubmitting, isValid, handleSubmit})=>(
                            <Form className="ui form">
                            <Field name="body">
                                {(props: FieldProps)=>(
                                    <div style={{position:"relative"}}>
                                        <Loader active={isSubmitting}/>
                                        <textarea
                                            placeholder="Enter your comment (Enter to submit, Enter + Shift for new line) "
                                            rows={2}
                                            {...props.field}
                                            onKeyPress={e=>{
                                                if(e.key == "Enter" && e.shiftKey)
                                                {
                                                    return;
                                                }
                                                if(e.key == "Enter" && !e.shiftKey)
                                                {
                                                    e.preventDefault();
                                                    isValid && handleSubmit();
                                                }
                                            }}
                                        />
                                    </div>

                                )}
                            </Field>
                        </Form>
                        )}
                    </Formik>
                    
                </Comment.Group>
            </Segment>
        </>

    )
})

