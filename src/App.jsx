import { onMount, createSignal, batch } from "solid-js";
import { createLocalStore, removeIndex } from "../src/stores";

function App() {
  onMount(async () => {
    const res = await fetch(`https://jonknoll.dev/wp-json/todo/v1/todos`);
    const response = await res.json();
    setTodos(response.todos);
    setLoading(false);
  });

  const [loading, setLoading] = createSignal(true);
  const [newTitle, setTitle] = createSignal("");
  const [todos, setTodos] = createLocalStore("todos", []);

  // Functions
  const toggleTodo = async (id) => {
    setLoading(true);
    const index = todos.findIndex((todo) => todo.id === id);
    const todo = todos.find((todo, index) => todo.id === id);
    await fetch(`https://jonknoll.dev/wp-json/todo/v1/update/?id=${id}&done=${!todo.done}`).then((res) => res.json());
    setTodos(index, "done", !todo.done);
    setLoading(false);
  };

  const removeTodo = async (id) => {
    setLoading(true);
    const index = todos.findIndex((todo) => todo.id === id);
    await fetch(`https://jonknoll.dev/wp-json/todo/v1/remove/?id=${id}`).then((res) => res.json());
    setTodos((todo) => removeIndex(todo, index));
    setLoading(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newTodo = await fetch(`https://jonknoll.dev/wp-json/todo/v1/add/?title=${newTitle()}`).then((res) =>
      res.json()
    );
    const newTodos = [{ id: newTodo.id, title: newTodo.title, done: false }, ...todos];
    batch(() => {
      setTodos(newTodos);
      setTitle("");
      setLoading(false);
    });
  };
  // updateTodos - id;
  // removeTodos - id;
  // addTodos - title;

  return (
    <section className="page">
      <h1>Basic ToDo (Solid.js)</h1>
      <div className="container">
        <Show when={loading()}>
          <div className="loading">Loading...</div>
        </Show>
        <ul>
          <For each={todos}>
            {(todo, i) => (
              <li>
                <button onClick={() => toggleTodo(todo.id)} className="done">
                  <Show when={todo.done}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  </Show>
                </button>
                <span>{todo.title}</span>
                <button onClick={() => removeTodo(todo.id)} className="remove">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                    <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                  </svg>
                </button>
              </li>
            )}
          </For>
        </ul>
        <form onSubmit={addTodo}>
          <div>
            <label for="addNew">Add New Item:</label>
            <input
              required
              type="text"
              value={newTitle()}
              id="addNew"
              onInput={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
            Add
          </button>
        </form>
      </div>
    </section>
  );
}

export default App;
