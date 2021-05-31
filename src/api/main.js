import request from '@/utils/request'

export async function getDict(key) {
  let value = sessionStorage.getItem(key)
  if (value) {
    try {
      value = JSON.parse(value)
      return value
    } catch (e) {
      console.error(e)
    }
  }
  const res = await request({
    url: '/main/getDict',
    method: 'get',
    params: {
      key
    }
  })
  value = res.data
  if (value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(e)
    }
  }
  return value
}
