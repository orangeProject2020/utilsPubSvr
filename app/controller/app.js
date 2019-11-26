const Controller = require('../../lib/controller')
const appDataJson = require('./../../config/appData.json')

class AppController extends Controller {

  async update(args, ret) {
    this.LOG.info(args.uuid, '/update', args)
    let platform = args.platform
    let version = args.version

    let update = appDataJson.update
    let updatePlatform = update[platform] || null
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
  }

  async indexData(args, ret) {
    this.LOG.info(args.uuid, '/indexData', args)
    let type = args.type || ''
    if (!type) {
      return ret
    }
    let data = appDataJson[type] || null
    ret.data = data
    return ret
  }

}

module.exports = AppController