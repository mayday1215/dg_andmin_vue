import {request} from "./request"

//登录
export const reqLogin = (username,password) => request({url:'login', method:'post', params:{username,password}})

//左侧导航栏
export const reqMenus = () => request({url:'menus',method:'get'})


//请求用户列表
export const reqUsers = (params) => request({url:'users',method:'get',params})

//改变用户状态
export const reqUserState = (uId,type) => request({url:`users/${uId}/state/${type}`,method:'put'})

//添加用户
export const reqAddUser = ({username,password,email,mobile}) => request({url:'users',method:'post',data:{username,password,email,mobile}})

//修改用户信息
export const reqUpateUser = ({id,email,mobile}) => request({url:`users/${id}`,method:'put',data:{email,mobile}})

//删除用户
export const reqDelUser = (id) => request({url:`users/${id}`,method:'delete'})

//获取权限列表
export const reqRightsList = () => request({url:'rights/list',method:'get'})

//获取角色列表
export const reqRolesList = () => request({url:'roles',method:'get'})

//添加角色
export const reqAddRoles = (roleName,roleDesc) => request({url:'roles',method:"post",data:{roleName,roleDesc}})

//编辑角色
export const reqEditRoles = ({id,roleName,roleDesc}) => request({url:`roles/${id}`,method:'put',data:{roleName,roleDesc}})

//删除角色
export const reqDelRole = (id) => request({url:`roles/${id}`,method:'delete'})

//删除角色权限 roles/:roleId/rights/:rightId
export const reqDelRoleRights = ({roleId,rightId}) => request({url:`roles/${roleId}/rights/${rightId}`,method:'delete'})

//获取树状权限列表
export const reqRightsTreeList = () => request({url:'rights/tree',method:'get'})

//角色授权
export const reqSetRolesRights =(roleId,rids) => request({url:`roles/${roleId}/rights`,method:'post',data:{rids}})

//分配权限
export const reqUserRole = (id,rid) => request({url:`users/${id}/role`,method:'put',data:{rid}})
