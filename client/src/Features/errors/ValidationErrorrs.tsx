import React from "react"
import { Message } from "semantic-ui-react"

interface Props
{
    errors: any;
}

export default function ValidationErrors({errors}: Props)
{
    return(
        <Message error>
            <Message.List>
            {errors&&
            errors.map((error: any, i: any)=>(
                <Message.Item key={i}>{error}</Message.Item>
            ))}
            </Message.List>
        </Message>
    )
}