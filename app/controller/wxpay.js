const Controller = require('../../lib/controller')
const WxpaySdk = require('../../sdk/wxpaySdk')

class WxpayController extends Controller {

  /**
   * 手机网页支付
   * @param {*} args 
   * @param {*} ret 
   */
  async h5Pay(args, ret) {
    this.LOG.info(args.uuid, '/h5Pay', args)
    let outTradeNo = args.out_trade_no
    let totalAmount = args.amount
    let body = args.body || ''
    let subject = args.subject
    let returnUrl = args.return_url || ''

    let config = this.CONFIG.wxpay.h5
    let wxpaySdk = new WxpaySdk(config)

    let ip = args.ip || ''
    this.LOG.info(args.uuid, '/h5Pay ip:', ip)

    let payRet = await wxpaySdk.h5Pay(outTradeNo, totalAmount, body, subject, returnUrl, ip)
    this.LOG.info(args.uuid, '/h5Pay payRet', payRet)
    if (payRet.code) {
      ret.code = payRet.code
      ret.message = payRet.message || ''
      return ret
    }

    ret.data = {
      action: payRet.data.mweb_url
    }
    this.LOG.info(args.uuid, '/h5Pay ret', ret)
    return ret
  }

}

module.exports = WxpayController