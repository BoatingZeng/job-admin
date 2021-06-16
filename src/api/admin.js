import request from '@/utils/request';

export function create(data) {
  return request({
    url: '/admin/create',
    method: 'post',
    data
  });
}

export function update(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    data
  });
}

export function list() {
  return request({
    url: '/admin/list',
  });
}

export function destroy(userName) {
  return request({
    url: '/admin/delete',
    params: {
      userName,
    }
  });
}
