export function isDevMode(): boolean {
  // return false;
  return process.env.NODE_ENV === "development";
}
