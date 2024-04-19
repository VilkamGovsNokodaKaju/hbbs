'use client'

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { generateUUID, removeNomin, updateNomin } from "@/app/lib/admin-actions";
import { Nomin } from "@/app/lib/actions";
import { UUID } from "crypto";

export interface NominTableProps {
    type: 'skolenu' | 'skolotaju';
    list: Nomin[];
}


export default function NominTable({ type, list }: NominTableProps) {
    const [internalList, setInternalList] = useState(list.filter(n => n.tips === type));
    
    function removeFromList(id: UUID) {
        setInternalList(internalList.filter(n => n.id !== id));
    }

    return (
        <div className="overflow-x-auto max-w-60 md:max-w-4xl">
            <table className="table">
                <thead>
                    <tr>
                        <th className="text-center">Virsraksts</th>
                        <th className="text-center">Apraksts</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {internalList.map((n) => {
                        return <NominRow key={n.id} n={n} remove={removeFromList} />;
                    })}
                </tbody>
            </table>
            <center>
                <button className="btn btn-square btn-success" onClick={async () => setInternalList([...internalList, { id: await generateUUID(), virsraksts: '', apraksts: '', tips: type }])}>
                    <span className="material-symbols-outlined">add</span>
                </button>
            </center>
        </div>
    );
}

function NominRow({ n, remove }: { n: Nomin; remove: (id: UUID) => void; }) {
    const [deleted, setDeleted] = useState(false);
    const [nomin, setNomin] = useState(n);
    const [error, setError] = useState({ show: false, message: '' });
    const [editing, setEditing] = useState(false);
    const { pending } = useFormStatus();
    if (deleted) {
        return (
            <tr key={n.id}>
                <td colSpan={3}>
                    <div role='alert' className='alert alert-success'>
                        <span className='material-symbols-outlined'>check_circle</span>
                        <span>Nominācija dzēsta</span>
                        <button className="btn btn-square btn-success" onClick={() => remove(n.id)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </td>
            </tr>
        );
    }
    return (
        <tr key={n.id}>
            <td className="text-center text-nowrap">
                {editing ?
                    <input form={n.id} name="virsraksts" className="input input-bordered w-sm" type="text" defaultValue={nomin.virsraksts} />
                    :
                    nomin.virsraksts}
            </td>
            <td className="text-justify text-balance">
                {editing ?
                    <textarea form={n.id} name="apraksts" className="textarea textarea-bordered w-full min-w-96" defaultValue={nomin.apraksts} />
                    :
                    nomin.apraksts}
            </td>
            <td className="join">
                {error.show &&
                    <div role='alert' className='alert alert-error mr-2'>
                        <span className='material-symbols-outlined'>error</span>
                        <span>{error.message}</span>
                    </div>}
                {editing ?
                    <form id={n.id} action={async (formData: FormData) => {
                        setError({ show: false, message: '' });
                        const result = await updateNomin(formData, n.id, n.tips);
                        if (result.success) {
                            setNomin({ ...nomin, virsraksts: formData.get('virsraksts') as string, apraksts: formData.get('apraksts') as string });
                        } else {
                            setError({ show: true, message: result.message });
                        }
                    }} onSubmit={() => setEditing(false)}>
                        <button className="btn btn-square btn-success mr-2" type="submit" aria-disabled={pending}>
                            <span className="material-symbols-outlined">save</span>
                        </button>
                    </form>
                    :
                    <button className="btn btn-square btn-warning mr-2" onClick={() => setEditing(true)}>
                        <span className="material-symbols-outlined">edit</span>
                    </button>}
                <button className="btn btn-error btn-square" onClick={async () => {
                    const result = await removeNomin(n.id);
                    if (result.success) {
                        setDeleted(true);
                    } else {
                        setError({ show: true, message: result.message });
                    }
                }}>
                    <span className="material-symbols-outlined">delete</span>
                </button>
            </td>
        </tr>
    );
}