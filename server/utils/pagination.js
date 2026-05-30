/**
 * Build MongoDB query options for pagination, sorting, filtering
 */

const getPaginationOptions = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getSortOptions = (query, allowedFields = ['createdAt', 'updatedAt', 'title', 'views', 'publishedAt']) => {
  if (!query.sort) return { createdAt: -1 };

  const sortObj = {};
  const sortFields = query.sort.split(',');

  sortFields.forEach((field) => {
    const dir = field.startsWith('-') ? -1 : 1;
    const key = field.replace(/^-/, '');
    if (allowedFields.includes(key)) {
      sortObj[key] = dir;
    }
  });

  return Object.keys(sortObj).length > 0 ? sortObj : { createdAt: -1 };
};

const getFieldSelection = (query, defaultFields = null) => {
  if (!query.fields) return defaultFields;
  return query.fields.split(',').join(' ');
};

const buildSearchQuery = (searchTerm, fields = ['title', 'content', 'excerpt']) => {
  if (!searchTerm) return {};
  return { $text: { $search: searchTerm } };
};

module.exports = {
  getPaginationOptions,
  getSortOptions,
  getFieldSelection,
  buildSearchQuery,
};
