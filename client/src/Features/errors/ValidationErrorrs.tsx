import React from "react"
import { Message } from "semantic-ui-react"

interface Props
{
    errors: string[] | null;
}

export default function ValidationErrors({errors}: Props)
{
    return(
        <Message error>
            <Message.List>
            {errors&&
            errors.map((error, i)=>(
                <Message.Item key={i}>{error}</Message.Item>
            ))}
            </Message.List>
        </Message>
    )
}