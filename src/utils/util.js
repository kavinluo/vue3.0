export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 LOL', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 判断数据类型
 * @param obj  {}||[]  各种数据类型
 * @param type string  例如: Object String Array等数据类型
 * @return flag boolean 是否为要验证的数据类型
 * */
export function valDataType (obj, type) {
  let flag = false
  switch (type) {
    case 'String':
      obj.constructor === String ? flag = true : flag = false
      break
    case 'Array':
      obj.constructor === Array ? flag = true : flag = false
      break
    case 'Boolean':
      obj.constructor === Boolean ? flag = true : flag = false
      break
    case 'Date':
      obj.constructor === Date ? flag = true : flag = false
      break
    case 'Object':
      obj.constructor === Object ? flag = true : flag = false
      break
    default:
      alert(type + ':不支持的数据类型验证')
      break
  }
  return flag
}

/**
 * 设置缓存值
 * @param name
 * @param val
 */
export function setStaticData (name, val) {
  localStorage.setItem(name, JSON.stringify(val))
}

/**
 * 获取缓存值
 * @param name
 * @returns {any}
 */
export function getStaticData (name) {
  return JSON.parse(localStorage.getItem(name))
}

/**
 * 删除缓存值
 * @param name
 */
export function delStaticData (name) {
  localStorage.removeItem(name)
}

export const compareTime = {
  formatDateToTen: function (d) {
    return d > 9 ? d : '0' + d
  },
  getYearFun: function (d) {
    d = new Date(d)
    let m = d.getMonth()
    const dt = d.getDate()
    const arr1 = [
      d.getFullYear(),
      this.formatDateToTen(++m),
      this.formatDateToTen(dt)
    ]
    return arr1.join('-')
  },
  formatDateToStamp: function (d) {
    let m = d.getMonth()
    const dt = d.getDate()
    const arr1 = [
      d.getFullYear(),
      this.formatDateToTen(++m),
      this.formatDateToTen(dt)
    ]
    const arr2 = [
      this.formatDateToTen(d.getHours()),
      this.formatDateToTen(d.getMinutes()),
      '00'
    ]

    return new Date(arr1.join('-') + ' ' + arr2.join(':')).getTime()
  },
  // 与当前时间比较大小 t => 字符串
  comTimeSize: function (t1, t2) {
    // alert(t1+"-comTimeSize-"+t2)
    if (!t1) return null
    if (!t2) {
      return this.formatDateToStamp(new Date(t1)) >= this.formatDateToStamp(new Date())
    } else {
      return this.formatDateToStamp(new Date(t1)) >= this.formatDateToStamp(new Date(t2))
    }
  },
  // 比较当前时间是否不在两个时间范围内
  compareTimeSlot: function (st, et) {
    // alert(st+"-compareTimeSlot-"+et)
    const flag = false

    // et
    if (this.formatDateToStamp(new Date()) > this.formatDateToStamp(new Date(et))) { // et大于当前时间
      console.log('et大于当前时间')
      return 99
    }
    if (this.formatDateToStamp(new Date()) < this.formatDateToStamp(new Date(st))) { // st小于当前时间
      console.log('st小于当前时间')
      return -99
    }
    return flag
  }
}

export function downloadFile (res) {
  const blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' })
  const contentDisposition = res.headers['content-disposition']
  const pat = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const result = pat.exec(contentDisposition)
  const filename = result[1]
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  const reg = /^["](.*)["]$/g
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href)
}

// 通过身份证获取出生年月日
export function getBirth (idCard) {
  let birthday = ''
  // eslint-disable-next-line eqeqeq
  if (idCard) {
    // eslint-disable-next-line eqeqeq
    if (idCard.length == 15) {
      birthday = '19' + idCard.slice(6, 12)
      // eslint-disable-next-line eqeqeq
    } else if (idCard.length == 18) {
      birthday = idCard.slice(6, 14)
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
    // 通过正则表达式来指定输出格式为:1990-01-01
  }
  return birthday
}

export function getSex (idCard) {
  let sexStr = ''
  // eslint-disable-next-line eqeqeq
  if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
    sexStr = '男'
  } else {
    sexStr = '女'
  }
  return sexStr
}
