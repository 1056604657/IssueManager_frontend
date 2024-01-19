import { request } from '/@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

export function getIssueList(query: any) {
  return request({
    url: '/api/system/jira/get_issue_list/',
    method: 'get',
    params: query,
  });
}
export function getIssueDetail(data: any) {
  return request({
    url: '/api/system/jira/get_issue_detail/',
    method: 'post',
    data: data
  });
}
export function geProjectList() {
  return request({
    url: '/api/system/jira/get_project_list/',
    method: 'get',
  });
}
export function getUserList() {
  return request({
    url: '/api/system/jira/get_jira_user/',
    method: 'get',
  });
}
export function addIssue(data: any) {
  return request({
    url: '/api/system/jira/add_issue/',
    method: 'post',
    data: data,
  });
}
export function updateIssue(data: any) {
  return request({
    url: '/api/system/jira/update_issue/',
    method: 'post',
    data: data,
  });
}

export function resolveIssue(data: any) {
  return request({
    url: '/api/system/jira/resolve_issue/',
    method: 'post',
    data: data,
  });
}
export function confirmIssue(data: any) {
  return request({
    url: '/api/system/jira/confirm_issue/',
    method: 'post',
    data: data
  })
}
export function getMyIssue(query:any){
    return request({
        url:'/api/system/jira/get_my_issue/',
        method:'get',
        params:query
    })
}