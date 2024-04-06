import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { updateDoc, doc } from "firebase/firestore";
import db from "../../database/firebase";

const schema = {
    "title": "Configure Emotion XP",
    "description": "",
    "type": "object",
    "required": [
        "dangerZoneChance",
        "aberrationChance",
    ],
    "properties": {
        "dangerZoneChance": {
            "type": "string",
            "title": "prob_dangerous Probability that speed departs from threshold value (i.e., we enter the “dangerous zone preceding a regime shift)",
            // "default": "1/6"
        },
        "lambda": {
            "type": "string",
            "title": "λ intensity",
            // "default": "1/3"
        },
        "aberrationChance": {
            "type": "string",
            "title": "prob_aberration Probability of occurrence of an aberration",
            // "default": "1/6"
        },
        "delta": {
            "type": "integer",
            "title": "∆ change_speed",
            // "default": 100
        },
        "missLimit": {
            "type": "integer",
            "title": "when missed this many times, terminate the xp",
            "default": 5
        },
        // "costToSwitch": {
        //     "type": "integer",
        //     "title": "Cost to switch the other screen",
        //     // "default": 6
        // },
        "afkTimeout": {
            "type": "integer",
            "title": "Decision stage, milliseconds that allow attendant to do decision, e.g. 2000 ms = 2 sec",
            // "default": 2
        },
        "choiceDelay": {
            "type": "integer",
            "title": "Delay in milliseconds after clicking a balloon, 1000 ms = 1 sec",
            "default": 0
        },
        "outcomeShowTime": {
            "type": "integer",
            "title": "Outcome stage, millisecond showing the output result, 2000 ms = 2 sec",
            // "default": 2
        },
        "afkTimeoutCost": {
            "type": "integer",
            "title": "Cost if missed trial",
            // "default": 1
        },
        "numberOfTrials": {
            "type": "integer",
            "title": "Number of trials T",
            // "default": 400
        },
        "percentageEarning": {
            "type": "integer",
            "title": "Percentage of trials for earnings",
            // "default": 100
        },
        "trainingSessionSeconds": {
            "type": "integer",
            "title": "Seconds of how long the training session last (default is 120 seconds, 2 min)",
        },
        "historySessionSeconds": {
            "type": "integer",
            "title": "Seconds of how long the display history page last (default is 120 seconds, 2 min)",
        },
        "showChoiceButtonOnTop": {
            "type": "boolean",
            "title": "Should show choice buttons on top of the charts",
            default: false
        },
        clickToShowVolumeChart: {
            "type": "boolean",
            "title": "Need to click asset chart to show volume chart",
            default: false
        },
        hideVolumeChartWhenShowOutcome: {
            "type": "boolean",
            "title": "Hide Volume Chart when show outcome",
            default: false
        },
        "trialBreakSeconds": {
            "type": "integer",
            "title": "Seconds of trial break in the middle",
            "default": 180
        },
        "useMultiColorChoiceButton": {
            "type": "boolean",
            "title": "Apply different button color for options",
            "default": false
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

const BalloonXPConfig = ({ xp, setXp }) => {
    const onSaveConfig = async ({ formData }, e) => {
        e.preventDefault();
        const xpDocRef = doc(db, "xp", formData.id);
        await updateDoc(xpDocRef, formData);
        setXp(formData);
        window.alert("XP config has been saved successfully");
    };

    return (
        <>
            {xp &&
                <>
                    <Form schema={schema} uiSchema={uiSchema} formData={xp} onSubmit={onSaveConfig} validator={validator} />
                </>
            }
        </>
    )
}

export default BalloonXPConfig