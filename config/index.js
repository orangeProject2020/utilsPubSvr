module.exports = {
  port: 10004,
  db: require('./db'),
  alipay: require('./alipay'),
  wxpay: require('./wxpay'),
  sms: require('./sms')
}