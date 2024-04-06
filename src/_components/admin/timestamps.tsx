'use client'

import { setTimestamps } from "@/app/lib/admin-actions"
import { useFormState } from "react-dom"
import { SubmitButton } from "@/_components/submit-button"
import { timestamp } from "@/app/lib/actions";

export default function Timestamps({stamps}: {stamps: timestamp[]}) {
    const date = new Date();
    const [state, dispatch] = useFormState((_currentState: unknown, formData: FormData) => setTimestamps(_currentState, formData, date.getTimezoneOffset()), undefined)
    return (
        <form className="card" action={dispatch}>
            <div className="card-body p-4 md:p-8">
                <h2 className="card-title">Balsošanas laika kontrole</h2>
                <Timestamp period="nominacijas" stamps={stamps.find((stamp: timestamp) => stamp.period == "nominacijas") || {period: "nominacijas", start: 0, end: 0}} />
                <Timestamp period="balsosana" stamps={stamps.find((stamp: timestamp) => stamp.period == "balsosana") || {period: "balsosana", start: 0, end: 0}} />
                {state?.success && 
                    <div role='alert' className='alert alert-success'>
                        <span className='material-symbols-outlined'>check_circle</span>
                        <span>{state.message}</span>
                    </div>
                }
                {state?.success === false && 
                    <div role='alert' className='alert alert-error'>
                        <span className='material-symbols-outlined'>error</span>
                        <span>{state.message}</span>
                    </div>
                }
                <div className="card-actions justify-end">
                    <SubmitButton text="Saglabāt" />
                </div>
            </div>
        </form>
    )
}

interface TimestampProps {
    period: 'nominacijas' | 'balsosana'
    stamps: timestamp
}

function Timestamp({period, stamps}: TimestampProps) {
    const periodText = period == 'nominacijas' ? 'Nominācijas' : 'Balsošana'
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const defaultSakums = new Date(Number(stamps.start) - timezoneOffset).toISOString().substring(0, 16)
    const defaultBeigas = new Date(Number(stamps.end) - timezoneOffset).toISOString().substring(0, 16)
    return (
        <div className="join">
            <p className="self-end mb-3.5 mr-2">{periodText}</p>
            <label className="form-control">
                <div className="label">
                    <span className="label-text">Sākums</span>
                </div>
                <input name={period + "_sakums"} defaultValue={defaultSakums} type="datetime-local" className="input input-bordered join-item" style={{borderEndStartRadius: '0.5rem', borderStartStartRadius: '0.5rem'}} />
            </label>
            <label className="form-control">
                <div className="label">
                    <span className="label-text">Beigas</span>
                </div>
                <input name={period + "_beigas"} defaultValue={defaultBeigas} type="datetime-local" className="input input-bordered join-item" />
            </label>
        </div>
    )
}