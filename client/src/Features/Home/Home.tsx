import React from "react"
import { Link } from "react-router-dom"
import { Container, Header, Segment, Image, Button } from "semantic-ui-react"

export default function Home() {
    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as="h1" inverted>
                    <Image size="massive" src="/assets/Images/logo.png" alt="logo" style={{ marginBottom: 12 }} />
                    Reactivities
                </Header>
                <Header as="h2" inverted content ="Welcome to Reactivities"/>
                <Button size="huge" inverted as={Link} to="/activities">
                    Take me to Activities
                </Button>

            </Container>
        </Segment>
    )
}