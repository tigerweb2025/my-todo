import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function App() {
    return (
        <div className='mt-10 mx-auto w-5/6 bg-slate-700 md:w-4/6 rounded-md'>
            <Navbar />
            <div>
                <Outlet />
            </div>
        </div>
    )
}
