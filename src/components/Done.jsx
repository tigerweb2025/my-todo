import ky from 'ky'
import { ListRestart, Trash2 } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast/headless'
import useSWR, { mutate } from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Done() {
    const port = import.meta.env.VITE_PORT

    const { data: todo, error, isLoading } = useSWR(`${port}/todo`, fetcher, { refreshInterval: 1 })

    if (error) return <div>échec du chargement</div>
    if (isLoading) return (
        <div className='text-center p-2'>
            <span className="loading loading-spinner text-accent "></span>
        </div>
    )

    // fonction pour restaurer la tache 
    const restart = async (id) => {
        const todoItem = todo.find(todo => todo.id === id)

        if (!todoItem) {
            console.log("Tache inexistante dans la base de données!")
            return
        }

        const todoUpdate = {
            ...todoItem,
            completed: false
        }

        try {
            await ky.put(`${port}/todo/${id}`, { json: todoUpdate })
            // mutate venant de la libraire swr 
            mutate(`${port}/todo`)
        } catch (error) {
            console.log("erreur de restauration de la tache !");
            toast.error("tache non restaurée !")
        }

    }
    // fonction pour supprimer en envoyant vers la corbeille 
    const deleteToCorbeille = async (id) => {
        const todoItem = todo.find(todo => todo.id === id)

        if (!todoItem) {
            console.log("Tache inexistante dans la base de données!")
            return
        }

        const todoUpdate = {
            ...todoItem,
            deleted: true
        }

        try {
            await ky.put(`${port}/todo/${id}`, { json: todoUpdate })
            // mutate venant de la libraire swr
            mutate(`${port}/todo`)
        } catch (error) {
            console.log("erreur de restauration de la tache !");
            toast.error("tache non restaurée !")
        }

    }
    const tache = todo.filter(todo => todo.completed == true && todo.deleted == false)
    const taches = tache.reverse()
    return (
        <div className='flex flex-col gap-2 p-4'>
            <p className='text-xl my-2 font-bold text-white'>Done</p>
            {
                taches.map(todo => (
                    <ul key={todo.id} className='flex justify-between items-center '>
                        {/* checkbox et tache */}
                        <div className='flex gap-2 items-center bg-white w-full rounded-md px-4 py-2'>
                            <li className='text-lg'>{todo.tache}</li>
                            {/* bouttons */}
                            <div className='flex items-center gap-3 ml-auto'>
                                <button onClick={() => restart(todo.id)}><ListRestart size={24} color='green' /></button>
                                <button onClick={() => deleteToCorbeille(todo.id)}><Trash2 size={24} color='red' /></button>
                            </div>
                        </div>

                    </ul>
                ))
            }
        </div>
    )
}
