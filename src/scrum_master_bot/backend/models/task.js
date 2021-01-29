const Sequelize = require('sequelize')
const db = require('../database/database')
const Card = require('./card')

const Task = db.define('task', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    done: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
})

Task.hasMany(Card)
module.exports = Task


// const fs = require('fs')
// const path = require('path')
// const {v4: uuid} = require('uuid')
//
// class Task {
//     constructor(task) {
//         this.task = task
//         this.id = uuid()
//     }
//
//     async save() {
//         const tasks = await Task.getAll()
//         tasks.push({task: this.task, id: this.id})
//         return new Promise((res, rej) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'tasks.json'),
//                 JSON.stringify(tasks),
//                 (err) => {
//                     if (err) {
//                         rej(err)
//                     } else {
//                         res()
//                     }
//
//                 })
//         })
//     }
//
//     static async delete(id) {
//         const tasks = await Task.getAll()
//         const found = tasks.find(item => item.id == id)
//         if (Object.keys(found)) {
//             const tasksFilter = tasks.filter(task => task.id !== id)
//             return new Promise((res, rej) => {
//                 fs.writeFile(
//                     path.join(__dirname, '..', 'data', 'tasks.json'),
//                     JSON.stringify(tasksFilter),
//                     (err) => {
//                         if (err) {
//                             rej(err)
//                         } else {
//                             res()
//                         }
//
//                     })
//             })
//         }
//
//     }
//
//     static getAll() {
//         return new Promise((res, rej) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'tasks.json'),
//                 "utf-8",
//                 (err, content) => {
//                     if (err) {
//                         rej(err)
//                     } else {
//                         res(JSON.parse(content))
//                     }
//                 }
//             )
//         })
//     }
// }

module.exports = Task
