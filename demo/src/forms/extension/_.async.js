import _ from 'lodash';

export default (query = {}) => {
  // assume these usernames are in the database
  const db = [
    { user: 'Claudio' },
    { user: 'FoxHound' },
    { user: 'SteveJobs' },
  ];
  // resolve the promise after find
  return new Promise((resolve) => {
    // console.log('Loading promised data...');
    setTimeout(() => {
      const data = _.find(db, query) || [];
      // console.log('Resolved data', data);
      return resolve(data);
    }, 1500);
  });
};

