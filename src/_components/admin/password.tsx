'use client'

import { changePassword } from "@/app/lib/admin-actions"
import { useFormState } from "react-dom"
import { SubmitButton } from "../submit-button"

export default function ChangePassword() {
    const [state, dispatch] = useFormState(changePassword, undefined)

    return (
        <form className="card" action={dispatch}>
            <div className="card-body p-4 md:p-8">
                <h2 className="card-title">Mainīt paroli</h2>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Parole pieslēdzoties būs jāievada formātā<br/>admin:{'[izvēlētā parole šeit]'}</span>
                    </div>
                <input type="text" placeholder="Jaunā parole" name="new" className="input input-bordered" />
                </label>
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
                <SubmitButton text="Mainīt"/>
            </div>
        </form>
    )
}