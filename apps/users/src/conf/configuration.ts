export default () => ({
  database: {
    uri: process.env.USER_DATABASE_URL || 'mongodb://mongodb:27017/userLib',
  },
});
