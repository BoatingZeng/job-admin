import request from '@/utils/request';

export function listLog() {
  return request({
    url: '/main/listLog',
  });
}

export function getFileContent(fileName) {
  return request({
    url: '/main/getFileContent',
    params: {
      fileName,
    },
  });
}
