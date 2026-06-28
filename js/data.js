/**
 * data.js - WC 2026 teams, groups, real match results & fixtures
 * R32 bracket teams populated from official FOX bracket (image reference)
 */

/* ── FIFA WORLD CUP 2026 - ALL 48 TEAMS ───────────────────────────────── */
const WC_TEAMS = {
  // GROUP A - Host: Mexico
  MEX:{name:'Mexico',          flag:'mx',       group:'A', rank:13, wcWins:0},
  RSA:{name:'South Africa',    flag:'za',       group:'A', rank:47, wcWins:0},
  KOR:{name:'South Korea',     flag:'kr',       group:'A', rank:22, wcWins:0},
  CZE:{name:'Czechia',         flag:'cz',       group:'A', rank:37, wcWins:0},
  // GROUP B - Host: Canada
  CAN:{name:'Canada',          flag:'ca',       group:'B', rank:41, wcWins:0},
  BIH:{name:'Bosnia & Herz.',  flag:'ba',       group:'B', rank:65, wcWins:0},
  QAT:{name:'Qatar',           flag:'qa',       group:'B', rank:57, wcWins:0},
  SUI:{name:'Switzerland',     flag:'ch',       group:'B', rank:18, wcWins:0},
  // GROUP C
  BRA:{name:'Brazil',          flag:'br',       group:'C', rank:5,  wcWins:5},
  MAR:{name:'Morocco',         flag:'ma',       group:'C', rank:14, wcWins:0},
  SCO:{name:'Scotland',        flag:'gb-sct',   group:'C', rank:33, wcWins:0},
  HTI:{name:'Haiti',           flag:'ht',       group:'C', rank:84, wcWins:0},
  // GROUP D - Host: USA
  USA:{name:'United States',   flag:'us',       group:'D', rank:16, wcWins:0},
  PAR:{name:'Paraguay',        flag:'py',       group:'D', rank:54, wcWins:0},
  AUS:{name:'Australia',       flag:'au',       group:'D', rank:24, wcWins:0},
  TUR:{name:'Türkiye',         flag:'tr',       group:'D', rank:40, wcWins:0},
  // GROUP E
  GER:{name:'Germany',         flag:'de',       group:'E', rank:9,  wcWins:4},
  CIV:{name:"Côte d'Ivoire",   flag:'ci',       group:'E', rank:50, wcWins:0},
  ECU:{name:'Ecuador',         flag:'ec',       group:'E', rank:44, wcWins:0},
  CUW:{name:'Curaçao',         flag:'cw',       group:'E', rank:89, wcWins:0},
  // GROUP F
  NED:{name:'Netherlands',     flag:'nl',       group:'F', rank:8,  wcWins:0},
  JPN:{name:'Japan',           flag:'jp',       group:'F', rank:15, wcWins:0},
  SWE:{name:'Sweden',          flag:'se',       group:'F', rank:26, wcWins:0},
  TUN:{name:'Tunisia',         flag:'tn',       group:'F', rank:29, wcWins:0},
  // GROUP G
  BEL:{name:'Belgium',         flag:'be',       group:'G', rank:7,  wcWins:0},
  IRN:{name:'Iran',            flag:'ir',       group:'G', rank:25, wcWins:0},
  NZL:{name:'New Zealand',     flag:'nz',       group:'G', rank:92, wcWins:0},
  EGY:{name:'Egypt',           flag:'eg',       group:'G', rank:43, wcWins:0},
  // GROUP H
  ESP:{name:'Spain',           flag:'es',       group:'H', rank:1,  wcWins:1},
  URY:{name:'Uruguay',         flag:'uy',       group:'H', rank:11, wcWins:2},
  KSA:{name:'Saudi Arabia',    flag:'sa',       group:'H', rank:58, wcWins:0},
  CPV:{name:'Cabo Verde',      flag:'cv',       group:'H', rank:72, wcWins:0},
  // GROUP I
  FRA:{name:'France',          flag:'fr',       group:'I', rank:3,  wcWins:2},
  NOR:{name:'Norway',          flag:'no',       group:'I', rank:27, wcWins:0},
  SEN:{name:'Senegal',         flag:'sn',       group:'I', rank:20, wcWins:0},
  IRQ:{name:'Iraq',            flag:'iq',       group:'I', rank:62, wcWins:0},
  // GROUP J
  ARG:{name:'Argentina',       flag:'ar',       group:'J', rank:2,  wcWins:3},
  ALG:{name:'Algeria',         flag:'dz',       group:'J', rank:35, wcWins:0},
  AUT:{name:'Austria',         flag:'at',       group:'J', rank:23, wcWins:0},
  JOR:{name:'Jordan',          flag:'jo',       group:'J', rank:70, wcWins:0},
  // GROUP K
  POR:{name:'Portugal',        flag:'pt',       group:'K', rank:6,  wcWins:0},
  COL:{name:'Colombia',        flag:'co',       group:'K', rank:12, wcWins:0},
  COD:{name:'DR Congo',        flag:'cd',       group:'K', rank:55, wcWins:0},
  UZB:{name:'Uzbekistan',      flag:'uz',       group:'K', rank:69, wcWins:0},
  // GROUP L
  ENG:{name:'England',         flag:'gb-eng',   group:'L', rank:4,  wcWins:1},
  HRV:{name:'Croatia',         flag:'hr',       group:'L', rank:10, wcWins:0},
  GHA:{name:'Ghana',           flag:'gh',       group:'L', rank:60, wcWins:0},
  PAN:{name:'Panama',          flag:'pa',       group:'L', rank:78, wcWins:0},
};

