import React, { createContext } from "react";
import Header from "./components/Header";
import TodoList from "./components/TodoList";

export const DataContext = createContext();

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const data =
      localStorage.getItem("data") && JSON.parse(localStorage.getItem("data"));
    setData(data || {});
  }, []);

  React.useEffect(() => {
    if (data) {
      localStorage.setItem("data", JSON.stringify(data));
    }
  }, [data]);

  return (
    <DataContext.Provider value={{ data, setData }}>
      <Header />
      {data ? <TodoList /> : <p className="text-center text-2xl">Loading...</p>}
    </DataContext.Provider>
  );
}

export default App;
