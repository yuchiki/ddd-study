const TOKEN = 'token'
const USERNAME = 'username'

export type AuthInfo = {
  token: string
  username: string
}

export const getAuthInfo = (): AuthInfo | null => {
  const token = localStorage.getItem(TOKEN)
  const username = localStorage.getItem(USERNAME)
  if (!token || !username) {
    return null
  }
  return { token, username }
}

export const setAuthInfo = (authInfo: AuthInfo): void => {
  localStorage.setItem(TOKEN, authInfo.token)
  localStorage.setItem(USERNAME, authInfo.username)
}

export const resetLoginStatus = () => {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(USERNAME)
}
