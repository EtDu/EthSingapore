import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import CompanyUI from '../containers/CompanyUI'
import CustomerUI from '../containers/CustomerUI'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/companyui',
      name: 'Security Issuance',
      component: CompanyUI
    },
    {
      path: '/customerui',
      name: 'Customer Dashboard',
      component: CustomerUI
    }
  ]
})
