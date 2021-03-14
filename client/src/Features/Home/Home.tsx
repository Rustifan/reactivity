import React from "react"
import { Link } from "react-router-dom"
import { Container } from "semantic-ui-react"

export default function Home()
{
    return(
        <Container style={{marginTop: "7em"}}>
            <h1>Doma</h1>
            <h2>go to <Link to="/activities">activities</Link></h2>
        </Container>
    )
}