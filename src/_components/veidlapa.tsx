'use client'

import { Finalists, Grupa, Nomin, submitForm } from "@/app/lib/actions"
import Nominacija from "./nominacija"
import { useFormState } from "react-dom"
import { SubmitButton } from "./submit-button"

interface FormProps {
    skoleni: Grupa[]
    skolotaji: Grupa[]
    nominacijas: Nomin[]
    finalList: Finalists[]
    period: number
}

export default function VotingForm({skoleni, skolotaji, nominacijas, finalList, period}: FormProps) {
    const [state, dispatch] = useFormState(submitForm, undefined)
    const skolenNominacijas = nominacijas.filter(n => n.tips == 'skolenu')
    const skolotNominacijas = nominacijas.filter(n => n.tips == 'skolotaju')

    return (
        <form action={dispatch}>
            <p className="text-3xl font-bold text-center">Skolēnu nominācijas</p>
            {skolenNominacijas.map(n => <Nominacija id={n.id} key={n.virsraksts} title={n.virsraksts} desc={n.apraksts} list={skoleni} skolens={true} finalList={finalList} period={period} />)}
            <p className="text-3xl font-bold text-center mt-6">Skolotāju nominācijas</p>
            {skolotNominacijas.map(n => <Nominacija id={n.id} key={n.virsraksts} title={n.virsraksts} desc={n.apraksts} list={skolotaji} skolens={false} finalList={finalList} period={period} />)}
            <center>
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
                <SubmitButton text='Balsot' />
            </center>
        </form>
    )
}