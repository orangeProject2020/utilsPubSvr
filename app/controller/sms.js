const Controller = require('../../lib/controller')
const Op = require('sequelize').Op

class SmsController extends Controller {

  async sendVerifyCode(args, ret) {
    this.LOG.info(args.uuid, '/sendVerifyCode ', args)
    let mobile = args.mobile || ''
    if (mobile.length != 11) {
      ret.code = 1
      ret.message = '请输入正确的手机号码'
      return ret
    }

    // 
    let smsModel = new this.MODELS.smsModel
    let todayCount = await smsModel.model().count({
      where: {
        mobile: mobile,
        create_time: {
          [Op.gte]: parseInt(Date.now() / 1000) - 24 * 3600
        }
      }
    })
    this.LOG.info(args.uuid, '/sendVerifyCode todayCount', todayCount)

    if (todayCount >= this.CONFIG.sms.verifyDayLimit) {
      ret.code = 1
      ret.message = '超过发送数量限制'
      return ret
    }

    let verifyCode = parseInt(Math.random() * 1000000).toString()
    this.LOG.info(args.uuid, '/sendVerifyCode verifyCode', verifyCode)

    // try {
    //   let smsConfig = this.CONFIG.sms
    //   let qcloudSms = new this.QcloudSms(smsConfig)
    //   let smsSendRes = await qcloudSms.sendVerifyCode(mobile, verifyCode)
    //   if (smsSendRes && smsSendRes.SendStatusSet.length) {
    //     let smsSendStatusCode = smsSendRes.SendStatusSet[0].Code
    //     if (smsSendStatusCode.toLowerCase() !== 'ok') {
    //       throw new Error(smsSendRes.SendStatusSet[0].message)
    //     }
    //   } else {
    //     throw new Error('发送短信出现错误')
    //   }
    // } catch (err) {
    //   this.LOG.error(args.uuid, '/sendVerifyCode err:', err)
    //   ret.code = 1
    //   ret.message = err.message || err
    //   return ret
    // }

    let smsDbRet = await smsModel.model().create({
      mobile: mobile,
      code: verifyCode
    })
    if (!smsDbRet) {
      ret.code = 1
      ret.message = '记录发送数据失败'
      return ret
    }

    return ret
  }

  async checkVerifyCode(args, ret) {
    this.LOG.info(args.uuid, '/checkVerifyCode ', args)
    let mobile = args.mobile || ''
    let verifyCode = args.verify_code || ''

    if (mobile.length != 11 || verifyCode.length != 6) {
      ret.code = 1
      ret.message = '参数错误'
      return ret
    }

    let smsModel = new this.MODELS.smsModel
    let find = await smsModel.model().findOne({
      where: {
        mobile: mobile,
        code: verifyCode,
        status: 0
      }
    })
    if (!find) {
      ret.code = 1
      ret.message = '验证码错误'
      return ret
    }

    let now = parseInt(Date.now() / 1000)
    if (find.create_time < now - this.CONFIG.sms.verifyCodeExpired) {
      ret.code = 1
      ret.message = '验证码已过期'
      return ret
    }

    find.status = 1
    await find.save()

    return ret

  }


}

module.exports = SmsController