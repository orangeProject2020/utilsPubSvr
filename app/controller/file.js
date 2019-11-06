const Controller = require('../../lib/controller')
const Op = require('sequelize').Op

class FileController extends Controller {

  async getItem(args, ret) {
    this.LOG.info(args.uuid, 'getItem', args)

    let fileData = {}
    fileData.md5 = args.md5

    let fileModel = new this.MODELS.fileModel()
    let find = await fileModel.model().findOne({
      where: {
        md5: fileData.md5
      }
    })

    ret.data = find
    return ret
  }
  /**
   * 用户网站基本配置信息
   * @param {*} args 
   * @param {*} ret 
   */
  async update(args, ret) {
    // this._authByToken(args, ret)
    this.LOG.info(args.uuid, 'update', args)

    let fileData = {}
    fileData.md5 = args.md5

    let fileModel = new this.MODELS.fileModel()
    let find = await fileModel.model().findOne({
      where: {
        md5: fileData.md5
      }
    })

    this.LOG.info(args.uuid, 'update find', find)
    if (find) {
      let step = args.hasOwnProperty('step') ? args.step : (find.step + 1)
      find.step = step
      if (step == find.chunks) {
        find.status = 1
      }

      await find.save()
      ret.data = find
    } else {
      fileData.size = args.size
      fileData.step = 0
      fileData.chunks = args.chunks || 1
      fileData.type = args.type
      fileData.ext = args.ext
      fileData.name = args.name || ''

      let file = await fileModel.model().create(fileData)
      ret.data = file
    }

    this.LOG.info(args.uuid, 'update ret', ret)
    return ret
  }

}

module.exports = FileController