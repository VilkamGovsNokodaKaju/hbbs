import { useContext, useState } from "react";
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import '../style/nominacija.css'
import { balssContext, klasContext, skolotContext } from "./contextProvider";

export default function Nominacija({title, desc, skolens, vote, setVote, isNomiTime, isVoteTime}) {
    const [value, setValue] = useState('')
    const [klase, setKlase] = useState("Klase")
    const balsis = useContext(balssContext)
    const klases = useContext(klasContext)
    const skolotaji = useContext(skolotContext)
    const klasarr = Object.getOwnPropertyNames(klases).map(klase => <Dropdown.Item key={klase} value={klase} onClick={() => {setKlase(klase)}}>{klase}</Dropdown.Item>)
    const skolotarr = skolotaji.map(skolotajs => <option key={skolotajs} value={skolotajs}>{skolotajs}</option>)
    const balss = balsis.find(balss => balss._id === title)

    function mapSkoleni() {
        for (const prop in klases) {
            if (prop === klase) {
                return klases[prop].map(skolens => <option key={skolens} value={`${klase.replace('.', '-')}_${skolens}`}>{skolens}</option>)
            }
        }
    }

    function findTop3() {
        if (balss.vote1.length === 0) {
            return 'Neviens nebalsoja'
        }
        const top3 = balss.vote1.sort((a: {cilveks: string, skaits: number}, b: {cilveks: string, skaits: number}) => b[1] - a[1]).slice(0, 3)
        return top3.map(cilveks => <Form.Check type="radio" key={`${title}|${cilveks.cilveks}`} id={`${title}|${cilveks.cilveks}`} label={cilveks.cilveks.replace('-', '.').replace('_', ' ')} checked={value === `${title}|${cilveks.cilveks}`} onChange={e => {setValue(e.target.id); setVote({...vote, [title]: e.target.id.split('|')[1]})}} />)
    }

    if (isNomiTime) {
        return (
            <Form.Group className="mb-3">
                <Form.Label className="h5">{title}</Form.Label>
                <br />
                <Form.Text>{desc}</Form.Text>
                {skolens ? 
                    <InputGroup>
                        <DropdownButton variant="outline-light" title={klase}>
                            {klasarr}
                        </DropdownButton>
                        <Form.Select value={value} onChange={e => {setValue(e.target.value); setVote({...vote, [title]: e.target.value})}}>
                            <option>Izvēlies skolēnu</option>
                            {mapSkoleni()}
                        </Form.Select>
                    </InputGroup>
                :
                    <Form.Select value={value} onChange={e => {setValue(e.target.value); setVote({...vote, [title]: e.target.value})}}>
                        <option>Izvēlies skolotāju</option>
                        {skolotarr}
                    </Form.Select>
                }
            </Form.Group>
        )
    } else if (isVoteTime) {
        return (
            <Form.Group className="mb-3">
                <Form.Label className="h5">{title}</Form.Label>
                <br />
                <Form.Text>{desc}</Form.Text>
                {findTop3()}
            </Form.Group>
        )
    }
}