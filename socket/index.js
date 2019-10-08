module.exports = {
  ids: [],
  readyForChat(id) {
    console.log(id, 'connected')

    // TODO: use db instead of local Array :(
    this.ids.push(id)
  },
  disconnectFromChat(id) {
    console.log(id, 'disconnected')

    // TODO: use db instead of local Array :(
    const index = this.ids.indexOf(id)
    if (index !== -1) {
      this.ids.splice(index, 1)
    }
  },
  _registerEvents(socket) {
    const events = Object.keys(this).filter(method => !['_registerEvents'].includes(method))
    events.forEach(event => {
      socket.on(event, token => {
        // TODO validate token
        this[event](socket.id)
      })
    })
  }
}