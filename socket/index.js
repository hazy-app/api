module.exports = {
  _waitings: [],
  partnerRequest(io, socket, data, cb) {
    try {
      console.log(socket.id, 'request for partner...')
      if (this._waitings.indexOf(socket.id) > -1 || socket.customData.partner) {
        return cb(false)
      }
      const partner = io.sockets.sockets[this._waitings.pop()] // it will throw if no partner available
      io.emit('waitingPersonsCount', this._waitings.length)
      partner.customData.partner = socket.id // it will throw if partner does not exists
      socket.customData.partner = partner.id
      partner.emit('partnerConnect') 
      socket.emit('partnerConnect')
      console.log(socket.id, 'connected to', partner.id)
    } catch (e) {
      this._waitings.unshift(socket.id)
      io.emit('waitingPersonsCount', this._waitings.length)
      console.log('no ready partner for', socket.id, 'so he is added to waiting list')
    } finally {
      cb(true)
    }
  },
  messageToPartner(io, socket, data, cb) {
    if (!socket.customData.partner) {
      return cb(false)
    }
    try {
      const partner = io.sockets.sockets[socket.customData.partner]
      partner.emit('messageFromPartner', data)
      cb(true)
    } catch (e) {
      socket.customData.partner = undefined
      socket.emit('partnerDisconnect')
      cb(false)
    }
  },
  waitingPersons(io, socket, data, cb) {
    cb(this._waitings.length)
  },
  // automaticly calling when disconnect (or also when user request)
  disconnect(io, socket, data, cb) {
    try {
      const indexInPartnerList = this._waitings.indexOf(socket.id)
      if (indexInPartnerList > -1) {
        this._waitings.splice(indexInPartnerList, 1)
      }
      if (socket.customData.partner) {
        const partner = io.sockets.sockets[socket.customData.partner]
        partner.customData.partner = undefined
        partner.emit('partnerDisconnect')
      }
    } catch (e) { }
    finally {
      cb(true)
    }
  },

  _registerEvents(io, socket) {
    console.log('new connection', socket.id)
    socket.customData = {
      partner: undefined
    }
    socket.emit('waitingPersonsCount', this._waitings.length)
    const events = Object.keys(this).filter(method => method.indexOf('_') !== 0)
    events.forEach(event => {
      socket.on(event, (data, cb = function(){}) => {
        // TODO validate token
        this[event](io, socket, data, cb)
      })
    })
  }
}