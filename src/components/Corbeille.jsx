import ky from 'ky'
import { ListRestart, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import useSWR, { mutate } from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Corbeille() {
    const port = import.meta.env.VITE_PORT

    const { data: todo, error, isLoading } = useSWR(`${port}/todo`, fetcher, { refreshInterval: 1 })

    if (error) return <div>éEchec du Chargement</div>
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
            completed: false,
            deleted: false
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
    const deleteTodo = async (id) => {
        const todoItem = todo.find(todo => todo.id === id)

        if (!todoItem) {
            console.log("Tache inexistante dans la base de données!")
            return
        }
        try {
            await ky.delete(`${port}/todo/${id}`, { json: todoItem })
            toast.success("Tache supprimée definitivement !")
            // mutate venant de la libraire swr 
            mutate(`${port}/todo`)
        } catch (error) {
            toast.error("Erreur de suppression !")
        }

    }
    const deleteAll = async () => {
        try {
            const deleteAllpromise = todo.map(getTask => {
                getTask.deleted ? // si deleted == true 
                    ky.delete(`${port}/todo/${getTask.id}`).json() : null
            })
            // on attends que toutes les suppressions soit termines
            toast.success("Taches supprimées !")
            await Promise.all(deleteAllpromise)
            mutate(`${port}/todo`)
        } catch (error) {
            console.log("erreur de suppression de la tache !", error);
            toast.error("Erreur de suppression !")
        }
    }


    // filtrage en affichant les elements supprimés
    const tache = todo.filter(todo => todo.deleted == true)
    return (
        <div className='flex flex-col gap-2 p-4'>
            <div className='flex justify-between items-center'>
                <p className='text-xl my-2 font-bold text-white'>Taches supprimées</p>
                <button onClick={deleteAll} className='btn hover:bg-black text-white bg-red-500 btn-sm border-none'>Tout supprimer</button>
            </div>
            {
                tache.map(todo => (
                    <ul key={todo.id} className='flex justify-between items-center '>
                        {/* checkbox et tache */}
                        <div className='flex bg-white w-full rounded-md px-4 py-2'>
                            <li className=' text-lg mr-auto'>{todo.tache}</li>
                            {/* bouttons */}
                            <div className='flex items-center gap-3'>
                                <button onClick={() => restart(todo.id)}><ListRestart size={24} color='green' /></button>
                                <button onClick={() => deleteTodo(todo.id)}><Trash2 size={22} color='red' /></button>
                            </div>
                        </div>

                    </ul>
                ))
            }
        </div>
    )
}
