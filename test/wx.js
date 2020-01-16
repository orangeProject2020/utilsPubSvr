const WxpaySdk = require('./../sdk/wxpaySdk')
const uuidv4 = require('uuid/v4')

// let wxpaySdk = new WxpaySdk({
//   app_id: 'wx2e40960c5cfb7723',
//   mch_id: '1498206872',
//   key: 'dcc56b02438e78e756a2a07600a1af1f',
//   notify_url: 'https://api.sunonenight.com/notify/wxpay'
// })

let wxpaySdk = new WxpaySdk({
  app_id: 'wxe347dd259dc36edd',
  mch_id: '1573075611',
  key: 'dcc56b02438e78e756a2a07600a1af1f',
  notify_url: 'https://api.sunonenight.com/notify/wxpay'
})



let outTradeNo = uuidv4().replace(/-/g, '')
// wxpaySdk.miniPay(outTradeNo, 1000, '时不我待', '订单支付', 'oXFOG5OXAgMxKrx91Dgj_Nm1ZqmA', '14.17.22.47').then(ret => {
//   console.log(ret)
// })
wxpaySdk.h5Pay(outTradeNo, 1000, '时不我待', '订单支付', 'https://api.sunonenight.com', '14.17.22.47').then(ret => {
  console.log(ret)
})