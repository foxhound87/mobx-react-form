import _ from 'lodash';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default (query = {}) => {
  // assume these usernames are in the database
  const db = [
    { user: 'Claudio' },
    { user: 'FoxHound' },
    { user: 'SteveJobs' },
  ];

  return sleep(50)
    .then(() => _.find(db, query) || []);
};

