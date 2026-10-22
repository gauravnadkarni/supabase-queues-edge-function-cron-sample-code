export default class CustomError extends Error {
  code?: number;
  payload?: unknown;
  constructor(message: string, code?: number, payload?: unknown) {
    super(message);
    this.code = code;
    this.payload = payload;
  }
}
