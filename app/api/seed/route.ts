import { initializeApp } from 'firebase/app'
import { getFirestore, collection, Timestamp, writeBatch, doc } from 'firebase/firestore'
import { NextResponse } from 'next/server'

interface RawProduct {
  id: string
  name: string
  description: string
  specs: {
    nicotine: string
    sugar: string
    color: string
    body: string
    grade: string
  }
}

const productCatalog: RawProduct[] = [
  {
    id: '01',
    name: 'FCV TRADITIONAL (X10)',
    description: 'A high-nicotine, high-sugar flue-cured Virginia tobacco known for its dark lemon to orange or reddish color and medium to heavy body. Primarily used in cigarette blends and for export blending.',
    specs: {
      nicotine: '2.8% - 3.5%',
      sugar: '16% - 22%',
      color: 'Dark lemon to orange / reddish',
      body: 'Medium to heavy',
      grade: 'X-10 (Lower quality / dark / over-ripe)',
    },
  },
  {
    id: '02',
    name: 'FCV TRADITIONAL (L 30)',
    description: 'A lemon-yellow traditional FCV tobacco with low to medium nicotine and high sugar. It is thin to medium in body and ideal for smooth cigarette blends and balancing sweetness.',
    specs: {
      nicotine: '1.6% - 2.2%',
      sugar: '20% - 26%',
      color: 'Lemon yellow',
      body: 'Thin to medium',
      grade: 'L-30 (Lemon 30)',
    },
  },
  {
    id: '03',
    name: 'FCV TRADITIONAL (LBY)',
    description: 'Highly sought for its very high sugar content and bright lemon-yellow color. This thin to medium body leaf is used to improve sweetness in mild cigarette blends.',
    specs: {
      nicotine: '1.4% - 2.0%',
      sugar: '22% - 28%',
      color: 'Bright lemon yellow',
      body: 'Thin to medium',
      grade: 'LBY (Lemon Bright Yellow)',
    },
  },
  {
    id: '04',
    name: 'FCV TRADITIONAL (X 60)',
    description: 'A thin to medium body leaf with dark orange to brown coloring. It is used to balance blends by reducing sweetness where necessary.',
    specs: {
      nicotine: '1.5% - 2.0%',
      sugar: '14% - 18%',
      color: 'Brown / Dark orange',
      body: 'Thin to medium',
      grade: 'X-60 (Dark / Low body)',
    },
  },
  {
    id: '05',
    name: 'FCV TRADITIONAL (VB/X20)',
    description: 'A variegated, orange-brown leaf with medium body and balanced chemical levels. Commonly used as a balancing leaf in cigarette blends.',
    specs: {
      nicotine: '2.0% - 2.6%',
      sugar: '16% - 20%',
      color: 'Variegated / Orange-brown',
      body: 'Medium',
      grade: 'VB / X20 (Variegated Bright / Dark Orange)',
    },
  },
  {
    id: '06',
    name: 'FCV TRADITIONAL (LMG)',
    description: 'Harvested from the lower to middle stalk, this lemon-yellow leaf is thin to medium in body. It is used for sweetness improvement in mild blends.',
    specs: {
      nicotine: '1.3% - 1.9%',
      sugar: '20% - 27%',
      color: 'Lemon yellow to light lemon',
      body: 'Thin to medium',
      grade: 'LMG (Lemon Medium Grade)',
    },
  },
  {
    id: '07',
    name: 'FCV TRADITIONAL (REFUSE)',
    description: 'Consists of mixed scrap and below-grading pieces. It is utilized for re-drying, reconstituted tobacco, and low-cost blending.',
    specs: {
      nicotine: '1.0% - 2.2%',
      sugar: '8% - 18%',
      color: 'Mixed (dark / greenish / variegated)',
      body: 'Thin / broken / small pieces',
      grade: 'Refuse (Below grading)',
    },
  },
  {
    id: '08',
    name: 'FCV TRADITIONAL (X70)',
    description: 'A lower-grade, dark leaf with thin body. Used in low-cost blending to manage sweetness levels.',
    specs: {
      nicotine: '1.2% - 1.8%',
      sugar: '10% - 16%',
      color: 'Dark brown / dull orange',
      body: 'Thin / light leaf',
      grade: 'X-70 (Low body / dark leaf)',
    },
  },
  {
    id: '09',
    name: 'FCV TRADITIONAL (B/4)',
    description: 'A top-grade leaf from the upper stalk position. It features a thick, heavy body and reddish-orange color, adding strength and flavor to premium blends.',
    specs: {
      nicotine: '1.5% - 3.0%',
      sugar: '15% - 21%',
      color: 'Orange to Reddish Orange',
      body: 'Thick / heavy body',
      grade: 'B/4 (Top Grade)',
    },
  },
  {
    id: '10',
    name: 'FCV NLS',
    description: 'Non-leaf scrap consisting of small broken lamina pieces. It is mainly used as a filler in low-cost cigarette blends or for reconstituted tobacco.',
    specs: {
      nicotine: '1.5% - 2.0%',
      sugar: '10% - 15%',
      color: 'Mixed (brown / dull lemon / orange)',
      body: 'Light / broken pieces',
      grade: 'NLS (Non-Leaf Scrap)',
    },
  },
  {
    id: '11',
    name: 'FCV TRADITIONAL (LBY2)',
    description: 'A third-grade leaf from the middle to upper stalk. It offers a medium body and is used for strength balancing and export blending.',
    specs: {
      nicotine: '1.5% - 3.0%',
      sugar: '5% - 21%',
      color: 'Yellow to orange (Y2 type)',
      body: 'Medium body',
      grade: 'B/Y2 (3rd Grade)',
    },
  },
  {
    id: '12',
    name: 'FCV TRADITIONAL (X50)',
    description: 'A thin to medium body leaf used primarily for cost control and reducing sweetness in various tobacco blends.',
    specs: {
      nicotine: '1.6% - 2.2%',
      sugar: '12% - 18%',
      color: 'Brown / dull orange',
      body: 'Thin to medium',
      grade: 'X-50 (Low-Medium quality)',
    },
  },
  {
    id: '13',
    name: 'BURLEY (VB)',
    description: 'A standard Burley tobacco characterized by low sugar and medium nicotine. Its buff to tan color makes it a primary choice for filler tobacco.',
    specs: {
      nicotine: '~2.0%',
      sugar: '~1.5%',
      color: 'Buff to tan',
      body: 'Filler tobacco',
      grade: 'VB',
    },
  },
  {
    id: '14',
    name: 'WBR - WHITE BURLEY',
    description: 'A medium-high strength Burley with low to medium sugar. Used extensively in cigarette blends, chewing tobacco, and hookah blending.',
    specs: {
      nicotine: '2.5% - 2.8%',
      sugar: '2.0% - 2.5%',
      color: 'White Burley type',
      body: 'Medium-High strength',
      grade: 'WBR',
    },
  },
  {
    id: '15',
    name: 'BURLEY (B1BR)',
    description: 'A high-quality Indian Burley with light brown to creamy white coloring. It is medium to high in nicotine and used for premium cigarette and export blends.',
    specs: {
      nicotine: '2.2% - 2.8%',
      sugar: '1.5% - 2.2%',
      color: 'Light brown to creamy white',
      body: 'Better quality Burley',
      grade: 'B1BR (Burley 1 Bright)',
    },
  },
  {
    id: '16',
    name: 'BURLEY (WC 40)',
    description: 'A white cutter grade Burley with balanced nicotine and sugar levels, used typically as a high-grade filler.',
    specs: {
      nicotine: '1.8% - 2.3%',
      sugar: '1.8% - 2.6%',
      color: 'White Cutter type',
      body: 'Medium',
      grade: 'WC-40 (White Cutter)',
    },
  },
  {
    id: '17',
    name: 'BURLEY (W L-40)',
    description: 'Harvested from the bottom leaves (lugs), this thin leaf tobacco has low nicotine and is used for mild cigarette blends and flavor balancing.',
    specs: {
      nicotine: '1.2% - 1.8%',
      sugar: '2.0% - 3.0%',
      color: 'Pale / light yellow-white',
      body: 'Thin leaf, light body',
      grade: 'WL-40 (White Lugs)',
    },
  },
  {
    id: '18',
    name: 'BURLEY - GRADE: WL-20',
    description: 'A very light, pale white lug leaf from the bottom of the stalk. Ideal for balancing sweetness in mild cigarette blends.',
    specs: {
      nicotine: '1.0% - 1.5%',
      sugar: '2.2% - 3.2%',
      color: 'Very light / pale white',
      body: 'Thin leaf',
      grade: 'WL-20 (White Lugs)',
    },
  },
  {
    id: '19',
    name: 'BURLEY (WBX)',
    description: 'A top-quality Burley from the upper stalk with good thickness and high nicotine. Used for premium and export cigarette blends.',
    specs: {
      nicotine: '2.6% - 3.2%',
      sugar: '1.5% - 2.2%',
      color: 'Creamy white / uniform',
      body: 'Good thickness',
      grade: 'WBX (White Burley Extra)',
    },
  },
  {
    id: '20',
    name: 'BURLEY (ECDK)',
    description: 'An export-grade dark Karnataka Burley. It has a heavy, thick body and high nicotine, making it suitable for strong cigarettes and chewing tobacco.',
    specs: {
      nicotine: '2.8% - 3.5%',
      sugar: '0.8% - 1.5%',
      color: 'Dark brown',
      body: 'Thick leaf, heavy body',
      grade: 'ECDK (Export Cured Dark Karnataka)',
    },
  },
  {
    id: '21',
    name: 'BURLEY (WBR)',
    description: 'Regular White Burley with a medium to good body and creamy white to light brown color. Preferred for export and cigarette blending.',
    specs: {
      nicotine: '2.3% - 2.8%',
      sugar: '1.8% - 2.5%',
      color: 'Creamy white to light brown',
      body: 'Medium to good body',
      grade: 'WBR (White Burley Regular)',
    },
  },
  {
    id: '22',
    name: 'BURLEY HDBRG/RTL',
    description: 'A high-density regular grade Burley with a dense leaf and high body. Specifically used to add strength to tobacco blends.',
    specs: {
      nicotine: '2.4% - 3.0%',
      sugar: '1.0% - 1.8%',
      color: 'Dense leaf',
      body: 'High body / dense',
      grade: 'HDBRG (High Density Burley Regular)',
    },
  },
  {
    id: '23',
    name: 'BURLEY HD 3',
    description: 'A high-density grade leaf with medium-strong strength. It is slightly lighter than HD-1 and HD-2 grades but maintains good body.',
    specs: {
      nicotine: '2.0% - 2.6%',
      sugar: '1.2% - 2.0%',
      color: 'Medium density',
      body: 'Medium density',
      grade: 'HD-3 (High Density Grade-3)',
    },
  },
  {
    id: '24',
    name: 'BURLEY VB X1',
    description: 'A top-quality Venukonda Burley with good thickness and medium-high nicotine. Highly suitable for premium cigarette and export blends.',
    specs: {
      nicotine: '2.3% - 2.9%',
      sugar: '1.4% - 2.1%',
      color: 'Creamy white to light brown',
      body: 'Good thickness',
      grade: 'VB X1 (Venukonda Burley X1)',
    },
  },
  {
    id: '25',
    name: 'BURLEY WBR2A/RTL',
    description: 'A regular white Burley with medium-strong nicotine and good color. Primarily used in diverse cigarette blends.',
    specs: {
      nicotine: '2.1% - 2.6%',
      sugar: '1.8% - 2.4%',
      color: 'White / light brown',
      body: 'Medium body',
      grade: 'WBR-2A (White Burley Regular)',
    },
  },
  {
    id: '26',
    name: 'RED CHOPADIA',
    description: 'A dark, coarse tobacco with thick leaves and reddish-brown color. Used in chewing tobacco and for improving the strength of cigarette blends.',
    specs: {
      nicotine: '2.0% - 3.2%',
      sugar: '6% - 12%',
      color: 'Reddish brown / dark red',
      body: 'Medium to heavy',
      grade: 'Red Chopadia',
    },
  },
  {
    id: '27',
    name: 'ASSAM MOTIHARI',
    description: 'A very strong, pungent air-cured tobacco from Bihar. With very high nicotine, it is a staple for chewing tobacco, Zarda, Gutkha, and Hookah blends.',
    specs: {
      nicotine: '3.5% - 6.5%',
      sugar: '2% - 8%',
      color: 'Dark brown to black',
      body: 'Very heavy',
      grade: 'Assam Motihari',
    },
  },
  {
    id: '28',
    name: 'KURNOOL NATU',
    description: 'A very strong country tobacco with thick, heavy leaves and dark brown coloring. It is prized for its high nicotine and strong flavor profile.',
    specs: {
      nicotine: '2.5% - 4.0%',
      sugar: '4% - 10%',
      color: 'Dark brown / reddish',
      body: 'Heavy / thick leaf',
      grade: 'Kurnool Natu',
    },
  },
  {
    id: '29',
    name: 'MYSORE FCV (MX 4)',
    description: 'A medium-low quality FCV from Mysore with a medium body. It provides a medium-strong strength for cigarette blends.',
    specs: {
      nicotine: '2.0% - 2.8%',
      sugar: '12% - 18%',
      color: 'Brown / dull orange / reddish',
      body: 'Medium body',
      grade: 'MX-4 Mysore FCV',
    },
  },
  {
    id: '30',
    name: 'FCV SCRAP',
    description: 'A mixture of broken leaf, lamina scrap, and re-drying scrap. Used as a filler in cigarette blends and for manufacturing cut rag tobacco.',
    specs: {
      nicotine: '1.2% - 2.2%',
      sugar: '8% - 16%',
      color: 'Mixed (Yellow / Orange / Brown)',
      body: 'Thin / broken',
      grade: 'FCV Scrap',
    },
  },
  {
    id: '31',
    name: 'JATHI TOBACCO',
    description: 'A very strong country tobacco with thick, heavy leaves. Widely used for chewing tobacco, Bidi production, and adding strength to dark blends.',
    specs: {
      nicotine: '3.0% - 5.0%',
      sugar: '2% - 8%',
      color: 'Dark brown / blackish',
      body: 'Thick / heavy leaf',
      grade: 'Jathi Tobacco',
    },
  },
  {
    id: '32',
    name: 'CALCUTTI TOBACCO (GUJARAT)',
    description: 'A very strong country tobacco traditionally from the Kolkata belt. Its thick, heavy leaf makes it ideal for chewing, Bidi, and strong blending.',
    specs: {
      nicotine: '2.5% - 4.5%',
      sugar: '3% - 10%',
      color: 'Dark brown / blackish',
      body: 'Heavy / thick leaf',
      grade: 'Calcutti Tobacco',
    },
  },
  {
    id: '33',
    name: 'CALCUTTI TOBACCO — SABAR KANTHA',
    description: 'A variant of Calcutti tobacco from Gujarat with very high nicotine and very low sugar. Preferred for Zarda, Khaini, and Gutkha blending.',
    specs: {
      nicotine: '3.0% - 4.8%',
      sugar: '2% - 8%',
      color: 'Dark brown / blackish',
      body: 'Heavy / thick leaf',
      grade: 'Sabar Kantha Calcutti',
    },
  },
  {
    id: '34',
    name: 'CALCUTTI TOBACCO — BANAS KANTHA',
    description: 'High-nicotine Calcutti tobacco from the Banaskantha region. It is used in strong blending for chewing tobacco and Gutkha.',
    specs: {
      nicotine: '2.8% - 4.0%',
      sugar: '2% - 7%',
      color: 'Dark brown / blackish',
      body: 'Thick / heavy leaf',
      grade: 'Banaskantha Calcutti',
    },
  },
  {
    id: '35',
    name: 'KAMAPALA (GADHIYA)',
    description: 'A country tobacco from Uttar Pradesh used for its thick, heavy leaf. It delivers a strong to very strong profile for chewing and Gutkha.',
    specs: {
      nicotine: '0.5% - 2.0%',
      sugar: '3% - 9%',
      color: 'Dark brown / reddish brown',
      body: 'Thick / heavy leaf',
      grade: 'Kamapala (Gadhiya)',
    },
  },
  {
    id: '36',
    name: 'ORCHA',
    description: 'A very strong heavy-bodied tobacco from Uttar Pradesh. It is primarily used for its strength in specialized dark tobacco blending.',
    specs: {
      nicotine: '0.5% - 1.2%',
      sugar: '2% - 7%',
      color: 'Dark brown / blackish',
      body: 'Heavy / thick leaf',
      grade: 'Orcha / Kamapala type',
    },
  },
  {
    id: '37',
    name: 'FCV X30 ZIMBABWE',
    description: 'A medium-strong flue-cured tobacco from Zimbabwe. This medium-body orange leaf is used for strength balancing in cigarette and export blends.',
    specs: {
      nicotine: '2.0% - 2.6%',
      sugar: '14% - 20%',
      color: 'Orange-brown / dull orange',
      body: 'Medium',
      grade: 'X-30 (Low-Medium grade)',
    },
  },
  {
    id: '38',
    name: 'C 230 F ZIMBABWE',
    description: 'Middle-leaf cutter grade from Zimbabwe. It offers a smooth blending experience with medium strength and bright orange color.',
    specs: {
      nicotine: '1.8% - 2.4%',
      sugar: '18% - 24%',
      color: 'Orange / Bright Orange',
      body: 'Medium body',
      grade: 'C 230 F (Cutter)',
    },
  },
  {
    id: '39',
    name: 'C1LT ZIMBABWE',
    description: 'Premium lemon-tip cutter leaf from Zimbabwe. It is mild to medium in strength and highly used for improving smoothness and balancing sweetness.',
    specs: {
      nicotine: '1.6% - 2.2%',
      sugar: '20% - 26%',
      color: 'Lemon to Bright Lemon',
      body: 'Thin to medium',
      grade: 'C1LT (Cutter 1 - Lemon Tip)',
    },
  },
]

