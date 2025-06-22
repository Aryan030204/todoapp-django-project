import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const token = localStorage.getItem('access');
  const headers = { Authorization: `Bearer ${token}` };

  const getTodos = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/todos/', { headers });
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos', err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post('http://localhost:8000/api/todos/', { title: newTodo }, { headers });
      setTodos([...todos, res.data]);
      setNewTodo('');
    } catch (err) {
      console.error('Failed to add todo', err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.patch(`http://localhost:8000/api/todos/${id}/`, { completed: !completed }, { headers });
      const updated = todos.map(todo => (todo.id === id ? res.data : todo));
      setTodos(updated);
    } catch (err) {
      console.error('Failed to toggle todo', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/todos/${id}/`, { headers });
      const updated = todos.filter(todo => todo.id !== id);
      setTodos(updated);
    } catch (err) {
      console.error('Failed to delete todo', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    window.location.href = '/login';
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">📝 Todo App</h1>
          <button onClick={handleLogout} className="text-red-500 font-medium hover:underline">
            Logout
          </button>
        </div>

        <div className="flex mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
            className="flex-grow border rounded-l px-4 py-2 focus:outline-none"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {todos.length === 0 ? (
          <p className="text-center text-gray-500">No todos available.</p>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center bg-blue-50 border p-4 rounded"
              >
                <div
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`flex-1 cursor-pointer text-lg ${
                    todo.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {todo.title}
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoList;
