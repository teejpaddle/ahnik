/*
  Ahnik lyrics library.

  Shape:
    ITEMS: [{ id, category, gu, en, ref, video, sections: [Section] }]
    Section: { id, gu, en, ref?, verses: [Verse], notes?: [string] }
    Verse:   { n?: number, refrain?: true, label?: {gu, en}, heading?: {gu, en}, lines: [[gujarati, transliteration], ...] }

  A "†" in Gujarati text marks a word with an alternate reading, listed in the section's notes.
  A "\n" in a transliteration keeps the source's own line break inside one Gujarati line.
*/

/* ---------- Shared blocks ---------- */

// Arti as written in "Arti.md" and "Morning Arti.md"
const ARTI_DAILY = {
  id: "arti",
  gu: "આરતી",
  en: "Arti",
  verses: [
    {
      refrain: true,
      lines: [
        ["જય સ્વામિનારાયણ, જય અક્ષરપુરુષોત્તમ,", "Jay Swāminārāyan, Jay Akshar-Purushottam,"],
        ["અક્ષરપુરુષોત્તમ જય, દર્શન સર્વોત્તમ… જય સ્વામિનારાયણ…", "Akshar-Purushottam jay, darshan sarvottam… Jay Swāminārāyan…"],
      ],
    },
    {
      n: 1,
      lines: [
        ["મુક્ત અનંત સુપૂજિત, સુંદર સાકારમ્,", "Mukta anant supujit, sundar sākāram,"],
        ["સર્વોપરી કરુણાકર, માનવ તનુધારમ્… જય સ્વામિનારાયણ…", "Sarvopari karunākar, mānav tanudhāram… Jay Swāminārāyan…"],
      ],
    },
    {
      n: 2,
      lines: [
        ["પુરુષોત્તમ પરબ્રહ્મ, શ્રીહરિ સહજાનંદ,", "Purushottam Parabrahma, Shri Hari Sahajānand,"],
        ["અક્ષરબ્રહ્મ અનાદિ, ગુણાતીતાનંદ… જય સ્વામિનારાયણ…", "Aksharbrahma anādi, Gunātitānand… Jay Swāminārāyan…"],
      ],
    },
    {
      n: 3,
      lines: [
        ["પ્રકટ સદા સર્વકર્તા, પરમ મુક્તિદાતા,", "Prakat sadā sarvakartā, param muktidātā,"],
        ["ધર્મ એકાંતિક સ્થાપક, ભક્તિ પરિત્રાતા… જય સ્વામિનારાયણ…", "Dharma ekāntik sthāpak, bhakti paritrātā… Jay Swāminārāyan…"],
      ],
    },
    {
      n: 4,
      lines: [
        ["દાસભાવ દિવ્યતા સહ, બ્રહ્મરૂપે પ્રીતિ,", "Dāsbhāv divyatā saha, brahmarupe priti,"],
        ["સુહૃદભાવ અલૌકિક, સ્થાપિત શુભ રીતિ… જય સ્વામિનારાયણ…", "Suhradbhāv alaukik, sthāpit shubh riti… Jay Swāminārāyan…"],
      ],
    },
    {
      n: 5,
      lines: [
        ["ધન્ય ધન્ય મમ જીવન, તવ શરણે સુફલમ્,", "Dhanya dhanya mam jivan, tav sharane sufalam,"],
        ["યજ્ઞપુરુષ પ્રવર્તિત સિદ્ધાન્તં સુખદમ્…", "Yagnapurush pravartita, siddhāntam sukhadam…"],
        ["જય સ્વામિનારાયણ, જય અક્ષરપુરુષોત્તમ, જય સ્વામિનારાયણ…", "Jay Swāminārāyan, Jay Akshar-Purushottam, Jay Swāminārāyan…"],
      ],
    },
  ],
};

