'use client'

import { FinalTableProps } from "./final-table";

export default function EliteTable({ title, list }: FinalTableProps) {
    return (
        <div className="overflow-x-auto max-w-60 md:max-w-4xl">
            <p className="grow-0">{title}</p>
            <table className="table">
                <thead>
                    <tr>
                        <th className="text-center">Klase/Grupa</th>
                        <th className="text-center">Vārds, Uzvārds</th>
                        <th className="text-center">Balsu skaits</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(({ izvele, count }) => (
                        <tr key={izvele}>
                            <td className="text-center">{izvele.split(',')[0]}</td>
                            <td className="text-center">{izvele.split(',')[1]}</td>
                            <td className="text-center">{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
