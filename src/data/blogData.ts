export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'mastering-cue-ball-control-spin-physics',
    title: 'The Physics of Cue Ball Control: Topspin, Stun & Draw Masterclass',
    excerpt: 'Unlock the secret to millimeter-precise position play by mastering vertical tip offset, stroke acceleration, and tangent lines.',
    content: [
      'Position play is what separates casual potters from tournament champions. When playing on fast, tournament-grade Simonis cloth, the reaction of the cue ball is magnified tenfold.',
      'To achieve a reliable draw (backspin), most players make the mistake of striking downward with excessive force. In reality, a level cue stick combined with a smooth, accelerating follow-through produces the cleanest spin without risking a miscue or jumping the ball.',
      'Practice the 90-degree tangent rule on stun shots: when the cue ball has zero topspin or backspin at the moment of object ball collision, it travels perpendicular to the line of aim. Mastering this baseline makes predicting every other angle second nature.'
    ],
    category: 'Pro Tips & Technique',
    author: {
      name: 'Tariq Mansoor',
      role: 'Head Cue Sports Coach'
    },
    date: 'Sep 02, 2026',
    readTime: '5 min read',
    image: '/expert_coaching.png',
    featured: true,
    tags: ['Technique', 'Spin Control', 'Training']
  },
  {
    id: '2',
    slug: 'english-pool-vs-american-9-ball-key-differences',
    title: 'English 8-Ball vs American 9-Ball: Tables, Cues & Rule Differences',
    excerpt: 'From rounded pocket jaws to 57mm phenolic balls, here is everything you need to know before stepping up to different table types.',
    content: [
      'While both games share the fundamental goal of potting balls with a cue, the tactile experience between English and American pool is vastly distinct.',
      'English 8-Ball is played on 7ft tables featuring smaller 2-inch balls and rounded pocket jaws lined with directional napped wool cloth. This requires meticulous cue alignment and conservative positional play.',
      'American Pool, by contrast, uses larger 9ft tables with 2.25-inch balls, drop pockets, and ultra-slick worsted cloth (Simonis 860). Speed control, power breaks, and dynamic multi-rail kicks take center stage.'
    ],
    category: 'Game Guides',
    author: {
      name: 'Alexandre Roy',
      role: 'Tournament Director'
    },
    date: 'Aug 28, 2026',
    readTime: '6 min read',
    image: '/event_1.png',
    featured: false,
    tags: ['Rules', 'Tables', 'Gear Guide']
  },
  {
    id: '3',
    slug: 'the-art-of-hosting-vip-corporate-billiards-nights',
    title: 'Elevating Corporate Events: The Rise of Private VIP Cue Lounges',
    excerpt: 'Why high-end billiards and cocktail lounges are replacing traditional conference dinners for premium team bonding.',
    content: [
      'Modern corporate networking has moved away from stiff banquet halls to interactive, luxurious social spaces. Cue sports provide the ideal balance: casual enough to encourage conversation, yet engaging and competitive.',
      'At Pot Black, our private VIP suites combine championship-spec tables with dedicated butler service, curated mocktail and dining menus, and integrated audiovisual soundscapes for private tournament formats.',
      'Whether hosting clients or celebrating milestones, a structured mini-tournament with private host guidance keeps everyone involved regardless of their skill level.'
    ],
    category: 'Lifestyle & Events',
    author: {
      name: 'Sarah Jenkins',
      role: 'Hospitality & Events Lead'
    },
    date: 'Aug 15, 2026',
    readTime: '4 min read',
    image: '/vip_room.png',
    featured: false,
    tags: ['VIP Lounge', 'Corporate Events', 'Hospitality']
  },
  {
    id: '4',
    slug: 'table-maintenance-daily-brush-iron-slate-care',
    title: 'Inside Pot Black: How We Maintain Championship Slate & Cloth Daily',
    excerpt: 'Discover the precision ritual behind keeping our tables playing at World Snooker & WPA championship standards every single day.',
    content: [
      'A true roll is not an accident—it is the result of strict daily maintenance. Atmospheric humidity, chalk dust accumulation, and cloth friction all affect how true a ball tracks.',
      'Every morning, our tables undergo a multi-step conditioning process: directional bristle brushing from baulk to top cushion, micro-vacuum filtration to remove embedded chalk, and thermostatically controlled cloth ironing.',
      'This guarantees consistent ball speed, predictable rail rebounds, and flawless playability for every match.'
    ],
    category: 'Behind The Scenes',
    author: {
      name: 'Rameez Wangde',
      role: 'Club Operations Manager'
    },
    date: 'Aug 04, 2026',
    readTime: '4 min read',
    image: '/gallery_3.png',
    featured: false,
    tags: ['Table Care', 'Championship Specs', 'Club Standards']
  }
];
