export function px2rem(px) {
  const ratio = 375 / 10
  return px / ratio
}
// 根据当前屏幕缩放比例计算出真实的像素 500 ? APP.vue规定缩放比例最多10倍
export function realPx(px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}