export type BaseType = number | string | boolean | null | undefined;

type ClsType = BaseType | BaseType[] | Record<string, any>;

type WithoutBoolAndFalsy<T> = T extends undefined | null | boolean
  ? never
  : T extends (infer U)[]
  ? WithoutBoolAndFalsy<U>[]
  : T;

type ClsTypeWithoutBoolAndFalsy = WithoutBoolAndFalsy<ClsType>;

function toValue(cls: ClsTypeWithoutBoolAndFalsy) {
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
      if (temp = toValue(rest[i] as ClsTypeWithoutBoolAndFalsy)) {
        str && (str += ' ');
        str += temp;
      }
    }
  }
  return str;
};

export default clsn;