// App 的生命周期
export const appFns = [
  'onLaunch',
  'onShow',
  'onHide',
  'onThemeChange'
]

// Page 的生命周期
export const pageFns = [
  'onLoad',
  'onShow',
  'onReady',
  'onHide',
  'onUnload'
]
// Component 的生命周期
export const componenetFns = [
  'created',
  'attached',
  'ready',
  'moved',
  'detached',
]


/**
 * 将字符串的首位转换成大写
 * @param {String}} str 
 */
export const firstUpper = function (str) {
  return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase())
}