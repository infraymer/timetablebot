module.exports.Commands = {
  menu: /прив|старт|меню|нач|хелп|назад|хай|help|помощь|menu|hi|hello/i,
  get_schedule: 'get_schedule'
}

module.exports.isCommand = (string) => {
  for (let i in Commands) {
    if (Commands[i] === string) return true
  }
  return false
}