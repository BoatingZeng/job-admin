import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/public/loginAdmin',
    method: 'post',
    data
  })
}
