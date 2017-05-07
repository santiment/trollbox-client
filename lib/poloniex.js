const {EventEmitter} = require('events')

const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()

const parse = (arr)=> {
  const ts = Date.now();
  const msg = entities.decode(  arr[3]);
  const obj = {
    receivedTimestamp: ts,
    counter: arr[1],
    username: arr[2],
    reputation: arr[4],
    message: msg
  };
  return obj;
}

module.exports = ({autobahn,logger,most, url})=> {

  return {
    openTrollboxStream: () => {
      const connection = new autobahn.Connection({url: url, realm: "realm1"})
      const emitter = new EventEmitter()

      const pushTrollboxEvent = (arr)=> emitter.emit('trollbox', parse(arr))

      connection.onopen = (session)=>{
        logger.info("Connection opened")
        session.subscribe('trollbox', pushTrollboxEvent)
      }

      connection.onclose = (reason,details)=> {
        logger.info("Connection closed. Reason:",reason,details)
      }
      connection.open()
      return most.fromEvent('trollbox', emitter)
    }
  }
}
