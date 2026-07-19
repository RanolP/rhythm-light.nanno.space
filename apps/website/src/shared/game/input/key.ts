import { lowerbound } from "../../utils/algorithm";

export interface KeySetControl<KeyCode extends string> {
  beginPress(code: KeyCode, at: number): void;
  endPress(code: KeyCode, at: number): void;

  at(time: number): KeySetState<KeyCode>;
  commit(time: number): void;
}

export interface KeySetState<KeyCode extends string> {
  isPressStarted(key: KeyCode): boolean;
  isPressEnded(key: KeyCode): boolean;
  isPressed(key: KeyCode): boolean;
}

type KeyEventKind = "begin" | "end";

interface KeyEvent<KeyCode extends string> {
  kind: KeyEventKind;
  at: number;
  code: KeyCode;
}

export function createKeySetControl<KeyCode extends string>(): KeySetControl<KeyCode> {
  let lastSnapshot = new Set<KeyCode>();
  let events: KeyEvent<KeyCode>[] = [];

  const applyEvents = (prev: Set<KeyCode>, now: number) => {
    const partitionPoint = lowerbound(events, ({ at }) => at, now);
    const [queued, leftover] = [events.slice(0, partitionPoint), events.slice(partitionPoint)];

    const curr = new Set(prev);
    const begins = new Set<KeyCode>();
    const ends = new Set<KeyCode>();
    for (const event of queued) {
      switch (event.kind) {
        case "begin": {
          curr.add(event.code);
          begins.add(event.code);
          break;
        }
        case "end": {
          curr.delete(event.code);
          ends.add(event.code);
          break;
        }
      }
    }
    return [curr, { begins, ends }, leftover] as const;
  };

  return {
    beginPress(code, at) {
      events.push({ kind: "begin", at, code });
    },
    endPress(code, at) {
      events.push({ kind: "end", at, code });
    },
    at(time) {
      const [currentSnapshot, { begins, ends }] = applyEvents(lastSnapshot, time);
      return {
        isPressStarted(key) {
          return begins.has(key);
        },
        isPressEnded(key) {
          return ends.has(key);
        },
        isPressed(key) {
          return currentSnapshot.has(key);
        },
      };
    },
    commit(time) {
      [lastSnapshot, , events] = applyEvents(lastSnapshot, time);
    },
  };
}
