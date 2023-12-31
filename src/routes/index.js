import LayoutMain from '@/layout'
import * as Role from '@/permission'

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
        component: () => import('@/views/login')
    },
    {
        path: '/',
        name: '_home',
        component: LayoutMain,
        redirect: { name: 'worktable' },
        children: [
            {
                path: 'worktable',
                name: 'worktable',
                component: () => import('@/views/worktable')
            },
            {
                path: 'user',
                name: 'user',
                component: () => import('@/views/user')
            }
        ]
    },
    {
        path: '/register-form',
        name: 'register-form',
        component: () => import('@/views/register-form')
    },
    {
        path: '/report-form',
        name: 'report-form',
        component: () => import('@/views/report-form')
    },
    {
        path: '/allocation-task',
        name: 'allocation-task',
        component: () => import('@/views/allocation-task')
    },
    {
        path: '/market-staff',
        name: 'market-staff',
        meta: {
            access: [Role.Admin, Role.RoleMarketManager]
        },
        component: () => import('@/views/market-staff')
    },
    {
        path: '/customer-staff',
        name: 'customer-staff',
        meta: {
            access: [Role.Admin, Role.RoleCustomManager]
        },
        component: () => import('@/views/customer-staff')
    },
    {
        path: '/security',
        name: 'security',
        component: () => import('@/views/security')
    },
    {
        path: '/401',
        name: 'error-401',
        component: () => import('@/views/error-page/401')
    },
    {
        path: '/500',
        name: 'error-500',
        component: () => import('@/views/error-page/500')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'error-404',
        component: () => import('@/views/error-page/404')
    }
]

export default routes
