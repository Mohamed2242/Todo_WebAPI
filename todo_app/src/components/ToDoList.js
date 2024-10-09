import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    due: "all",
    status: "all"
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const response = await axios.get('https://localhost:7051/Home');
      setTodos(response.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const fetchFilteredTodos = async () => {
    const filterString = `${filters.category}-${filters.due}-${filters.status}`;
    try {
      const response = await axios.get(`https://localhost:7051/Home/Filter/filterString=${filterString}`);
      // Update your state with the filtered tasks
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching filtered todos:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      due: "all",
      status: "all"
    });
    fetchFilteredTodos(); // Fetch all tasks without any filters
  };

  const handleEdit = (taskId) => {
    navigate(`/Edit/${taskId}`);
  };

  const handleMarkComplete = async (taskId) => {
    try {
      await axios.post(`https://localhost:7051/Home/MarkComplete/${taskId}`);
      fetchFilteredTodos();
    } catch (error) {
      console.error('Error marking task complete:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`https://localhost:7051/Home/Delete/${taskId}`);
      fetchFilteredTodos();
    } catch (error) {
      console.error('Error marking task complete:', error);
    }
  };

  const handleDeleteCompleted = async () => {
    try {
      await axios.delete('https://localhost:7051/Home/DeleteComplete');
      fetchFilteredTodos();
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
    }
  };

  return (
    <div className="container">
      <header class="bg-primary text-white text-center">
            <h1 class="m-3 p-3">My Tasks</h1>
        </header>
      <div className="row">
        <div className="col-md-2">
          <form>
            <div className="mb-3">
              <label htmlFor="category">Category:</label>
              <select
                className="form-select"
                name="category"
                onChange={handleFilterChange}
                value={filters.category}
              >
                <option value="all">All</option>
                <option value="work">Work</option>
                <option value="home">Home</option>
                <option value="ex">Exercise</option>
                <option value="shop">Shopping</option>
                <option value="call">Contact</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="due">Due:</label>
              <select
                className="form-select"
                name="due"
                onChange={handleFilterChange}
                value={filters.due}
              >
                <option value="all">All</option>
                <option value="past">Past</option>
                <option value="today">Today</option>
                <option value="future">Future</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="status">Status:</label>
              <select
                className="form-select"
                name="status"
                onChange={handleFilterChange}
                value={filters.status}
              >
                <option value="all">All</option>
                <option value="closed">Completed</option>
                <option value="open">Open</option>
              </select>
            </div>

            <button type="button" className="btn btn-primary mx-1" onClick={fetchFilteredTodos}>
              Filter
            </button>
            <button type="button" className="btn btn-primary mx-1" onClick={clearFilters}>
              Clear
            </button>
          </form>
        </div>
        <div className="col-md-10">
          <table className="table table-bordered table-striped mt-2">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="w-25"></th>
              </tr>
            </thead>
            <tbody>
              {todos.map((task) => (
                <tr key={task.id}>
                  <td>{task.description}</td>
                  <td>{task.category.name}</td>
                  <td className={task.overdue ? 'bg-warning' : ''}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td>{task.status.name}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm mx-1"
                      onClick={() => handleEdit(task.id)}
                      style={{ fontWeight: 'bold' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm mx-1"
                      onClick={() => handleDeleteTask(task.id)}
                      style={{ fontWeight: 'bold' }}
                    >
                      Delete
                    </button>
                    {task.statusId === 'open' && (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleMarkComplete(task.id)}
                        style={{ fontWeight: 'bold' }}
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between mt-2">
            <button className="btn btn-primary" onClick={() => navigate('/Add')}>
              Add new task
            </button>
            <button className="btn btn-danger" onClick={handleDeleteCompleted}>
              Delete completed tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
