module.exports = {
  toLocale: (date) => {
    return new Date(date).toLocaleString();
  },
  isUpdated: (updatedAt, createdAt) => {
    const time1 = new Date(updatedAt).getTime();
    const time2 = new Date(createdAt).getTime();
    return time1 > time2;
  },
  createExpireTime: () => {
    const expire = new Date().getTime() + 120 * 1000; // 2 minute
    return expire;
  },
  getCurrentTime: () => {
    return new Date().getTime();
  },
};
