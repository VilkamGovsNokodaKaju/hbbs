import { Button, Form } from "react-bootstrap";
import * as XLSX from 'xlsx'
import { app } from "../routes/admin";

export default function Dashboard() {

    async function onFileSubmit(e, kur) {
        e.preventDefault()
        console.log(e)
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
            console.log(obj)
            const mongo = app.currentUser.mongoClient('mongodb-atlas');
            const sistema = mongo.db('data').collection('sistema')
            const result = await sistema.updateOne(
                {_id: kur},
                {$set: {list: obj}}
            )
            console.log(result)
        }
    }

    return (
        <div className="d-flex">
            <Form onSubmit={(e) => onFileSubmit(e, 'klases')}>
                <Form.Group>
                    <Form.Label>Skolēnu faila ielāde</Form.Label>
                    <Form.Control type="file" />
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
        </div>
    )
}