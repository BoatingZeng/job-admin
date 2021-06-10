import request from '@/utils/request'

export function fetchCategoryList() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/category/create',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data
  });
}

export function deleteCategory(id) {
  return request({
    url: '/category/delete',
    method: 'get',
    params: {
      id
    }
  })
}
