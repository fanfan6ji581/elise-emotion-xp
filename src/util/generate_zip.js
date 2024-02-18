import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Parser } from '@json2csv/plainjs';
import { extractXpData } from './xp_data';
import { extractPretaskData } from './pretask_data';

async function generateXPZip(attendants, xpConfig) {
    const zip = new JSZip();
    const parser = new Parser();

    attendants.forEach((attendant, i) => {
        const attendantData = extractXpData(attendant, xpConfig);
        if (attendantData.length) {
            zip.file(`${xpConfig.alias}/${attendant.username}.csv`, parser.parse(attendantData));
        }
    });
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${xpConfig.alias}-main.zip`)
}

async function generatePretaskZip(attendants, xpConfig) {
    const zip = new JSZip();
    const parser = new Parser();

    attendants.forEach((attendant, i) => {
        const attendantData = extractPretaskData(attendant);
        if (attendantData.length) {
            zip.file(`${xpConfig.alias}-pretask/${attendant.username}.csv`, parser.parse(attendantData));
        }
    });
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${xpConfig.alias}-pretask.zip`)
}


export { generatePretaskZip, generateXPZip };