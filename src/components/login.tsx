import { Alert, Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import '../style/login.css'
import { useState } from 'react';
import { app as regApp } from '../routes/root';
import { app as adminApp } from '../routes/admin';
import * as Realm from "realm-web";

interface loginProps {
    setSession: (session: boolean) => void;
    code?: string;
    setCode?: (code: string) => void;
    type: 'reg' | 'admin';
}

export default function Login({setSession, code, setCode, type}: loginProps) {
    const [alert, showAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const [apiKey, setApiKey] = useState('')

    async function onRegSubmit(e) {
        e.preventDefault();
        regApp.currentUser.functions.authFunc(code).then(
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

    async function onAdminSubmit(e) {
        e.preventDefault();
        console.log(apiKey)
        const credentials = Realm.Credentials.apiKey(apiKey);
        console.log(credentials)
        const user = adminApp.logIn(credentials).then(
            (result) => {
                setSession(true)
            },
            (error) => {
                showAlert(true)
                setAlertMsg(`Sistēmas kļūda: ${error}`)
            }
        )
    }

    if (type === 'reg') {
        return (
            <div id='backDiv'>
                <div id='loginDiv'>
                    <Card className='m-auto' id='loginCard'>
                        <Card.Header>Autorizācija</Card.Header>
                        <Card.Body>
                            <Form onSubmit={onRegSubmit}>
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
    } else if (type === 'admin') {
        return (
            <div id='loginDiv'>
                <Card className='m-auto' id='loginCard'>
                    <Card.Header>Autorizācija</Card.Header>
                    <Card.Body>
                        <Form onSubmit={onAdminSubmit}>
                            <Form.Group className='mb-3'>
                                <FloatingLabel label='Autentifikācijas kods'>
                                    <Form.Control type='password' placeholder='Autentifikācijas kods' value={apiKey} onChange={e => {setApiKey(e.target.value);console.log(e)}} />
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
}