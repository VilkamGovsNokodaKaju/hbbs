'use client'

import { SubmitButton } from "@/_components/submit-button"
import { generateCodes } from "@/app/lib/admin-actions"
import { saveAs } from "file-saver"
import { useState } from "react"

export default function CodeGenerator() {
    const [state, setState] = useState(undefined as {success: boolean, message: string, file?: string} | undefined);

    const handleSubmit = async (formData: FormData) => {
        const { success, message, file } = await generateCodes(formData);
        setState({ success, message });
        if (success) {
            const b64 = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${file}`;
            saveAs(b64, 'kodi.docx');
        }
    };

    return (
        <form className="card" action={handleSubmit}>
            <div className="card-body p-4 md:p-8">
                <h2 className="card-title">Ģenerēt piekļuves kodus</h2>
                <div className="join">
                    <select name="type" className="select select-bordered join-item" defaultValue="Veids">
                        <option disabled>Veids</option>
                        <option value="new">Jauni</option>
                        <option value="more">Papildus</option>
                    </select>
                    <input type="number" min={1} placeholder="Kodu skaits" name="amount" className="input input-bordered w-full max-w-xs join-item" />
                </div>
                <div className="card-actions justify-end">
                    {state && <div role="alert" className={`alert ${state.success ? 'alert-success' : 'alert-error'}`}>
                        {state.success ? <span className="material-symbols-outlined">check_circle</span> : <span className="material-symbols-outlined">error</span>}
                        <span>{state.message}</span>
                    </div>}
                    <SubmitButton text="Ģenerēt" />
                </div>
            </div>
        </form>
    );
}
