export type Consumer<T> = (t: T) => void;
export type BiConsumer<T> = (t: T, r: T) => void;
export type Producer<T> = () => T;
