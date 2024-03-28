// @ts-ignore
/* eslint-disable */
import { LineChartData } from '@/components/Chart/LineChartCard';
import { AxiosResponse, request as originalRequest } from '@umijs/max';

const API_PREFIX = 'https://stg-social.hydrox.ai';
console.log('API_PREFIX', API_PREFIX);

export async function request<T>(url: string, options?: any): Promise<AxiosResponse<T>> {
  return originalRequest(url.startsWith('/') ? API_PREFIX + url : url, options);
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/admin/user/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/admin/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

export async function getRoleList(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/role/list', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

export async function getRoleDetailById(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/role/info', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

export async function getVoiceList(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/role/voice', {
    method: 'GET',
    data: {
      ...(options || {}),
    },
  });
}

export async function saveRoleDetail(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/role/save', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

export async function deleteRoleById(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/role/delete', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

export async function getLogByRoleId(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/role/log', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

// Analysis
export async function getEventOrFieldList(
  options?: { eventName?: string } & { [key: string]: any },
) {
  const url = options?.eventName
    ? `/api/admin/emit/eventList?eventName=${options?.eventName}`
    : '/api/admin/emit/eventList';
  return request<Record<string, any>>(url, {
    method: 'GET',
    data: {
      ...(options || {}),
    },
  });
}

export async function getEventLineChartData(options?: { [key: string]: any }) {
  return request<
    LineChartData
  >('/api/admin/emit/lineChart', {
    method: 'POST',
    data: {
      ...(options || {}),
      timeUnit: 'day',
    },
  });
}

export async function getEventPieChartData(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/emit/pieChart', {
    method: 'POST',
    data: {
      ...(options || {}),
      timeUnit: 'day',
    },
  });
}


// Data Screen
export async function GetDataScreenDataByUrl({ url, ...options }: { [key: string]: any } & {
  url: string
}) {
  return request<LineChartData>(url, {
    method: 'POST',
    data: {
      ...(options || {}),
      timeUnit: 'day',
    },
  });
}
