import { useContext, useState } from "react";
import style from './TodoList.module.scss'
import { TaskContext } from "../context/taskContext";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import axios from "axios";

type TodoListProps = {
    OnSubmit: (title: string, content: string) => void;
}
type UpdateTask = {
    id: number,
    isTaskDone: boolean
}

export const TodoList = ({OnSubmit}: TodoListProps) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const todoTask = useContext(TaskContext)

    const updateTaskIsDone = ({isTaskDone, id}: UpdateTask) => {
        return axios
            .patch('http://localhost:3006/tasks/patch', {
                id,
                isTaskDone
            })
            .then((res) => {
                return res.data
            })
    }

    const deleteTask = ( id: number ) => {
        return axios
            .delete('http://localhost:3006/tasks/delete/'+id)
            .then((res) => {
                return res.data
            })
    }

    const DeleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })

    const UpdateMutation = useMutation({
        mutationFn: updateTaskIsDone,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })

    const handleTaskIsDone = (isTaskDone: boolean, id: number) => {
        UpdateMutation.mutate({isTaskDone, id})
    }

    return (
        <>
        <div className={style.todoWrapper}>
            <form className={style.form}
                onSubmit = {(e) => {
                    e.preventDefault();
                    OnSubmit(title, content);
                    setTitle('');
                    setContent('');
                }}>
                <h1 className={style.title}>Todo List</h1>
                <label className={style.label}>
                    Task Title
                    <input 
                    value = {title}
                    placeholder="Task name" 
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                    />
                </label>
                <label className={style.label}>
                    Task Content
                    <input 
                    value = {content}
                    placeholder="Task content"
                    onChange={(e) => {
                        setContent(e.target.value)
                    }}
                    />
                </label>
                <button className={style.submit}>Add task</button>
            </form>
            <div className={style.form}>
                {todoTask.task?.map((todo) => (
                <div 
                    key={todo._id} 
                    className = {todo.isDone ? `${style.done} ${style.todoTask}` : style.todoTask}
                    >
                        <div className={style.todoInfo}>
                            <p>{todo.title}</p>
                        </div>
                        <div className={style.todoInfo}>
                            <p>{todo.content}</p>
                        </div>
                        <div className={style.todoInfo}>
                            <p>{todo.date}</p>
                        </div>
                    <div className={style.todoOptions}>
                        <button 
                            className={style.optionButton}
                            onClick = {() => {
                                let isTaskDone = !todo.isDone
                                handleTaskIsDone(isTaskDone, todo._id)
                            }}>
                            ✓
                        </button>
                        <button 
                            className={style.optionButton}
                            onClick = {() => {
                                DeleteMutation.mutate(todo._id)
                            }}
                            >✕</button>
                    </div>
                </div>
                ))}
            </div>
            </div> 
        </>
    );
};

export default TodoList;
