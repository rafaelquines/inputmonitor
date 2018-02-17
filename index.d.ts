declare module 'inputmonitor' {
    export default class InputMonitor {
        constructor(gpioNum: number, pullUpDown: number, inNumber: number, inName: string, inTimeout: number);
        public start(): void;
        public onInputChange(callback: any): void;
        public setStatus(level: boolean): void;
    }
}