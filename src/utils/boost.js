/* eslint-disable */
// 扩展方法
Array.prototype.pushWithoutDuplicate = function() { 
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    // this -> Array
    if (this.indexOf(arg) === -1) {
      this.push(arg)
    }
  }
}