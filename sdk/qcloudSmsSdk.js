const tencentcloud = require("tencentcloud-sdk-nodejs")

class QcloudSms {

  constructor(opts) {
    let Client = tencentcloud.sms.v20190711.Client
    let models = tencentcloud.sms.v20190711.Models

    let Credential = tencentcloud.common.Credential
    let cred = new Credential(opts.secretId, opts.secretKey)

    let client = new Client(cred, 'ap-shanghai')

    this.client = client
    this.models = models

    this.sdkAppId = opts.sdkAppId
    this.verifyCodeTemplateId = opts.verifyCodeTemplateId
    this.verifyCodeSign = opts.verifyCodeSign
  }

  sendVerifyCode(mobile, verifyCode) {

    let req = new this.models.SendSmsRequest()
    req.deserialize({
      PhoneNumberSet: ['+86' + mobile],
      TemplateID: this.verifyCodeTemplateId,
      SmsSdkAppid: this.sdkAppId,
      Sign: this.verifyCodeSign,
      TemplateParamSet: [verifyCode]
    })

    return new Promise((r, j) => {
      this.client.SendSms(req, (err, response) => {
        if (err) {
          console.log(err);
          r(null)
          // return;
        }
        // 请求正常返回，打印response对象
        // console.log(response.to_json_string());
        r(response)
      })
    })
  }
}

module.exports = QcloudSms