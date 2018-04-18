export default (length = 16) =>
  [...Array(length)].map(() => Math.random().toString(36)[3]).join('');