// Arti as written in "Evening Arti.md"
const ARTI_EVENING = {
  id: "arti",
  gu: "આરતી",
  en: "Ārtī",
  ref: "1-154",
  verses: [
    {
      refrain: true,
      lines: [
        ["જય સ્વામિનારાયણ, જય અક્ષરપુરુષોત્તમ,", "Jay Swāminārāyaṇ, jay Akṣharpuruṣhottam,"],
        ["અક્ષરપુરુષોત્તમ જય, દર્શન સર્વોત્તમ… જય સ્વામિનારાયણ…", "Akṣharpuruṣhottam jay, darshan sarvottam… Jay Swāminārāyaṇ…"],
      ],
    },
    {
      n: 1,
      lines: [
        ["મુક્ત અનંત સુપૂજિત, સુંદર સાકારમ્,", "Mukta anant supūjit, sundar sākāram,"],
        ["સર્વોપરી કરુણાકર, માનવ તનુધારમ્… જય સ્વામિનારાયણ…", "Sarvoparī karuṇākar, mānav tanudhāram… Jay Swāminārāyaṇ…"],
      ],
    },
    {
      n: 2,
      lines: [
        ["પુરુષોત્તમ પરબ્રહ્મ, શ્રીહરિ સહજાનંદ,", "Puruṣhottam Parabrahma, Shrīhari Sahajānand,"],
        ["અક્ષરબ્રહ્મ અનાદિ, ગુણાતીતાનંદ… જય સ્વામિનારાયણ…", "Akṣharbrahma anādi, Guṇātītānand… Jay Swāminārāyaṇ…"],
      ],
    },
    {
      n: 3,
      lines: [
        ["પ્રકટ સદા સર્વકર્તા, પરમ મુક્તિદાતા,", "Prakaṭ sadā sarvakartā, param muktidātā,"],
        ["ધર્મ એકાંતિક સ્થાપક, ભક્તિ પરિત્રાતા… જય સ્વામિનારાયણ…", "Dharma ekāntik sthāpak, bhakti paritrātā… Jay Swāminārāyaṇ…"],
      ],
    },
    {
      n: 4,
      lines: [
        ["દાસભાવ દિવ્યતા સહ, બ્રહ્મરૂપે પ્રીતિ,", "Dāsbhāv divyatā sah, brahmarūpe prīti,"],
        ["સુહૃદભાવ અલૌકિક, સ્થાપિત શુભ રીતિ… જય સ્વામિનારાયણ…", "Suhṛudbhāv alaukik, sthāpit shubh rīti… Jay Swāminārāyaṇ…"],
      ],
    },
    {
      n: 5,
      lines: [
        ["ધન્ય ધન્ય મમ જીવન, તવ શરણે સુફલમ્,", "Dhanya dhanya mam jīvan, tav sharaṇe sufalam,"],
        ["યજ્ઞપુરુષ પ્રવર્તિત સિદ્ધાન્તં સુખદમ્… જય સ્વામિનારાયણ…", "Yagnapuruṣh pravartit siddhāntam sukhadam… Jay Swāminārāyaṇ…"],
      ],
    },
  ],
};

