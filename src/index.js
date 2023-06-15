import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import User from './User';

const root = ReactDOM.createRoot(document.getElementById('root'));
document.title = 'SnAke GaMe';

root.render(
  <>
    <App />
    <User />
  </>
);

