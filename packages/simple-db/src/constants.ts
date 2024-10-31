export const DEFAULT_DB_NAME = 'data';
export const FILE_HEADER_SIZE = 100;
export const MAGIC_HEADER = Buffer.from('n3bula_simple_db_v1\x00'); // 20
export const MAGIC_HEADER_SIZE = MAGIC_HEADER.length;
export const PAGE_SIZE = 0x1000; // 4096
