const { Connection, Channel, connect, Message } = require('amqplib')

class RabbitmqServer {

  constructor() {
    this.uri = {host: 'localhost', port: 5672, username: 'admin', password: 125687}
  }

  async start() {
    this.conn = await connect(this.uri)
    this.channel = await this.conn.createChannel()
  }

  async close() {
    await this.conn.close()
    console.log('Close RabbitMQ')
  }

  async subscriber(queue){
    await this.channel.consume(queue, message => {
      this.channel.ack(message)
      console.log(message.content.toString())
    })
  }

}

module.exports = RabbitmqServer