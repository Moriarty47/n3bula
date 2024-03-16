type EventListener = ((...rest: any[]) => void) & {
    [ONCE]?: boolean;
};
declare const ONCE: unique symbol;
export declare class EventEmitter {
    private events;
    constructor(name?: string);
    on(type: string, listener: EventListener, once?: boolean): this;
    once(type: string, listener: EventListener): this;
    off(type: string, listener: EventListener): this;
    emit(type: string, ...rest: any[]): this | undefined;
    hasListeners(type?: string): boolean;
    offAll(): void;
}
export declare function useEventEmitter(name?: string): EventEmitter;
export default EventEmitter;
