const Controller = require('../../lib/controller')
const AlipaySdk = require('../../sdk/aplipaySdk')

class AlipayController extends Controller {

  /**
   * 手机网页支付
   * @param {*} args 
   * @param {*} ret 
   */
  async wapPay(args, ret) {
    this.LOG.info(args.uuid, '/wapPay', args)
    let outTradeNo = args.out_trade_no
    let totalAmount = parseFloat((args.amount / 100).toFixed(2))
    let body = args.body || ''
    let subject = args.subject
    let returnUrl = args.return_url || ''
    let wapPayRet = await AlipaySdk.wapPay(outTradeNo, totalAmount, body, subject, returnUrl)
    this.LOG.info(args.uuid, '/wapPay wapPayRet', wapPayRet)
    ret.data = {
      action: wapPayRet
    }
    return ret
  }

  async toAccountTransfer(args, ret) {
    this.LOG.info(args.uuid, '/toAccountTransfer', args)
    let outBizNo = args.out_biz_no
    let payeeAccount = args.account
    let amount = (args.amount / 100).toFixed(2)

    let toAccountTransferRet = await AlipaySdk.toAccountTransfer(outBizNo, payeeAccount, amount)
    this.LOG.info(args.uuid, '/toAccountTransfer toAccountTransferRet', toAccountTransferRet)

    ret = toAccountTransferRet
    return ret

  }
}

module.exports = AlipayController