/* ── GROUPS STRUCTURE ────────────────────────────────────────────────────── */
const WC_GROUPS = {
  A:{host:'MEX', teams:['MEX','RSA','KOR','CZE']},
  B:{host:'CAN', teams:['CAN','BIH','QAT','SUI']},
  C:{host:null,  teams:['BRA','MAR','SCO','HTI']},
  D:{host:'USA', teams:['USA','PAR','AUS','TUR']},
  E:{host:null,  teams:['GER','CIV','ECU','CUW']},
  F:{host:null,  teams:['NED','JPN','SWE','TUN']},
  G:{host:null,  teams:['BEL','IRN','NZL','EGY']},
  H:{host:null,  teams:['ESP','URY','KSA','CPV']},
  I:{host:null,  teams:['FRA','NOR','SEN','IRQ']},
  J:{host:null,  teams:['ARG','ALG','AUT','JOR']},
  K:{host:null,  teams:['POR','COL','COD','UZB']},
  L:{host:null,  teams:['ENG','HRV','GHA','PAN']},
};

/* ── REAL GROUP STAGE RESULTS ────────────────────────────────────────────── */
const GROUP_RESULTS = [
  {id:'GA-3',round:'GROUP',group:'A',teamA:'CZE',teamB:'MEX',scoreA:0,scoreB:3,date:'2026-06-25',venue:'Estadio Azteca, Mexico City'},
  {id:'GA-4',round:'GROUP',group:'A',teamA:'RSA',teamB:'KOR',scoreA:1,scoreB:0,date:'2026-06-25',venue:'SoFi Stadium, Los Angeles'},
  {id:'GC-3',round:'GROUP',group:'C',teamA:'SCO',teamB:'BRA',scoreA:0,scoreB:3,date:'2026-06-24',venue:'MetLife Stadium, New Jersey'},
  {id:'GC-4',round:'GROUP',group:'C',teamA:'MAR',teamB:'HTI',scoreA:4,scoreB:2,date:'2026-06-24',venue:'AT&T Stadium, Dallas'},
  {id:'GD-3',round:'GROUP',group:'D',teamA:'TUR',teamB:'USA',scoreA:3,scoreB:2,date:'2026-06-26',venue:'SoFi Stadium, Los Angeles'},
  {id:'GD-4',round:'GROUP',group:'D',teamA:'PAR',teamB:'AUS',scoreA:0,scoreB:0,date:'2026-06-26',venue:'Lumen Field, Seattle'},
  {id:'GE-3',round:'GROUP',group:'E',teamA:'ECU',teamB:'GER',scoreA:2,scoreB:1,date:'2026-06-25',venue:'NRG Stadium, Houston'},
  {id:'GE-4',round:'GROUP',group:'E',teamA:'CUW',teamB:'CIV',scoreA:0,scoreB:2,date:'2026-06-25',venue:'Hard Rock Stadium, Miami'},
  {id:'GF-3',round:'GROUP',group:'F',teamA:'TUN',teamB:'NED',scoreA:1,scoreB:3,date:'2026-06-25',venue:"Levi's Stadium, San Jose"},
  {id:'GF-4',round:'GROUP',group:'F',teamA:'JPN',teamB:'SWE',scoreA:1,scoreB:1,date:'2026-06-25',venue:'BC Place, Vancouver'},
];

/* ── KNOCKOUT FIXTURES - R32 bracket from official FOX draw ─────────────── */
// LEFT SIDE of bracket (matches 1–8)
const R32_MATCHES = [
  {id:'R32-1', teamA:'GER', teamB:'PAR', date:'2026-07-02', venue:'MetLife Stadium, New Jersey'},
  {id:'R32-2', teamA:'FRA', teamB:'SWE', date:'2026-07-02', venue:'SoFi Stadium, Los Angeles'},
  {id:'R32-3', teamA:'RSA', teamB:'CAN', date:'2026-07-02', venue:'AT&T Stadium, Dallas'},
  {id:'R32-4', teamA:'NED', teamB:'MAR', date:'2026-07-03', venue:'BC Place, Vancouver'},
  {id:'R32-5', teamA:'POR', teamB:'HRV', date:'2026-07-03', venue:'Hard Rock Stadium, Miami'},
  {id:'R32-6', teamA:'ESP', teamB:'AUT', date:'2026-07-03', venue:"Levi's Stadium, San Jose"},
  {id:'R32-7', teamA:'USA', teamB:'BIH', date:'2026-07-04', venue:'Gillette Stadium, Boston'},
  {id:'R32-8', teamA:'BEL', teamB:'SEN', date:'2026-07-04', venue:'Estadio Azteca, Mexico City'},
  // RIGHT SIDE of bracket (matches 9–16)
  {id:'R32-9', teamA:'BRA', teamB:'JPN', date:'2026-07-04', venue:'NRG Stadium, Houston'},
  {id:'R32-10',teamA:'CIV', teamB:'NOR', date:'2026-07-05', venue:'MetLife Stadium, New Jersey'},
  {id:'R32-11',teamA:'MEX', teamB:'ECU', date:'2026-07-05', venue:'SoFi Stadium, Los Angeles'},
  {id:'R32-12',teamA:'ENG', teamB:'COD', date:'2026-07-05', venue:'AT&T Stadium, Dallas'},
  {id:'R32-13',teamA:'ARG', teamB:'CPV', date:'2026-07-06', venue:'Lumen Field, Seattle'},
  {id:'R32-14',teamA:'AUS', teamB:'EGY', date:'2026-07-06', venue:'Lincoln Financial, Philadelphia'},
  {id:'R32-15',teamA:'SUI', teamB:'ALG', date:'2026-07-06', venue:'Estadio BBVA, Monterrey'},
  {id:'R32-16',teamA:'COL', teamB:'GHA', date:'2026-07-06', venue:'BC Place, Vancouver'},
];

