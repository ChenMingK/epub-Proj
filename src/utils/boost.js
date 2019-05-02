/* eslint-disable */
// 扩展数组方法 push不重复的数组元素
Array.prototype.pushWithoutDuplicate = function() { 
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    // this -> 调用该方法的数组
    // 判断参数(push的元素)是否在数组中存在
    if (this.indexOf(arg) === -1) {
      this.push(arg)
    }
  }
}