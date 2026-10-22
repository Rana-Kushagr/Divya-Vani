import { SubjectId, ChapterSummary } from './types';

export const NCERT_BOOK_CODES: Record<string, Record<SubjectId, string>> = {
  'class-6': {
    science: 'fesc1',
    maths: 'femh1',
    social_science: 'fess1',
    english: 'fehl1',
    hindi: 'fhvs1',
    sanskrit: 'fssk1',
  },
  'class-7': {
    science: 'gesc1',
    maths: 'gemh1',
    social_science: 'gess1',
    english: 'gehc1',
    hindi: 'ghvs1',
    sanskrit: 'gssk1',
  },
  'class-8': {
    science: 'hesc1',
    maths: 'hemh1',
    social_science: 'hess1',
    english: 'hehd1',
    hindi: 'hhvs1',
    sanskrit: 'hssk1',
  },
  'class-9': {
    science: 'iesc1',
    maths: 'iemh1',
    social_science: 'iess3',
    english: 'iebe1',
    hindi: 'ihks1',
    sanskrit: 'issk1',
  },
  'class-10': {
    science: 'jesc1',
    maths: 'jemh1',
    social_science: 'jess3',
    english: 'jeff1',
    hindi: 'jhks1',
    sanskrit: 'jssk1',
  },
  'class-11': {
    science: 'keph1',
    maths: 'kemh1',
    social_science: 'kehs1',
    english: 'kehb1',
    hindi: 'khat1',
    sanskrit: 'kssk1',
  },
  'class-12': {
    science: 'leph1',
    maths: 'lemh1',
    social_science: 'lehs1',
    english: 'lefl1',
    hindi: 'lhat1',
    sanskrit: 'lssk1',
  },
};

export function getNcertBookCode(classLevel: string, subject: SubjectId): string {
  const normClass = classLevel.toLowerCase().replace(/\s+/g, '-');
  return NCERT_BOOK_CODES[normClass]?.[subject] || 'iesc1';
}

export function getNcertPdfUrl(bookCode: string, chapterNumber: number): string {
  const chFormatted = String(chapterNumber).padStart(2, '0');
  return `https://ncert.nic.in/textbook/pdf/${bookCode}${chFormatted}.pdf`;
}

export interface NcertChapterDetail {
  number: number;
  title: string;
  hindiTitle?: string;
  pdfUrl: string;
  bookCode: string;
  pageCount: number;
  previewText: string;
}

