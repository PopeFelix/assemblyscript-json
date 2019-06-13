import { JSONDecoder } from "../decoder";
import { JSONEncoder } from "../encoder";
import { Buffer } from "../util";

let handler: JSONEncoder;
let decoder: JSONDecoder<JSONEncoder>;
let buffer: Uint8Array;
let resultBuffer: Uint8Array;
let resultString: string;

function countOf<T>(item: T): void {
  let ptr = changetype<usize>(item);
  log<usize>(load<usize>(ptr - 12));
}

function roundripTest(jsonString: string, _expectedString: string  = ""): bool {
  const expectedString: string =
    _expectedString == "" ? jsonString : _expectedString;
  // __retain(changetype<usize>(expectedString));
  let buffer: Uint8Array = Buffer.fromString(jsonString);
  __retain(changetype<usize>(buffer));
  // countOf<Uint8Array>(buffer);
  // countOf<Uint8Array>(buffer);
  let handler = new JSONEncoder();
  __retain(changetype<usize>(handler));
  let decoder = new JSONDecoder<JSONEncoder>(handler);
  // log("handler")
  // countOf<JSONEncoder>(handler);
  // countOf<JSONDecoder<JSONEncoder>>(decoder);

  __retain(changetype<usize>(decoder));
  decoder.deserialize(buffer, null);
  // countOf<Uint8Array>(buffer);
  let resultBuffer = handler.serialize();
  __retain(changetype<usize>(resultBuffer));

  // countOf<Uint8Array>(resultBuffer);
  let resultString: string = Buffer.toString(resultBuffer);
  __retain(changetype<usize>(resultString));

  // countOf<Uint8Array>(resultBuffer);
  // log(expectedString + " " + resultString);
  // log(expectedString == resultString);
  expect<string>(resultString).toStrictEqual(expectedString);
  expect<string>(handler.toString()).toStrictEqual(expectedString);
  // __release(changetype<usize>(buffer));
  // __release(changetype<usize>(handler));
  // __release(changetype<usize>(decoder));

  return true;
}

describe("Round trip", () => {
  // beforeEach(() => {
  //   let newhandler = changetype<JSONEncoder>(__retain(changetype<usize>(new JSONEncoder())));
  //   __release(changetype<usize>(handler));
  //   handler = newhandler;
  //   let newdecoder = changetype<JSONDecoder<JSONEncoder>>(__retain(changetype<usize>(new JSONDecoder<JSONEncoder>(handler))));
  //   __release(changetype<usize>(decoder));
  //   decoder = newdecoder;
  // });

  // it("create decoder", () => {
  //   expect<bool>(decoder != null).toBe(true)
  // });

  it("should handle empty object", () => {
    let result = roundripTest("{}");
    expect<bool>(result).toBe(true);
  });

  it("should handle empty object with whitespace", () => {
    let result = roundripTest("{ }", "{}");
    expect<bool>(result).toBe(true);
  });

  it("should handle int32", () => {
    // expectFn(():void => {
    let result = roundripTest('{"int":4660}');
    expect<bool>(result).toBe(true);
  });

  it("should handle int32Sign", () => {
    let result = roundripTest('{"int":-4660}');
    expect<bool>(result).toBe(true);
  });

  it("should handle true", () => {
    let result = roundripTest('{"val":true}');
    expect<bool>(result).toBe(true);
  });

  it("should handle false", () => {
    let result = roundripTest('{"val":false}');
    expect<bool>(result).toBe(true);
  });

  it("should handle null", () => {
    let result = roundripTest('{"val":null}');
    expect<bool>(result).toBe(true);
  });

  it("should handle string", () => {
    let result = roundripTest('{"str":"foo"}');
    expect<bool>(result).toBe(true);
  });

  it("should handle string escaped", () => {
    let result = roundripTest(
      '"\\"\\\\\\/\\n\\t\\b\\r\\t"',
      '"\\"\\\\/\\n\\t\\b\\r\\t"'
    );
    expect<bool>(result).toBe(true);
  });

  it("should handle string unicode escaped simple", () => {
    let result = roundripTest('"\\u0022"', '"\\""');
    expect<bool>(result).toBe(true);
  });

  it("should handle string unicode escaped", () => {
    let result = roundripTest(
      '"\\u041f\\u043e\\u043b\\u0442\\u043e\\u0440\\u0430 \\u0417\\u0435\\u043c\\u043b\\u0435\\u043a\\u043e\\u043f\\u0430"',
      '"Полтора Землекопа"'
    );
    expect<bool>(result).toBe(true);
  });

  it("should multiple keys", () => {
    let result = roundripTest('{"str":"foo","bar":"baz"}');
    expect<bool>(result).toBe(true);
  });

  it("should handle nested objects", () => {
    let result = roundripTest('{"str":"foo","obj":{"a":1,"b":-123456}}');
    expect<bool>(result).toBe(true);
  });

  it("should handle empty array", () => {
    let result = roundripTest("[]");
    expect<bool>(result).toBe(true);
  });

  it("should handle array", () => {
    let result = roundripTest("[1,2,3]");
    expect<bool>(result).toBe(true);
  });

  it("should handle nested arrays", () => {
    let result = roundripTest("[[1,2,3],[4,[5,6]]]");
    expect<bool>(result).toBe(true);
  });

  it("should handle nested objects and arrays", () => {
    let result = roundripTest(
      '{"str":"foo","arr":[{"obj":{"a":1,"b":-123456}}]}'
    );
    expect<bool>(result).toBe(true);
  });

  it("should handle whitespace", () => {
    expect<bool>(
      roundripTest(
        ' { "str":"foo","obj": {"a":1, "b" :\n -123456} } ',
        '{"str":"foo","obj":{"a":1,"b":-123456}}'
      )
    ).toBe(true);
  });
});
