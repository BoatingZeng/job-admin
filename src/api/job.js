import request from '@/utils/request'

export function fetchJobList(data) {
  return request({
    url: '/job/listWithCount',
    method: 'post',
    data
  })
}

export function createJob(data) {
  return request({
    url: '/job/create',
    method: 'post',
    data
  })
}

export function updateJob(data) {
  return request({
    url: '/job/update',
    method: 'post',
    data
  })
}
