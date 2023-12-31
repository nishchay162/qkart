import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import{ Route, Switch} from "react-router-dom"
import Login from"./components/Login";
import Products from"./components/Products";



export const config = {
  endpoint: `https://qkart-frontend-uf3a.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
          {/* <Register /> */}
         <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <Products />
           </Route>
          </Switch>
          
    </div>
  );
}

export default App;
