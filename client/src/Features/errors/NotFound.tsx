import React from "react"
import { Link } from "react-router-dom"
import { Button, Header, Icon, Segment } from "semantic-ui-react"

export default function NotFound()
{
    return (
        
        <Segment placeholder>
            <Header icon>
                <Icon name="search"/>
                Nema ništa - jebiga!
            </Header>
            <Segment inline>
                <Button as={Link} to="/activities">
                    Go back to activities
                </Button>
            </Segment>
        </Segment>
        
        
    )
}