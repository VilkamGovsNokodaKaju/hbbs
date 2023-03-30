import '../style/Balss.css'
import {useSessionStorage} from './sessionStorage.js'
import Login from './login'
import Nominacija from './nominacija'
import { useState } from 'react'
import { Button } from 'react-bootstrap'

export default function Balss() {
  const [validSession, setSession] = useSessionStorage('validSession', '')
  const [curNom, setNom] = useState(0)
  const nominacijas = [{title: 'Skurstenis', description: 'Lorem Ipsum', img: 'https://picsum.photos/500'},{title: 'Skolotāju mīlulis', description: 'Lorem Ipsum', img: 'https://picsum.photos/500'},{title: 'Melomāns', description: 'Lorem Ipsum', img: 'https://picsum.photos/500'}]
  const nomarr = []

  for (let i = 0; i < nominacijas.length; i++) {
    nomarr.push(<Nominacija title={nominacijas[i].title} desc={nominacijas[i].description} img={nominacijas[i].img} />)
  }

  return (
    <div className="Balss" id='balssDiv'>
      {!validSession && <Login setSession={setSession} />}
      <div className='mx-auto' id='nomDiv'>
          {nomarr[curNom]}
          <div id='buttonDiv'>
            {curNom > 0 && <Button variant='primary' id='prev' onClick={() => {setNom(curNom-1)}}>Iepriekšējais</Button>}
            {curNom < nominacijas.length - 1 && <Button variant='primary' id='next' onClick={() => {setNom(curNom+1)}}>Nākamais</Button>}
        </div>
      </div>
    </div>
  )
}
