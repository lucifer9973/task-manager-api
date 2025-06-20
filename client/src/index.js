import React from 'react';
import ReactDOM from 'react-dom/client';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';

const App = () => {
  const [refresh, setRefresh] = React.useState(false);

  const handleTaskAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <AddTask onTaskAdded={handleTaskAdded} />
      <TaskList key={refresh} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
