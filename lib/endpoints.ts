const endpoints = {
  auth: {
    register: '/admin/create-user',
    login: '/admin/admin-login',
    changePassword: (adminId: string) => `/admin/change_password/${adminId}`,
    forgotPassword: '/admin/forgot-password',
    resetPassword: (token: string) => `/admin/reset-password/${token}`,
  },
  admin: {
    allAdmins: '/admin/all-users',
    adminById: (userId: string) => `/admin/${userId}`,
  },
  leads: {
    createLead: '/leads/create-lead',
    allLeads: '/leads/getAlLeads',
    getLeadByUuid: (leadUuid: string) => `/leads/${leadUuid}`,
    updateLeadByUuid: (leadUuid: string) => `/leads/${leadUuid}/update-lead`,
    updateLeadStatus: (leadUuid: string) => `/leads/${leadUuid}/status`,
    importLead: '/leads/import-lead',
    leadsStats: '/leads/leads/stats',
    opportunityStats:'/leads/opportunity/stats',
    recentLeads:'/leads/recent/leads'
  },
};

export default endpoints;
