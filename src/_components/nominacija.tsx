'use client'

import { UUID } from "crypto";
import { useState } from "react";
import { Finalists, Grupa } from "@/app/lib/actions";

interface NominacijaProps {
    id: UUID;
    title: string;
    desc: string;
    list: Grupa[];
    skolens: Boolean;
    finalList: Finalists[];
    period: number;
}

export default function Nominacija({id, title, desc, list, skolens, finalList, period}: NominacijaProps) {
    const defaultGrupa = skolens ? 'Klase' : 'Grupa';
    const defaultCilveks = skolens ? 'Izvēlies skolēnu' : 'Izvēlies skolotāju';
    const [grupa, setGrupa] = useState(defaultGrupa);
    const [cilveki, setCilveki] = useState([] as string[]);

    const grupas = list.map(({grupa: g}) => (
        <option key={g} value={g}>{g}</option>
    ));
    const cilvekiMap = list.reduce((acc: {[key: string]: string[]}, {grupa: g, cilveki: c}) => {
        acc[g] = c;
        return acc;
    }, {});

    const handleGrupaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newGrupa = event.target.value;
        setGrupa(newGrupa);
        setCilveki(cilvekiMap[newGrupa]);
    }

    const nominFinalists = finalList.find(f => f.id == id);
    const finalists = nominFinalists?.cilveki.map(c => (
        <label key={c} className="label cursor-pointer justify-start">
            <input type="radio" className="radio mr-2" name={id} value={c} />
            <span className="label-text">{c.replace(',', ' ')}</span>
        </label>
    ))

    return (
        <div className="mb-2">
            <p className="text-xl font-bold">{title}</p>
            <p className="text-base text-justify">{desc}</p>
            <div className="flex grow justify-center items-center join">
                {period == 3 ?
                    finalists && finalists?.length > 0 ?
                        <div className="join join-vertical">
                            {finalists}
                        </div>
                    :
                        <p>Pašpārvalde nav apstiprinājusi finālistus!</p>
                :
                    <>
                    <select className="select select-bordered join-item" value={grupa} onChange={handleGrupaChange}>
                    <option disabled>{defaultGrupa}</option>
                    {grupas}
                    </select>
                    <select className="select select-bordered w-full join-item" defaultValue={defaultCilveks} name={id}>
                        <option disabled>{defaultCilveks}</option>
                        {cilveki.map(c => <option key={c} value={grupa+','+c}>{c}</option>)}
                    </select>
                    </>
                }
                
            </div>
        </div>
    )
}
