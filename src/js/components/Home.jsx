import React, { useState, useEffect } from 'react';

const TodoListApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const username = 'zaiulanizantidi';

  useEffect(() => {
    // First create user (if not exists), then fetch todos
    const initUserAndFetchTodos = async () => {
      try {
        await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const res = await fetch(`https://playground.4geeks.com/todo/todos/${username}`);
        if (!res.ok) throw new Error("Failed to fetch todos");
        const data = await res.json();

        // Save fetched todos to state
        setTodos(data.todos || []);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };

    initUserAndFetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (inputValue.trim() === '') {
      console.log("Input cannot be empty!");
      return;
    }

    const newTodo = {
      label: inputValue.trim(),
      done: false,
    };

    try {
      const res = await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!res.ok) throw new Error("Failed to add todo");

      const createdTodo = await res.json();
      setTodos([...todos, createdTodo]);
      setInputValue('');
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleDeleteTodo = async (idToDelete) => {
    try {
      const res = await fetch(`https://playground.4geeks.com/todo/todos/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      setTodos(todos.filter(todo => todo.id !== idToDelete));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleResetList = async () => {
    // Optional: delete all items individually
    for (const todo of todos) {
      await handleDeleteTodo(todo.id);
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
        <button className="add-button" onClick={handleAddTodo}>
          Add To-Do
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="text-muted" style={{ fontSize: '1.2rem', color: '#1ee9e9', fontStyle: 'italic' }}>
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

      <button className="reset-button" onClick={handleResetList} disabled={todos.length === 0}>
        Reset List
      </button>
    </div>
  );
};

export default TodoListApp;
