import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { randomString } from "./util/randomString";

const userId = randomString(8);
// tslint:disable-next-line
console.log(`Starting app with user id ${userId}.`);
ReactDOM.render(<App userId={userId} />, document.getElementById('root'));