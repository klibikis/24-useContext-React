import { createContext } from "react"
import { Task } from "../types"

type TaskContextType = {
    task: Task[],
    setTask?: React.Dispatch<React.SetStateAction<Task[]>>
}

export const TaskContext = createContext<TaskContextType>({
    task: []
})