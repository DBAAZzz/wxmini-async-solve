export default class Bus {
  constructor() {
    this.subs = {}; //一个事件名称，可以执行多个回调函数
  }
  $on(type, fn) {
    if (!this.subs[type]) {
      this.subs[type] = [];
    }
    this.subs[type].push(fn);
  }
  $emit(type, ...args) {
    if (this.subs[type]) {
      this.subs[type].forEach((fn) => {
        fn(...args)
      })
    }
  }
  $off(type, fn) {
    let fns = this.subs[type];
    // fn的执向一样即可相同
    let index = fns.indexOf(fn);
    if (index !== -1) {
      fns.splice(index, 1)
    }
  }
  $once(type, fn) {
    let warpper = (...args) => {
      fn(...args)
      this.$off(type, warpper)
    }
    this.$on(type, warpper)
  }
}