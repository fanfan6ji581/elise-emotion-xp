import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { updatePretask } from "../../database/pretask";

const schema = {
    "title": "Configure pretask",
    "description": "",
    "type": "object",
    "required": [

    ],
    "properties": {
        "totalQty": {
            "type": "number",
            "title": "Total number of balls",
            "default": "100"
        },
        "ballAQty": {
            "type": "number",
            "title": "Total number of ball A. e.g. n = 50",
            "default": "50"
        },
        "ballALowerLimit": {
            "type": "number",
            "title": "Lower limit for ball A. e.g. n = 10",
            "default": "10"
        },
        "ballAUpperLimit": {
            "type": "number",
            "title": "Upper limit of ball A. e.g. n = 60",
            "default": "60"
        },
        "repeatLimit": {
            "type": "integer",
            "title": "N, how many reset to terminate the trails",
            "default": 5
        },
        "missLimit": {
            "type": "integer",
            "title": "when missed this many times, terminate the pretask",
            "default": 5
        },
        "x": {
            "type": "integer",
            "title": "x",
            "default": 1
        },
        "ballAWin": {
            "type": "number",
            "title": "$ earned when winning bet on ball A",
            "default": "4"
        },
        "ballALose": {
            "type": "number",
            "title": "$ losed when losing bet on ball A",
            "default": "-4"
        },
        "ballBWin": {
            "type": "number",
            "title": "$ earned when winning bet on ball B",
            "default": "3"
        },
        "ballBLose": {
            "type": "number",
            "title": "$ losed when losing bet on ball B",
            "default": "-5"
        },
        "missLose": {
            "type": "integer",
            "title": "$ losed when missing a trial",
            "default": -1
        },
        "afkTimeout": {
            "type": "integer",
            "title": "Decision stage, milliseconds that allow attendant to do decision, e.g. 2000 ms = 2 sec",
            "default": 4000
        },
        "percentageEarning": {
            "type": "integer",
            "title": "Percentage of trials for earnings, e.g. use 50 for 50%, 100 for 100%",
            "default": 50
        },
        "outcomeShowTime": {
            "type": "integer",
            "title": "Outcome stage, millisecond showing the output result, 2000 ms = 2 sec, default is 0",
            "default": 0
        },
        "choiceDelay": {
            "type": "integer",
            "title": "Delay in milliseconds after making a choice, 1000 ms = 1 sec",
            "default": 20
        },
        "trainingSessionSeconds": {
            "type": "integer",
            "title": "Seconds of how long the training session last (default is 120 seconds, 2 min)",
        },
    }
};

const uiSchema = {
    "ui:options": {
        "submitButtonOptions": {
            "props": {
                "className": "btn btn-info",
            },
            "norender": false,
            "submitText": "Save"
        }
    }
}

const PretaskConfig = ({ pretask, setPretask }) => {
    const onSaveConfig = async ({ formData }, e) => {
        e.preventDefault();
        await updatePretask(formData.id, formData);
        setPretask(formData);
        window.alert("Pretask config has been saved successfully");
    };

    return (
        <>
            {pretask && <Form schema={schema} uiSchema={uiSchema} formData={pretask} onSubmit={onSaveConfig} validator={validator} />}
        </>
    )
}

export default PretaskConfig