import { describe, it, expect, beforeEach } from "vitest";
import useDevLog from "../../src/runtime/composables/useDevLog";

describe("useDevLog", () => {
  let devLog;

  beforeEach(() => {
    devLog = useDevLog();
    devLog.clear(); // Clear logs before each test
  });

  it("adds log entries", () => {
    devLog.log("Test message");
    expect(devLog.logs.value).toHaveLength(1);
    expect(devLog.logs.value[0]).toMatchObject({
      type: "log",
      content: ["Test message"],
    });
  });

  it("adds different types of logs", () => {
    devLog.info("Info message");
    devLog.error("Error message");
    devLog.warn("Warning message");

    expect(devLog.logs.value).toHaveLength(3);
    expect(devLog.logs.value[0].type).toBe("info");
    expect(devLog.logs.value[1].type).toBe("error");
    expect(devLog.logs.value[2].type).toBe("warn");
    expect(devLog.logs.value[0].content).toEqual(["Info message"]);
    expect(devLog.logs.value[1].content).toEqual(["Error message"]);
    expect(devLog.logs.value[2].content).toEqual(["Warning message"]);
  });

  it("clears logs", () => {
    devLog.log("Test message");
    devLog.clear();
    expect(devLog.logs.value).toHaveLength(0);
  });

  it("handles objects and errors", () => {
    const testObj = { foo: "bar" };
    const testError = new Error("Test error");

    devLog.log(testObj);
    devLog.error(testError);

    expect(devLog.logs.value).toHaveLength(2);
    expect(devLog.logs.value[0].content[0]).toEqual(testObj);
    expect(devLog.logs.value[1].content[0]).toMatchObject({
      name: testError.name,
      message: testError.message,
    });
  });
});
