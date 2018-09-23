const Date = require('date-and-time')
const Utils = require('./utils')
Date.locale('ru')

function timeReformat(time) {
  let arr = time.split(':')
  return arr[0] + ':' + arr[1]
}

module.exports.scheduleToText = function (dates) {
  let text = ''

  if (dates.length === 0) return 'Пар нет! 🎉🎊🎈'

  for (let i in dates) {
    let d = Date.format(Date.parse(i, 'YYYY-MM-DD'), 'dddd, DD MMMM')
    text += `📅 ${d}\n\n`

    for (let k in dates[i]) {
      let les = dates[i][k]
      let subgroup = les.group.subgroup === null ? '' : `⚡ Подгруппа ${les.group.subgroup.subgroup_name}\n`
      text += `⏰ ${timeReformat(les.time_begin)} - ${timeReformat(les.time_end)}\n` +
          `${Utils.getType(les.lesson_type.id)} ${les.lesson_type.name}\n` +
          `${les.subject_name}\n` +
          subgroup +
          `🎓 ${les.lector.lector_name}\n` +
          `📍 ${les.location}\n\n`
    }
  }
  console.log(text)
  return text
}