import _ from 'lodash';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default (query = {}, ignoreCase) => {
  // assume these usernames are in the database
  const db = [
    { user: 'Claudio' },
    { user: 'FoxHound' },
    { user: 'Steve Jobs' },
  ];

  return sleep(25)
    .then(() => _.find(
      db, ignoreCase ? o => _.lowerCase(o.user) === _.lowerCase(query.user) : query) || []);
};

