import { NextRequest, NextResponse } from 'next/server'

interface GenerateRequest {
  name: string
  mode: 'roast' | 'compliment'
}

interface GenerateResponse {
  mode: 'roast' | 'compliment'
  name: string
  text: string
}

// Templates de roasts - piquants mais bon enfant
const roastTemplates = [
  "{name}, t'as le même timing qu'un Wi-Fi gratuit dans un train—ça coupe toujours quand on en a le plus besoin.",
  "{name}, tu es comme une mise à jour Windows—personne ne te demande mais tu arrives quand même.",
  "{name}, ton organisation ressemble à un dossier 'Bureau' sur un Mac—tout est là mais impossible de retrouver quoi que ce soit.",
  "{name}, tu es comme un GPS qui te fait faire 3 fois le tour du rond-point avant de te dire la sortie.",
  "{name}, t'as la même efficacité qu'un antivirus qui détecte tout sauf les vrais virus.",
  "{name}, tu es comme une batterie à 1%—tu tiens encore 2h mais tout le monde s'inquiète.",
  "{name}, ton sens de l'orientation c'est comme Google Maps en mode avion—ça marche mais c'est complètement à côté.",
  "{name}, tu es comme une imprimante—tu fonctionnes parfaitement sauf quand on a vraiment besoin de toi.",
  "{name}, t'as la même logique qu'un algorithme TikTok—personne ne comprend mais ça marche.",
  "{name}, tu es comme un chargeur sans fil—ça marche mais c'est tellement lent que tout le monde s'impatiente.",
  "{name}, ton timing c'est comme une notification à 3h du matin—toujours au mauvais moment.",
  "{name}, tu es comme un captcha—techniquement utile mais tout le monde te déteste.",
  "{name}, t'as la même fiabilité qu'une connexion 4G dans un ascenseur—ça marche parfois.",
  "{name}, tu es comme un mot de passe—personne ne se souvient de toi mais tu es partout.",
  "{name}, ton organisation c'est comme un bureau d'étudiant—chaotique mais tu sais où tout est."
]

// Templates de compliments - positifs, originaux, drôles ou poétiques
const complimentTemplates = [
  "{name}, ton sourire c'est comme un spoiler heureux—ça rend tout le monde impatient de voir la suite.",
  "{name}, tu es comme une playlist parfaite—chaque moment avec toi est un hit.",
  "{name}, ton énergie c'est comme une batterie sans fil—tu recharges tout le monde autour de toi.",
  "{name}, tu es comme un bon meme—tu rends n'importe quelle situation plus drôle.",
  "{name}, ton optimisme c'est comme un filtre Instagram—tu rends tout plus beau.",
  "{name}, tu es comme une bonne série Netflix—une fois qu'on commence, on peut plus s'arrêter.",
  "{name}, ton humour c'est comme un GIF parfait—toujours au bon moment.",
  "{name}, tu es comme une app bien conçue—intuitive, utile et on se demande comment on faisait avant.",
  "{name}, ton charisme c'est comme un algorithme viral—tout le monde veut te suivre.",
  "{name}, tu es comme une bonne connexion Wi-Fi—fiable, rapide et on se sent connecté.",
  "{name}, ton intelligence c'est comme un moteur de recherche—tu trouves toujours la bonne réponse.",
  "{name}, tu es comme une mise à jour réussie—tu améliores tout ce que tu touches.",
  "{name}, ton style c'est comme un design Apple—épuré, élégant et intemporel.",
  "{name}, tu es comme une bonne playlist Spotify—tu adaptes l'ambiance à chaque situation.",
  "{name}, ton cœur c'est comme un cloud—tu stockes tous les bons souvenirs et tu les partages."
]

function generateRoast(name: string): string {
  const template = roastTemplates[Math.floor(Math.random() * roastTemplates.length)]
  return template.replace('{name}', name)
}

function generateCompliment(name: string): string {
  const template = complimentTemplates[Math.floor(Math.random() * complimentTemplates.length)]
  return template.replace('{name}', name)
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { name, mode } = body

    // Validation
    if (!mode || !['roast', 'compliment'].includes(mode)) {
      return NextResponse.json(
        { error: 'Mode doit être "roast" ou "compliment"' },
        { status: 400 }
      )
    }

    // Utiliser "L'Inconnu(e)" si le nom est vide
    const displayName = name?.trim() || "L'Inconnu(e)"
    
    // Générer le texte selon le mode
    let text: string
    if (mode === 'roast') {
      text = generateRoast(displayName)
    } else {
      text = generateCompliment(displayName)
    }

    const response: GenerateResponse = {
      mode,
      name: displayName,
      text
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Erreur dans /api/generate:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