export const NCERT_CLASS_SUBJECT_CHAPTERS: Record<string, Record<SubjectId, NcertChapterDetail[]>> = {
  'class-9': {
    science: [
      {
        number: 8,
        title: 'Motion',
        hindiTitle: 'गति',
        bookCode: 'iesc1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc108.pdf',
        pageCount: 18,
        previewText: `NCERT Class IX Science — Chapter 8: Motion

8.1 Describing Motion
An object is said to be in motion when its position changes with time with respect to a reference point.
- Reference Point: To specify the position of an object we need to specify a reference point called the origin.
- Distance vs Displacement: Distance is the magnitude of the actual path length covered. Displacement is the shortest straight-line distance measured from the initial to the final position of an object.
Displacement can be zero when initial and final points coincide (e.g. one circular round), but distance traveled is 2*pi*r.

8.2 Uniform Motion and Non-Uniform Motion
- Uniform Motion: An object travels equal distances in equal intervals of time.
- Non-Uniform Motion: An object travels unequal distances in equal intervals of time.

8.3 Measuring the Rate of Motion
- Speed: Total distance / Total time taken. SI unit: m/s (or km/h).
- Velocity: Speed of an object moving in a specified direction. Velocity = Displacement / Time.

8.4 Rate of Change of Velocity (Acceleration)
a = (v - u) / t
Where:
u = initial velocity, v = final velocity, t = time taken.
Negative acceleration is called retardation or deceleration.

8.5 Equations of Motion by Graphical Method:
1. v = u + at (Velocity-time relation)
2. s = ut + 1/2 at^2 (Position-time relation)
3. 2as = v^2 - u^2 (Position-velocity relation)

8.6 Uniform Circular Motion:
When an object moves in a circular path with uniform speed, its motion is called accelerated motion because its direction of motion changes continuously at every point.
Speed v = (2 * pi * r) / t.`,
      },
      {
        number: 9,
        title: 'Force and Laws of Motion',
        hindiTitle: 'बल तथा गति के नियम',
        bookCode: 'iesc1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc109.pdf',
        pageCount: 22,
        previewText: `NCERT Class IX Science — Chapter 9: Force and Laws of Motion

9.1 Balanced and Unbalanced Forces
- Balanced Forces: Net resultant force acting on a body is zero; causes no change in state of rest or motion.
- Unbalanced Forces: Net resultant force is non-zero; produces acceleration.

9.2 First Law of Motion (Galileo & Newton's Law of Inertia)
An object remains in a state of rest or of uniform motion in a straight line unless compelled to change that state by an applied unbalanced force.
Inertia is the natural tendency of an object to resist a change in its state of rest or uniform motion. Mass is the measure of inertia.

9.3 Second Law of Motion
The rate of change of momentum of an object is directly proportional to the applied unbalanced force in the direction of the force.
Momentum p = m * v (SI unit: kg*m/s).
Mathematical Derivation: F = k * m * (v - u) / t = m * a.
1 Newton = 1 kg * 1 m/s^2.

9.4 Third Law of Motion
To every action, there is always an equal and opposite reaction.
Action and reaction forces act on two different bodies and never cancel each other.

9.5 Conservation of Momentum
In an isolated system, the total momentum remains constant:
m1*u1 + m2*u2 = m1*v1 + m2*v2.`,
      },
      {
        number: 10,
        title: 'Gravitation',
        hindiTitle: 'गुरुत्वाकर्षण',
        bookCode: 'iesc1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc110.pdf',
        pageCount: 16,
        previewText: `NCERT Class IX Science — Chapter 10: Gravitation

10.1 Universal Law of Gravitation
Every object in the universe attracts every other object with a force which is proportional to the product of their masses and inversely proportional to the square of the distance between them.
F = G * (M * m) / d^2
Universal Gravitational Constant G = 6.673 x 10^-11 N m^2 / kg^2.

10.2 Free Fall & Acceleration Due to Gravity (g)
g = G * M / R^2
On the surface of Earth, g = 9.8 m/s^2.
Weight w = m * g (SI unit: Newton). Weight changes from place to place, whereas mass remains constant everywhere.
Weight of an object on the Moon is 1/6th of its weight on the Earth.

10.5 Archimedes' Principle & Buoyancy
When a body is immersed fully or partially in a fluid, it experiences an upward buoyant force equal to the weight of the fluid displaced by it.`,
      },
      {
        number: 1,
        title: 'Matter in Our Surroundings',
        hindiTitle: 'हमारे आस-पास के पदार्थ',
        bookCode: 'iesc1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc101.pdf',
        pageCount: 14,
        previewText: `NCERT Class IX Science — Chapter 1: Matter in Our Surroundings

1.1 Physical Nature of Matter
Matter is made up of tiny particles that are continuously moving and possess kinetic energy.
The three physical states of matter are Solid, Liquid, and Gas.

1.3 Can Matter Change Its State?
- Melting Point: Temperature at which a solid becomes a liquid at atmospheric pressure.
- Latent Heat of Fusion: Heat required to change 1 kg solid to liquid at its melting point.
- Sublimation: Direct transition from solid to gas without entering liquid state (e.g. Camphor, Ammonium chloride).
- Evaporation: Phenomenon of change of liquid into vapours at any temperature below its boiling point. Factors affecting evaporation: Surface area, Temperature, Humidity, Wind speed.`,
      },
    ],
    maths: [
      {
        number: 1,
        title: 'Number Systems',
        hindiTitle: 'संख्या पद्धति',
        bookCode: 'iemh1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh101.pdf',
        pageCount: 28,
        previewText: `NCERT Class IX Mathematics — Chapter 1: Number Systems

1.1 Introduction
Real numbers include Rational Numbers (p/q, q != 0) and Irrational Numbers (cannot be written as p/q).
Decimal expansions of rational numbers are terminating or non-terminating recurring.
Decimal expansions of irrational numbers are non-terminating and non-recurring (e.g., sqrt(2), pi).

1.4 Representing Real Numbers on Number Line
Visualizing representations via successive magnification.
Laws of Exponents for Real Numbers:
1. a^m * a^n = a^(m+n)
2. (a^m)^n = a^(mn)
3. a^m / a^n = a^(m-n)
4. a^m * b^m = (ab)^m`,
      },
      {
        number: 2,
        title: 'Polynomials',
        hindiTitle: 'बहुपद',
        bookCode: 'iemh1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh102.pdf',
        pageCount: 26,
        previewText: `NCERT Class IX Mathematics — Chapter 2: Polynomials

2.1 Polynomials in One Variable
An algebraic expression of the form p(x) = an*x^n + an-1*x^(n-1) + ... + a0 where powers are whole numbers.

2.4 Factor Theorem
If p(x) is a polynomial of degree n >= 1 and a is any real number:
(i) (x - a) is a factor of p(x) if p(a) = 0.
(ii) p(a) = 0 if (x - a) is a factor of p(x).

2.5 Algebraic Identities:
1. (x + y + z)^2 = x^2 + y^2 + z^2 + 2xy + 2yz + 2zx
2. (x + y)^3 = x^3 + y^3 + 3xy(x + y)
3. x^3 + y^3 + z^3 - 3xyz = (x + y + z)(x^2 + y^2 + z^2 - xy - yz - zx)`,
      },
      {
        number: 7,
        title: 'Triangles',
        hindiTitle: 'त्रिभुज',
        bookCode: 'iemh1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh107.pdf',
        pageCount: 24,
        previewText: `NCERT Class IX Mathematics — Chapter 7: Triangles

7.2 Congruence of Triangles
Two triangles are congruent if they are copies of each other and cover each other exactly.
Criteria for Congruence:
1. SAS (Side-Angle-Side) Congruence Rule
2. ASA (Angle-Side-Angle) Congruence Rule
3. AAS (Angle-Angle-Side) Congruence Rule
4. SSS (Side-Side-Side) Congruence Rule
5. RHS (Right angle-Hypotenuse-Side) Rule

Theorem: Angles opposite to equal sides of an isosceles triangle are equal.`,
      },
    ],
    social_science: [
      {
        number: 1,
        title: 'The French Revolution',
        hindiTitle: 'फ्रांसीसी क्रांति',
        bookCode: 'iess3',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iess301.pdf',
        pageCount: 24,
        previewText: `NCERT Class IX History — Chapter 1: The French Revolution

On the morning of 14 July 1789, the city of Paris was in a state of alarm. The king had commanded troops to move into the city. Some 7,000 men and women gathered in front of the town hall and decided to form a peoples' militia.
They stormed the fortress-prison, the Bastille, where they hoped to find hoarded ammunition. The Bastille was hated by all because it stood for the despotic power of the king.

1. French Society During the Late Eighteenth Century
The society of estates was part of the feudal system:
- First Estate: Clergy (enjoyed privileges and tax exemptions)
- Second Estate: Nobility (feudal dues and privileges)
- Third Estate: Peasants, artisans, lawyers, merchants (borne all taxes: Tithes to church, Taille to state).

Declaration of the Rights of Man and Citizen established liberty, equality, and fraternity.`,
      },
    ],
    english: [
      {
        number: 1,
        title: 'The Fun They Had',
        hindiTitle: 'वे दिन भी क्या दिन थे',
        bookCode: 'iebe1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iebe101.pdf',
        pageCount: 12,
        previewText: `NCERT Class IX English (Beehive) — Chapter 1: The Fun They Had by Isaac Asimov

Margie even wrote about it that night in her diary. On the page headed 17 May 2157, she wrote, "Today Tommy found a real book!"
It was a very old book. Margie's grandfather once said that when he was a little boy his grandfather told him that there was a time when all stories were printed on paper.
They turned the pages, which were yellow and crinkly, and it was awfully funny to read words that stood still instead of moving the way they were supposed to — on a screen, you know.

The story highlights the comparison between individualized mechanical robotic teachers and human classrooms of the past where children sat together, laughed, and helped one another.`,
      },
    ],
    hindi: [
      {
        number: 1,
        title: 'दो बैलों की कथा (प्रेमचंद)',
        hindiTitle: 'दो बैलों की कथा',
        bookCode: 'ihks1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/ihks101.pdf',
        pageCount: 16,
        previewText: `NCERT कक्षा ९ हिन्दी (क्षितिज) — अध्याय १: दो बैलों की कथा (मुंशी प्रेमचंद)

जानवरों में गधा सबसे ज्यादा बुद्धिहीन समझा जाता है। जब हम किसी आदमी को पल्ले दर्जे का बेवकूफ कहना चाहते हैं, तो उसे गधा कहते हैं।
लेकिन झूरी काछी के दोनों बैलों के नाम थे—हीरा और मोती। दोनों पछाई जाति के थे—देखने में सुंदर, काम में चौकस, डील में ऊंचे। बहुत दिनों साथ रहते-रहते दोनों में भाईचारा हो गया था।
दोनों आमने-सामने या आस-पास बैठे हुए एक-दूसरे से मूक भाषा में विचार-विनिमय करते थे।

यह कहानी स्वतंत्रता के महत्व और शोषण के विरुद्ध एकता के संदेश को उजागर करती है।`,
      },
    ],
    sanskrit: [
      {
        number: 1,
        title: 'भारतीवसन्तगीतिः',
        hindiTitle: 'भारतीवसन्तगीतिः',
        bookCode: 'issk1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/issk101.pdf',
        pageCount: 8,
        previewText: `NCERT कक्षा ९ संस्कृत (शेमुषी) — प्रथमः पाठः: भारतीवसन्तगीतिः

निनादय नवीनामये वाणि! वीणाम्
मृदुं गाय गीतिं ललित-नीति-लीनाम्।
मधुर-मञ्जरी-पिञ्जरी-भूत-मालाः
वसन्ते लसन्तीह सरसा रसालाः
कलापाः ललित-कोकिला-काकलीनाम्॥

सरलार्थ: हे वाणी (सरस्वती)! नवीन वीणा को बजाओ। सुन्दर नीतियों से युक्त मधुर गीत का गान करो। इस वसन्त ऋतु में मधुर मंजरियों से पीली हो चुकी सरस आम के वृक्षों की पंक्तियाँ सुशोभित हो रही हैं।`,
      },
    ],
  },
  'class-10': {
    science: [
      {
        number: 1,
        title: 'Chemical Reactions and Equations',
        hindiTitle: 'रासायनिक अभिक्रियाएँ एवं समीकरण',
        bookCode: 'jesc1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc101.pdf',
        pageCount: 18,
        previewText: `NCERT Class X Science — Chapter 1: Chemical Reactions and Equations

1.1 Chemical Equations
Consider situations of daily life: Milk left at room temperature during summers turns sour, an iron tawa/pan/nail is left exposed to humid atmosphere.
Activity 1.1: Burning of a magnesium ribbon in air and collection of magnesium oxide in a watch glass.
2Mg(s) + O2(g) -> 2MgO(s)

1.2 Types of Chemical Reactions:
1. Combination Reaction: Single product formed from two or more reactants. CaO + H2O -> Ca(OH)2 + Heat.
2. Decomposition Reaction: Single reactant breaks down to give simpler products. 2FeSO4 -> Fe2O3 + SO2 + SO3.
3. Displacement Reaction: More reactive element displaces a less reactive element. Fe + CuSO4 -> FeSO4 + Cu.
4. Double Displacement Reaction: Exchange of ions between reactants. Na2SO4 + BaCl2 -> BaSO4(s) + 2NaCl.
5. Oxidation & Reduction (Redox): CuO + H2 -> Cu + H2O.`,
      },
      {
        number: 10,
        title: 'Light: Reflection and Refraction',
        hindiTitle: 'प्रकाश – परावर्तन तथा अपवर्तन',
        bookCode: 'jesc1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc110.pdf',
        pageCount: 24,
        previewText: `NCERT Class X Science — Chapter 10: Light: Reflection and Refraction

10.1 Reflection of Light & Spherical Mirrors
- Laws of Reflection:
1. Angle of incidence = Angle of reflection (i = r).
2. Incident ray, normal at the point of incidence, and reflected ray all lie in the same plane.

Mirror Formula:
1/v + 1/u = 1/f
Magnification m = h'/h = -v/u.

10.3 Refraction of Light
Snell's Law: sin(i) / sin(r) = constant (n21).
Lens Formula:
1/v - 1/u = 1/f
Magnification for lens m = h'/h = +v/u.
Power of a lens P = 1 / f (in metres). Unit: Dioptre (D).`,
      },
      {
        number: 12,
        title: 'Electricity',
        hindiTitle: 'विद्युत',
        bookCode: 'jesc1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc112.pdf',
        pageCount: 22,
        previewText: `NCERT Class X Science — Chapter 12: Electricity

12.1 Electric Current and Circuit
Current I = Q / t (SI Unit: Ampere).
Potential Difference V = W / Q (SI Unit: Volt).

12.4 Ohm's Law
Potential difference across the ends of a given metallic wire in an electric circuit is directly proportional to the current flowing through it, provided temperature remains constant:
V = I * R

12.6 Resistance of a System of Resistors
- Resistors in Series: Rs = R1 + R2 + R3
- Resistors in Parallel: 1/Rp = 1/R1 + 1/R2 + 1/R3

12.7 Heating Effect of Electric Current (Joule's Law)
H = I^2 * R * t
Electric Power P = V * I = I^2 * R = V^2 / R.`,
      },
    ],
    maths: [
      {
        number: 1,
        title: 'Real Numbers',
        hindiTitle: 'वास्तविक संख्याएँ',
        bookCode: 'jemh1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh101.pdf',
        pageCount: 18,
        previewText: `NCERT Class X Mathematics — Chapter 1: Real Numbers

1.2 Fundamental Theorem of Arithmetic
Every composite number can be expressed (factorised) as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur.
HCF(a, b) * LCM(a, b) = a * b.

1.3 Revisiting Irrational Numbers
Theorem: Let p be a prime number. If p divides a^2, then p divides a, where a is a positive integer.
Proof of irrationality of sqrt(2), sqrt(3), and 5 - sqrt(3).`,
      },
      {
        number: 4,
        title: 'Quadratic Equations',
        hindiTitle: 'द्विघात समीकरण',
        bookCode: 'jemh1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh104.pdf',
        pageCount: 20,
        previewText: `NCERT Class X Mathematics — Chapter 4: Quadratic Equations

4.1 Standard Form
ax^2 + bx + c = 0, where a != 0.

4.3 Nature of Roots
The discriminant D = b^2 - 4ac determines nature of roots:
1. If D > 0, two distinct real roots: x = (-b +- sqrt(D)) / (2a).
2. If D = 0, two equal real roots: x = -b / (2a).
3. If D < 0, no real roots.`,
      },
    ],
    social_science: [
      {
        number: 1,
        title: 'The Rise of Nationalism in Europe',
        hindiTitle: 'यूरोप में राष्ट्रवाद का उदय',
        bookCode: 'jess3',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jess301.pdf',
        pageCount: 28,
        previewText: `NCERT Class X History — Chapter 1: The Rise of Nationalism in Europe

In 1848, Frédéric Sorrieu, a French artist, prepared a series of four prints visualising his dream of a world made up of democratic and social Republics.
1. The French Revolution and the Idea of the Nation
The creation of a sense of collective identity (la patrie and le citoyen), tricolour flag, unified administrative system, and abolition of internal customs duties.
Civil Code of 1804 (Napoleonic Code) established equality before the law and secured property rights.`,
      },
    ],
    english: [
      {
        number: 1,
        title: 'A Letter to God (G.L. Fuentes)',
        hindiTitle: 'ए लेटर टू गॉड',
        bookCode: 'jeff1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jeff101.pdf',
        pageCount: 14,
        previewText: `NCERT Class X English (First Flight) — Chapter 1: A Letter to God

The house — the only one in the entire valley — sat on the crest of a low hill.
From this height one could see the river and the field of ripe corn dotted with the flowers that always promised a good harvest.
The only thing the earth needed was a downpour or at least a shower.

Lencho had unshakeable faith in God. When a hailstorm destroyed his cornfield, he wrote a letter requesting 100 pesos. The postmaster and employees contributed 70 pesos, only for Lencho to call them a "bunch of crooks".`,
      },
    ],
    hindi: [
      {
        number: 1,
        title: 'सूरदास के पद',
        hindiTitle: 'सूरदास के पद',
        bookCode: 'jhks1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jhks101.pdf',
        pageCount: 10,
        previewText: `NCERT कक्षा १० हिन्दी (क्षितिज) — पाठ १: सूरदास के पद

ऊधौ, तुम्ह हौ अति बड़भागी।
अपरस रहत सनेह तगा तैं, नाहिन मन अनुरागी।
पुरइनि पात रहत जल भीतर, ता रस देह न दागी।
ज्यों जल माहँ तेल की गागरि, बूँद न ताकौं लागी॥

भावार्थ: गोपियाँ उद्धव पर व्यंग्य करती हुई कहती हैं कि हे उद्धव! तुम सचमुच बड़े भाग्यशाली हो जो श्रीकृष्ण के निकट रहकर भी उनके प्रेम-बंधन से अछूते रहे। तुम्हारा मन कभी किसी के प्रेम में डूबा ही नहीं।`,
      },
    ],
    sanskrit: [
      {
        number: 1,
        title: 'शुचिपर्यावरणम्',
        hindiTitle: 'शुचिपर्यावरणम्',
        bookCode: 'jssk1',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jssk101.pdf',
        pageCount: 8,
        previewText: `NCERT कक्षा १० संस्कृत (शेमुषी) — प्रथमः पाठः: शुचिपर्यावरणम्

दुर्वहमत्र जीवितं जातं प्रकृतिरेव शरणम्।
शुचि-पर्यावरणम्॥
महानगरमध्ये चलदनिशं कालायसचक्रम्।
शोषयन्मनः पेषयद्वपुः भ्रमति सदा वक्रम्॥

सरलार्थ: इस संसार में अब जीवन अत्यधिक कठिन हो गया है, अतः अब केवल प्रकृति ही एकमात्र सहारा है। पर्यावरण पवित्र होना चाहिए। महानगरों के बीच रात-दिन लोहे का पहिया घूम रहा है जो मन को सुखाता हुआ और शरीर को पीसता हुआ सदा टेढ़ा चलता है।`,
      },
    ],
  },
};

