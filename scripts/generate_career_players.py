import json
import os

career_players = [
    # ==================== TIER 1: EASY (Iconic & Ultra-Famous Career Paths) ====================
    {
        "id": "ronaldo",
        "name": "Cristiano Ronaldo",
        "name_ar": "كريستيانو رونالدو",
        "nationality": "Portugal",
        "nationality_ar": "البرتغال",
        "flag": "🇵🇹",
        "photo": "/assets/players/ronaldo_full.jpg",
        "position": "Forward",
        "position_ar": "مهاجم",
        "difficulty": "easy",
        "career": [
            {"club": "Sporting CP", "club_ar": "سبورتينغ لشبونة", "years": "2002–2003", "country": "Portugal"},
            {"club": "Manchester United", "club_ar": "مانشستر يونايتد", "years": "2003–2009", "country": "England"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2009–2018", "country": "Spain"},
            {"club": "Juventus", "club_ar": "يوفنتوس", "years": "2018–2021", "country": "Italy"},
            {"club": "Manchester United", "club_ar": "مانشستر يونايتد", "years": "2021–2022", "country": "England"},
            {"club": "Al Nassr", "club_ar": "النصر", "years": "2023–present", "country": "Saudi Arabia"}
        ],
        "distractors": ["messi", "benzema", "nani", "figo"]
    },
    {
        "id": "messi",
        "name": "Lionel Messi",
        "name_ar": "ليونيل ميسي",
        "nationality": "Argentina",
        "nationality_ar": "الأرجنتين",
        "flag": "🇦🇷",
        "photo": "/assets/players/messi_full.jpg",
        "position": "Forward",
        "position_ar": "مهاجم",
        "difficulty": "easy",
        "career": [
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2004–2021", "country": "Spain"},
            {"club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "years": "2021–2023", "country": "France"},
            {"club": "Inter Miami", "club_ar": "إنتر ميامي", "years": "2023–present", "country": "USA"}
        ],
        "distractors": ["ronaldo", "neymar", "suarez", "di_maria"]
    },
    {
        "id": "haaland",
        "name": "Erling Haaland",
        "name_ar": "إيرلينغ هالاند",
        "nationality": "Norway",
        "nationality_ar": "النرويج",
        "flag": "🇳🇴",
        "photo": "/assets/players/haaland_full.jpg",
        "position": "Striker",
        "position_ar": "مهاجم صريح",
        "difficulty": "easy",
        "career": [
            {"club": "Bryne", "club_ar": "برينه", "years": "2015–2017", "country": "Norway"},
            {"club": "Molde", "club_ar": "مولده", "years": "2017–2019", "country": "Norway"},
            {"club": "Red Bull Salzburg", "club_ar": "ريد بول سالزبورغ", "years": "2019–2020", "country": "Austria"},
            {"club": "Borussia Dortmund", "club_ar": "بوروسيا دورتموند", "years": "2020–2022", "country": "Germany"},
            {"club": "Manchester City", "club_ar": "مانشستر سيتي", "years": "2022–present", "country": "England"}
        ],
        "distractors": ["odegaard", "lewandowski", "kane", "alvarez"]
    },
    {
        "id": "mbappe",
        "name": "Kylian Mbappé",
        "name_ar": "كيليان مبابي",
        "nationality": "France",
        "nationality_ar": "فرنسا",
        "flag": "🇫🇷",
        "photo": "/assets/players/mbappe_full.jpg",
        "position": "Forward",
        "position_ar": "مهاجم",
        "difficulty": "easy",
        "career": [
            {"club": "Monaco", "club_ar": "موناكو", "years": "2015–2018", "country": "France"},
            {"club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "years": "2017–2024", "country": "France"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2024–present", "country": "Spain"}
        ],
        "distractors": ["dembele", "benzema", "griezmann", "vinicius"]
    },
    {
        "id": "salah",
        "name": "Mohamed Salah",
        "name_ar": "محمد صلاح",
        "nationality": "Egypt",
        "nationality_ar": "مصر",
        "flag": "🇪🇬",
        "photo": "/assets/players/salah_full.jpg",
        "position": "Winger",
        "position_ar": "جناح هجومي",
        "difficulty": "easy",
        "career": [
            {"club": "Al Mokawloon", "club_ar": "المقاولون العرب", "years": "2010–2012", "country": "Egypt"},
            {"club": "Basel", "club_ar": "بازل", "years": "2012–2014", "country": "Switzerland"},
            {"club": "Chelsea", "club_ar": "تشيلسي", "years": "2014–2016", "country": "England"},
            {"club": "Fiorentina", "club_ar": "فيورنتينا", "years": "2015", "loan": True, "country": "Italy"},
            {"club": "Roma", "club_ar": "روما", "years": "2015–2017", "country": "Italy"},
            {"club": "Liverpool", "club_ar": "ليفربول", "years": "2017–present", "country": "England"}
        ],
        "distractors": ["debruyne", "mane", "mahrez", "elneny"]
    },
    {
        "id": "lewandowski",
        "name": "Robert Lewandowski",
        "name_ar": "روبرت ليفاندوفسكي",
        "nationality": "Poland",
        "nationality_ar": "بولندا",
        "flag": "🇵🇱",
        "photo": "/assets/players/lewandowski_full.jpg",
        "position": "Striker",
        "position_ar": "رأس حربة",
        "difficulty": "easy",
        "career": [
            {"club": "Znicz Pruszków", "club_ar": "زنيتش بروشكوف", "years": "2006–2008", "country": "Poland"},
            {"club": "Lech Poznań", "club_ar": "ليخ بوزنان", "years": "2008–2010", "country": "Poland"},
            {"club": "Borussia Dortmund", "club_ar": "بوروسيا دورتموند", "years": "2010–2014", "country": "Germany"},
            {"club": "Bayern Munich", "club_ar": "بايرن ميونخ", "years": "2014–2022", "country": "Germany"},
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2022–present", "country": "Spain"}
        ],
        "distractors": ["haaland", "aubameyang", "kane", "benzema"]
    },
    {
        "id": "zlatan",
        "name": "Zlatan Ibrahimović",
        "name_ar": "زلاتان إبراهيموفيتش",
        "nationality": "Sweden",
        "nationality_ar": "السويد",
        "flag": "🇸🇪",
        "photo": "/assets/players/zlatan_full.jpg",
        "position": "Striker",
        "position_ar": "مهاجم",
        "difficulty": "easy",
        "career": [
            {"club": "Malmö FF", "club_ar": "مالمو", "years": "1999–2001", "country": "Sweden"},
            {"club": "Ajax", "club_ar": "أياكس", "years": "2001–2004", "country": "Netherlands"},
            {"club": "Juventus", "club_ar": "يوفنتوس", "years": "2004–2006", "country": "Italy"},
            {"club": "Inter Milan", "club_ar": "إنتر ميلان", "years": "2006–2009", "country": "Italy"},
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2009–2011", "country": "Spain"},
            {"club": "AC Milan", "club_ar": "ميلان", "years": "2010–2012", "country": "Italy"},
            {"club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "years": "2012–2016", "country": "France"},
            {"club": "Manchester United", "club_ar": "مانشستر يونايتد", "years": "2016–2018", "country": "England"},
            {"club": "LA Galaxy", "club_ar": "لوس أنجلوس غالاكسي", "years": "2018–2019", "country": "USA"},
            {"club": "AC Milan", "club_ar": "ميلان", "years": "2020–2023", "country": "Italy"}
        ],
        "distractors": ["cavani", "ronaldo", "lukaku", "morata"]
    },
    {
        "id": "neymar",
        "name": "Neymar Jr",
        "name_ar": "نيمار جونيور",
        "nationality": "Brazil",
        "nationality_ar": "البرازيل",
        "flag": "🇧🇷",
        "photo": "/assets/players/neymar_full.jpg",
        "position": "Forward",
        "position_ar": "مهاجم",
        "difficulty": "easy",
        "career": [
            {"club": "Santos", "club_ar": "سانتوس", "years": "2009–2013", "country": "Brazil"},
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2013–2017", "country": "Spain"},
            {"club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "years": "2017–2023", "country": "France"},
            {"club": "Al Hilal", "club_ar": "الهلال", "years": "2023–present", "country": "Saudi Arabia"}
        ],
        "distractors": ["vinicius", "rodrygo", "messi", "ronaldinho"]
    },
    {
        "id": "bellingham",
        "name": "Jude Bellingham",
        "name_ar": "جود بيلينغهام",
        "nationality": "England",
        "nationality_ar": "إنجلترا",
        "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "photo": "/assets/players/bellingham_full.jpg",
        "position": "Midfielder",
        "position_ar": "لاعب وسط",
        "difficulty": "easy",
        "career": [
            {"club": "Birmingham City", "club_ar": "برمنغهام سيتي", "years": "2019–2020", "country": "England"},
            {"club": "Borussia Dortmund", "club_ar": "بوروسيا دورتموند", "years": "2020–2023", "country": "Germany"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2023–present", "country": "Spain"}
        ],
        "distractors": ["sancho", "foden", "palmer", "musiala"]
    },
    {
        "id": "kane",
        "name": "Harry Kane",
        "name_ar": "هاري كين",
        "nationality": "England",
        "nationality_ar": "إنجلترا",
        "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "photo": "/assets/players/kane_full.jpg",
        "position": "Striker",
        "position_ar": "مهاجم صريح",
        "difficulty": "easy",
        "career": [
            {"club": "Tottenham Hotspur", "club_ar": "توتنهام هوتسبير", "years": "2009–2023", "country": "England"},
            {"club": "Leyton Orient", "club_ar": "ليتون أورينت", "years": "2011", "loan": True, "country": "England"},
            {"club": "Millwall", "club_ar": "ميلوول", "years": "2012", "loan": True, "country": "England"},
            {"club": "Norwich City", "club_ar": "نورويتش سيتي", "years": "2012–2013", "loan": True, "country": "England"},
            {"club": "Leicester City", "club_ar": "ليستر سيتي", "years": "2013", "loan": True, "country": "England"},
            {"club": "Bayern Munich", "club_ar": "بايرن ميونخ", "years": "2023–present", "country": "Germany"}
        ],
        "distractors": ["lewandowski", "son", "rashford", "bellingham"]
    },
    {
        "id": "debruyne",
        "name": "Kevin De Bruyne",
        "name_ar": "كيفين دي بروين",
        "nationality": "Belgium",
        "nationality_ar": "بلجيكا",
        "flag": "🇧🇪",
        "photo": "/assets/players/debruyne_full.jpg",
        "position": "Midfielder",
        "position_ar": "صانع ألعاب",
        "difficulty": "easy",
        "career": [
            {"club": "Genk", "club_ar": "جينك", "years": "2008–2012", "country": "Belgium"},
            {"club": "Chelsea", "club_ar": "تشيلسي", "years": "2012–2014", "country": "England"},
            {"club": "Werder Bremen", "club_ar": "فيردر بريمن", "years": "2012–2013", "loan": True, "country": "Germany"},
            {"club": "VfL Wolfsburg", "club_ar": "فولفسبورغ", "years": "2014–2015", "country": "Germany"},
            {"club": "Manchester City", "club_ar": "مانشستر سيتي", "years": "2015–present", "country": "England"}
        ],
        "distractors": ["salah", "hazard", "courtois", "gundogan"]
    },
    {
        "id": "benzema",
        "name": "Karim Benzema",
        "name_ar": "كريم بنزيما",
        "nationality": "France",
        "nationality_ar": "فرنسا",
        "flag": "🇫🇷",
        "photo": "/assets/players/benzema_full.jpg",
        "position": "Striker",
        "position_ar": "مهاجم",
        "difficulty": "easy",
        "career": [
            {"club": "Lyon", "club_ar": "ليون", "years": "2004–2009", "country": "France"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2009–2023", "country": "Spain"},
            {"club": "Al-Ittihad", "club_ar": "الاتحاد", "years": "2023–present", "country": "Saudi Arabia"}
        ],
        "distractors": ["ronaldo", "mbappe", "higuain", "kante"]
    },
    {
        "id": "hazard",
        "name": "Eden Hazard",
        "name_ar": "إيدين هازارد",
        "nationality": "Belgium",
        "nationality_ar": "بلجيكا",
        "flag": "🇧🇪",
        "photo": "/assets/players/hazard_full.jpg",
        "position": "Winger",
        "position_ar": "جناح هجومي",
        "difficulty": "easy",
        "career": [
            {"club": "Lille", "club_ar": "ليل", "years": "2007–2012", "country": "France"},
            {"club": "Chelsea", "club_ar": "تشيلسي", "years": "2012–2019", "country": "England"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2019–2023", "country": "Spain"}
        ],
        "distractors": ["debruyne", "bale", "willian", "courtois"]
    },
    {
        "id": "bale",
        "name": "Gareth Bale",
        "name_ar": "غاريث بيل",
        "nationality": "Wales",
        "nationality_ar": "ويلز",
        "flag": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
        "photo": "/assets/players/bale_full.jpg",
        "position": "Winger",
        "position_ar": "جناح",
        "difficulty": "easy",
        "career": [
            {"club": "Southampton", "club_ar": "ساوثهامبتون", "years": "2006–2007", "country": "England"},
            {"club": "Tottenham Hotspur", "club_ar": "توتنهام هوتسبير", "years": "2007–2013", "country": "England"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2013–2022", "country": "Spain"},
            {"club": "Tottenham Hotspur", "club_ar": "توتنهام هوتسبير", "years": "2020–2021", "loan": True, "country": "England"},
            {"club": "Los Angeles FC", "club_ar": "لوس أنجلوس إف سي", "years": "2022", "country": "USA"}
        ],
        "distractors": ["modric", "kane", "hazard", "ronaldo"]
    },
    {
        "id": "kroos",
        "name": "Toni Kroos",
        "name_ar": "توني كروس",
        "nationality": "Germany",
        "nationality_ar": "ألمانيا",
        "flag": "🇩🇪",
        "photo": "/assets/players/kroos_full.jpg",
        "position": "Midfielder",
        "position_ar": "لاعب وسط",
        "difficulty": "easy",
        "career": [
            {"club": "Bayern Munich", "club_ar": "بايرن ميونخ", "years": "2007–2014", "country": "Germany"},
            {"club": "Bayer Leverkusen", "club_ar": "باير ليفركوزن", "years": "2009–2010", "loan": True, "country": "Germany"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2014–2024", "country": "Spain"}
        ],
        "distractors": ["modric", "kimmich", "schweinsteiger", "ozil"]
    },
    {
        "id": "modric",
        "name": "Luka Modrić",
        "name_ar": "لوكا مودريتش",
        "nationality": "Croatia",
        "nationality_ar": "كرواتيا",
        "flag": "🇭🇷",
        "photo": "/assets/players/modric_full.jpg",
        "position": "Midfielder",
        "position_ar": "لاعب وسط",
        "difficulty": "easy",
        "career": [
            {"club": "Dinamo Zagreb", "club_ar": "دينامو زغرب", "years": "2003–2008", "country": "Croatia"},
            {"club": "Zrinjski Mostar", "club_ar": "زرينيسكي موستار", "years": "2003–2004", "loan": True, "country": "Bosnia"},
            {"club": "Inter Zaprešić", "club_ar": "إنتر زابرشيتش", "years": "2004–2005", "loan": True, "country": "Croatia"},
            {"club": "Tottenham Hotspur", "club_ar": "توتنهام هوتسبير", "years": "2008–2012", "country": "England"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2012–present", "country": "Spain"}
        ],
        "distractors": ["kroos", "bale", "rakitic", "kovacic"]
    },

    # ==================== TIER 2: MEDIUM (Exciting, Multi-Club Journeys) ====================
    {
        "id": "lukaku",
        "name": "Romelu Lukaku",
        "name_ar": "روميلو لوكاكو",
        "nationality": "Belgium",
        "nationality_ar": "بلجيكا",
        "flag": "🇧🇪",
        "photo": "/assets/players/lukaku_full.jpg",
        "position": "Striker",
        "position_ar": "مهاجم",
        "difficulty": "medium",
        "career": [
            {"club": "Anderlecht", "club_ar": "أندرلخت", "years": "2009–2011", "country": "Belgium"},
            {"club": "Chelsea", "club_ar": "تشيلسي", "years": "2011–2014", "country": "England"},
            {"club": "West Bromwich Albion", "club_ar": "وست بروميتش ألبيون", "years": "2012–2013", "loan": True, "country": "England"},
            {"club": "Everton", "club_ar": "إيفرتون", "years": "2013–2017", "country": "England"},
            {"club": "Manchester United", "club_ar": "مانشستر يونايتد", "years": "2017–2019", "country": "England"},
            {"club": "Inter Milan", "club_ar": "إنتر ميلان", "years": "2019–2021", "country": "Italy"},
            {"club": "Chelsea", "club_ar": "تشيلسي", "years": "2021–2024", "country": "England"},
            {"club": "Inter Milan", "club_ar": "إنتر ميلان", "years": "2022–2023", "loan": True, "country": "Italy"},
            {"club": "Roma", "club_ar": "روما", "years": "2023–2024", "loan": True, "country": "Italy"},
            {"club": "Napoli", "club_ar": "نابولي", "years": "2024–present", "country": "Italy"}
        ],
        "distractors": ["morata", "benteke", "batshuayi", "drogba"]
    },
    {
        "id": "griezmann",
        "name": "Antoine Griezmann",
        "name_ar": "أنطوان غريزمان",
        "nationality": "France",
        "nationality_ar": "فرنسا",
        "flag": "🇫🇷",
        "photo": "/assets/players/griezmann_full.jpg",
        "position": "Forward",
        "position_ar": "مهاجم / صانع ألعاب",
        "difficulty": "medium",
        "career": [
            {"club": "Real Sociedad", "club_ar": "ريال سوسيداد", "years": "2009–2014", "country": "Spain"},
            {"club": "Atlético Madrid", "club_ar": "أتلتيكو مدريد", "years": "2014–2019", "country": "Spain"},
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2019–2021", "country": "Spain"},
            {"club": "Atlético Madrid", "club_ar": "أتلتيكو مدريد", "years": "2021–present", "country": "Spain"}
        ],
        "distractors": ["dembele", "benzema", "suarez", "felix"]
    },
    {
        "id": "casemiro",
        "name": "Casemiro",
        "name_ar": "كاسيميرو",
        "nationality": "Brazil",
        "nationality_ar": "البرازيل",
        "flag": "🇧🇷",
        "photo": "/assets/players/casemiro_full.jpg",
        "position": "Defensive Midfielder",
        "position_ar": "ارتكاز دفاعي",
        "difficulty": "medium",
        "career": [
            {"club": "São Paulo", "club_ar": "ساو باولو", "years": "2010–2013", "country": "Brazil"},
            {"club": "Real Madrid Castilla", "club_ar": "ريال مدريد كاستيا", "years": "2013", "country": "Spain"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2013–2022", "country": "Spain"},
            {"club": "Porto", "club_ar": "بورتو", "years": "2014–2015", "loan": True, "country": "Portugal"},
            {"club": "Manchester United", "club_ar": "مانشستر يونايتد", "years": "2022–present", "country": "England"}
        ],
        "distractors": ["fabinho", "fernandinho", "fred", "arthur"]
    },
    {
        "id": "dembele",
        "name": "Ousmane Dembélé",
        "name_ar": "عثمان ديمبيلي",
        "nationality": "France",
        "nationality_ar": "فرنسا",
        "flag": "🇫🇷",
        "photo": "/assets/players/dembele_full.jpg",
        "position": "Winger",
        "position_ar": "جناح",
        "difficulty": "medium",
        "career": [
            {"club": "Rennes", "club_ar": "رين", "years": "2015–2016", "country": "France"},
            {"club": "Borussia Dortmund", "club_ar": "بوروسيا دورتموند", "years": "2016–2017", "country": "Germany"},
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2017–2023", "country": "Spain"},
            {"club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "years": "2023–present", "country": "France"}
        ],
        "distractors": ["mbappe", "barcola", "coman", "griezmann"]
    },
    {
        "id": "hakimi",
        "name": "Achraf Hakimi",
        "name_ar": "أشرف حكيمي",
        "nationality": "Morocco",
        "nationality_ar": "المغرب",
        "flag": "🇲🇦",
        "photo": "/assets/players/hakimi_full.jpg",
        "position": "Right Back",
        "position_ar": "ظهير أيمن",
        "difficulty": "medium",
        "career": [
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2017–2020", "country": "Spain"},
            {"club": "Borussia Dortmund", "club_ar": "بوروسيا دورتموند", "years": "2018–2020", "loan": True, "country": "Germany"},
            {"club": "Inter Milan", "club_ar": "إنتر ميلان", "years": "2020–2021", "country": "Italy"},
            {"club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "years": "2021–present", "country": "France"}
        ],
        "distractors": ["cancelo", "theo", "mazraoui", "carvajal"]
    },
    {
        "id": "odegaard",
        "name": "Martin Ødegaard",
        "name_ar": "مارتن أوديغارد",
        "nationality": "Norway",
        "nationality_ar": "النرويج",
        "flag": "🇳🇴",
        "photo": "/assets/players/odegaard_full.jpg",
        "position": "Attacking Midfielder",
        "position_ar": "صانع ألعاب",
        "difficulty": "medium",
        "career": [
            {"club": "Strømsgodset", "club_ar": "سترومسغودست", "years": "2014–2015", "country": "Norway"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2015–2021", "country": "Spain"},
            {"club": "Heerenveen", "club_ar": "هيرينفين", "years": "2017–2018", "loan": True, "country": "Netherlands"},
            {"club": "Vitesse", "club_ar": "فيتيسه", "years": "2018–2019", "loan": True, "country": "Netherlands"},
            {"club": "Real Sociedad", "club_ar": "ريال سوسيداد", "years": "2019–2020", "loan": True, "country": "Spain"},
            {"club": "Arsenal", "club_ar": "أرسنال", "years": "2021–present", "country": "England"}
        ],
        "distractors": ["haaland", "ozil", "ceballos", "saka"]
    },
    {
        "id": "son",
        "name": "Son Heung-min",
        "name_ar": "سون هيونغ مين",
        "nationality": "South Korea",
        "nationality_ar": "كوريا الجنوبية",
        "flag": "🇰🇷",
        "photo": "/assets/players/son_full.jpg",
        "position": "Forward",
        "position_ar": "مهاجم",
        "difficulty": "medium",
        "career": [
            {"club": "Hamburger SV", "club_ar": "هامبورغ", "years": "2010–2013", "country": "Germany"},
            {"club": "Bayer Leverkusen", "club_ar": "باير ليفركوزن", "years": "2013–2015", "country": "Germany"},
            {"club": "Tottenham Hotspur", "club_ar": "توتنهام هوتسبير", "years": "2015–present", "country": "England"}
        ],
        "distractors": ["kane", "mitoma", "park_ji_sung", "minamino"]
    },
    {
        "id": "pulisic",
        "name": "Christian Pulisic",
        "name_ar": "كريستيان بوليسيتش",
        "nationality": "USA",
        "nationality_ar": "الولايات المتحدة",
        "flag": "🇺🇸",
        "photo": "/assets/players/pulisic_full.jpg",
        "position": "Winger",
        "position_ar": "جناح هجومي",
        "difficulty": "medium",
        "career": [
            {"club": "Borussia Dortmund", "club_ar": "بوروسيا دورتموند", "years": "2016–2019", "country": "Germany"},
            {"club": "Chelsea", "club_ar": "تشيلسي", "years": "2019–2023", "country": "England"},
            {"club": "AC Milan", "club_ar": "ميلان", "years": "2023–present", "country": "Italy"}
        ],
        "distractors": ["leao", "chiesa", "reyna", "havertz"]
    },
    {
        "id": "chiesa",
        "name": "Federico Chiesa",
        "name_ar": "فيديريكو كييزا",
        "nationality": "Italy",
        "nationality_ar": "إيطاليا",
        "flag": "🇮🇹",
        "photo": "/assets/players/chiesa_full.jpg",
        "position": "Winger",
        "position_ar": "جناح",
        "difficulty": "medium",
        "career": [
            {"club": "Fiorentina", "club_ar": "فيورنتينا", "years": "2016–2020", "country": "Italy"},
            {"club": "Juventus", "club_ar": "يوفنتوس", "years": "2020–2024", "country": "Italy"},
            {"club": "Liverpool", "club_ar": "ليفربول", "years": "2024–present", "country": "England"}
        ],
        "distractors": ["vlahovic", "barella", "dybala", "insigne"]
    },
    {
        "id": "vlahovic",
        "name": "Dušan Vlahović",
        "name_ar": "دوشان فلاهوفيتش",
        "nationality": "Serbia",
        "nationality_ar": "صربيا",
        "flag": "🇷🇸",
        "photo": "/assets/players/vlahovic_full.jpg",
        "position": "Striker",
        "position_ar": "مهاجم",
        "difficulty": "medium",
        "career": [
            {"club": "Partizan Belgrade", "club_ar": "بارتيزان بلغراد", "years": "2016–2018", "country": "Serbia"},
            {"club": "Fiorentina", "club_ar": "فيورنتينا", "years": "2018–2022", "country": "Italy"},
            {"club": "Juventus", "club_ar": "يوفنتوس", "years": "2022–present", "country": "Italy"}
        ],
        "distractors": ["chiesa", "mitrovic", "milinkovic_savic", "sesko"]
    },
    {
        "id": "xhaka",
        "name": "Granit Xhaka",
        "name_ar": "غرانيت تشاكا",
        "nationality": "Switzerland",
        "nationality_ar": "سويسرا",
        "flag": "🇨🇭",
        "photo": "/assets/players/xhaka_full.jpg",
        "position": "Midfielder",
        "position_ar": "لاعب وسط",
        "difficulty": "medium",
        "career": [
            {"club": "Basel", "club_ar": "بازل", "years": "2010–2012", "country": "Switzerland"},
            {"club": "Borussia Mönchengladbach", "club_ar": "بوروسيا مونشنغلادباخ", "years": "2012–2016", "country": "Germany"},
            {"club": "Arsenal", "club_ar": "أرسنال", "years": "2016–2023", "country": "England"},
            {"club": "Bayer Leverkusen", "club_ar": "باير ليفركوزن", "years": "2023–present", "country": "Germany"}
        ],
        "distractors": ["shaqiri", "wirtz", "partey", "rodri"]
    },
    {
        "id": "sane",
        "name": "Leroy Sané",
        "name_ar": "ليروي ساني",
        "nationality": "Germany",
        "nationality_ar": "ألمانيا",
        "flag": "🇩🇪",
        "photo": "/assets/players/sane_full.jpg",
        "position": "Winger",
        "position_ar": "جناح هجومي",
        "difficulty": "medium",
        "career": [
            {"club": "Schalke 04", "club_ar": "شالكه 04", "years": "2014–2016", "country": "Germany"},
            {"club": "Manchester City", "club_ar": "مانشستر سيتي", "years": "2016–2020", "country": "England"},
            {"club": "Bayern Munich", "club_ar": "بايرن ميونخ", "years": "2020–present", "country": "Germany"}
        ],
        "distractors": ["gnabry", "sterling", "musiala", "coman"]
    },
    {
        "id": "dybala",
        "name": "Paulo Dybala",
        "name_ar": "باولو ديبالا",
        "nationality": "Argentina",
        "nationality_ar": "الأرجنتين",
        "flag": "🇦🇷",
        "photo": "/assets/players/dybala_full.jpg",
        "position": "Forward",
        "position_ar": "مهاجم ثانٍ",
        "difficulty": "medium",
        "career": [
            {"club": "Instituto de Córdoba", "club_ar": "إنستيتوتو دي كوردوبا", "years": "2011–2012", "country": "Argentina"},
            {"club": "Palermo", "club_ar": "باليرمو", "years": "2012–2015", "country": "Italy"},
            {"club": "Juventus", "club_ar": "يوفنتوس", "years": "2015–2022", "country": "Italy"},
            {"club": "Roma", "club_ar": "روما", "years": "2022–present", "country": "Italy"}
        ],
        "distractors": ["lautaro", "higuain", "lukaku", "di_maria"]
    },
    {
        "id": "nunez",
        "name": "Darwin Núñez",
        "name_ar": "داروين نونيز",
        "nationality": "Uruguay",
        "nationality_ar": "أوروغواي",
        "flag": "🇺🇾",
        "photo": "/assets/players/nunez_full.jpg",
        "position": "Striker",
        "position_ar": "مهاجم",
        "difficulty": "medium",
        "career": [
            {"club": "Peñarol", "club_ar": "بينارول", "years": "2017–2019", "country": "Uruguay"},
            {"club": "Almería", "club_ar": "ألميريا", "years": "2019–2020", "country": "Spain"},
            {"club": "Benfica", "club_ar": "بنفيكا", "years": "2020–2022", "country": "Portugal"},
            {"club": "Liverpool", "club_ar": "ليفربول", "years": "2022–present", "country": "England"}
        ],
        "distractors": ["suarez", "cavani", "diaz", "gakpo"]
    },
    {
        "id": "vandijk",
        "name": "Virgil van Dijk",
        "name_ar": "فيرجيل فان دايك",
        "nationality": "Netherlands",
        "nationality_ar": "هولندا",
        "flag": "🇳🇱",
        "photo": "/assets/players/vandijk_full.jpg",
        "position": "Centre Back",
        "position_ar": "قلب دفاع",
        "difficulty": "medium",
        "career": [
            {"club": "Groningen", "club_ar": "خرونينغن", "years": "2011–2013", "country": "Netherlands"},
            {"club": "Celtic", "club_ar": "سيلتيك", "years": "2013–2015", "country": "Scotland"},
            {"club": "Southampton", "club_ar": "ساوثهامبتون", "years": "2015–2018", "country": "England"},
            {"club": "Liverpool", "club_ar": "ليفربول", "years": "2018–present", "country": "England"}
        ],
        "distractors": ["deligt", "ake", "konate", "saliba"]
    },
    {
        "id": "bruno",
        "name": "Bruno Fernandes",
        "name_ar": "برونو فيرنانديز",
        "nationality": "Portugal",
        "nationality_ar": "البرتغال",
        "flag": "🇵🇹",
        "photo": "/assets/players/bruno_full.jpg",
        "position": "Attacking Midfielder",
        "position_ar": "صانع ألعاب",
        "difficulty": "medium",
        "career": [
            {"club": "Novara", "club_ar": "نوفارا", "years": "2012–2013", "country": "Italy"},
            {"club": "Udinese", "club_ar": "أودينيزي", "years": "2013–2016", "country": "Italy"},
            {"club": "Sampdoria", "club_ar": "سامبدوريا", "years": "2016–2017", "country": "Italy"},
            {"club": "Sporting CP", "club_ar": "سبورتينغ لشبونة", "years": "2017–2020", "country": "Portugal"},
            {"club": "Manchester United", "club_ar": "مانشستر يونايتد", "years": "2020–present", "country": "England"}
        ],
        "distractors": ["bernardo_silva", "pogba", "eriksen", "mount"]
    },

    # ==================== TIER 3: HARD (Tricky Fades, Youth Academies & Subtle Steps) ====================
    {
        "id": "palmer",
        "name": "Cole Palmer",
        "name_ar": "كول بالمر",
        "nationality": "England",
        "nationality_ar": "إنجلترا",
        "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "photo": "/assets/players/palmer_full.jpg",
        "position": "Attacking Midfielder",
        "position_ar": "صانع ألعاب",
        "difficulty": "hard",
        "career": [
            {"club": "Manchester City", "club_ar": "مانشستر سيتي", "years": "2020–2023", "country": "England"},
            {"club": "Chelsea", "club_ar": "تشيلسي", "years": "2023–present", "country": "England"}
        ],
        "distractors": ["foden", "madueke", "saka", "gordon"]
    },
    {
        "id": "wirtz",
        "name": "Florian Wirtz",
        "name_ar": "فلوريان فيرتز",
        "nationality": "Germany",
        "nationality_ar": "ألمانيا",
        "flag": "🇩🇪",
        "photo": "/assets/players/wirtz_full.jpg",
        "position": "Attacking Midfielder",
        "position_ar": "صانع ألعاب",
        "difficulty": "hard",
        "career": [
            {"club": "1. FC Köln (Youth)", "club_ar": "كولن (ناشئين)", "years": "2010–2020", "country": "Germany"},
            {"club": "Bayer Leverkusen", "club_ar": "باير ليفركوزن", "years": "2020–present", "country": "Germany"}
        ],
        "distractors": ["musiala", "havertz", "brandts", "adeyemi"]
    },
    {
        "id": "camavinga",
        "name": "Eduardo Camavinga",
        "name_ar": "إدواردو كامافينغا",
        "nationality": "France",
        "nationality_ar": "فرنسا",
        "flag": "🇫🇷",
        "photo": "/assets/players/camavinga_full.jpg",
        "position": "Midfielder",
        "position_ar": "لاعب وسط",
        "difficulty": "hard",
        "career": [
            {"club": "Rennes", "club_ar": "رين", "years": "2019–2021", "country": "France"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2021–present", "country": "Spain"}
        ],
        "distractors": ["tchouameni", "dembele", "zaireemery", "mendy"]
    },
    {
        "id": "theo",
        "name": "Theo Hernández",
        "name_ar": "ثيو هيرنانديز",
        "nationality": "France",
        "nationality_ar": "فرنسا",
        "flag": "🇫🇷",
        "photo": "/assets/players/theo_full.jpg",
        "position": "Left Back",
        "position_ar": "ظهير أيسر",
        "difficulty": "hard",
        "career": [
            {"club": "Atlético Madrid B", "club_ar": "أتلتيكو مدريد ب", "years": "2015–2017", "country": "Spain"},
            {"club": "Alavés", "club_ar": "ديبورتيفو ألافيس", "years": "2016–2017", "loan": True, "country": "Spain"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2017–2019", "country": "Spain"},
            {"club": "Real Sociedad", "club_ar": "ريال سوسيداد", "years": "2018–2019", "loan": True, "country": "Spain"},
            {"club": "AC Milan", "club_ar": "ميلان", "years": "2019–present", "country": "Italy"}
        ],
        "distractors": ["lucas_hernandez", "hakimi", "mendy", "digne"]
    },
    {
        "id": "kounde",
        "name": "Jules Koundé",
        "name_ar": "جول كوندي",
        "nationality": "France",
        "nationality_ar": "فرنسا",
        "flag": "🇫🇷",
        "photo": "/assets/players/kounde_full.jpg",
        "position": "Defender",
        "position_ar": "مدافع",
        "difficulty": "hard",
        "career": [
            {"club": "Bordeaux", "club_ar": "بوردو", "years": "2017–2019", "country": "France"},
            {"club": "Sevilla", "club_ar": "إشبيلية", "years": "2019–2022", "country": "Spain"},
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2022–present", "country": "Spain"}
        ],
        "distractors": ["upamecano", "konate", "saliba", "diego_carlos"]
    },
    {
        "id": "leao",
        "name": "Rafael Leão",
        "name_ar": "رفائيل لياو",
        "nationality": "Portugal",
        "nationality_ar": "البرتغال",
        "flag": "🇵🇹",
        "photo": "/assets/players/leao_full.jpg",
        "position": "Winger",
        "position_ar": "جناح",
        "difficulty": "hard",
        "career": [
            {"club": "Sporting CP", "club_ar": "سبورتينغ لشبونة", "years": "2017–2018", "country": "Portugal"},
            {"club": "Lille", "club_ar": "ليل", "years": "2018–2019", "country": "France"},
            {"club": "AC Milan", "club_ar": "ميلان", "years": "2019–present", "country": "Italy"}
        ],
        "distractors": ["osimhen", "felix", "jota", "pulisic"]
    },
    {
        "id": "barcola",
        "name": "Bradley Barcola",
        "name_ar": "برادلي باركولا",
        "nationality": "France",
        "nationality_ar": "فرنسا",
        "flag": "🇫🇷",
        "photo": "/assets/players/barcola_full.jpg",
        "position": "Winger",
        "position_ar": "جناح",
        "difficulty": "hard",
        "career": [
            {"club": "Lyon", "club_ar": "ليون", "years": "2021–2023", "country": "France"},
            {"club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "years": "2023–present", "country": "France"}
        ],
        "distractors": ["dembele", "cherki", "zaireemery", "olise"]
    },
    {
        "id": "davies",
        "name": "Alphonso Davies",
        "name_ar": "ألفونسو ديفيز",
        "nationality": "Canada",
        "nationality_ar": "كندا",
        "flag": "🇨🇦",
        "photo": "/assets/players/davies_full.jpg",
        "position": "Left Back",
        "position_ar": "ظهير أيسر",
        "difficulty": "hard",
        "career": [
            {"club": "Whitecaps FC 2", "club_ar": "وايتكابس 2", "years": "2016", "country": "Canada"},
            {"club": "Vancouver Whitecaps", "club_ar": "فانكوفر وايتكابس", "years": "2016–2018", "country": "Canada"},
            {"club": "Bayern Munich", "club_ar": "بايرن ميونخ", "years": "2019–present", "country": "Germany"}
        ],
        "distractors": ["david", "theo", "mendy", "guerreiro"]
    },
    {
        "id": "david",
        "name": "Jonathan David",
        "name_ar": "جوناثان ديفيد",
        "nationality": "Canada",
        "nationality_ar": "كندا",
        "flag": "🇨🇦",
        "photo": "/assets/players/david_full.jpg",
        "position": "Striker",
        "position_ar": "مهاجم",
        "difficulty": "hard",
        "career": [
            {"club": "Gent", "club_ar": "جينت", "years": "2018–2020", "country": "Belgium"},
            {"club": "Lille", "club_ar": "ليل", "years": "2020–present", "country": "France"}
        ],
        "distractors": ["davies", "osimhen", "leao", "openda"]
    },
    {
        "id": "musiala",
        "name": "Jamal Musiala",
        "name_ar": "جمال موسيالا",
        "nationality": "Germany",
        "nationality_ar": "ألمانيا",
        "flag": "🇩🇪",
        "photo": "/assets/players/musiala_full.jpg",
        "position": "Attacking Midfielder",
        "position_ar": "صانع ألعاب",
        "difficulty": "hard",
        "career": [
            {"club": "Chelsea (Youth)", "club_ar": "تشيلسي (الفئات السنية)", "years": "2011–2019", "country": "England"},
            {"club": "Bayern Munich II", "club_ar": "بايرن ميونخ الثاني", "years": "2019–2020", "country": "Germany"},
            {"club": "Bayern Munich", "club_ar": "بايرن ميونخ", "years": "2020–present", "country": "Germany"}
        ],
        "distractors": ["wirtz", "bellingham", "foden", "sancho"]
    },
    {
        "id": "grealish",
        "name": "Jack Grealish",
        "name_ar": "جاك غريليش",
        "nationality": "England",
        "nationality_ar": "إنجلترا",
        "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "photo": "/assets/players/grealish_full.jpg",
        "position": "Winger",
        "position_ar": "جناح",
        "difficulty": "hard",
        "career": [
            {"club": "Aston Villa", "club_ar": "أستون فيلا", "years": "2012–2021", "country": "England"},
            {"club": "Notts County", "club_ar": "نوتس كاونتي", "years": "2013–2014", "loan": True, "country": "England"},
            {"club": "Manchester City", "club_ar": "مانشستر سيتي", "years": "2021–present", "country": "England"}
        ],
        "distractors": ["foden", "maddison", "mount", "bowen"]
    },
    {
        "id": "foden",
        "name": "Phil Foden",
        "name_ar": "فيل فودين",
        "nationality": "England",
        "nationality_ar": "إنجلترا",
        "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "photo": "/assets/players/foden_full.jpg",
        "position": "Midfielder / Winger",
        "position_ar": "صانع ألعاب / جناح",
        "difficulty": "hard",
        "career": [
            {"club": "Manchester City", "club_ar": "مانشستر سيتي", "years": "2017–present", "country": "England"}
        ],
        "distractors": ["palmer", "grealish", "saka", "bellingham"]
    },
    {
        "id": "saka",
        "name": "Bukayo Saka",
        "name_ar": "بوكايو ساكا",
        "nationality": "England",
        "nationality_ar": "إنجلترا",
        "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "photo": "/assets/players/saka_full.jpg",
        "position": "Winger",
        "position_ar": "جناح أيمن",
        "difficulty": "hard",
        "career": [
            {"club": "Arsenal", "club_ar": "أرسنال", "years": "2018–present", "country": "England"}
        ],
        "distractors": ["foden", "palmer", "rashford", "sancho"]
    },
    {
        "id": "vinicius",
        "name": "Vinícius Júnior",
        "name_ar": "فينيسيوس جونيور",
        "nationality": "Brazil",
        "nationality_ar": "البرازيل",
        "flag": "🇧🇷",
        "photo": "/assets/players/vinicius_full.jpg",
        "position": "Winger",
        "position_ar": "جناح أيسر",
        "difficulty": "hard",
        "career": [
            {"club": "Flamengo", "club_ar": "فلامنغو", "years": "2017–2018", "country": "Brazil"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2018–present", "country": "Spain"}
        ],
        "distractors": ["rodrygo", "neymar", "paqueta", "martinelli"]
    },
    {
        "id": "rodrygo",
        "name": "Rodrygo Goes",
        "name_ar": "رودريغو غوس",
        "nationality": "Brazil",
        "nationality_ar": "البرازيل",
        "flag": "🇧🇷",
        "photo": "/assets/players/rodrygo_full.jpg",
        "position": "Forward",
        "position_ar": "مهاجم",
        "difficulty": "hard",
        "career": [
            {"club": "Santos", "club_ar": "سانتوس", "years": "2017–2019", "country": "Brazil"},
            {"club": "Real Madrid", "club_ar": "ريال مدريد", "years": "2019–present", "country": "Spain"}
        ],
        "distractors": ["vinicius", "neymar", "endrick", "antony"]
    },
    {
        "id": "pedri",
        "name": "Pedri",
        "name_ar": "بيدري",
        "nationality": "Spain",
        "nationality_ar": "إسبانيا",
        "flag": "🇪🇸",
        "photo": "/assets/players/pedri_full.jpg",
        "position": "Midfielder",
        "position_ar": "لاعب وسط",
        "difficulty": "hard",
        "career": [
            {"club": "Las Palmas", "club_ar": "لاس بالماس", "years": "2019–2020", "country": "Spain"},
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2020–present", "country": "Spain"}
        ],
        "distractors": ["gavi", "yamal", "iniesta", "olmo"]
    },
    {
        "id": "yamal",
        "name": "Lamine Yamal",
        "name_ar": "لامين يامال",
        "nationality": "Spain",
        "nationality_ar": "إسبانيا",
        "flag": "🇪🇸",
        "photo": "/assets/players/yamal_full.jpg",
        "position": "Winger",
        "position_ar": "جناح",
        "difficulty": "hard",
        "career": [
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2023–present", "country": "Spain"}
        ],
        "distractors": ["pedri", "gavi", "williams", "fati"]
    },
    {
        "id": "barella",
        "name": "Nicolò Barella",
        "name_ar": "نيكولو باريلا",
        "nationality": "Italy",
        "nationality_ar": "إيطاليا",
        "flag": "🇮🇹",
        "photo": "/assets/players/barella_full.jpg",
        "position": "Midfielder",
        "position_ar": "لاعب وسط",
        "difficulty": "hard",
        "career": [
            {"club": "Cagliari", "club_ar": "كالياري", "years": "2014–2019", "country": "Italy"},
            {"club": "Como", "club_ar": "كومو", "years": "2016", "loan": True, "country": "Italy"},
            {"club": "Inter Milan", "club_ar": "إنتر ميلان", "years": "2019–present", "country": "Italy"}
        ],
        "distractors": ["chiesa", "tonali", "verratti", "frattesi"]
    },
    {
        "id": "lautaro",
        "name": "Lautaro Martínez",
        "name_ar": "لاوتارو مارتينيز",
        "nationality": "Argentina",
        "nationality_ar": "الأرجنتين",
        "flag": "🇦🇷",
        "photo": "/assets/players/lautaro_full.jpg",
        "position": "Striker",
        "position_ar": "مهاجم",
        "difficulty": "hard",
        "career": [
            {"club": "Racing Club", "club_ar": "راسينغ كلوب", "years": "2015–2018", "country": "Argentina"},
            {"club": "Inter Milan", "club_ar": "إنتر ميلان", "years": "2018–present", "country": "Italy"}
        ],
        "distractors": ["alvarez", "icardi", "dybala", "milito"]
    },
    {
        "id": "kimmich",
        "name": "Joshua Kimmich",
        "name_ar": "جوشوا كيميش",
        "nationality": "Germany",
        "nationality_ar": "ألمانيا",
        "flag": "🇩🇪",
        "photo": "/assets/players/kimmich_full.jpg",
        "position": "Midfielder / Right Back",
        "position_ar": "لاعب وسط / ظهير",
        "difficulty": "hard",
        "career": [
            {"club": "RB Leipzig", "club_ar": "آر بي لايبزيغ", "years": "2013–2015", "country": "Germany"},
            {"club": "Bayern Munich", "club_ar": "بايرن ميونخ", "years": "2015–present", "country": "Germany"}
        ],
        "distractors": ["kroos", "goretzka", "lahm", "muller"]
    },
    {
        "id": "marquinhos",
        "name": "Marquinhos",
        "name_ar": "ماركينيوس",
        "nationality": "Brazil",
        "nationality_ar": "البرازيل",
        "flag": "🇧🇷",
        "photo": "/assets/players/marquinhos_full.jpg",
        "position": "Centre Back",
        "position_ar": "قلب دفاع",
        "difficulty": "hard",
        "career": [
            {"club": "Corinthians", "club_ar": "كورينثيانز", "years": "2012", "country": "Brazil"},
            {"club": "Roma", "club_ar": "روما", "years": "2012–2013", "country": "Italy"},
            {"club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "years": "2013–present", "country": "France"}
        ],
        "distractors": ["thiago_silva", "militao", "gabriel", "danilo"]
    },
    {
        "id": "zaireemery",
        "name": "Warren Zaïre-Emery",
        "name_ar": "وارن زاير-إيمري",
        "nationality": "France",
        "nationality_ar": "فرنسا",
        "flag": "🇫🇷",
        "photo": "/assets/players/zaireemery_full.jpg",
        "position": "Midfielder",
        "position_ar": "لاعب وسط",
        "difficulty": "hard",
        "career": [
            {"club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "years": "2022–present", "country": "France"}
        ],
        "distractors": ["camavinga", "barcola", "tchouameni", "rabiot"]
    },
    {
        "id": "rashford",
        "name": "Marcus Rashford",
        "name_ar": "ماركوس راشفورد",
        "nationality": "England",
        "nationality_ar": "إنجلترا",
        "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "photo": "/assets/players/rashford_full.jpg",
        "position": "Forward",
        "position_ar": "مهاجم / جناح",
        "difficulty": "hard",
        "career": [
            {"club": "Manchester United", "club_ar": "مانشستر يونايتد", "years": "2015–present", "country": "England"}
        ],
        "distractors": ["greenwood", "sancho", "saka", "sterling"]
    },
    {
        "id": "dejong",
        "name": "Frenkie de Jong",
        "name_ar": "فرينكي دي يونغ",
        "nationality": "Netherlands",
        "nationality_ar": "هولندا",
        "flag": "🇳🇱",
        "photo": "/assets/players/dejong_full.jpg",
        "position": "Midfielder",
        "position_ar": "لاعب وسط",
        "difficulty": "hard",
        "career": [
            {"club": "Willem II", "club_ar": "فيليم 2", "years": "2014–2015", "country": "Netherlands"},
            {"club": "Ajax", "club_ar": "أياكس", "years": "2015–2019", "country": "Netherlands"},
            {"club": "Barcelona", "club_ar": "برشلونة", "years": "2019–present", "country": "Spain"}
        ],
        "distractors": ["deligt", "vandijk", "koopmeiners", "pedri"]
    }
]

out_path = os.path.join("src", "data", "careerPlayers.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(career_players, f, ensure_ascii=False, indent=2)

print(f"Generated {len(career_players)} career players in {out_path}")
