import Register from "./components/Register";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks"
import React from "react";

export const config = {
  endpoint: `https://qkart-frontend-api.fly.dev/api/v1`,
};

function App() {
  return (
    <React.StrictMode>
      <div className="App">
        {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
        <Switch>
          <Route exact path="/">
            <Products />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Checkout />
          </Route>
          <Route path="/thanks">
            <Thanks />
          </Route>
        </Switch>  
      </div>
    </React.StrictMode>
  );
}

export default App;