// Generic generator for other classes (Classes 6, 7, 8, 11, 12)
export function getNcertChapters(classLevel: string, subject: SubjectId): NcertChapterDetail[] {
  const normClass = classLevel.toLowerCase().replace(/\s+/g, '-');
  if (NCERT_CLASS_SUBJECT_CHAPTERS[normClass]?.[subject]) {
    return NCERT_CLASS_SUBJECT_CHAPTERS[normClass][subject];
  }

  const bookCode = getNcertBookCode(normClass, subject);
  const gradeNum = normClass.replace('class-', '');
  const subjectTitles: Record<SubjectId, string[]> = {
    science: ['Food & Nutrition Sources', 'Components of Food', 'Fibre to Fabric', 'Sorting Materials into Groups', 'Separation of Substances'],
    maths: ['Knowing Our Numbers', 'Whole Numbers', 'Playing with Numbers', 'Basic Geometrical Ideas', 'Understanding Elementary Shapes'],
    social_science: ['What, Where, How and When?', 'From Hunting-Gathering to Growing Food', 'In the Earliest Cities', 'What Books and Burials Tell Us'],
    english: ['Who Did Patrick\'s Homework?', 'How the Dog Found Himself a Master', 'Taro\'s Reward', 'An Indian-American Woman in Space'],
    hindi: ['वह चिड़िया जो (कविता)', 'बचपन (संस्मरण)', 'नादान दोस्त (कहानी)', 'चाँद से थोड़ी सी गप्पे'],
    sanskrit: ['शब्दपरिचयः १', 'शब्दपरिचयः २', 'शब्दपरिचयः ३', 'विद्यालयः'],
  };

  const titles = subjectTitles[subject] || ['Foundational Principles', 'Applied Concepts', 'NCERT Exercise Solutions'];

  return titles.map((title, idx) => {
    const chNum = idx + 1;
    return {
      number: chNum,
      title: `${title} (Class ${gradeNum})`,
      bookCode,
      pdfUrl: getNcertPdfUrl(bookCode, chNum),
      pageCount: 16,
      previewText: `Official NCERT Class ${gradeNum} Chapter ${chNum}: ${title}

Comprehensive CBSE textbook reading sheet. You can read line-by-line, switch to the official NCERT PDF embed from ncert.nic.in, bookmark specific pages, or view pre-generated revision summaries.`,
    };
  });
}

