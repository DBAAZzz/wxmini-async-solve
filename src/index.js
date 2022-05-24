import Bus from './util/bus.js'
import { appFns, pageFns, componenetFns, firstUpper } from './util/index.js'
let bus = new Bus()

var proxy = {}
var proxyPromise = {}
var promiseStatus = {}
var queue = {}

// 拦截生命周期统一注入的方法
export const injectLifeCycleFns = {
  'onLoad': null,
  'onShow': function () {
    console.log('我是统一拦截注入的 onShow 方法')
  }
}

// 筛选自定义生命周期
function filterCustomFn(type, fnName) {
  let varName = '',
    lifeCycleName = ''
  type.forEach(fn => {
    let hasPageFns = fnName.indexOf(fn) === 0
    if (hasPageFns) {
      varName = fnName.slice(fn.length)
      lifeCycleName = fn
    }
  });
  return [varName, lifeCycleName]
}

// 延迟改变 promise 状态
function pendingPromise(key) {
  return new Promise((resolve, reject) => {
    promiseStatus[key] = 'pending'
    queue[key] = resolve
  })
}

export const proxyData = function (target) {
  for (let key in target) {
    let realKey = firstUpper(key)
    proxyPromise[realKey] = pendingPromise(realKey)
  }

  proxy = new Proxy(target, {
    get: (obj, prop) => {
      return prop in obj ? obj[prop] : undefined;
    },
    set: (obj, prop, value) => {
      let realKey = firstUpper(prop)
      if (queue[realKey]) {
        if (promiseStatus[realKey] === 'pending') {
          queue[realKey](value)
          bus.$emit(realKey, value)
        } else {
          delete proxyPromise[realKey]
          proxyPromise[realKey] = pendingPromise(realKey)
          queue[realKey](value)
        }
        promiseStatus[realKey] = 'fulfilled'
      }
      obj[prop] = value;
      return true
    }
  })

  return proxy
}

export const init = function () {
  const _App = App
  const _Page = Page
  const _Component = Component

  // 重写 App 方法
  App = function (options) {
    for (let key in options) {
      let [name, lifeCycle] = filterCustomFn(appFns, key)
      if (name) {
        injectCustom(options, name, key, lifeCycle)
      }
    }
    _App(options)
  }

  // 重写 Page 方法
  Page = function (options) {
    pageFns.forEach(fn => {
      interceptor.call(options, fn, injectLifeCycleFns[fn] || null)
    });

    for (let key in options) {
      let [name, lifeCycle] = filterCustomFn(pageFns, key)
      if (name) {
        // let _data = {}
        injectCustom(options, name, key, lifeCycle)
      }
    }

    _Page(options)
  }

  // 重写 Component 方法
  Component = function (options) {
    console.log('options', options)
    for (let key in options) {
      let [name, lifeCycle] = filterCustomFn(componenetFns, key)
      if (name) {
        injectCustom(options, name, key, lifeCycle)
      }
    }

    _Component(options)
  }

}

/**
 * 拦截App、页面、组件中的声明周期并进行拦截
 * @param {String} key 
 * @param {Function} injectFn 
 */
function interceptor(key, injectFn) {
  const fn = this[key]
  if (fn && typeof fn === 'function') {
    this[key] = function () {
      // 代码注入
      injectFn && injectFn.call(this, ...arguments)
      return fn.call(this, ...arguments)
    }
  }
}

/**
 * 将异步执行的代码注入到指定的生命周期中
 * @param {*} options 
 * @param {*} name 
 * @param {*} key 
 * @param {*} lifeCycle 
 */
function injectCustom(options, name, key, lifeCycle) {
  if (proxy.hasOwnProperty(firstUpper(name))) {
    interceptor.call(options, lifeCycle, function (...args) {
      let _dataPromise = {}
      _dataPromise[name] = {}
      options._dataPromise = _dataPromise
      options._dataPromise[name].promise = new Promise((resolve, reject) => {
        options._dataPromise[name].proRes = resolve
      })

      if (promiseStatus[name] === 'fulfilled') {
        console.log('执行了哈哈哈')
        options._dataPromise[name].proRes()
      } else {
        bus.$on(name, (res) => {
          options._dataPromise[name].proRes(res)
        })
      }

      options._dataPromise[name].promise.then(() => {
        options[key].call(this, ...args)
      })
    })
  }
}
