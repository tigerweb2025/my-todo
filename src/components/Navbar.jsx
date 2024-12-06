import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
    return (
        <div className='p-2 border-b-2 my-2 font-bold'>
            <nav className='flex gap-2 w-fit px-2 py-1 bg-slate-100 rounded-md' >
                {/* TODO */}
                <NavLink
                    className={({ isActive }) =>
                        `p-1 rounded-md ${isActive ? 'bg-slate-400 text-white' : ''}`
                    }
                    to="/"
                >
                    Todo
                </NavLink>

                {/* DONE */}
                <NavLink
                    className={({ isActive }) =>
                        `p-1 rounded-md ${isActive ? 'bg-slate-400 text-white' : ''}`
                    }
                    to="/done"
                >
                    Done
                </NavLink>

                {/* Trash */}
                <NavLink
                    className={({ isActive }) =>
                        `p-1 rounded-md ${isActive ? 'bg-slate-400 text-white' : ''}`
                    }
                    to="/trash"
                >
                    Trash
                </NavLink>
            </nav>
        </div>
    )
}