const STUTI_ASHTAK = {
  id: "stuti",
  gu: "સ્તુતિ અષ્ટક",
  en: "Stuti Ashtak",
  verses: [
    {
      n: 1,
      heading: { gu: "શ્રી સ્વામિનારાયણ ભગવાન સ્તુતિ", en: "Bhagwan Shri Swaminarayan" },
      lines: [
        ["અન્તર્યામિ પરાત્પરં હિતકરં, સર્વોપરી શ્રીહરિ,", "Antaryāmi parātparam hita-karam, sarvoparī Shrī Hari,"],
        ["સાકારં પરબ્રહ્મ સર્વશરણમ્, કર્તા દયાસાગરમ્।", "Sākāram Parabrahma sarva-sharaṇam, kartā dayā-sāgaram;"],
        ["આરાધ્યં મમ ઇષ્ટદેવ પ્રકટં, સર્વાવતારી પ્રભુ,", "Ārādhyam mama iṣhṭadev prakaṭam, sarvāvatārī Prabhu,"],
        ["વન્દે દુઃખહરં સદા સુખકરં, શ્રીસ્વામિનારાયણમ્॥", "Vande dukha-haram sadā sukha-karam, Shrī Swāminārāyaṇam."],
      ],
    },
    {
      n: 2,
      heading: { gu: "શ્રી ગુણાતીતાનંદ સ્વામી મહારાજ સ્તુતિ", en: "Gunatitanand Swami Maharaj" },
      lines: [
        ["સાક્ષાદ્ અક્ષરધામ દિવ્ય પરમં, સેવારતં મૂર્તિમાન્,", "Sākṣhād Akṣharadhāma divya paramam, sevāratam mūrtimān,"],
        ["સર્વાધાર સદા સ્વરોમ-વિવરે, બ્રહ્માંડ-કોટી-ધરમ્।", "Sarvādhāra sadā svaroma-vivare, brahmānḍa-koṭī-dharam;"],
        ["ભક્તિ ધ્યાન કથા સદૈવ કરણં, બ્રહ્મસ્થિતિદાયકમ્,", "Bhakti dhyāna kathā sadaiva karaṇam, brahma-sthiti-dāyakam,"],
        ["વન્દે અક્ષરબ્રહ્મ પાદકમલં, ગુણાતીતાનન્દનમ્॥", "Vande Akṣharabrahma pāda-kamalam, Guṇātītānandanam."],
      ],
    },
    {
      n: 3,
      heading: { gu: "શ્રી ભગતજી મહારાજ સ્તુતિ", en: "Bhagatji Maharaj" },
      lines: [
        ["શ્રીમન્ નિર્ગુણ મૂર્તિ સુંદર તનુ, અધ્યાત્મ-વાર્તારતમ્,", "Shrīman-nirguṇa-mūrti sundara tanu, adhyātma-vārtā-ratam,"],
        ["દેહાતીત દશા અખંડ-ભજનં, શાન્તં ક્ષમાસાગરમ્।", "Dehātīta dashā akhanḍa-bhajanam, shāntam kṣhamā-sāgaram;"],
        ["આજ્ઞા-પાલન-તત્પરં ગુણગ્રહી, નિર્દોષમૂર્તિ સ્વયમ્,", "Āgnā-pālana-tatparam guṇa-grahī, nirdoṣha-mūrti svayam,"],
        ["વન્દે પ્રાગજીભક્ત-પાદકમલં, બ્રહ્મસ્વરૂપં ગુરુમ્॥", "Vande Prāgajī-Bhakta-pāda-kamalam, brahmaswarūpam gurum."],
      ],
    },
    {
      n: 4,
      heading: { gu: "શ્રી શાસ્ત્રીજી મહારાજ સ્તુતિ", en: "Shastriji Maharaj" },
      lines: [
        ["શુદ્ધોપાસન મન્દિરં સુરચનમ્, સિદ્ધાન્ત-રક્ષાપરમ્,", "Shuddhopāsana mandiram su-rachanam, siddhānta-rakṣhāparam,"],
        ["સંસ્થા-સ્થાપન દિવ્ય-કાર્ય-કરણં, સેવામયં જીવનમ્।", "Sansthā-sthāpana divya-kārya-karaṇam, sevāmayam jīvanam;"],
        ["નિષ્ઠા નિર્ભયતા સુકષ્ટસહનં, ધૈર્યં ક્ષમાધારણમ્,", "Niṣhṭhā nirbhayatā su-kaṣhṭa-sahanam, dhairyam kṣhamā-dhāraṇam,"],
        ["શાસ્ત્રી યજ્ઞપુરુષદાસ-ચરણં, વન્દે પ્રતાપી ગુરુમ્॥", "Shāstrī Yagnapuruṣhadāsa-charaṇam, vande pratāpī gurum."],
      ],
    },
    {
      n: 5,
      heading: { gu: "શ્રી યોગીજી મહારાજ સ્તુતિ", en: "Yogiji Maharaj" },
      lines: [
        ["વાણી અમૃતપૂર્ણ હર્ષકરણી, સંજીવની માધુરી,", "Vāṇī amṛuta-pūrṇa harṣha-karaṇī, sanjīvanī mādhurī,"],
        ["દિવ્યં દૃષ્ટિપ્રદાન દિવ્ય હસનં, દિવ્યં શુભં કીર્તનમ્।", "Divyam dṛuṣhṭi-pradāna divya hasanam, divyam shubham kīrtanam;"],
        ["બ્રહ્માનંદ પ્રસન્‍ન સ્નેહરસિતં, દિવ્યં કૃપાવર્ષણમ્,", "Brahmānanda prasanna sneha-rasitam, divyam kṛupā-varṣhaṇam,"],
        ["યોગીજી ગુરુ જ્ઞાનજીવન પદે, ભાવે સદા વન્દનમ્॥", "Yogījī guru Gnānajīvana pade, bhāve sadā vandanam."],
      ],
    },
    {
      n: 6,
      heading: { gu: "શ્રી પ્રમુખસ્વામી મહારાજ સ્તુતિ", en: "Pramukh Swami Maharaj" },
      lines: [
        ["વિશ્વે વૈદિક ધર્મ મર્મ મહિમા, સત્સંગ વિસ્તારકમ્,", "Vishve Vaidika dharma marma mahimā, satsanga vistārakam,"],
        ["વાત્સલ્યં કરુણા અહો જનજને, આકર્ષણમ્ અદ્‍ભુતમ્।", "Vātsalyam karuṇā aho jana-jane, ākarṣhaṇam adbhutam;"],
        ["દાસત્વં ગુરુભક્તિ નિત્ય ભજનં, સંવાદિતા સાધુતા,", "Dāsatvam guru-bhakti nitya bhajanam, samvāditā sādhutā,"],
        ["નારાયણસ્વરૂપ સ્વામી પ્રમુખં, વન્દે ગુરું મુક્તિદમ્॥", "Nārāyaṇaswarūpa Swāmī Pramukham, vande gurum muktidam."],
      ],
    },
    {
      n: 7,
      heading: { gu: "શ્રી મહંતસ્વામી મહારાજ સ્તુતિ", en: "Mahant Swami Maharaj" },
      lines: [
        ["દિવ્યં સૌમ્યમુખારવિન્દ સરલં, નેત્રે અમીવર્ષણમ્,", "Divyam saumya-mukhāravinda saralam, netre amī-varṣhaṇam,"],
        ["નિર્દોષં મહિમામયં સુહૃદયં, શાન્તં સમં નિશ્ચલમ્।", "Nirdoṣham mahimā-mayam su-hṛudayam, shāntam samam nishchalam;"],
        ["નિર્માનં મૃદુ દિવ્યભાવ સતતં, વાણી શુભા નિર્મલા,", "Nirmānam mṛudu divyabhāva satatam, vāṇī shubhā nirmalā,"],
        ["વન્દે કેશવજીવનં મમ ગુરું, સ્વામી મહન્તં સદા॥", "Vande Keshavajīvanam mama gurum, Swāmī Mahantam sadā."],
      ],
    },
    {
      label: { gu: "ધૂન", en: "Dhun" },
      lines: [
        ["સ્વામિનારાયણ સ્વામિનારાયણ સ્વામિનારાયણ સ્વામિનારાયણ", "Swāminārāyaṇ Swāminārāyaṇ Swāminārāyaṇ Swāminārāyaṇ"],
        ["સ્વામિનારાયણ સ્વામિનારાયણ સ્વામિનારાયણ સ્વામિનારાયણ…", "Swāminārāyaṇ Swāminārāyaṇ Swāminārāyaṇ Swāminārāyaṇ…"],
        ["સ્વામિનારાયણ સ્વામિનારાયણ", "Swāminārāyaṇ Swāminārāyaṇ"],
        ["સ્વામિનારાયણ સ્વામિનારાયણ…", "Swāminārāyaṇ Swāminārāyaṇ…"],
      ],
    },
  ],
};

