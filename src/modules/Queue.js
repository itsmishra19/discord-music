import { LOOP_STATE } from "../utils/constants";

export class Queue extends Array {
    constructor() {
        super();

        this.current = null;
        this.loopState = LOOP_STATE.DISABLED;
    }

    get duration() {
        return this.reduce((acc, track) => acc + track.info.duration, this.current?.info.duration ?? 0);
    }

    setLoop(state) {
        Object.assign(this, { loopState: state });
        return this.loopState;
    }
}
