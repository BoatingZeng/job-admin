import request from '@/utils/request'

export function fetchTagList() {
  return request({
    url: '/tag/list',
    method: 'get',
  });
}

export function createTag(data) {
  return request({
    url: '/tag/create',
    method: 'post',
    data
  });
}

export function updateTag(data) {
  return request({
    url: '/tag/update',
    method: 'post',
    data
  });
}

export function deleteTag(id) {
  return request({
    url: '/tag/delete',
    method: 'get',
    params: {
      id,
    }
  });
}
