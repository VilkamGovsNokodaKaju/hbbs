'use client'

import { useRef, useState } from "react";
import { SubmitButton } from "@/_components/submit-button";
import { useFormState } from "react-dom";
import { setFinalists } from "@/app/lib/admin-actions";

export interface FinalTableProps {
    id?: string
    title: string
    list: {izvele: string, count: number}[]
}

interface FinalRowProps {
    izvele: string
    checkedCount: number
    setCount: React.Dispatch<React.SetStateAction<number>>
    id?: string
    count: number
}

export default function FinalTable({id, title, list}: FinalTableProps) {
    const [state, dispatch] = useFormState(setFinalists, undefined)
    const [checkedCount, setCount] = useState(0);
    
    return (
        <div className="overflow-x-auto max-w-60 md:max-w-4xl">
        <p>{title}</p>
        <form action={dispatch}>
            <table className="table mb-2">
                <thead>
                    <tr>
                        <th></th>
                        <th className="text-center">Klase/Grupa</th>
                        <th className="text-center">Vārds, Uzvārds</th>
                        <th className="text-center">Balsu skaits</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(({izvele, count}) => {
                        return <FinalRow key={izvele} izvele={izvele} checkedCount={checkedCount} setCount={setCount} id={id} count={count} />
                    })}
                </tbody>
            </table>
            {state?.success &&
                <div role='alert' className='alert alert-success mb-2'>
                    <span className='material-symbols-outlined'>check_circle</span>
                    <span>{state.message}</span>
                </div>
            }
            {state?.success === false &&
                <div role='alert' className='alert alert-error mb-2'>
                    <span className='material-symbols-outlined'>error</span>
                    <span>{state.message}</span>
                </div>
            }
            <SubmitButton text="Saglabāt" />
        </form>
        </div>
    )
}

function FinalRow({izvele, checkedCount, setCount, id, count}: FinalRowProps) {
    const checkboxRef = useRef<HTMLInputElement>(null);
    return (
        <tr key={izvele} className="hover" onClick={() => {
            if (checkedCount < 3 || checkedCount >= 3 && checkboxRef.current!.checked) {
                checkboxRef.current!.checked = !checkboxRef.current!.checked;
                if (checkboxRef.current!.checked) {
                    setCount(checkedCount + 1);
                } else {
                    setCount(checkedCount - 1);
                }
            }
        } }>
            <th>
                <input type="checkbox" className="checkbox" ref={checkboxRef} value={izvele} name={id} onClick={e => e.stopPropagation()}
                    disabled={checkedCount >= 3 && !checkboxRef.current!.checked}
                    onChange={() => { if (checkboxRef.current!.checked) { setCount(checkedCount + 1); } else { setCount(checkedCount - 1); } } } />
            </th>
            <td className="text-center">{izvele.split(',')[0]}</td>
            <td className="text-center">{izvele.split(',')[1]}</td>
            <td className="text-center">{count}</td>
        </tr>
    );
}