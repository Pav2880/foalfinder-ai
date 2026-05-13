import OpenAI from "openai"
import { NextResponse } from "next/server"
import { findSimilarHorses } from "../../../data/horses"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sire, damsire, breed, gender, style, startLetter, language } = body

    if (!sire || !damsire) {
      return NextResponse.json(
        { error: "Far og morfar skal udfyldes." },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY mangler i .env.local" },
        { status: 500 }
      )
    }

    const similarHorses = findSimilarHorses(sire, damsire)

    const prompt = `
Du er FoalFinder AI, en premium navnegenerator til sportsheste.

Brugerens føl:
- Far/hingst: ${sire}
- Morfar: ${damsire}
- Race: ${breed || "ukendt"}
- Køn: ${gender || "ukendt"}
- Ønsket stil: ${style || "premium, elegant og international"}
- Ønsket startbogstav: ${startLetter || "valgfrit"}
- Sprog: ${language || "dansk"}

Her er heste fra databasen med samme eller lignende far/morfar:
${JSON.stringify(similarHorses, null, 2)}

Opgave:
1. Forklar kort hvilke heste i databasen der matcher far/morfar.
2. Brug de matchende hestes navnestil som inspiration.
3. Lav 10 nye navne til føllet.
4. Navnene skal være realistiske sportshestenavne, ikke fantasy.
5. Navnene må gerne kombinere lyd, rytme og bogstaver fra far/morfar.
6. Returnér KUN valid JSON. Ingen markdown.

JSON format:
{
  "analysis": "kort analyse",
  "matchedHorses": [
    {
      "name": "hestens navn",
      "reason": "hvorfor den matcher",
      "matchScore": 100
    }
  ],
  "names": [
    {
      "name": "Navn",
      "meaning": "kort betydning",
      "inspiration": "hvilke heste/blodlinjer navnet er inspireret af",
      "style": "sporty/elegant/klassisk/moderne",
      "score": 94,
      "uniqueness": 91
    }
  ]
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Du returnerer altid kun valid JSON uden markdown. Du er ekspert i sportsheste, blodlinjer og premium navnebranding."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    })

    const text = completion.choices[0]?.message?.content || "{}"
    const data = JSON.parse(text)

    return NextResponse.json({
      ...data,
      databaseMatches: similarHorses
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Der skete en fejl ved generering." },
      { status: 500 }
    )
  }
}