import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// importing all the themes
import Author from "../themes/author";
import Create from "../themes/create";

class MyRouts extends React.Component {
  
  render() {
    const connectedAddress = sessionStorage.getItem('metaMaskAddr')
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path={"/"} component={Create} props={connectedAddress}/>
            <Route exact path="/author/:id" component={Author} />
          </Switch>
        </Router>
      </div>
    );
  }
}
export default MyRouts;