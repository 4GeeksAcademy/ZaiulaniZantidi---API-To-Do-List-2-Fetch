import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';


const TodoListApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = 'zaiulanizantidi';
  const API_URL = 'https://playground.4geeks.com/todo';


  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users/${username}`);

      if (response.status === 404) {

        await createUser();
        
        const newResponse = await fetch(`${API_URL}/users/${username}`);

        const data = await newResponse.json();
        setTodos(data.todos || []);
       

      } else if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.status}`);

      } else {
        const data = await response.json();
        setTodos(data.todos || []);
      }

    } catch (err) {
      console.error("Error fetching/creating user:", err);
      setError(`Error: ${err.message}. Could not load todos.`);
      
    } finally {
      setLoading(false);
    }
  };

  
  const createUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([]), 
      });
      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }
      console.log("User created successfully!");
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []); 

  const handleAddTodo = async () => {
    if (inputValue.trim() === '') {
      displayMessage("To-do item cannot be empty!", 'warning');
      return;
    }

    const newTodo = {
      label: inputValue.trim(),
      done: false,
    };

    try {
      const res = await fetch(`${API_URL}/todos/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!res.ok) throw new Error(`Failed to add todo: ${res.status}`);

      await fetchTodos();
      setInputValue('');
     

    } catch (err) {
      console.error("Add error:", err);
      
    }
  };

  const handleDeleteTodo = async (todoIdToDelete) => {
    try {
      const res = await fetch(`${API_URL}/todos/${todoIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`Failed to delete todo: ${res.status}`);

      await fetchTodos();
      

    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleResetList = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`Failed to reset list: ${res.status}`);

      await fetchTodos();
      

    } catch (err) {
      console.error("Reset error:", err);
      
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="todo-app-container">

      <h1>My To-Do List</h1>

      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a new to-do item..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddTodo();
            }
          }}
        />
        <button className="add-button" onClick={handleAddTodo} disabled={loading}>
          Add To-Do
        </button>
      </div>

      {loading ? (
        <p className="status-message">Loading todos...</p>
      ) : error ? (
        <p className="status-message error">{error}</p>
      ) : todos.length === 0 ? (
        <p className="status-message" style={{ color: '#44b4b4', fontStyle: 'italic' }}>
          No to-do items yet. Add some!
        </p>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <span className="todo-item-text">{todo.label}</span>
              <button className="delete-button" onClick={() => handleDeleteTodo(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <button className="reset-button" onClick={handleResetList} disabled={loading || todos.length === 0}>
        Reset List
      </button>
    </div>
  );
};


export default TodoListApp;