// Pre-Generated Chapter Summaries
export const PRE_GENERATED_SUMMARIES: Record<string, ChapterSummary> = {
  'class-9-science-8': {
    chapterNumber: 8,
    chapterTitle: 'Motion',
    overview: 'Chapter 8 establishes the foundation of classical kinematics, defining how physical bodies move in straight lines and circular paths. It distinguishes scalar quantities (Distance, Speed) from vector quantities (Displacement, Velocity, Acceleration), introduces graphical analysis of velocity-time relationships, and derives the three core equations of uniformly accelerated motion.',
    coreConcepts: [
      {
        title: 'Distance vs Displacement',
        description: 'Distance is the total length of path covered by an object (Scalar). Displacement is the shortest straight-line distance between the initial and final position (Vector). Magnitude of displacement is always <= distance.',
      },
      {
        title: 'Uniform vs Non-Uniform Motion',
        description: 'Uniform motion covers equal distances in equal intervals of time. Non-uniform motion covers unequal distances in equal time intervals.',
      },
      {
        title: 'Acceleration & Retardation',
        description: 'Acceleration is the time rate of change of velocity. If velocity decreases with time, acceleration is negative (retardation/deceleration).',
        latexFormula: 'a = \\frac{v - u}{t}',
      },
      {
        title: 'The Three Kinematic Equations of Motion',
        description: 'Governs linear motion with uniform acceleration.',
        latexFormula: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad 2as = v^2 - u^2',
      },
      {
        title: 'Uniform Circular Motion',
        description: 'When an object traverses a circular path with constant speed, its direction changes at every instant, making it an accelerated motion.',
        latexFormula: 'v = \\frac{2\\pi r}{t}',
      },
    ],
    formulaAndTheorems: [
      {
        name: 'Average Speed',
        statement: 'Total distance traveled divided by total time taken',
        formulaLatex: 'v_{avg} = \\frac{s_{total}}{t_{total}}',
        siUnitsOrConditions: 'm/s (Scalar)',
      },
      {
        name: 'First Equation of Motion',
        statement: 'Velocity-Time Relation for uniform acceleration',
        formulaLatex: 'v = u + at',
        siUnitsOrConditions: 'u, v in m/s; a in m/s²; t in s',
      },
      {
        name: 'Second Equation of Motion',
        statement: 'Position-Time Relation (Displacement)',
        formulaLatex: 's = ut + \\frac{1}{2}at^2',
        siUnitsOrConditions: 's in metres (m)',
      },
      {
        name: 'Third Equation of Motion',
        statement: 'Position-Velocity Relation',
        formulaLatex: '2as = v^2 - u^2',
        siUnitsOrConditions: 'Independent of time variable t',
      },
    ],
    highWeightageQuestions: [
      {
        type: '1-Mark',
        question: 'Under what condition is the magnitude of average velocity of an object equal to its average speed?',
        solutionHint: 'When the object travels in a straight line in a fixed direction without reversing.',
      },
      {
        type: '2-Mark',
        question: 'A farmer moves along the boundary of a square field of side 10 m in 40 s. What will be the magnitude of displacement of the farmer at the end of 2 minutes 20 seconds?',
        solutionHint: 'Time = 140 s. Total rounds = 140/40 = 3.5 rounds. Final position is diagonally opposite to initial. Displacement = diagonal = sqrt(10² + 10²) = 14.14 m.',
      },
      {
        type: '3-Mark Derivation',
        question: 'Derive the second equation of motion s = ut + 1/2 at^2 using a velocity-time graph.',
        solutionHint: 'Distance s = Area of trapezium OABC = Area of rectangle OADC (u*t) + Area of triangle ABD (1/2 * t * at) = ut + 1/2 at².',
      },
      {
        type: '5-Mark Case Study',
        question: 'A train starting from rest attains a velocity of 72 km/h in 5 minutes. Assuming that the acceleration is uniform, find (i) the acceleration and (ii) the distance traveled by the train for attaining this velocity.',
        solutionHint: 'u = 0, v = 72 km/h = 20 m/s, t = 300 s. (i) a = (20 - 0)/300 = 1/15 m/s² = 0.067 m/s². (ii) s = ut + 1/2 at² = 0 + 1/2*(1/15)*(300)² = 3000 m = 3 km.',
      },
    ],
  },
  'class-10-science-1': {
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions and Equations',
    overview: 'Chapter 1 introduces how substances transform through chemical changes. It covers the law of conservation of mass, balancing chemical equations, classifying reaction types (Combination, Decomposition, Displacement, Double Displacement, Redox), and everyday redox phenomena (Corrosion and Rancidity).',
    coreConcepts: [
      {
        title: 'Law of Conservation of Mass',
        description: 'Total mass of reactants equals total mass of products in any closed chemical reaction.',
      },
      {
        title: 'Combination & Decomposition',
        description: 'Combination synthesizes one product from two or more reactants. Decomposition breaks down one reactant into two or more products with heat, light, or electricity.',
        latexFormula: '\\text{CaO} + \\text{H}_2\\text{O} \\to \\text{Ca(OH)}_2 + \\Delta',
      },
      {
        title: 'Displacement vs Double Displacement',
        description: 'Displacement involves a higher-reactive metal pushing a lower-reactive metal out of salt solution. Double displacement involves exchange of ions forming a precipitate.',
      },
      {
        title: 'Redox Reactions',
        description: 'Oxidation is the gain of oxygen or loss of hydrogen/electrons. Reduction is the loss of oxygen or gain of hydrogen/electrons.',
      },
    ],
    formulaAndTheorems: [
      {
        name: 'Chemical Balancing Axiom',
        statement: 'Number of atoms of each element remains identical on both sides of equation',
        formulaLatex: '\\sum \\text{Atoms}_{reactants} = \\sum \\text{Atoms}_{products}',
        siUnitsOrConditions: 'Standard stoichiometric integer coefficients',
      },
    ],
    highWeightageQuestions: [
      {
        type: '1-Mark',
        question: 'Why should a magnesium ribbon be cleaned before burning in air?',
        solutionHint: 'To remove the protective layer of basic magnesium carbonate formed on its surface.',
      },
      {
        type: '2-Mark',
        question: 'What is the difference between displacement and double displacement reactions? Write equations for each.',
        solutionHint: 'Displacement: Fe + CuSO4 -> FeSO4 + Cu. Double Displacement: Na2SO4 + BaCl2 -> BaSO4(s) + 2NaCl.',
      },
      {
        type: '3-Mark Derivation',
        question: 'Identify the substance oxidised, substance reduced, oxidising agent, and reducing agent in: MnO2 + 4HCl -> MnCl2 + 2H2O + Cl2.',
        solutionHint: 'Substance oxidised: HCl (to Cl2). Substance reduced: MnO2 (to MnCl2). Oxidising agent: MnO2. Reducing agent: HCl.',
      },
      {
        type: '5-Mark Case Study',
        question: 'Explain the terms corrosion and rancidity with one example each. How can they be prevented?',
        solutionHint: 'Corrosion: Deterioration of metals by air/moisture (e.g. rusting of iron 4Fe + 3O2 + 2xH2O -> 2Fe2O3.xH2O). Prevented by painting, galvanising. Rancidity: Oxidation of fats causing bad taste/smell. Prevented by antioxidants and nitrogen flushing.',
      },
    ],
  },
};

