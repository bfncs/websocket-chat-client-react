export const randomString = (length: number = 16): string => {
  let str = "";
  let i = 0;
  while (i++ < length) {
    str += Math.random().toString(36)[3];
  }
  return str;
};
