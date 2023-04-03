import { Alert, Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import '../style/login.css'
import { useContext, useState } from 'react';
import { mongoContext, stampContext } from './contextProvider';

export default function Login({setSession, code, setCode}) {
    const [alert, showAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const mongo = useContext(mongoContext)
    const codes = mongo.db('auth').collection('codes')
    const stamps = useContext(stampContext)

    async function onSubmit(e) {
        e.preventDefault();
        location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        codes.findOne({kods: code}).then(
            (result) => {
                if (result === null) {
                    showAlert(true)
                    setAlertMsg('Autentifikācijas kods neatbilst!')
                } else if (Date.now() >= stamps.nomiStartStamp && Date.now() <= stamps.nomiEndStamp) {
                    if (result.nominets === false) {
                        setSession(true)
                    } else {
                        showAlert(true)
                        setAlertMsg('Nominācijas forma jau aizpildīta!')
                    }
                } else if (Date.now() >= stamps.voteStartStamp && Date.now() <= stamps.voteEndStamp) {
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
                setAlertMsg(`Sistēmas kļūda: ${error}`)
            }
        )
    }

    return (
        <div className="login" id='loginDiv'>
            <Card id='loginCard'>
                <Card.Header>Autorizācija</Card.Header>
                <Card.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className='mb-3'>
                            <FloatingLabel label='Autentifikācijas kods'>
                                <Form.Control type='password' placeholder='Autentifikācijas kods' value={code} onChange={(e) => setCode(e.target.value)} />
                            </FloatingLabel>
                        </Form.Group>
                        <center>
                            <Button variant='primary' type='submit'>Autorizēties</Button>
                        </center>
                    </Form>
                    {alert && <Alert className='mt-3' variant='danger'>{alertMsg}</Alert>}
                </Card.Body>
            </Card>
        </div>
    )
}