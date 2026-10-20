import urllib.request
import urllib.parse
import json
import os
import subprocess

players = [
    {
        "id": "haaland",
        "name": "Erling Haaland",
        "name_ar": "إيرلينغ هالاند",
        "page": "Erling_Haaland",
        "league": "Premier League",
        "league_ar": "الدوري الإنجليزي",
        "club": "Manchester City",
        "club_ar": "مانشستر سيتي",
        "hair_style": "Long golden blonde ponytail / man-bun",
        "hair_style_ar": "شعر أشقر ذهبي طويل مربوط على شكل ذيل حصان / كعكة",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "salah",
        "name": "Mohamed Salah",
        "name_ar": "محمد صلاح",
        "page": "Mohamed_Salah",
        "league": "Premier League",
        "league_ar": "الدوري الإنجليزي",
        "club": "Liverpool",
        "club_ar": "ليفربول",
        "hair_style": "Voluminous curly dark Egyptian afro",
        "hair_style_ar": "شعر أفرو مموج كثيف ومميز",
        "crop": "100%x38%+0+0"
    },
    {
        "id": "grealish",
        "name": "Jack Grealish",
        "name_ar": "جاك غريليش",
        "page": "Jack_Grealish",
        "league": "Premier League",
        "league_ar": "الدوري الإنجليزي",
        "club": "Manchester City",
        "club_ar": "مانشستر سيتي",
        "hair_style": "Swept-back undercut with signature elastic headband",
        "hair_style_ar": "قصة أندركت مسحوبة للخلف مع طوق الشعر الشهير",
        "crop": "100%x38%+0+0"
    },
    {
        "id": "vandijk",
        "name": "Virgil van Dijk",
        "name_ar": "فيرجيل فان دايك",
        "page": "Virgil_van_Dijk",
        "league": "Premier League",
        "league_ar": "الدوري الإنجليزي",
        "club": "Liverpool",
        "club_ar": "ليفربول",
        "hair_style": "Sleek pulled-back samurai topknot bun",
        "hair_style_ar": "كعكة ساموراي مشدودة للخلف بعناية",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "camavinga",
        "name": "Eduardo Camavinga",
        "name_ar": "إدواردو كامافينغا",
        "page": "Eduardo_Camavinga",
        "league": "La Liga",
        "league_ar": "الدوري الإسباني",
        "club": "Real Madrid",
        "club_ar": "ريال مدريد",
        "hair_style": "Intricate twisted dreadlocks / braids",
        "hair_style_ar": "جدائل ديدلوكس ملفوفة بدقة وأناقة",
        "crop": "100%x38%+0+0"
    },
    {
        "id": "kounde",
        "name": "Jules Koundé",
        "name_ar": "جول كوندي",
        "page": "Jules_Koundé",
        "league": "La Liga",
        "league_ar": "الدوري الإسباني",
        "club": "Barcelona",
        "club_ar": "برشلونة",
        "hair_style": "Signature high afro-braids / fashion cornrows",
        "hair_style_ar": "ضفائر أفريقية عصرية مرتفعة بأسلوب الموضة",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "griezmann",
        "name": "Antoine Griezmann",
        "name_ar": "أنطوان غريزمان",
        "page": "Antoine_Griezmann",
        "league": "La Liga",
        "league_ar": "الدوري الإسباني",
        "club": "Atlético Madrid",
        "club_ar": "أتلتيكو مدريد",
        "hair_style": "Bleached blonde / vibrant dyed crew cut",
        "hair_style_ar": "قصة شقراء مصبوغة جريئة وقصيرة",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "vinicius",
        "name": "Vinícius Júnior",
        "name_ar": "فينيسيوس جونيور",
        "page": "Vinícius_Júnior",
        "league": "La Liga",
        "league_ar": "الدوري الإسباني",
        "club": "Real Madrid",
        "club_ar": "ريال مدريد",
        "hair_style": "High taper fade with textured curly top",
        "hair_style_ar": "تدرج جانبي حاد مع خصلات كيرلي كثيفة في الأعلى",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "modric",
        "name": "Luka Modrić",
        "name_ar": "لوكا مودريتش",
        "page": "Luka_Modrić",
        "league": "La Liga",
        "league_ar": "الدوري الإسباني",
        "club": "Real Madrid",
        "club_ar": "ريال مدريد",
        "hair_style": "Iconic flowing blonde locks with thin sport headband",
        "hair_style_ar": "خصلات شقراء منسدلة مع رباط رأس رفيع",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "leao",
        "name": "Rafael Leão",
        "name_ar": "رافايل لياو",
        "page": "Rafael_Leão",
        "league": "Serie A",
        "league_ar": "الدوري الإيطالي",
        "club": "AC Milan",
        "club_ar": "إيه سي ميلان",
        "hair_style": "Medium dreadlocks with swept front locks",
        "hair_style_ar": "جدائل ديدلوكس متوسطة متدلية على الجانبين",
        "crop": "100%x38%+0+0"
    },
    {
        "id": "theo",
        "name": "Theo Hernández",
        "name_ar": "ثيو هيرنانديز",
        "page": "Theo_Hernández",
        "league": "Serie A",
        "league_ar": "الدوري الإيطالي",
        "club": "AC Milan",
        "club_ar": "إيه سي ميلان",
        "hair_style": "Platinum bleached buzzcut with high fade",
        "hair_style_ar": "شعر بلاتيني أبيض مصبوغ مع تدرج حاد",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "dybala",
        "name": "Paulo Dybala",
        "name_ar": "باولو ديبالا",
        "page": "Paulo_Dybala",
        "league": "Serie A",
        "league_ar": "الدوري الإيطالي",
        "club": "AS Roma",
        "club_ar": "روما",
        "hair_style": "Textured Italian slicked undercut fringe",
        "hair_style_ar": "قصة إيطالية كلاسيكية بتدرج جانبي وغرة أمامية",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "lautaro",
        "name": "Lautaro Martínez",
        "name_ar": "لاوتارو مارتينيز",
        "page": "Lautaro_Martínez",
        "league": "Serie A",
        "league_ar": "الدوري الإيطالي",
        "club": "Inter Milan",
        "club_ar": "إنتر ميلان",
        "hair_style": "El Toro spiked faux hawk with shaved temples",
        "hair_style_ar": "قصة الثور (إل تورو) المرتفعة مع جوانب محلوقة",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "sane",
        "name": "Leroy Sané",
        "name_ar": "ليروي ساني",
        "page": "Leroy_Sané",
        "league": "Bundesliga",
        "league_ar": "الدوري الألماني",
        "club": "Bayern Munich",
        "club_ar": "بايرن ميونخ",
        "hair_style": "Signature full afro curls / braided twists",
        "hair_style_ar": "شعر أفرو مميز مع خصلات ملفوفة بارزة",
        "crop": "100%x38%+0+0"
    },
    {
        "id": "davies",
        "name": "Alphonso Davies",
        "name_ar": "ألفونسو ديفيز",
        "page": "Alphonso_Davies",
        "league": "Bundesliga",
        "league_ar": "الدوري الألماني",
        "club": "Bayern Munich",
        "club_ar": "بايرن ميونخ",
        "hair_style": "Short cropped taper fade with textured top",
        "hair_style_ar": "قصة قصيرة أنيقة بتدرج مرتفع",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "kane",
        "name": "Harry Kane",
        "name_ar": "هاري كين",
        "page": "Harry_Kane",
        "league": "Bundesliga",
        "league_ar": "الدوري الألماني",
        "club": "Bayern Munich",
        "club_ar": "بايرن ميونخ",
        "hair_style": "Classic British side-parted gentleman crop",
        "hair_style_ar": "قصة بريطانية كلاسيكية بفرق جانبي نظيف",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "wirtz",
        "name": "Florian Wirtz",
        "name_ar": "فلوريان فيرتز",
        "page": "Florian_Wirtz",
        "league": "Bundesliga",
        "league_ar": "الدوري الألماني",
        "club": "Bayer Leverkusen",
        "club_ar": "باير ليفركوزن",
        "hair_style": "Sharp German modern buzz taper crop",
        "hair_style_ar": "قصة عصرية قصيرة بتدرج دقيق وتفاصيل حادة",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "barcola",
        "name": "Bradley Barcola",
        "name_ar": "برادلي باركولا",
        "page": "Bradley_Barcola",
        "league": "Ligue 1",
        "league_ar": "الدوري الفرنسي",
        "club": "Paris Saint-Germain",
        "club_ar": "باريس سان جيرمان",
        "hair_style": "Long signature micro-braids falling over shoulders",
        "hair_style_ar": "جدائل ميكرو طويلة مميزة متدلية",
        "crop": "100%x38%+0+0"
    },
    {
        "id": "dembele",
        "name": "Ousmane Dembélé",
        "name_ar": "عثمان ديمبيلي",
        "page": "Ousmane_Dembélé",
        "league": "Ligue 1",
        "league_ar": "الدوري الفرنسي",
        "club": "Paris Saint-Germain",
        "club_ar": "باريس سان جيرمان",
        "hair_style": "Ultra-clean high skin fade with sharp edge",
        "hair_style_ar": "قصة حادة ومدرجة بدقة فائقة على الأطراف",
        "crop": "100%x36%+0+0"
    },
    {
        "id": "hakimi",
        "name": "Achraf Hakimi",
        "name_ar": "أشرف حكيمي",
        "page": "Achraf_Hakimi",
        "league": "Ligue 1",
        "league_ar": "الدوري الفرنسي",
        "club": "Paris Saint-Germain",
        "club_ar": "باريس سان جيرمان",
        "hair_style": "Modern textured crop with clean temple taper",
        "hair_style_ar": "قصة عصرية منسقة بعناية وتدرج جانبي ناعم",
        "crop": "100%x36%+0+0"
    }
]

