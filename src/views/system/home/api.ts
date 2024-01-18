import { request } from '/@/utils/service'

export function GetIssueAnalysis() {
  return request({
    url: '/api/system/jira/issue_analysis/',
    method: 'get'
  })
}