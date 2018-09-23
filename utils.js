const date = require('date-and-time')
date.locale('ru')

const types = {
  1: '📢',
  2: '📝',
  3: '🔬',
  4: '☎',
  5: '🤞',
  6: '👍',
  7: '📝',
  8: '📑',
  9: '💻',
  10: '📑'
}

module.exports.getType = function (id) {
  let icon = types[id]
  if (icon === undefined) return '📌'
  else return icon
}

module.exports.currentDate = date.format(new Date(), 'YYYY-MM-DD')