import {giteaInstance} from '../axios';
import {teamRepoMasterProtection} from '../settings';

/**
 *
 * @param organization
 * @param teamName
 * @returns {Promise<void>}
 */
export const createTeamRepo = async (organization, teamName) => {
  const repoName = teamName;

  //create repo
  const ret = await giteaInstance.post(`/orgs/${organization}/repos`, {
    'auto_init': true,
    'description': 'string',
    'name': `${teamName}`,
    'private': true,
  }).then(response => {
    switch (response.status) {
      case 409:
        console.log(`${organization}/${repoName} already exists.`);
        return Promise.resolve(-1);
      case 422:
        console.error(`Creating ${organization}/${repoName} fails.`);
        return Promise.resolve(-1);
      case 201:
        return Promise.resolve(1);
      default:
        return Promise.resolve(-1);
    }
  }, error => {
    return Promise.resolve(-1);
  });

  // if (ret === -1) {
  //   return;
  // }

  //grant access to team
  let response = (await giteaInstance.get(`/orgs/${organization}/teams/search`,
      {
        params: {
          q: teamName,
        },
      }));
  const queryList = response.data.data;
  if (queryList.length === 0) {
    console.error(`Team ${teamName} does not exist.`);
    return;
  }
  const teamID = queryList[0].id;

  await giteaInstance.put(
      `/teams/${teamID}/repos/${organization}/${repoName}`).then(response => {
    switch (response.status) {
      case 403:
        console.error(`Grant access of ${teamName} to repo ${repoName} fails.`);
        break;
      default:
        break;
    }
  }, error => {
    console.error(error.response);
  });

  // add branch protection
  await giteaInstance.post(
      `/repos/${organization}/${repoName}/branch_protections`,
      teamRepoMasterProtection(teamName),
  ).then((response) => {
    console.log(response.status);
  }, (error) => {
    
  });
};
