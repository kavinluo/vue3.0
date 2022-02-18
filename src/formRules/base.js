import checkCard from './util/checkCard'// 身份证验证

const defEvent = 'blur' // 默认触发事件
const changeEvent = 'change'

/**
 * 规则名称       规则描述[触发事件]{后面跟上+号的表示可选规则，使用时在原规则加后缀“Must”}
 * ---------------------- 普通规则 -----------------------------
 * required       非空验证[blur]
 * mustHasOne     至少选择一个[change]
 * idNumber       身份证[default]
 * selectId       下拉框选择[change]
 * selectText     下拉框选择文本[change]
 * ---------------------- 可选规则 ------------------------------
 * mobile         手机号[default]+
 * email          邮箱[blur]+
 * number         数字[change]+
 * ---------------------- 规则函数 -----------------------------
 * asyncVal       异步服务器验证
 * isDate         date检测
 * illegalChar    特殊字符检测
 * serchPhone     搜索项手机号
 * sectionVal     字符串区间
 * inputLen       字符区间
 * numberSection  数字区间
 * numbers        必须为数字
 * ip             IP地址 0.0.0.0 - 255.255.255.255
 * postCode       邮编
 */
/** *********************** 常规规则 ****************************/
const baseRules = {
  // 非空验证--没有验证事件(默认的验证事件)
  requiredNoEvent: {
    required: true,
    message: '此项不能为空'
  },
  // 非空验证
  required: {
    required: true,
    message: '此项不能为空',
    trigger: defEvent
  },
  // 至少选择一个
  mustHasOne: {
    type: 'array',
    required: true,
    message: '请至少选择一个',
    trigger: 'change'
  },

  // 至少选择一个
  mustHasOneNoEvent: {
    type: 'array',
    required: true,
    message: '请至少选择一个'
  },

  // 身份证
  // idNumber: checkCard,
  idNumber: {},

  // 下拉框选择id
  selectId: {
    required: true,
    type: 'number',
    message: '该项必须选择',
    trigger: changeEvent
  },

  // 下拉框选择文本
  selectText: {
    required: true,
    type: 'string',
    message: '该项必须选择',
    trigger: changeEvent
  },

  /*
   * 字符串区间值
   * @min number 范围最小值
   * @max number 范围最大值
   * @return {}
   * */
  sectionVal: function (min = 2, max = 20) {
    return {
      min: min,
      max: max,
      message: '长度在 ' + min + ' 到 ' + max + ' 个字符'
    }
  },

  /**
   * 输入字符长度检测
   * @min number 范围最小值
   * @max number 范围最大值
   *
   * 参数：null -> 不做任何检测 inputLen()
   *      min -> 最少输入多少个字符 inputLen(2)
   *      0,max -> 最多输入多少个字符 inputLen(0,5)
   *      min,max -> 只能输入min-max个字符 inputLen(1,10)
   */
  inputLen: (min, max) => {
    // 长度检测
    return (rule, value = '', callback) => {
      let msg
      if (value === null || value === undefined) value = ''
      if (min === 0 && max && value.length > max) {
        msg = `最多输入${max}个字符`
      } else {
        if (max && (value.length > max || value.length < min)) {
          msg = '只能输入' + (min === max ? min : `${min}-${max}`) + '个字符'
        }
        if (value.length < min) {
          msg = `最少输入${min}个字符`
        }
      }
      msg && callback(new Error(msg))
      callback()
    }
  },

  /**
   * 非法字符串检测
   * @reg 非法字符正则表达式 默认只能输入中文、数字、英文（不含标点符号）
   *  /[@#\$%\^&\*]+/ ----> @|#|$|%|^|&|* 都属于非法字符
   * @msg 提示信息
   */
  illegalChar: (
    reg = /[^\u4e00-\u9fa5\w\s，。、；‘’“”《》？——－+-、~·！\]_（）()【】：]/gm,
    msg = '存在非法字符！') => {
    return (rule, value = '', callback) => {
      // value && reg.test(value) && callback(new Error(msg))  // 特殊字符验证2017-11-20 去掉
      callback()
    }
  },

  /**
   * 数字区间
   * @min number 最小值
   * @max number 最大值
   */
  numberSection (min = 0, max = 999999999) {
    return (rule, value = 0, callback) => {
      (value > max || value < min) && callback(new Error(`只能为${min}-${max}`))
      callback()
    }
  },

 /* /!*
   * 异步验证数据
   * @optins {} // 验证传递的参数
   * example
   * // {validator:baseRules.asyncVal, oldValue:{value:'',val:false}, url:'http://192.168.1.116:8000/role/list?name=&identify=djgs&type=', myMessage:'已存在', trigger: 'blur'}
   * *!/
  asyncVal: function (rule, value, callback, source, options) {
    const url = rule.url // 服务请求的地址
    const params = {} // 服务请求的必须参数
    const messages = rule.myMessage
    if (value === '') {
      rule.oldValue['value'] = ''
      return
    }
    rule.oldValue['value'] = value
    utils.queryData({
      url: url,
      params: params
    })().then(function (data) {
      let response = data['data']
      if (data['status'] == 200) {
        if (response['data'].length > 0) {
          // 数据库中已存在
          rule.oldValue['val'] = 1
          callback(new Error(messages))
        } else {
          // 数据库中不存在
          rule.oldValue['val'] = 0
          callback()
        }
      } else {
        // 服务端已经响应,2XX错误
        rule.oldValue['val'] = 2
        callback(new Error('服务端数据验证失败!'))
      }
    }).catch(function (error) {
      // 客户端请求失败
      rule.oldValue['val'] = 3
      callback(new Error(error))
    })
  }, */
  /**
   * 检测是否为date
   */
  isDate: function (rule, value, callback) {
    // 检验位的检测
    if ((value === null || value === undefined) ||
      (isNaN(new Date(value).getTime()))) {
      callback(new Error('格式不正确，请重新选择'))
    }
    callback()
  },

  /**
   * 搜索项手机号
   */
  serchPhone: function (rule, value, callback) {
    // 检验位的检测
    if (/[^0-9]/m.test(value)) {
      callback(new Error('手机号必须数字'))
    }
    callback()
  },

  /**
   * 必须数字
   */
  numbers: function (rule, value, callback) {
    // 检验位的检测
    if (!(/^\d+$/.test(value))) {
      callback(new Error('该项必须数字'))
    }
    callback()
  },
  /**
   * 不能为0
   */
  notZero: function (rule, value, callback) {
    // 检验位的检测
    if ((/^0+$/.test(value))) {
      callback(new Error('该项不能为0 '))
    }
    callback()
  },
  /**
   * 不能为0
   */
  notOne: function (rule, value, callback) {
    // 检验位的检测
    if ((/^1+$/.test(value))) {
      callback(new Error('该项不能为1 '))
    }
    callback()
  },

  /**
   * 必须正整数字且>0
   */
  greaterThanZero: function (rule, value, callback) {
    // 检验位的检测
    if (!/^\+?[1-9]\d*$/.test(value)) {
      callback(new Error('必须正整数且大于零'))
    }
    callback()
  },
  notChinese: function (rule, value, callback) {
    if (!/^[0-9a-zA-Z]+$/.test(value)) {
      callback(new Error('只能输入数字和字母'))
    }
    callback()
  },
  /**
   * 必须正整数字且>0
   */
  greaterThanZero1: function (rule, value, callback) {
    // 检验位的检测
    if (value === '' || value === null) callback()
    if (!/^\+?[1-9]\d*$/.test(value)) {
      callback(new Error('必须正整数且大于零'))
    }
    callback()
  },
  /**
   * 必须正整数字且>=0
   */
  greaterThanZero2: function (rule, value, callback) {
    // 检验位的检测
    if (value === '') callback()
    if (!/^\+?[0-9]\d*$/.test(value)) {
      callback(new Error('必须正整数且大于等于零'))
    }
    callback()
  },
  /**
   * 必须正整数字且>=0
   */
  greaterThanZero3 (min = 0, max = 100) {
    return (rule, value, callback) => {
      // 检验位的检测
      if (value === '') callback()
      if (!/^\+?[0-9]\d*$/.test(value)) {
        callback(new Error('必须正整数且大于等于零'))
      }
      if (+value >= +min && +value <= +max) {
        callback()
      } else {
        callback(new Error(`必须是${min}-${max}之间的数字`))
      }
      callback()
    }
  },

  /**
   * 必须数字
   */
  float: function (len = 2) {
    return (rule, value, callback) => {
      // 检验位的检测
      const reg = new RegExp('^(-|)\\d+(|\\.+\\d{1,' + len + '})$') // 可为负数
      if (!reg.test(value)) {
        callback(new Error(`该项必须数字(最多${len}位小数)`))
      }
      callback()
    }
  },
  multiple2 (rule, value, callback) {
  // 检验位的检测
  const val = (value / 0.5) + ''
  if (/\./g.test(val)) {
    callback(new Error('该项必须是0.5的倍数'))
  } else {
    callback()
  }
},
  /**
   * 最多两位小数数字
   */
  floatTwo: function (rule, value, callback) {
    // 检验位的检测
    if (!/^\d+\.?\d{0,2}$/m.test(value)) {
      callback(new Error('最多两位小数的数字'))
    }
    callback()
  },
  /**
   * 必须数字 .可以是小数
   */
  float1 (min = 0, max = 100) {
    return (rule, value, callback) => {
      if (value === '') callback()
      if (/^\d+\.?\d*$/m.test(value)) {
      } else {
        callback(new Error('该项必须是数字'))
      }
      if (+value >= +min && +value <= +max) {
        callback()
      } else {
        callback(new Error(`必须是${min}-${max}之间的数字`))
      }
    }
  },
  /**
   * 必须数字 .可以是小数
   */
  float2 (min = 0, max = 100) {
    return (rule, value, callback) => {
      if (value === '') callback()
      if (/^\d+.?\d{0,2}$/m.test(value)) {
      } else {
        callback(new Error('最多两位小数的数字'))
      }
      if (+value >= +min && +value <= +max) {
        callback()
      } else {
        callback(new Error(`必须是${min}-${max}之间的数字`))
      }
    }
  },

  /**
   * IP地址
   */
  ip: function (rule, value, callback) {
    // 检验位的检测
    // 0.0.0.0 - 255.255.255.255
    if (!(/^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/.test(
      value))) {
      callback(new Error('IP地址不正确'))
    }
    callback()
  },
  /**
   *邮编
   */
  postCode: function (rule, value, callback) {
    // 检验位的检测
    if (value && !(/^\d{6}$/.test(value))) {
      callback(new Error('请输入6位邮编数字'))
    }
    callback()
  },

  /** 自定义js 验证 导入用 */
  // 必填
  _require: function (value, callback, message) {
    if (value !== '' && value != null) {
    } else {
      callback(message)
    }
  },
  _ip: function (value, callback, message) {
    if ((/^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/.test(
      value))) {
    } else {
      callback(message)
    }
  },
  // 房间类别（性别）
  _roomSex: function (value, callback, message) {
    if (value === '' || value === null) {
      return
    }
    value = value.trim()
    if (value !== '男' && value !== '女') {
      callback(message)
    }
  },

 /* // 整数验证
  _integer: function (value, callback, message) {
    if (value === '' || value === null) {
      return
    }
    value = value.trim()
    // 检验位的检测
    if (!/^\+?[1-9]\d*$/.test(value)) {
      callback(message + '必须正整数且大于零')
    }
     // callback()
  }, */
  // 邮箱
  _email: function (value, callback, message) {
    if (value === '' || value === null) {
      return
    }
    value = value.trim()
    const myreg = /^([a-zA-Z0-9]+[_||]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_||]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    if (!myreg.test(value)) {
      callback(message)
    }
  },
  // 手机号
  _mobile: function (value, callback, message) {
    if (value === '' || value === null) {
      return
    }
    value = value.trim()
    const myreg = /^1[3456789]\d{9}$/
    if (!myreg.test(value)) {
      callback(message)
    }
  },
  // 验证yyyy-MM-dd
  _date: function (value, callback, message) {
    if (value === '' || value === null) {
      return
    }
    value = value.trim()
    // let myreg = /^\d{4}-(?:0\d|1[0-2])-(?:[0-2]\d|3[01])( (?:[01]\d|2[0-3])\:[0-5]\d\:[0-5]\d)?$/
    const myreg = /^\d{4}-\d{1,2}-\d{1,2}$/
    if (!myreg.test(value)) {
      callback(message)
    }
  },

  // 邮编
  _postCode: function (value = '', callback, message) {
    if (value) value = value.trim()
    baseRules.postCode({}, value, (mes) => {
      if (mes) {
        callback(message)
      }
    })
  },

  // 长度