const DHUN = {
  id: "dhun",
  gu: "ધૂન્ય",
  en: "Dhūnya",
  verses: [
    { n: 1, lines: [
      ["રામકૃષ્ણ ગોવિંદ, જય જય ગોવિંદ!", "Rām-Krishṇa Govind, jay jay Govind!"],
      ["હરે રામ ગોવિંદ, જય જય ગોવિંદ!", "Hare Rām Govind, jay jay Govind!"],
    ] },
    { n: 2, lines: [
      ["નારાયણ હરે, સ્વામિનારાયણ હરે!", "Nārāyaṇ hare, Swāminārāyaṇ hare!"],
      ["સ્વામિનારાયણ હરે, સ્વામિનારાયણ હરે!", "Swāminārāyaṇ hare, Swāminārāyaṇ hare!"],
    ] },
    { n: 3, lines: [
      ["કૃષ્ણદેવ હરે, જય જય કૃષ્ણદેવ હરે!", "Krishṇadev hare, jay jay Krishṇadev hare!"],
      ["જય જય કૃષ્ણદેવ હરે, જય જય કૃષ્ણદેવ હરે!", "Jay jay Krishṇadev hare, jay jay Krishṇadev hare!"],
    ] },
    { n: 4, lines: [
      ["વાસુદેવ હરે, જય જય વાસુદેવ હરે!", "Vāsudev hare, jay jay Vāsudev hare!"],
      ["જય જય વાસુદેવ હરે, જય જય વાસુદેવ હરે!", "Jay jay Vāsudev hare, jay jay Vāsudev hare!"],
    ] },
    { n: 5, lines: [
      ["વાસુદેવ ગોવિંદ, જય જય વાસુદેવ ગોવિંદ!", "Vāsudev Govind jay jay Vāsudev Govind!"],
      ["જય જય વાસુદેવ ગોવિંદ, જય જય વાસુદેવ ગોવિંદ!", "Jay jay Vāsudev Govind, jay jay Vāsudev Govind!"],
    ] },
    { n: 6, lines: [
      ["રાધે ગોવિંદ, જય રાધે ગોવિંદ!", "Rādhe Govind, jay Rādhe Govind!"],
      ["વૃંદાવનચંદ્ર, જય રાધે ગોવિંદ!", "Vrundāvan Chandra, jay rādhe Govind!"],
    ] },
    { n: 7, lines: [
      ["માધવ મુકુંદ, જય માધવ મુકુંદ!", "Mādhav Mukund, jay Mādhav Mukund!"],
      ["આનંદકંદ, જય માધવ મુકુંદ!", "Ānandkaṇd jay Mādhav Mukund!"],
    ] },
    { label: { gu: "ધૂન", en: "Dhun" }, lines: [
      ["સ્વામિનારાયણ! સ્વામિનારાયણ! સ્વામિનારાયણ!", "Swāminārāyaṇ! Swāminārāyaṇ! Swāminārāyaṇ!"],
      ["સ્વામિનારાયણ! સ્વામિનારાયણ! સ્વામિનારાયણ!", "Swāminārāyaṇ! Swāminārāyaṇ! Swāminārāyaṇ!"],
    ] },
  ],
};

