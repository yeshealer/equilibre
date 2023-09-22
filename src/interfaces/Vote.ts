import { Pair } from "./Pair";

export interface Vote {
    pair: Pair;
    votes: number;
    percent: number;
}
