const validate = (token) => {
  const validToken = true;
  if (!validToken || !token) {
    return false;
  }
  return true;
};
export function authMiddleware(request) {
    const token = request.header.get("authorization")?.split(" ")[1];
    const isValid = validate(token);
  return {isValid};
}
