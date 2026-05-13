"use client"

import { useState } from "react"

type NameResult = {
  name: string
  meaning: string
  inspiration: string
  style: string
  score: number
  uniqueness: number
}

type HorseMatch = {
  id?: number
  name: string
  sire?: string
  damsire?: string
  breed?: string
  discipline?: string
  image?: string
  notes?: string
  reason?: string
  matchScore?: number
}

export default function HomePage() {
  const [sire, setSire] = useState("Blue Hors Zack")
  const [damsire, setDamsire] = useState("Don Schufro")
  const [breed, setBreed] = useState("Dansk Varmblod")
  const [gender, setGender] = useState("Hingsteføl")
  const [style, setStyle] = useState("Sporty")
  const [startLetter, setStartLetter] = useState("")
  const [language, setLanguage] = useState("Dansk")
  const [analysis, setAnalysis] = useState("")
  const [names, setNames] = useState<NameResult[]>([])
  const [matches, setMatches] = useState<HorseMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function generateNames() {
    setLoading(true)
    setError("")
    setNames([])
    setAnalysis("")
    setMatches([])

    try {
      const res = await fetch("/api/generate-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sire, damsire, breed, gender, style, startLetter, language })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Kunne ikke generere navne.")

      setAnalysis(data.analysis || "")
      setNames(data.names || [])
      setMatches(data.databaseMatches || data.matchedHorses || [])
    } catch (err: any) {
      setError(err.message || "Der skete en fejl.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app">
      <nav className="nav">
        <div className="brand">
          <div className="brand-icon">♞</div>
          <strong>FoalFinder AI</strong>
        </div>
        <div className="nav-links">
          <a>Forside</a>
          <a>Inspiration</a>
          <a>Sådan virker det</a>
          <a>Priser</a>
        </div>
        <button className="gold small">Log ind</button>
      </nav>

      <section className="hero-grid">
        <div className="left">
          <div className="eyebrow">AI-drevet navnegenerator</div>
          <h1>Find det perfekte navn til dit <span>føl</span></h1>
          <p className="lead">
            FoalFinder matcher far og morfar mod en hestedatabase og bruger
            lignende blodlinjer som inspiration til nye premium navne.
          </p>

          <div className="chips">
            <div>✦ AI-navneforslag</div>
            <div>♘ Blodlinjeanalyse</div>
            <div>◎ Database-match</div>
            <div>⏱ Live resultater</div>
          </div>

          <div className="form-card">
            <div className="card-heading">Indtast hestens oplysninger</div>
            <div className="form-grid">
              <Field label="Far / Hingst">
                <input value={sire} onChange={(e) => setSire(e.target.value)} placeholder="Blue Hors Zack" />
              </Field>
              <Field label="Morfar">
                <input value={damsire} onChange={(e) => setDamsire(e.target.value)} placeholder="Don Schufro" />
              </Field>
              <Field label="Race">
                <select value={breed} onChange={(e) => setBreed(e.target.value)}>
                  <option>Dansk Varmblod</option>
                  <option>Holstener</option>
                  <option>KWPN</option>
                  <option>Hannoveraner</option>
                  <option>Oldenborg</option>
                  <option>Anden race</option>
                </select>
              </Field>
              <Field label="Køn">
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option>Hingsteføl</option>
                  <option>Hoppeføl</option>
                  <option>Ukendt</option>
                </select>
              </Field>
              <Field label="Stil">
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                  <option>Sporty</option>
                  <option>Elegant</option>
                  <option>Klassisk</option>
                  <option>Nordisk</option>
                  <option>International</option>
                  <option>Eksklusiv</option>
                </select>
              </Field>
              <Field label="Startbogstav">
                <input value={startLetter} onChange={(e) => setStartLetter(e.target.value)} placeholder="F.eks. Z" />
              </Field>
              <Field label="Sprog">
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option>Dansk</option>
                  <option>English</option>
                </select>
              </Field>
              <button onClick={generateNames} disabled={loading} className="gold generate">
                {loading ? "Analyserer..." : "✦ Generer navne"}
              </button>
            </div>
            {error && <div className="error">{error}</div>}
            {analysis && <div className="analysis"><strong>AI-analyse:</strong> {analysis}</div>}
          </div>
        </div>

        <div className="right">
          <div className="results-panel">
            <div className="panel-top">
              <div>
                <div className="eyebrow">AI-forslag til navne</div>
                <h2>Live resultater</h2>
              </div>
              <div className="live">● Live</div>
            </div>

            {loading && <div className="loading">FoalFinder søger i databasen og genererer navne...</div>}

            {!loading && names.length === 0 && (
              <div className="empty">
                Klik “Generer navne” for at se AI-resultater baseret på far, morfar og databasen.
              </div>
            )}

            <div className="result-list">
              {names.slice(0, 6).map((item, index) => (
                <div className="result-row" key={`${item.name}-${index}`}>
                  <div className="number">{index + 1}</div>
                  <div className="result-main">
                    <h3>{item.name}</h3>
                    <p>{item.meaning}</p>
                    <small>{item.inspiration}</small>
                  </div>
                  <div className="score">
                    <strong>{item.score || 90}</strong>
                    <span>AI-score</span>
                  </div>
                  <div className="circle">
                    <strong>{item.uniqueness || 88}%</strong>
                    <span>Unikhed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="matches">
        <div className="section-title">
          <div className="eyebrow">Database-match</div>
          <h2>Heste med samme eller lignende blodlinjer</h2>
        </div>

        {matches.length === 0 ? (
          <p className="muted center">Der vises matchende heste her, når du genererer navne.</p>
        ) : (
          <div className="horse-grid">
            {matches.map((horse, index) => (
              <div className="horse-card" key={`${horse.name}-${index}`}>
                <div className="horse-image" style={{ backgroundImage: `url(${horse.image || "/horses/horse-1.jpg"})` }}>
                  <span>{horse.matchScore || 80}% match</span>
                </div>
                <div className="horse-body">
                  <h3>{horse.name}</h3>
                  <p><strong>Far:</strong> {horse.sire}</p>
                  <p><strong>Morfar:</strong> {horse.damsire}</p>
                  <p>{horse.notes || horse.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="features">
        <div><strong>AI-Power</strong><br />OpenAI analyserer navne og blodlinjer.</div>
        <div><strong>Database-match</strong><br />Finder lignende heste før navneforslag.</div>
        <div><strong>Premium UI</strong><br />Sort/guld equestrian SaaS-design.</div>
        <div><strong>Klar til login</strong><br />Næste step er brugere, favoritter og admin.</div>
      </section>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}