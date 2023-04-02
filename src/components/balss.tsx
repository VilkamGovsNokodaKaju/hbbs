import '../style/Balss.css'
import {useSessionStorage} from './sessionStorage.js'
import Login from './login'
import Nominacija from './nominacija'
import { Button, Form } from 'react-bootstrap'

export default function Balss() {
  const [validSession, setSession] = useSessionStorage('validSession', false)
  const nominacijas = [{title: 'Skurstenis', description: 'Lorem Ipsum'},{title: 'Skolotāju mīlulis', description: 'Lorem Ipsum'},{title: 'Melomāns', description: 'Lorem Ipsum'}]
  const nomarr = nominacijas.map(nominacija => <Nominacija key={nominacija.title} title={nominacija.title} desc={nominacija.description} />)

  return (
    <div className="Balss" id='balssDiv'>
      {!validSession && <Login setSession={setSession} />}
      <Form>
        {nomarr}
        <center>
          <Button variant="primary" type="submit">
            Balsot
          </Button>
        </center>
      </Form>
    </div>
  )
}
