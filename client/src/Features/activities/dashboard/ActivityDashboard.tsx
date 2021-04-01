import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { useEffect } from "react"
import {Container, Grid, GridColumn, Loader } from "semantic-ui-react"
import { useStore } from "../../../App/Stores/store"
import LoadingComponent from "../../Loading"
import ActivityFilters from "./ActivityFilters"
import ActivityList from "./ActivityList"
import "react-calendar/dist/Calendar.css"
import { PagingParams } from "../../../App/Models/pagination"
import InfiniteScroll from "react-infinite-scroller"


export default observer(function ActivityDashboard()
{
    const {activityStore} = useStore();
    const {loadActivities,  setPagingParams, pagination} = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleNext()
    {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage+1))
        loadActivities().then(()=>setLoadingNext(false));
    }

    useEffect(() => 
    {

        if(activityStore.activityMap.size <= 1)
        {
            activityStore.loadActivities();

        }

        
    }, [activityStore])

    

    if(activityStore.isLoading && !loadingNext)
    {
        return(
        <LoadingComponent content="Loading Activities..."/>
        )
    }
    

    return(
    <Container style={{marginTop: "7em"}}>
    
    <Grid>
        <Grid.Column width="10">
            <InfiniteScroll 
                pageStart={0}
                loadMore={handleNext}
                hasMore={!loadingNext && !!pagination && pagination?.currentPage<pagination?.totalPages}
                initialLoad={false}
                >
                <ActivityList/>

            </InfiniteScroll>
            
        </Grid.Column>
        <GridColumn width="6">
            <ActivityFilters/>
        </GridColumn>
        <Grid.Column width="10">
            <Loader active={loadingNext}/>
        </Grid.Column>
    </Grid>
    
   </Container>
)
});

