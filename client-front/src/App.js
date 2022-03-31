import React from 'react';
import ApolloClient from "apollo-boost";
// importing MyRouts where we located all of our theme
import MyRouts from './routers/routes'




function App() {
  return (
    <div>
      <MyRouts />
    </div>
  );
}

export default App;