os.makedirs('public/assets/players', exist_ok=True)
downloaded_players = []

for p in players:
    pid = p["id"]
    page_quoted = urllib.parse.quote(p["page"])
    full_path = f"public/assets/players/{pid}_full.jpg"
    hair_path = f"public/assets/players/{pid}_hair.jpg"

    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{page_quoted}"
        req = urllib.request.Request(url, headers={'User-Agent': 'ZaFootApp/1.0 (contact: asarzaid7@gmail.com)'})
        data = json.loads(urllib.request.urlopen(req, timeout=10).read())
        thumb = data.get('thumbnail', {}).get('source')
        if not thumb:
            print(f"Skipping {p['name']}, no thumb")
            continue

        # Download thumbnail image
        img_req = urllib.request.Request(thumb, headers={'User-Agent': 'ZaFootApp/1.0 (contact: asarzaid7@gmail.com)'})
        img_bytes = urllib.request.urlopen(img_req, timeout=10).read()
        with open(full_path, "wb") as f:
            f.write(img_bytes)

        # Crop top region containing hair using ImageMagick
        crop_param = p["crop"]
        cmd = f"convert {full_path} -gravity North -crop {crop_param} +repage {hair_path}"
        subprocess.run(cmd, shell=True, check=True)

        p["photo_full"] = f"/assets/players/{pid}_full.jpg"
        p["photo_hair"] = f"/assets/players/{pid}_hair.jpg"
        downloaded_players.append(p)
        print(f"SUCCESS: {p['name']} ({len(downloaded_players)}/20)")
    except Exception as e:
        print(f"FAILED {p['name']}: {e}")

# Save manifest to src/data/hairPlayers.json
os.makedirs('src/data', exist_ok=True)
with open('src/data/hairPlayers.json', 'w', encoding='utf-8') as f:
    json.dump(downloaded_players, f, ensure_ascii=False, indent=2)

print(f"Total downloaded and processed: {len(downloaded_players)}")
