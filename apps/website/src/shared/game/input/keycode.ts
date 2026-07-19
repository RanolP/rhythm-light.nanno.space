export const KeyCode = Object.freeze({
  Mouse: Object.freeze({
    LEFT: "KC_MS_BTN1",
    RIGHT: "KC_MS_BTN2",
    MIDDLE: "KC_MS_BTN3",
  }),
});

export type KeyCodes<T> = T extends Record<string, infer V> ? KeyCodes<V> : T;
