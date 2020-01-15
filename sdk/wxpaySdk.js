// const HttpUtil = require('./http_util')
const request = require('request')
const uuidv4 = require('uuid/v4')
const crypto = require('crypto')
const xml2js = require('xml2js')
const log = require('./../lib/log')('wxpay_sdk')
// const config = require('./../../config').wxpay
// const {
//   domain,
//   miniApp
// } = require('./../../config')

const API_URL = 'https://api.mch.weixin.qq.com'

// const SERVICE_BUSIBESS_INFO = {
//   app_id : config.app_id,
//   mch_id : config.mch_id,
//   key : config.key
// }

// h5支付 scene_info
/**
 1，IOS移动应用
{"h5_info": //h5支付固定传"h5_info" 
    {"type": "",  //场景类型
     "app_name": "",  //应用名
     "bundle_id": ""  //bundle_id
     }
}

 2，安卓移动应用
{"h5_info": //h5支付固定传"h5_info" 
    {"type": "",  //场景类型
     "app_name": "",  //应用名
     "package_name": ""  //包名
     }
}

3，WAP网站应用
{"h5_info": //h5支付固定传"h5_info" 
   {"type": "Wap",  //场景类型
    "wap_url": "",//WAP网站URL地址
    "wap_name": ""  //WAP 网站名
    }
}

 */

/**
 * 
 trade_type :
  JSAPI ： 公众号
  NATIVE : 原生(扫码)
  MWEB : h5
  APP: app
 */

class WxPay {

  constructor(opts) {

    this.app_id = opts.app_id
    this.mch_id = opts.mch_id
    this.key = opts.key

    this.notify_url = opts.notify_url
    // this.h5_url = config.h5_url

    // this.trade_type = opt.trade_type || 'JSAPI' // JSAPI，NATIVE，APP
  }

  async unifiedOrder(body, out_trade_no, total_fee, ip, payment_type = 'APP', openid = '', attach = '', scene_info = '') {
    let mchId = this.mch_id
    let appId = this.app_id
    // if (payment_type == 'JSAPI') {
    //   mchId = miniApp.mch_id
    //   appId = miniApp.appId
    //   this.key = miniApp.key
    // }

    let unifiedOrderObj = {
      appid: appId,
      mch_id: mchId,
      device_info: 'WEB',
      nonce_str: this._getNonceStr(),
      sign_type: 'MD5',
      body: body,
      // detail : obj.detail,
      attach: attach || '',
      out_trade_no: out_trade_no,
      fee_type: 'CNY',
      total_fee: parseInt(total_fee),
      spbill_create_ip: ip,
      notify_url: this.notify_url,
      trade_type: payment_type || 'APP', // trade_type为JSAPI时必须传openid
      // openid : openid
    }

    if (payment_type == 'JSAPI') {
      unifiedOrderObj.openid = openid
    }

    if (scene_info) {
      unifiedOrderObj.scene_info = JSON.stringify(scene_info)
    }

    let signStr = this._sign(unifiedOrderObj)
    log.info('unifiedorder signStr', signStr)
    unifiedOrderObj.sign = signStr

    // return unifiedOrderObj
    log.info('unifiedorder unifiedOrderObj', unifiedOrderObj)
    let unifiedOrderUrl = API_URL + '/pay/unifiedorder'
    let response = await this._httpPost(unifiedOrderUrl, unifiedOrderObj, 'xml')

    let result = await this._xmlToObj(response)
    log.info('unifiedorder result', result)

    let ret = {
      code: 0,
      message: ''
    }
    if (result.return_code == 'SUCCESS' && result.result_code == 'SUCCESS') {
      ret.data = result
    } else {
      ret.code = 1
      ret.message = result.err_code_des || result.return_msg
    }
    log.info('unifiedorder ret', ret)
    return ret
  }

