module.exports = {
  _readyPersons: [],
  partnerRequest(io, socket) {
    try {
      if (this._readyPersons[socket.id]) {
        return
      }
      console.log(socket.id, 'request for partner...')
      const partner = io.sockets.sockets[this._readyPersons.pop()] // it will throw if no partner available
      partner.customData.partner = socket.id // it will throw if partner does not exists
      socket.customData.partner = partner.id
      partner.emit('partnerConnect') 
      socket.emit('partnerConnect')
      console.log(socket.id, 'connected to', partner.id)
    } catch (e) {
      this._readyPersons.unshift(socket.id)
      console.log('no ready partner for', socket.id, 'so he is added to waiting list')
    }
  },
  messageToPartner(io, socket, message) {
    if (!socket.customData.partner) {
      return
    }
    try {
      const partner = io.sockets.sockets[socket.customData.partner]
      partner.emit('messageFromPartner', message)
    } catch (e) {
      socket.customData.partner = undefined
      socket.emit('partnerDisconnect')
    }
  },
  // automaticly calling when disconnect (or also when user request)
  disconnect(io, socket) {
    try {
      const indexInPartnerList = this._readyPersons.indexOf(socket.id)
      if (indexInPartnerList > -1) {
        this._readyPersons.splice(indexInPartnerList, 1)
      }
      if (socket.customData.partner) {
        const partner = io.sockets.sockets[socket.customData.partner]
        partner.customData.partner = undefined
        partner.emit('partnerDisconnect')
      }
    } catch (e) { }
  },

  _registerEvents(io, socket) {
    console.log('new connection', socket.id)
    socket.customData = {
      partner: undefined
    }
    const events = Object.keys(this).filter(method => method.indexOf('_') !== 0)
    events.forEach(event => {
      socket.on(event, (data, cb) => {
        // TODO validate token
        this[event](io, socket, data)
      })
    })
  }
}