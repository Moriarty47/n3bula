export const DEFAULT_DB_NAME: string = 'data';
export const DEFAULT_DB_EXT: string = 'db';
export const DEFAULT_DB_INDEX_EXT: string = 'dbi';

export const META = Object.freeze({
  FILE_HEADER_SIZE: 128,
  MAGIC_HEADER: Buffer.from('N3BULA_DB_V1\x00'), // 13 bytes
  MAGIC_HEADER_SIZE: 20,
  MAGIC_INDEX_HEADER: Buffer.from('N3BULA_DB_INDEX_V1\x00'), // 19 bytes
  MAGIC_INDEX_HEADER_SIZE: 20,
  CREATE_TIME_OFFSET: 20, 
  INDEX_SIZE_OFFSET: 24,
  DELETE_NUM_OFFSET: 28,
  FILE_HEADER_END_OFFSET: 127,
  INDEX_DELETE_OFFSET: 1,
  INDEX_KEYSIZE_OFFSET: 5,
  INDEX_POINTER_OFFSET: 9,
  INDEX_FIXED_SIZE: 9,
  PAGE_VALUESIZE_SIZE: 4,
} as const);

export const enum PAGE_CELL_TYPE {
  Pointer,
  KeyValue,
}

export const enum PAGE_TYPE {
  EMPTY = 0x00,
  INTERNAL = 0x05,
  LEAF = 0x0d,
}