/*  _inputLen: (min, max) => {
    // 长度检测
    return (value = '', callback, message) => {
      let msg
      if (value === null || value === undefined) value = ''
      if (min === 0 && max && value.length > max) {
        msg = `最多输入${max}个字符`
      } else {
        if (max && (value.length > max || value.length < min)) {
          msg = '只能输入' + (min === max ? min : `${min}-${max}`) + '个字符'
        }
        if (value.length < min) {
          msg = `最少输入${min}个字符`
        }
      }
      msg && callback(message + msg)
    }
  }, */

  // 身份证号
  _idNumber: function (rule, value = '', callback, message) {
    if (!value) return
    checkCard({}, value, (mes) => {
      if (mes) {
        callback(message)
      }
    })
  }
  /* // 必须是数字可以是小数
  _float: function (value = '', callback, message) {
    if (!value) return
    if (!/^\d+\.?\d{0,2}$/m.test(value)) {
      callback(`${message}最多两位小数的数字`)
    }
  } */
}
/** *********************** 可选规则 ****************************/
/**
 * 非必填，但如果有值则按规则进行验证
 */
const mustRules = {
  // 邮箱
  email: {
    type: 'email',
    message: '邮箱格式不正确',
    trigger: defEvent
  },

  // 手机号
  mobile: {
    type: 'string',
    message: '手机号格式不正确',
    pattern: /^1(3|4|5|6|7|8|9)\d{9}$/
  },

  // 数字-必须整数
  number: {
    message: '该项必须为正整数',
    pattern: /^\d+$/,
    trigger: defEvent
  }
}

/* // 可选规则追加必填属性，规则名称后缀"Must"
_.map(mustRules, (val, key) => {
  mustRules[key + 'Must'] = _.defaultsDeep({}, {
    required: true
  }, val)
}) */

Object.assign(baseRules, mustRules)

export default baseRules
