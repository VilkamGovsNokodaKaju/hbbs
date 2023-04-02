import { Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import '../style/login.css'

export default function Login({setSession}) {
    function onSubmit(e) {
        e.preventDefault();
        setSession(true)
    }

    return (
        <div className="login" id='loginDiv'>
            <Card id='loginCard'>
                <Card.Header>Autorizācija</Card.Header>
                <Card.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className='mb-3'>
                            <FloatingLabel label='Autentifikācijas kods'>
                                <Form.Control type='password' placeholder='Autentifikācijas kods' />
                            </FloatingLabel>
                        </Form.Group>
                        <Button variant='primary' type='submit'>Autorizēties</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}