const SWAMINARAYAN_ASHTAK = {
  id: "ashtak",
  gu: "શ્રી સ્વામિનારાયણાષ્ટક",
  en: "Shrī Swāminārāyaṇāṣhṭak",
  verses: [
    { n: 1, lines: [
      ["અનન્તકોટીન્દુરવિપ્રકાશે ધામ્ન્યક્ષરે મૂર્તિમતાક્ષરેણ।", "Anant-koṭīndu-ravi-prakāshe\nDhāmnya-kshare mūrti-matākshareṇa;"],
      ["સાર્ધં સ્થિતં મુક્તગણાવૃતં ચ શ્રીસ્વામિનારાયણમાનમામિ॥", "Sārdham sthitam mukta-gaṇāvrutam cha\nShrī Swāminārāyaṇamānamāmi."],
    ] },
    { n: 2, lines: [
      ["બ્રહ્માદિસમ્પ્રાર્થનયા પૃથિવ્યાં જાતં સમુક્તં ચ સહાક્ષરં ચ।", "Brahmādi-samprārthanayā pruthivyām\nJātam samuktam cha sahāksharam cha;"],
      ["સર્વાવતારેષ્વવતારિણં ત્વાં શ્રીસ્વામિનારાયણમાનમામિ॥", "Sarvāvatāre-shvavatāriṇam tvām\nShrī Swāminārāyaṇamānamām."],
    ] },
    { n: 3, lines: [
      ["દુષ્પ્રાપ્યમન્યૈઃ કઠિનૈરુપાયૈઃ સમાધિસૌખ્યં હઠયોગમુખ્યૈઃ।", "Dushprāpyamanyaih kathinairupāyaih\nSamādhi-saukhyam hatha-yoga-mukhyaih;"],
      ["નિજાશ્રિતેભ્યો દદતં દયાલું શ્રીસ્વામિનારાયણમાનમામિ॥", "Nijāshritebhyo dadatam dayālum\nShrī Swāminārāyaṇamānamāmi."],
    ] },
    { n: 4, lines: [
      ["લોકોત્તરૈ ર્ભક્તજનાંશ્ચરિત્રૈ-રાહ્‌લાદયન્તં ચ ભુવિ ભ્રમન્તમ્।", "Lokottarair bhakta-janāns-charitrai\nRāhlā-dayantam cha bhuvi-bhramantam;"],
      ["યજ્ઞાંશ્ચ તન્વાનમપારસત્ત્વં શ્રીસ્વામિનારાયણમાનમામિ॥", "Yagnānscha tanvā-namapārasatvam\nShrī Swāminārāyaṇamānamāmi."],
    ] },
    { n: 5, lines: [
      ["એકાન્તિકં સ્થાપયિતું ધરાયાં ધર્મં પ્રકુર્વન્તમમૂલ્યવાર્તાઃ।", "Ekāntikam sthāpayitum dharāyām\nDharmam prakūrvanta-mamūlya-vārtā;"],
      ["વચઃસુધાશ્ચ પ્રકિરન્તમૂર્વ્યાં શ્રીસ્વામિનારાયણમાનમામિ॥", "Vachah-sudhāscha prakirant-mūrvyām\nShrī Swāminārāyaṇamānamāmi."],
    ] },
    { n: 6, lines: [
      ["વિશ્વેશભક્તિં સુકરાં વિધાતું બૃહન્તિ રમ્યાણિ મહીતલેઽસ્મિન્।", "Vishvesha-bhaktim sukarām vidhātum\nBruhanti ramyāni mahitalesmin;"],
      ["દેવાલયાન્યાશુ વિનિર્મિમાણં શ્રીસ્વામિનારાયણમાનમામિ॥", "Devālayānyāshu vinirmimāṇam\nShrī Swāminārāyaṇamānamāmi."],
    ] },
    { n: 7, lines: [
      ["વિનાશકં સંસૃતિબન્ધનાનાં મનુષ્યકલ્યાણકરં મહિષ્ઠમ્।", "Vināshakam sansruti-bandhanānām\nManushya-kalyāṇ-karam mahishtham;"],
      ["પ્રવર્તયન્તં ભુવિ સમ્પ્રદાયં શ્રીસ્વામિનારાયણમાનમામિ॥", "Pravartayantam bhuvi sampradāyam\nShrī Swāminārāyaṇamānamāmi."],
    ] },
    { n: 8, lines: [
      ["સદૈવ સારંગપુરસ્ય રમ્યે સુમન્દિરે હ્યક્ષરધામતુલ્યે।", "Sadaīva Sārangapurasya ramye\nSumandire hyaksharadhāmatulye;"],
      ["સહાક્ષરં મુક્તયુતં વસન્તં શ્રીસ્વામિનારાયણમાનમામિ॥", "Sahāksharam muktayutam vasantam\nShrī Swāminārāyaṇamānamāmi."],
    ] },
  ],
};

