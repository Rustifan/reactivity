import { observer } from "mobx-react-lite";
import React, { useState } from "react"
import { Button, Container, Grid, Header, Tab } from "semantic-ui-react"
import { Profile } from "../../App/Models/profile";
import { useStore } from "../../App/Stores/store"
import EditProfileForm from "./EditProfileForm";

interface Props
{
    profile: Profile;
}

export default observer(function ProfileAbout({profile}: Props) {

    const {profileStore: {isCurrentUser}} = useStore();
    
    const [edit, setEdit] = useState(false);


    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="user" content="About"/>
                    {isCurrentUser && 
                    <Button floated="right" content={edit? "Cancel" : "Edit"} basic onClick={()=>setEdit(!edit)}/>
                    }
                    
                </Grid.Column>
                <Grid.Column width={16}>
                {edit ? (
                        <EditProfileForm profile={profile} setEdit={setEdit}/>           
                    ): (
                        <Container>
                            <p style={{whiteSpace: "pre-wrap"}}>{profile.bio}</p>
                        </Container>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
});