import * as _ from "lodash";

function extractPretaskData(attendant) {
    let { pretaskRecord, pickedPretaskOutcomeIndexes } = attendant;
    pickedPretaskOutcomeIndexes = pickedPretaskOutcomeIndexes || [];
    const rows = []
    if (!pretaskRecord) {
        return rows;
    }

    let sum = 0;
    const accumulateOutcomeHistory = pretaskRecord.moneyOutcomeHistory.map((v, i) => {
        if (pickedPretaskOutcomeIndexes.includes(i)) {
            sum = sum + v
            return sum;
        }
        return null;
    });

    const resetIdxHistory = _.map(pretaskRecord.resetHistory, 'idx');
    const resetStatusMap = {}
    if (pretaskRecord.resetHistory.length) {
        for (let { idx, status } of pretaskRecord.resetHistory) {
            resetStatusMap[idx] = status
        }
    }

    for (let i = 0; i < pretaskRecord.ballAQty.length; i++) {
        rows.push(Object.assign(
            {
                id: i + 1,
                n: pretaskRecord.ballAQty[i],
                bet: i < pretaskRecord.betHistory.length ? pretaskRecord.betHistory[i] : '-',
                betResult: i < pretaskRecord.betResultHistory.length ? pretaskRecord.betResultHistory[i] : '-',
                betChosen: i < pretaskRecord.betChosenHistory.length ? pretaskRecord.betChosenHistory[i] : '-',
                reset: resetIdxHistory.includes(i),
                resetStatus: resetStatusMap[i],
                moneyOutcome: i < pretaskRecord.moneyOutcomeHistory.length ? pretaskRecord.moneyOutcomeHistory[i] : null,
                pickedOutcome: pickedPretaskOutcomeIndexes.includes(i) ? pretaskRecord.moneyOutcomeHistory[i] : null,
                accumulateOutcome: i < accumulateOutcomeHistory.length ? accumulateOutcomeHistory[i] : null,
                reaction: i < pretaskRecord.reactionHistory.length ? pretaskRecord.reactionHistory[i] : '-',
            },
            {
                username: attendant.username,
                gender: attendant.gender,
                age: attendant.age,
                major: attendant.major,
            },
        ))
    }
    return rows;
}

export { extractPretaskData };
