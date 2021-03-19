import { ErrorMessage, Form, Formik } from "formik"
import { observer } from "mobx-react-lite";
import React from "react"
import { Button, Header, Label } from "semantic-ui-react"
import MyTextInPut from "../../App/common/form/MyTextInput"
import { useStore } from "../../App/Stores/store";


export default observer(function LoginForm()
{
    const {userStore} = useStore();

    return(
        <Formik initialValues={{email: "", password: "", error: null}}
            onSubmit={(values, {setErrors})=>userStore.login(values)
                .catch(error=>setErrors({error: "Invalid email or password"}))}>
                {({handleSubmit, isSubmitting, errors})=>(
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <Header as="h2" content="Login to Reactivities" color="teal" textAlign="center"/>
                        <MyTextInPut name="email" placeholder="email"/>
                        <MyTextInPut name="password" placeholder="password" type="password"/>
                        <ErrorMessage name="error" 
                            render={()=><Label style={{marginBottom: 10}} basic color="red" content={errors.error} />}/>
                                
                       
                        <Button loading={isSubmitting} positive content="login" type="Submit" fluid/>                            
                        
                    </Form>    
                )}
            
        </Formik>
    )
});