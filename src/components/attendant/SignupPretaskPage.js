import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { Container, Grid, Alert, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { getDocs, collection, query, where, addDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import db from "../../database/firebase";
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
            }
        },
        required: [
            "username",
            "password",
            "gender",
            "age",
            "major"
        ]
    };


    const onSignup = async ({ formData }, e) => {
        e.preventDefault();
        setLoadingOpen(true);

        setErrorMsg('');
        const { username, password, gender, age, major } = formData;

        // check if username is being used
        const snapshot = await getDocs(query(collection(db, "attendant"),
            where("xp_alias", "==", alias),
            where("username", "==", username),
        ));

        const attendants = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
        if (attendants.length > 0) {
            setErrorMsg("This email has been registered already")
            return;
        }

        // const data = generateBalloonData(xp)
        const attendant = Object.assign({},
            // data,
            {
                username,
                password,
                gender,
                age,
                major,
                created: Date.now(),
                xp_alias: xp.alias,
                xp_id: xp.id,
                xpConfig: xp,
            });

        const docRef = await addDoc(collection(db, "attendant"), attendant);
        attendant.id = docRef.id;
        dispatch(login(attendant));
        navigate(`/xp/${alias}/pretask/instruction1`)
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