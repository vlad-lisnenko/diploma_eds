import React from 'react';
import './App.css';
import {Provider} from "react-redux";
import {store} from "./redux/store/store";
import {BrowserRouter} from "react-router-dom";
import {TokenProvider} from "./components/provider/TokenProvider/TokenProvider";
import {Routes} from "./components/Routes";

function App() {
  return (
    <div className='app-container'>
      <Provider store={store}>
        <BrowserRouter>
          <TokenProvider>
            <Routes/>
          </TokenProvider>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
