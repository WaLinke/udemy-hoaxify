import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserSignupPage from './Pages/UserSignupPage';
import * as apiCalls from './api/apiCalls'

const root = ReactDOM.createRoot(document.getElementById('root'));
const actions = {
  postSignup: apiCalls.signup
}
root.render(
  <UserSignupPage actions={actions} />
);
reportWebVitals();