const R16_MATCHES = [
  {id:'R16-1',teamA:'TBD',teamB:'TBD',date:'2026-07-10',venue:'MetLife Stadium, New Jersey'},
  {id:'R16-2',teamA:'TBD',teamB:'TBD',date:'2026-07-10',venue:'SoFi Stadium, Los Angeles'},
  {id:'R16-3',teamA:'TBD',teamB:'TBD',date:'2026-07-11',venue:'AT&T Stadium, Dallas'},
  {id:'R16-4',teamA:'TBD',teamB:'TBD',date:'2026-07-11',venue:'Hard Rock Stadium, Miami'},
  {id:'R16-5',teamA:'TBD',teamB:'TBD',date:'2026-07-12',venue:"Levi's Stadium, San Jose"},
  {id:'R16-6',teamA:'TBD',teamB:'TBD',date:'2026-07-12',venue:'BC Place, Vancouver'},
  {id:'R16-7',teamA:'TBD',teamB:'TBD',date:'2026-07-13',venue:'NRG Stadium, Houston'},
  {id:'R16-8',teamA:'TBD',teamB:'TBD',date:'2026-07-13',venue:'Estadio Azteca, Mexico City'},
];
const QF_MATCHES = [
  {id:'QF-1',teamA:'TBD',teamB:'TBD',date:'2026-07-16',venue:'MetLife Stadium, New Jersey'},
  {id:'QF-2',teamA:'TBD',teamB:'TBD',date:'2026-07-17',venue:'AT&T Stadium, Dallas'},
  {id:'QF-3',teamA:'TBD',teamB:'TBD',date:'2026-07-17',venue:'SoFi Stadium, Los Angeles'},
  {id:'QF-4',teamA:'TBD',teamB:'TBD',date:'2026-07-18',venue:'Hard Rock Stadium, Miami'},
];
const SF_MATCHES = [
  {id:'SF-1',teamA:'TBD',teamB:'TBD',date:'2026-07-21',venue:'MetLife Stadium, New Jersey'},
  {id:'SF-2',teamA:'TBD',teamB:'TBD',date:'2026-07-22',venue:'AT&T Stadium, Dallas'},
];
const FINAL_MATCH = [{id:'F-1',teamA:'TBD',teamB:'TBD',date:'2026-07-19',venue:'MetLife Stadium, New Jersey'}];

const ALL_MATCHES = [...R32_MATCHES,...R16_MATCHES,...QF_MATCHES,...SF_MATCHES,...FINAL_MATCH];

const ROUND_LABELS = {
  'GROUP':'Babak Grup','R32':'Round of 32',
  'R16':'Babak 16 Besar','QF':'Perempat Final','SF':'Semi Final','F':'Final'
};

/* ── HELPERS ─────────────────────────────────────────────────────────────── */
function teamList() {
  return Object.entries(WC_TEAMS)
    .map(([code,t])=>({code,name:t.name,rank:t.rank,group:t.group}))
    .sort((a,b)=>a.name.localeCompare(b.name));
}
function flagUrl(code, w=80) {
  const t = WC_TEAMS[code]; if (!t) return '';
  return `https://flagcdn.com/w${w}/${t.flag}.png`;
}
function teamName(code) { return (WC_TEAMS[code]?.name)||code||'TBD'; }
function teamRank(code) { return WC_TEAMS[code]?.rank||'-'; }
function getMatchesByRound(round) { return ALL_MATCHES.filter(m=>m.id.startsWith(round)); }
function getMatchById(id) { return ALL_MATCHES.find(m=>m.id===id)||null; }

/* ── POINT SYSTEM ─────────────────────────────────────────────────────────── */
const PTS = {
  EXACT_SCORE:    15,
  CORRECT_RESULT:  5,
  CLOSE_SCORE:     3,
  BRACKET_PICK:    5,
  CHAMPION:       50,
};
