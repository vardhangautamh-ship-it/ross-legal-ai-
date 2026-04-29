const OpenAI = require("openai");

const SYSTEM_PROMPT = `You are ROSS — a Medical Jurisprudence Intelligence System specialised exclusively in Indian law. You provide expert-level, structured medico-legal analysis strictly for educational and legal study purposes.

CORE COMPETENCIES:
- Medico-legal analysis: injury classification, cause vs manner of death, forensic pathology, ante-mortem vs post-mortem differentiation, wound analysis, ligature marks, time of death estimation, sexual offence examination findings
- Medical malpractice: Bolam test application, standard of care breach, duty of care, res ipsa loquitur, causation chain, hospital vicarious liability, contributory negligence
- Indian medical regulations: NMC Act 2019, MTP Act 1971 (amended 2021), POCSO Act 2012, Mental Healthcare Act 2017, DPDP Act 2023, Transplantation of Human Organs Act 1994, Clinical Establishments Act 2010
- Criminal law intersection: BNS 2023, BNSS 2023, Bharatiya Sakshya Adhiniyam 2023, Consumer Protection Act 2019, Dowry Prohibition Act 1961, Protection of Women from Domestic Violence Act 2005
- Expert witness testimony: court-ready opinions structured for Sessions Court or High Court, judicial communication, evidentiary framing, chain of custody analysis

NON-NEGOTIABLE RULES:
1. Jurisdiction is exclusively India. Always cite BNS 2023 (not IPC), BNSS 2023 (not CrPC), Bharatiya Sakshya Adhiniyam 2023 (not Indian Evidence Act) as primary statutes unless the case predates 2023
2. Always conclude with a disclaimer — output is educational only, never licensed legal or medical advice
3. Never prescribe specific legal strategy — suggest next steps educationally only
4. Cite real Supreme Court and High Court precedents with accurate year and citation
5. Structure every response using EXACTLY §1 through §8 section format as instructed
6. Use precise medical and legal terminology throughout — write as a forensic expert and legal scholar simultaneously`;

const MODULE_MAP = {
  "medico-legal": "Medico-Legal Analysis — focus on: injury classification (grievous/simple), cause vs manner of death distinction, forensic pathology findings, ante-mortem vs post-mortem injury differentiation, wound ballistics if applicable, time of death estimation, ligature mark analysis if applicable",
  "malpractice": "Medical Malpractice Analysis — focus on: Bolam test application, standard of care breach identification, duty of care establishment, res ipsa loquitur applicability, causation chain, hospital vicarious liability, Consumer Protection Act 2019 jurisdiction, NMC professional misconduct provisions",
  "regulations": "Medical Regulations & Professional Ethics — focus on: NMC Act 2019 provisions, informed vs simple consent doctrine (Samira Kohli standard), patient confidentiality obligations, professional misconduct categories, registration and certification requirements, ethical violations and their consequences",
  "expert": "Expert Witness Testimony Simulation — produce a complete court-ready expert opinion as a forensic pathologist or medical expert would deliver before a Sessions Judge or High Court. Use formal testimony register. Structure as: qualifications statement, factual summary, opinion on each medical question, basis of opinion, limitations.",
  "full": "Full Comprehensive Report — analyse ALL domains simultaneously: forensic/medico-legal findings, malpractice liability assessment, regulatory and ethical violations, criminal law intersection with applicable BNS/BNSS sections, and a concluding expert witness opinion"
};

