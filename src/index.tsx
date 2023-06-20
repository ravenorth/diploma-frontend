import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createStore } from '@reatom/core';
import { context } from '@reatom/react';
import {BrowserRouter as Router} from 'react-router-dom';
import { Suspense } from 'react';
import { AppWrapper } from './app/AppWrapper';
import { currUserAtom } from './app/model/currUser/currUser';

const store = createStore(currUserAtom)

ReactDOM.render(
  <Suspense fallback="loading">
    <context.Provider value={store}>
      <Router>
        <AppWrapper />
      </Router>
    </context.Provider>
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
