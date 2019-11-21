const Controller = require('../../lib/controller') 
const AlipaySdk = require('../../sdk/aplipaySdk')

class AlipayController extends Controller {

  /**
   * 手机网页支付
   * @param {*} args 
   * @param {*} ret 
   */
  async wapPay(args, ret) {
    this.LOG.info(args.uuid, '/wapPay' , args)
    let outTradeNo = args.out_trade_no
    let totalAmount = parseFloat((args.amount / 100).toFixed(2))
    let body = args.body || ''
    let subject = args.subject
    let wapPayRet = await AlipaySdk.wapPay(outTradeNo, totalAmount, body, subject)
    this.LOG.info(args.uuid, '/wapPay wapPayRet' , wapPayRet)
    ret.data = {
      action: wapPayRet
    }
    return ret
  }
}

module.exports = AlipayController