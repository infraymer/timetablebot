const repo = require('./repository')
const format = require('./format')
const Utils = require('./utils')
const {Commands, isCommand} = require('./commands')
const vkio = require('vk-io')

const helpDescription = 'Привет! Я здесь отвечаю за расписание пар в универе 😊\n' +
    'Ты можешь узнать расписание на сегодня просто написав мне номер группы.'

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

  repo.getSchedule(context.text, Utils.currentDate, Utils.currentDate).then(dates => {
    context.send(format.scheduleToText(dates))
  }).catch(() => {
    context.send('Сорян, такой группы я не нашел 🤔')
  })
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
    repo.getSchedule(update.object.text, Utils.currentDate, Utils.currentDate).then(dates => {
      bot.send(format.scheduleToText(dates), update.object.from_id).catch(error => console.error(error))
      console.log('')
    }).catch(() => {
      bot.send('Сорян, такой группы я не нашел 🤔', update.object.from_id).catch(error => console.error(error))
    })
})

bot.getPayload('{"command": "start"}', (msg, reply) => console.log(msg))*/
