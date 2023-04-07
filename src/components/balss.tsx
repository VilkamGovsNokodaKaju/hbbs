import '../style/balss.css'
import {useSessionStorage} from './sessionStorage.js'
import Login from './login'
import Nominacija from './nominacija'
import { Button, Form } from 'react-bootstrap'
import { nominContext, stampContext } from './contextProvider'
import { useContext, useState } from 'react'
import Timer from './timer'

export default function Balss() {
  const [validSession, setSession] = useSessionStorage('validSession', false)
  const [code, setCode] = useSessionStorage('voteCode', '')
  const [vote, setVote] = useState({})

  const stamps = useContext(stampContext)
  const isNomiTime = Date.now() >= stamps.nomiStartStamp && Date.now() <= stamps.nomiEndStamp
  const isVoteTime = Date.now() >= stamps.voteStartStamp && Date.now() <= stamps.voteEndStamp
  const [hideTimer, setHideTimer] = useState(() => {
    if (isNomiTime || isVoteTime) {
      return true
    } else {
      return false
    }
  })

  const nominacijas = useContext(nominContext)
  const skolenNomarr = nominacijas.skoleni.map(nominacija => <Nominacija key={nominacija.title} title={nominacija.title} desc={nominacija.desc} skolens={true} vote={vote} setVote={setVote} isNomiTime={isNomiTime} isVoteTime={isVoteTime} />)
  const skolotNomarr = nominacijas.skolotaji.map(nominacija => <Nominacija key={nominacija.title} title={nominacija.title} desc={nominacija.desc} skolens={false} vote={vote} setVote={setVote} isNomiTime={isNomiTime} isVoteTime={isVoteTime} />)

  function determineEndTime() {
    if (Date.now() < stamps.nomiStartStamp) {
      return stamps.nomiStartStamp
    } else if (Date.now() > stamps.nomiEndStamp && Date.now() < stamps.voteStartStamp) {
      return stamps.voteStartStamp
    }
  }

  return (
    <div>
      {hideTimer ?
        <div id='balssDiv'>
          {!validSession && <Login setSession={setSession} code={code} setCode={setCode} />}
          <Form className='m-3 mx-auto' id='balssForm'>
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
      :
        <div id='timerDiv'>
          <h2>{Date.now() < stamps.nomiStartStamp && 'Nominēšana'}{(Date.now() > stamps.nomiEndStamp && Date.now() < stamps.voteStartStamp) && 'Balsošana'} būs pieejama pēc:</h2>
          <Timer endTime={determineEndTime()} setHideTimer={setHideTimer} />
        </div>
      }
    </div>
  )
}    
