import { Edit2, MessageCircleWarningIcon, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ky from 'ky'
import useSWR, { mutate } from 'swr'
import { useState } from 'react'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Todo() {
    const port = import.meta.env.VITE_PORT
    const { data: todo, error, isLoading, } = useSWR(`${port}/todo`, fetcher, { refreshInterval: 100 })
    const { register, handleSubmit, reset } = useForm()

    const [taskId, setTaskId] = useState(null) // recuperer l'id de la tache a editer
    const [editTask, setEditTask] = useState("Hello") // la nouvelle valeur de la tache a editer
    const date = new Date()

    const onSubmit = async (data) => {

        const newTodo = {
            ...data,
            completed: false,
            deleted: false,
            day: date.getDay(),
            month: date.getMonth(),
            year: date.getFullYear(),
            hours: date.getHours(),
            minutes: date.getMinutes()
        }

        try {
            await ky.post(`${port}/todo`, { json: newTodo })
                .json()
                .then(() => {
                    toast.success("une tache est ajoutée !")
                    mutate(`${port}/todo`)
                    reset()
                })

        } catch (error) {
            toast.error("erreur d'ajout de cette tache !")
        }

    }
    // Affichage d'echec de chargement ou de loading
    if (error) return <div>Echec de chargement... <MessageCircleWarningIcon /></div>
    if (isLoading) return (
        <div className='text-center p-2'>
            <span className="loading loading-spinner text-accent"></span>
        </div>
    )


    // Fonction Pour envoyer la tache vers l'onglet Done
    const handlechecked = async (id) => {

        // on recupere la tache checker dans todoItem
        const todoItem = todo.find(todo => todo.id === id)

        if (!todoItem) {
            console.log("cette tache n'existe pas");
            return
        }
        // on change l'element (complete: false) de la tache a (complete: true)
        const todoUpdate = {
            ...todoItem,
            completed: true
        }
        // on fait la requete avec ky pour update la tache
        try {
            await ky.put(`${port}/todo/${id}`, { json: todoUpdate })
            mutate(`${port}/todo`)
        } catch (error) {
            console.error("Erreur de Completion de tâche :", error)
            toast.error("Erreur de Completion de tâche !")
        }
    }

    // Fonction envoyer la tache vers l'onglet Corbeille
    // meme chose que la fonction precedente mais de (delete:false) a (delete:true)
    const handledelete = async (id) => {

        const todoItem = todo.find(todo => todo.id === id)

        if (!todoItem) {
            toast.error("cette tache n'existe pas");
            return
        }
        const todoUpdate = {
            ...todoItem,
            deleted: true
        }
        try {
            await ky.put(`${port}/todo/${id}`, { json: todoUpdate })
            mutate(`${port}/todo`)
        } catch (error) {
            console.error("Erreur de Completion de tâche :", error)
            toast.error("Erreur de Completion de tâche !")
        }
    }
    //  ========= Section de la modification d'une tache en ouvrant un modal(fenetre) ==========

    // apres avoir cliquer sur le boutton <Edit2/> pour modifier une tache

    // on recupere la valeur de la nouvelle tache avec handleChangeEdit
    const handleChangeEdit = (e) => {
        setEditTask(e.target.value)
    }
    // mais si on change d'avis de modifer une tache on ferme le modale d'edition
    const handleCancelEdit = () => {
        document.getElementById('my_modal_5').close()
    }

    // Fonction de boutton Save pour modifier une tache apres l'ajout avec 
    const onSubmit2 = async () => {

        if (taskId) {

            const todoUpdate = {
                ...todo.find(t => t.id === taskId), // tous les donnes de la tache selectionnée grace a son id
                tache: editTask // Mettre à jour la tâche avec le nouveau texte
            }
            //requete avec ky pour uodate la tache grace a son id
            try {
                await ky.put(`${port}/todo/${taskId}`, { json: todoUpdate })
                mutate(`${port}/todo`)
                toast.success("Tâche modifiée !")
                // Réinitialiser le formulaire
                document.getElementById('my_modal_5').close() // Fermer le modal
            } catch (error) {
                console.error("Erreur de modification de tâche :", error)
                toast.error("Echec de modification !")
            }
        }
    }


    // Filtrage pour afficher les tache non complete et non selectionées 
    const tache = todo.filter(todo => todo.completed == false && todo.deleted == false)
    // Filter par taches recentes 
    const taches = tache.reverse()


    return (

        // ==========  form
        <div className='flex flex-col gap-2 p-4'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex gap-2'>
                <input
                    {...register("tache", { required: "Champs doit pas etre vide" })}
                    type="text"
                    placeholder='New task...'
                    className='input input-bordered w-full' />
                <button className='btn border-none hover:bg-black hover:text-white bg-green-500'> New </button>
            </form>

            <p className='text-xl my-2 font-bold text-white'>Todos</p>

            {
                tache.map(todo => (
                    <ul key={todo.id} className='flex justify-between items-center'>

                        <div className='flex gap-2 bg-white w-full rounded-md py-1 px-2'>

                            {/* tasks and date */}

                            <div className='flex gap-2 items-center w-full'>
                                <input
                                    type="checkbox"
                                    onChange={() => handlechecked(todo.id)}
                                    className='checkbox' />
                                <li className='text-lg'>{todo.tache}</li>
                                <li className='text-slate-400 text-sm ml-auto'>{todo.year}/{todo.month}/{todo.day} {todo.hours}:{todo.minutes}</li>
                            </div>

                            {/* bouttons */}

                            {/* ============== Edit and delete section section =================== */}
                            <div className='flex items-center gap-1 ml-auto'>

                                {/* open modale and get id's task*/}

                                {/* Modale */}

                                {/* Show Modale with id of selected task */}
                                {/* Open the modal using document.getElementById('ID').showModal() method */}
                                <button className="outline-none" onClick={() => {
                                    setTaskId(todo.id)
                                    document.getElementById('my_modal_5').showModal()
                                }

                                }><Edit2 size={22} color='green' /></button>
                                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                                    <div className="modal-box">
                                        <h3 className="font-bold text-lg">Edit your task !</h3>

                                        <div className="modal-action">
                                            <form method="dialog" className='flex flex-col gap-2 w-full'>
                                                {/* if there is a button in form, it will close the modal */}
                                                <input
                                                    type="text"
                                                    className='p-2 border-2 outline-none rounded-lg'
                                                    placeholder="Edit Task..."

                                                    onChange={handleChangeEdit}

                                                />
                                                <div className='flex justify-end gap-3'>
                                                    <button
                                                        className="btn btn-outline"
                                                        onClick={onSubmit2}>
                                                        Save
                                                    </button>
                                                    <button className="btn btn-outline text-black"
                                                        onClick={handleCancelEdit}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>                                {/* delete button */}

                                <button onClick={() => handledelete(todo.id)} ><Trash2 size={22} color='red' /></button>

                            </div>
                        </div>

                    </ul>
                ))
            }
        </div>
    )
}
