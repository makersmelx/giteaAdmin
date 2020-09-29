import {giteaInstance} from '../axios';
import {createTeamRepo} from './createTeamRepo';
import {projectTeamConfig} from '../settings';

/**\
 * Create a team in an organization
 * @param organization {string} organization name
 * @param teamName
 * @param config
 * @returns {number} id of the team if success, -1 if fail
 */
export const createTeam = async (organization, teamName, config) => {
  const teamID = await giteaInstance.post(`/orgs/${organization}/teams`,
      projectTeamConfig(teamName)).then((response) => {
    // console.log(`Successfully created ${team} for Organization ${organization}`);
    return Promise.resolve(response.data.id);
  }, (error) => {
    return Promise.resolve(-1);
  });

  const ret = await createTeamRepo(organization, teamName);
};


