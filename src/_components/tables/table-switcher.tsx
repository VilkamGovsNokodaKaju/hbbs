'use client'

import { isValidElement, useState } from "react";

export default function TableSwitcher({ children }: { children: React.ReactNode[]; }) {
    const [page, setPage] = useState({
        page: 0,
        name: children[0] && isValidElement(children[0]) ? (children[0] as React.ReactElement).props.title : '',
    });
    return (
        <>
            {children[page.page]}
            <div className="join self-center">
                <button className="join-item btn" disabled={page.page === 0} onClick={() => {
                    if (page.page - 1 >= 0) {
                        setPage({ page: page.page - 1, name: children[page.page - 1] && isValidElement(children[page.page - 1]) ? (children[page.page - 1] as React.ReactElement).props.title : '' });
                    }
                }}>«</button>
                <button className="join-item btn">{page.name}</button>
                <button className="join-item btn" disabled={page.page === children.length - 1} onClick={() => {
                    if (page.page + 1 < children.length) {
                        setPage({ page: page.page + 1, name: children[page.page + 1] && isValidElement(children[page.page + 1]) ? (children[page.page + 1] as React.ReactElement).props.title : '' });
                    }
                }}>»</button>
            </div>
        </>
    );
}
