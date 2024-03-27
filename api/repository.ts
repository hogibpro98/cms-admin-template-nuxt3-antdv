const repository = (axios: any) => (resource: any) => ({
  async all() {
    return await axios.post(`${resource}/all`);
  },

  async list(params: any) {
    return await axios.post(`${resource}/listing`, params);
  },

  async show(id: any) {
    return await axios.post(`${resource}/${id}`);
  },

  async get(path: any, params = {}) {
    const pathResource = path ? `/${path}` : '';
    return await axios.get(`${resource}${pathResource}`, { params });
  },

  async getDetail(id: any) {
    return await axios.post(`${resource}/detail?id=${id}`);
  },

  async post(path: any, body: any) {
    return await axios.post(`${resource}/${path}`, body);
  },

  async select(params: any) {
    return await axios.post(`${resource}/select`, params);
  },

  async create(payload: any) {
    return await axios.post(`${resource}/store`, payload);
  },

  async update(payload: any) {
    return await axios.post(`${resource}/update`, payload);
  },

  async delete(payload: any) {
    return await axios.post(`${resource}/delete`, payload);
  },

  async massDelete(payload: any) {
    return await axios.post(`${resource}/mass-delete`, payload);
  },

  async massApprove(payload: any) {
    return await axios.post(`${resource}/mass-approve`, payload);
  },

  async massReject(payload: any) {
    return await axios.post(`${resource}/mass-reject`, payload);
  },

  async approve(payload: any) {
    return await axios.post(`${resource}/approve`, payload);
  },

  async reject(payload: any) {
    return await axios.post(`${resource}/reject`, payload);
  },

  async exportFile(payload: any) {
    return await axios.post(`${resource}/export`, payload);
  },

  async changeStatus(payload: any) {
    return await axios.post(`${resource}/change-status`, payload);
  },

  async updateScheduleTime(payload: any) {
    return await axios.put(`${resource}/update_schedule_time`, payload);
  },

  async linkUnmatchedEmails(payload: any) {
    return await axios.put(`${resource}/link_unmatched_emails`, payload);
  },

  async updateErrorMessageViaEmail(payload: any) {
    return await axios.put(`${resource}/update_error_message_email`, payload);
  },

  async createUserInfo(payload: any) {
    return await axios.post(`${resource}/create_user_info`, payload);
  },

  async updateUserInfo(payload: any) {
    return await axios.put(`${resource}/update_user_info`, payload);
  },

  async syncDialpad(payload: any) {
    return await axios.put(`${resource}/sync_dialpad_operator_manually`, payload);
  },

  async failedJob(payload: any) {
    return await axios.put(`${resource}/failed_job`, payload);
  },

  async failedJobAll(payload: any) {
    return await axios.put(`${resource}/failed_job_all`, payload);
  }

  //add more
});

export default repository;
