module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  // 下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
  // 主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
  // "off" -> 0 关闭规则
  // "warn" -> 1 开启警告规则
  //"error" -> 2 开启错误规则
  // 了解了上面这些，下面这些代码相信也看的明白了
  rules: {
    // 缩进
    "indent": 0,
    // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
    "no-mixed-spaces-and-tabs": [1, "smart-tabs"],
    "semi": 0,
    "no-tabs": 0,
    "space-before-function-paren": [0, "always"],
    // 强制在注释中 // 或 /* 使用一致的空格
    "spaced-comment": 0,
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号
    "comma-dangle": [1, "never"],
    // 强制使用一致的反勾号、双引号或单引号
    "quotes": 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    // 'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-trailing-spaces': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
