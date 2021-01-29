const Extra = require('telegraf/extra')
const {token, adminId, text, helpAdmin, help} = require('../config/config')
const {Telegraf} = require('telegraf')

const Task = require('../models/task')
const Mail = require('../models/mails')
const Card = require('../models/card')

const bot = new Telegraf(token)

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const CreateTask = require('./scenes')
const createTask = new CreateTask()
const taskCreate = createTask.taskCreate()
const cardCreate = createTask.cardCreate()
const descriptionCreate = createTask.descriptionCardCreate()

const stage = new Stage([taskCreate,cardCreate,descriptionCreate])


bot.use(session())
bot.use(stage.middleware())
bot.command('createtask', async(ctx) =>  ctx.scene.enter('task'))




bot.help((ctx) => {
    userId = ctx.message.from.id
    if (userId == adminId) {
        bot.telegram.sendMessage(userId, `${helpAdmin}`)
    } else {
        ctx.reply(`${help}`)
    }
})
// Cообщение в ЛС боту для создания рассылки
bot.hears(/mail (.+) в (.+)/, async (ctx) => {
    const userId = ctx.message.from.id
    if (userId == adminId && userId == ctx.message.chat.id) {
        const chatId = ctx.match[1].trim()
        const time = ctx.match[2].trim()
        // const mail = new Mail(chatId, 'noname', time, text)
        try {
            await Mail.create({
                uid:chatId,
                title:'noname',
                time,
                text
            })
            await ctx.reply('Группа добавлена в рассылку')
        } catch (e) {
            if (e) {
                ctx.reply(`Возникла ошибка ${e}`)
            }
        }
    }
})

// Cообщение в ЛС боту для проверки групп для рассылки
bot.hears(/groups/, async (ctx) => {
    const userId = ctx.message.from.id
    if (userId == adminId && userId == ctx.message.chat.id) {
        const mailGroups = await Mail.findAll()
        const titleGroup = mailGroups.map(mail => [mail.uid, mail.title, mail.time]).join('\n')
        ctx.reply(titleGroup.length > 0 ? `ID групп \n${titleGroup}` : `Групп для рассылки нет`)
    }
})

// Cообщение в ЛС боту для удаления группы из рассылки
bot.hears(/delete (.+)/, async (ctx) => {
    const userId = ctx.message.from.id
    const mailGroups = await Mail.findAll()
    if (userId == adminId && userId == ctx.message.chat.id && mailGroups.length <= 0) {
        ctx.reply('Групп для удаления нет')
    } else if (userId == adminId && userId == ctx.message.chat.id && mailGroups.length > 0) {
        const chatId = ctx.match[1].trim()
        try {
            await Mail.destroy({
                where:{
                    uid: chatId
                }
            })
            await ctx.reply('Группа с таким ID удалена из рассылки')
        } catch (e) {
            if (e) {
                ctx.reply(`Возникла ошибка ${e}`)
            }
        }
    }
})

// Создает задачу
bot.hears(/createtask (.+)/, async (ctx) => {
    const userId = ctx.message.from.id
        const title = ctx.match[1].trim()
        try {
            await Task.create({
                title,
                done: false
            })
            await ctx.reply('Задача создана')
        } catch (e) {
            ctx.reply(`Возникла ошибка ${e}`)
        }
})

// Удаляет задачу
bot.command('deletetask', async (ctx) => {
    const tasks = await Task.findAll()
    if (tasks.length > 0) {
        ctx.reply("Какую задачу вы хотите удалить?", Extra.markup((m) => {
                return (
                    m.inlineKeyboard(
                        tasks.map(task => [m.callbackButton(`${task.title}`, `delete_${task.id}`)])
                    )
                )
            })
        )
    } else {
        ctx.reply('Список задач пуст')
    }
})

// Ловит коллбэк на удаление задачи
bot.action(/delete_(.+)/, async(ctx) => {
    const deleteId = ctx.match[1]
    try {
        const task = await Task.findByPk(deleteId)
        await task.destroy()
        await ctx.replyWithMarkdown(`Задача *"${task.title}"* удалена`)
    } catch (e) {
        ctx.reply(`Такой задачи нет, вероятно вы ее уже удалили.`)
    }
})

// Удаление бота из чата ( может сделать любой, можно добавить проверку на пользователя)
bot.command('quit', (ctx) => ctx.leaveChat())

// Команда для старта бота в чате
bot.command('startMaster', async (ctx) => {
    console.log(ctx.message)
    const title = ctx.chat.title || ctx.message.from.username
    try {
        await Mail.create({
            uid: ctx.chat.id,
            title,
            time: '11:0',
            text
        })
        await ctx.reply('Приветствую! Я ScrumBot.Делаю рассылку по будням в 11:00')
    } catch (e) {
            ctx.reply(`Возникла ошибка ${e}`)
    }

})

// Рассылка
setInterval(async function () {
    const curDay = new Date().getDay()
    const curDate = new Date().getHours() + ':' + new Date().getMinutes()
    if (curDay < 6 && curDay > 0) {
        const mailing = await Mail.findAll()
        mailing.forEach(mail => {
            if (mail.time === curDate) {
                bot.telegram.sendMessage(mail.uid, `${mail.text}`)
            }
        })
    }
}, 58500)

module.exports = bot