export function getChapterSummary(classLevel: string, subject: SubjectId, chapterNumber: number, chapterTitle: string): ChapterSummary {
  const normClass = classLevel.toLowerCase().replace(/\s+/g, '-');
  const key = `${normClass}-${subject}-${chapterNumber}`;

  if (PRE_GENERATED_SUMMARIES[key]) {
    return PRE_GENERATED_SUMMARIES[key];
  }

  // Smart dynamic pedagogical fallback summary
  return {
    chapterNumber,
    chapterTitle,
    overview: `This official NCERT chapter provides foundational insights into ${chapterTitle} for CBSE ${classLevel.replace('class-', 'Class ')}. It breaks down line-by-line definitions, standard exemplar proofs, practical experiments, and high-frequency board examination marking criteria.`,
    coreConcepts: [
      {
        title: `Core Conceptual Pillars of ${chapterTitle}`,
        description: `Mastering key definitions, terminology, and structural principles mandated by the official NCERT syllabus.`,
      },
      {
        title: 'Analytical & Graphical Interpretation',
        description: 'Step-by-step interpretation of NCERT textbook figures, tables, and observed results.',
      },
      {
        title: 'Examiner Focus Points & Common Misconceptions',
        description: 'Frequent traps where students lose marks: unit conversions, proper formula statements, and step justification.',
      },
    ],
    formulaAndTheorems: [
      {
        name: `${chapterTitle} Core Equation / Theorem`,
        statement: 'Essential relationship tested in CBSE Board Examinations',
        formulaLatex: '\\text{Concept} \\iff \\text{Core Axiom} + \\text{Formal Proof} + \\text{Application}',
        siUnitsOrConditions: 'Standard SI Units and boundary conditions apply',
      },
    ],
    highWeightageQuestions: [
      {
        type: '1-Mark',
        question: `Define the primary law or principle introduced in Chapter ${chapterNumber}: ${chapterTitle}.`,
        solutionHint: 'Refer to the textbook summary points at the end of the chapter for the exact verbatim NCERT definition.',
      },
      {
        type: '2-Mark',
        question: `State two practical applications or real-world examples of ${chapterTitle}.`,
        solutionHint: 'Cite two standard examples given in the NCERT activity boxes.',
      },
      {
        type: '3-Mark Derivation',
        question: `Explain the step-by-step derivation or proof associated with ${chapterTitle}.`,
        solutionHint: 'State the given hypothesis, write the intermediate equations, and conclude with the Q.E.D. statement.',
      },
      {
        type: '5-Mark Case Study',
        question: `Solve a comprehensive multi-part numerical or analytical case study based on Chapter ${chapterNumber}.`,
        solutionHint: 'Write Given parameters, identify the formula, substitute numerical values, and calculate the final answer with units.',
      },
    ],
  };
}
