import { configure, getConsoleSink } from "@logtape/logtape";

export async function configureLogger() {
  await configure({
    sinks: {
      console: getConsoleSink({}),
    },
    loggers: [
      { category: ["game"], lowestLevel: "info", sinks: ["console"] },
      { category: ["logtape", "meta"], sinks: [] },
    ],
  });
}
