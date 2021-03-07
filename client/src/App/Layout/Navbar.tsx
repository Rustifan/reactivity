import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface Props
{
    handleOpenForm: (id?: string)=>void;
}

export default function NavBar({handleOpenForm}: Props)
{
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
}