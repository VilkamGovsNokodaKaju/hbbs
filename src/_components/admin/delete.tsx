'use client'

import { deleteEverything } from "@/app/lib/admin-actions"
import { useRef, useState } from "react"
import { SubmitButton } from "../submit-button"
import { redirect } from "next/navigation"

export default function Delete() {
    const deleteModal = useRef<HTMLDialogElement>(null)
    const [error, setError] = useState({show: false, message: ''})
    
    const handleDelete = async () => {
        const result = await deleteEverything()
        if (result.success) {
            redirect('/admin')
        } else {
            deleteModal.current!.close()
            setError({show: true, message: result.message})
        }
    }

    return (
        <div className="card">
            <div className="card-body p-4 md:p-8">
                <h2 className="card-title">Attiestatīt balsis</h2>
                <p className="self-center grow-0">Uzmanību! Nospiežot šo pogu, tiks dzēsti VISI balsošanas dati, kuri saglabāti sistēmā!</p>
                <div className="card-actions justify-center" onClick={() => deleteModal.current!.showModal()}>
                    {error?.show && 
                        <div role='alert' className='alert alert-error'>
                            <span className='material-symbols-outlined'>error</span>
                            <span>{error.message}</span>
                        </div>
                    }
                    <button className="btn btn-error">Attiestatīt balsis</button>
                    <dialog ref={deleteModal} className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Apstiprinājums</h3>
                            <p className="py-4">Nospiežot pogu, tiks dzēsti VISI balsošanas dati, kuri saglabāti sistēmā!</p>
                            <div className="modal-action justify-between">
                                <form method="dialog">
                                    <button className="btn btn-warning">Atcelt</button>
                                </form>
                                <form action={handleDelete}>
                                    <SubmitButton text="Apstiprināt" error />
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    )
}
