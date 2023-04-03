import '../style/Balss.css'
import {useSessionStorage} from './sessionStorage.js'
import Login from './login'
import Nominacija from './nominacija'
import { Button, Form } from 'react-bootstrap'
import { nominContext } from './contextProvider'
import { useContext } from 'react'

export default function Balss() {
  const [validSession, setSession] = useSessionStorage('validSession', false)
  const [code, setCode] = useSessionStorage('voteCode', '')
  const nominacijas = useContext(nominContext)
  const skolenNomi = nominacijas.skoleni
  const skolotNomi = nominacijas.skolotaji
  const skolenNomarr = skolenNomi.map(nominacija => <Nominacija key={nominacija.title} title={nominacija.title} desc={nominacija.desc} skolens={true} />)
  const skolotNomarr = skolotNomi.map(nominacija => <Nominacija key={nominacija.title} title={nominacija.title} desc={nominacija.desc} skolens={false} />)

  return (
    <div id='balssDiv'>
      {!validSession && <Login setSession={setSession} code={code} setCode={setCode} />}
      <Form className='m-3'>
        <center>
          <h3>Skolēnu nominācijas</h3>
        </center>
        {skolenNomarr}
        <center>
          <h3>Skolotāju nominācijas</h3>
        </center>
        {skolotNomarr}
        <center>
          <Button variant="primary" type="submit">
            Balsot
          </Button>
        </center>
      </Form>
    </div>
  )
}
