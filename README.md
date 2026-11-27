# Booska Cycle Clock

Saacadda wareegga Bitcoin oo **live** ah: halving, top iyo bottom. Qaacidooyinku waa furan yihiin. Dhacdo kasta waa la kaydiyaa, waxna lama tirtiro.

**Aasaasaha:** [@Booskapro](https://x.com/Booskapro) · **Xuquuqda:** © 2026 Booska Cycle Clock · dhammaan xuquuqda waa la xafiday

## Sida uu u shaqeeyo

| Lakab | Waxa uu qabto | Goorta |
|---|---|---|
| **Browser-ka** (`index.html`) | Block-ga iyo qiimaha live ayuu ka helaa (mempool.space WebSocket, CoinGecko). Moodeelada wuu xisaabiyaa, dhacdooyinkana isla markiiba wuu calaamadeeyaa. | Block kasta (~10 daq) iyo 60 ilbiriqsi kasta |
| **Robot-ka kaydka** (`scripts/update.mjs`, GitHub Actions) | Xeerarkii isku midka ahaa (`core.js`) ayuu isticmaalaa, kaddibna wuxuu ku kaydiyaa faylasha xogta. | 10 daqiiqo kasta |

faylasha xogta, **waxba lama tirtiro**:
- `events.json`: halving, top, bottom. Xaaladdu waa ◐ la tuhunsan yahay → ✔ la xaqiijiyay. Isbeddel kasta wuxuu ku jiraa `revisions`.
- `history.csv`: hal saf maalin kasta (block, qiime, saacad, xilliga, signal, saadaasha, qiyaasaha moodeelka).
- `weekly.json`: qiimaha toddobaad kasta laga bilaabo 2010. Toddobaadyada cusub waa lagu daraa, kuwii horena lama tirtiro.
- `status.json`: goorta robot-ku u dambeysay ee uu shaqeeyay.

## Xeerarka dhacdooyinka

- **Halving:** marka block `n × 210,000` la gaaro. Waqtiga saxda ah waxaa laga qaataa blockchain-ka.
- **Top:** ATH cusub wuxuu noqdaa ◐. Wuxuu noqdaa ✔ marka weekly close < top × 0.80.
- **Bottom:** low cusub oo top-ka kaddib ah wuxuu noqdaa ◐. Wuxuu noqdaa ✔ marka weekly close > low × 1.20.

## Shidista – Vercel + GitHub (hal mar, ~10 daqiiqo)

**A. GitHub (xogta + robot-ka)**
1. github.com → **New repository** → magac: `booska-cycle-clock` → **Public** → Create.
2. **Add file → Upload files** → soo jiid DHAMMAAN faylasha zip-ka (oo uu ku jiro folder-ka `.github`) → **Commit changes**.
   (Haddii `.github` aanu ku shubmin: **Add file → Create new file** → qor magaca `.github/workflows/booska.yml` → ku koobi qoraalka faylka.)
3. **Settings → Actions → General → Workflow permissions → Read and write permissions → Save.**
4. **Actions** → haddii la weydiiyo, riix **"I understand… enable"** → **Booska live archive → Run workflow**.

**B. Vercel (website-ka)**
1. vercel.com → **Add New… → Project** → **Import** `Booskapro/booska-cycle-clock`.
2. **Project Name:** `booska-cycle-clock` · **Framework Preset:** *Other* · **Build Command:** (ka tag madhan) · **Output Directory:** (ka tag madhan / `.`)
3. **Deploy.** Website-ku: `https://booskaclock.vercel.app`
4. Commit kasta (adiga ama robot-ka) → Vercel si toos ah ayuu u cusboonaysiiyaa (~30 ilbiriqsi).

> Haddii Vercel uu ku siiyo magac kale (tusaale `booska-cycle-clock-xyz.vercel.app`), ku beddel link-ga `index.html` (canonical/og), `robots.txt` iyo `sitemap.xml` – ama ii sheeg.

**C. Google (SEO)**
1. search.google.com/search-console → **Add property → URL prefix** → link-ga Vercel → xaqiiji (HTML tag).
2. **Sitemaps** → `sitemap.xml` → Submit.

> GitHub wuxuu joojiyaa workflow-yada repo aan isbeddel lahayn 60 maalmood; robot-ku commit buu sameeyaa, markaa ma joogsanayo. Haddii uu joogsado: **Actions → Enable**.

## Kayd labaad

Bil kasta, ka soo deji faylasha xogta (Code → Download ZIP), ama ku kaydi [web.archive.org](https://web.archive.org) link-ga `history.csv`.

## Xogta iyo laysanka

- Xogta live-ka ah waxay ka timaadaa: mempool.space, blockstream.info, CoinGecko, Coinbase, Binance, Kraken.
- Taariikhda 2010–2026 waxay ka timid Coin Metrics Community Data (**CC BY-NC 4.0**, isticmaal aan ganacsi ahayn) iyo CoinGecko.
- Charts-ka: TradingView Lightweight Charts (Apache 2.0).
- Qaacidooyinka, naqshadda iyo qoraalka: © @Booskapro · dhammaan xuquuqda waa la xafiday.

*Waxbarasho keliya. Ma aha talo maaliyadeed.*
