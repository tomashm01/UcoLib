export default () => ({
  database: {
    uri: process.env.BOOK_DATABASE_URL || 'mongodb://mongodb:27017/bookLib',
  },
});
