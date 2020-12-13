import React, { useContext, useEffect } from "react";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import TodoScreen from "./TodoScreen";
import { RootStoreContext } from "../contexts/RootStore";
import FailingScreen from "./FailingScreen";

const style = {
  navItem: { padding: 10 },
};

function App() {
  const { todoStore } = useContext(RootStoreContext);

  useEffect(() => {
    reaction(
      () => todoStore.todos.slice(),
      (todos) => {
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    );
  });

  return (
    <Router>
      <div>
        <nav>
          <Link style={style.navItem} to="/">
            TodoScreen
          </Link>
          <Link style={style.navItem} to="/failing-screen">
            FailingScreen
          </Link>
        </nav>
        <Switch>
          <Route path="/failing-screen">
            <FailingScreen />
          </Route>
          <Route path="/">
            <TodoScreen />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default observer(App);
