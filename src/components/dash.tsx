import { Button, Form } from "react-bootstrap";
import * as XLSX from 'xlsx'
import { app } from "../routes/admin";
import { useState } from "react";
import QRCode from 'qrcode';
import {Document, ImageRun, Packer, Paragraph, Table, TableCell, TableRow, TextRun} from 'docx'
import {saveAs} from 'file-saver'

export default function Dashboard() {
    const [qrAmount, setQrAmount] = useState(1)

    async function onFileSubmit(e, kur) {
        e.preventDefault()
        const reader = new FileReader()
        reader.readAsArrayBuffer(e.target[0].files[0])
        reader.onload = async (e) => {
            const workbook = XLSX.read(reader.result, { type: 'array' })
            const worksheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[worksheetName]
            const skolenFails: Array<Array<string>> = XLSX.utils.sheet_to_json(worksheet, {header: 1})
            let obj = {}
            for (let i = 0; i < skolenFails[0].length; i++) {
                let arr = []
                for (let j = 1; j < skolenFails.length; j++) {
                    if (skolenFails[j][i]) {
                        arr.push(skolenFails[j][i])
                    }
                }
                obj[skolenFails[0][i]] = arr
            }
            const mongo = app.currentUser.mongoClient('mongodb-atlas');
            const sistema = mongo.db('data').collection('sistema')
            const result = await sistema.updateOne(
                {_id: kur},
                {$set: {list: obj}}
            )
            console.log(result)
        }
    }

    async function onQRSubmit(e) {
        e.preventDefault()
        const mongo = app.currentUser.mongoClient('mongodb-atlas');
        const codes = mongo.db('auth').collection('codes')
        let dbCodes = []
        let qrCodes: Array<string> = []
        for (let i = 0; i < qrAmount; i++) {
            const code = crypto.randomUUID().split('-')[0]
            dbCodes.push({
                _id: code,
                nominets: false,
                balsots: false
            })
            QRCode.toDataURL(
                `https://www.avghagenabalva.lv/?code=${code}`,
                {
                    type: 'image/png'
                },
                function (err, url) {
                    qrCodes.push(url)
                }
            )
        }
        codes.deleteMany({}).then(() => {
            codes.insertMany(dbCodes)
        })
        const numTables = Math.ceil(qrAmount/16)
        const numRows = Math.ceil(qrAmount/4)
        let cells = []
        for (let i = 0; i < qrAmount; i++) {
            cells.push(
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: qrCodes[i],
                                    transformation: {
                                        width: 180,
                                        height: 180,
                                    }
                                }),
                                new TextRun({
                                    text: 'https://www.avghagenabalva.lv',
                                    break: 1,
                                    size: 20
                                }),
                                new TextRun({
                                    text: `Kods: ${dbCodes[i]._id}`,
                                    break: 1,
                                    size: 22
                                })
                            ]
                        })
                    ]
                })
            )
        }
        let rows = []
        for (let i = 0; i < numRows; i++) {
            let theseCells = []
            for (let j = i*4; j < (i+1)*4; j++) {
                theseCells.push(cells[j])
            }
            rows.push(
                new TableRow({
                    children: theseCells
                })
            )
        }
        let tables = []
        for (let i = 0; i < numTables; i++) {
            let theseRows = []
            for (let j = i*4; j < (i+1)*4; j++) {
                if (rows[j]) {
                    theseRows.push(rows[j])
                }
            }
            tables.push(
                new Table({
                    rows: theseRows
                })
            )
        }
        const doc = new Document({
            sections: [{
                children: tables,
                properties: {
                    page: {
                        margin: {
                            bottom: 415,
                            left: 415,
                            right: 415,
                            top: 415
                        }
                    }
                }
            }]
        })
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, 'kodi.docx')
        })
    }

    return (
        <div className="d-flex">
            <Form onSubmit={(e) => onFileSubmit(e, 'klases')}>
                <Form.Group>
                    <Form.Label>Skolēnu faila ielāde</Form.Label>
                    <Form.Control type="file" accept=".xlsx" />
                </Form.Group>
                <Button variant="primary" type="submit">Ielādēt</Button>
            </Form>
            <Form onSubmit={(e) => onFileSubmit(e, 'skolotaji')}>
                <Form.Group>
                    <Form.Label>Skolotāju faila ielāde</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
                <Button variant="primary" type="submit">Ielādēt</Button>
            </Form>
            <Form onSubmit={onQRSubmit}>
                <Form.Group>
                    <Form.Label>Piekļuves kodu skaits</Form.Label>
                    <Form.Control type="number" min={1} value={qrAmount} onChange={(e) => setQrAmount(parseInt(e.target.value))} />
                </Form.Group>
                <Button variant="primary" type="submit">Ģenerēt</Button>
            </Form>
        </div>
    )
}