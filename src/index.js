import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import randomString from './util/randomString';

ReactDOM.render(<App userId={randomString(6)} />, document.getElementById('root'));
