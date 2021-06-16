import request from '@/utils/request';

export function fetchUserList(data) {
  return request({
    url: '/user/listAndCount',
    method: 'post',
    data
  });
}
