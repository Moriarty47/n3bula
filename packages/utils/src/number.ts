export const isInt32 = (value: number): boolean => value === (value | 0);

export const isUint32 = (value: number): boolean => value === (value >>> 0);

export const validateInt32 = (value: number): boolean =>
  !(value < -2_147_483_648 || value > 2_147_483_647);

export const validateUint32 = (value: number): boolean =>
  !(value < 0 || value > 4_294_967_295);