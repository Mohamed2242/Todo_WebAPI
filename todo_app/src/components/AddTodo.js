import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddTodo = () => {
  const [todo, setTodo] = useState({
    description: '',
    categoryId: '',
    dueDate: '',
    statusId: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodo({
      ...todo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7051/Home/add', todo);
      navigate('/');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <div className="container">
      <header class="bg-primary text-white text-center">
            <h1 class="m-3 p-3">New Task</h1>
        </header>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={todo.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="categoryId"
            className="form-select"
            value={todo.categoryId}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="work">Work</option>
            <option value="home">Home</option>
            <option value="ex">Exercise</option>
            <option value="shop">Shopping</option>
            <option value="call">Contact</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            name="dueDate"
            className="form-control"
            value={todo.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="statusId"
            className="form-select"
            value={todo.statusId}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="closed">Completed</option>
            <option value="open">Open</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary mx-1">
          Add Task
        </button>
        <button type="button" className="btn btn-danger mx-1" onClick={() => navigate('/')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddTodo;
