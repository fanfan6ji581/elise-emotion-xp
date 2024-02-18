import moment from 'moment';
import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { doc, writeBatch, } from "firebase/firestore";
import db from "../../database/firebase";
import { useEffect, useState } from "react";
import {
    Grid, Typography, Button, Backdrop, CircularProgress
} from "@mui/material";
import { Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { getAllDataForXP, addData } from '../../database/data'

const schema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "title": "Name",
        },
        "asset": {
            "type": "string",
            "title": "Asset (comma separated format)",
        },
        "volume": {
            "type": "string",
            "title": "Volume (comma separated format)",
        },
    },
    required: [
        "name", "asset", "volume",
    ]
};

const DataSeries = ({ xp }) => {
    const { alias } = useParams();
    const [datas, setDatas] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [loadingOpen, setLoadingOpen] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        asset: '',
        volume: '',
    });

    const columns = [
        { field: 'name', headerName: 'Name', width: 100 },
        { field: 'asset', headerName: 'Asset', width: 5000 },
        { field: 'volume', headerName: 'Volume', width: 4000 },
        {
            field: 'created', headerName: 'Created', width: 160,
            valueFormatter: params => moment(params?.value).format("YYYY-MM-DD HH:mm:ss")
        },
    ];

    const onAddData = async ({ formData }, e) => {
        e.preventDefault();
        if (formData.count <= 0) {
            return;
        }

        const asset = formData.asset.split(',').map(str => parseInt(str))
        const volume = formData.volume.split(',').map(str => parseInt(str))

        await addData({
            name: formData.name,
            asset,
            volume,
            xp_alias: alias,
            created: Date.now(),
        })

        // clear
        setFormData({ name: '', asset: '', volume: '' });
        await fetchDatas();
    };

    const fetchDatas = async () => {
        setDatas(await getAllDataForXP(alias));
        setLoadingOpen(false);
    };

    const onDeleteDatas = async (e) => {
        e.preventDefault();
        if (!window.confirm("Are you sure to delete?")) {
            return;
        }

        const batch = writeBatch(db);
        for (let i = 0; i < selectionModel.length; i++) {
            const ref = doc(db, "data", selectionModel[i]);
            batch.delete(ref);
        }
        await batch.commit();
        await fetchDatas();
    };

    useEffect(() => {
        fetchDatas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData])

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen}
                onClick={() => setLoadingOpen(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <DataGrid autoHeight rows={datas} columns={columns}
                        checkboxSelection
                        disableSelectionOnClick
                        onSelectionModelChange={m => setSelectionModel(m)}
                        sx={{ mb: 3 }}
                        initialState={{
                            sorting:
                            {
                                sortModel: [{
                                    field: 'created'
                                }]
                            }
                        }} />

                    <Button variant="contained" sx={{ mx: 3 }} disabled={!selectionModel.length} onClick={onDeleteDatas}><DeleteIcon /> Delete</Button>
                </Grid>
                <Grid item xs={3}>
                    <Typography>Add Data </Typography>
                    <Form schema={schema} onSubmit={onAddData} formData={formData} validator={validator} />

                </Grid>
            </Grid>
        </>
    )
}

export default DataSeries