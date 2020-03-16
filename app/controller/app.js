const Controller = require('../../lib/controller')
const appDataJson = (process.env.NODE_ENV === 'production') ? require('./../../config/appDataProd.json') : require('./../../config/appData.json')

class AppController extends Controller {

  async update(args, ret) {
    this.LOG.info(args.uuid, '/update', args)
    let platform = args.platform
    let version = args.version

    let update = appDataJson.update
    let updatePlatform = update[platform] || null
    this.LOG.info(args.uuid, '/update updatePlatform', updatePlatform)
    if (updatePlatform && updatePlatform.version != version) {
      ret.data = {
        version: updatePlatform.version,
        url: updatePlatform.url,
        note: updatePlatform.notes[0] || '',
        status: 1
      }
    } else {
      ret.data = {
        status: 0
      }
    }
    this.LOG.info(args.uuid, '/update ret', ret)
    return ret
  }

  async indexData(args, ret) {
    this.LOG.info(args.uuid, '/indexData', args)
    let type = args.type || ''
    if (!type) {
      return ret
    }
    let data = appDataJson[type] || null
    this.LOG.info(args.uuid, '/indexData data', data)
    ret.data = data
    return ret
  }

  async userPageConfig(args, ret) {
    let data = appDataJson.userPage || null
    this.LOG.info(args.uuid, '/userPageConfig data', data)
    ret.data = data
    return ret
  }

  async countdown(args, ret) {
    let now = parseInt(Date.now() / 1000)
    let today = this.UTILS.dateUtils.dateFormat(null, 'YYYY-MM-DD')
    let todayEnd = this.UTILS.dateUtils.getTimestamp(today + ' 23:59:59')
    let second = todayEnd - now
    let h = parseInt(second / 3600)
    let m = parseInt((second - h * 3600) / 60)
    let s = second - h * 3600 - m * 60

    ret.data = {
      h,
      m,
      s
    }
  }

}

module.exports = AppController