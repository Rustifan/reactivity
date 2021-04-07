import React from "react"
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../App/Api/agent";
import useQuery from "../../App/common/Util/hooks"

export default function RegisterSuccess()
{
    const email = useQuery().get("email") as string;

    function handleConfirmResendEmail()
    {
        agent.Account.resendEmailConfirm(email).then(()=>
        {
            toast.success("Verification email resent - Please check your email");

        })
        .catch(err=>console.log(err));

    }

    return(
        <Segment placeholder textAlign="center">
            <Header icon color="green">
                <Icon name="check"/>
                Successfully registered!
            </Header>
            <p>Please check your email (including junk email) for verification</p>
            {email &&
                (
                <>
                    <p>Didn' t receve the email? Click the bellow button to resend</p>
                    <Button content="Resend" primary onClick={handleConfirmResendEmail} size="huge"/>
                </>)
            }

        </Segment>
    )
}