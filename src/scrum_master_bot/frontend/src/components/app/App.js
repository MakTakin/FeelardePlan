import React from 'react';
import './App.css';
import {ListTasks} from './../list-tasks/list-task'
import Header from "../header/header.";

function App() {
    return (
        <div className="App">
            <div className='container'>
                <Header/>
                <ListTasks/>
            </div>
        </div>
    );
}

export default App;