const FORMAT_MAP = {
  "court": "FORMAT: Formal court submission. Use precise legal language, dense citations, formal register throughout. Suitable for filing before a judicial authority.",
  "study": "FORMAT: Academic law study. Make reasoning explicit and doctrinal. Include explanatory notes on why each statute applies. Suitable for law school analysis and research.",
  "brief": "FORMAT: Concise legal brief. Tight reasoning, key points only, minimal elaboration. Suitable for quick reference by a practitioner."
};

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "XAI_API_KEY not configured. Go to Vercel Dashboard → Your Project → Settings → Environment Variables → Add: XAI_API_KEY"
    });
  }

  const { caseText, module: mod, format, focusAreas } = req.body;

  if (!caseText || caseText.trim().length < 20) {
    return res.status(400).json({ error: "Case description too short. Please provide sufficient detail for analysis." });
  }

  const moduleDesc = MODULE_MAP[mod] || MODULE_MAP["full"];
  const formatDesc = FORMAT_MAP[format] || FORMAT_MAP["study"];
  const focusStr = focusAreas && focusAreas.length > 0
    ? `PRIORITY FOCUS AREAS: ${focusAreas.join(", ")}`
    : "";

  const userPrompt = `${formatDesc}
ANALYSIS DOMAIN: ${moduleDesc}
${focusStr}

CASE SUBMITTED FOR ANALYSIS:
${caseText.trim()}

Generate a complete medico-legal analysis report using EXACTLY this structure. Each section header must appear on its own line exactly as shown:

§1. CASE SUMMARY
Concise 2-3 paragraph factual summary of the case as presented. Identify parties, timeline, core allegations, and medical context.

§2. MEDICO-LEGAL ISSUES IDENTIFIED
Enumerate every medico-legal issue raised by the facts. Be technically precise — use correct forensic and medical terminology. Number each issue.

§3. APPLICABLE INDIAN STATUTES AND PRECEDENTS
List every relevant statutory provision and judicial precedent. Format each as:
- [Statute/Section]: [Brief statement of relevance]
- [Case Name (Year) Citation]: [Holding and how it applies]

§4. MEDICO-LEGAL ANALYSIS
In-depth reasoning applying identified statutes and principles to the specific facts. Address causation, liability, standard of care, evidentiary weight of medical findings, and any conflicts in the evidence. This is the analytical core — be thorough.

§5. EVIDENCE-BASED EXPERT OPINION
A clear, court-presentable professional opinion on the medico-legal questions raised. Write as a qualified forensic expert presenting before a judicial forum. State opinions definitively where the evidence supports it, and with appropriate qualification where it does not.

§6. LIMITATIONS AND GAPS IN ANALYSIS
Identify missing evidence, unverified facts, absent reports (autopsy, histopathology, toxicology, etc.) and explain precisely how each gap affects the analysis and what it would change if available.

§7. SUGGESTED NEXT STEPS
Practical recommendations — what investigations to commission, which expert disciplines to engage, what documents to secure, what applications to file. Educational framing only — no specific legal strategy.

§8. DISCLAIMER
This report is generated by ROSS, an AI-powered educational tool. It does not constitute licensed legal advice, medical advice, or a substitute for a qualified advocate or registered medical practitioner. All analysis is for academic and study purposes only. Consult a qualified professional before taking any legal or medical action.`;

  try {
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.x.ai/v1"
    });

    const completion = await client.chat.completions.create({
      model: "grok-4",
      max_tokens: 4000,
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ]
    });

    const responseText = completion.choices[0]?.message?.content || "";

    if (!responseText) {
      return res.status(500).json({ error: "Grok returned an empty response. Please try again." });
    }

    return res.status(200).json({
      success: true,
      report: responseText,
      model: completion.model,
      usage: completion.usage
    });

  } catch (err) {
    console.error("Grok API error:", err);

    if (err.status === 401) {
      return res.status(401).json({ error: "Invalid xAI API key. Check your XAI_API_KEY environment variable in Vercel." });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: "Rate limit hit. Please wait a moment and try again." });
    }
    if (err.status === 402) {
      return res.status(402).json({ error: "Insufficient xAI credits. Please top up your xAI account." });
    }

    return res.status(500).json({
      error: `Analysis failed: ${err.message || "Unknown error"}. Please try again.`
    });
  }
};
