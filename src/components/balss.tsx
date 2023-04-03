import '../style/Balss.css'
import {useSessionStorage} from './sessionStorage.js'
import Login from './login'
import Nominacija from './nominacija'
import { Button, Form } from 'react-bootstrap'
import { nominContext } from './contextProvider'
import { useContext } from 'react'

export default function Balss() {
  const [validSession, setSession] = useSessionStorage('validSession', false)
  const nomarr = nominacijas.map(nominacija => <Nominacija key={nominacija.title} title={nominacija.title} desc={nominacija.description} />)
  const nominacijas = useContext(nominContext)

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
