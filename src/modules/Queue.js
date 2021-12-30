import { LOOP_STATE } from "../utils/constants.js";

export class Queue extends Array {
    constructor() {
        super();

        this.current = null;
        this.previous = null;
        this.loopState = LOOP_STATE.DISABLED;
    }

    get duration() {
        return this.reduce((acc, track) => acc + track.info.duration, this.current?.info.duration ?? 0);
    }

    setLoop(state) {
        Object.assign(this, { loopState: state });
        return this.loopState;
    }

    next() {
        this.previous = this.current;

        if (this.loopState === LOOP_STATE.SINGLE) this.unshift(this.previous);
        if (this.loopState === LOOP_STATE.QUEUE) this.push(this.previous);

        this.current = this.shift();
        return true;
    }
}
