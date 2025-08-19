// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReturnAsyncType<T extends (...args: any) => any> = Awaited<ReturnType<T>>;