const PRARTHANA = {
  id: "prarthana",
  gu: "પ્રાર્થના",
  en: "Prārthanā",
  ref: "1-155",
  verses: [
    { n: 1, lines: [
      ["નિર્વિકલ્પ ઉત્તમ અતિ, નિશ્ચય તવ ઘનશ્યામ;", "Nirvikalp uttam ati, nischay tav Ghanshyām;"],
      ["માહાત્મ્યજ્ઞાનયુક્ત ભક્તિ તવ, એકાંતિક સુખધામ.", "Māhātmya-gnān-yukt bhakti tav, ekāntik sukhḍhām."],
    ] },
    { n: 2, lines: [
      ["મોહિમેં તવ ભક્તપનો, તામેં કોઈ પ્રકાર;", "Mohime tav bhaktapano, tāme koī prakār;"],
      ["દોષ ન રહે કોઈ જાતકો, સુનિયો ધર્મકુમાર.", "Dosh na rahe koī jātko, suniyo Dharmakumār."],
    ] },
    { n: 3, lines: [
      ["તુમ્હારો તવ હરિભક્તકો, દ્રોહ કબુ નહિ હોય;", "Tumāro tav Hari bhaktako, droh kabu nahi hoy;"],
      ["એકાંતિક તવ દાસકો, દીજે સમાગમ મોય.", "Ekāntik tav dāsko, dīje samāgam moy."],
    ] },
    { n: 4, lines: [
      ["નાથ નિરંતર દર્શ તવ, તવ દાસનકો દાસ;", "Nāth nīrantar darsh tav, tav dāsanko dās;"],
      ["એહી માગું કરી વિનય હરિ, સદા રાખિયો પાસ.", "Ehī māgu karī vinay Hari, sadā rākhiyo pās."],
    ] },
    { n: 5, lines: [
      ["હે કૃપાલો! હે ભક્તપતે! ભક્તવત્સલ! સુનો બાત;", "He Krupālo! He Bhaktapte! Bhaktavatsal! suno bāt;"],
      ["દયાસિંધો! સ્તવન કરી, માગું વસ્તુ સાત.", "Dayāsindho! stavan karī, māgu vastu sāt."],
    ] },
    { n: 6, lines: [
      ["સહજાનંદ મહારાજ કે, સબ સત્સંગી સુજાણ;", "Sahajānand Mahārājke, sab satsangī sujāṇ;"],
      ["તાકું હોય દ્રઢ વર્તનો, શિક્ષાપત્રી પ્રમાણ.", "Tāku hoy dradh vartano, Shikshāpatrī pramāṇ."],
    ] },
    { n: 7, lines: [
      ["સો પત્રીમેં અતિ બડે, નિયમ એકાદશ જોય;", "So Patrī me atibaḍe, niyam ekādash joy;"],
      ["તાકી વિગતિ કહત હું, સુનિયો સબ ચિત્ત પ્રોય.", "Tākī vigti kahat hu, suniyo sab chitt proy."],
    ] },
    { n: 8, lines: [
      ["હિંસા ન કરની જન્તુકી, પરત્રિયા સંગકો ત્યાગ;", "Hinsā na karnī jantukī, partriyā sangko tyāg;"],
      ["માંસ ન ખાવત મદ્યકું, પીવત નહીં બડભાગ્ય.", "Māns na khāvat madhyaku, pīvat nahi badbhāg."],
    ] },
    { n: 9, lines: [
      ["વિધવાકું સ્પર્શત નહિ, કરત ન આત્મઘાત;", "Vidhvāku sparshat nahi, karat na ātmaghat;"],
      ["ચોરી ન કરની કાહુંકી, કલંક ન કોઈકું લગાત.", "Chori na karnī kāhukī, kalank na kouku lagāt."],
    ] },
    { n: 10, lines: [
      ["નિંદત નહિ કોય દેવકું, બિન ખપતો નહિ ખાત;", "Nindat nahi koy devku, bin khapto nahi khāt;"],
      ["વિમુખ જીવકે વદનસે, કથા સુની નહિ જાત.", "Vimukh jīvake vadanse, kathā sunī nahi jāt."],
    ] },
    { n: 11, lines: [
      ["એહી (વિધિ) ધર્મકે નિયમમેં, બરતો સબ હરિદાસ;", "Ehī (vidhi) dharmake niyamme, barto sab haridās;"],
      ["ભજો શ્રી સહજાનંદપદ, છોડી ઔર સબ આસ.", "Bhajo Shrī Sahajānandpad, chhoḍi aur sab ās."],
    ] },
    { n: 12, lines: [
      ["રહી એકદશ નિયમમેં, કરો શ્રીહરિપદ પ્રીત;", "Rahi ekādash niyamme, karo Shrī Haripad prīt;"],
      ["પ્રેમાનંદ કહે ધામમેં, જાઓ નિઃશંક જગ જીત.", "Premānand kahe dhāmme, jāo nishank jag jīt."],
    ] },
  ],
};

