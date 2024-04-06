'use client'

import { SubmitButton } from "@/_components/submit-button"
import { setPeople } from "@/app/lib/admin-actions"
import { useFormState } from "react-dom"

interface FileUploadProps {
    type: 0 | 1
}

export default function FileUpload({type}: FileUploadProps) {
    const [state, dispatch] = useFormState((_currentState: unknown, formData: FormData) => setPeople(_currentState, formData, type), undefined)
    const typeText = type ? 'skolotāju' : 'skolēnu'
    return (
        <form className="card" action={dispatch}>
            <div className="card-body p-4 md:p-8">
                <h2 className="card-title">Augšupielādēt {typeText} failu</h2>
                <input type="file" name="file" accept=".xlsx" className="file-input file-input-bordered w-full max-w-xs" />
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
                <SubmitButton text="Augšupielādēt" />
            </div>
        </form>
    )
}