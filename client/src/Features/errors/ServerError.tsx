import { observer } from "mobx-react-lite";
import React from "react"
import { Container, Header, Segment } from "semantic-ui-react";
import { CommonStore } from "../../App/Stores/CommonStore";
import { useStore } from "../../App/Stores/store"

export default observer(function ServerError() {
    const { commonStore } = useStore();
    return (
        <Container>
            <Header as="h1" content="server error" />
            <Header color="red" sub as="h5" content={commonStore.error?.message} />
            {commonStore.error?.details &&
                <Segment>
                    <Header as="h5" color="teal" content="Stack trace" />
                    <code style={{marginTop: 10}}>{commonStore.error.details}</code>
                </Segment>
            }
        </Container>
    )
});