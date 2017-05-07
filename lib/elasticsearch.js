const Future = require('fluture')

module.exports = ({elasticsearch,host,apiVersion})=>{

  const client = new elasticsearch.Client({
    host,
    apiVersion,
    sniffOnStart: true,
    sniffInterval: 60000
  })

  const create = (param)=>Future.node( done => client.create(param,done))

  return {
    recordTrollboxMessage: (msg) => create({
      index: "datafeed",
      type: "trollbox_message",
      id: msg.counter,
      body: msg
    })
  }
}
