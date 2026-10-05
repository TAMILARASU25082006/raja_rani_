export interface RoleDefinition {
  id: number;
  name: string;
  tamilName: string;
  points: number;
  description: string;
  tamilDescription: string;
  hasCrown: boolean;
  isSpecial: boolean;
  category: 'royalty' | 'enforcer' | 'court' | 'military' | 'artisan' | 'citizen';
}

export const ALL_ROLES: RoleDefinition[] = [
  {
    id: 1,
    name: 'King',
    tamilName: 'ராஜா',
    points: 10000,
    description: 'Ruler of the kingdom and highest fixed score (10,000 pts). The Royal Winner!',
    tamilDescription: 'நாட்டின் அரசர் மற்றும் உச்சபட்ச புள்ளி கொண்டவர் (10,000). அரச வெற்றியாளர்!',
    hasCrown: true,
    isSpecial: true,
    category: 'royalty',
  },
  {
    id: 2,
    name: 'Queen',
    tamilName: 'ராணி',
    points: 9000,
    description: 'Empress of the realm, wielding high royal authority (9,000 pts).',
    tamilDescription: 'நாட்டின் அரசி, பேரரசியின் அரச மதிப்பு (9,000 புள்ளிகள்).',
    hasCrown: true,
    isSpecial: false,
    category: 'royalty',
  },
  {
    id: 3,
    name: 'Minister',
    tamilName: 'மந்திரி',
    points: 8500,
    description: 'Prime Minister and chief council of the royal court (8,500 pts).',
    tamilDescription: 'அரச சபையின் தலைமை அமைச்சர் (8,500 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'court',
  },
  {
    id: 4,
    name: 'Police',
    tamilName: 'போலீஸ்',
    points: 1000,
    description: 'The Royal Enforcer. Must identify the Thief during Accusation (+1,000 pts if successful, 0 if wrong).',
    tamilDescription: 'அரச காவலர். திருடனை சரியாக கண்டுபிடிக்க வேண்டும் (வெற்றி பெற்றால் +1,000).',
    hasCrown: false,
    isSpecial: true,
    category: 'enforcer',
  },
  {
    id: 5,
    name: 'Thief',
    tamilName: 'திருடன்',
    points: 0,
    description: 'The Elusive Robber. Must blend in and remain hidden (0 pts if caught, +1,000 pts if Police fails).',
    tamilDescription: 'மறைந்து வாழும் திருடன். பிடிபட்டால் 0, தப்பினால் 1,000 புள்ளிகள்.',
    hasCrown: false,
    isSpecial: true,
    category: 'enforcer',
  },
  {
    id: 6,
    name: 'Soldier',
    tamilName: 'வீரன்',
    points: 8000,
    description: 'Loyal defender of the kingdom gates (8,000 pts).',
    tamilDescription: 'கோட்டை காக்கும் விசுவாசமிக்க வீரன் (8,000 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'military',
  },
  {
    id: 7,
    name: 'Spy',
    tamilName: 'ஒற்றன்',
    points: 7800,
    description: 'Secret intelligence operative of the palace (7,800 pts).',
    tamilDescription: 'அரண்மனையின் ரகசிய உளவுத்துறை ஒற்றன் (7,800 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'military',
  },
  {
    id: 8,
    name: 'Prince',
    tamilName: 'இளவரசன்',
    points: 7600,
    description: 'Heir to the royal throne (7,600 pts).',
    tamilDescription: 'அரியணையின் வாரிசான இளவரசன் (7,600 புள்ளிகள்).',
    hasCrown: true,
    isSpecial: false,
    category: 'royalty',
  },
  {
    id: 9,
    name: 'Princess',
    tamilName: 'இளவரசி',
    points: 7400,
    description: 'Beloved royal princess of the realm (7,400 pts).',
    tamilDescription: 'அரச குடும்பத்தின் பாசமிகு இளவரசி (7,400 புள்ளிகள்).',
    hasCrown: true,
    isSpecial: false,
    category: 'royalty',
  },
  {
    id: 10,
    name: 'Commander',
    tamilName: 'தளபதி',
    points: 7200,
    description: 'Supreme Commander of the royal legions (7,200 pts).',
    tamilDescription: 'அரச படைகளின் தலைமை தளபதி (7,200 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'military',
  },
  {
    id: 11,
    name: 'Royal Advisor',
    tamilName: 'ராஜ ஆலோசகர்',
    points: 7000,
    description: 'Wise counselor to the crown (7,000 pts).',
    tamilDescription: 'அரசருக்கு அறிவுரை வழங்கும் மூத்த ஆலோசகர் (7,000 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'court',
  },
  {
    id: 12,
    name: 'Treasurer',
    tamilName: 'பொருளாளர்',
    points: 6800,
    description: 'Keeper of the kingdom gold and treasury (6,800 pts).',
    tamilDescription: 'அரச கருவூலப் பொறுப்பாளர் (6,800 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'court',
  },
  {
    id: 13,
    name: 'Judge',
    tamilName: 'நீதிபதி',
    points: 6600,
    description: 'Upholder of kingdom laws and justice (6,600 pts).',
    tamilDescription: 'நீதி மற்றும் சட்டங்களை நிலைநாட்டும் நீதிபதி (6,600 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'court',
  },
  {
    id: 14,
    name: 'Ambassador',
    tamilName: 'தூதர்',
    points: 6400,
    description: 'Diplomat negotiating with neighboring kingdoms (6,400 pts).',
    tamilDescription: 'அண்டை நாடுகளுடன் உறவாடும் அரச தூதர் (6,400 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'court',
  },
  {
    id: 15,
    name: 'Royal Scholar',
    tamilName: 'அரச புலவர்',
    points: 6200,
    description: 'Master of literature and ancient scriptures (6,200 pts).',
    tamilDescription: 'இலக்கியம் மற்றும் கலைகளின் முதன்மை புலவர் (6,200 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'court',
  },
  {
    id: 16,
    name: 'Royal Physician',
    tamilName: 'அரச மருத்துவர்',
    points: 6000,
    description: 'Chief healer and master of Ayurvedic medicines (6,000 pts).',
    tamilDescription: 'அரச குடும்பத்தின் முதன்மை மருத்துவர் (6,000 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'court',
  },
  {
    id: 17,
    name: 'Architect',
    tamilName: 'கட்டிடக் கலைஞர்',
    points: 5800,
    description: 'Designer of fortresses, palaces, and monuments (5,800 pts).',
    tamilDescription: 'அரண்மனைகள் மற்றும் கோட்டைகளை வடிவமைக்கும் கலைஞர் (5,800 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'artisan',
  },
  {
    id: 18,
    name: 'Engineer',
    tamilName: 'பொறியியலாளர்',
    points: 5600,
    description: 'Master of water canals, bridges, and fortifications (5,600 pts).',
    tamilDescription: 'பாலங்கள் மற்றும் அரண்களை அமைக்கும் பொறியாளர் (5,600 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'artisan',
  },
  {
    id: 19,
    name: 'Knight',
    tamilName: 'போர்வீரன்',
    points: 5400,
    description: 'Armored champion of honor and bravery (5,400 pts).',
    tamilDescription: 'கவசமணிந்த வீரமிக்க குதிரைப்படை வீரன் (5,400 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'military',
  },
  {
    id: 20,
    name: 'Archer',
    tamilName: 'வில்லாளன்',
    points: 5200,
    description: 'Deadly marksman from the high castle ramparts (5,200 pts).',
    tamilDescription: 'கோபுர உச்சியிலிருந்து குறிபார்த்து தாக்கும் வில்லாளன் (5,200 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'military',
  },
  {
    id: 21,
    name: 'Scout',
    tamilName: 'சாரணர்',
    points: 5000,
    description: 'Fast-footed surveyor of the frontier wilderness (5,000 pts).',
    tamilDescription: 'காடுகளையும் எல்லைகளையும் முன்கூட்டியே கண்காணிக்கும் சாரணர் (5,000 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'military',
  },
  {
    id: 22,
    name: 'Messenger',
    tamilName: 'செய்தியாளர்',
    points: 4800,
    description: 'Royal courier carrying secret decrees across lands (4,800 pts).',
    tamilDescription: 'அரச கட்டளைகளை விரைந்து கொண்டு சேர்க்கும் செய்தியாளர் (4,800 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'citizen',
  },
  {
    id: 23,
    name: 'Merchant',
    tamilName: 'வணிகர்',
    points: 4600,
    description: 'Silk and spice trader enriching the empire (4,600 pts).',
    tamilDescription: 'பட்டு மற்றும் நறுமணப் பொருட்களை விற்கும் வணிகர் (4,600 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'citizen',
  },
  {
    id: 24,
    name: 'Blacksmith',
    tamilName: 'கொல்லர்',
    points: 4400,
    description: 'Forge master shaping swords, shields, and armor (4,400 pts).',
    tamilDescription: 'வாள் மற்றும் கவசங்களை உருவாக்கும் இரும்பு கொல்லர் (4,400 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'artisan',
  },
  {
    id: 25,
    name: 'Royal Chef',
    tamilName: 'அரச சமையலர்',
    points: 4200,
    description: 'Master of royal feasts, banquets, and delicacies (4,200 pts).',
    tamilDescription: 'அரச விருந்துகளை உருவாக்கும் தலைமை சமையலர் (4,200 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'artisan',
  },
  {
    id: 26,
    name: 'Musician',
    tamilName: 'இசைக்கலைஞர்',
    points: 4000,
    description: 'Virtuoso playing melodious Veena and Flute in the hall (4,000 pts).',
    tamilDescription: 'அரண்மனையில் இனிய வீணை மற்றும் புல்லாங்குழல் இசைப்பவர் (4,000 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'artisan',
  },
  {
    id: 27,
    name: 'Poet',
    tamilName: 'கவிஞர்',
    points: 3800,
    description: 'Bard writing epic verses in praise of bravery and love (3,800 pts).',
    tamilDescription: 'அரச புகழை கவிதைகளாக வடிக்கும் கவிஞர் (3,800 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'artisan',
  },
  {
    id: 28,
    name: 'Artist',
    tamilName: 'ஓவியர்',
    points: 3600,
    description: 'Painter creating royal portraits and frescoes (3,600 pts).',
    tamilDescription: 'சுவர் ஓவியங்கள் மற்றும் உருவப் படங்களை வரையும் ஓவியர் (3,600 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'artisan',
  },
  {
    id: 29,
    name: 'Gardener',
    tamilName: 'தோட்டக்காரர்',
    points: 3400,
    description: 'Caretaker of the exotic jasmine and lotus royal gardens (3,400 pts).',
    tamilDescription: 'அரச நந்தவனங்களை அழகாக பராமரிக்கும் தோட்டக்காரர் (3,400 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'citizen',
  },
  {
    id: 30,
    name: 'Court Jester',
    tamilName: 'கோமாளி',
    points: 3200,
    description: 'Entertainer bringing laughter and amusement to the royal court (3,200 pts).',
    tamilDescription: 'அரச சபையில் அனைவரையும் சிரிக்க வைக்கும் கோமாளி (3,200 புள்ளிகள்).',
    hasCrown: false,
    isSpecial: false,
    category: 'citizen',
  },
];

export function getRolesForPlayerCount(count: number): RoleDefinition[] {
  const safeCount = Math.max(3, Math.min(30, count));

  if (safeCount === 3) {
    // 3 Players: King, Police, Thief
    return [
      ALL_ROLES[0], // King (10,000 pts)
      ALL_ROLES[3], // Police (1,000 pts)
      ALL_ROLES[4], // Thief (0 pts)
    ];
  }

  if (safeCount === 4) {
    // 4 Players: King, Queen, Police, Thief
    return [
      ALL_ROLES[0], // King (10,000 pts)
      ALL_ROLES[1], // Queen (9,000 pts)
      ALL_ROLES[3], // Police (1,000 pts)
      ALL_ROLES[4], // Thief (0 pts)
    ];
  }

  return ALL_ROLES.slice(0, safeCount);
}

/**
 * Fisher-Yates shuffle algorithm to randomly distribute roles
 */
export function shuffleRoles(roles: RoleDefinition[]): RoleDefinition[] {
  const shuffled = [...roles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
