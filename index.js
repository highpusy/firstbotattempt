const {gameOptions, againOptions} = require('./options')

const TelegramApi = require(`node-telegram-bot-api`)
const token = `6524390322:AAFsKAPsytVShDd3EVZ7vV4Dn31To91-kM4`
const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `я загадываю цифру 0-9а ты ее угадываешь`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, `отгадывай`, gameOptions)
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'начальное приветствие'},
    {command: '/info', description: 'информация о уебке'},
    {command: '/game', description: 'интерактивная игра'},
  ])
  
  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id
  
    if (text === '/start') {
      await bot.sendMessage(chatId, `пшел нахуй отсюда чорт`)
      return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/4.webp')
    }

    if(text === '/info') {
      return bot.sendMessage(chatId, `${msg.from.first_name} пидар`)
    }

    if(text === '/game') {
      return startGame(chatId)
    }

    return(bot.sendMessage(chatId, `${msg.from.first_name} ты че еблан? ты хуйню написал`))
  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }
    if (data === `${chats[chatId]}`) {
      return bot.sendMessage(chatId, `ты угадал цифру ${chats[chatId]}`, againOptions)
    } else {
      return bot.sendMessage(chatId, `ты не угадал, цифра была ${chats[chatId]}`, againOptions)
    }
  })
}

start()