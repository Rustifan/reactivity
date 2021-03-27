import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import React from "react"
import { Button, Container, Segment } from "semantic-ui-react";
import { EditProfile, Profile } from "../../App/Models/profile";
import * as Yup from "yup" 
import MyTextInPut from "../../App/common/form/MyTextInput";
import MyTextArea from "../../App/common/form/MyTextArea";
import { useStore } from "../../App/Stores/store";

interface Props
{
    profile: Profile;
    setEdit: (edit: boolean)=>void;
}


export default observer(function EditProfileForm({profile, setEdit}: Props)
{
    const editProfile: EditProfile =
    {
        displayName: profile.displayName,
        bio: profile.bio? profile.bio : ""
    }

    const {profileStore: {loading, editProfileHandler}} = useStore();
    
    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
        bio: Yup.string()
    });

    async function handleEditProfile(editProfile: EditProfile)
    {
        await editProfileHandler(editProfile);
        setEdit(false);
        
    }

    return(
        <Container clearing>
            <Formik enableReinitialize validationSchema={validationSchema} 
            initialValues={editProfile}
            onSubmit={(values)=>handleEditProfile(values)}>
                {({handleSubmit, dirty, isSubmitting, isValid})=>(
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <MyTextInPut name="displayName" placeholder="Display name"/>
                        <MyTextArea name="bio" placeholder="Bio" rows={4}/>
                        <Button  floated="right" type="submit" loading={loading} disabled={!dirty || !isValid || isSubmitting} positive content="Edit profile"/>
                    </Form>
                )}
            </Formik>
        </Container>
    )
});