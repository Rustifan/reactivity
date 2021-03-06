import { observer } from "mobx-react-lite";
import React from "react"
import { Link } from "react-router-dom";
import { Card, Icon, Image} from "semantic-ui-react";
import { Profile } from "../../App/Models/profile";
import { reduceText } from "../../App/Tools/reduceText";
import FollowButton from "./FollowButton";

interface Props
{
    profile: Profile;
}

export default observer(function ProfileCard({profile}: Props)
{
    return(
        <Card as={Link} to={"/profiles/"+profile.userName}>
            <Image src={profile.image || "/assets/Images/user.png"} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{reduceText(profile.bio? profile.bio : "")}</Card.Description>
            </Card.Content>
            <Card.Content extra >
                <Icon name="user">
                    {profile.followersCount} followers
                </Icon>
            </Card.Content>
            <FollowButton profile={profile}/>

        </Card>
    )
});
