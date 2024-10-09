import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TodoList from './components/ToDoList';
import AddTodo from './components/AddTodo';
import EditTodo from './components/EditTodo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/Add" element={<AddTodo />} />
        <Route path="/Edit/:id" element={<EditTodo />} />
      </Routes>
    </Router>
  );
}

export default App;
