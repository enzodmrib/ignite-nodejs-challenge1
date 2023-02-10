// users/:id
export function buildRoutePath(path) {
  //The regex to match the id coming from the path
  const routeParametersRegex = /:([a-zA-z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}`) /**(?<query>\\?(.*))?$ */ 

  return pathRegex
}