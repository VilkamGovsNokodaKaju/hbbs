import '../style/balss.css'
import {useSessionStorage} from './sessionStorage.js'
import Login from './login'
import Nominacija from './nominacija'
import { Alert, Button, Form } from 'react-bootstrap'
import { nominContext, stampContext } from './contextProvider'
import { useContext, useState } from 'react'
import Timer from './timer'
import { app } from '../main'

export default function Balss() {
  const [validSession, setSession] = useSessionStorage('validSession', false)
  const [code, setCode] = useSessionStorage('voteCode', '')
  const [vote, setVote] = useState({})
  const [alert, showAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [success, showSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const stamps = useContext(stampContext)
  const isNomiTime = Date.now() >= stamps.nomiStartStamp && Date.now() <= stamps.nomiEndStamp
  const isVoteTime = Date.now() >= stamps.voteStartStamp && Date.now() <= stamps.voteEndStamp
  const [hideTimer, setHideTimer] = useState(() => {
    if (isNomiTime || isVoteTime) {
      return true
    } else if (Date.now() > stamps.voteEndStamp) {
      return false
    } else {
      return false
    }
  })

  const nominacijas = useContext(nominContext)
  const skolenNomarr = nominacijas.skoleni.map(nominacija => <Nominacija key={nominacija.title} title={nominacija.title} desc={nominacija.desc} skolens={true} vote={vote} setVote={setVote} isNomiTime={isNomiTime} isVoteTime={isVoteTime} />)
  const skolotNomarr = nominacijas.skolotaji.map(nominacija => <Nominacija key={nominacija.title} title={nominacija.title} desc={nominacija.desc} skolens={false} vote={vote} setVote={setVote} isNomiTime={isNomiTime} isVoteTime={isVoteTime} />)

  function determineEndTime() {
    const now = Date.now()
    for (const stamp in stamps) {
      if (now < stamps[stamp]) {
        return stamps[stamp]
      }
      if (stamp === 'voteEndStamp') {
        return 0
      }
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    if (Object.keys(vote).length === 0) {
      showAlert(true)
      setAlertMsg('Balsošanas forma nav aizpildīta!')
      return
    }
    app.currentUser.functions.voteFunc(code, vote).then(
      (result) => {
        if (result === 'invalid') {
          setSession(false)
        } else if (result === 'nominated') {
          showSuccess(false)
          showAlert(true)
          setAlertMsg('Nominācijas forma jau aizpildīta!')
        } else if (result === 'voted') {
          showSuccess(false)
          showAlert(true)
          setAlertMsg('Balsošanas forma jau aizpildīta!')
        } else if (result === 'success') {
          showAlert(false)
          showSuccess(true)
          setSuccessMsg('Balsošana veiksmīga!')
        } else {
          showSuccess(false)
          showAlert(true)
          setAlertMsg(`Sistēmas kļūda: ${result}`)
        }
      }
    )
  }

  return (
    <div id='backgroundDiv'>
      {hideTimer ?
        <div id='balssDiv'>
          {!validSession && <Login setSession={setSession} code={code} setCode={setCode} type='reg' />}
          <div className='p-3'>
            <Form className='mx-auto' id='balssForm' onSubmit={onSubmit}>
              <center>
                <h5>{Date.now() < stamps.nomiEndStamp && 'Nominēšana'}{(Date.now() > stamps.voteStartStamp && Date.now() < stamps.voteEndStamp) && 'Balsošana'} noslēgsies pēc:</h5>
                <Timer endTime={determineEndTime()} small={true} />
                <h3>Skolēnu nominācijas</h3>
              </center>
              {skolenNomarr}
              <center>
                <h3>Skolotāju nominācijas</h3>
              </center>
              {skolotNomarr}
              <center>
                {alert && <Alert className='mt-3' variant='danger'>{alertMsg}</Alert>}
                {success && <Alert className='mt-3' variant='success'>{successMsg}</Alert>}
                <Button variant="primary" type="submit">
                  Balsot
                </Button>
              </center>
            </Form>
          </div>
        </div>
      :
        <div id='timerDiv'>
          {determineEndTime() !== 0 && <h2>{Date.now() < stamps.nomiStartStamp && 'Nominēšana'}{(Date.now() > stamps.nomiEndStamp && Date.now() < stamps.voteStartStamp) && 'Balsošana'} būs pieejama pēc:</h2>}
          <Timer endTime={determineEndTime()} setHideTimer={setHideTimer} small={false} />
        </div>
      }
    </div>
  )
}    
