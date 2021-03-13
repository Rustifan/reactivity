import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../Stores/store";



export default observer(function NavBar()
{
    const {activityStore} = useStore();    
    const {handleOpenForm} = activityStore;

    return(
    
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item>
                    <img src="/assets/Images/logo.png" alt="logo" style={{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities"/>
                <Menu.Item>
                    <Button onClick={()=>handleOpenForm()} positive content="Create activity"/>
                </Menu.Item>
            </Container>
        </Menu>
    )
});