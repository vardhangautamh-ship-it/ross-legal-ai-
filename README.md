# ROSS — Medical Jurisprudence Intelligence System
### Powered by Grok 4 · Deployed on Vercel · Indian Law Jurisdiction

---

## What is ROSS?

ROSS is a production-grade AI agent that applies Medical Jurisprudence to real-world cases through the lens of Indian law. It takes case facts and generates structured, eight-section medico-legal reports covering forensic analysis, malpractice liability, regulatory violations, criminal law intersection, and expert witness opinions.

Built for law students, researchers, and legal professionals working at the intersection of medicine and Indian law.

---

## Project Structure

```
ross-app/
├── api/
│   └── analyze.js        ← Serverless function (Grok 4 via xAI API)
├── public/
│   └── index.html        ← Full frontend (mobile-responsive)
├── package.json
├── vercel.json
└── README.md
```

---

## Deployment — Step by Step

### Prerequisites
- A GitHub account
- A Vercel account (free) — sign up at vercel.com
- Your xAI API key — get it at console.x.ai
- Node.js installed on your machine
- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)

---

### Step 1 — Push to GitHub

Open your terminal in the `ross-app` folder and run:

```bash
git init
git add .
git commit -m "Initial ROSS deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ross-legal-ai.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. Create the repo on github.com first (no README, no .gitignore).

---

### Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your `ross-legal-ai` GitHub repository
4. Leave all build settings as default — Vercel auto-detects the config
5. Click **Deploy**

Your app will be live in ~60 seconds at a URL like `ross-legal-ai.vercel.app`

---

### Step 3 — Add Your xAI API Key (CRITICAL)

1. In Vercel dashboard → click your project → **Settings** → **Environment Variables**
2. Add the following:
   - **Name:** `XAI_API_KEY`
   - **Value:** your xAI API key (starts with `xai-...`)
   - **Environment:** Production, Preview, Development (select all)
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deployment → **Redeploy**

This is the only time you ever touch the API key. It never appears in any code or browser.

---

### Step 4 — Done

Open your Vercel URL. ROSS is live. Share it with anyone — it works on mobile, desktop, and tablet.

---

## Local Development (Optional)

```bash
npm install
npm run dev
```

Requires Vercel CLI installed: `npm i -g vercel`

For local dev, create a `.env.local` file:
```
XAI_API_KEY=xai-your-key-here
```

---

## Analysis Modules

| Module | What it does |
|--------|-------------|
| Medico-Legal | Injury classification, cause vs manner of death, forensic findings |
| Malpractice | Bolam test, standard of care, duty of care, res ipsa loquitur |
| Regulations & Ethics | NMC Act, informed consent, professional misconduct, POCSO |
| Expert Witness | Court-ready testimony simulation for Sessions Court / High Court |
| Full Report | All modules simultaneously — comprehensive 8-section report |

---

## Statutes Covered

BNS 2023 · BNSS 2023 · Bharatiya Sakshya Adhiniyam 2023 · NMC Act 2019 · MTP Act 1971 (amended 2021) · POCSO Act 2012 · Consumer Protection Act 2019 · Mental Healthcare Act 2017 · DPDP Act 2023 · Dowry Prohibition Act 1961 · PWDVA 2005 · Transplantation of Human Organs Act 1994

---

## Disclaimer

ROSS is strictly an educational and research tool. Output does not constitute licensed legal advice, medical advice, or a substitute for a qualified advocate or registered medical practitioner. Always consult qualified professionals before taking any legal or medical action.

---

*Built for academic and research use at the intersection of medical science and Indian law.*
