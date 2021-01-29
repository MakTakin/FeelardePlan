import React from "react";
import './task.css'

export const Task = ({task}) => {
    return(
        <div className='task'>
            {task.title}
        </div>
    )
}