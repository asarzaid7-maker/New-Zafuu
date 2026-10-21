import urllib.request
import urllib.parse
import json
import os
import subprocess

# Roster of football stars active 2020 onwards across Premier League, La Liga, Serie A, Bundesliga, Ligue 1
players_list = [
    # --- EASY LEVEL (Super recognizable, iconic hairstyles) ---
    {"id": "haaland", "name": "Erling Haaland", "name_ar": "إيرلينغ هالاند", "page": "Erling_Haaland", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Manchester City", "club_ar": "مانشستر سيتي", "difficulty": "easy", "hair_style": "Golden ponytail / man bun", "hair_style_ar": "شعر أشقر طويل مربوط على شكل ذيل حصان"},
    {"id": "salah", "name": "Mohamed Salah", "name_ar": "محمد صلاح", "page": "Mohamed_Salah", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Liverpool", "club_ar": "ليفربول", "difficulty": "easy", "hair_style": "Voluminous curly afro", "hair_style_ar": "شعر أفرو مموج وكثيف"},
    {"id": "grealish", "name": "Jack Grealish", "name_ar": "جاك غريليش", "page": "Jack_Grealish", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Manchester City", "club_ar": "مانشستر سيتي", "difficulty": "easy", "hair_style": "Slicked-back undercut with hairband", "hair_style_ar": "قصة أندركت مسحوبة للخلف مع طوق الشعر"},
    {"id": "vandijk", "name": "Virgil van Dijk", "name_ar": "فيرجيل فان دايك", "page": "Virgil_van_Dijk", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Liverpool", "club_ar": "ليفربول", "difficulty": "easy", "hair_style": "Samurai topknot bun", "hair_style_ar": "كعكة ساموراي مشدودة للخلف"},
    {"id": "camavinga", "name": "Eduardo Camavinga", "name_ar": "إدواردو كامافينغا", "page": "Eduardo_Camavinga", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Real Madrid", "club_ar": "ريال مدريد", "difficulty": "easy", "hair_style": "Twisted dreadlocks", "hair_style_ar": "جدائل ديدلوكس ملفوفة ومميزة"},
    {"id": "kounde", "name": "Jules Koundé", "name_ar": "جول كوندي", "page": "Jules_Koundé", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Barcelona", "club_ar": "برشلونة", "difficulty": "easy", "hair_style": "Signature afro cornrows", "hair_style_ar": "ضفائر أفريقية مرتفعة"},
    {"id": "griezmann", "name": "Antoine Griezmann", "name_ar": "أنطوان غريزمان", "page": "Antoine_Griezmann", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Atlético Madrid", "club_ar": "أتلتيكو مدريد", "difficulty": "easy", "hair_style": "Dyed blonde buzz crop", "hair_style_ar": "قصة شقراء مصبوغة وقصيرة"},
    {"id": "modric", "name": "Luka Modrić", "name_ar": "لوكا مودريتش", "page": "Luka_Modrić", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Real Madrid", "club_ar": "ريال مدريد", "difficulty": "easy", "hair_style": "Flowing locks with thin headband", "hair_style_ar": "خصلات شعر منسدلة مع طوق رفيع"},
    {"id": "leao", "name": "Rafael Leão", "name_ar": "رافايل لياو", "page": "Rafael_Leão", "league": "Serie A", "league_ar": "الدوري الإيطالي", "club": "AC Milan", "club_ar": "إيه سي ميلان", "difficulty": "easy", "hair_style": "Medium swept dreadlocks", "hair_style_ar": "جدائل ديدلوكس جانبية"},
    {"id": "theo", "name": "Theo Hernández", "name_ar": "ثيو هيرنانديز", "page": "Theo_Hernández", "league": "Serie A", "league_ar": "الدوري الإيطالي", "club": "AC Milan", "club_ar": "إيه سي ميلان", "difficulty": "easy", "hair_style": "Platinum bleached crop", "hair_style_ar": "شعر بلاتيني مصبوغ"},
    {"id": "sane", "name": "Leroy Sané", "name_ar": "ليروي ساني", "page": "Leroy_Sané", "league": "Bundesliga", "league_ar": "الدوري الألماني", "club": "Bayern Munich", "club_ar": "بايرن ميونخ", "difficulty": "easy", "hair_style": "Voluminous afro curls", "hair_style_ar": "شعر أفرو كثيف ومجعد"},
    {"id": "barcola", "name": "Bradley Barcola", "name_ar": "برادلي باركولا", "page": "Bradley_Barcola", "league": "Ligue 1", "league_ar": "الدوري الفرنسي", "club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "difficulty": "easy", "hair_style": "Long micro-braids", "hair_style_ar": "جدائل ميكرو طويلة متدلية"},
    {"id": "mbappe", "name": "Kylian Mbappé", "name_ar": "كيليان مبابي", "page": "Kylian_Mbappé", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Real Madrid", "club_ar": "ريال مدريد", "difficulty": "easy", "hair_style": "Clean uniform buzzcut", "hair_style_ar": "قصة بازكت قصيرة ونظيفة جداً"},
    {"id": "saka", "name": "Bukayo Saka", "name_ar": "بوكايو ساكا", "page": "Bukayo_Saka", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Arsenal", "club_ar": "أرسنال", "difficulty": "easy", "hair_style": "Tight textured curly top fade", "hair_style_ar": "تدرج جانبي مع خصلات كيرلي متراصة"},
    {"id": "debruyne", "name": "Kevin De Bruyne", "name_ar": "كيفين دي بروين", "page": "Kevin_De_Bruyne", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Manchester City", "club_ar": "مانشستر سيتي", "difficulty": "easy", "hair_style": "Swept ginger-blonde undercut", "hair_style_ar": "قصة شقراء مسحوبة للأعلى"},
    {"id": "son", "name": "Son Heung-min", "name_ar": "سون هيونغ مين", "page": "Son_Heung-min", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Tottenham Hotspur", "club_ar": "توتنهام هوتسبير", "difficulty": "easy", "hair_style": "Sleek parted fringe", "hair_style_ar": "غرة مقسومة ناعمة وأنيقة"},

    # --- MEDIUM LEVEL (Moderately challenging, stylish fades & modern cuts) ---
    {"id": "vinicius", "name": "Vinícius Júnior", "name_ar": "فينيسيوس جونيور", "page": "Vinícius_Júnior", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Real Madrid", "club_ar": "ريال مدريد", "difficulty": "medium", "hair_style": "High taper fade with curly top", "hair_style_ar": "تدرج مرتفع مع خصلات كيرلي"},
    {"id": "dybala", "name": "Paulo Dybala", "name_ar": "باولو ديبالا", "page": "Paulo_Dybala", "league": "Serie A", "league_ar": "الدوري الإيطالي", "club": "AS Roma", "club_ar": "روما", "difficulty": "medium", "hair_style": "Textured undercut fringe", "hair_style_ar": "أندركت إيطالي مع غرة أمامية"},
    {"id": "lautaro", "name": "Lautaro Martínez", "name_ar": "لاوتارو مارتينيز", "page": "Lautaro_Martínez", "league": "Serie A", "league_ar": "الدوري الإيطالي", "club": "Inter Milan", "club_ar": "إنتر ميلان", "difficulty": "medium", "hair_style": "Faux hawk with shaved temples", "hair_style_ar": "قصة فو هوك حادة في الوسط"},
    {"id": "kane", "name": "Harry Kane", "name_ar": "هاري كين", "page": "Harry_Kane", "league": "Bundesliga", "league_ar": "الدوري الألماني", "club": "Bayern Munich", "club_ar": "بايرن ميونخ", "difficulty": "medium", "hair_style": "Side-parted gentleman crop", "hair_style_ar": "قصة كلاسيكية بفرق جانبي"},
    {"id": "wirtz", "name": "Florian Wirtz", "name_ar": "فلوريان فيرتز", "page": "Florian_Wirtz", "league": "Bundesliga", "league_ar": "الدوري الألماني", "club": "Bayer Leverkusen", "club_ar": "باير ليفركوزن", "difficulty": "medium", "hair_style": "Modern German tapered crop", "hair_style_ar": "قصة قصيرة متدرجة من الجوانب"},
    {"id": "dembele", "name": "Ousmane Dembélé", "name_ar": "عثمان ديمبيلي", "page": "Ousmane_Dembélé", "league": "Ligue 1", "league_ar": "الدوري الفرنسي", "club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "difficulty": "medium", "hair_style": "High skin fade buzz", "hair_style_ar": "حلاقة ناعمة بتدرج جلدي"},
    {"id": "hakimi", "name": "Achraf Hakimi", "name_ar": "أشرف حكيمي", "page": "Achraf_Hakimi", "league": "Ligue 1", "league_ar": "الدوري الفرنسي", "club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "difficulty": "medium", "hair_style": "Textured crop with temple taper", "hair_style_ar": "تدرج خفيف مع قصة عصرية"},
    {"id": "bellingham", "name": "Jude Bellingham", "name_ar": "جود بيلينغهام", "page": "Jude_Bellingham", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Real Madrid", "club_ar": "ريال مدريد", "difficulty": "medium", "hair_style": "Neat low-taper afro fade", "hair_style_ar": "تدرج منخفض مع شعر كيرلي منسق"},
    {"id": "lewandowski", "name": "Robert Lewandowski", "name_ar": "روبرت ليفاندوفسكي", "page": "Robert_Lewandowski", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Barcelona", "club_ar": "برشلونة", "difficulty": "medium", "hair_style": "Textured pompadour comb", "hair_style_ar": "بومبادور كلاسيكي مرفوع"},
    {"id": "foden", "name": "Phil Foden", "name_ar": "فيل فودين", "page": "Phil_Foden", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Manchester City", "club_ar": "مانشستر سيتي", "difficulty": "medium", "hair_style": "Sharp high skin fade crop", "hair_style_ar": "قصة قصيرة مدرجة بحواف حادة"},
    {"id": "pedri", "name": "Pedri", "name_ar": "بيدري", "page": "Pedri", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Barcelona", "club_ar": "برشلونة", "difficulty": "medium", "hair_style": "Soft natural side sweep", "hair_style_ar": "قصة طبيعية مسحوبة للجانب"},
    {"id": "musiala", "name": "Jamal Musiala", "name_ar": "جمال موسيالا", "page": "Jamal_Musiala", "league": "Bundesliga", "league_ar": "الدوري الألماني", "club": "Bayern Munich", "club_ar": "بايرن ميونخ", "difficulty": "medium", "hair_style": "Curly medium taper fade", "hair_style_ar": "خصلات كيرلي شابة مع تدرج ناعم"},
    {"id": "yamal", "name": "Lamine Yamal", "name_ar": "لامين يامال", "page": "Lamine_Yamal", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Barcelona", "club_ar": "برشلونة", "difficulty": "medium", "hair_style": "Youthful curly textured drop fade", "hair_style_ar": "تدرج كيرلي عصري متناغم"},
    {"id": "chiesa", "name": "Federico Chiesa", "name_ar": "فيديريكو كييزا", "page": "Federico_Chiesa", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Liverpool", "club_ar": "ليفربول", "difficulty": "medium", "hair_style": "Slicked athletic Italian mane", "hair_style_ar": "شعر إيطالي رياضي مسحوب"},
    {"id": "rashford", "name": "Marcus Rashford", "name_ar": "ماركوس راشفورد", "page": "Marcus_Rashford", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Manchester United", "club_ar": "مانشستر يونايتد", "difficulty": "medium", "hair_style": "High-top textured curls fade", "hair_style_ar": "تدرج مرتفع مع خصلات أفرو"},
    {"id": "palmer", "name": "Cole Palmer", "name_ar": "كول بالمر", "page": "Cole_Palmer", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Chelsea", "club_ar": "تشيلسي", "difficulty": "medium", "hair_style": "Close cropped clean Caesar cut", "hair_style_ar": "قصة قيصر كلاسيكية قصيرة"},

    # --- HARD LEVEL (Subtle differences, very similar fades and clean crops) ---
    {"id": "davies", "name": "Alphonso Davies", "name_ar": "ألفونسو ديفيز", "page": "Alphonso_Davies", "league": "Bundesliga", "league_ar": "الدوري الألماني", "club": "Bayern Munich", "club_ar": "بايرن ميونخ", "difficulty": "hard", "hair_style": "Short cropped taper", "hair_style_ar": "قصة قصيرة بتدرج مرتفع"},
    {"id": "david", "name": "Jonathan David", "name_ar": "جوناثان ديفيد", "page": "Jonathan_David", "league": "Ligue 1", "league_ar": "الدوري الفرنسي", "club": "Lille", "club_ar": "ليل", "difficulty": "hard", "hair_style": "Box fade with sharp hairline", "hair_style_ar": "تدرج حاد بخط أمامي مستقيم"},
    {"id": "bruno", "name": "Bruno Fernandes", "name_ar": "برونو فيرنانديز", "page": "Bruno_Fernandes", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Manchester United", "club_ar": "مانشستر يونايتد", "difficulty": "hard", "hair_style": "Portuguese swept classic taper", "hair_style_ar": "قصة برتغالية كلاسيكية بتدرج جانبي"},
    {"id": "odegaard", "name": "Martin Ødegaard", "name_ar": "مارتن أوديغارد", "page": "Martin_Ødegaard", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Arsenal", "club_ar": "أرسنال", "difficulty": "hard", "hair_style": "Blonde Nordic side fringe", "hair_style_ar": "غرة شقراء نرويجية مقسومة"},
    {"id": "nunez", "name": "Darwin Núñez", "name_ar": "داروين نونيز", "page": "Darwin_Núñez", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Liverpool", "club_ar": "ليفربول", "difficulty": "hard", "hair_style": "Long tied topknot ponytail", "hair_style_ar": "شعر طويل مربوط ومشدود"},
    {"id": "barella", "name": "Nicolò Barella", "name_ar": "نيكولو باريلا", "page": "Nicolò_Barella", "league": "Serie A", "league_ar": "الدوري الإيطالي", "club": "Inter Milan", "club_ar": "إنتر ميلان", "difficulty": "hard", "hair_style": "Short Italian textured crew cut", "hair_style_ar": "قصة إيطالية قصيرة منسقة"},
    {"id": "vlahovic", "name": "Dušan Vlahović", "name_ar": "دوشان فلاهوفيتش", "page": "Dušan_Vlahović", "league": "Serie A", "league_ar": "الدوري الإيطالي", "club": "Juventus", "club_ar": "يوفنتوس", "difficulty": "hard", "hair_style": "Slicked undercut with dark fade", "hair_style_ar": "أندركت داكن مسحوب للخلف"},
    {"id": "kimmich", "name": "Joshua Kimmich", "name_ar": "جوشوا كيميش", "page": "Joshua_Kimmich", "league": "Bundesliga", "league_ar": "الدوري الألماني", "club": "Bayern Munich", "club_ar": "بايرن ميونخ", "difficulty": "hard", "hair_style": "Neat German side parted taper", "hair_style_ar": "قصة ألمانية كلاسيكية بفرق جانبي"},
    {"id": "xhaka", "name": "Granit Xhaka", "name_ar": "غرانيت تشاكا", "page": "Granit_Xhaka", "league": "Bundesliga", "league_ar": "الدوري الألماني", "club": "Bayer Leverkusen", "club_ar": "باير ليفركوزن", "difficulty": "hard", "hair_style": "Very sharp high skin fade", "hair_style_ar": "تدرج حاد ومحدد بدقة"},
    {"id": "marquinhos", "name": "Marquinhos", "name_ar": "ماركينيوس", "page": "Marquinhos", "league": "Ligue 1", "league_ar": "الدوري الفرنسي", "club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "difficulty": "hard", "hair_style": "Natural dark curly taper", "hair_style_ar": "تموجات داكنة بتدرج كلاسيكي"},
    {"id": "zaireemery", "name": "Warren Zaïre-Emery", "name_ar": "وارن زاير إيمري", "page": "Warren_Zaïre-Emery", "league": "Ligue 1", "league_ar": "الدوري الفرنسي", "club": "Paris Saint-Germain", "club_ar": "باريس سان جيرمان", "difficulty": "hard", "hair_style": "Compact curly coil fade", "hair_style_ar": "قصة فرنسية شابة بخصلات متقاربة"},
    {"id": "dejong", "name": "Frenkie de Jong", "name_ar": "فرينكي دي يونغ", "page": "Frenkie_de_Jong", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Barcelona", "club_ar": "برشلونة", "difficulty": "hard", "hair_style": "Messy blonde Dutch flow", "hair_style_ar": "شعر أشقر هولندي حر الحركة"},
    {"id": "rodrygo", "name": "Rodrygo", "name_ar": "رودريغو", "page": "Rodrygo", "league": "La Liga", "league_ar": "الدوري الإسباني", "club": "Real Madrid", "club_ar": "ريال مدريد", "difficulty": "hard", "hair_style": "Clean Brazilian high taper fade", "hair_style_ar": "تدرج برازيلي نظيف وحواف حادة"},
    {"id": "casemiro", "name": "Casemiro", "name_ar": "كاسيميرو", "page": "Casemiro", "league": "Premier League", "league_ar": "الدوري الإنجليزي", "club": "Manchester United", "club_ar": "مانشستر يونايتد", "difficulty": "hard", "hair_style": "Textured buzzcut taper", "hair_style_ar": "قصة قصيرة قوية بتدرج منتظم"},
    {"id": "lukaku", "name": "Romelu Lukaku", "name_ar": "روميلو لوكاكو", "page": "Romelu_Lukaku", "league": "Serie A", "league_ar": "الدوري الإيطالي", "club": "Napoli", "club_ar": "نابولي", "difficulty": "hard", "hair_style": "Clean shaven / ultra close buzz", "hair_style_ar": "حلاقة رأس ناعمة وبازكت قصير جداً"},
    {"id": "pulisic", "name": "Christian Pulisic", "name_ar": "كريستيان بوليسيتش", "page": "Christian_Pulisic", "league": "Serie A", "league_ar": "الدوري الإيطالي", "club": "AC Milan", "club_ar": "إيه سي ميلان", "difficulty": "hard", "hair_style": "Textured side crop with light fade", "hair_style_ar": "قصة جانبية منسقة بتدرج خفيف"}
]

os.makedirs('public/assets/players', exist_ok=True)
downloaded = []

for p in players_list:
    pid = p["id"]
    page_quoted = urllib.parse.quote(p["page"])
    full_path = f"public/assets/players/{pid}_full.jpg"
    hair_path = f"public/assets/players/{pid}_hair.jpg"

    p["photo_full"] = f"/assets/players/{pid}_full.jpg"
    p["photo_hair"] = f"/assets/players/{pid}_hair.jpg"

    # If already downloaded and cropped, verify and keep
    if os.path.exists(full_path) and os.path.exists(hair_path) and os.path.getsize(hair_path) > 1000:
        downloaded.append(p)
        print(f"ALREADY EXISTS: {p['name']} ({len(downloaded)}/{len(players_list)})")
        continue

    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{page_quoted}"
        req = urllib.request.Request(url, headers={'User-Agent': 'ZaFootApp/2.0 (contact: asarzaid7@gmail.com)'})
        data = json.loads(urllib.request.urlopen(req, timeout=10).read())
        thumb = data.get('thumbnail', {}).get('source')
        if not thumb:
            print(f"Skipping {p['name']}, no thumb found on Wikipedia")
            continue

        img_req = urllib.request.Request(thumb, headers={'User-Agent': 'ZaFootApp/2.0 (contact: asarzaid7@gmail.com)'})
        img_bytes = urllib.request.urlopen(img_req, timeout=10).read()
        with open(full_path, "wb") as f:
            f.write(img_bytes)

        # Precise forehead-upwards crop:
        # Crop the top 31% of the image so that ONLY forehead, hairline, hair, and upper head are shown,
        # completely hiding the eyes, eyebrows, nose, mouth and lower face!
        cmd = f"convert {full_path} -gravity North -crop 100%x31%+0+0 +repage {hair_path}"
        subprocess.run(cmd, shell=True, check=True)

        downloaded.append(p)
        print(f"SUCCESS: {p['name']} ({len(downloaded)}/{len(players_list)})")
    except Exception as e:
        print(f"FAILED {p['name']}: {e}")

# Save updated database
with open('src/data/hairPlayers.json', 'w', encoding='utf-8') as f:
    json.dump(downloaded, f, ensure_ascii=False, indent=2)

print(f"Finished! Total players available: {len(downloaded)}")
