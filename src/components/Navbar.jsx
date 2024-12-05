import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
    return (
        <div className='p-2 border-b-2 my-2 font-bold'>
            <nav className='flex gap-2 w-fit px-2 py-1 bg-slate-100 rounded-md' >
                <NavLink className="active:bg-slate-400 p-1 rounded-md" to="/">Todo</NavLink>
                <NavLink className="active:bg-slate-400 p-1 rounded-md" to="/done">Done</NavLink>
                <NavLink className="active:bg-slate-400 p-1 rounded-md" to="/trash">Trash</NavLink>
            </nav>
        </div>
    )
}
