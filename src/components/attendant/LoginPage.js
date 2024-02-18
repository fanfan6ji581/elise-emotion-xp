import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { Grid, Alert, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { login, logout } from "../../slices/attendantSlice";
import { getAttendantByLogin, updateAttendant } from "../../database/attendant";
import { getData } from "../../database/data";
import { generateBalloonDataFromDataSeries } from "../../util/xp_data";

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

const LoginPage = () => {
    const { alias, username, password } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState('');
    const [loadingOpen, setLoadingOpen] = useState(false);

    const schema = {
        "type": "object",
        "properties": {
            "username": {
                "type": "string",
                "default": username,
                "title": "Email"
            },
            "password": {
                "type": "string",
                "default": password,
                "title": "Password"
            }
        },
        required: [
            "username",
            "password"
        ]
    };


    const onLogin = async ({ formData }, e) => {
        e.preventDefault();
        setLoadingOpen(true);
        setErrorMsg('');
        const { username, password } = formData;
        let attendant = await getAttendantByLogin(alias, username, password);
        if (!attendant) {
            setLoadingOpen(false);
            setErrorMsg("Invalid login")
            return;
        }

        if (!attendant.xpData && attendant.dataId) {
            // initialize xp data during login
            const dataSeries = await getData(attendant.dataId);
            const data = generateBalloonDataFromDataSeries(dataSeries);
            attendant = Object.assign({}, attendant, data);
            await updateAttendant(attendant.id, data);
        }

        dispatch(login(attendant));
        await timeout(500); //for 1 sec delay

        navigate(`/xp/${alias}/instruction`)
    }

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    useEffect(() => {
        dispatch(logout());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen}
                onClick={() => setLoadingOpen(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={8} sm={6} md={4} lg={3}>
                    <br />
                    <br />
                    <Typography variant='h3' align="center">Guest Login</Typography >
                    {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                    <Form schema={schema} uiSchema={uiSchema} onSubmit={onLogin} validator={validator} />
                </Grid>
            </Grid>

        </>
    )
}

export default LoginPage