import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';


const TodoListApp = () => {
  
  const [todos, setTodos] = useState([]);
  
  const [inputValue, setInputValue] = useState('');

   useEffect(() => {

     fetch ('https://playground.4geeks.com/todo/todos/Zaiulani.Zantidi')
     .then((res) => res.json())
     .then((data) => {
       console.log(data);
     });

   }, []);
  

  fetch ('https://playground.4geeks.com/todo/todos/Zaiulani.Zantidi', {
        method: "POST",
        body: JSON.stringify(todos),
        headers: {
          "Content-Type": "application/json"
        }
     })
     .then(resp => {
          console.log(resp.ok); 
          console.log(resp.status);
          return resp.json(); 
     })
     .then(data => {

          console.log(data); 
     })
     .catch(error => {
          console.log(error);
     });

  
  fetch ('https://playground.4geeks.com/todo/todos/Zaiulani.Zantidi', {
        method: "DELETE",
        body: JSON.stringify(todos),
        headers: {
          "Content-Type": "application/json"
        }
     })
     .then(resp => {
          console.log(resp.ok); 
          console.log(resp.status);
          return resp.json(); 
     })
     .then(data => {

          console.log(data); 
     })
     .catch(error => {
          console.log(error);
     });

  
  const handleAddTodo = () => {

    if (inputValue.trim() === '') {

      console.log("Input cannot be empty!");
      return;
    }

    const newTodo = {
      id: Date.now(), 
      text: inputValue.trim(), 
    };

   
    setTodos([...todos, newTodo]);

    setInputValue('');
  };

  const handleDeleteTodo = (idToDelete) => {

    const updatedTodos = todos.filter(todo => todo.id !== idToDelete);
    setTodos(updatedTodos);
  };

  const handleResetList = () => {
    setTodos([]);
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
              <span className="todo-item-text">{todo.text}</span>
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TodoListApp />);

export default TodoListApp;
