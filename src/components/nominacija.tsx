import { useState } from "react";
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import '../style/nominacija.css'

export default function Nominacija({title, desc, skolens, vote, setVote}) {
    const [value, setValue] = useState('')
    const klases = ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6"]
    const klasarr = klases.map(klase => <Dropdown.Item key={klase} value={klase} onClick={() => {setKlase(klase)}}>{klase}</Dropdown.Item>)
    const skoleni = [{klase: "12.1", skoleni: ["fizikis", "matematikis"]}, {klase: "12.2", skoleni: ["biodio", "big pharma"]}, {klase: "12.3", skoleni: ["ultra biodio", "small pharma"]}]
    const skolotaji = ['Lankovska', 'Mihno']
    const skolotarr = skolotaji.map(skolotajs => <option key={skolotajs} value={skolotajs}>{skolotajs}</option>)
    const [klase, setKlase] = useState("Klase")

    const mapSkoleni = () => {
        for (let i = 0; i < skoleni.length; i++) {
            if (skoleni[i].klase === klase) {
                return skoleni[i].skoleni.map(skolens => <option key={skolens} value={`${klase}_${skolens}`}>{skolens}</option>)
            }
        }
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label className="h5">{title}</Form.Label>
            <br />
            <Form.Text className="text-muted">{desc}</Form.Text>
            {skolens === true ? 
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
}