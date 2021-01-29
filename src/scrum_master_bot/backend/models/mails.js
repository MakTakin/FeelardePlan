const Sequelize = require('sequelize')
const database = require('../database/database')

const Mail = database.define('mail', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    time: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


// const fs = require('fs')
// const path = require('path')
// const {v4: uuid} = require('uuid')
//
// class Mail {
//     constructor(uid,title,time,text) {
//         this.uid = uid
//         this.title = title
//         this.time = time
//         this.text = text
//         this.id = uuid()
//     }
//
//     async save() {
//         const mails = await Mail.getAll()
//         mails.push({uid: this.uid, title:this.title, time: this.time, text: this.text, id: this.id})
//         return new Promise((res, rej) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'mails.json'),
//                 JSON.stringify(mails),
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
//     static async delete(uid) {
//         const mails = await Mail.getAll()
//         const mailsFilter = mails.filter(mail => mail.uid !== uid)
//         return new Promise((res, rej) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'mails.json'),
//                 JSON.stringify(mailsFilter),
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
//     static getAll()
//     {
//     return new Promise((res, rej) => {
//         fs.readFile(
//             path.join(__dirname, '..', 'data', 'mails.json'),
//             "utf-8",
//             (err, content) => {
//                 if (err) {
//                     rej(err)
//                 } else {
//                     res(JSON.parse(content))
//                 }
//             }
//         )
//     })
//     }
// }
//
module.exports = Mail