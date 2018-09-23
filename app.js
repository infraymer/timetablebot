const repo = require('./repository')
const format = require('./format')
const Utils = require('./utils')
const {Commands, isCommand} = require('./commands')
const vkio = require('vk-io')

const helpDescription = 'Привет! Я здесь отвечаю за расписание пар в универе 😊.\n' +
    'Для просмотра списка команд моежете написать мне "помощь" или "help."' +
    'Тебе доступны следующие команды:\n\n' +
    '!номер_группы - расписание на сегодня\n' +
    '+номер_группы - расписание на завтра\n' +
    '-номер_группы - расписание вчера\n' +
    '!номер_группы число_дней - раписание на указанное количество дней вперед или назад\n' +
    '(Например, "!1681 7" или "!1681 -10")'

const vk = new vkio.VK({
    token: '12319666ed735201138dbc3037217019e2cec1cdecb36e0075e9f850e59dffcdda6037a70f8604c2634b7',
    apiMode: 'parallel_selected',
    webhookPath: '/webhook/secret-path'
})

const {updates} = vk

// Skip outbox message and handle errors
updates.use(async (context, next) => {
    if (context.is('message') && context.isOutbox) {
        return
    }

    try {
        await next()
    } catch (error) {
        console.error('Error:', error)
    }
})

updates.on('message', async (context, next) => {
    if (context.payload.payload === '{\"command\":\"start\"}') {
        await context.send(helpDescription)
        return
    }
    await next()
})

// Расписание группы на текущий день
updates.hear(/^!([0-9]+$)/i, async (ctx, next) => {
    repo.getSchedule(ctx.text.replace('!', ''), Utils.today, Utils.today).then(dates => {
        ctx.send(format.scheduleToText(dates))
    }).catch(() => {
        ctx.send('Сорян, такой группы я не нашел 🤔')
    })
})

// Расписание группы на завтра
updates.hear(/^\+(.+)/i, async (context, next) => {
    repo.getSchedule(context.$match[1], Utils.tommorow, Utils.tommorow).then(dates => {
        context.send(format.scheduleToText(dates))
    }).catch(() => {
        context.send('Сорян, такой группы я не нашел 🤔')
    })
})

// Расписание
updates.hear(/^-(.+)/i, async (context, next) => {
    repo.getSchedule(context.$match[1], Utils.yesterday, Utils.yesterday).then(dates => {
        context.send(format.scheduleToText(dates))
    }).catch(() => {
        context.send('Сорян, такой группы я не нашел 🤔')
    })
})

updates.hear(/!([0-9а-я\-]+) ([\-0-9+]+)/i, async (context, next) => {
    repo.getSchedule(context.$match[1], Utils.today, Utils.todayAdd(parseInt(context.$match[2]))).then(dates => {
        context.send(format.scheduleToText(dates))
    }).catch(() => {
        context.send('Сорян, такой группы я не нашел 🤔')
    })
})

updates.hear(/help|start|нач|старт|пом|ком/i, async (context, next) => {
    await context.send(helpDescription)
})

updates.hear('{\"command\":\"start\"}', async (context) => {
    await context.send(helpDescription)
})

async function run() {
    if (process.env.UPDATES === 'webhook') {
        await vk.updates.startWebhook()

        console.log('Webhook server started')
    } else {
        await vk.updates.startPolling()

        console.log('Polling started')
    }
}

run().catch(console.error)


/*bot.get('kek', (message, exec, reply) => {
  // const options = {keyboard: JSON.stringify(buttons)}
  const options = {keyboard: JSON.stringify(buttons)}
  reply(helpDescription, {keyboard: JSON.stringify({"buttons": [], "one_time": true})})
  // reply('Чего ты хочешь от меня? 😊', options)
})

bot.on('update', update => {
  // if (!isCommand(update.object.text))
    repo.getSchedule(update.object.text, Utils.today, Utils.today).then(dates => {
      bot.send(format.scheduleToText(dates), update.object.from_id).catch(error => console.error(error))
      console.log('')
    }).catch(() => {
      bot.send('Сорян, такой группы я не нашел 🤔', update.object.from_id).catch(error => console.error(error))
    })
})

bot.getPayload('{"command": "start"}', (msg, reply) => console.log(msg))*/
