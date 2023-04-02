import { Alert, Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import '../style/login.css'
import { useContext, useState } from 'react';
import { mongoContext, sistemaContext } from './contextProvider';

export default function Login({setSession}) {
    const [code, setCode] = useState('')
    const [alert, showAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const mongo = useContext(mongoContext)
    const codes = mongo.db('auth').collection('codes')
    const sistemasDati = useContext(sistemaContext)

    async function onSubmit(e) {
        e.preventDefault();
        codes.findOne({kods: code}).then(
            (result) => {
                if (Date.now() >= sistemasDati.stamps.nomiStartStamp && Date.now() <= sistemasDati.stamps.nomiEndStamp) {
                    if (result.nominets === false) {
                        setSession(true)
                    } else {
                        showAlert(true)
                        setAlertMsg('Nominācijas forma jau aizpildīta!')
                    }
                } else if (Date.now() >= sistemasDati.stamps.voteStartStamp && Date.now() <= sistemasDati.stamps.voteEndStamp) {
                    if (result.balsots === false) {
                        setSession(true)
                    } else {
                        showAlert(true)
                        setAlertMsg('Balsošanas forma jau aizpildīta!')
                    }
                }
            },
            (error) => {
                showAlert(true)
                setAlertMsg('Autentifikācijas kods neatbilst!')
            }
        )
    }

    return (
        <div className="login" id='loginDiv'>
            <Card id='loginCard'>
                <Card.Header>Autorizācija</Card.Header>
                <Card.Body>
                    <Form className='mb-3' onSubmit={onSubmit}>
                        <Form.Group className='mb-3'>
                            <FloatingLabel label='Autentifikācijas kods'>
                                <Form.Control type='password' placeholder='Autentifikācijas kods' value={code} onChange={(e) => setCode(e.target.value)} />
                            </FloatingLabel>
                        </Form.Group>
                        <Button variant='primary' type='submit'>Autorizēties</Button>
                    </Form>
                    {alert && <Alert variant='danger'>{alertMsg}</Alert>}
                </Card.Body>
            </Card>
        </div>
    )
}