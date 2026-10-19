import { CategoryId, DifficultyLevel, Question } from '../types/quiz';

export const ALL_QUESTIONS: Question[] = [
  // ==========================================
  // CHAMPIONS LEAGUE (UCL)
  // ==========================================
  {
    id: 'ucl_01',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'Which club has won the most UEFA Champions League titles in football history?',
      ar: 'ما هو النادي الأكثر تتويجاً بلقب دوري أبطال أوروبا في تاريخ كرة القدم؟',
    },
    options: {
      en: ['Real Madrid', 'AC Milan', 'Bayern Munich', 'Liverpool'],
      ar: ['ريال مدريد', 'إيه سي ميلان', 'بايرن ميونخ', 'ليفربول'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Real Madrid is the undisputed king of Europe with 15 Champions League titles.',
      ar: 'ريال مدريد هو ملك أوروبا التاريخي برصيد 15 لقباً في دوري الأبطال.',
    },
  },
  {
    id: 'ucl_02',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'Who is the all-time leading goalscorer in UEFA Champions League history?',
      ar: 'من هو الهداف التاريخي لدوري أبطال أوروبا لكرة القدم؟',
    },
    options: {
      en: ['Cristiano Ronaldo', 'Lionel Messi', 'Robert Lewandowski', 'Karim Benzema'],
      ar: ['كريستيانو رونالدو', 'ليونيل ميسي', 'روبرت ليفاندوفسكي', 'كريم بنزيما'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Cristiano Ronaldo leads all-time with 140 goals in the UEFA Champions League.',
      ar: 'يتصدر كريستيانو رونالدو قائمة الهدافين التاريخيين برصيد 140 هدفاً.',
    },
  },
  {
    id: 'ucl_03',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'In the legendary 2005 "Miracle of Istanbul", which club overcame a 3-0 deficit against AC Milan to win?',
      ar: 'في ملحمة إسطنبول الشهيرة 2005، أي نادٍ عاد من التأخر 3-0 أمام ميلان ليتوج باللقب؟',
    },
    options: {
      en: ['Liverpool', 'Arsenal', 'Manchester United', 'Barcelona'],
      ar: ['ليفربول', 'آرسنال', 'مانشستر يونايتد', 'برشلونة'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Liverpool scored 3 goals in 6 crazy minutes before winning on penalty kicks.',
      ar: 'سجل ليفربول ثلاثة أهداف في 6 دقائق مجنونة ثم حسم المباراة بركلات الترجيح.',
    },
  },
  {
    id: 'ucl_04',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'Who scored the famous volley for Real Madrid in the 2002 final against Bayer Leverkusen?',
      ar: 'من صاحب الهدف الطائر الأسطوري لريال مدريد في نهائي 2002 أمام باير ليفركوزن؟',
    },
    options: {
      en: ['Zinedine Zidane', 'Raúl González', 'Roberto Carlos', 'Luís Figo'],
      ar: ['زين الدين زيدان', 'راؤول غونزاليس', 'روبرتو كارلوس', 'لويس فيغو'],
    },
    correctIndex: 0,
    explanation: {
      en: "Zinedine Zidane's left-foot volley at Hampden Park is considered one of the greatest UCL goals ever.",
      ar: 'تسديدة زيدان على الطائر بقدمه اليسرى في غلاسكو تعتبر من أعظم أهداف البطولة عبر التاريخ.',
    },
  },
  {
    id: 'ucl_05',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'Which manager won three consecutive UEFA Champions League titles between 2016 and 2018?',
      ar: 'أي مدرب حقق إنجاز الفوز بثلاثة ألقاب دوري أبطال أوروبا متتالية بين 2016 و2018؟',
    },
    options: {
      en: ['Zinedine Zidane', 'Pep Guardiola', 'Carlo Ancelotti', 'Jose Mourinho'],
      ar: ['زين الدين زيدان', 'بيب غوارديولا', 'كارلو أنشيلوتي', 'جوزيه مورينيو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Zidane led Real Madrid to a historic three-peat in 2016, 2017, and 2018.',
      ar: 'قاد زيدان ريال مدريد لثلاثية تاريخية متتالية في أعوام 2016 و2017 و2018.',
    },
  },
  {
    id: 'ucl_06',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'Which English club won the UEFA Champions League for the first time in their history in 2023?',
      ar: 'أي نادٍ إنجليزي حقق لقب دوري أبطال أوروبا للمرة الأولى في تاريخه عام 2023؟',
    },
    options: {
      en: ['Manchester City', 'Tottenham Hotspur', 'Arsenal', 'Newcastle United'],
      ar: ['مانشستر سيتي', 'توتنهام هوتسبير', 'آرسنال', 'نيوكاسل يونايتد'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Manchester City defeated Inter Milan 1-0 in Istanbul with a goal from Rodri.',
      ar: 'فاز مانشستر سيتي على إنتر ميلان 1-0 في إسطنبول بهدف سجله الإسباني رودري.',
    },
  },
  {
    id: 'ucl_07',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'In which European city was the iconic 1999 Champions League final held where Manchester United scored twice in stoppage time?',
      ar: 'في أي مدينة أقيم نهائي 1999 المثير الذي قلب فيه مانشستر يونايتد الطاولة في الوقت القاتل؟',
    },
    options: {
      en: ['Barcelona (Camp Nou)', 'Paris (Stade de France)', 'Milan (San Siro)', 'Munich (Olympiastadion)'],
      ar: ['برشلونة (كامب نو)', 'باريس (ستاد دي فرانس)', 'ميلانو (سان سيرو)', 'ميونخ (الملعب الأولمبي)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Sheringham and Solskjær struck in added time at Camp Nou to beat Bayern Munich 2-1.',
      ar: 'سجل شيرينغهام وسولشاير في الوقت بدل الضائع في كامب نو ليفوز يونايتد 2-1.',
    },
  },
  {
    id: 'ucl_08',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'Who scored 5 goals in a single Champions League knockout match for Barcelona against Bayer Leverkusen in 2012?',
      ar: 'من هو اللاعب الذي أحرز 5 أهداف في مباراة واحدة بالأدوار الإقصائية لبرشلونة أمام باير ليفركوزن عام 2012؟',
    },
    options: {
      en: ['Lionel Messi', 'Neymar Jr', 'Luis Suárez', 'David Villa'],
      ar: ['ليونيل ميسي', 'نيمار جونيور', 'لويس سواريز', 'دافيد فيا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lionel Messi became the first player in modern UCL history to score 5 goals in one match (7-1 win).',
      ar: 'أصبح ليونيل ميسي أول لاعب يسجل 5 أهداف في مباراة واحدة في النسخة الحديثة (7-1).',
    },
  },
  {
    id: 'ucl_09',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'Which Portuguese club won the UEFA Champions League under Jose Mourinho in 2004?',
      ar: 'ما هو النادي البرتغالي الذي أحرز لقب دوري أبطال أوروبا مع جوزيه مورينيو في 2004؟',
    },
    options: {
      en: ['FC Porto', 'Benfica', 'Sporting CP', 'Braga'],
      ar: ['إف سي بورتو', 'بنفيكا', 'سبورتينغ لشبونة', 'سبورتينغ براغا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Porto swept AS Monaco 3-0 in Gelsenkirchen to secure the 2004 European crown.',
      ar: 'تفوق بورتو على موناكو بثلاثية نظيفة في غيلسنكيرشن ليتوج بطلاً لأوروبا.',
    },
  },
  {
    id: 'ucl_10',
    category: 'champions_league',
    difficulty: 'easy',
    question: {
      en: 'How many teams qualify directly for the knockout phase round of 16 in the traditional Champions League format?',
      ar: 'كم عدد الفرق التي كانت تتأهل لدور الـ 16 في النظام الكلاسيكي لدوري أبطال أوروبا؟',
    },
    options: {
      en: ['16 teams', '8 teams', '24 teams', '32 teams'],
      ar: ['16 فريقاً', '8 فرق', '24 فريقاً', '32 فريقاً'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The top 2 teams from 8 groups made up the round of 16.',
      ar: 'يتأهل أول وثاني كل مجموعة من المجموعات الثماني ليكتمل دور الـ 16.',
    },
  },
  {
    id: 'ucl_11',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Who holds the record for the most UEFA Champions League titles won as a manager?',
      ar: 'من هو المدرب الأكثر تتويجاً بلقب دوري أبطال أوروبا عبر التاريخ؟',
    },
    options: {
      en: ['Carlo Ancelotti', 'Bob Paisley', 'Pep Guardiola', 'Alex Ferguson'],
      ar: ['كارلو أنشيلوتي', 'بوب بيزلي', 'بيب غوارديولا', 'أليكس فيرغسون'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Carlo Ancelotti holds the managerial record with 5 titles (2 with AC Milan, 3 with Real Madrid).',
      ar: 'أنشيلوتي ينفرد بالرقم القياسي بـ 5 ألقاب (لقبان مع ميلان و3 ألقاب مع ريال مدريد).',
    },
  },
  {
    id: 'ucl_12',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Which player holds the record for the fastest goal ever scored in Champions League history (10.12 seconds)?',
      ar: 'من صاحب أسرع هدف في تاريخ دوري أبطال أوروبا (10.12 ثانية)؟',
    },
    options: {
      en: ['Roy Makaay', 'Jonas', 'Clarence Seedorf', 'Alessandro Del Piero'],
      ar: ['روي ماكاي', 'جوناس', 'كلارنس سيدورف', 'أليساندرو ديل بييرو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Roy Makaay scored for Bayern Munich against Real Madrid in just 10.12 seconds in 2007.',
      ar: 'سجل روي ماكاي لبايرن ميونخ ضد ريال مدريد بعد 10.12 ثانية فقط عام 2007.',
    },
  },
  {
    id: 'ucl_13',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Who is the only player to have won the UEFA Champions League with three different clubs?',
      ar: 'من هو اللاعب الوحيد الذي حقق دوري أبطال أوروبا مع 3 أندية مختلفة؟',
    },
    options: {
      en: ['Clarence Seedorf', 'Cristiano Ronaldo', 'Samuel Eto’o', 'Zlatan Ibrahimović'],
      ar: ['كلارنس سيدورف', 'كريستيانو رونالدو', 'صامويل إيتو', 'زلاتان إبراهيموفيتش'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Seedorf won it with Ajax (1995), Real Madrid (1998), and AC Milan (2003, 2007).',
      ar: 'حققها سيدورف مع أياكس (1995)، وريال مدريد (1998)، وميلان (2003 و2007).',
    },
  },
  {
    id: 'ucl_14',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'In 2017, Barcelona completed the miraculous "La Remontada" against PSG by winning the second leg by what scoreline?',
      ar: 'في عام 2017، حقق برشلونة ريمونتادا أسطورية ضد باريس سان جيرمان، ما هي نتيجة مباراة الإياب؟',
    },
    options: {
      en: ['6 - 1', '5 - 0', '4 - 0', '6 - 2'],
      ar: ['6 - 1', '5 - 0', '4 - 0', '6 - 2'],
    },
    correctIndex: 0,
    explanation: {
      en: 'After losing 4-0 in Paris, Barcelona won 6-1 at Camp Nou with Sergi Roberto scoring in the 95th minute.',
      ar: 'بعد الخسارة 4-0 في باريس، فاز برشلونة 6-1 في كامب نو بهدف سيرجي روبرتو في الدقيقة 95.',
    },
  },
  {
    id: 'ucl_15',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Who scored the winning goal for Chelsea against Manchester City in the 2021 Champions League Final?',
      ar: 'من أحرز هدف الفوز لتشيلسي أمام مانشستر سيتي في نهائي دوري أبطال أوروبا 2021؟',
    },
    options: {
      en: ['Kai Havertz', 'Mason Mount', 'N’Golo Kanté', 'Christian Pulisic'],
      ar: ['كاي هافيرتز', 'ميسون ماونت', 'نغولو كانتي', 'كريستيان بوليسيتش'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Kai Havertz rounded Ederson in Porto to secure Chelsea’s second European crown.',
      ar: 'راوغ كاي هافيرتز الحارس إيدرسون ليمنح تشيلسي لقبه القاري الثاني.',
    },
  },
  {
    id: 'ucl_16',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Which club won the European Cup in 1991, becoming the only Serbian club to do so?',
      ar: 'أي نادٍ فاز بكأس أوروبا للأندية عام 1991 ليكون النادي الصربي الوحيد الذي حقق اللقب؟',
    },
    options: {
      en: ['Red Star Belgrade', 'Partizan Belgrade', 'Vojvodina', 'Dinamo Zagreb'],
      ar: ['النجم الأحمر بلغراد', 'بارتيزان بلغراد', 'فويفودينا', 'دينامو زغرب'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Red Star Belgrade defeated Marseille on penalties in Bari in 1991.',
      ar: 'تغلب النجم الأحمر (ريد ستار) على مارسيليا بركلات الترجيح في باري عام 1991.',
    },
  },
  {
    id: 'ucl_17',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Who scored an iconic header in the 93rd minute of the 2014 final to rescue Real Madrid against Atletico?',
      ar: 'من سجل رأسية التعادل التاريخية في الدقيقة 93 لإنقاذ ريال مدريد أمام أتلتيكو مدريد في نهائي 2014؟',
    },
    options: {
      en: ['Sergio Ramos', 'Gareth Bale', 'Cristiano Ronaldo', 'Marcelo'],
      ar: ['سيرخيو راموس', 'غاريث بيل', 'كريستيانو رونالدو', 'مارسيلو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Sergio Ramos produced the unforgettable 92:48 header that sparked La Décima.',
      ar: 'سجل سيرخيو راموس رأسية العاشرة الخالدة عند الدقيقة 92:48.',
    },
  },
  {
    id: 'ucl_18',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Which Dutch side eliminated Real Madrid and Juventus in 2019 under Erik ten Hag?',
      ar: 'أي نادٍ هولندي أقصى ريال مدريد ويوفنتوس في دوري الأبطال 2019 تحت قيادة تين هاغ؟',
    },
    options: {
      en: ['Ajax Amsterdam', 'PSV Eindhoven', 'Feyenoord', 'AZ Alkmaar'],
      ar: ['أياكس أمستردام', 'بي إس في آيندهوفن', 'فينورد', 'إي زد ألكمار'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Ajax electrified Europe with de Jong, de Ligt, and Tadić reaching the semifinals.',
      ar: 'أبهر أياكس أوروبا بمواهبه دي يونغ ودي ليخت وتاديتش وصولاً لنصف النهائي.',
    },
  },
  {
    id: 'ucl_19',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Who was the top goalscorer in the 2021-22 UEFA Champions League season with 15 goals?',
      ar: 'من كان هداف دوري أبطال أوروبا لموسم 2021-2022 برصيد 15 هدفاً؟',
    },
    options: {
      en: ['Karim Benzema', 'Robert Lewandowski', 'Mohamed Salah', 'Kylian Mbappé'],
      ar: ['كريم بنزيما', 'روبرت ليفاندوفسكي', 'محمد صلاح', 'كيليان مبابي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Karim Benzema put on one of the greatest individual UCL campaigns to win the Ballon d’Or.',
      ar: 'قدم كريم بنزيما موسماً إعجازياً قاد به فريقه للقب وتوج بالكرة الذهبية.',
    },
  },
  {
    id: 'ucl_20',
    category: 'champions_league',
    difficulty: 'medium',
    question: {
      en: 'Which stadium has hosted the most UEFA Champions League / European Cup finals?',
      ar: 'ما هو الملعب الذي استضاف أكبر عدد من نهائيات دوري أبطال أوروبا / كأس أوروبا؟',
    },
    options: {
      en: ['Wembley Stadium (London)', 'Santiago Bernabéu', 'San Siro', 'Stadio Olimpico'],
      ar: ['ملعب ويمبلي (لندن)', 'سانتياغو برنابيو', 'سان سيرو', 'الملعب الأولمبي بروما'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Wembley in London has hosted the final a record 8 times.',
      ar: 'استضاف ملعب ويمبلي في لندن النهائي القاري 8 مرات وهو رقم قياسي.',
    },
  },
  {
    id: 'ucl_21',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Who is the youngest goalscorer in UEFA Champions League history?',
      ar: 'من هو أصغر لاعب يسجل هدفاً في تاريخ دوري أبطال أوروبا؟',
    },
    options: {
      en: ['Ansu Fati', 'Peter Ofori-Quaye', 'Lamine Yamal', 'Mateo Kovačić'],
      ar: ['أنسو فاتي', 'بيتر أوفوري كواي', 'لامين يامال', 'ماتيو كوفاسيتش'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Ansu Fati scored for Barcelona against Inter Milan in December 2019 aged 17 years and 40 days.',
      ar: 'سجل أنسو فاتي لبرشلونة ضد إنتر عام 2019 بعمر 17 عاماً و40 يوماً.',
    },
  },
  {
    id: 'ucl_22',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Which player holds the record for the most goals in a single UEFA Champions League campaign?',
      ar: 'من يملك الرقم القياسي لأكبر عدد من الأهداف في موسم واحد بدوري أبطال أوروبا؟',
    },
    options: {
      en: ['Cristiano Ronaldo (17 goals)', 'Lionel Messi (14 goals)', 'Robert Lewandowski (15 goals)', 'Karim Benzema (15 goals)'],
      ar: ['كريستيانو رونالدو (17 هدفاً)', 'ليونيل ميسي (14 هدفاً)', 'روبرت ليفاندوفسكي (15 هدفاً)', 'كريم بنزيما (15 هدفاً)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Cristiano Ronaldo struck 17 times during Real Madrid’s 2013-14 title triumph.',
      ar: 'أحرز كريستيانو رونالدو 17 هدفاً في موسم 2013-2014 مع ريال مدريد.',
    },
  },
  {
    id: 'ucl_23',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Which club won the first five consecutive European Cups between 1956 and 1960?',
      ar: 'أي نادٍ فاز بأول خمس نسخ متتالية لكأس أوروبا بين عامي 1956 و1960؟',
    },
    options: {
      en: ['Real Madrid', 'Benfica', 'Stade de Reims', 'Inter Milan'],
      ar: ['ريال مدريد', 'بنفيكا', 'ستاد ريمس', 'إنتر ميلان'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Real Madrid dominated the inception of the tournament led by Alfredo Di Stéfano and Ferenc Puskás.',
      ar: 'سيطر ريال مدريد بقيادة دي ستيفانو وبوشكاش على أول خمس نسخ متتالية.',
    },
  },
  {
    id: 'ucl_24',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Who holds the record for the fastest hat-trick in Champions League history (6 minutes and 12 seconds)?',
      ar: 'من صاحب أسرع هاتريك في تاريخ دوري أبطال أوروبا (خلال 6 دقائق و12 ثانية)؟',
    },
    options: {
      en: ['Mohamed Salah', 'Bafétimbi Gomis', 'Mike Newell', 'Cristiano Ronaldo'],
      ar: ['محمد صلاح', 'بافيتيمبي غوميز', 'مايك نيويل', 'كريستيانو رونالدو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Mohamed Salah scored three goals in 6 minutes and 12 seconds for Liverpool against Rangers in 2022.',
      ar: 'سجل محمد صلاح ثلاثيته التاريخية في 6 دقائق و12 ثانية أمام رينجرز في 2022.',
    },
  },
  {
    id: 'ucl_25',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Which Romanian club won the European Cup in 1986 by beating Barcelona in a penalty shootout?',
      ar: 'ما هو النادي الروماني الذي فاز بدوري الأبطال 1986 بعد فوزه على برشلونة بركلات الترجيح؟',
    },
    options: {
      en: ['Steaua București', 'Dinamo București', 'CFR Cluj', 'Universitatea Craiova'],
      ar: ['ستيوا بوخارست', 'دينامو بوخارست', 'سي إف آر كلوج', 'جامعة كرايوفا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Steaua goalkeeper Helmuth Duckadam saved all four Barcelona penalties in Seville.',
      ar: 'تألق حارس ستيوا هيلموت دوكادام وتصدى لجميع ركلات ترجيح برشلونة الأربع في إشبيلية.',
    },
  },
  {
    id: 'ucl_26',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Who scored Borussia Dortmund’s stunning 35-yard lob goal in the 1997 Champions League final against Juventus?',
      ar: 'من سجل الهدف المباغت لبروسيا دورتموند من مسافة بعيدة ضد يوفنتوس في نهائي 1997؟',
    },
    options: {
      en: ['Lars Ricken', 'Karl-Heinz Riedle', 'Stéphane Chapuisat', 'Andreas Möller'],
      ar: ['لارس ريكن', 'كارل هاينز ريدله', 'ستيفان شابويزا', 'أندرياس مولر'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Substitute Lars Ricken scored with his first touch just 16 seconds after coming on.',
      ar: 'سجل البديل لارس ريكن هدفه من اللمسة الأولى بعد 16 ثانية فقط من نزوله.',
    },
  },
  {
    id: 'ucl_27',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'How many different clubs have won the UEFA Champions League / European Cup?',
      ar: 'كم نادياً مختلفاً توج بلقب دوري أبطال أوروبا / كأس أوروبا حتى الآن؟',
    },
    options: {
      en: ['23 clubs', '18 clubs', '28 clubs', '31 clubs'],
      ar: ['23 نادياً', '18 نادياً', '28 نادياً', '31 نادياً'],
    },
    correctIndex: 0,
    explanation: {
      en: 'As of 2024, exactly 23 distinct European clubs have lifted the prestigious trophy.',
      ar: 'حتى عام 2024، نجح 23 نادياً أوروبياً مختلفاً في رفع الكأس ذات الأذنين.',
    },
  },
  {
    id: 'ucl_28',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Who missed the decisive penalty for Chelsea in the Moscow rain during the 2008 final against Manchester United?',
      ar: 'من أضاع ركلة الترجيح الحاسمة لتشيلسي في أمطار موسكو ضد مانشستر يونايتد عام 2008؟',
    },
    options: {
      en: ['John Terry & Nicolas Anelka', 'Frank Lampard', 'Didier Drogba', 'Michael Ballack'],
      ar: ['جون تيري ونيكولا أنيلكا', 'فرانك لامبارد', 'ديدييه دروغبا', 'مايكل بالاك'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Terry slipped on the title-winning kick, and van der Sar later saved Anelka’s effort.',
      ar: 'انزلق جون تيري في ركلة الفوز، وتصدى فان دير سار بعدها لركلة نيكولا أنيلكا.',
    },
  },
  {
    id: 'ucl_29',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'Which player has appeared in the most UEFA Champions League matches without ever winning the tournament?',
      ar: 'من هو اللاعب الأكثر خوضاً للمباريات في دوري أبطال أوروبا دون أن يتوج باللقب قط؟',
    },
    options: {
      en: ['Gianluigi Buffon', 'Zlatan Ibrahimović', 'Cesc Fàbregas', 'Michael Ballack'],
      ar: ['جانلويجي بوفون', 'زلاتان إبراهيموفيتش', 'سيسك فابريغاس', 'مايكل بالاك'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Gianluigi Buffon played in 124 Champions League matches and 3 finals without lifting the trophy.',
      ar: 'خاض بوفون 124 مباراة ولعب 3 نهائيات دون أن يحالفه الحظ برفع الكأس.',
    },
  },
  {
    id: 'ucl_30',
    category: 'champions_league',
    difficulty: 'hard',
    question: {
      en: 'In which season did FC Porto win their first European Cup by beating Bayern Munich 2-1 with Madjer’s famous backheel?',
      ar: 'في أي موسم أحرز بورتو لقبه الأوروبي الأول بهدف رابح ماجر الشهير بكعب القدم ضد بايرن؟',
    },
    options: {
      en: ['1986 - 1987', '1983 - 1984', '1989 - 1990', '1992 - 1993'],
      ar: ['1986 - 1987', '1983 - 1984', '1989 - 1990', '1992 - 1993'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Algerian legend Rabah Madjer scored an immortal backheel in Vienna in May 1987.',
      ar: 'سجل النجم الجزائري رابح ماجر كعبه الشهير في فيينا في مايو 1987.',
    },
  },

  // ==========================================
  // LA LIGA
  // ==========================================
  {
    id: 'laliga_01',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'Who is the all-time highest goalscorer in the history of Spanish La Liga?',
      ar: 'من هو الهداف التاريخي للدوري الإسباني (لا ليغا)؟',
    },
    options: {
      en: ['Lionel Messi (474 goals)', 'Cristiano Ronaldo (311 goals)', 'Telmo Zarra (251 goals)', 'Karim Benzema (238 goals)'],
      ar: ['ليونيل ميسي (474 هدفاً)', 'كريستيانو رونالدو (311 هدفاً)', 'تيلمو زارا (251 هدفاً)', 'كريم بنزيما (238 هدفاً)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lionel Messi scored 474 goals in 520 La Liga appearances for FC Barcelona.',
      ar: 'سجل ليونيل ميسي 474 هدفاً في 520 مباراة بالدوري الإسباني بقميص برشلونة.',
    },
  },
  {
    id: 'laliga_02',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'What is the world-famous derby match between Real Madrid and FC Barcelona called?',
      ar: 'ماذا يسمى الكلاسيكو العالمي الذي يجمع بين ريال مدريد وبرشلونة؟',
    },
    options: {
      en: ['El Clásico', 'Derbi Madrileño', 'El Gran Derbi', 'Superclásico'],
      ar: ['الكلاسيكو (El Clásico)', 'ديربي مدريد', 'الديربي الكبير', 'سوبر كلاسيكو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'El Clásico is one of the most-watched sporting fixtures on the planet.',
      ar: 'الكلاسيكو هو أحد أكثر الأحداث الرياضية متابعة ومشاهدة حول العالم.',
    },
  },
  {
    id: 'laliga_03',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'Which Spanish club has a historic policy of signing only players born or raised in the Basque Country?',
      ar: 'أي نادٍ إسباني يشتهر بسياسته التاريخية في الاعتماد فقط على اللاعبين الباسكيين؟',
    },
    options: {
      en: ['Athletic Bilbao', 'Real Sociedad', 'Osasuna', 'Deportivo Alavés'],
      ar: ['أتلتيك بيلباو', 'ريال سوسيداد', 'أوساسونا', 'ديبورتيفو ألافيس'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Athletic Club (Bilbao) maintains its unique cantera policy focusing exclusively on Basque players.',
      ar: 'يحافظ أتلتيك بيلباو على فلسفته التاريخية الفريدة في ضم اللاعبين الباسكيين فقط.',
    },
  },
  {
    id: 'laliga_04',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'Who is the long-serving Argentine manager who led Atletico Madrid to La Liga titles in 2014 and 2021?',
      ar: 'من هو المدرب الأرجنتيني المخضرم الذي قاد أتلتيكو مدريد للقب الدوري عامي 2014 و2021؟',
    },
    options: {
      en: ['Diego Simeone', 'Marcelo Bielsa', 'Mauricio Pochettino', 'Jorge Sampaoli'],
      ar: ['دييغو سيميوني', 'مارسيلو بيلسا', 'ماوريسيو بوتشيتينو', 'خورخي سامباولي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Diego "Cholo" Simeone has been manager of Atletico Madrid since December 2011.',
      ar: 'يقود دييغو "تشولو" سيميوني دفة أتلتيكو مدريد منذ ديسمبر 2011.',
    },
  },
  {
    id: 'laliga_05',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'What is the award given to the top goalscorer of each La Liga season called?',
      ar: 'ما هو اسم الجائزة التي تُمنح لهداف الدوري الإسباني في كل موسم؟',
    },
    options: {
      en: ['Pichichi Trophy', 'Zamora Trophy', 'Di Stéfano Trophy', 'Zarra Trophy'],
      ar: ['جائزة البيتشيتشي', 'جائزة زامورا', 'جائزة دي ستيفانو', 'جائزة زارا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Pichichi Trophy is named after Athletic Bilbao striker Rafael "Pichichi" Moreno.',
      ar: 'سُميت جائزة البيتشيتشي تيمناً بمهاجم بيلباو الأسطوري رافائيل "بيتشيتشي" مورينو.',
    },
  },
  {
    id: 'laliga_06',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'Which club won back-to-back La Liga titles in 2002 and 2004 under manager Rafael Benítez?',
      ar: 'أي نادٍ توج بلقب الدوري الإسباني مرتين في 2002 و2004 تحت قيادة رافائيل بينيتيز؟',
    },
    options: {
      en: ['Valencia CF', 'Deportivo La Coruña', 'Sevilla FC', 'Villarreal CF'],
      ar: ['فالنسيا', 'ديبورتيفو لاكورونيا', 'إشبيلية', 'فياريال'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Valencia enjoyed their golden era in the early 2000s under Rafa Benítez.',
      ar: 'عاش فالنسيا عصره الذهبي مطلع الألفية وتوج بلقبين مع رافا بينيتيز.',
    },
  },
  {
    id: 'laliga_07',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'Which stadium is the home ground of Real Madrid?',
      ar: 'ما هو الملعب الرئيسي التاريخي لنادي ريال مدريد؟',
    },
    options: {
      en: ['Santiago Bernabéu', 'Metropolitano', 'Mestalla', 'San Mamés'],
      ar: ['سانتياغو برنابيو', 'الميتروبوليتانو', 'الميستايا', 'سان ماميس'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Santiago Bernabéu has been the iconic home of Real Madrid since 1947.',
      ar: 'ملعب سانتياغو برنابيو هو معقل ريال مدريد التاريخي منذ عام 1947.',
    },
  },
  {
    id: 'laliga_08',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'In 2011-12, Real Madrid broke the La Liga record by accumulating how many points?',
      ar: 'في موسم 2011-2012 حطم ريال مدريد الرقم القياسي برصيد كم نقطة؟',
    },
    options: {
      en: ['100 points', '96 points', '102 points', '98 points'],
      ar: ['100 نقطة', '96 نقطة', '102 نقطة', '98 نقطة'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Under Jose Mourinho, Real Madrid reached the 100-point mark with 121 goals scored.',
      ar: 'مع مورينيو حقق ريال مدريد مئوية تاريخية (100 نقطة) وسجل 121 هدفاً.',
    },
  },
  {
    id: 'laliga_09',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'Which three clubs have never been relegated from Spain’s top division?',
      ar: 'ما هي الأندية الثلاثة التي لم تهبط إطلاقاً من دوري الدرجة الأولى الإسباني؟',
    },
    options: {
      en: ['Real Madrid, Barcelona, Athletic Bilbao', 'Real Madrid, Barcelona, Atletico Madrid', 'Barcelona, Valencia, Sevilla', 'Real Madrid, Atletico Madrid, Real Sociedad'],
      ar: ['ريال مدريد، برشلونة، أتلتيك بيلباو', 'ريال مدريد، برشلونة، أتلتيكو مدريد', 'برشلونة، فالنسيا، إشبيلية', 'ريال مدريد، أتلتيكو مدريد، ريال سوسيداد'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Real Madrid, Barcelona, and Athletic Bilbao have played every single season in the top flight.',
      ar: 'ريال مدريد وبرشلونة وأتلتيك بيلباو شاركوا في كل نسخ الدوري الإسباني دون أي هبوط.',
    },
  },
  {
    id: 'laliga_10',
    category: 'laliga',
    difficulty: 'easy',
    question: {
      en: 'What is the trophy awarded to the goalkeeper with the lowest goals-to-games ratio in La Liga?',
      ar: 'ما هي الجائزة الممنوحة لأفضل حارس مرمى صاحب أقل معدل أهداف في الدوري الإسباني؟',
    },
    options: {
      en: ['Zamora Trophy', 'Casillas Trophy', 'Yashin Trophy', 'Kepa Trophy'],
      ar: ['جائزة زامورا', 'جائزة كاسياس', 'جائزة ياشين', 'جائزة كيبا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Ricardo Zamora Trophy honors the best defensive goalkeeper record.',
      ar: 'جائزة ريكاردو زامورا تكرم أفضل حارس مرمى في الليغا.',
    },
  },
  {
    id: 'laliga_11',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Which club won their historic and only La Liga title in the 1999-2000 season?',
      ar: 'أي نادٍ توج بلقبه الوحيد والتاريخي في الدوري الإسباني بموسم 1999-2000؟',
    },
    options: {
      en: ['Deportivo La Coruña', 'Real Zaragoza', 'Celta Vigo', 'Real Betis'],
      ar: ['ديبورتيفو لاكورونيا', 'ريال سرقسطة', 'سلتا فيغو', 'ريال بيتيس'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Super Depor, led by Djalminha, Roy Makaay, and Mauro Silva, lifted the 2000 title.',
      ar: 'سوبر ديبور بقيادة ماكاي ودالمينيا وماورو سيلفا حصد لقب 2000 التاريخي.',
    },
  },
  {
    id: 'laliga_12',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Who holds the record for the most Pichichi trophies won in La Liga history (8 times)?',
      ar: 'من هو اللاعب الأكثر تتويجاً بجائزة هداف الليغا (البيتشيتشي) برصيد 8 مرات؟',
    },
    options: {
      en: ['Lionel Messi', 'Telmo Zarra', 'Alfredo Di Stéfano', 'Cristiano Ronaldo'],
      ar: ['ليونيل ميسي', 'تيلمو زارا', 'ألفريدو دي ستيفانو', 'كريستيانو رونالدو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lionel Messi won 8 Pichichi awards between 2010 and 2021, breaking Telmo Zarra’s record of 6.',
      ar: 'فاز ميسي بـ 8 جوائز بيتشيتشي متجاوزاً رقم تيلمو زارا التاريخي (6 مرات).',
    },
  },
  {
    id: 'laliga_13',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Which goalkeeper holds the record for the most clean sheets in a single La Liga season (26)?',
      ar: 'أي حارس مرمى يملك الرقم القياسي لأكبر عدد شباك نظيفة في موسم واحد بالليغا (26 مباراة)؟',
    },
    options: {
      en: ['Marc-André ter Stegen & Francisco Liaño', 'Jan Oblak', 'Iker Casillas', 'Thibaut Courtois'],
      ar: ['مارك أندريه تير شتيغن وفرانسيسكو ليانيو', 'يان أوبلاك', 'إيكر كاسياس', 'تيبو كورتوا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Ter Stegen matched Liaño’s legendary record by keeping 26 clean sheets for Barcelona in 2022-23.',
      ar: 'عادل تير شتيغن رقم ليانيو بحفاظه على نظافة شباكه في 26 مباراة بموسم 2022-2023.',
    },
  },
  {
    id: 'laliga_14',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'What is the intense city rivalry between Real Betis and Sevilla FC called?',
      ar: 'ماذا يسمى ديربي الأندلس المشتعل بين ريال بيتيس وإشبيلية؟',
    },
    options: {
      en: ['El Gran Derbi', 'Derbi del Turia', 'Derbi Vasco', 'Derbi de la Comunitat'],
      ar: ['الديربي الكبير (El Gran Derbi)', 'ديربي توريا', 'ديربي الباسك', 'ديربي فالنسيا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Seville derby is widely hailed as the most passionate city derby in Spain.',
      ar: 'ديربي إشبيلية يُعد أحد أكثر الديربيات سخونة وشغفاً في كرة القدم الإسبانية.',
    },
  },
  {
    id: 'laliga_15',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Who scored 50 goals in a single La Liga season in 2011-12, an all-time record?',
      ar: 'من سجل 50 هدفاً في موسم واحد بالدوري الإسباني (2011-2012) كرقم قياسي خارق؟',
    },
    options: {
      en: ['Lionel Messi', 'Cristiano Ronaldo', 'Luis Suárez', 'Radamel Falcao'],
      ar: ['ليونيل ميسي', 'كريستيانو رونالدو', 'لويس سواريز', 'راداميل فالكاو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lionel Messi netted half a century of league goals in just 37 matches.',
      ar: 'سجل ميسي 50 هدفاً في 37 مباراة فقط في موسم لن ينسى.',
    },
  },
  {
    id: 'laliga_16',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Which club is known by the nickname "Los Colchoneros" (The Mattress Makers)?',
      ar: 'أي نادٍ إسباني يشتهر بلقب "الكولتشونيروس" (صناع المراتب)؟',
    },
    options: {
      en: ['Atlético Madrid', 'Espanyol', 'Rayo Vallecano', 'Getafe'],
      ar: ['أتلتيكو مدريد', 'إسبانيول', 'رايو فايكانو', 'خيتافي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Atlético got the nickname because old mattress covers had red and white stripes.',
      ar: 'أطلق اللقب على أتلتيكو لأن أغطية المراتب قديماً كانت بخطوط حمراء وبيضاء.',
    },
  },
  {
    id: 'laliga_17',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Who was the manager of Barcelona’s famous "Dream Team" that won four straight La Liga titles from 1991 to 1994?',
      ar: 'من كان مدرب فريق الأحلام لبرشلونة الذي حصد 4 ألقاب ليغا متتالية بين 1991 و1994؟',
    },
    options: {
      en: ['Johan Cruyff', 'Louis van Gaal', 'Frank Rijkaard', 'Bobby Robson'],
      ar: ['يوهان كرويف', 'لويس فان غال', 'فرانك ريكارد', 'بوبي روبسون'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Johan Cruyff laid down the tactical philosophy that defined modern FC Barcelona.',
      ar: 'أرسى الأسطورة يوهان كرويف الفلسفة الكروية الشاملة لبرشلونة الحديث.',
    },
  },
  {
    id: 'laliga_18',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Which player holds the record for the most appearances in La Liga history (622 games)?',
      ar: 'من اللاعب الأكثر خوضاً للمباريات في تاريخ الليغا الإسبانية (622 مباراة)؟',
    },
    options: {
      en: ['Andoni Zubizarreta & Joaquín', 'Raúl González', 'Sergio Ramos', 'Iker Casillas'],
      ar: ['أندوني زوبيزاريتا وخواكين', 'راؤول غونزاليس', 'سيرخيو راموس', 'إيكر كاسياس'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Goalkeeper Andoni Zubizarreta and Real Betis winger Joaquín share the record at 622 appearances.',
      ar: 'يشترك الحارس زوبيزاريتا وأسطورة بيتيس خواكين في الصدارة بـ 622 مباراة.',
    },
  },
  {
    id: 'laliga_19',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Which club plays their home games at the Estadio de la Cerámica?',
      ar: 'أي نادٍ يخوض مبارياته على أرضية ملعب "لا سيراميكا"؟',
    },
    options: {
      en: ['Villarreal CF', 'Valencia CF', 'Levante UD', 'Elche CF'],
      ar: ['فياريال', 'فالنسيا', 'ليفانتي', 'إلتشي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Villarreal CF (The Yellow Submarine) plays at Estadio de la Cerámica (formerly El Madrigal).',
      ar: 'الغواصات الصفراء (فياريال) يخوضون مبارياتهم في لا سيراميكا (المادريغال سابقاً).',
    },
  },
  {
    id: 'laliga_20',
    category: 'laliga',
    difficulty: 'medium',
    question: {
      en: 'Which striker scored 40 league goals for Barcelona in 2015-16 to break the Messi-Ronaldo Pichichi monopoly?',
      ar: 'من المهاجم الذي كسر احتكار ميسي ورونالدو للبيتشيتشي بتسجيله 40 هدفاً عام 2016؟',
    },
    options: {
      en: ['Luis Suárez', 'Karim Benzema', 'Diego Costa', 'Antoine Griezmann'],
      ar: ['لويس سواريز', 'كريم بنزيما', 'دييغو كوستا', 'أنطوان غريزمان'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Luis Suárez won the European Golden Shoe with 40 goals for Barcelona that season.',
      ar: 'نال لويس سواريز الحذاء الذهبي بتسجيل 40 هدفاً مع البارسا في موسم استثنائي.',
    },
  },
  {
    id: 'laliga_21',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Which club won the inaugural Spanish La Liga championship back in 1929?',
      ar: 'ما هو النادي الذي فاز بأول نسخة في تاريخ الدوري الإسباني عام 1929؟',
    },
    options: {
      en: ['FC Barcelona', 'Real Madrid', 'Athletic Bilbao', 'Real Sociedad'],
      ar: ['برشلونة', 'ريال مدريد', 'أتلتيك بيلباو', 'ريال سوسيداد'],
    },
    correctIndex: 0,
    explanation: {
      en: 'FC Barcelona won the first ever La Liga title in 1929, finishing two points ahead of Real Madrid.',
      ar: 'فاز نادي برشلونة بأول نسخة للدوري عام 1929 متقدماً بنقطتين عن ريال مدريد.',
    },
  },
  {
    id: 'laliga_22',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Who is the youngest player ever to make an appearance in a La Liga match (at 15 years and 219 days)?',
      ar: 'من هو أصغر لاعب يشارك في مباراة بتاريخ الدوري الإسباني (بعمر 15 عاماً و219 يوماً)؟',
    },
    options: {
      en: ['Luka Romero', 'Lamine Yamal', 'Sansón', 'Martin Ødegaard'],
      ar: ['لوكا روميرو', 'لامين يامال', 'سانسون', 'مارتن أوديغارد'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Luka Romero made his debut for RCD Mallorca against Real Madrid in June 2020 at age 15.',
      ar: 'شارك لوكا روميرو مع مايوركا ضد ريال مدريد عام 2020 وهو في سن 15 عاماً.',
    },
  },
  {
    id: 'laliga_23',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Who holds the record for scoring 7 goals in a single La Liga match (achieved twice in history)?',
      ar: 'من صاحب الرقم القياسي بتسجيل 7 أهداف في مباراة واحدة بالليغا (حدثت مرتين فقط)؟',
    },
    options: {
      en: ['Agustín Sauto (Bata) & László Kubala', 'Telmo Zarra', 'Alfredo Di Stéfano', 'Cristiano Ronaldo'],
      ar: ['أغوستين ساوتو (باتا) ولاسلو كوبالا', 'تيلمو زارا', 'ألفريدو دي ستيفانو', 'كريستيانو رونالدو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Bata in 1931 for Athletic Bilbao and Kubala in 1952 for Barcelona each scored 7 in one game.',
      ar: 'سجل باتا مع بيلباو عام 1931 وكوبالا مع برشلونة عام 1952 سبعة أهداف في مباراة واحدة.',
    },
  },
  {
    id: 'laliga_24',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Which manager won back-to-back La Liga titles with Real Sociedad in 1981 and 1982?',
      ar: 'من المدرب الذي قاد ريال سوسيداد للقبين متتاليين في الدوري الإسباني عامي 1981 و1982؟',
    },
    options: {
      en: ['Alberto Ormaetxea', 'Javier Clemente', 'John Toshack', 'Luis Aragonés'],
      ar: ['ألبرتو أورمايتشيا', 'خافيير كليمنتي', 'جون توشاك', 'لويس أراغونيس'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Alberto Ormaetxea managed the finest era in Real Sociedad’s history.',
      ar: 'قاد ألبرتو أورمايتشيا الحقبة الأروع في تاريخ نادي ريال سوسيداد.',
    },
  },
  {
    id: 'laliga_25',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Which club had a famous "Quinta del Buitre" generation that won five consecutive league titles in the late 1980s?',
      ar: 'أي نادٍ اشتهر بجيل "خماسي النسر" (Quinta del Buitre) وتوج بخمسة ألقاب متتالية أواخر الثمانينات؟',
    },
    options: {
      en: ['Real Madrid', 'FC Barcelona', 'Valencia CF', 'Sevilla FC'],
      ar: ['ريال مدريد', 'برشلونة', 'فالنسيا', 'إشبيلية'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Led by Emilio Butragueño, Real Madrid won 5 straight league titles from 1986 to 1990.',
      ar: 'بقيادة إيميليو بوتراغينيو حصد ريال مدريد 5 ألقاب دوري متتالية بين 1986 و1990.',
    },
  },
  {
    id: 'laliga_26',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'What was the lowest points total ever needed to win a 20-team La Liga season (awarding 3 points for a win)?',
      ar: 'ما هو أقل رصيد نقاط كفى للتتويج بالدوري الإسباني في نظام الـ 20 فريقاً (3 نقاط للفوز)؟',
    },
    options: {
      en: ['69 points (Deportivo 1999-2000)', '74 points (Valencia 2001-02)', '71 points (Real Madrid 2006-07)', '77 points (Barcelona 1997-98)'],
      ar: ['69 نقطة (ديبورتيفو 1999-2000)', '74 نقطة (فالنسيا 2001-02)', '71 نقطة (ريال مدريد 2006-07)', '77 نقطة (برشلونة 1997-98)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Deportivo La Coruña won the 1999-2000 title with just 69 points in an open, unpredictable season.',
      ar: 'توج ديبورتيفو لاكورونيا بلقب 2000 بـ 69 نقطة فقط في موسم استثنائي.',
    },
  },
  {
    id: 'laliga_27',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Who holds the record for the most red cards in La Liga history (20 dismissals)?',
      ar: 'من هو اللاعب الأكثر حصولاً على البطاقات الحمراء في تاريخ الليغا (20 بطاقة)؟',
    },
    options: {
      en: ['Sergio Ramos', 'Pablo Alfaro', 'Xavi Aguado', 'Fernando Hierro'],
      ar: ['سيرخيو راموس', 'بابلو ألفارو', 'تشافي أغوادو', 'فيرناندو هييرو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Sergio Ramos was sent off 20 times in his storied La Liga career with Sevilla and Real Madrid.',
      ar: 'طُرد سيرخيو راموس 20 مرة خلال مسيرته في الدوري الإسباني.',
    },
  },
  {
    id: 'laliga_28',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Which foreign player has made the most appearances for Real Madrid in La Liga?',
      ar: 'من هو اللاعب الأجنبي الأكثر خوضاً للمباريات مع ريال مدريد في الدوري الإسباني؟',
    },
    options: {
      en: ['Karim Benzema', 'Roberto Carlos', 'Marcelo', 'Luka Modrić'],
      ar: ['كريم بنزيما', 'روبرتو كارلوس', 'مارسيلو', 'لوكا مودريتش'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Karim Benzema surpassed Roberto Carlos to become the foreign player with the most appearances (439 games).',
      ar: 'تجاوز كريم بنزيما رقم روبرتو كارلوس ليصبح الأجنبي الأكثر ظهوراً بـ 439 مباراة.',
    },
  },
  {
    id: 'laliga_29',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'In 2003-04, which player won the Pichichi Trophy playing for Real Madrid with 24 goals?',
      ar: 'في موسم 2003-2004، من هو النجم الذي توج بجائزة البيتشيتشي مع ريال مدريد بـ 24 هدفاً؟',
    },
    options: {
      en: ['Ronaldo Nazário (The Phenomenon)', 'Raúl González', 'Zinedine Zidane', 'Michael Owen'],
      ar: ['رونالدو نازاريو (الظاهرة)', 'راؤول غونزاليس', 'زين الدين زيدان', 'مايكل أوين'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Brazilian Phenomenon Ronaldo scored 24 goals to take the Pichichi crown in 2004.',
      ar: 'تألق الظاهرة رونالدو وسجل 24 هدفاً ليحصد لقب الهداف في 2004.',
    },
  },
  {
    id: 'laliga_30',
    category: 'laliga',
    difficulty: 'hard',
    question: {
      en: 'Which Canary Islands club spent over 30 seasons in Spain’s top flight and reached the Copa del Rey final in 1978?',
      ar: 'أي نادٍ من جزر الكناري خاض أكثر من 30 موسماً في الليغا ووصل لنهائي كأس ملك إسبانيا 1978؟',
    },
    options: {
      en: ['UD Las Palmas', 'CD Tenerife', 'Vecindario', 'Fuerteventura'],
      ar: ['لاس بالماس', 'تينيريفي', 'فيسينداليو', 'فويرتيفنتورا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'UD Las Palmas is the historical representative of Gran Canaria in Spanish football.',
      ar: 'يُعد نادي لاس بالماس الممثل التاريخي الأبرز لجزر الكناري في الليغا.',
    },
  },

  // ==========================================
  // PREMIER LEAGUE
  // ==========================================
  {
    id: 'pl_01',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'Who is the all-time record goalscorer in Premier League history with 260 goals?',
      ar: 'من هو الهداف التاريخي للدوري الإنجليزي الممتاز برصيد 260 هدفاً؟',
    },
    options: {
      en: ['Alan Shearer', 'Wayne Rooney', 'Harry Kane', 'Sergio Agüero'],
      ar: ['آلان شيرر', 'واين روني', 'هاري كين', 'سيرخيو أغويرو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Alan Shearer holds the record with 260 goals for Blackburn Rovers and Newcastle United.',
      ar: 'يتصدر آلان شيرر برصيد 260 هدفاً مع بلاكبرن ونيوكاسل يونايتد.',
    },
  },
  {
    id: 'pl_02',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'Which club pulled off the 5,000-to-1 fairy tale by winning the Premier League title in 2015-16?',
      ar: 'أي نادٍ حقق المعجزة الكروية ونال لقب الدوري الإنجليزي الممتاز عام 2016 بنسبة 5000 إلى 1؟',
    },
    options: {
      en: ['Leicester City', 'Southampton', 'West Ham United', 'Everton'],
      ar: ['ليستر سيتي', 'ساوثهامبتون', 'وست هام يونايتد', 'إيفرتون'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Claudio Ranieri’s Leicester City shocked the sports world to lift the trophy.',
      ar: 'فجر ليستر سيتي بقيادة كلاوديو رانييري واحدة من أعظم مفاجآت التاريخ الرياضي.',
    },
  },
  {
    id: 'pl_03',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'Which club completed the only unbeaten "Invincibles" season in modern Premier League history (2003-04)?',
      ar: 'من هو النادي الوحيد الذي أنهى موسماً كاملاً دون أي هزيمة "اللاهزيمة" في 2003-2004؟',
    },
    options: {
      en: ['Arsenal', 'Manchester United', 'Chelsea', 'Liverpool'],
      ar: ['آرسنال', 'مانشستر يونايتد', 'تشيلسي', 'ليفربول'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Arsène Wenger’s Arsenal went 38 games unbeaten (26 wins, 12 draws).',
      ar: 'خاض آرسنال بقيادة فينغر 38 مباراة دون خسارة (26 فوزاً و12 تعادلاً).',
    },
  },
  {
    id: 'pl_04',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'Which legendary manager won 13 Premier League titles with Manchester United?',
      ar: 'من هو المدرب الأسطوري الذي قاد مانشستر يونايتد للتتويج بـ 13 لقباً في البريميرليغ؟',
    },
    options: {
      en: ['Sir Alex Ferguson', 'Matt Busby', 'José Mourinho', 'Arsène Wenger'],
      ar: ['السير أليكس فيرغسون', 'مات بازبي', 'جوزيه مورينيو', 'أرسين فينغر'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Sir Alex Ferguson managed United from 1986 to 2013, winning 13 Premier League titles.',
      ar: 'قاد السير أليكس فيرغسون الشياطين الحمر لتحقيق 13 لقباً بين 1993 و2013.',
    },
  },
  {
    id: 'pl_05',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'Who scored the dramatic 93:20 stoppage-time goal in 2012 to win Manchester City their first Premier League title?',
      ar: 'من صاحب الهدف الخالد في الدقيقة 93:20 الذي منح مانشستر سيتي لقبه الأول عام 2012؟',
    },
    options: {
      en: ['Sergio Agüero', 'Edin Džeko', 'Mario Balotelli', 'David Silva'],
      ar: ['سيرخيو أغويرو', 'إدين دجيكو', 'ماريو بالوتيلي', 'دافيد سيلفا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Agüero’s winner against QPR on the final day is immortalized in football lore.',
      ar: 'هدف أغويرو أمام كوينز بارك رينجرز في الثواني الأخيرة يظل من أكثر اللحظات إثارة.',
    },
  },
  {
    id: 'pl_06',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'Which striker scored 36 goals in a single season (2022-23) to break the Premier League record?',
      ar: 'من المهاجم الذي حطم الرقم القياسي وسجل 36 هدفاً في موسم واحد بالبريميرليغ (2022-2023)؟',
    },
    options: {
      en: ['Erling Haaland', 'Mohamed Salah', 'Harry Kane', 'Robin van Persie'],
      ar: ['إرلينغ هالاند', 'محمد صلاح', 'هاري كين', 'روبن فان بيرسي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Erling Haaland broke the record in his debut season with Manchester City.',
      ar: 'حطم هالاند الرقم القياسي في أول مواسمه بقميص مانشستر سيتي.',
    },
  },
  {
    id: 'pl_07',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'Which club won their first top-flight English title in 30 years in 2019-20 under Jürgen Klopp?',
      ar: 'أي نادٍ فاز بلقب الدوري الإنجليزي بعد غياب 30 عاماً في موسم 2019-2020 مع يورغن كلوب؟',
    },
    options: {
      en: ['Liverpool', 'Leeds United', 'Aston Villa', 'Tottenham Hotspur'],
      ar: ['ليفربول', 'ليدز يونايتد', 'أستون فيلا', 'توتنهام هوتسبير'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Liverpool won the league with 99 points, ending a 30-year drought.',
      ar: 'حقق ليفربول اللقب برصيد 99 نقطة بعد انتظار دام 30 عاماً.',
    },
  },
  {
    id: 'pl_08',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'What is the home stadium of Liverpool FC known for the anthem "You’ll Never Walk Alone"?',
      ar: 'ما هو معقل نادي ليفربول الشهير بنشيد "لن تسير وحدك أبداً"؟',
    },
    options: {
      en: ['Anfield', 'Goodison Park', 'Old Trafford', 'St James’ Park'],
      ar: ['أنفيلد', 'غوديسون بارك', 'أولد ترافورد', 'سانت جيمس بارك'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Anfield is one of football’s most atmospheric football grounds in the world.',
      ar: 'ملعب أنفيلد هو المعقل التاريخي لليفربول وإحدى أكثر قلاع الكرة هيبة.',
    },
  },
  {
    id: 'pl_09',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'Who holds the record for the most assists in Premier League history (162 assists)?',
      ar: 'من هو صانع الألعاب الأكثر تقديماً للتمريرات الحاسمة في تاريخ البريميرليغ (162 أسيست)؟',
    },
    options: {
      en: ['Ryan Giggs', 'Cesc Fàbregas', 'Kevin De Bruyne', 'Wayne Rooney'],
      ar: ['ريان غيغز', 'سيسك فابريغاس', 'كيفين دي بروين', 'واين روني'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Manchester United legend Ryan Giggs provided 162 Premier League assists.',
      ar: 'أسطورة يونايتد ريان غيغز صنع 162 هدفاً خلال مسيرته الطويلة.',
    },
  },
  {
    id: 'pl_10',
    category: 'premier_league',
    difficulty: 'easy',
    question: {
      en: 'What color is the home kit traditionally worn by Chelsea FC?',
      ar: 'ما هو اللون التقليدي لقميص نادي تشيلسي الأساسي على أرضه؟',
    },
    options: {
      en: ['Blue', 'Red', 'White', 'Yellow'],
      ar: ['الأزرق', 'الأحمر', 'الأبيض', 'الأصفر'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Chelsea has worn royal blue since 1912 and are famously nicknamed "The Blues".',
      ar: 'يرتدي تشيلسي القميص الأزرق الملكي ويُلقب بـ "البلوز".',
    },
  },
  {
    id: 'pl_11',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Which team conceded just 15 goals in an entire 38-game Premier League season (2004-05)?',
      ar: 'أي فريق استقبلت شباكه 15 هدفاً فقط طوال موسم كامل (38 مباراة) في 2004-2005؟',
    },
    options: {
      en: ['Chelsea', 'Arsenal', 'Manchester United', 'Liverpool'],
      ar: ['تشيلسي', 'آرسنال', 'مانشستر يونايتد', 'ليفربول'],
    },
    correctIndex: 0,
    explanation: {
      en: 'José Mourinho’s Chelsea set an almost unbreakable defensive record with Petr Čech and John Terry.',
      ar: 'حقق تشيلسي بقيادة مورينيو وبيتر تشيك وجون تيري الرقم القياسي الدفاعي التاريخي.',
    },
  },
  {
    id: 'pl_12',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Who scored the fastest hat-trick in Premier League history (2 minutes and 56 seconds)?',
      ar: 'من صاحب أسرع هاتريك في تاريخ الدوري الإنجليزي الممتاز (دقيقتان و56 ثانية)؟',
    },
    options: {
      en: ['Sadio Mané', 'Robbie Fowler', 'Sergio Agüero', 'Jermain Defoe'],
      ar: ['ساديو ماني', 'روبي فاولر', 'سيرخيو أغويرو', 'جيرمين ديفو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Sadio Mané scored three goals in 176 seconds for Southampton against Aston Villa in 2015.',
      ar: 'سجل ساديو ماني ثلاثيته في 176 ثانية فقط مع ساوثهامبتون أمام أستون فيلا في 2015.',
    },
  },
  {
    id: 'pl_13',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Who became the first team in Premier League history to reach 100 points in a single season (2017-18)?',
      ar: 'من هو أول فريق في تاريخ البريميرليغ يصل إلى 100 نقطة في موسم واحد (2017-2018)؟',
    },
    options: {
      en: ['Manchester City', 'Liverpool', 'Chelsea', 'Arsenal'],
      ar: ['مانشستر سيتي', 'ليفربول', 'تشيلسي', 'آرسنال'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Pep Guardiola’s Manchester City earned the nickname "The Centurions" with Gabriel Jesus’ late goal on matchday 38.',
      ar: 'نال مانشستر سيتي لقب "المئويون" بعد تسجيل 100 نقطة بهدف خيسوس القاتل في الجولة الأخيرة.',
    },
  },
  {
    id: 'pl_14',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Which goalkeeper has kept the most clean sheets in Premier League history (202 clean sheets)?',
      ar: 'من هو الحارس صاحب أكبر عدد شباك نظيفة (كلين شيت) في تاريخ البريميرليغ (202 مباراة)؟',
    },
    options: {
      en: ['Petr Čech', 'David James', 'Mark Schwarzer', 'David Seaman'],
      ar: ['بيتر تشيك', 'ديفيد جيمس', 'مارك شوارزر', 'ديفيد سيمان'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Petr Čech kept 202 clean sheets playing for Chelsea and Arsenal.',
      ar: 'حافظ بيتر تشيك على نظافة شباكه في 202 مباراة بقميصي تشيلسي وآرسنال.',
    },
  },
  {
    id: 'pl_15',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Who holds the record for scoring in 11 consecutive Premier League matches in 2015?',
      ar: 'من اللاعب الذي سجل في 11 مباراة متتالية بالدوري الإنجليزي الممتاز عام 2015؟',
    },
    options: {
      en: ['Jamie Vardy', 'Ruud van Nistelrooy', 'Thierry Henry', 'Daniel Sturridge'],
      ar: ['جيمي فاردى', 'رود فان نيستلروي', 'تييري هنري', 'دانييل ستوريدج'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Jamie Vardy broke Ruud van Nistelrooy’s record during Leicester’s title run.',
      ar: 'حطم جيمي فاردي رقم فان نيستلروي بالتسجيل في 11 مباراة متتالية.',
    },
  },
  {
    id: 'pl_16',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Which player has scored the most Premier League free kicks of all time (18)?',
      ar: 'من هو اللاعب الأكثر تسجيلاً للأهداف من ركلات حرة مباشرة في تاريخ البريميرليغ (18 هدفاً)؟',
    },
    options: {
      en: ['David Beckham', 'James Ward-Prowse', 'Cristiano Ronaldo', 'Gianfranco Zola'],
      ar: ['ديفيد بيكهام', 'جيمس وارد براوس', 'كريستيانو رونالدو', 'جيانفرانكو زولا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'David Beckham curled home 18 free kicks for Manchester United.',
      ar: 'سجل ديفيد بيكهام 18 هدفاً رائعاً من كرات ثابتة لمانشستر يونايتد.',
    },
  },
  {
    id: 'pl_17',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'What is the intense derby between Arsenal and Tottenham Hotspur officially called?',
      ar: 'ماذا يسمى الديربي اللندني الناري بين آرسنال وتوتنهام هوتسبير؟',
    },
    options: {
      en: ['North London Derby', 'West London Derby', 'Merseyside Derby', 'Steel City Derby'],
      ar: ['ديربي شمال لندن', 'ديربي غرب لندن', 'ديربي الميرسيسايد', 'ديربي شيفيلد'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The North London derby is one of the most passionate and historic derbies in English football.',
      ar: 'ديربي شمال لندن هو أحد أعرق وأشرس الديربيات في الكرة الإنجليزية.',
    },
  },
  {
    id: 'pl_18',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Which player won the Premier League Golden Boot three consecutive times from 2004 to 2006?',
      ar: 'من فاز بالحذاء الذهبي للبريميرليغ ثلاث مرات متتالية بين 2004 و2006؟',
    },
    options: {
      en: ['Thierry Henry', 'Ruud van Nistelrooy', 'Didier Drogba', 'Michael Owen'],
      ar: ['تييري هنري', 'رود فان نيستلروي', 'ديدييه دروغبا', 'مايكل أوين'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Thierry Henry won 4 Golden Boots overall, including three on the bounce for Arsenal.',
      ar: 'توج تييري هنري بالحذاء الذهبي 4 مرات في مسيرته منها 3 متتالية مع آرسنال.',
    },
  },
  {
    id: 'pl_19',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Which club holds the record for the lowest points tally in a single Premier League season (11 points)?',
      ar: 'أي نادٍ يملك الرقم القياسي لأقل عدد نقاط في موسم واحد بالبريميرليغ (11 نقطة فقط)؟',
    },
    options: {
      en: ['Derby County (2007-08)', 'Sunderland (2005-06)', 'Huddersfield (2018-19)', 'Sheffield United (2020-21)'],
      ar: ['ديربي كاونتي (2007-2008)', 'سندرلاند (2005-2006)', 'هدرسفيلد (2018-2019)', 'شيفيلد يونايتد (2020-2021)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Derby County managed just 1 win all season in 2007-08, finishing with 11 points.',
      ar: 'حقق ديربي كاونتي فوزاً واحداً فقط طوال الموسم لينهيه برصيد 11 نقطة.',
    },
  },
  {
    id: 'pl_20',
    category: 'premier_league',
    difficulty: 'medium',
    question: {
      en: 'Who is the highest-scoring African player in Premier League history?',
      ar: 'من هو الهداف الإفريقي التاريخي في الدوري الإنجليزي الممتاز؟',
    },
    options: {
      en: ['Mohamed Salah', 'Didier Drogba', 'Sadio Mané', 'Emmanuel Adebayor'],
      ar: ['محمد صلاح', 'ديدييه دروغبا', 'ساديو ماني', 'إيمانويل أديبايور'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Mohamed Salah surpassed Didier Drogba’s 104-goal record to become the top African marksman.',
      ar: 'تجاوز النجم المصري محمد صلاح رقم دروغبا ليتربع على عرش الهدافين الأفارقة في إنجلترا.',
    },
  },
  {
    id: 'pl_21',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Who scored the first-ever goal in Premier League history on August 15, 1992?',
      ar: 'من صاحب أول هدف في تاريخ الدوري الإنجليزي الممتاز يوم 15 أغسطس 1992؟',
    },
    options: {
      en: ['Brian Deane', 'Teddy Sheringham', 'Mark Hughes', 'Les Ferdinand'],
      ar: ['برايان دين', 'تيدي شيرينغهام', 'مارك هيوز', 'ليس فيرديناند'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Brian Deane scored for Sheffield United against Manchester United after 5 minutes.',
      ar: 'سجل برايان دين لشيفيلد يونايتد في شباك مانشستر يونايتد بعد 5 دقائق من انطلاق المسابقة.',
    },
  },
  {
    id: 'pl_22',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Who holds the record for the most appearances in Premier League history (653 matches)?',
      ar: 'من اللاعب الأكثر خوضاً للمباريات في تاريخ البريميرليغ (653 مباراة)؟',
    },
    options: {
      en: ['Gareth Barry', 'Ryan Giggs', 'Frank Lampard', 'James Milner'],
      ar: ['غاريث باري', 'ريان غيغز', 'فرانك لامبارد', 'جيمس ميلنر'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Gareth Barry played 653 games across Aston Villa, Man City, Everton, and West Brom.',
      ar: 'خاض غاريث باري 653 مباراة في مسيرة ملحمية استمرت أكثر من عقدين.',
    },
  },
  {
    id: 'pl_23',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Which player scored 5 goals in just 9 minutes for Manchester City against Newcastle in 2015?',
      ar: 'من اللاعب الذي أحرز 5 أهداف خلال 20 دقيقة فقط لمانشستر سيتي ضد نيوكاسل عام 2015؟',
    },
    options: {
      en: ['Sergio Agüero', 'Raheem Sterling', 'Kevin De Bruyne', 'Carlos Tevez'],
      ar: ['سيرخيو أغويرو', 'رحيم ستيرلينغ', 'كيفين دي بروين', 'كارلوس تيفيز'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Agüero tore Newcastle apart, scoring five between the 42nd and 62nd minutes.',
      ar: 'مزق أغويرو شباك نيوكاسل بخمسة أهداف سريعة بين الدقيقتين 42 و62.',
    },
  },
  {
    id: 'pl_24',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Only two players have won the Premier League with two different clubs as captain. Who are they?',
      ar: 'لاعبان فقط توجا بالبريميرليغ كقادة مع ناديين مختلفين، من هما؟',
    },
    options: {
      en: ['Henning Berg & Ashley Cole', 'James Milner & Kolo Touré', 'Nicolas Anelka & Gael Clichy', 'Petr Čech & Carlos Tevez'],
      ar: ['هينينغ بيرغ وأشلي كول (لاعبون توجوا مع ناديين)', 'جيمس ميلنر وكولو توريه', 'نيكولا أنيلكا وغيل كليشي', 'بيتر تشيك وكارلوس تيفيز'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Several players won with two clubs, with Henning Berg being the very first (Blackburn 1995 & Man Utd 1999).',
      ar: 'هينينغ بيرغ كان أول من توج مع ناديين مختلفين (بلاكبرن 1995 ومانشستر يونايتد 1999).',
    },
  },
  {
    id: 'pl_25',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Which player holds the record for scoring the most penalties in Premier League history (56)?',
      ar: 'من هو اللاعب الأكثر تسجيلاً لركلات الجزاء في تاريخ البريميرليغ (56 ركلة جزاء)؟',
    },
    options: {
      en: ['Alan Shearer', 'Frank Lampard', 'Harry Kane', 'Steven Gerrard'],
      ar: ['آلان شيرر', 'فرانك لامبارد', 'هاري كين', 'ستيفن جيرارد'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Alan Shearer dispatched 56 penalties, followed by Frank Lampard with 43.',
      ar: 'سجل آلان شيرر 56 ركلة جزاء ويليه فرانك لامبارد بـ 43 ركلة.',
    },
  },
  {
    id: 'pl_26',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Which referee has issued the most red cards in Premier League history (99 dismissals)?',
      ar: 'أي حكم أشهر أكبر عدد من البطاقات الحمراء في تاريخ الدوري الإنجليزي الممتاز (99 طرداً)؟',
    },
    options: {
      en: ['Mike Dean', 'Phil Dowd', 'Martin Atkinson', 'Howard Webb'],
      ar: ['مايك دين', 'فيل داود', 'مارتن أتكينسون', 'هوارد ويب'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Mike Dean famously handed out 99 red cards before retiring from on-pitch officiating.',
      ar: 'أشهر الحكم المثير للجدل مايك دين 99 بطاقة حمراء خلال مسيرته التحكيمية.',
    },
  },
  {
    id: 'pl_27',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Who holds the record for the most own goals scored in Premier League history (10)?',
      ar: 'من صاحب الرقم القياسي لأكبر عدد أهداف عكسية في مرماه بالبريميرليغ (10 أهداف)؟',
    },
    options: {
      en: ['Richard Dunne', 'Jamie Carragher', 'Martin Škrtel', 'Phil Jagielka'],
      ar: ['ريتشارد دان', 'جيمي كاراغر', 'مارتن سكرتل', 'فيل جاغيلكا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Richard Dunne scored 10 own goals (along with receiving 8 red cards).',
      ar: 'سجل المدافع ريتشارد دان 10 أهداف بالخطأ في مرماه ونال 8 بطاقات حمراء.',
    },
  },
  {
    id: 'pl_28',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'What was the highest-scoring single match in Premier League history (11 goals)?',
      ar: 'ما هي المباراة التي شهدت أكبر عدد أهداف في تاريخ البريميرليغ (11 هدفاً)؟',
    },
    options: {
      en: ['Portsmouth 7 - 4 Reading (2007)', 'Tottenham 9 - 1 Wigan (2009)', 'Man Utd 8 - 2 Arsenal (2011)', 'Man City 6 - 3 Arsenal (2013)'],
      ar: ['بورتسموث 7 - 4 ريدينغ (2007)', 'توتنهام 9 - 1 ويغان (2009)', 'مانشستر يونايتد 8 - 2 آرسنال (2011)', 'مانشستر سيتي 6 - 3 آرسنال (2013)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Portsmouth beat Reading 7-4 at Fratton Park in September 2007.',
      ar: 'فاز بورتسموث على ريدينغ 7-4 في سبتمبر 2007 في مباراة مجنونة بـ 11 هدفاً.',
    },
  },
  {
    id: 'pl_29',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Who scored on his debut, 100th, 200th, and 300th Premier League appearances?',
      ar: 'من سجل في مباراته الأولى، والـ 100، والـ 200، والـ 300 في الدوري الإنجليزي؟',
    },
    options: {
      en: ['Wayne Rooney', 'Alan Shearer', 'Frank Lampard', 'Paul Scholes'],
      ar: ['واين روني', 'آلان شيرر', 'فرانك لامبارد', 'بول سكولز'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Wayne Rooney celebrated every one of those milestone century matches with a goal.',
      ar: 'احتفل واين روني بكل مباراة مئوية له في الدوري بتسجيل هدف رائع.',
    },
  },
  {
    id: 'pl_30',
    category: 'premier_league',
    difficulty: 'hard',
    question: {
      en: 'Which player provided 20 assists in a single Premier League season (held by two players)?',
      ar: 'من يملك الرقم القياسي لتقديم 20 تمريرة حاسمة في موسم واحد بالبريميرليغ؟',
    },
    options: {
      en: ['Thierry Henry & Kevin De Bruyne', 'Cesc Fàbregas & Mesut Özil', 'Ryan Giggs & David Silva', 'Frank Lampard & Trent Alexander-Arnold'],
      ar: ['تييري هنري وكيفين دي بروين', 'سيسك فابريغاس ومسعود أوزيل', 'ريان غيغز ودافيد سيلفا', 'فرانك لامبارد وترينت ألكسندر أرنولد'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Thierry Henry (2002-03) and Kevin De Bruyne (2019-20) both registered 20 assists.',
      ar: 'سجل كل من هنري (2003) ودي بروين (2020) عشرين تمريرة حاسمة في موسم واحد.',
    },
  },

  // ==========================================
  // SERIE A
  // ==========================================
  {
    id: 'seriea_01',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Which club has won the most Serie A "Scudetto" titles in Italian football history?',
      ar: 'ما هو النادي الأكثر فوزاً بلقب الدوري الإيطالي (السكوديتو) عبر التاريخ؟',
    },
    options: {
      en: ['Juventus (36 titles)', 'Inter Milan (20 titles)', 'AC Milan (19 titles)', 'AS Roma (3 titles)'],
      ar: ['يوفنتوس (36 لقباً)', 'إنتر ميلان (20 لقباً)', 'إيه سي ميلان (19 لقباً)', 'روما (3 ألقاب)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Juventus has won 36 official Serie A titles, more than any other Italian club.',
      ar: 'يتصدر يوفنتوس السجل الذهبي للدوري الإيطالي بـ 36 لقباً رسمياً.',
    },
  },
  {
    id: 'seriea_02',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Which Argentine icon led Napoli to their first-ever historic Serie A titles in 1987 and 1990?',
      ar: 'من الأسطورة الأرجنتيني الذي قاد نابولي لأول لقبين في تاريخه عامي 1987 و1990؟',
    },
    options: {
      en: ['Diego Maradona', 'Gabriel Batistuta', 'Hernán Crespo', 'Javier Zanetti'],
      ar: ['دييغو أرماندو مارادونا', 'غابرييل باتيستوتا', 'هيرنان كريسبو', 'خافيير زانيتي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Diego Maradona transformed Napoli into champions and remains a deity in Naples.',
      ar: 'صنع مارادونا التاريخ مع نابولي ووضع الجنوب الإيطالي على قمة الكرة الإيطالية.',
    },
  },
  {
    id: 'seriea_03',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'What is the famous derby match between AC Milan and Inter Milan called?',
      ar: 'ماذا يسمى ديربي ميلانو الشهير بين إيه سي ميلان وإنتر ميلان؟',
    },
    options: {
      en: ['Derby della Madonnina', 'Derby d’Italia', 'Derby della Capitale', 'Derby della Mole'],
      ar: ['ديربي ديلا مادونينا', 'ديربي إيطاليا', 'ديربي العاصمة', 'ديربي ديلا مولي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Derby della Madonnina is named after the Virgin Mary statue atop Milan Cathedral.',
      ar: 'سُمي ديربي ديلا مادونينا تيمناً بتمثال السيدة مريم أعلى كاتدرائية ميلانو.',
    },
  },
  {
    id: 'seriea_04',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Which Italian defender spent his entire 25-season career at AC Milan, winning 7 Serie A titles?',
      ar: 'أي مدافع أسطوري قضى مسيرته كاملة (25 موسماً) في ميلان وحصد 7 ألقاب سكوديتو؟',
    },
    options: {
      en: ['Paolo Maldini', 'Franco Baresi', 'Alessandro Costacurta', 'Alessandro Nesta'],
      ar: ['باولو مالديني', 'فرانكو باريزي', 'أليساندرو كوستاكورتا', 'أليساندرو نيستا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Paolo Maldini is one of the greatest defenders in football history.',
      ar: 'باولو مالديني يُعد رمز الوفاء وأحد أعظم المدافعين في تاريخ كرة القدم.',
    },
  },
  {
    id: 'seriea_05',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Which club won the historic continental Treble in 2010 under Jose Mourinho?',
      ar: 'أي نادٍ إيطالي حقق الثلاثية التاريخية (الدوري والكأس والأبطال) عام 2010 مع مورينيو؟',
    },
    options: {
      en: ['Inter Milan', 'Juventus', 'AC Milan', 'AS Roma'],
      ar: ['إنتر ميلان', 'يوفنتوس', 'إيه سي ميلان', 'روما'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Inter Milan became the first and only Italian club to win the treble in 2010.',
      ar: 'إنتر ميلان هو النادي الإيطالي الوحيد الذي توج بالثلاثية التاريخية في 2010.',
    },
  },
  {
    id: 'seriea_06',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Who is the iconic Italian playmaker nicknamed "Il Capitano" who spent his whole career at AS Roma?',
      ar: 'من هو صانع الألعاب الإيطالي الملقب بـ "إل كابيتانو" وكرس كامل مسيرته لنادي روما؟',
    },
    options: {
      en: ['Francesco Totti', 'Daniele De Rossi', 'Andrea Pirlo', 'Roberto Baggio'],
      ar: ['فرانشيسكو توتي', 'دانييلي دي روسي', 'أندريا بيرلو', 'روبرتو باجيو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Francesco Totti played 786 matches for AS Roma and scored 307 goals.',
      ar: 'خاض توتي 786 مباراة بقميص روما وسجل 307 أهداف كقائد تاريخي للذئاب.',
    },
  },
  {
    id: 'seriea_07',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Which club is known as "The Old Lady" (La Vecchia Signora)?',
      ar: 'ما هو النادي الإيطالي الشهير بلقب "السيدة العجوز" (La Vecchia Signora)؟',
    },
    options: {
      en: ['Juventus', 'Fiorentina', 'Lazio', 'Torino'],
      ar: ['يوفنتوس', 'فيورنتينا', 'لاتسيو', 'تورينو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Juventus earned the affectionate moniker "The Old Lady" in the 1930s.',
      ar: 'يُعرف يوفنتوس بلقب "السيدة العجوز" وهو أقدم وأعرق أندية تورينو.',
    },
  },
  {
    id: 'seriea_08',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'What iconic stadium in Milan is called San Siro by AC Milan fans and Giuseppe Meazza by Inter fans?',
      ar: 'ما هو الملعب الشهير الذي يسميه مشجعو ميلان "سان سيرو" ومشجعو إنتر "جوزيبي مياتزا"؟',
    },
    options: {
      en: ['Stadio San Siro / Giuseppe Meazza', 'Stadio Olimpico', 'Allianz Stadium', 'Stadio Luigi Ferraris'],
      ar: ['ملعب سان سيرو / جوزيبي مياتزا', 'الملعب الأولمبي', 'أليانز ستاديوم', 'ملعب لويجي فيراريس'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Both Milan giants share this grand cathedral of football.',
      ar: 'يتقاسم عملاقا مدينة ميلانو هذا الصرح الكروي الأسطوري.',
    },
  },
  {
    id: 'seriea_09',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Which club won 9 consecutive Serie A titles between 2012 and 2020?',
      ar: 'أي نادٍ فاز بـ 9 ألقاب دوري إيطالي متتالية بين عامي 2012 و2020؟',
    },
    options: {
      en: ['Juventus', 'Inter Milan', 'Napoli', 'AC Milan'],
      ar: ['يوفنتوس', 'إنتر ميلان', 'نابولي', 'إيه سي ميلان'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Juventus established unprecedented dominance across almost a decade in Italy.',
      ar: 'سيطر يوفنتوس بالطول والعرض وتوج بـ 9 ألقاب سكوديتو متتالية.',
    },
  },
  {
    id: 'seriea_10',
    category: 'serie_a',
    difficulty: 'easy',
    question: {
      en: 'Who is the all-time record goalscorer in Serie A history with 274 goals?',
      ar: 'من هو الهداف التاريخي للدوري الإيطالي برصيد 274 هدفاً؟',
    },
    options: {
      en: ['Silvio Piola', 'Francesco Totti', 'Gunnar Nordahl', 'Giuseppe Meazza'],
      ar: ['سيلفيو بيولا', 'فرانشيسكو توتي', 'غونار نوردال', 'جوزيبي مياتزا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Silvio Piola scored 274 goals between 1929 and 1954 for Pro Vercelli, Lazio, Juventus, and Novara.',
      ar: 'سيلفيو بيولا هو الهداف التاريخي للكرة الإيطالية بـ 274 هدفاً.',
    },
  },
  {
    id: 'seriea_11',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Who holds the record for the most appearances in Serie A history (657 matches)?',
      ar: 'من هو اللاعب الأكثر خوضاً للمباريات في تاريخ السيريا آ (657 مباراة)؟',
    },
    options: {
      en: ['Gianluigi Buffon', 'Paolo Maldini', 'Francesco Totti', 'Javier Zanetti'],
      ar: ['جانلويجي بوفون', 'باولو مالديني', 'فرانشيسكو توتي', 'خافيير زانيتي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Gianluigi Buffon played 657 Serie A matches for Parma and Juventus.',
      ar: 'خاض الحارس الأسطوري بوفون 657 مباراة في السيريا آ متفوقاً على مالديني.',
    },
  },
  {
    id: 'seriea_12',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Which striker scored 36 goals in a single Serie A season (tied record by Higuaín and Immobile)?',
      ar: 'من يتقاسم الرقم القياسي لأكثر أهداف في موسم واحد بالسيريا آ (36 هدفاً)؟',
    },
    options: {
      en: ['Gonzalo Higuaín & Ciro Immobile', 'Cristiano Ronaldo & Zlatan', 'Luca Toni & Shevchenko', 'Batistuta & Trezeguet'],
      ar: ['غونزالو هيغواين وتشيرو إيموبيلي', 'كريستيانو رونالدو وزلاتان', 'لوكا توني وتشيفشينكو', 'باتيستوتا وتريزيغيه'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Higuaín (Napoli 2015-16) and Immobile (Lazio 2019-20) both scored 36 goals.',
      ar: 'سجل هيغواين مع نابولي (2016) وإيموبيلي مع لاتسيو (2020) 36 هدفاً.',
    },
  },
  {
    id: 'seriea_13',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'What is the fiery derby of the capital city between AS Roma and SS Lazio called?',
      ar: 'ماذا يسمى ديربي العاصمة الإيطالية المشتعل بين روما ولاتسيو؟',
    },
    options: {
      en: ['Derby della Capitale', 'Derby del Sole', 'Derby dell’Appennino', 'Derby della Lanterna'],
      ar: ['ديربي العاصمة (Derby della Capitale)', 'ديربي الشمس', 'ديربي الأبينيني', 'ديربي المنارة'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Rome derby is famous for its passionate ultras and electric atmosphere.',
      ar: 'ديربي العاصمة روما يتميز بحماس جماهيري استثنائي وأجواء مشحونة.',
    },
  },
  {
    id: 'seriea_14',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Which club won the 1999-2000 Serie A title on the final day in heavy rain under Sven-Göran Eriksson?',
      ar: 'أي نادٍ فاز بلقب الدوري الإيطالي عام 2000 في اليوم الأخير تحت الأمطار الغزيرة مع إريكسون؟',
    },
    options: {
      en: ['SS Lazio', 'AS Roma', 'AC Milan', 'Parma'],
      ar: ['لاتسيو', 'روما', 'ميلان', 'بارما'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lazio pipped Juventus on the final day after Juve lost in torrential rain in Perugia.',
      ar: 'خطف لاتسيو اللقب في الجولة الأخيرة بعد سقوط يوفنتوس في أمطار بيروجيا.',
    },
  },
  {
    id: 'seriea_15',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Which Italian midfielder was nicknamed "Il Professore" and masterminded Juventus and Milan’s midfields?',
      ar: 'من لاعب الوسط الإيطالي الملقب بـ "المايسترو" أو "البروفيسور" الذي تألق مع ميلان ويوفنتوس؟',
    },
    options: {
      en: ['Andrea Pirlo', 'Gennaro Gattuso', 'Demetrio Albertini', 'Claudio Marchisio'],
      ar: ['أندريا بيرلو', 'جينارو غاتوزو', 'ديميتريو ألبرتيني', 'كلاوديو ماركيزيو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Andrea Pirlo redefined the deep-lying playmaker role ("regista").',
      ar: 'أعاد أندريا بيرلو تعريف دور صانع الألعاب المتأخر (الريجيستا) بأناقة نادرة.',
    },
  },
  {
    id: 'seriea_16',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Which club won Serie A in 2022-23 to end a 33-year title wait, led by Osimhen and Kvaratskhelia?',
      ar: 'أي نادٍ توج بالسكوديتو في 2022-2023 بعد غياب 33 عاماً بقيادة أوسيمين وكفاراتسيخيليا؟',
    },
    options: {
      en: ['SSC Napoli', 'Atalanta', 'Inter Milan', 'AC Milan'],
      ar: ['نابولي', 'أتالانتا', 'إنتر ميلان', 'إيه سي ميلان'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Luciano Spalletti guided Napoli to their third historic Scudetto.',
      ar: 'قاد لوتشيانو سباليتي نابولي للقب الثالث التاريخي وسط احتفالات جنونية بالمدينة.',
    },
  },
  {
    id: 'seriea_17',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'What is the match between Juventus and Inter Milan traditionally named?',
      ar: 'ما هو الاسم التقليدي للمواجهة الكلاسيكية بين يوفنتوس وإنتر ميلان؟',
    },
    options: {
      en: ['Derby d’Italia', 'Derby del Sole', 'Derby dei Campioni', 'Il Classico'],
      ar: ['ديربي إيطاليا (Derby d’Italia)', 'ديربي الشمس', 'ديربي الأبطال', 'إل كلاسيكو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Journalist Gianni Brera coined the term "Derby d’Italia" in 1967.',
      ar: 'أطلق الصحفي الشهير جاني بريرا مصطلح ديربي إيطاليا عام 1967.',
    },
  },
  {
    id: 'seriea_18',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Which club played in purple ("I Viola") and boasted Gabriel Batistuta in the 1990s?',
      ar: 'أي نادٍ إيطالي يرتدي الزي البنفسجي (الفيولا) وتألق في صفوفه غابرييل باتيستوتا؟',
    },
    options: {
      en: ['Fiorentina', 'Palermo', 'Bologna', 'Udinese'],
      ar: ['فيورنتينا', 'باليرمو', 'بولونيا', 'أودينيزي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'ACF Fiorentina is based in Florence and famously wears vibrant purple.',
      ar: 'نادي فيورنتينا في مدينة فلورنسا يشتهر بلونه البنفسجي المميز ولقب الفيولا.',
    },
  },
  {
    id: 'seriea_19',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Who holds the record for the longest consecutive minutes without conceding a goal in Serie A (974 minutes)?',
      ar: 'من الحارس الذي يملك أطول سلسلة دقائق متتالية دون استقبال أي هدف في السيريا آ (974 دقيقة)؟',
    },
    options: {
      en: ['Gianluigi Buffon', 'Sebastiano Rossi', 'Dino Zoff', 'Walter Zenga'],
      ar: ['جانلويجي بوفون', 'سيباستيانو روسي', 'دينو زوف', 'والتر زينغا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Buffon set the record of 974 minutes without conceding for Juventus in 2016.',
      ar: 'حطم بوفون الرقم التاريخي بحفاظه على نظافة شباكه 974 دقيقة متتالية عام 2016.',
    },
  },
  {
    id: 'seriea_20',
    category: 'serie_a',
    difficulty: 'medium',
    question: {
      en: 'Which Ukrainian striker won the Ballon d’Or in 2004 while playing for AC Milan?',
      ar: 'من هو المهاجم الأوكراني الذي نال الكرة الذهبية عام 2004 بقميص إيه سي ميلان؟',
    },
    options: {
      en: ['Andriy Shevchenko', 'Serhiy Rebrov', 'Anatoliy Tymoshchuk', 'Yevhen Konoplyanka'],
      ar: ['أندري تشيفشينكو', 'سيرهي ريبروف', 'أناتولي تيموشوك', 'يفهين كونوبليانكا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Shevchenko was the lethal focal point of Carlo Ancelotti’s European champions.',
      ar: 'كان تشيفشينكو الهداف الفتاك لميلان وتوج بالكرة الذهبية لأفضل لاعب في العالم.',
    },
  },
  {
    id: 'seriea_21',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Which provincial club won a legendary underdog Scudetto in 1984-85 under Osvaldo Bagnoli?',
      ar: 'أي نادٍ متواضع فجر معجزة وتوج بلقب الدوري الإيطالي موسم 1984-1985 مع أوزفالدو بانيولي؟',
    },
    options: {
      en: ['Hellas Verona', 'Cagliari', 'Sampdoria', 'Vicenza'],
      ar: ['هيلاس فيرونا', 'كالياري', 'سامبدوريا', 'فيتشينزا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Hellas Verona won their only Italian championship in one of football’s greatest fairy tales.',
      ar: 'حقق هيلاس فيرونا لقبه الوحيد في واحدة من أعظم مفاجآت الكالتشيو عبر التاريخ.',
    },
  },
  {
    id: 'seriea_22',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Which club won their only Serie A title in 1969-70 led by the legendary forward Gigi Riva?',
      ar: 'ما هو النادي الذي فاز بلقبه الوحيد في السيريا آ عام 1970 بقيادة الأسطورة لويجي ريفا؟',
    },
    options: {
      en: ['Cagliari Calcio', 'Bari', 'Lecce', 'Catania'],
      ar: ['كالياري', 'باري', 'ليتشي', 'كاتانيا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Gigi Riva fired the Sardinian club Cagliari to their first and only championship.',
      ar: 'قاد الأسطورة لويجي ريفا نادي كالياري في سردينيا لتحقيق مجدهم الوحيد.',
    },
  },
  {
    id: 'seriea_23',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Which great team tragically perished in the Superga air disaster in May 1949?',
      ar: 'أي فريق عظيم لقي لاعبوه حتفهم في كارثة طائرة سوبرغا المأساوية في مايو 1949؟',
    },
    options: {
      en: ['Il Grande Torino', 'Pro Vercelli', 'Genoa CFC', 'Bologna FC'],
      ar: ['غراندي تورينو (Grande Torino)', 'برو فرشيلي', 'جنوة', 'بولونيا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Il Grande Torino won 5 consecutive Serie A titles before the tragic accident.',
      ar: 'فريق غراندي تورينو الأسطوري كان بطلاً لإيطاليا لخمس سنوات متتالية قبل الحادث الأليم.',
    },
  },
  {
    id: 'seriea_24',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Who is the youngest player to score a goal in Serie A history (at 15 years and 287 days)?',
      ar: 'من هو أصغر لاعب يسجل هدفاً في تاريخ الدوري الإيطالي (بعمر 15 عاماً و287 يوماً)؟',
    },
    options: {
      en: ['Amedeo Amadei', 'Gianni Rivera', 'Francesco Totti', 'Pietro Pellegri'],
      ar: ['أميديو أمادي', 'جاني ريفيرا', 'فرانشيسكو توتي', 'بييترو بيليغري'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Amedeo Amadei scored for AS Roma in 1937, a record that has stood for over 85 years.',
      ar: 'سجل أميديو أمادي لنادي روما عام 1937 وهو رقم صامد منذ أكثر من 85 عاماً.',
    },
  },
  {
    id: 'seriea_25',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Which Swedish forward formed the famous "Gre-No-Li" trio for AC Milan in the 1950s and won 5 top scorer titles?',
      ar: 'من المهاجم السويدي في ثلاثي "غرينولي" الأسطوري بميلان الذي فاز بلقب الهداف 5 مرات؟',
    },
    options: {
      en: ['Gunnar Nordahl', 'Nils Liedholm', 'Gunnar Gren', 'Zlatan Ibrahimović'],
      ar: ['غونار نوردال', 'نيلس ليدهولم', 'غونار غرين', 'زلاتان إبراهيموفيتش'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Gunnar Nordahl scored 221 goals in 291 matches for AC Milan.',
      ar: 'غونار نوردال أحرز 221 هدفاً في 291 مباراة لميلان ونال 5 ألقاب كابوكانونيري.',
    },
  },
  {
    id: 'seriea_26',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'In which season did Juventus complete an entire 38-match Serie A campaign unbeaten under Antonio Conte?',
      ar: 'في أي موسم أنهى يوفنتوس الدوري الإيطالي كاملاً (38 مباراة) دون هزيمة مع أنطونيو كونتي؟',
    },
    options: {
      en: ['2011 - 2012', '2013 - 2014', '2015 - 2016', '2005 - 2006'],
      ar: ['2011 - 2012', '2013 - 2014', '2015 - 2016', '2005 - 2006'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Juventus won 23 and drew 15 matches to reclaim the Scudetto without losing a single game.',
      ar: 'حقق يوفنتوس 23 فوزاً و15 تعادلاً وتوج باللقب دون أي هزيمة طوال الموسم.',
    },
  },
  {
    id: 'seriea_27',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Which club won 7 Italian championships between 1898 and 1924, becoming Italy’s first dominant force?',
      ar: 'أي نادٍ توج بـ 7 بطولات لإيطاليا بين عامي 1898 و1924 ليكون أول قوة مهيمنة في البلاد؟',
    },
    options: {
      en: ['Genoa CFC', 'Pro Vercelli', 'Bologna FC', 'Casale'],
      ar: ['نادي جنوة (Genoa CFC)', 'برو فرشيلي', 'بولونيا', 'كازالي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Genoa is the oldest active football club in Italy, founded in 1893.',
      ar: 'نادي جنوة هو أقدم نادٍ كروي مستمر في إيطاليا وتأسس عام 1893.',
    },
  },
  {
    id: 'seriea_28',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Who scored the famous goal that won Sampdoria their only Serie A title in 1991 alongside Vialli?',
      ar: 'من هو النجم الذي شكل ثنائياً هجومياً مذهلاً مع فيالي وقاد سامبدوريا للقب 1991؟',
    },
    options: {
      en: ['Roberto Mancini', 'Attilio Lombardo', 'Toninho Cerezo', 'Gianluca Pagliuca'],
      ar: ['روبرتو مانشيني', 'أتيليو لومباردو', 'تونينيو سيريزو', 'جانلوكا باليوكا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The "Goal Twins" Roberto Mancini and Gianluca Vialli brought the Scudetto to Genoa.',
      ar: 'شكل مانشيني وفيالي الثنائي الهجومي الذهبي الذي منح سامبدوريا لقبها الوحيد.',
    },
  },
  {
    id: 'seriea_29',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'Who holds the record for scoring in 11 consecutive Serie A appearances (tied by Batistuta, Quagliarella, and Ronaldo)?',
      ar: 'من يتقاسم الرقم القياسي للتسجيل في 11 مباراة متتالية في السيريا آ؟',
    },
    options: {
      en: ['Gabriel Batistuta, Fabio Quagliarella & Cristiano Ronaldo', 'Francesco Totti, Del Piero & Inzaghi', 'Cavani, Higuaín & Immobile', 'Shevchenko, Crespo & Vieri'],
      ar: ['باتيستوتا، كوالياريلا، وكريستيانو رونالدو', 'توتي، ديل بييرو، وإنزاغي', 'كافاني، هيغواين، وإيموبيلي', 'تشيفشينكو، كريسبو، وفييري'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Batistuta set the record in 1994, matched by Quagliarella in 2019 and CR7 in 2020.',
      ar: 'سجل باتيستوتا في 11 مباراة متتالية وعادله كوالياريلا في 2019 ورونالدو في 2020.',
    },
  },
  {
    id: 'seriea_30',
    category: 'serie_a',
    difficulty: 'hard',
    question: {
      en: 'What was the record points total in a 20-team Serie A season set by Antonio Conte’s Juventus in 2013-14?',
      ar: 'ما هو الرقم القياسي لأكبر عدد نقاط في موسم واحد بالسيريا آ حققه يوفنتوس 2013-2014؟',
    },
    options: {
      en: ['102 points', '100 points', '97 points', '105 points'],
      ar: ['102 نقطة', '100 نقطة', '97 نقطة', '105 نقاط'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Juventus won 33 of 38 matches to amass 102 points, winning all 19 home games.',
      ar: 'حقق يوفنتوس 102 نقطة وفاز بجميع مبارياته الـ 19 على أرضه.',
    },
  },

  // ==========================================
  // LIGUE 1
  // ==========================================
  {
    id: 'ligue1_01',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Which club has won the most Ligue 1 titles in French football history (12 titles)?',
      ar: 'ما هو النادي الأكثر تتويجاً بلقب الدوري الفرنسي عبر التاريخ (12 لقباً)؟',
    },
    options: {
      en: ['Paris Saint-Germain', 'AS Saint-Étienne', 'Olympique de Marseille', 'AS Monaco'],
      ar: ['باريس سان جيرمان', 'سانت إتيان', 'أولمبيك مارسيليا', 'موناكو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Paris Saint-Germain overtook Saint-Étienne (10) to become the record 12-time champions.',
      ar: 'تجاوز باريس سان جيرمان نادي سانت إتيان ليصبح الأكثر تتويجاً بـ 12 لقباً.',
    },
  },
  {
    id: 'ligue1_02',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Which French club is the only team from Ligue 1 to have won the UEFA Champions League (in 1993)?',
      ar: 'ما هو النادي الفرنسي الوحيد الذي نجح في التتويج بدوري أبطال أوروبا (عام 1993)؟',
    },
    options: {
      en: ['Olympique de Marseille', 'Paris Saint-Germain', 'AS Monaco', 'Olympique Lyonnais'],
      ar: ['أولمبيك مارسيليا', 'باريس سان جيرمان', 'موناكو', 'أولمبيك ليون'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Marseille defeated AC Milan 1-0 in Munich with a header from Basile Boli.',
      ar: 'فاز مارسيليا على ميلان 1-0 في ميونخ بهدف تاريخي للمدافع بازيل بولي.',
    },
  },
  {
    id: 'ligue1_03',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Who won 6 consecutive Ligue 1 top scorer awards between 2019 and 2024 for Paris Saint-Germain?',
      ar: 'من فاز بلقب هداف الدوري الفرنسي في 6 مواسم متتالية بين 2019 و2024 مع سان جيرمان؟',
    },
    options: {
      en: ['Kylian Mbappé', 'Edinson Cavani', 'Neymar Jr', 'Zlatan Ibrahimović'],
      ar: ['كيليان مبابي', 'إدينسون كافاني', 'نيمار جونيور', 'زلاتان إبراهيموفيتش'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Kylian Mbappé dominated Ligue 1 scoring charts for six consecutive years.',
      ar: 'هيمن كيليان مبابي على صدارة هدافي الدوري الفرنسي لست سنوات متتالية.',
    },
  },
  {
    id: 'ligue1_04',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Which club won 7 consecutive Ligue 1 titles from 2002 to 2008?',
      ar: 'أي نادٍ فرنسي هيمن على اللقب وفاز بـ 7 بطولات دوري متتالية من 2002 حتى 2008؟',
    },
    options: {
      en: ['Olympique Lyonnais', 'Paris Saint-Germain', 'FC Girondins de Bordeaux', 'Lille OSC'],
      ar: ['أولمبيك ليون', 'باريس سان جيرمان', 'بوردو', 'ليل'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lyon built a dynastic team featuring Juninho Pernambucano and Grégory Coupet.',
      ar: 'بنى ليون فريقاً ذهبياً بقيادة الساحر جونينيو وهيمن على البطولة لسبعة أعوام متتالية.',
    },
  },
  {
    id: 'ligue1_05',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'What is the intense rivalry clash between Paris Saint-Germain and Olympique de Marseille called?',
      ar: 'ماذا تسمى القمة الجماهيرية الفرنسية الكبرى بين باريس سان جيرمان ومارسيليا؟',
    },
    options: {
      en: ['Le Classique', 'Derby du Rhône', 'Choc des Olympiques', 'Derby de la Côte d’Azur'],
      ar: ['لو كلاسيك (Le Classique)', 'ديربي الرون', 'صدام الأولمبيين', 'ديربي كوت دازور'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Le Classique pits the capital club against the historic Mediterranean giant.',
      ar: 'كلاسيكو فرنسا يجمع ممثل العاصمة باريس مع كبير الجنوب مارسيليا.',
    },
  },
  {
    id: 'ligue1_06',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Which stadium is the home ground of Paris Saint-Germain?',
      ar: 'ما هو الملعب الرئيسي التاريخي لنادي باريس سان جيرمان؟',
    },
    options: {
      en: ['Parc des Princes', 'Stade Vélodrome', 'Groupama Stadium', 'Stade Pierre-Mauroy'],
      ar: ['حديقة الأمراء (Parc des Princes)', 'ملعب فيلودروم', 'ملعب غروباما', 'ملعب بيير موروا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Parc des Princes has been PSG’s iconic Parisian home since 1974.',
      ar: 'حديقة الأمراء في باريس هو معقل باريس سان جيرمان منذ عام 1974.',
    },
  },
  {
    id: 'ligue1_07',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Which principality-based club won the Ligue 1 title in 2016-17 with young Mbappé and Radamel Falcao?',
      ar: 'أي نادٍ من إمارة موناكو كسر هيمنة باريس وفاز بلقب الدوري 2017 بقيادة فالكاو ومبابي؟',
    },
    options: {
      en: ['AS Monaco', 'OGC Nice', 'Montpellier HSC', 'Stade Rennais'],
      ar: ['موناكو', 'نيس', 'مونبلييه', 'رين'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Monaco scored 107 league goals in a breathtaking 2016-17 campaign under Leonardo Jardim.',
      ar: 'سجل موناكو 107 أهداف وقدم موسماً ممتعاً للغاية توج خلاله باللقب.',
    },
  },
  {
    id: 'ligue1_08',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Which Brazilian free-kick specialist scored dozens of stunning free kicks for Lyon in the 2000s?',
      ar: 'من هو الأسطورة البرازيلي صاحب التسديدات الإعجازية من ركلات حرة مع ليون في الألفية؟',
    },
    options: {
      en: ['Juninho Pernambucano', 'Ronaldinho', 'Sonny Anderson', 'Cris'],
      ar: ['جونينيو بيرنامبوكانو', 'رونالدينيو', 'سوني أندرسون', 'كريس'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Juninho is widely regarded as the greatest free-kick taker in football history.',
      ar: 'يُعتبر جونينيو أحد أعظم وأدق منفذي الركلات الحرة المباشرة في تاريخ الكرة.',
    },
  },
  {
    id: 'ligue1_09',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'Which club won a shock Ligue 1 title in 2011-12 ahead of big-spending PSG, led by Olivier Giroud?',
      ar: 'أي نادٍ حقق مفاجأة مدوية وفاز بالدوري الفرنسي عام 2012 بقيادة أوليفييه جيرو؟',
    },
    options: {
      en: ['Montpellier HSC', 'Lille OSC', 'Bordeaux', 'Toulouse'],
      ar: ['مونبلييه', 'ليل', 'بوردو', 'تولوز'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Montpellier won their first-ever league championship against all odds.',
      ar: 'حقق مونبلييه لقبه الأول في تاريخه متفوقاً على باريس سان جيرمان.',
    },
  },
  {
    id: 'ligue1_10',
    category: 'ligue_1',
    difficulty: 'easy',
    question: {
      en: 'What is the color of the home shirt traditionally worn by Saint-Étienne, earning them the nickname "Les Verts"?',
      ar: 'ما هو لون قميص سانت إتيان الأساسي الذي منحهم لقب "الخُضر" (Les Verts)؟',
    },
    options: {
      en: ['Green', 'Red', 'Blue', 'Yellow'],
      ar: ['الأخضر', 'الأحمر', 'الأزرق', 'الأصفر'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Saint-Étienne are known as "Les Verts" (The Greens) for their green jerseys.',
      ar: 'يشتهر سانت إتيان بلقب الخضر نظراً لقميصهم الأخضر التقليدي.',
    },
  },
  {
    id: 'ligue1_11',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Who is the all-time leading goalscorer in Ligue 1 history with 299 goals?',
      ar: 'من هو الهداف التاريخي للدوري الفرنسي عبر العصور برصيد 299 هدفاً؟',
    },
    options: {
      en: ['Delio Onnis', 'Bernard Lacombe', 'Hervé Revelli', 'Jean-Pierre Papin'],
      ar: ['ديليو أونيس', 'برنارد لاكومب', 'هيرفي ريفيلي', 'جان بيير بابان'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Argentine-Italian forward Delio Onnis scored 299 goals between 1971 and 1986.',
      ar: 'ديليو أونيس سجل 299 هدفاً في مسيرته مع ريمس وموناكو وتور وتولون.',
    },
  },
  {
    id: 'ligue1_12',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Who was named Ligue 1 Player of the Year in 2011 after leading Lille to a domestic league and cup double?',
      ar: 'من نال جائزة أفضل لاعب في الدوري الفرنسي عام 2011 بعد قيادة ليل للثنائية؟',
    },
    options: {
      en: ['Eden Hazard', 'Gervinho', 'Yohan Cabaye', 'Moussa Sow'],
      ar: ['إيدين هازارد', 'جيرفينيو', 'يوهان كاباي', 'موسى سو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'A 20-year-old Eden Hazard dazzled France before moving to Chelsea.',
      ar: 'سحر إيدين هازارد ملاعب فرنسا بموهبته الفذة قبل انتقاله لتشيلسي.',
    },
  },
  {
    id: 'ligue1_13',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Which striker scored 38 league goals for Paris Saint-Germain in the 2015-16 season?',
      ar: 'من المهاجم الذي سجل 38 هدفاً في موسم واحد لسان جيرمان (2015-2016)؟',
    },
    options: {
      en: ['Zlatan Ibrahimović', 'Edinson Cavani', 'Kylian Mbappé', 'Pauleta'],
      ar: ['زلاتان إبراهيموفيتش', 'إدينسون كافاني', 'كيليان مبابي', 'باوليتا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Zlatan broke the club record with 38 goals before announcing: "I came like a king, left like a legend."',
      ar: 'سجل زلاتان 38 هدفاً محطماً الأرقام القياسية قبل رحيله التاريخي الشهير.',
    },
  },
  {
    id: 'ligue1_14',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Which French forward won the Ballon d’Or in 1991 while playing for Olympique de Marseille?',
      ar: 'من هو المهاجم الفرنسي الذي فاز بالكرة الذهبية عام 1991 بقميص أولمبيك مارسيليا؟',
    },
    options: {
      en: ['Jean-Pierre Papin', 'Éric Cantona', 'Didier Deschamps', 'David Ginola'],
      ar: ['جان بيير بابان', 'إيريك كانتونا', 'ديدييه ديشان', 'دافيد جينولا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Jean-Pierre Papin won the Ballon d’Or while playing in France after scoring 36 goals in 1990-91.',
      ar: 'توج جان بيير بابان بالكرة الذهبية بعد موسم استثنائي مع مارسيليا.',
    },
  },
  {
    id: 'ligue1_15',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Which stadium in Marseille is famous for its curved acoustic roof and fiery atmosphere?',
      ar: 'ما هو ملعب مارسيليا الشهير بسقفه الصوتي المنحني وأجوائه الصاخبة؟',
    },
    options: {
      en: ['Stade Vélodrome', 'Stade de la Beaujoire', 'Stade Bollaert-Delelis', 'Allianz Riviera'],
      ar: ['ملعب فيلودروم (Stade Vélodrome)', 'ملعب بوجوار', 'ملعب بولار ديليليس', 'أليانز ريفييرا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The renovated Stade Vélodrome holds over 67,000 spectators and is iconic in European football.',
      ar: 'ملعب فيلودروم يتسع لأكثر من 67 ألف متفرج ويعد جحيماً للخصوم.',
    },
  },
  {
    id: 'ligue1_16',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Which club won their fourth Ligue 1 title in 2020-21 under manager Christophe Galtier, beating PSG by 1 point?',
      ar: 'أي نادٍ فاز برابع ألقابه في الدوري الفرنسي موسم 2020-2021 متفوقاً على باريس بنقطة؟',
    },
    options: {
      en: ['Lille OSC', 'AS Monaco', 'Rennes', 'Lens'],
      ar: ['ليل (Lille OSC)', 'موناكو', 'رين', 'لانس'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lille held their nerve on the final matchday with Burak Yılmaz and Mike Maignan.',
      ar: 'ظفر ليل باللقب بعد موسم بطولي بقيادة بوراك يلماز والحارس مايك ماينان.',
    },
  },
  {
    id: 'ligue1_17',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Which Brazilian maestro played two brilliant seasons for Paris Saint-Germain from 2001 to 2003 before moving to Barcelona?',
      ar: 'من هو الساحر البرازيلي الذي لعب موسمين رائعين لباريس سان جيرمان قبل انضمامه لبرشلونة؟',
    },
    options: {
      en: ['Ronaldinho', 'Rai', 'Leonardo', 'Nenê'],
      ar: ['رونالدينيو', 'راي', 'ليوناردو', 'نيني'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Ronaldinho dazzled French crowds with incredible dribbles and free kicks at Parc des Princes.',
      ar: 'قدم رونالدينيو لوحات فنية خالدة في حديقة الأمراء قبل خطفه من برشلونة.',
    },
  },
  {
    id: 'ligue1_18',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Which club ended Lyon’s 7-year reign by winning Ligue 1 in 2008-09 under Laurent Blanc?',
      ar: 'أي نادٍ أوقف هيمنة ليون وتوج بالدوري الفرنسي موسم 2008-2009 مع لوران بلان؟',
    },
    options: {
      en: ['Girondins de Bordeaux', 'Marseille', 'PSG', 'Auxerre'],
      ar: ['بوردو (Bordeaux)', 'مارسيليا', 'باريس سان جيرمان', 'أوكسير'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Bordeaux, inspired by Yoann Gourcuff, won 11 consecutive matches to finish the season as champions.',
      ar: 'حقق بوردو 11 فوزاً متتالياً وتألق نجمه غوركوف ليقوده للقب تاريخي.',
    },
  },
  {
    id: 'ligue1_19',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Who holds the record for the most appearances in Ligue 1 history (618 matches)?',
      ar: 'من هو اللاعب الأكثر خوضاً للمباريات في تاريخ الدوري الفرنسي (618 مباراة)؟',
    },
    options: {
      en: ['Mickaël Landreau', 'Jean-Luc Ettori', 'Dominique Dropsy', 'Alain Giresse'],
      ar: ['ميكايل لاندرو', 'جان لوك إيتوري', 'دومينيك دروبسي', 'ألان جيريس'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Goalkeeper Mickaël Landreau played 618 matches for Nantes, PSG, Lille, and Bastia.',
      ar: 'خاض الحارس ميكايل لاندرو 618 مباراة في مسيرة حافلة استمرت لعقدين.',
    },
  },
  {
    id: 'ligue1_20',
    category: 'ligue_1',
    difficulty: 'medium',
    question: {
      en: 'Which legendary African striker made his breakthrough in Ligue 1 with Guingamp and Marseille before starring for Chelsea?',
      ar: 'من هو المهاجم الإفريقي الأسطوري الذي لمع في فرنسا مع غانغان ومارسيليا قبل توهجه في تشيلسي؟',
    },
    options: {
      en: ['Didier Drogba', 'George Weah', 'Michael Essien', 'Salif Keita'],
      ar: ['ديدييه دروغبا', 'جورج وياه', 'مايكل إيسيان', 'ساليف كيتا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Didier Drogba scored 19 league goals for Marseille in 2003-04, becoming a beloved hero in Provence.',
      ar: 'سجل دروغبا 19 هدفاً لمارسيليا وقادهم لنهائي كأس الاتحاد الأوروبي قبل انتقاله لإنجلترا.',
    },
  },
  {
    id: 'ligue1_21',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Who scored 44 goals in a single Ligue 1 season for Marseille in 1970-71, a record that still stands today?',
      ar: 'من سجل 44 هدفاً في موسم واحد بالدوري الفرنسي مع مارسيليا (1970-1971) كرقم قياسي صامد؟',
    },
    options: {
      en: ['Josip Skoblar', 'Salif Keita', 'Carlos Bianchi', 'Just Fontaine'],
      ar: ['يوسيب سكوبلار', 'ساليف كيتا', 'كارلوس بيانكي', 'جاست فونتين'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Yugoslav striker Josip Skoblar’s 44-goal tally remains untouched after more than 50 years.',
      ar: 'لا يزال رقم المهاجم اليوغوسلافي سكوبلار (44 هدفاً) صامداً لأكثر من نصف قرن.',
    },
  },
  {
    id: 'ligue1_22',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Which club won the inaugural French professional football championship in 1932-33?',
      ar: 'ما هو النادي الذي فاز بأول بطولة دوري فرنسي للمحترفين في موسم 1932-1933؟',
    },
    options: {
      en: ['Olympique Lillois', 'AS Cannes', 'FC Sète', 'Sochaux'],
      ar: ['أولمبيك ليلوا', 'كان', 'إف سي سيت', 'سوشو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Olympique Lillois won the inaugural final against Cannes 4-3 in Paris.',
      ar: 'فاز أولمبيك ليلوا بالنسخة الأولى بعد تغلبه على كان 4-3 في باريس.',
    },
  },
  {
    id: 'ligue1_23',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Which legendary coach managed AJ Auxerre continuously for over 44 years (1961 to 2005), winning the double in 1996?',
      ar: 'من هو المدرب الأسطوري الذي أدار أوكسير لأكثر من 44 عاماً وحقق معه ثنائية 1996؟',
    },
    options: {
      en: ['Guy Roux', 'Rolland Courbis', 'Jean-Claude Suaudeau', 'Aimé Jacquet'],
      ar: ['غي رو (Guy Roux)', 'رولان كوربيس', 'جان كلود سوادو', 'إيميه جاكيه'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Guy Roux guided Auxerre from amateur regional leagues to Ligue 1 glory.',
      ar: 'قاد غي رو نادي أوكسير من دوريات الهواة وصولاً لقمة الكرة الفرنسية.',
    },
  },
  {
    id: 'ligue1_24',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Who is the only player to have won the Ballon d’Or while playing for a French club in the same year (prior to Messi in 2021)?',
      ar: 'من هو اللاعب الوحيد الذي نال الكرة الذهبية أثناء لعبه مع نادٍ فرنسي (قبل ميسي 2021)؟',
    },
    options: {
      en: ['Jean-Pierre Papin', 'Raymond Kopa', 'Michel Platini', 'George Weah'],
      ar: ['جان بيير بابان', 'ريموند كوبا', 'ميشيل بلاتيني', 'جورج وياه'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Papin won it with Marseille in 1991. George Weah won in 1995 but had moved to AC Milan mid-year.',
      ar: 'فاز بها بابان مع مارسيليا في 1991، بينما انتقل وياه لميلان في منتصف عام 1995.',
    },
  },
  {
    id: 'ligue1_25',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'What was Paris Saint-Germain’s record points tally in their historic 2015-16 Ligue 1 championship?',
      ar: 'ما هو الرقم القياسي لعدد النقاط الذي حصده باريس سان جيرمان في موسم 2015-2016؟',
    },
    options: {
      en: ['96 points', '92 points', '100 points', '89 points'],
      ar: ['96 نقطة', '92 نقطة', '100 نقطة', '89 نقطة'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Laurent Blanc’s PSG amassed a record 96 points, winning the title by a 31-point margin.',
      ar: 'حقق باريس سان جيرمان 96 نقطة وبفارق 31 نقطة كاملة عن الوصيف ليون.',
    },
  },
  {
    id: 'ligue1_26',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Which Corsican club famously reached the UEFA Cup final in 1978 and played many seasons in Ligue 1?',
      ar: 'أي نادٍ كورسيكي بلغ نهائي كأس الاتحاد الأوروبي 1978 وخاض مواسم عديدة في الليغ 1؟',
    },
    options: {
      en: ['SC Bastia', 'AC Ajaccio', 'Gazélec Ajaccio', 'Borgo'],
      ar: ['باستيا (SC Bastia)', 'أجاكسيو', 'غازيليك أجاكسيو', 'بورغو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'SC Bastia from Corsica reached the European final against PSV Eindhoven.',
      ar: 'نادي باستيا ممثل جزيرة كورسيكا بلغ نهائي أوروبا في موسم تاريخي عام 1978.',
    },
  },
  {
    id: 'ligue1_27',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Which Portuguese striker was top scorer of Ligue 1 three times for Bordeaux and PSG in the 2000s?',
      ar: 'من هو المهاجم البرتغالي الذي توج هدافاً للدوري الفرنسي ثلاث مرات مع بوردو وسان جيرمان؟',
    },
    options: {
      en: ['Pauleta', 'Hélder Postiga', 'Nuno Gomes', 'Érico Castro'],
      ar: ['باوليتا (Pauleta)', 'هيلدر بوستيغا', 'نونو غوميش', 'إيريكو كاسترو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Pedro Miguel Pauleta scored 141 Ligue 1 goals and was known as "The Eagle of the Azores".',
      ar: 'سجل باوليتا "نسر الآزور" 141 هدفاً ونال لقب الهداف في 3 مواسم.',
    },
  },
  {
    id: 'ligue1_28',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'In 1997-98, which northern mining club won their only French Ligue 1 championship on goal difference?',
      ar: 'في موسم 1997-1998، أي نادٍ عمالي في الشمال توج بلقبه الوحيد في الدوري الفرنسي؟',
    },
    options: {
      en: ['RC Lens', 'Metz', 'Sedan', 'Valenciennes'],
      ar: ['لانس (RC Lens)', 'ميتز', 'سيدان', 'فالنسيان'],
    },
    correctIndex: 0,
    explanation: {
      en: 'RC Lens edged out Metz on goal difference to take the title in a dramatic finish.',
      ar: 'توج لانس بلقبه التاريخي بفارق الأهداف عن ميتز في جولة أخيرة حبست الأنفاس.',
    },
  },
  {
    id: 'ligue1_29',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Who is the youngest player to score a hat-trick in Ligue 1 history (at 17 years and 353 days)?',
      ar: 'من هو أصغر لاعب يسجل ثلاثية (هاتريك) في تاريخ الدوري الفرنسي (بعمر 17 عاماً و353 يوماً)؟',
    },
    options: {
      en: ['Jérémy Ménez', 'Kylian Mbappé', 'Thierry Henry', 'Karim Benzema'],
      ar: ['جيريمي مينيز', 'كيليان مبابي', 'تييري هنري', 'كريم بنزيما'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Jérémy Ménez scored a 7-minute hat-trick for Sochaux against Bordeaux in 2005.',
      ar: 'سجل جيريمي مينيز ثلاثية تاريخية لسوشو أمام بوردو في 7 دقائق عام 2005.',
    },
  },
  {
    id: 'ligue1_30',
    category: 'ligue_1',
    difficulty: 'hard',
    question: {
      en: 'Which club holds the record for the most consecutive matches unbeaten in Ligue 1 history (36 matches)?',
      ar: 'أي نادٍ يحمل الرقم القياسي لأطول سلسلة مباريات دون هزيمة في تاريخ الدوري الفرنسي (36 مباراة)؟',
    },
    options: {
      en: ['Paris Saint-Germain (2015-16)', 'Nantes (1994-95)', 'Lyon (2004-05)', 'Marseille (1991-92)'],
      ar: ['باريس سان جيرمان (2015-2016)', 'نانت (1994-1995)', 'ليون (2004-2005)', 'مارسيليا (1991-1992)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'PSG went 36 games without defeat across two seasons between March 2015 and February 2016.',
      ar: 'حقق سان جيرمان سلسلة 36 مباراة دون أي هزيمة بين مارس 2015 وفبراير 2016.',
    },
  },

  // ==========================================
  // WORLD CUP
  // ==========================================
  {
    id: 'wc_01',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Which national team has won the most FIFA World Cup titles in football history?',
      ar: 'ما هو المنتخب الأكثر فوزاً بلقب كأس العالم في تاريخ كرة القدم؟',
    },
    options: {
      en: ['Brazil (5 titles)', 'Germany (4 titles)', 'Italy (4 titles)', 'Argentina (3 titles)'],
      ar: ['البرازيل (5 ألقاب)', 'ألمانيا (4 ألقاب)', 'إيطاليا (4 ألقاب)', 'الأرجنتين (3 ألقاب)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Brazil is the only nation to have won 5 World Cups (1958, 1962, 1970, 1994, 2002).',
      ar: 'البرازيل هي الوحيدة التي نالت 5 كؤوس عالم (1958، 1962، 1970، 1994، 2002).',
    },
  },
  {
    id: 'wc_02',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Who is the only player to have won three FIFA World Cup trophies as a player?',
      ar: 'من هو اللاعب الوحيد الذي توج بكأس العالم ثلاث مرات كلاعب؟',
    },
    options: {
      en: ['Pelé', 'Diego Maradona', 'Garrincha', 'Ronaldo Nazário'],
      ar: ['بيليه (Pelé)', 'دييغو مارادونا', 'غارينشيا', 'رونالدو نازاريو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Pelé won the tournament with Brazil in 1958, 1962, and 1970.',
      ar: 'حقق الجوهرة السوداء بيليه اللقب مع السامبا في أعوام 1958 و1962 و1970.',
    },
  },
  {
    id: 'wc_03',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Who captained Argentina to victory in the dramatic 2022 FIFA World Cup in Qatar?',
      ar: 'من كان قائد منتخب الأرجنتين في تتويجه التاريخي بمونديال قطر 2022؟',
    },
    options: {
      en: ['Lionel Messi', 'Ángel Di María', 'Javier Mascherano', 'Rodrigo De Paul'],
      ar: ['ليونيل ميسي', 'أنخيل دي ماريا', 'خافيير ماسكيرانو', 'رودريغو دي بول'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lionel Messi scored 7 goals, won the Golden Ball, and lifted the trophy in Lusail.',
      ar: 'سجل ميسي 7 أهداف ونال الكرة الذهبية ورفع الكأس الغالية في ملعب لوسيل.',
    },
  },
  {
    id: 'wc_04',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Who is the all-time leading goalscorer in FIFA World Cup finals tournament history with 16 goals?',
      ar: 'من هو الهداف التاريخي لنهائيات كأس العالم برصيد 16 هدفاً؟',
    },
    options: {
      en: ['Miroslav Klose', 'Ronaldo Nazário', 'Gerd Müller', 'Just Fontaine'],
      ar: ['ميروسلاف كلوزه', 'رونالدو نازاريو', 'غيرد مولر', 'جاست فونتين'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Germany’s Miroslav Klose scored 16 goals across four World Cup tournaments (2002-2014).',
      ar: 'ميروسلاف كلوزه أحرز 16 هدفاً في 4 بطولات متجاوزاً البرازيلي رونالدو.',
    },
  },
  {
    id: 'wc_05',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Which country hosted and won the inaugural FIFA World Cup tournament in 1930?',
      ar: 'أي دولة استضافت وتوجت بأول نسخة في تاريخ كأس العالم عام 1930؟',
    },
    options: {
      en: ['Uruguay', 'Argentina', 'Brazil', 'Italy'],
      ar: ['الأوروغواي', 'الأرجنتين', 'البرازيل', 'إيطاليا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Uruguay defeated neighbors Argentina 4-2 in the final at Estadio Centenario in Montevideo.',
      ar: 'فازت الأوروغواي على الأرجنتين 4-2 في مونتيفيديو لتتوج بأول كأس عالم.',
    },
  },
  {
    id: 'wc_06',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Which nation became the first African team to reach the semifinals of a FIFA World Cup in 2022?',
      ar: 'أي منتخب كان أول فريق إفريقي وعربي يبلغ نصف نهائي كأس العالم في مونديال 2022؟',
    },
    options: {
      en: ['Morocco', 'Senegal', 'Cameroon', 'Ghana'],
      ar: ['المغرب', 'السنغال', 'الكاميرون', 'غانا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Morocco made history in Qatar, eliminating Spain and Portugal to reach the final four.',
      ar: 'صنع أسود الأطلس التاريخ في قطر بإقصاء إسبانيا والبرتغال والوصول للمربع الذهبي.',
    },
  },
  {
    id: 'wc_07',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Who scored both goals for Brazil in their 2-0 victory over Germany in the 2002 final?',
      ar: 'من سجل هدفي البرازيل في شباك ألمانيا في نهائي كأس العالم 2002؟',
    },
    options: {
      en: ['Ronaldo Nazário (The Phenomenon)', 'Rivaldo', 'Ronaldinho', 'Cafu'],
      ar: ['رونالدو نازاريو (الظاهرة)', 'ريفالدو', 'رونالدينيو', 'كافو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Ronaldo redeemed his 1998 heartbreak by scoring twice past Oliver Kahn in Yokohama.',
      ar: 'تألق الظاهرة رونالدو وهز شباك أوليفر كان بمرتين ليمنح البرازيل النجمة الخامسة.',
    },
  },
  {
    id: 'wc_08',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'What shocking scoreline occurred in the 2014 World Cup semifinal between Germany and hosts Brazil?',
      ar: 'ما هي النتيجة التاريخية الصادمة في نصف نهائي مونديال 2014 بين ألمانيا والمستضيفة البرازيل؟',
    },
    options: {
      en: ['Germany 7 - 1 Brazil', 'Germany 5 - 0 Brazil', 'Germany 4 - 1 Brazil', 'Germany 6 - 2 Brazil'],
      ar: ['ألمانيا 7 - 1 البرازيل', 'ألمانيا 5 - 0 البرازيل', 'ألمانيا 4 - 1 البرازيل', 'ألمانيا 6 - 2 البرازيل'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The "Mineiraço" in Belo Horizonte remains the most lopsided semifinal in World Cup history.',
      ar: 'مذبحة بيلو هوريزونتي التاريخية (7-1) تظل أكبر صدمة في تاريخ المونديال الحديث.',
    },
  },
  {
    id: 'wc_09',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Who was sent off in extra time of the 2006 World Cup final for headbutting Marco Materazzi?',
      ar: 'من هو النجم الذي طُرد في الوقت الإضافي لنهائي كأس العالم 2006 بعد نطحته لماتيراتزي؟',
    },
    options: {
      en: ['Zinedine Zidane', 'Thierry Henry', 'Patrick Vieira', 'Fabien Barthez'],
      ar: ['زين الدين زيدان', 'تييري هنري', 'باتريك فييرا', 'فابيان بارتيز'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Zinedine Zidane’s infamous red card was the final act of his extraordinary playing career.',
      ar: 'كانت البطاقة الحمراء الشهيرة لزيدان في برلين اللقطة الختامية لمسيرته الأسطورية.',
    },
  },
  {
    id: 'wc_10',
    category: 'world_cup',
    difficulty: 'easy',
    question: {
      en: 'Which European nation won their first-ever FIFA World Cup in 2010 thanks to Andrés Iniesta’s extra-time winner?',
      ar: 'أي دولة أوروبية حققت لقبها الأول في كأس العالم 2010 بهدف إنييستا في الوقت الإضافي؟',
    },
    options: {
      en: ['Spain', 'Netherlands', 'Portugal', 'Belgium'],
      ar: ['إسبانيا', 'هولندا', 'البرتغال', 'بلجيكا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Andrés Iniesta struck in the 116th minute in Johannesburg against the Netherlands.',
      ar: 'سجل أندريس إنييستا هدف التتويج التاريخي في الدقيقة 116 في شباك هولندا.',
    },
  },
  {
    id: 'wc_11',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Who holds the record for the most goals scored in a single World Cup tournament (13 goals in 1958)?',
      ar: 'من هو صاحب الرقم القياسي لأكبر عدد أهداف في نسخة واحدة من كأس العالم (13 هدفاً في 1958)؟',
    },
    options: {
      en: ['Just Fontaine (France)', 'Gerd Müller (West Germany)', 'Sándor Kocsis (Hungary)', 'Eusébio (Portugal)'],
      ar: ['جاست فونتين (فرنسا)', 'غيرد مولر (ألمانيا الغربية)', 'ساندور كوتشيس (المجر)', 'أوزيبيو (البرتغال)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'France’s Just Fontaine netted 13 goals in 6 games in Sweden 1958.',
      ar: 'سجل جاست فونتين 13 هدفاً في 6 مباريات فقط في مونديال السويد 1958.',
    },
  },
  {
    id: 'wc_12',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Against which country did Diego Maradona score both the "Hand of God" and the "Goal of the Century" in 1986?',
      ar: 'ضد أي منتخب سجل دييغو مارادونا هدف "يد الإله" و"هدف القرن" في مونديال 1986؟',
    },
    options: {
      en: ['England', 'West Germany', 'Belgium', 'Italy'],
      ar: ['إنجلترا', 'ألمانيا الغربية', 'بلجيكا', 'إيطاليا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Maradona produced both iconic moments within four minutes at the Azteca Stadium in Mexico City.',
      ar: 'سجل مارادونا الهدفين الخالدين في غضون 4 دقائق أمام إنجلترا في ملعب أزتيكا.',
    },
  },
  {
    id: 'wc_13',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Who scored a hat-trick in the 2022 World Cup Final, becoming only the second man to do so after Geoff Hurst in 1966?',
      ar: 'من سجل ثلاثية (هاتريك) في نهائي كأس العالم 2022 ليكون الثاني تاريخياً بعد جيف هيرست؟',
    },
    options: {
      en: ['Kylian Mbappé', 'Lionel Messi', 'Antoine Griezmann', 'Olivier Giroud'],
      ar: ['كيليان مبابي', 'ليونيل ميسي', 'أنطوان غريزمان', 'أوليفييه جيرو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Kylian Mbappé scored 3 goals in the final for France, finishing as tournament top scorer with 8 goals.',
      ar: 'سجل كيليان مبابي ثلاثية مذهلة في النهائي ونال الحذاء الذهبي بـ 8 أهداف.',
    },
  },
  {
    id: 'wc_14',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Which goalkeeper famously conceded zero open-play goals during Italy’s run to the 2006 World Cup triumph?',
      ar: 'أي حارس إيطالي لم يستقبل أي هدف من لعب مفتوح خلال التتويج بكأس العالم 2006؟',
    },
    options: {
      en: ['Gianluigi Buffon', 'Francesco Toldo', 'Angelo Peruzzi', 'Christian Abbiati'],
      ar: ['جانلويجي بوفون', 'فرانشيسكو تولدو', 'أنجيلو بيروتزي', 'كريستيان أبياتي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Buffon conceded only an own goal and a penalty during the entire 2006 tournament.',
      ar: 'لم تتلق شباك بوفون سوى هدف عكسي من زميله وركلة جزاء زيدان في النهائي.',
    },
  },
  {
    id: 'wc_15',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Which country has finished as World Cup runner-up three times without ever winning the trophy?',
      ar: 'أي منتخب حل وصيفاً لكأس العالم 3 مرات دون أن يتوج باللقب على الإطلاق؟',
    },
    options: {
      en: ['Netherlands', 'Croatia', 'Hungary', 'Sweden'],
      ar: ['هولندا', 'كرواتيا', 'المجر', 'السويد'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Dutch reached the final in 1974, 1978, and 2010, losing all three.',
      ar: 'وصلت هولندا لنهائي المونديال أعوام 1974 و1978 و2010 ولم يحالفها الحظ.',
    },
  },
  {
    id: 'wc_16',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Who scored the extra-time winning goal for Germany in the 2014 World Cup final against Argentina?',
      ar: 'من سجل هدف الفوز القاتل لألمانيا في الوقت الإضافي لنهائي مونديال 2014 أمام الأرجنتين؟',
    },
    options: {
      en: ['Mario Götze', 'Thomas Müller', 'Toni Kroos', 'Bastian Schweinsteiger'],
      ar: ['ماريو غوتزه', 'توماس مولر', 'توني كروس', 'باستيان شفاينشتايغر'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Super-sub Mario Götze controlled Schürrle’s cross with his chest and volleyed home in the 113th minute.',
      ar: 'استلم البديل غوتزه العرضية على صدره وسددها في الشباك عند الدقيقة 113 في ماراكانا.',
    },
  },
  {
    id: 'wc_17',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Which iconic trophy was awarded to FIFA World Cup winners before the current FIFA World Cup Trophy was introduced in 1974?',
      ar: 'ما اسم الكأس القديمة التي كانت تُمنح لأبطال العالم قبل الكأس الحالية عام 1974؟',
    },
    options: {
      en: ['Jules Rimet Trophy', 'Coupe de l’Indépendance', 'The Henri Delaunay Trophy', 'The Olympic Shield'],
      ar: ['كأس جول ريميه (Jules Rimet)', 'كأس الاستقلال', 'كأس هنري ديلوناي', 'الدرع الأولمبي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'The Jules Rimet Trophy was kept permanently by Brazil after their third win in 1970.',
      ar: 'احتفظت البرازيل بكأس جول ريميه للأبد بعد فوزها الثالث عام 1970.',
    },
  },
  {
    id: 'wc_18',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Who was the first person to win the World Cup as both a player and a head coach?',
      ar: 'من كان أول شخص في تاريخ كرة القدم يتوج بكأس العالم كلاعب وكمدرب؟',
    },
    options: {
      en: ['Mário Zagallo (Brazil)', 'Franz Beckenbauer (Germany)', 'Didier Deschamps (France)', 'Carlos Alberto Parreira'],
      ar: ['ماريو زاغالو (البرازيل)', 'فرانز بيكنباور (ألمانيا)', 'ديدييه ديشان (فرنسا)', 'كارلوس ألبرتو باريرا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Mário Zagallo won as a player in 1958 and 1962, and as head coach in 1970.',
      ar: 'فاز زاغالو كلاعب في 1958 و1962 وكمدرب في 1970.',
    },
  },
  {
    id: 'wc_19',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'In 2002, who scored the fastest goal in World Cup history (just 10.8 seconds into the match)?',
      ar: 'في مونديال 2002، من صاحب أسرع هدف في تاريخ كأس العالم (بعد 10.8 ثانية فقط)؟',
    },
    options: {
      en: ['Hakan Şükür (Turkey)', 'Bryan Robson (England)', 'Clint Dempsey (USA)', 'Bernard Lacombe (France)'],
      ar: ['هاكان شكور (تركيا)', 'برايان روبسون (إنجلترا)', 'كلينت ديمبسي (أمريكا)', 'برنارد لاكومب (فرنسا)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Turkey’s Hakan Şükür struck against co-hosts South Korea in the 3rd-place playoff.',
      ar: 'هز التركي هاكان شكور شباك كوريا الجنوبية بعد 10.8 ثانية في مباراة تحديد المركز الثالث.',
    },
  },
  {
    id: 'wc_20',
    category: 'world_cup',
    difficulty: 'medium',
    question: {
      en: 'Which legendary Italian striker missed the final penalty in the 1994 World Cup shootout against Brazil?',
      ar: 'من هو الأسطورة الإيطالي صاحب ذيل الحصان الذي أهدر ركلة الترجيح الشهيرة في نهائي 1994؟',
    },
    options: {
      en: ['Roberto Baggio', 'Franco Baresi', 'Daniele Massaro', 'Gianfranco Zola'],
      ar: ['روبرتو باجيو', 'فرانكو باريزي', 'دانييلي ماسارو', 'جيانفرانكو زولا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Roberto Baggio shot over the crossbar at the Rose Bowl in Pasadena.',
      ar: 'سدد روبرتو باجيو فوق العارضة في ملعب روز بول بعد أن حمل إيطاليا بمفرده للنهائي.',
    },
  },
  {
    id: 'wc_21',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Who is the oldest goalscorer in World Cup history, scoring at age 42 against Russia in 1994?',
      ar: 'من هو أكبر لاعب يسجل هدفاً في تاريخ كأس العالم (بعمر 42 عاماً أمام روسيا 1994)؟',
    },
    options: {
      en: ['Roger Milla (Cameroon)', 'Dino Zoff (Italy)', 'Essam El-Hadary (Egypt)', 'Faryd Mondragón (Colombia)'],
      ar: ['روجيه ميلا (الكاميرون)', 'دينو زوف (إيطاليا)', 'عصام الحضري (مصر)', 'فريد موندراغون (كولومبيا)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Cameroon icon Roger Milla scored at age 42 years and 39 days.',
      ar: 'الأسطورة الكاميروني روجيه ميلا سجل في سن 42 عاماً ورقص رقصته الشهيرة عند الراية.',
    },
  },
  {
    id: 'wc_22',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Who scored 5 goals in a single World Cup match in 1994, setting an all-time tournament record?',
      ar: 'من هو اللاعب الذي سجل 5 أهداف في مباراة واحدة بكأس العالم 1994 كرقم قياسي تاريخي؟',
    },
    options: {
      en: ['Oleg Salenko (Russia)', 'Hristo Stoichkov (Bulgaria)', 'Romário (Brazil)', 'Kennet Andersson (Sweden)'],
      ar: ['أوليغ سالينكو (روسيا)', 'خريستو ستويتشكوف (بلغاريا)', 'روماريو (البرازيل)', 'كينيت أندرسون (السويد)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Oleg Salenko scored 5 goals for Russia against Cameroon in Stanford, USA.',
      ar: 'سجل الروسي أوليغ سالينكو 5 أهداف في شباك الكاميرون في كاليفورنيا.',
    },
  },
  {
    id: 'wc_23',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Which referee notoriously showed three yellow cards to Croatia’s Josip Šimunić in the 2006 World Cup?',
      ar: 'أي حكم أشهر 3 بطاقات صفراء في واقعة غريبة للاعب كرواتيا شيمونيتش في مونديال 2006؟',
    },
    options: {
      en: ['Graham Poll (England)', 'Pierluigi Collina (Italy)', 'Horacio Elizondo (Argentina)', 'Markus Merk (Germany)'],
      ar: ['غراهام بول (إنجلترا)', 'بييرلويجي كولينا (إيطاليا)', 'هوراسيو إليزوندو (الأرجنتين)', 'ماركوس ميرك (ألمانيا)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Graham Poll forgot to send Šimunić off after his second yellow, only showing the red after a third booking.',
      ar: 'نسي الحكم الإنجليزي غراهام بول طرد اللاعب بعد الإنذار الثاني ولم يطرده إلا بعد الثالث.',
    },
  },
  {
    id: 'wc_24',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Which match in World Cup 1954 saw 12 goals scored, the highest-scoring match in tournament history?',
      ar: 'ما هي المباراة التي شهدت تسجيل 12 هدفاً في مونديال 1954 كأعلى مباراة تهديفاً في تاريخ البطولة؟',
    },
    options: {
      en: ['Austria 7 - 5 Switzerland', 'Hungary 8 - 3 West Germany', 'Uruguay 7 - 0 Scotland', 'Brazil 6 - 5 Poland'],
      ar: ['النمسا 7 - 5 سويسرا', 'المجر 8 - 3 ألمانيا الغربية', 'الأوروغواي 7 - 0 اسكتلندا', 'البرازيل 6 - 5 بولندا'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Austria beat hosts Switzerland 7-5 in Lausanne under sweltering heat.',
      ar: 'فازت النمسا على سويسرا 7-5 في لوزان في مباراة شهدت هطولاً للأهداف.',
    },
  },
  {
    id: 'wc_25',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Who was the goalkeeper for Colombia that Colombian defender Andrés Escobar tragically scored an own goal against in 1994?',
      ar: 'من كان حارس مرمى كولومبيا في المونديال عندما سجل أندريس إسكوبار الهدف العكسي عام 1994؟',
    },
    options: {
      en: ['Óscar Córdoba', 'René Higuita', 'Faryd Mondragón', 'Miguel Calero'],
      ar: ['أوسكار كوردوبا', 'رينيه هيغيتا', 'فريد موندراغون', 'ميغيل كاليرو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Óscar Córdoba was in goal against the United States when the unfortunate own goal occurred.',
      ar: 'كان أوسكار كوردوبا حارساً لكولومبيا أمام الولايات المتحدة في تلك المباراة الحزينة.',
    },
  },
  {
    id: 'wc_26',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Which player has played in the most World Cup matches in history (26 matches)?',
      ar: 'من هو اللاعب الأكثر خوضاً للمباريات في تاريخ كأس العالم (26 مباراة)؟',
    },
    options: {
      en: ['Lionel Messi', 'Lothar Matthäus', 'Miroslav Klose', 'Paolo Maldini'],
      ar: ['ليونيل ميسي', 'لوتار ماتيوس', 'ميروسلاف كلوزه', 'باولو مالديني'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Lionel Messi broke Lothar Matthäus’ record of 25 appearances by playing in the 2022 final.',
      ar: 'كسر ليونيل ميسي رقم ماتيوس التاريخي بخوضه مباراته الـ 26 في نهائي 2022.',
    },
  },
  {
    id: 'wc_27',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'In which World Cup final did the "Maracanaço" take place, where Uruguay shocked Brazil 2-1 in Rio?',
      ar: 'في أي مونديال وقعت صدمة "الماراكانازو" التاريخية بفوز الأوروغواي على البرازيل 2-1 في ريو؟',
    },
    options: {
      en: ['1950 (Brazil)', '1954 (Switzerland)', '1938 (France)', '1962 (Chile)'],
      ar: ['1950 (البرازيل)', '1954 (سويسرا)', '1938 (فرنسا)', '1962 (تشيلي)'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Alcides Ghiggia’s late winner silenced almost 200,000 devastated Brazilian fans at the Maracanã.',
      ar: 'سجل غيغيا هدف الصدمة أمام ما يقارب 200 ألف مشجع برازيلي في الماراكانا.',
    },
  },
  {
    id: 'wc_28',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Who is the only player to have scored in four different World Cup tournaments for Brazil?',
      ar: 'من هو اللاعب الوحيد الذي سجل في 4 بطولات كأس عالم مختلفة للبرازيل؟',
    },
    options: {
      en: ['Pelé', 'Ronaldo Nazário', 'Neymar Jr', 'Jairzinho'],
      ar: ['بيليه (Pelé)', 'رونالدو نازاريو', 'نيمار جونيور', 'جارزينيو'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Pelé scored in 1958, 1962, 1966, and 1970 for the Seleção.',
      ar: 'سجل بيليه في مونديالات 1958 و1962 و1966 و1970 مع السامبا.',
    },
  },
  {
    id: 'wc_29',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'What was the famous "Battle of Nuremberg" in the 2006 World Cup between Portugal and the Netherlands known for?',
      ar: 'بماذا اشتهرت "معركة نورمبرغ" الشهيرة في مونديال 2006 بين البرتغال وهولندا؟',
    },
    options: {
      en: ['Record 4 red cards and 16 yellow cards', 'Record 7 penalty kicks', 'The longest match in history (135 mins)', 'Five disallowed goals'],
      ar: ['رقم قياسي بـ 4 بطاقات حمراء و16 بطاقة صفراء', 'رقم قياسي بـ 7 ركلات جزاء', 'أطول مباراة في التاريخ (135 دقيقة)', 'إلغاء 5 أهداف بالـ VAR'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Referee Valentin Ivanov handed out a FIFA record 16 yellows and 4 red cards in a chaotic clash.',
      ar: 'أشهر الحكم إيفانوف 16 بطاقة صفراء و4 بطاقات حمراء في أشرس مباراة بمونديال 2006.',
    },
  },
  {
    id: 'wc_30',
    category: 'world_cup',
    difficulty: 'hard',
    question: {
      en: 'Who captained the French national team to their first World Cup title on home soil in 1998?',
      ar: 'من كان قائد منتخب فرنسا عندما توج بلقب كأس العالم الأول على أرضه عام 1998؟',
    },
    options: {
      en: ['Didier Deschamps', 'Zinedine Zidane', 'Laurent Blanc', 'Marcel Desailly'],
      ar: ['ديدييه ديشان', 'زين الدين زيدان', 'لوران بلان', 'مارسيل ديسايي'],
    },
    correctIndex: 0,
    explanation: {
      en: 'Didier Deschamps captained Les Bleus to glory in 1998 and later coached them to the title in 2018.',
      ar: 'رفع ديشان الكأس كقائد في 1998 قبل أن يقودهم للقب مجدداً كمدرب في 2018.',
    },
  },
];

export const CATEGORIES_META = [
  {
    id: 'champions_league' as CategoryId,
    name: { en: 'Champions League', ar: 'دوري أبطال أوروبا' },
    shortName: { en: 'UCL', ar: 'الأبطال' },
    color: '#0e1e38',
    accentColor: '#38bdf8',
    borderColor: '#1e3a8a',
    icon: 'Trophy',
    badgeText: 'UEFA',
    description: {
      en: 'The highest tier of European club football stardom and magic nights.',
      ar: 'قمة المجد الكروي للأندية الأوروبية وليالي النجوم الساحرة.',
    },
  },
  {
    id: 'laliga' as CategoryId,
    name: { en: 'La Liga', ar: 'الدوري الإسباني' },
    shortName: { en: 'LaLiga', ar: 'الليغا' },
    color: '#2b0f16',
    accentColor: '#f43f5e',
    borderColor: '#9f1239',
    icon: 'Shield',
    badgeText: 'ESP',
    description: {
      en: 'El Clásico mastery, technical tiki-taka, and Spanish brilliance.',
      ar: 'كلاسيكو الأرض، سحر التيكي تاكا، وتاريخ الكرة الإسبانية.',
    },
  },
  {
    id: 'premier_league' as CategoryId,
    name: { en: 'Premier League', ar: 'الدوري الإنجليزي الممتاز' },
    shortName: { en: 'EPL', ar: 'البريميرليغ' },
    color: '#1a0e2e',
    accentColor: '#a855f7',
    borderColor: '#581c87',
    icon: 'Crown',
    badgeText: 'ENG',
    description: {
      en: 'High tempo, intense physicality, and drama in the world’s richest league.',
      ar: 'الإثارة القصوى، السرعة والندية في أقوى وأغنى دوريات العالم.',
    },
  },
  {
    id: 'serie_a' as CategoryId,
    name: { en: 'Serie A', ar: 'الدوري الإيطالي' },
    shortName: { en: 'Serie A', ar: 'الكالتشيو' },
    color: '#062024',
    accentColor: '#2dd4bf',
    borderColor: '#115e59',
    icon: 'ShieldCheck',
    badgeText: 'ITA',
    description: {
      en: 'Catenaccio tacticians, defensive dynasties, and passionate Italian heritage.',
      ar: 'الأساتذة التكتيكيون، فن الدفاع الإيطالي وشغف الكالتشيو العريق.',
    },
  },
  {
    id: 'ligue_1' as CategoryId,
    name: { en: 'Ligue 1', ar: 'الدوري الفرنسي' },
    shortName: { en: 'Ligue 1', ar: 'الليغ 1' },
    color: '#081e28',
    accentColor: '#38bdf8',
    borderColor: '#0369a1',
    icon: 'Flame',
    badgeText: 'FRA',
    description: {
      en: 'French speed, breakout wonderkids, and Paris Saint-Germain star power.',
      ar: 'مفرخة النجوم العالمية، موهبة الشباب وقوة باريس سان جيرمان.',
    },
  },
  {
    id: 'world_cup' as CategoryId,
    name: { en: 'World Cup', ar: 'كأس العالم' },
    shortName: { en: 'World Cup', ar: 'المونديال' },
    color: '#261c06',
    accentColor: '#eab308',
    borderColor: '#854d0e',
    icon: 'Globe',
    badgeText: 'FIFA',
    description: {
      en: 'The greatest stage on earth where national legends etch their names forever.',
      ar: 'المسرح الأعظم في تاريخ الرياضة حيث تُخلد أساطير الأوطان إلى الأبد.',
    },
  },
];

export const DIFFICULTY_CONFIG = {
  easy: {
    questionCount: 10,
    cost: 10,
    winReward: 20,
    passScorePercentage: 0.6, // 6 out of 10 to win
    color: 'emerald',
  },
  medium: {
    questionCount: 20,
    cost: 10,
    winReward: 20,
    passScorePercentage: 0.6, // 12 out of 20 to win
    color: 'amber',
  },
  hard: {
    questionCount: 30,
    cost: 10,
    winReward: 20,
    passScorePercentage: 0.6, // 18 out of 30 to win
    color: 'rose',
  },
};

// Shuffles an array with Fisher-Yates
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Retrieves quiz questions for selected category and difficulty
export function getQuestionsForQuiz(
  categoryId: CategoryId,
  difficulty: DifficultyLevel
): Question[] {
  const targetCount = DIFFICULTY_CONFIG[difficulty].questionCount;

  // Filter pool for this category
  const categoryPool = ALL_QUESTIONS.filter((q) => q.category === categoryId);

  // Exact match for requested difficulty first
  const exactMatch = categoryPool.filter((q) => q.difficulty === difficulty);

  if (exactMatch.length >= targetCount) {
    return shuffleArray(exactMatch).slice(0, targetCount);
  }

  // If exact match has fewer than targetCount (e.g. for medium 20 or hard 30),
  // assemble from categoryPool prioritized by difficulty
  const remainingNeeded = targetCount - exactMatch.length;
  const others = categoryPool.filter((q) => q.difficulty !== difficulty);
  const selected = [...exactMatch, ...shuffleArray(others).slice(0, remainingNeeded)];

  // If still fewer than targetCount (e.g. category pool smaller than 30),
  // borrow from general pool (e.g., Champions League & World Cup questions)
  if (selected.length < targetCount) {
    const outside = ALL_QUESTIONS.filter((q) => q.category !== categoryId);
    const filler = shuffleArray(outside).slice(0, targetCount - selected.length);
    selected.push(...filler);
  }

  return shuffleArray(selected).slice(0, targetCount);
}
