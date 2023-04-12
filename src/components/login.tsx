import { Alert, Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import '../style/login.css'
import { useState } from 'react';
import { app } from '../main';

export default function Login({setSession, code, setCode}) {
    const [alert, showAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')

    async function onSubmit(e) {
        e.preventDefault();
        app.currentUser.functions.authFunc(code).then(
            (result) => {
                if (result === 'invalid') {
                    showAlert(true)
                    setAlertMsg('Autentifikācijas kods neatbilst!')
                } else if (result === 'nominated') {
                    showAlert(true)
                    setAlertMsg('Nominācijas forma jau aizpildīta!')
                } else if (result === 'voted') {
                    showAlert(true)
                    setAlertMsg('Balsošanas forma jau aizpildīta!')
                } else if (result === 'success') {
                    setSession(true)
                } else {
                    showAlert(true)
                    setAlertMsg(`Sistēmas kļūda: ${result}`)
                }
            },
            (error) => {
                showAlert(true)
                setAlertMsg(`Sistēmas kļūda: ${error}`)
            }
        )
    }

    return (
        <div id='backDiv'>
            <div id='loginDiv'>
                <Card className='m-auto' id='loginCard'>
                    <Card.Header>Autorizācija</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <Form.Group className='mb-3'>
                                <FloatingLabel label='Autentifikācijas kods'>
                                    <Form.Control type='password' placeholder='Autentifikācijas kods' value={code} onChange={e => setCode(e.target.value)} />
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
        </div>
    )
}