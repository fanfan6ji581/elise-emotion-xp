import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { Grid, Alert, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../slices/adminSlice";
import { useNavigate } from "react-router-dom"
import React, { useState } from "react";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState('');

    const schema = {
        "type": "object",
        "properties": {
            "username": {
                "type": "string"
            },
            "password": {
                "type": "string"
            }
        },
        required: [
            "username",
            "password"
        ]
    };

    const uiSchema = {
        "password": {
            "ui:widget": "password"
        },
        "ui:options": {
            "submitButtonOptions": {
                "props": {
                    "className": "btn btn-info",
                },
                "norender": false,
                "submitText": "Login"
            }
        }
    }

    const onSubmit = ({ formData }, e) => {
        e.preventDefault();
        setErrorMsg('');
        const { username, password } = formData;
        if (username === 'elise' && password === 'elise') {
            dispatch(login(username));
            navigate(`/admin/dashboard`)
        } else {
            setErrorMsg('Invalid login');
        }
    }
    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={8} sm={6} md={4} lg={3}>
                <Typography variant='h3' align="center">Admin Login</Typography >
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} validator={validator} />

            </Grid>
        </Grid>
    )
}

export default LoginPage