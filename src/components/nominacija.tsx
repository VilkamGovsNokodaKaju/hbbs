import { useContext, useState } from "react";
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import '../style/nominacija.css'
import { klasContext, skolotContext } from "./contextProvider";

export default function Nominacija({title, desc, skolens, vote, setVote, isNomiTime, isVoteTime}) {
    const [value, setValue] = useState('')
    const [klase, setKlase] = useState("Klase")
    const klases = useContext(klasContext)
    const skolotaji = useContext(skolotContext)
    const klasarr = Object.getOwnPropertyNames(klases).map(klase => <Dropdown.Item key={klase} value={klase} onClick={() => {setKlase(klase)}}>{klase}</Dropdown.Item>)
    const skolotarr = skolotaji.map(skolotajs => <option key={skolotajs} value={skolotajs}>{skolotajs}</option>)

    const mapSkoleni = () => {
        for (const prop in klases) {
            if (prop === klase) {
                return klases[prop].map(skolens => <option key={skolens} value={`${klase}_${skolens}`}>{skolens}</option>)
            }
        }
    }

    function findTop3() {
        const top3 = Object.entries(balss).sort((a, b) => b[1] - a[1]).slice(0, 3)
        return top3.map(cilveks => <Form.Check type="radio" id={cilveks[0]} label={cilveks[0]} />)
    }

    if (isNomiTime) {
        return (
            <Form.Group className="mb-3">
                <Form.Label className="h5">{title}</Form.Label>
                <br />
                <Form.Text className="text-muted">{desc}</Form.Text>
                {skolens ? 
                    <InputGroup>
                        <DropdownButton variant="outline-dark" title={klase}>
                            {klasarr}
                        </DropdownButton>
                        <Form.Select value={value} onChange={e => {setValue(e.target.value); setVote({...vote, [title]: e.target.value})}}>
                            <option>Izvēlies skolēnu</option>
                            {mapSkoleni()}
                        </Form.Select>
                    </InputGroup>
                :
                    <Form.Select>
                        <option>Izvēlies skolotāju</option>
                        {skolotarr}
                    </Form.Select>
                }
            </Form.Group>
        )
    } else if (isVoteTime) {
}