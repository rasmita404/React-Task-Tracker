import {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './MyComponents/Header'
import Tasks from './MyComponents/Tasks'
import AddTask from './MyComponents/AddTask'
import Footer from './MyComponents/Footer'
import About from './MyComponents/About'

function App() {
  //show add task form when green add button is clicked
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, settasks] = useState([])
  
  //useEffect hook
  useEffect(() => {
    const getTasks = async ()=>{
      const tasksFromServer = await fetchTasks();
      settasks(tasksFromServer);
    }
    getTasks()
  }, []);
  //fetch tasks
  const fetchTasks = async()=>{
    const res = await fetch('http://localhost:3002/tasks')
    const data = await res.json();
    return data;
  }
  //fetch task
  const fetchTask = async(id)=>{
    const res = await fetch(`http://localhost:3002/tasks/${id}`)
    const data = await res.json();
    return data;
  }
  //Add task
  const addTask =async (task)=>{
    //console.log(task);
    const res = await fetch('http://localhost:3002/tasks', {
      method:'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const newTask = await res.json();
    settasks([...tasks, newTask]);
  }
  
  //delete task
  const deleteTask = async (id)=>{
    await fetch(`http://localhost:3002/tasks/${id}`, { method: 'DELETE'})
    settasks(tasks.filter((task) => task.id !== id));
    //console.log('delete ', id);
  }

  //Toggle Reminder:- on double click on a task, it's reminder is set to true and it's color turns green(in css)
  const toggleReminder = async (id)=>{
    const taskToToggle = await fetchTask(id);
    const updateReminder = {...taskToToggle, reminder: !taskToToggle.reminder}
    
    const res = await fetch(`http://localhost:3002/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updateReminder)
    })

    const data = await res.json();
    //settasks is for ui
    settasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task));
    //console.log('toggle ', id);
  }

  return (
    //the below code is jsx(not html)
    //this classNames App, App-header etc are from jsx
    //js code is written inside { } here
    //wrap with <> </> atleast- must have one parent element
    <Router>
      <div className='container'>
        <Header title="Task Tracker" 
          onAdd={()=>setShowAddTask(!showAddTask)}
          showAdd = {showAddTask}
        />
        <Routes>
          <Route path='/' element={
            <>
              {showAddTask && <AddTask onAddTask={addTask}/>}
              {
                tasks.length>0 ?(<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>)
                         : ( 'No tasks to show!!')
              }
            </>
          }
          />
          <Route path='/about' element={<About/>} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
