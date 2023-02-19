import { useContext, useState } from 'react'
import './App.css'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import TodoList from './Components/TodoList'
import { TaskContext } from './context/taskContext'
import { Task } from './types'

type PostTask = {
  title: string,
  content: string
}

function App() {

  const queryClient = useQueryClient();
  const [taskState, setTaskState] = useState<Task[]>([])

  const getTasks = () => {
    return axios
      .get('http://localhost:3006/tasks')
      .then((res) => {
        setTaskState(res.data)
        return res.data
      })
  }

  const postTasks = ({title, content}: PostTask) => {
    return axios
      .post<Task>('http://localhost:3006/tasks/new', {
        title,
        content
      })
      .then((res) => {
        return res.data
      })
  }

  const handleFormSubmit = (title: string, content: string) => {
    mutation.mutate({title, content})
  }

  const mutation = useMutation({
    mutationFn: postTasks,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })


  const query = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  return (
    <TaskContext.Provider value = {{
      task: taskState,
      setTask: setTaskState
    }}>
    <div className="background">
    </div>
      <div className="container">
        <TodoList
          OnSubmit = {(title: string, content: string) => {
            handleFormSubmit(title, content);
          }}
        />
      </div>
    </TaskContext.Provider> 
  )
}

export default App
