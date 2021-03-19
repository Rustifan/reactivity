import { ErrorMessage, Form, Formik } from "formik"
import { observer } from "mobx-react-lite";
import React from "react"
import { Button, Header } from "semantic-ui-react"
import MyTextInPut from "../../App/common/form/MyTextInput"
import { useStore } from "../../App/Stores/store";
import * as Yup from "yup"
import ValidationErrors from "../errors/ValidationErrorrs";

export default observer(function RegisterForm()
{
    const {userStore} = useStore();
 
    return(
        <Formik initialValues={{displayName:"", username: "", email: "", password: "", error: null}}
            onSubmit={(values, {setErrors})=>userStore.register(values)
                .catch(error=>setErrors({error}))}
                validationSchema={Yup.object(
                    {
                        displayName: Yup.string().required(),
                        username: Yup.string().required(),
                        email: Yup.string().required().email(),
                        password: Yup.string().required()
                    })}>
                {({handleSubmit, isSubmitting, errors, isValid, dirty})=>(
                    <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                        <Header as="h2" content="Sign up to Reactivities" color="teal" textAlign="center"/>
                        <MyTextInPut name="displayName" placeholder="displayName"/>
                        <MyTextInPut name="username" placeholder="username"/>
                        <MyTextInPut name="email" placeholder="email"/>
                        <MyTextInPut name="password" placeholder="password" type="password"/>
                        <ErrorMessage name="error" 
                            render={()=><ValidationErrors errors={errors.error}/>}/>
                                
                       
                        <Button disabled={!isValid || !dirty || isSubmitting} loading={isSubmitting} positive content="Register" type="Submit" fluid/>                            
                        
                    </Form>    
                )}
            
        </Formik>
    )
});