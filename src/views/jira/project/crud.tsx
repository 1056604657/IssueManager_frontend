import * as api from './api';
import { UserPageQuery, AddReq, DelReq, EditReq, CrudExpose, CrudOptions, CreateCrudOptionsProps, CreateCrudOptionsRet, dict } from '@fast-crud/fast-crud';
import { request } from '/@/utils/service';
export const createCrudOptions = function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };
  const addRequest = async ({ form }: AddReq) => {
    return await api.AddObj(form);
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      actionbar: {
        buttons: {
          add: {
            show: true,
          },
        },
      },
      search: {
      },
      rowHandle: {
        fixed: 'right',
        width: 300,
        buttons: {
          view: {
            show: false,
          },
          edit: {
            show: true,
          },
          remove: {
            show: true,
          },
          custom: {
            text: "查看issue",
            type: 'primary',
            click: (ctx: any) => {
              const { row } = ctx
              console.log(context)
              context?.handleIssueList(row)
            }
          }
        },
      },
      columns: {
        _index: {
          title: '序号',
          form: { show: false },
          column: {
            //type: 'index',
            align: 'center',
            width: '70px',
            columnSetDisabled: true, //禁止在列设置中选择
            formatter: (context) => {
              //计算序号,你可以自定义计算规则，此处为翻页累加
              let index = context.index ?? 1;
              let pagination = crudExpose!.crudBinding.value.pagination;
              return ((pagination!.currentPage ?? 1) - 1) * pagination!.pageSize + index + 1;
            },
          },
        },
        name: {
          title: '项目',
          type: 'input',
          column: {
            minWidth: 100,
          },
          search: {
            show: true,
            component: {
              props: {
                clearable: true,
              },
              placeholder: '请输入项目名',
            },
          },
          form: {
            component: {
              placeholder: '请输入项目名',
            },
            rules: [{ required: true, message: "请输入项目名" }]
          },
        },
        key: {
          title: 'Key',
          search: {
            disabled: false,
          },
          type: 'input',
          column: {
            minWidth: 60,
          },
          form: {
            rules: [{ required: true, message: "请输入Key" }],
            disabled: false,
            component: {
              placeholder: '请输入Key',
            },
            helper: {
              text: "建议英文大写缩写"
            }
          },
        },
        remark: {
          title: '描述',
          search: {
            disabled: false,
          },
          type: 'textarea',
          column: {
            minWidth: 100,
          },
          form: {
            disabled: false,
            component: {
              placeholder: '请输入描述',
            },
          },
        },
        'ding_webhook': {
          title: 'WebHook',
          search: {
            disabled: false,
          },
          type: 'input',
          column: {
            minWidth: 100,
          },
          form: {
            disabled: false,
            component: {
              placeholder: '请输入钉钉webHook',
            },
          },
        },
        stage: {
          title: '项目阶段',
          column: {
            minWidth: 100,
          },
          type: 'dict-select',
          dict: dict({
            getData() {
              return request({ url: '/api/system/jira/get_jira_project_stages/' }).then((res: any) => {
                const data = [];
                for (const item of res.data) {
                  const obj: any = {};
                  obj.value = item.id;
                  obj.label = item.name;
                  data.push(obj);
                }
                return data;
              });
            },
          }),
          form: {
            rules: [{ required: true, message: "请选择项目阶段" }],
          }
        },
        status: {
          title: '项目状态',
          column: {
            minWidth: 100,
          },
          type: 'dict-select',
          dict: dict({
            getData() {
              return request({ url: '/api/system/jira/get_jira_project_status/' }).then((res: any) => {
                const data = [];
                for (const item of res.data) {
                  const obj: any = {};
                  obj.value = item.id;
                  obj.label = item.name;
                  data.push(obj);
                }
                return data;
              });
            },
          }),
          form: {
            rules: [{ required: true, message: "请选择项目状态" }],
          }
        },
        manager: {
          title: '项目经理',
          column: {
            minWidth: 100,
          },
          type: 'dict-select',
          dict: dict({
            getData() {
              return request({ url: '/api/system/jira/get_jira_user/' }).then((res: any) => {
                const data = [];
                for (const item of res.data) {
                  const obj: any = {};
                  obj.label = item.name;
                  obj.value = item.id;
                  data.push(obj);
                }
                return data;
              });
            },
          }),
          form: {
            rules: [{ required: true, message: "请选择项目经理" }],
          }
        },
      },
    },
  };
};
