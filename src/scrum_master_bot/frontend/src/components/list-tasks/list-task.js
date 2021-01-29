import React, {lazy, useEffect, useState} from "react";
import './list-task.css'
import {Task} from "../task/task";
import SwiperMutiple from "../swiper/swiper";
import {SERVER_URL} from "../../settings/constants";
import {Swiper, SwiperSlide} from 'swiper/react';



export const ListTasks = () => {
    const [tasks, setTasks] = useState([])

    const fetchTasks = async () => {
        try {
            let tasks = await fetch(`${SERVER_URL}/api/tasks`)
            tasks = await tasks.json()
            setTasks(tasks)
        } catch (e) {
            console.log(e)
        }

    }
    // const ListTasks = tasks.map(task => {
    //     return (
    //         <SwiperSlide>
    //             <Task task={task} key={task.id}/>
    //         </SwiperSlide>
    //     )
    // })
    //     const ListTasks1 = [1,2,3,4,4].map(task => {
    //     return (
    //         <SwiperSlide>
    //             {task}
    //         </SwiperSlide>
    //     )
    // })
    useEffect(() => {
        fetchTasks()
    }, [])
    return (
        <div className="tasks">
            {tasks.map(task => {
                return (
                    <Task task={task} key={task.id}/>
                )
            })
            }
        </div>
    )
}