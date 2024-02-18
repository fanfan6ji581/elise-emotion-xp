// import * as _ from "lodash";
import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { Container, Grid, Alert, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { getDocs, collection, query, where } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import db from "../../database/firebase";

import {
    getAttendantByUsername, createAttendant,
    //  getAttendants 
} from '../../database/attendant';
// import { getAllDataForXP } from '../../database/data';
// import { generateBalloonDataFromDataSeries } from "../../util/xp_data";

import { login } from "../../slices/attendantSlice";
import { useState, useEffect } from "react"
// import { generateBalloonData } from '../../util/xp_data'

const uiSchema = {
    "ui:options": {
        "submitButtonOptions": {
            "props": {
                "className": "btn btn-info",
            },
            "norender": false,
            "submitText": "Sign up"
        }
    }
}

const SignupPage = () => {
    const { alias } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState('');
    const [xp, setXp] = useState(null);
    const [loadingOpen, setLoadingOpen] = useState(true);

    const schema = {
        "type": "object",
        "properties": {
            "username": {
                "type": "string",
                "title": "Email"
            },
            "password": {
                "type": "string",
                "title": "Password"
            },
            "gender": {
                "type": "string",
                "title": "Gender",
                "enum": [
                    "Male",
                    "Female",
                ]
            },
            "age": {
                "type": "integer",
                "title": "Age"
            },
            "major": {
                "type": "string",
                "title": "Major"
            },
            "education": {
                "type": "string",
                "title": "Education",
                "enum": [
                    "Undergraduate",
                    "Postgraduate",
                ]
            },
        },
        required: [
            "username",
            "password",
            "gender",
            "age",
            "major",
            "education"
        ]
    };


    const onSignup = async ({ formData }, e) => {
        e.preventDefault();
        setLoadingOpen(true);

        setErrorMsg('');
        const { username, password, gender, age, major, education } = formData;

        const existingAttendant = await getAttendantByUsername(alias, username);
        if (existingAttendant) {
            setErrorMsg("This email has been registered already")
            setLoadingOpen(false);
            return;
        }

        // const data = generateBalloonData(xp)
        let attendant = Object.assign({},
            // data,
            {
                username,
                password,
                gender,
                age,
                major,
                education,
                created: Date.now(),
                xp_alias: xp.alias,
                xp_id: xp.id,
                xpConfig: xp,
            });

        // const allAttendants = await getAttendants(alias);

        // // bind data series
        // const allDataSeries = await getAllDataForXP(alias);
        // const usedDataSeriesIds = allAttendants.map(attendant => attendant.dataId)
        // const unAssignedDataSeries = _.filter(allDataSeries, (dataSeries) => {
        //     return !_.includes(usedDataSeriesIds, dataSeries.id);
        //   });

        // if (unAssignedDataSeries && unAssignedDataSeries.length > 0) {
        //     const dataSeries = _.shuffle(unAssignedDataSeries)[0];
        //     attendant.dataId = dataSeries.id;
        //     attendant = Object.assign({}, attendant,
        //         generateBalloonDataFromDataSeries(dataSeries));
        // }


        attendant = await createAttendant(attendant);
        dispatch(login(attendant));
        navigate(`/xp/${alias}/signup-wait`)
    }

    const fetchXP = async () => {
        const xpSnapshot = await getDocs(query(collection(db, "xp"), where("alias", "==", alias)));
        const xps = xpSnapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
        if (xps.length === 0) {
            setErrorMsg("Invalid XP URL")
        } else {
            setXp(xps[0]);
        }
        setLoadingOpen(false);
    }

    useEffect(() => {
        fetchXP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container maxWidth="md">
            <Grid container spacing={2} justifyContent="center">
                <Grid item sm={6}>
                    <br />
                    <br />
                    <Typography variant='h3' align="center">Sign up</Typography >
                    {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                    {xp &&
                        <Form schema={schema} uiSchema={uiSchema} onSubmit={onSignup} validator={validator} />
                    }
                </Grid>
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen}
                onClick={() => setLoadingOpen(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    )
}

export default SignupPage