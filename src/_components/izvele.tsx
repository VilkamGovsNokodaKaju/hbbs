import { Izvele, Nomin } from "@/app/lib/actions"

interface IzveleListProps {
    nominacijas: Nomin[]
    izveles: Izvele[]
}

interface ChoiceProps {
    title: string
    desc: string
    izvele: string
}

export default function IzveleList({nominacijas, izveles}: IzveleListProps) {
    const skolenIzveles = izveles.filter(i => nominacijas.some(n => n.id == i.nominID && n.tips == 'skolenu'))
    const skolotajIzveles = izveles.filter(i => nominacijas.some(n => n.id == i.nominID && n.tips == 'skolotaju'))
    return (
        <div>
            <p className="text-3xl font-bold text-center">Skolēnu nominācijas</p>
            {skolenIzveles.map(i => <Choice key={i.nominID} title={nominacijas.find(n => n.id == i.nominID)!.virsraksts} desc={nominacijas.find(n => n.id == i.nominID)!.apraksts} izvele={i.izvele} />)}
            <p className="text-3xl font-bold text-center mt-6">Skolotāju nominācijas</p>
            {skolotajIzveles.map(i => <Choice key={i.nominID} title={nominacijas.find(n => n.id == i.nominID)!.virsraksts} desc={nominacijas.find(n => n.id == i.nominID)!.apraksts} izvele={i.izvele} />)}
        </div>
    )
}

function Choice({title, desc, izvele}: ChoiceProps) {
    return (
        <div className="mb-2">
            <p className="text-xl font-bold">{title}</p>
            <p className="text-base text-justify">{desc}</p>
            <p className="text-center">Tava izvēle: {izvele.replace(',', ' ')}</p>
        </div>
    )
}