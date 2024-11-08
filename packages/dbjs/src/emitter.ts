import { EventEmitter } from '@n3bula/event-emitter';

export const emitter: EventEmitter = new EventEmitter('database');

export type Emitter = EventEmitter;
