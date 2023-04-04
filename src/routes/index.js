/**
 * meta: {
 *  title: 导航栏title
 *  icon: 导航栏icon
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  access: (null) 可访问该页面的权限数组 当前路由设置的权限会影响子路由
 * }
 */

const routes = [
    {
        path: '/login',
        name: 'login',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/views/login')
    },
    {
        path: '/',
        name: '_home',
        component: () => import('@/views/Home'),
        // redirect: { name: 'report-form' },
        meta: {
            hideInMenu: true
        }
    }
]

export default routes
