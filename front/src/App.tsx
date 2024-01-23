import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import "./styles.css";

interface Task {
  id: number;
  task: string;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>("http://localhost:3000/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleAddTask = async () => {
    if (task.trim() !== "") {
      try {
        const response = await axios.post<Task>("http://localhost:3000/tasks", {
          task,
        });
        setTasks([...tasks, response.data]);
        setTask("");
      } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <div>
        <input
          type="text"
          placeholder="Adicionar nova tarefa"
          value={task}
          onChange={handleInputChange}
        />
        <button onClick={handleAddTask}>Adicionar</button>
      </div>
      <ul>
        {tasks?.map((task) => (
          <li key={task.id}>
            {task.task}
            <button onClick={() => handleDeleteTask(task.id)}>Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default App;
