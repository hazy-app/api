module.exports = {
  partnerRequest(io, socket) {
    console.log(socket.id, 'request partner...')
    socket.customData.partner = null // means waiting for partner
    // try to find partner
    const allSockets = io.sockets.clients()
    console.log('try to find partner from', allSockets.length)
    Object.keys(allSockets)
    for(let i = 0; i < Object.keys(allSockets).length; i++) {
      const _socket = allSockets[i]
      if (_socket.customData.partner === null && _socket.id !== socket.id) {
        console.log('two people connected!')
        _socket.customData.partner = socket.id
        _socket.emit('partnerRequestAccept')
        socket.customData.partner = _socket.id
        socket.emit('partnerRequestAccept')
        break
      }
    }
  },
  messageToPartner(io, socket, message) {
    if (!socket.customData.partner) {
      return
    }
    const allSockets = io.sockets.clients()
    const partner = io.sockets.connected[socket.customData.partner]
    partner.emit('messageFromPartner', message)

  },
  // automaticly calling when disconnect (or also when user request)
  disconnect(io, socket) {
    if (socket.customData.partner) {
      const partner = io.sockets.connected[socket.customData.partner]
      partner.disconnect()
    }
  },

  _registerEvents(io, socket) {
    socket.customData = {
      partner: undefined
    }
    const events = Object.keys(this).filter(method => method.indexOf('_') !== 0)
    events.forEach(event => {
      socket.on(event, data => {
        // TODO validate token
        this[event](io, socket, data)
      })
    })
  }
}