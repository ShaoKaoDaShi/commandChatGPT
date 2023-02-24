// import { getChatGPTReply as getReply } from '../chatgpt/index.js'
// import { getOpenAiReply as getReply } from '../openai/index.js'
import { botName, roomWhiteList, aliasWhiteList } from '../config.js'
import {init, initReply} from './../chatgpt/index.js'
import Store from '../store/index.js'
const store = new Store()

/**
 * 默认消息发送
 * @param msg
 * @param bot
 * @returns {Promise<void>}
 */
export async function defaultMessage(msg, bot) {
  const contact = msg.talker() // 发消息人
  const receiver = msg.to() // 消息接收人
  const content = msg.text() // 消息内容
  const room = msg.room() // 是否是群消息
  const roomName = (await room?.topic()) || null // 群名称
  const alias = (await contact.alias()) || (await contact.name()) // 发消息人昵称
  const remarkName = await contact.alias() // 备注名称
  const name = await contact.name() // 微信名称
  const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
  // const isRoom = roomWhiteList.includes(roomName) && content.includes(`${botName}`) // 是否在群聊白名单内并且艾特了机器人
  const isRoom = roomWhiteList.includes(roomName) // 是否在群聊白名单内并且艾特了机器人
  const isAlias = aliasWhiteList.includes(remarkName) || aliasWhiteList.includes(name) // 发消息的人是否在联系人白名单内
  const isBotSelf = botName === remarkName || botName === name // 是否是机器人自己

  // TODO 你们可以根据自己的需求修改这里的逻辑
  if (isText && !isBotSelf) {
    try {
      // 区分群聊和私聊
      if (isRoom && room) {
        const getReply = getValue(room,roomName)
        await room.say(await getReply(content.replace(`${botName}`, '')))
        return
      }
      // 私人聊天，白名单内的直接发送
      if (isAlias && !room) {
        const getReply = getValue(room,name+remarkName)
        await contact.say(await getReply(content))
      }
    } catch (e) {
      console.error(e)
    }
  }
}

function getValue(isRoom, key) {
  const prefix = isRoom? 'room' : 'alias'
  const realKey = prefix+key
  if(typeof store.getState(realKey) === 'undefined') {
    store.setState(realKey, createReply())
  }

  return store.getState(realKey)
}

function createReply(){

  const api = init()
  const getReply = initReply(api)
  return getReply
}