/* ---------- Godi (four pads) ---------- */

const GODI_PADS = [
  {
    id: "pad-1",
    gu: "પદ - ૧",
    en: "Pad - 1",
    notes: ["† અપનો"],
    verses: [
      { refrain: true, lines: [["સંત સમાગમ કીજે, હો નિશદિન…", "Sant samāgam kīje, ho nishdin…"]] },
      { n: 1, lines: [["માન તજી સંતનકે મુખસે, પ્રેમ સુધારસ પીજે… હો", "Mān tajī santanke mukhse, prem sudhāras pīje… ho"]] },
      { n: 2, lines: [["અંતર કપટ મેટકે અપના†, લે ઉનકું મન દીજે… હો", "Antar kapaṭ meṭke apnā, le unku man dīje… ho"]] },
      { n: 3, lines: [["ભવદુઃખ ટળે બળે સબ દુષ્ક્રીત, સબવિધિ કારજ સીજે… હો", "Bhavdukh ṭaḷe baḷe sab dushkrīt, sabvidhi kāraj sīje… ho"]] },
      { n: 4, lines: [["બ્રહ્માનંદ કહે સંતકી સોબત, જન્મ સુફલ કરી લીજે હો… હો", "Brahmānand kahe santkī sobat, janma sufal karī līje… ho"]] },
    ],
  },
  {
    id: "pad-2",
    gu: "પદ - ૨",
    en: "Pad - 2",
    verses: [
      { refrain: true, lines: [["સંત પરમ હિતકારી, જગત માંહી…", "Sant param hitkārī, jagat māhi…"]] },
      { n: 1, lines: [["પ્રભુપદ પ્રગટ કરાવત પ્રીતિ, ભરમ મિટાવત ભારી… જગત", "Prabhupad pragaṭ karāvat prīti, bharam mīṭāvat bhārī… jagat"]] },
      { n: 2, lines: [["પરમકૃપાલુ સકલ જીવન પર, હરિસમ સબ દુઃખહારી… જગત", "Paramkrupālu sakal jīvan par, harisam sab dukhhārī… jagat"]] },
      { n: 3, lines: [["ત્રિગુણાતીત ફીરત તનુ ત્યાગી, રીત જગતસે ન્યારી… જગત", "Triguṇātīt fīrat tanu tyāgī, rīt jagatse nyārī… jagat"]] },
      { n: 4, lines: [["બ્રહ્માનંદ કહે સંતકી સોબત, મિલત હૈ પ્રગટ મોરારી… જગત", "Brahmānand kahe santkī sobat, milat hai pragaṭ Murārī… jagat"]] },
    ],
  },
  {
    id: "pad-3",
    gu: "પદ - ૩",
    en: "Pad - 3",
    notes: ["† બાંધવ"],
    verses: [
      { refrain: true, lines: [["હરિ ભજતાં સુખ હોય, સમજ મન…", "Hari bhajtā sukh hoy, samaj man…"]] },
      { n: 1, lines: [["હરિ સમરન બિન મૂઢ અજ્ઞાની, ઉંમર દીની ખોય… સમજ", "Hari samran bin muḍh agnānī, umar dīnī khoy… samaj"]] },
      { n: 2, lines: [["માતપિતા જુવતી સુત બંધુ†, સંગ ચલત નહિં કોય… સમજ", "Mātpitā juvatī sut bandhu, sang chalat nahi koy… samaj"]] },
      { n: 3, lines: [["ક્યું અપને શિર લેત બુરાઈ, રહેના હૈ દિન દોય… સમજ", "Kyu apne shir let burāī, rahenā hai din doy… samaj"]] },
      { n: 4, lines: [["બ્રહ્માનંદ કહે હરિને ભજી લે, હિતકી કહત હું તોય… સમજ", "Brahmānand kahe harine bhajī le, hitkī kahat hu toy… samaj"]] },
    ],
  },
  {
    id: "pad-4",
    gu: "પદ - ૪",
    en: "Pad - 4",
    verses: [
      { refrain: true, lines: [["યૂંહી જન્મ ગુમાત, ભજન બિન…", "Yuhī janma gumāt, bhajan bin…"]] },
      { n: 1, lines: [["સમજ સમજ નર મૂઢ અજ્ઞાની, કાલ નિકટ ચલી આત… ભજન", "Samaj samaj nar muḍh agnānī, kāl nikaṭ chaḷī āt… bhajan"]] },
      { n: 2, lines: [["ભયોરી બેહાલ ફિરત હૈ નિશદિન, ગુન વિષયને કે ગાત… ભજન", "Bhayori behāl firat hai nishdin, gun vishāyne ke gāt… bhajan"]] },
      { n: 3, lines: [["પરમારથકો રાહ ન પ્રીછત, પાપ કરત દિનરાત… ભજન", "Parmārathko rāh na prichhat, pāp karat dinrāt… bhajan"]] },
      { n: 4, lines: [["બ્રહ્માનંદ કહે તેરી મૂરખ, આયુષ વૃથા હી જાત… ભજન", "Brahmānand kahe terī mūrakh, āyush vruthā hī jāt… bhajan"]] },
    ],
  },
];

