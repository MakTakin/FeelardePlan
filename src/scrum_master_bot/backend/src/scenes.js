const Extra = require('telegraf/extra')
const Scene = require('telegraf/scenes/base')
const Task = require('../models/task')
const Card = require('../models/card')

class CreateTask {
    taskCreate() {
        const task = new Scene('task')
        task.enter(async (ctx) => {
            await ctx.replyWithMarkdown("*Введите название задачи или вернитесь обратно*", Extra.markup((m) => {
                return (
                    m.inlineKeyboard([
                        m.callbackButton('Back', 'leave')
                    ])
                )
            }))
        })
        task.on('text', async (ctx) => {
            const creatingTask = ctx.message.text
            const createdTask = await Task.create({
                title: creatingTask,
                done: false
            })
            const taskId = createdTask.id
            await ctx.reply('Задача создана, перейдем к карточке')
            ctx.scene.enter('card', {taskId})
            }
        )

        task.action('leave', async (ctx) => {
            await ctx.reply('Вы вышли из меню создания задачи')
            await ctx.scene.leave()
            }
        )
        return task
    }

    cardCreate() {
        const card = new Scene('card')
        card.enter(async (ctx) => {
            await ctx.replyWithMarkdown('*Введите название карточки, создайте еще задачу или завершите создание задачи*', Extra.markup((m) => {
                return (
                    m.inlineKeyboard(
                        [
                            [m.callbackButton('Cоздать другую задачу', 'create')],
                            [m.callbackButton('Завершить создание задачи', 'leave')]
                        ]
                    )
                )
            }))
        })
        card.on('text', async (ctx) => {
            const {taskId} = {...ctx.scene.state}
            const creatingCard = {
                    title: ctx.message.text,
                    done: false,
                    taskId
            }
            await ctx.reply('Карточка создана, перейдем к описанию')
            await ctx.scene.enter('description', creatingCard)
            }
        )
        card.action('create', (ctx) => ctx.scene.enter('task'))
        card.action('leave', async (ctx) => {
            await ctx.reply('Вы вышли из меню создания задачи')
            await ctx.scene.leave()
        })
        return card
    }

    descriptionCardCreate() {
        const description = new Scene('description')
        description.enter(async (ctx) => {
            await ctx.replyWithMarkdown('*Введите описание карточки или пропустите этот пункт*', Extra.markup((m) => {
                return (
                    m.inlineKeyboard(
                        [m.callbackButton('Пропустить создание описания', 'miss')]
                    )
                )
            }))
        })
        description.on('text', async (ctx) => {
            const creatingCard = {...ctx.scene.state, description: ctx.message.text}
            console.log(creatingCard, 'c описанием')
            await Card.create(creatingCard)
            await ctx.replyWithMarkdown('*Карточка создана, cоздать еще одну?*', Extra.markup((m) => {
                return (
                    m.inlineKeyboard(
                        [
                            [m.callbackButton('Создать еще карточку', 'create')],
                            [m.callbackButton('Завершить создание задач и карточек', 'leave')]
                        ]
                    )
                )
            }))

        }
        )
        description.action('create', (ctx) => {
            const {taskId} = {...ctx.scene.state}
            ctx.scene.enter('card', {taskId})

        })
        description.action('miss', async (ctx) => {
            await Card.create(ctx.scene.state)
            await ctx.replyWithMarkdown('*Карточка создана, cоздать еще одну?*', Extra.markup((m) => {
                return (
                    m.inlineKeyboard(
                        [
                            [m.callbackButton('Создать еще карточку', 'create')],
                            [m.callbackButton('Завершить создание задач и карточек', 'leave')]
                        ]
                    )
                )
            }))
        })

        description.action('leave', async (ctx) => {
            await ctx.reply('Вы вышли из меню создания задачи')
            await ctx.scene.leave()
        })
        return description
    }
}

module.exports = CreateTask