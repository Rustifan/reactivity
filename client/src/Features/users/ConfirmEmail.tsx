import React, { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../App/Api/agent";
import useQuery from "../../App/common/Util/hooks";
import { useStore } from "../../App/Stores/store";
import LoginForm from "./LoginForm";

export default function ConfirmEmail()
{
    const {modalStore} = useStore();
    const email = useQuery().get("email") as string;
    const token = useQuery().get("token") as string;

    const Status = 
    {
        Verifying: "Verifying",
        Failed: "Failed",
        Success: "Success"
    }

    
    function handleConfirmResendEmail()
    {
        agent.Account.resendEmailConfirm(email).then(()=>
        {
            toast.success("Verification email resent - Please check your email");

        })
        .catch(err=>console.log(err));
    }
    const [status, setStatus] = useState(Status.Verifying);

    useEffect(()=>
    {
        agent.Account.verifyEmail(token, email).then(()=>
        {
            setStatus(Status.Success);
        })
        .catch(()=>
        {
            setStatus(Status.Failed);
        })
    }, [Status.Failed, Status.Success, token, email]);

    function getBody()
    {
        switch(status)
        {
            case Status.Verifying:
                return <p>Verifiying...</p>
                break;
            case Status.Failed:
                return(
                    <div>
                        <p>Verification failed. You can try to send verification email again</p>
                        <Button primary onClick={handleConfirmResendEmail} size="huge" content="Resend Email"/>
                    </div>
                )
                break;
            case Status.Success:
                return(
                    <div>
                        <p>Email has been verified. You can now login</p>
                        <Button size="huge" content="login" primary onClick={()=>{modalStore.openModal(<LoginForm/>)}}/>
                    </div>
                    
                )
        }
    }

    return(
        <Segment placeholder textAlign="center" >
            <Header icon>
                <Icon name="envelope"/>            
                Email Verification
            </Header>
            <Segment.Inline>
                {getBody()}
            </Segment.Inline>
        </Segment>
    )
}