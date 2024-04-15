type ClsType = string | number | (string | number)[] | Record<string, any> | undefined;

type WithoutUndefined<T> = T extends undefined ? never : T;

function toValue(cls: WithoutUndefined<ClsType>) {
  let temp: string;
  let str = '';
  if (typeof cls === 'string' || typeof cls === 'number') {
    str += cls;
  } else if (Array.isArray(cls)) {
    for (let i = 0, len = cls.length; i < len; i += 1) {
      if (cls[i]) {
        if (temp = toValue(cls[i])) {
          str && (str += ' ');
          str += temp;
        }
      }
    }
  } else {
    for (temp in cls) {
      if (cls[temp]) {
        str && (str += ' ');
        str += temp;
      }
    }
  }
  return str;
}


export function clsn(...rest: ClsType[]) {
  let temp;
  let str = '';
  for (let i = 0, len = rest.length; i < len; i += 1) {
    if (rest[i]) {
      if (temp = toValue(rest[i]!)) {
        str && (str += ' ');
        str += temp;
      }
    }
  }
  return str;
};

export default clsn;