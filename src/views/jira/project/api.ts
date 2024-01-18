import { request } from '/@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

export const apiPrefix = '/api/system/jira_project/';
export function GetList(query: UserPageQuery) {
  return request({
    url: '/api/system/jira/get_project_list_page/',
    method: 'get',
    params: query,
  });
}
export function GetObj(id: InfoReq) {
  return request({
    url: apiPrefix + id,
    method: 'get',
  });
}

export function AddObj(obj: AddReq) {
  return request({
    url: apiPrefix,
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj: EditReq) {
  return request({
    url: '/api/system/jira/update_project/',
    method: 'post',
    data: obj,
  });
}


export function DelObj(id: DelReq) {
  return request({
    url: '/api/system/jira/delete_project/',
    method: 'post',
    data: { id },
  });
}
