import { observer } from "mobx-react-lite";
import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";

export default observer(function NavBar()
{

    return(
    
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} exact to="/">
                    <img src="/assets/Images/logo.png" alt="logo" style={{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to="/activities" name="Activities"/>
                <Menu.Item>
                    <Button as={NavLink} to="/createActivity" positive content="Create activity"/>
                </Menu.Item>
            </Container>
        </Menu>
    )
});