/* ---------- Library ---------- */

window.AHNIK_CATEGORIES = [
  { id: "arti", gu: "આરતી", en: "Arti" },
  { id: "kirtan", gu: "કીર્તન", en: "Kirtan" },
];

window.AHNIK_ITEMS = [
  {
    id: "morning-arti",
    category: "arti",
    gu: null, // the source file has no Gujarati title
    en: "Morning Arti",
    video: { id: "U5xYAEqDMlc", url: "https://youtu.be/U5xYAEqDMlc" },
    sections: [ARTI_DAILY, STUTI_ASHTAK],
  },
  {
    id: "evening-arti",
    category: "arti",
    gu: "સંધ્યા આરતી",
    en: "Evening Arti",
    ref: "1-154",
    video: { id: "6QZZ2ZkgVuU", url: "https://youtu.be/6QZZ2ZkgVuU" },
    sections: [ARTI_EVENING, DHUN, SWAMINARAYAN_ASHTAK, PRARTHANA, STUTI_ASHTAK],
  },
  {
    id: "arti",
    category: "arti",
    gu: "આરતી",
    en: "Arti",
    video: { id: "6q9MD8R146c", url: "https://youtu.be/6q9MD8R146c" },
    sections: [ARTI_DAILY],
  },
  {
    id: "godi",
    category: "kirtan",
    gu: "ગોડી",
    en: "Godi",
    ref: "1/142-145",
    author: { gu: "સદ્‌ગુરુ બ્રહ્માનંદ સ્વામી", en: "Sadguru Brahmanand Swami" },
    video: { id: "E6gqZSIC9ik", url: "https://youtu.be/E6gqZSIC9ik" },
    sections: GODI_PADS,
  },
];
