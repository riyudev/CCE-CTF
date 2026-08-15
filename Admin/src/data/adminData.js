export const initialAdminUsers = [
  {
    id: 1,
    name: "Reyu Oclarit",
    username: "reyu",
    email: "reyu@cce.edu",
    team: "Cyber Warriors",
    role: "Team Leader",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Alex Rivera",
    username: "alex_r",
    email: "alex@cce.edu",
    team: "Cyber Warriors",
    role: "Participant",
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "John Doe",
    username: "johndoe",
    email: "john@cce.edu",
    team: "Cyber Warriors",
    role: "Participant",
    status: "ACTIVE",
  },
];

export const initialAdminSubmissions = [
  {
    id: 1,
    team: "Cyber Warriors",
    user: "Reyu",
    challenge: "Hidden Message",
    flag: "CCE{hidden_message}",
    result: "CORRECT",
    points: 100,
    time: "10:32 AM",
  },
];

export const initialCompetitionSettings = {
  name: "CCE CTF Competition",
  status: "LIVE",
  startTime: "2026-08-12 08:00:00 UTC",
  endTime: "2026-08-12 18:00:00 UTC",
  registration: "OPEN",
  maxTeamSize: 5,
};
