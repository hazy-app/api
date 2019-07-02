module.exports = {
  roundedHourTime: min => {
    const date = new Date()
    const newMinute = Math.ceil((date.getMinutes() + min) / min)
    date.setMinutes(newMinute * min)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }
}