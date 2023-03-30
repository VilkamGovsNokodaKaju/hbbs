import { Card } from "react-bootstrap";
import '../style/nominacija.css'

export default function Nominacija({title, desc, img}) {
    return (
        <div className="nominacija mb-3">
            <Card id='nomCard'>
                <Card.Img id='nomImg' variant='top' src={img} />
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{desc}</Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}