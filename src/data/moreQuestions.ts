import { Question } from '../types/quiz';

export const ADDITIONAL_QUESTIONS: Question[] = [
  // ==========================================
  // CHAMPIONS LEAGUE (UCL) - FRESH
  // ==========================================
  {
    id: 'ucl_31',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'Which German club completed the European treble in 2020 by beating PSG 1-0 in the UCL final?',
      ar: 'أي نادٍ ألماني حقق الثلاثية في 2020 بعد فوزه على باريس سان جيرمان 1-0 في نهائي الأبطال؟',
    },
    options: {
      en: ['Borussia Dortmund', 'Bayern Munich', 'RB Leipzig', 'Bayer Leverkusen'],
      ar: ['بروسيا دورتموند', 'بايرن ميونخ', 'آر بي لايبزيغ', 'باير ليفركوزن'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Kingsley Coman scored the winning header for Bayern Munich in Lisbon.',
      ar: 'سجل كينغسلي كومان هدف الفوز لبايرن ميونخ برأسية في لشبونة.',
    },
  },
  {
    id: 'ucl_32',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'Who scored the winning penalty for Chelsea in the 2012 Champions League final against Bayern in Munich?',
      ar: 'من سجل ركلة الترجيح التاريخية الحاسمة لتشيلسي في نهائي 2012 ضد بايرن في ميونخ؟',
    },
    options: {
      en: ['Frank Lampard', 'Petr Čech', 'Didier Drogba', 'Fernando Torres'],
      ar: ['فرانك لامبارد', 'بيتر تشيك', 'ديدييه دروغبا', 'فيرناندو توريس'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'Didier Drogba slotted home the decisive penalty kick at the Allianz Arena.',
      ar: 'سدد ديدييه دروغبا الركلة الأخيرة في أليانز أرينا ليمنح تشيلسي لقبه التاريخي.',
    },
  },
  {
    id: 'ucl_33',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Which Italian manager won the Champions League with AC Milan in both 2003 and 2007?',
      ar: 'أي مدرب إيطالي توج بدوري أبطال أوروبا مع ميلان في عامي 2003 و2007؟',
    },
    options: {
      en: ['Marcello Lippi', 'Fabio Capello', 'Massimiliano Allegri', 'Carlo Ancelotti'],
      ar: ['مارتشيلو ليبي', 'فابيو كابيلو', 'ماسيمليانو أليغري', 'كارلو أنشيلوتي'],
    },
    correctIndex: 3, // D
    explanation: {
      en: 'Carlo Ancelotti led Milan to glory in Manchester (2003) and Athens (2007).',
      ar: 'قاد كارلو أنشيلوتي ميلان للتتويج في مانشستر (2003) وأثينا (2007).',
    },
  },
  {
    id: 'ucl_34',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Who scored an unforgettable bicycle kick for Real Madrid in the 2018 Champions League final against Liverpool?',
      ar: 'من سجل الهدف الأكروباتي (مقصية خلفية) التاريخي لريال مدريد في نهائي 2018 أمام ليفربول؟',
    },
    options: {
      en: ['Gareth Bale', 'Cristiano Ronaldo', 'Karim Benzema', 'Marco Asensio'],
      ar: ['غاريث بيل', 'كريستيانو رونالدو', 'كريم بنزيما', 'ماركو أسينسيو'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'Gareth Bale came off the bench in Kyiv to score one of the finest goals in UCL final history.',
      ar: 'دخل غاريث بيل كبديل في كييف وسجل إحدى أروع الضربات المقصية في تاريخ النهائيات.',
    },
  },
  {
    id: 'ucl_35',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Which player holds the record for scoring for six different clubs in the UEFA Champions League?',
      ar: 'من هو اللاعب الذي يحمل الرقم القياسي للتسجيل بقميص 6 أندية مختلفة في دوري أبطال أوروبا؟',
    },
    options: {
      en: ['Samuel Eto’o', 'Zlatan Ibrahimović', 'Hernán Crespo', 'Nicolas Anelka'],
      ar: ['صامويل إيتو', 'زلاتان إبراهيموفيتش', 'هيرنان كريسبو', 'نيكولا أنيلكا'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Zlatan scored in the UCL for Ajax, Juventus, Inter, Barcelona, Milan, and PSG.',
      ar: 'سجل زلاتان مع أياكس ويوفنتوس وإنتر وبرشلونة وميلان وباريس سان جيرمان.',
    },
  },
  {
    id: 'ucl_36',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Which English side won back-to-back European Cups in 1979 and 1980 under manager Brian Clough?',
      ar: 'أي نادٍ إنجليزي فاز بكأس أوروبا مرتين متتاليتين في 1979 و1980 تحت قيادة برايان كلوف؟',
    },
    options: {
      en: ['Aston Villa', 'Leeds United', 'Nottingham Forest', 'Derby County'],
      ar: ['أستون فيلا', 'ليدز يونايتد', 'نوتينغهام فورست', 'ديربي كاونتي'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'Nottingham Forest completed one of football’s greatest managerial miracles with Brian Clough.',
      ar: 'حقق نوتينغهام فورست معجزة أسطورية بالتتويج مرتين على التوالي بلقب أوروبا.',
    },
  },

  // ==========================================
  // LA LIGA - FRESH
  // ==========================================
  {
    id: 'laliga_31',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'Who wore the iconic No. 4 shirt and was the long-time captain and defensive rock for Real Madrid?',
      ar: 'من ارتدى القميص رقم 4 وكان القائد والمدافع التاريخي لريال مدريد لسنوات طويلة؟',
    },
    options: {
      en: ['Fernando Hierro', 'Sergio Ramos', 'Pepe', 'Carles Puyol'],
      ar: ['فيرناندو هييرو', 'سيرخيو راموس', 'بيبي', 'كارليس بويول'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Sergio Ramos won 5 La Liga titles and captained Real Madrid with legendary passion.',
      ar: 'سيرخيو راموس فاز بـ 5 ألقاب ليغا وكان قائداً تاريخياً للنادي الملكي.',
    },
  },
  {
    id: 'laliga_32',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'Which legendary Croatian playmaker won the 2018 Ballon d’Or while playing in midfield for Real Madrid?',
      ar: 'من لاعب الوسط الكرواتي الأسطوري لريال مدريد الذي فاز بالكرة الذهبية عام 2018؟',
    },
    options: {
      en: ['Ivan Rakitić', 'Mateo Kovačić', 'Luka Modrić', 'Robert Prosinečki'],
      ar: ['إيفان راكيتيتش', 'ماتيو كوفاسيتش', 'لوكا مودريتش', 'روبرت بروزينيتشكي'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'Luka Modrić broke the Messi-Ronaldo duopoly by winning the 2018 Ballon d’Or.',
      ar: 'كسر لوكا مودريتش هيمنة ميسي ورونالدو بفوزه بالكرة الذهبية لعام 2018.',
    },
  },
  {
    id: 'laliga_33',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Who was the head coach of FC Barcelona during their historic 2008-09 Sextuple-winning season?',
      ar: 'من كان المدير الفني لنادي برشلونة في موسم السداسية التاريخية 2008-2009؟',
    },
    options: {
      en: ['Luis Enrique', 'Frank Rijkaard', 'Pep Guardiola', 'Tito Vilanova'],
      ar: ['لويس إنريكي', 'فرانك ريكارد', 'بيب غوارديولا', 'تيتو فيلانوفا'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'Pep Guardiola won every single trophy available in his stunning debut season.',
      ar: 'قاد بيب غوارديولا البلوغرانا للتتويج بجميع الألقاب الستة الممكنة في أول مواسمه.',
    },
  },
  {
    id: 'laliga_34',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Which Spanish midfielder spent his entire career at Barcelona, celebrated for his telepathic partnership with Xavi?',
      ar: 'من هو الأسطورة الإسباني الذي تخرج من لاماسيا وشكل ثنائياً تاريخياً لا يعوض مع تشافي؟',
    },
    options: {
      en: ['Andrés Iniesta', 'Sergio Busquets', 'Cesc Fàbregas', 'David Silva'],
      ar: ['أندريس إنييستا', 'سيرخيو بوسكيتس', 'سيسك فابريغاس', 'دافيد سيلفا'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'Andrés Iniesta won 9 La Liga titles and received standing ovations at stadiums across Spain.',
      ar: 'فاز إنييستا بـ 9 ألقاب دوري ونال تحية جماهير كل ملاعب إسبانيا دون استثناء.',
    },
  },
  {
    id: 'laliga_35',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Which club from San Sebastián famously won back-to-back La Liga titles in 1980-81 and 1981-82?',
      ar: 'أي نادٍ من سان سيباستيان توج بلقبين متتاليين في الدوري الإسباني عامي 1981 و1982؟',
    },
    options: {
      en: ['Athletic Bilbao', 'Real Sociedad', 'Eibar', 'Alavés'],
      ar: ['أتلتيك بيلباو', 'ريال سوسيداد', 'إيبار', 'ألافيس'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Real Sociedad clinched their two league titles in dramatic final days in the early 1980s.',
      ar: 'توج ريال سوسيداد باللقبين في سيناريوهات ملحمية بالجولات الختامية.',
    },
  },
  {
    id: 'laliga_36',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Who is the all-time top foreign scorer for Atlético Madrid in Spanish La Liga?',
      ar: 'من هو الهداف الأجنبي التاريخي لأتلتيكو مدريد في الدوري الإسباني؟',
    },
    options: {
      en: ['Diego Forlán', 'Radamel Falcao', 'Antoine Griezmann', 'Sergio Agüero'],
      ar: ['دييغو فورلان', 'راداميل فالكاو', 'أنطوان غريزمان', 'سيرخيو أغويرو'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'Antoine Griezmann became Atlético Madrid’s all-time top scorer across all competitions.',
      ar: 'أنطوان غريزمان أصبح الهداف التاريخي الأول لأتلتيكو مدريد في كافة البطولات.',
    },
  },

  // ==========================================
  // PREMIER LEAGUE - FRESH
  // ==========================================
  {
    id: 'pl_31',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'Who is the famous French manager who managed Arsenal for 22 years between 1996 and 2018?',
      ar: 'من هو المدرب الفرنسي الشهير الذي قاد نادي آرسنال لمدة 22 عاماً (1996 - 2018)؟',
    },
    options: {
      en: ['Gérard Houllier', 'Arsène Wenger', 'Didier Deschamps', 'Laurent Blanc'],
      ar: ['جيرارد هولييه', 'أرسين فينغر', 'ديدييه ديشان', 'لوران بلان'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Arsène Wenger revolutionized English football nutrition, scouting, and tactics.',
      ar: 'أحدث أرسين فينغر ثورة تكتيكية وغذائية في تاريخ الدوري الإنجليزي الممتاز.',
    },
  },
  {
    id: 'pl_32',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'What is the fierce rivalry between Manchester United and Liverpool historically called?',
      ar: 'ماذا تسمى المواجهة التاريخية الأشرس في إنجلترا بين مانشستر يونايتد وليفربول؟',
    },
    options: {
      en: ['North West Derby', 'Merseyside Derby', 'Roses Derby', 'Manchester Derby'],
      ar: ['ديربي الشمال الغربي', 'ديربي الميرسيسايد', 'ديربي الورود', 'ديربي مانشستر'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'The North West Derby is England’s most successful and bitter inter-city football rivalry.',
      ar: 'ديربي الشمال الغربي يجمع أكثر ناديين تتويجاً بالألقاب في تاريخ إنجلترا.',
    },
  },
  {
    id: 'pl_33',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Which Belgian playmaker registered 16 assists and 20 assists in two different seasons for Manchester City?',
      ar: 'من صانع الألعاب البلجيكي الذي قدم 20 تمريرة حاسمة في موسم واحد مع مانشستر سيتي؟',
    },
    options: {
      en: ['Eden Hazard', 'Kevin De Bruyne', 'Youri Tielemans', 'Mousa Dembélé'],
      ar: ['إيدين هازارد', 'كيفين دي بروين', 'يوري تيليمانس', 'موسى ديمبيلي'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Kevin De Bruyne matched Thierry Henry’s single-season record of 20 assists in 2019-20.',
      ar: 'عادل كيفين دي بروين رقم تييري هنري القياسي بـ 20 أسيست في موسم 2020.',
    },
  },
  {
    id: 'pl_34',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Which Dutch striker scored a spectacular volley against Aston Villa on the night Manchester United won the 2013 title?',
      ar: 'من المهاجم الهولندي الذي سجل هدفاً طائراً تاريخياً ليحسم لقب الدوري العشرين لمانشستر يونايتد عام 2013؟',
    },
    options: {
      en: ['Ruud van Nistelrooy', 'Robin van Persie', 'Dirk Kuyt', 'Jimmy Floyd Hasselbaink'],
      ar: ['رود فان نيستلروي', 'روبن فان بيرسي', 'ديرك كويت', 'جيمي فلويد هاسلبانك'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Robin van Persie scored a first-half hat-trick, including a volley from Rooney’s long pass.',
      ar: 'سجل فان بيرسي هاتريك لا ينسى منه تسديدة طائرة على الطاير من تمريرة روني.',
    },
  },
  {
    id: 'pl_35',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Which player holds the record for the most penalty saves in Premier League history (13 saves)?',
      ar: 'أي حارس مرمى يملك الرقم القياسي لأكبر عدد تصديات لركلات الجزاء في البريميرليغ (13 تصدياً)؟',
    },
    options: {
      en: ['David James', 'Petr Čech', 'Heurelho Gomes', 'Joe Hart'],
      ar: ['ديفيد جيمس', 'بيتر تشيك', 'هوريلهو غوميز', 'جو هارت'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'David James saved 13 penalties during his long Premier League career.',
      ar: 'تصدى الحارس الإنجليزي ديفيد جيمس لـ 13 ركلة جزاء خلال مسيرته بالدوري.',
    },
  },
  {
    id: 'pl_36',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Who is the only player to have scored a Premier League hat-trick composed entirely of headers?',
      ar: 'من هو اللاعب الوحيد الذي سجل ثلاثية (هاتريك) كاملة بالرأس في مباراة بالدوري الإنجليزي الممتاز؟',
    },
    options: {
      en: ['Duncan Ferguson', 'Peter Crouch', 'Salomón Rondón', 'Tim Cahill'],
      ar: ['دونكان فيرغسون', 'بيتر كراوتش', 'سالومون روندون', 'تيم كاهيل'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'Duncan Ferguson scored 3 headers for Everton against Bolton in December 1997.',
      ar: 'سجل دونكان فيرغسون 3 أهداف بالرأس لإيفرتون أمام بولتون عام 1997.',
    },
  },

  // ==========================================
  // SERIE A - FRESH
  // ==========================================
  {
    id: 'seriea_31',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Which Italian club plays their home games in the iconic Stadio San Paolo, renamed in honor of Diego Maradona?',
      ar: 'ما هو النادي الإيطالي الذي خاض مبارياته في ملعب سان باولو الذي تمت تسميته باسم مارادونا؟',
    },
    options: {
      en: ['Lazio', 'Fiorentina', 'SSC Napoli', 'Bologna'],
      ar: ['لاتسيو', 'فيورنتينا', 'نابولي (SSC Napoli)', 'بولونيا'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'The Stadio Diego Armando Maradona is the cauldron of Neapolitan football.',
      ar: 'ملعب دييغو أرماندو مارادونا هو معقل الشغف والجنون الكروي لمدينة نابولي.',
    },
  },
  {
    id: 'seriea_32',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Which legendary defender captained AC Milan and the Italian national team with iconic elegance at No. 6?',
      ar: 'من القائد والأسطورة الدفاعي الذي ارتدى القميص رقم 6 في إيه سي ميلان وحُجب قميصه تقديراً له؟',
    },
    options: {
      en: ['Franco Baresi', 'Fabio Cannavaro', 'Marco Materazzi', 'Mauro Tassotti'],
      ar: ['فرانكو باريزي', 'فابيو كانافارو', 'ماركو ماتيراتزي', 'ماورو تاسوتي'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'Franco Baresi was so revered that AC Milan retired his No. 6 jersey.',
      ar: 'فرانكو باريزي حظي بمكانة خارقة جعلت ميلان يحجب الرقم 6 إلى الأبد.',
    },
  },
  {
    id: 'seriea_33',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Which club did Cristiano Ronaldo score 81 Serie A goals for between 2018 and 2021, winning two league titles?',
      ar: 'أي نادٍ إيطالي سجل له كريستيانو رونالدو 81 هدفاً وتوج معه بلقبين في الدوري الإيطالي؟',
    },
    options: {
      en: ['Inter Milan', 'Juventus', 'AC Milan', 'AS Roma'],
      ar: ['إنتر ميلان', 'يوفنتوس', 'إيه سي ميلان', 'روما'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Cristiano Ronaldo was Serie A top scorer and player of the year with Juventus.',
      ar: 'فاز رونالدو بجائزة هداف ولاعب العام في إيطاليا بقميص يوفنتوس.',
    },
  },
  {
    id: 'seriea_34',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Which Argentine striker was known as "Batigol" and scored 152 Serie A goals for Fiorentina?',
      ar: 'من هو الهداف الأرجنتيني الملقب بـ "باتيغول" صاحب التسديدات الصاروخية مع فيورنتينا؟',
    },
    options: {
      en: ['Hernán Crespo', 'Gabriel Batistuta', 'Claudio Caniggia', 'Diego Milito'],
      ar: ['هيرنان كريسبو', 'غابرييل باتيستوتا', 'كلاوديو كانيجيا', 'دييغو ميليتو'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Gabriel Batistuta is an eternal icon in Florence with his famous machine-gun celebration.',
      ar: 'يعد باتيستوتا أيقونة فلورنسا الخالدة باحتفاليته الشهيرة بالرشاش.',
    },
  },
  {
    id: 'seriea_35',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Which Italian midfielder won the Ballon d’Or in 1993 while starring for Juventus?',
      ar: 'من هو النجم الإيطالي الأسطوري ذو ذيل الحصان الذي فاز بالكرة الذهبية عام 1993 مع يوفنتوس؟',
    },
    options: {
      en: ['Gianfranco Zola', 'Roberto Baggio', 'Alessandro Del Piero', 'Dino Baggio'],
      ar: ['جيانفرانكو زولا', 'روبرتو باجيو', 'أليساندرو ديل بييرو', 'دينو باجيو'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Roberto Baggio won both the Ballon d’Or and FIFA World Player of the Year in 1993.',
      ar: 'فاز الأسطورة باجيو بالكرة الذهبية وجائزة الفيفا لأفضل لاعب في العالم عام 1993.',
    },
  },
  {
    id: 'seriea_36',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Which club did Gianluigi Buffon make his Serie A debut for at age 17 against AC Milan in 1995?',
      ar: 'أي نادٍ شهد الظهور الأول للحارس جانلويجي بوفون في السيريا آ وهو في سن 17 عاماً أمام ميلان؟',
    },
    options: {
      en: ['Juventus', 'Parma', 'Genoa', 'Carrarese'],
      ar: ['يوفنتوس', 'بارما', 'جنوة', 'كاراريسي'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Buffon kept a clean sheet against reigning champions AC Milan in November 1995.',
      ar: 'حافظ بوفون الشاب على نظافة شباكه أمام نجوم ميلان في أول ظهور له مع بارما عام 1995.',
    },
  },

  // ==========================================
  // LIGUE 1 - FRESH
  // ==========================================
  {
    id: 'ligue1_31',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Which Argentine superstar won the Ballon d’Or while playing for Paris Saint-Germain in 2021 and 2023?',
      ar: 'من هو الأسطورة الأرجنتيني الذي نال الكرة الذهبية أثناء لعبه مع باريس سان جيرمان عامي 2021 و2023؟',
    },
    options: {
      en: ['Ángel Di María', 'Mauro Icardi', 'Lionel Messi', 'Javier Pastore'],
      ar: ['أنخيل دي ماريا', 'ماورو إيكاردي', 'ليونيل ميسي', 'خافيير باستوري'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'Lionel Messi spent two seasons at PSG, winning two Ligue 1 titles and two Ballons d’Or.',
      ar: 'لعب ميسي موسمين في باريس وتوج بلقبين في الدوري الفرنسي ونال كرتين ذهبيتين.',
    },
  },
  {
    id: 'ligue1_32',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Which Brazilian attacker joined Paris Saint-Germain in 2017 in a world-record €222 million transfer?',
      ar: 'من هو النجم البرازيلي الذي انضم لسان جيرمان في 2017 بأغلى صفقة في تاريخ الكرة (222 مليون يورو)؟',
    },
    options: {
      en: ['Neymar Jr', 'Philippe Coutinho', 'Gabriel Jesus', 'Vinícius Jr'],
      ar: ['نيمار جونيور', 'فيليب كوتينيو', 'غابرييل خيسوس', 'فينيسيوس جونيور'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'Neymar’s transfer from Barcelona to PSG remains the most expensive in football history.',
      ar: 'لا تزال صفقة انتقال نيمار من برشلونة إلى باريس الأغلى في تاريخ الرياضة.',
    },
  },
  {
    id: 'ligue1_33',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Which Uruguayan striker is celebrated as one of PSG’s all-time top scorers with 200 goals?',
      ar: 'من هو المهاجم الأوروغوياني الملقب بـ "الماتادور" الذي سجل 200 هدف لباريس سان جيرمان؟',
    },
    options: {
      en: ['Luis Suárez', 'Diego Forlán', 'Edinson Cavani', 'Cristhian Stuani'],
      ar: ['لويس سواريز', 'دييغو فورلان', 'إدينسون كافاني', 'كريستيان ستواني'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'Edinson Cavani "El Matador" scored 200 goals and was adored by Parisian supporters.',
      ar: 'سجل "الماتادور" كافاني 200 هدف وكان النجم المفضل لعشاق حديقة الأمراء.',
    },
  },
  {
    id: 'ligue1_34',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Which French midfielder led Bordeaux to the Ligue 1 title in 2009 and won Ligue 1 Player of the Year?',
      ar: 'من صانع الألعاب الفرنسي الذي قاد بوردو للقب الدوري 2009 ونال جائزة أفضل لاعب بفرنسا؟',
    },
    options: {
      en: ['Yoann Gourcuff', 'Samir Nasri', 'Mathieu Valbuena', 'Florent Malouda'],
      ar: ['يوان غوركوف', 'سمير نصري', 'ماتيو فالبوينا', 'فلوران مالودا'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'Yoann Gourcuff scored one of the most famous solo goals in Ligue 1 history against PSG that season.',
      ar: 'سجل غوركوف هدفاً مهارياً أسطورياً راوغ فيه الدفاع والحارس وظل علامة فارقة.',
    },
  },
  {
    id: 'ligue1_35',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Which club won 8 French league titles between 1965 and 2001 and played in famous canary-yellow shirts?',
      ar: 'أي نادٍ فرنسي يرتدي القميص الأصفر وحصد 8 ألقاب دوري بين 1965 و2001؟',
    },
    options: {
      en: ['FC Nantes', 'RC Lens', 'Metz', 'Sedan'],
      ar: ['إف سي نانت (FC Nantes)', 'لانس', 'ميتز', 'سيدان'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'FC Nantes was famous for its fluid "Jeu à la nantaise" passing philosophy.',
      ar: 'اشتهر نادي نانت بأسلوب لعبه الجماعي السلس والجميل "طريقة نانت".',
    },
  },
  {
    id: 'ligue1_36',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Who is the youngest player to score a goal in Ligue 1 in the 21st century (at 16 years and 110 days)?',
      ar: 'من هو أصغر لاعب يسجل هدفاً في الدوري الفرنسي في القرن الحادي والعشرين (بعمر 16 عاماً و110 أيام)؟',
    },
    options: {
      en: ['Warren Zaïre-Emery', 'Kylian Mbappé', 'Eduardo Camavinga', 'Rayan Cherki'],
      ar: ['وارن زائير إيمري', 'كيليان مبابي', 'إدواردو كامافينغا', 'ريان شرقي'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'Warren Zaïre-Emery scored for PSG against Montpellier in February 2023.',
      ar: 'سجل الشاب وارن زائير إيمري هدفاً لسان جيرمان أمام مونبلييه عام 2023 وهو في سن 16 عاماً.',
    },
  },

  // ==========================================
  // WORLD CUP - FRESH
  // ==========================================
  {
    id: 'wc_31',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Which European nation won their first-ever FIFA World Cup in 1966 on home soil at Wembley?',
      ar: 'أي دولة أوروبية حققت لقبها الوحيد في كأس العالم عام 1966 على أرضها في ويمبلي؟',
    },
    options: {
      en: ['England', 'France', 'Spain', 'Portugal'],
      ar: ['إنجلترا', 'فرنسا', 'إسبانيا', 'البرتغال'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'England defeated West Germany 4-2 after extra time, with Geoff Hurst scoring a hat-trick.',
      ar: 'فازت إنجلترا على ألمانيا الغربية 4-2 في الوقت الإضافي بهاتريك جيف هيرست.',
    },
  },
  {
    id: 'wc_32',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Which country hosted the first-ever FIFA World Cup held in the Arab world in 2022?',
      ar: 'أي دولة استضافت أول بطولة لكأس العالم في الوطن العربي والشرق الأوسط عام 2022؟',
    },
    options: {
      en: ['Morocco', 'Saudi Arabia', 'Qatar', 'United Arab Emirates'],
      ar: ['المغرب', 'المملكة العربية السعودية', 'قطر', 'الإمارات العربية المتحدة'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'Qatar hosted an unforgettable 2022 World Cup with the final at Lusail Stadium.',
      ar: 'استضافت دولة قطر مونديال 2022 الاستثنائي وتوجت الأرجنتين في لوسيل.',
    },
  },
  {
    id: 'wc_33',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Who won the Golden Ball as the best player of the 2018 FIFA World Cup in Russia after leading Croatia to the final?',
      ar: 'من فاز بجائزة الكرة الذهبية لأفضل لاعب في مونديال روسيا 2018 بعد قيادة كرواتيا للنهائي؟',
    },
    options: {
      en: ['Antoine Griezmann', 'Ivan Perišić', 'Luka Modrić', 'Kylian Mbappé'],
      ar: ['أنطوان غريزمان', 'إيفان بيريشيتش', 'لوكا مودريتش', 'كيليان مبابي'],
    },
    correctIndex: 2, // C
    explanation: {
      en: 'Luka Modrić was voted the tournament’s best player for his midfield masterclasses.',
      ar: 'نال لوكا مودريتش الكرة الذهبية للمونديال تقديراً لأدائه الخيالي مع كرواتيا.',
    },
  },
  {
    id: 'wc_34',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Which Colombian sensation won the Golden Boot at the 2014 World Cup in Brazil with 6 goals?',
      ar: 'من هو النجم الكولومبي الذي نال الحذاء الذهبي لهداف مونديال البرازيل 2014 بـ 6 أهداف؟',
    },
    options: {
      en: ['Radamel Falcao', 'James Rodríguez', 'Juan Cuadrado', 'Jackson Martínez'],
      ar: ['راداميل فالكاو', 'خاميس رودريغيز', 'خوان كوادرادو', 'جاكسون مارتينيز'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'James Rodríguez won the Golden Boot and scored a Puskás-winning chest-and-volley against Uruguay.',
      ar: 'تألق خاميس رودريغيز وسجل هدفه الصاروخي التاريخي على الطائر أمام الأوروغواي.',
    },
  },
  {
    id: 'wc_35',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Who is the only goalkeeper in football history to have won the FIFA World Cup Golden Ball as tournament best player?',
      ar: 'من هو حارس المرمى الوحيد في تاريخ كرة القدم الذي نال جائزة الكرة الذهبية كأفضل لاعب في المونديال؟',
    },
    options: {
      en: ['Gianluigi Buffon (2006)', 'Oliver Kahn (2002)', 'Manuel Neuer (2014)', 'Dino Zoff (1982)'],
      ar: ['جانلويجي بوفون (2006)', 'أوليفر كان (2002)', 'مانويل نوير (2014)', 'دينو زوف (1982)'],
    },
    correctIndex: 1, // B
    explanation: {
      en: 'Oliver Kahn won the Golden Ball in 2002 after conceding just one goal on Germany’s run to the final.',
      ar: 'أوليفر كان حارس ألمانيا هو الحارس الوحيد الذي نال الكرة الذهبية لأفضل لاعب بالبطولة.',
    },
  },
  {
    id: 'wc_36',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Who scored the historic "Golden Goal" in the 1998 World Cup round of 16 for France against Paraguay?',
      ar: 'من سجل أول هدف ذهبي في تاريخ كأس العالم لفرنسا ضد باراغواي في ثمن نهائي 1998؟',
    },
    options: {
      en: ['Laurent Blanc', 'David Trezeguet', 'Thierry Henry', 'Youri Djorkaeff'],
      ar: ['لوران بلان', 'دافيد تريزيغيه', 'تييري هنري', 'يوري جوركاييف'],
    },
    correctIndex: 0, // A
    explanation: {
      en: 'Laurent Blanc scored the first Golden Goal in World Cup history in the 114th minute in Lens.',
      ar: 'سجل المدافع لوران بلان أول هدف ذهبي في تاريخ المونديال عند الدقيقة 114 في لانس.',
    },
  },
];
