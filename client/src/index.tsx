import React from 'react';
import ReactDOM from 'react-dom';
import './App/Layout/style.css';
import "semantic-ui-css/semantic.min.css";
import 'react-toastify/dist/ReactToastify.css'
import App from './App/Layout/App';
import "react-datepicker/dist/react-datepicker.css"
import reportWebVitals from './reportWebVitals';
import {store, StoreContext} from "./App/Stores/store"
import { Router } from 'react-router-dom';
import {createBrowserHistory} from "history";
import ScrollToTop from './App/Layout/ScrollToTop';

export const history = createBrowserHistory();

ReactDOM.render(

  <StoreContext.Provider value={store}>
    <Router history={history}>
      <ScrollToTop/>
      <App />
    </Router>
  </StoreContext.Provider>,
    
 
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