function categorizeProduct(name: string): string {
  if (name.includes('FCV') && !name.includes('ZIMBABWE')) {
    return 'FCV Tobacco'
  }
  if (name.includes('BURLEY')) {
    return 'Burley Tobacco'
  }
  if (name.includes('ZIMBABWE')) {
    return 'Zimbabwe Cured'
  }
  if (
    name.includes('ASSAM') ||
    name.includes('KURNOOL') ||
    name.includes('JATHI') ||
    name.includes('CALCUTTI') ||
    name.includes('KAMAPALA') ||
    name.includes('ORCHA')
  ) {
    return 'Country Blend'
  }
  return 'Premium Selection'
}

export async function POST() {
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    if (!firebaseConfig.projectId) {
      return NextResponse.json(
        { error: 'Firebase credentials not configured in .env.local' },
        { status: 400 }
      )
    }

    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    const batch = writeBatch(db)
    let addedCount = 0

    productCatalog.forEach((product, index) => {
      const docRef = doc(collection(db, 'products'))
      batch.set(docRef, {
        productId: product.id,
        name: product.name,
        category: categorizeProduct(product.name),
        description: product.description,
        nicotine: product.specs.nicotine,
        sugar: product.specs.sugar,
        color: product.specs.color,
        body: product.specs.body,
        grade: product.specs.grade,
        featured: index < 6,
        imageUrl: '',
        createdAt: Timestamp.now(),
      })
      addedCount++
    })

    await batch.commit()

    return NextResponse.json({
      success: true,
      message: `✓ Successfully seeded ${addedCount} products to Firestore!`,
      productsAdded: addedCount,
      featuredProducts: 6,
    })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      {
        error: 'Failed to seed products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
