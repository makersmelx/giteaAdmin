import {courses, initTeams,createEveryoneTeam, createEveryoneTeamLoop} from "./Courses";

const readlineSync = require('readline-sync');

const callInitTeams = async (organization, groupSetName) => {
    const failList = await initTeams(courses[organization.toLowerCase()], groupSetName);
    console.warn("Warning: If a student are not added into a group in this group set on Canvas, for coding convenience, I will nothing about this student here. Please check him manually.\n")
    console.log("Notice that the below students are not adding to a expected Gitea Team.\n")
    console.log(failList);
}

const callCreateStudentTeam = async (organization, teamName) => {
    const failList = await createEveryoneTeam(courses[organization.toLowerCase()],teamName);
    console.log("Notice that the below students are not adding to the expected Gitea Student Team.\n");
    console.log(failList);
}
const argv = process.argv.slice(3);
let organization, groupSetName,teamName,delay;
switch (process.argv[2]) {
    case 's':
        organization = argv[0] || readlineSync.question('Type in the course/organization name:\n');
        teamName = argv[1] || readlineSync.question('Type in the overall team name, like Students:\n');
        callCreateStudentTeam(organization,teamName);
        break;
    case 'i':
        organization = argv[0] || readlineSync.question('Type in the course/organization name:\n');
        groupSetName = argv[1] || readlineSync.question('Type in the group set name, like pgroup (if one group is named as pgroup-01):\n');
        callInitTeams(organization, groupSetName);
        break;
    case 'labLoop':
        organization = argv[0] || readlineSync.question('Type in the course/organization name:\n');
        teamName = argv[1] || readlineSync.question('Type in the overall team name, like Students:\n');
        delay = argv[2] || readlineSync.question('Type in the loop interval(ms):\n');
        createEveryoneTeamLoop(organization, teamName, parseInt(delay));
        break;
    case 'h':
    default:
        console.log('Unrecognized arguments. For usage guidance, see README.md')
        break;
}


