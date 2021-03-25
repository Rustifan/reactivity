import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Header } from "semantic-ui-react";
import { useStore } from "../../../App/Stores/store";
import ActivityListItem from "./ActivityListItem";

export default observer(function ActivityList() {

    const { activityStore } = useStore();
    const { groupActivtiesByDate } = activityStore;

    return (
        <>

            {groupActivtiesByDate.map(([date, activities]) =>

            (<Fragment key={date} >
                <Header sub color="teal">
                    {date}
                </Header>


                {activities.map(activity =>

                    (<ActivityListItem key={activity.id} activity={activity} />)


                )}
            </Fragment>)
            )}


        </>
    )
})