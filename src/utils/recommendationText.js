/**
 * Menyamakan teks recommendation lama di DB dengan penyebutan baru,
 * memperbaiki duplikasi dari sanitasi parsial, dan merapikan tanda penghubung yang terasa kaku.
 */
const LABEL_TIE_TOP =
  'Lebih dari satu hipotesis tertinggi dengan CF yang sama'

export function sanitizeRecommendationWording(t) {
  if (!t || typeof t !== 'string') return t
  let s = t

  // Pola lama + pengganti parsial yang bikin "dengan nilai CF... sama" dobel
  s = s.replace(
    /\*\*hipotesis tertinggi lebih dari satu\*\*[—–-]\s*beberapa penyakit memiliki\s+\*\*nilai CF tertinggi yang sama\*\*\s+dengan\s+nilai\s+CF\s+tertinggi\s+yang\s+sama/gi,
    `**${LABEL_TIE_TOP}:** beberapa kemungkinan sama-sama paling kuat, dengan **tingkat keyakinan perhitungan yang sama**`
  )
  s = s.replace(
    /hipotesis tertinggi lebih dari satu[—–-]\s*beberapa penyakit memiliki\s+nilai CF tertinggi yang sama\s+dengan\s+nilai\s+CF\s+tertinggi\s+yang\s+sama/gi,
    `${LABEL_TIE_TOP}: beberapa kemungkinan sama-sama paling kuat, dengan tingkat keyakinan perhitungan yang sama`
  )
  // Urutan: ganti frasa paling panjang dulu (supaya tidak tertinggal)
  s = s.replace(/\*\*Hipotesis CF tertinggi sama lebih dari satu\*\*/gi, `**${LABEL_TIE_TOP}**`)
  s = s.replace(/\bHipotesis CF tertinggi sama lebih dari satu\b/gi, LABEL_TIE_TOP)
  s = s.replace(/\*\*Hipotesis tertinggi lebih dari satu\*\*/gi, `**${LABEL_TIE_TOP}**`)
  s = s.replace(/\bHipotesis tertinggi lebih dari satu\b/gi, LABEL_TIE_TOP)

  s = s.replace(
    /dengan\s+nilai\s+CF\s+tertinggi\s+yang\s+sama\s+dengan\s+nilai\s+CF\s+tertinggi\s+yang\s+sama/gi,
    'dengan tingkat keyakinan tertinggi yang sama'
  )

  // Versi lama "berseri" (ganti blok utuh agar tidak dobel dengan sisa kalimat)
  s = s.replace(
    /beberapa\s+penyakit\s+berseri\s+dengan\s+nilai\s+CF\s+tertinggi\s+yang\s+sama/gi,
    'lebih dari satu kemungkinan penyakit dengan tingkat keyakinan tertinggi yang sama'
  )
  s = s.replace(/beberapa\s+penyakit\s+berseri/gi, 'lebih dari satu kemungkinan penyakit yang sama-sama paling kuat indikasinya')
  s = s.replace(/Untuk\s+tiap\s+penyakit\s+berseri/gi, 'Untuk masing-masing kemungkinan tersebut')
  s = s.replace(/tiap\s+penyakit\s+berseri/gi, 'masing-masing kemungkinan')
  s = s.replace(/penyakit\s+berseri/gi, 'kemungkinan penyakit di puncak daftar')

  s = s.replace(
    /\*\*Tingkat Kepastian:\s*CUKUP RENDAH[–-]SEDANG\*\*/gi,
    '**Tingkat Kepastian: Cukup Rendah**'
  )

  // Rapikan petunjuk lama yang memakai em dash berturut-turut
  s = s.replace(/halaman ini\*\*[—–]\s*tepat/gi, 'halaman yang sama. Tepat')
  s = s.replace(/blok rekomendasi ini[—–]\s*sehingga/gi, 'kotak rekomendasi ini, sehingga')

  return s
}
