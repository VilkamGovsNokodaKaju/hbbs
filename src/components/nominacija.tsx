import { useState } from "react";
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import '../style/nominacija.css'

export default function Nominacija({title, desc}) {
const klases = ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6"]
const skoleni = [{klase: "12.1", skoleni: ["fizikis", "matematikis"]}, {klase: "12.2", skoleni: ["biodio", "big pharma"]}, {klase: "12.3", skoleni: ["ultra biodio", "small pharma"]}]
const [klase, setKlase] = useState("Klase")

const mapSkoleni = () => {
    for (let i = 0; i < skoleni.length; i++) {
        if (skoleni[i].klase === klase) {
            return skoleni[i].skoleni.map(skolens => <option value={`${klase}-${skolens}`}>{skolens}</option>)
        }
    }
}

    return (
        <Form.Group className="nominacija mb-3">
            <Form.Label className="h5">{title}</Form.Label>
            <br />
            <Form.Text className="text-muted">{desc}</Form.Text>
            <InputGroup>
                <DropdownButton
                    variant="outline-dark"
                    title={klase}
                >
                    {klases.map(klase => <Dropdown.Item value={klase} onClick={() => {setKlase(klase)}}>{klase}</Dropdown.Item>)}
                </DropdownButton>
                <Form.Select>
                    <option>Izvēlies skolēnu</option>
                    {mapSkoleni()}
                </Form.Select>
            </InputGroup>
        </Form.Group>
    )
}