  async h5Pay(outTradeNo, totalAmount, body, subject, returnUrl, ip = '') {
    let sceneInfo = {
      h5_info: {
        type: 'Wap',
        wap_url: returnUrl,
        wap_name: body
      }
    }
    log.info('/h5Pay sceneInfo', sceneInfo)
    let ret = await this.unifiedOrder(body + '-' + subject, outTradeNo, totalAmount, ip, 'MWEB', '', '', sceneInfo)
    return ret
  }

  getPayInfo(prepayId, isMpWx = 0) {
    if (isMpWx) {
      return this.miniPayInfo(prepayId)
    } else {
      return this.appPayInfo(prepayId)
    }
  }

  appPayInfo(prepayId) {

    let appPayObj = {
      appid: this.app_id,
      partnerid: this.mch_id,
      prepayid: prepayId,
      package: 'Sign=WXPay',
      noncestr: this._getNonceStr(),
      timestamp: parseInt(Date.now() / 1000)
    }

    let signStr = this._sign(appPayObj)
    appPayObj.sign = signStr

    return appPayObj
  }

  miniPayInfo(prepayId) {
    let miniPayObj = {
      appId: this.app_id,
      timeStamp: parseInt(Date.now() / 1000),
      nonceStr: this._getNonceStr(),
      package: 'prepay_id=' + prepayId,
      signType: 'MD5'
    }

    let signStr = this._sign(miniPayObj)
    miniPayObj.sign = signStr
    return miniPayObj
  }

  _sign(signObj) {

    let sortStr = this._keySortStr(signObj, this.key)
    log.info('========================', sortStr)
    let hash = crypto.createHash('md5')
    hash.update(sortStr)
    let signStr = hash.digest('hex')

    return signStr.toUpperCase()
  }

  // 随机生成nonce_str
  _getNonceStr() {
    return uuidv4().replace(/-/g, '')
  }

  // 对象按照key排序转化成字符串
  _keySortStr(obj, key = '') {
    let sdic = Object.keys(obj).sort()
    let strArr = []
    for (let k in sdic) {
      if (obj[sdic[k]] !== null) {
        strArr.push(sdic[k] + '=' + obj[sdic[k]])
      }
    }
    if (key) {
      strArr.push('key=' + key)
    }
    return strArr.join('&')
  }

  _xmlToObj(xml) {
    var parseString = xml2js.parseString
    return new Promise((resolve, reject) => {
      parseString(xml, {
        explicitArray: false
      }, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result.xml)
      })
    })

  }

  _objToXml(obj) {
    // log.info('_objToXml================' , obj)
    // var builder = new xml2js.Builder()
    // var jsonxml = builder.buildObject(obj)

    // log.info('_objToXml================' , jsonxml)
    // return jsonxml
    let xml = '<xml>'
    for (let key in obj) {
      if (obj[key]) {
        xml += `<${key}>${obj[key]}</${key}>`
      }

    }
    xml += '</xml>'
    // log.info('_objToXml================' , xml)
    return xml
  }


  _httpGet(action) {
    return new Promise((resolve, reject) => {
      request(action, (error, response, body) => {
        if (error) {
          reject(error)
        }

        if (!error && response.statusCode == 200) {
          resolve(body)
        }
        // log.info('error:', error); // Print the error if one occurred
        // log.info('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // log.info('body:', body); // Print the HTML for the Google homepage.
      })
    })

  }

  _httpPost(action, data = {}, method = 'json') {
    // log.info('xml================' , data)
    let contentType = 'application/json'
    let body = data
    if (method == 'json') {
      // if (data){
      //   body = JSON.stringify(data)
      // }

    } else if (method == 'xml') {
      contentType = 'text/xml'
      body = this._objToXml(data)

    }
    // log.info('===================' , body)
    return new Promise((resolve, reject) => {
      request({
        url: action,
        method: 'POST',
        json: true,
        headers: {
          'content-type': contentType,
        },
        body: body
      }, function (error, response, body) {
        if (error) {
          reject(response)
        }
        if (!error && response.statusCode == 200) {
          resolve(body)
        }
      })
    })
  }

}

module.exports = WxPay