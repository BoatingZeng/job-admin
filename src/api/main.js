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
  const dict = res.data;
  if (dict) {
    const value2Label = {};
    const label2Value = {};
    for (const field in dict) {
      if (!Object.prototype.hasOwnProperty.call(dict, field)) continue;
      const fieldObj = dict[field];
      value2Label[field] = {};
      label2Value[field] = {};
      for (const key in fieldObj) {
        if (!Object.prototype.hasOwnProperty.call(fieldObj, key)) continue;
        const { label, value } = fieldObj[key];
        value2Label[field][value] = label;
        label2Value[field][label] = value;
      }
    }
    value = {
      dict,
      value2Label,
      label2Value
    };
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(e)
    }
  }
  return value || {};
}

export function adminInfo() {
  return request({
    url: '/main/adminInfo',
    method: 'get',
  })
}
