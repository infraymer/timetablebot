const axios = require('axios')

const UNIVER_ID = 4
let groups = []

const instance = axios.create({
  baseURL: 'https://schedule.vekclub.com/api/v1/',
  timeout: 3000
})

// Запрос списка групп в ЮГУ
instance.get(`handbook/groups-by-institution?institutionId=${UNIVER_ID}`).then(reponse => {
  groups = reponse.data.data
  console.log(groups)
}).catch(error => {
})

// Запрос расписания по id группы
module.exports.getSchedule = async function (...args) {

  let group = groups.find(x => x.name.indexOf(args[0]) !== -1)

  let response = await instance.get(`schedule/group`, {
    params: {
      groupId: group.id,
      dateBegin: args[1],
      dateEnd: args[2],
    }
  })
  return response.data.data
}