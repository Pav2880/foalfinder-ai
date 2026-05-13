export type Horse = {
  id: number
  name: string
  sire: string
  damsire: string
  breed: string
  discipline: string
  gender: string
  image: string
  notes: string
}

export const horseDatabase: Horse[] = [
  {
    id: 1,
    name: "Zackero",
    sire: "Blue Hors Zack",
    damsire: "Don Schufro",
    breed: "Dansk Varmblod",
    discipline: "Dressur",
    gender: "Hingst",
    image: "/horses/horse-1.svg",
    notes: "Elegant type med stærk Z-lyd og klassisk dansk varmblodsstil."
  },
  {
    id: 2,
    name: "Don Zafiro",
    sire: "Blue Hors Zack",
    damsire: "Don Schufro",
    breed: "Dansk Varmblod",
    discipline: "Dressur",
    gender: "Hingst",
    image: "/horses/horse-2.svg",
    notes: "Internationalt navn med Don/Zack inspiration."
  },
  {
    id: 3,
    name: "Zandor",
    sire: "Blue Hors Zack",
    damsire: "Sandro Hit",
    breed: "Hannoveraner",
    discipline: "Dressur",
    gender: "Vallak",
    image: "/horses/horse-3.svg",
    notes: "Kort, stærkt og sporty navn."
  },
  {
    id: 4,
    name: "Cornetino",
    sire: "Cornet Obolensky",
    damsire: "Diamant de Semilly",
    breed: "Holstener",
    discipline: "Spring",
    gender: "Hingst",
    image: "/horses/horse-4.svg",
    notes: "Springheste-inspireret navn med kraftfuld international lyd."
  },
  {
    id: 5,
    name: "Diamaro",
    sire: "Diamant de Semilly",
    damsire: "Quidam de Revel",
    breed: "SF",
    discipline: "Spring",
    gender: "Hingst",
    image: "/horses/horse-5.svg",
    notes: "Eksklusivt springnavn med fransk klang."
  },
  {
    id: 6,
    name: "Casallino",
    sire: "Casall ASK",
    damsire: "Contender",
    breed: "Holstener",
    discipline: "Spring",
    gender: "Hingst",
    image: "/horses/horse-6.svg",
    notes: "Klassisk holstenernavn."
  }
]

export function findSimilarHorses(sire: string, damsire: string) {
  const s = sire.trim().toLowerCase()
  const d = damsire.trim().toLowerCase()

  return horseDatabase
    .map((horse) => {
      const sireMatch = horse.sire.toLowerCase().includes(s) || s.includes(horse.sire.toLowerCase())
      const damsireMatch = horse.damsire.toLowerCase().includes(d) || d.includes(horse.damsire.toLowerCase())

      let score = 0
      if (sireMatch) score += 60
      if (damsireMatch) score += 40

      return { ...horse, matchScore: score }
    })
    .filter((horse) => horse.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6)
}