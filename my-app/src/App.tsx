import "./App.css";
import "phosphor-react";
import TodoList from "../src/components/ToDoList";

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <p>Gruppen To Do Liste</p>
          <TodoList />
        </header>
      </div>
    </>
  );
}

export default App;
