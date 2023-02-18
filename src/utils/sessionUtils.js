module.exports = {
  fields: {
    VerifyCode: 'verifyCode',
    Tokens: 'tokens',
    TemplateData: 'templateData',
  },
  saveData: async (req, field, key, value) => {
    const session = req.session;
    if (!session.hasOwnProperty(field)) {
      session[field] = {};
    }
    session[field][key] = value;
    await session.save();
  },
  removeData: async (req, field, key) => {
    const session = req.session;
    if (session.hasOwnProperty(field)) {
      delete session[field][key];
    }
    await session.save();
  },
  getValue: (req, field, key) => {
    const session = req.session;
    if (!session.hasOwnProperty(field)) {
      return null;
    }
    if (!Object.keys(session[field]).length) {
      return null;
    }
    return session[field][key];
  },
  getKey: (req, field, value) => {
    const session = req.session;
    if (!session.hasOwnProperty(field)) {
      return null;
    }
    if (!Object.keys(session[field]).length) {
      return null;
    }
    for (const key in session[field]) {
      const val = session[field][key];
      if (val === value) {
        return key;
      }
    }
    return null;
  },
  getAllFieldValues: (req, field) => {
    const session = req.session;
    if (!session.hasOwnProperty(field)) {
      return null;
    }
    return session[field];
  },
};
