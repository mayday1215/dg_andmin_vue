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

//获取商品分类列表type,pagenum,pagesize
export const reqCategories =({type,pagenum,pagesize}) =>request({url:'categories',method:'get',params:{type,pagenum,pagesize}})


//添加分类
export const reqAddCategorie =(categorInfo) => request({url:'categories',method:'post',data:categorInfo})

//删除分类
export const reqDelCategorie =(id) => request({url:`categories/${id}`,method:'delete'})

//编辑分类
export const reqEditCategorie = (id,cat_name) => request({url:`categories/${id}`,method:'put',data:{cat_name}})

//获取动态参数或者静态属性
export const reqCategoriesAttr = (id,sel) => request({url:`categories/${id}/attributes`,method:'get',params:{sel}})

//添加动态参数或者静态属性 categories/:id/attributes
export const reqAddCatAttr =(id,attr_name,attr_sel) => request({url:`categories/${id}/attributes`,method:'post',data:{attr_name,attr_sel}})

//修改动态参数或者静态属性
export const reqUpdateCatAttr =(id,attrId,attr_name,attr_sel) => request({url:`categories/${id}/attributes/${attrId}`,method:'put',data:{attr_name,attr_sel}})

//删除动态参数或者静态属性
export const reqDelCatAttr = (id,attrId) => request({url:`categories/${id}/attributes/${attrId}`,method:'delete',})

//删除子参数
// categories/6/attributes/3077
// attr_name: "版式"
// attr_sel: "many"
// attr_vals: "49吋4K超薄曲面 人工智能,55吋4K观影曲面 30核HDR,55吋4K超薄曲面 人工智能,65吋4K超薄曲面"
export const reqDelCarAttrItem = ({id,attrId,attr_name,attr_sel,attr_vals}) => request({url:`categories/${id}/attributes/${attrId}`,method:'put',data:{attr_name,attr_sel,attr_vals}})


//获取商品列表
export const reqGoodsList = (goodsParams) => request({url:'goods',method:"get",params:goodsParams})

//删除商品
export const reqDelGoods = (id) => request({url:`goods/${id}`,method:'delete'})

//添加商品
export const reqAddGoods = (data) => request({url:'goods',method:'post',data})

//订单列表
export const reqOrders = (params) => request({url:'orders',method:'get',params})

//获取数据统计reports/type/1
export const reqReports = () => request({url:'reports/type/1',method:'get'})
