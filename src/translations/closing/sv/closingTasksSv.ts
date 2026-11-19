import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Task texts in Swedish, for both markets. Every statement has its source in closingTasks.ts. */
export const CLOSING_TASKS_SV: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Säkra klubbslagsbeslutet (Zuschlagsbeschluss)",
      detail:
        "Genom klubbslaget blir du ägare redan före inskrivning i fastighetsregistret (§ 90 ZVG). Se till att få beslutet utlämnat eller tillsänt och förvara det säkert: det fungerar senare även som exekutionstitel vid en avhysning. Domstolen fakturerar klubbslagsavgiften separat (0,5 avgift enligt KV 2214 GKG).",
    },
    "de.appeal": {
      title: "Invänta laga kraft (Rechtskraft)",
      detail:
        "Beslutet om klubbslag kan överklagas genom omedelbart besvär (sofortige Beschwerde). För alla som närvarade vid auktionen eller avkunnandet börjar fristen löpa vid avkunnandet (§ 98 ZVG) och är två veckor (§ 569 ZPO). För frånvarande parter börjar den först vid delgivning — laga kraft kan alltså inträda senare. Beställ fram till dess inga arbeten som du inte kan avboka.",
    },
    "de.risk": {
      title: "Behandla fastigheten som din från och med idag",
      detail:
        "Risken för olyckshändelse övergår på dig vid klubbslaget, tillsammans med intäkter och belastningar (§ 56 ZVG). Kontrollera att fastigheten är säkrad (vakans, frost, tillträde) och dokumentera skicket med daterade foton.",
    },
    "de.insurerNotice": {
      title: "Anmäl ägarbytet till fastighetsförsäkringen",
      detail:
        "En befintlig byggnadsförsäkring går över på dig (§ 99 jämte § 95 VVG). Du måste anmäla förvärvet till försäkringsbolaget utan dröjsmål, annars kan bolaget bli fritt från ersättningsskyldighet (§ 97 VVG). Fråga domstolen eller kontrollera värderingsutlåtandet efter försäkringsbolag och försäkringsnummer. Saknas försäkring, teckna en egen omedelbart.",
    },
    "de.insuranceCancel": {
      title: "Granska övertagen försäkring och säg upp vid behov",
      detail:
        "Du kan säga upp den övertagna försäkringen med omedelbar verkan eller till utgången av innevarande försäkringsperiod, men endast inom en månad från förvärvet — eller inom en månad från det att du fick kännedom om den (§ 96 (2) VVG). Säg inte upp förrän ett sömlöst nytt skydd är på plats.",
    },
    "de.charges": {
      title: "Ta över löpande kostnader och avgifter",
      detail:
        "Från klubbslaget bär du alla löpande kostnader (§ 56 ZVG): proportionell fastighetsskatt, månadsavgift (Hausgeld) för ägarlägenhet, el, vatten och värme. Läs av mätarställningar och meddela leverantörer samt eventuell bostadsförvaltning (WEG-Verwaltung). Tidigare ägares obetalda månadsavgifter täcks ur auktionslikviden (förmånsrättsklass 2, § 10 (1) nr 2 ZVG); enligt Bundesgerichtshof (BGH V ZR 209/12) medför detta inget sakrättsligt ansvar för köparen.",
    },
    "de.interest": {
      title: "Tänk på 4 % ränta på kontantbudet (Bargebot)",
      detail:
        "Kontantbudet löper med ränta från klubbslaget (§ 49 (2) ZVG) med 4 % per år (§ 246 BGB). Räntan löper fram till betalning. Stäm av med domstolshandläggaren (Rechtspfleger) om en tidigare nedsättning hos domstolen (§ 49 (4) ZVG) är lämplig i ditt fall.",
    },
    "de.summons": {
      title: "Lägg in kallelsen till fördelningssammanträdet (Verteilungstermin)",
      detail:
        "Efter klubbslaget sätter domstolen ut fördelningssammanträdet och kallar dig som köpare; kallelsen ska delges minst två veckor i förväg (§ 105 ZVG). Fyll i datumet ovan — checklistan räknar då ut betalnings- och sammanträdesfrister.",
    },
    "de.financing": {
      title: "Samordna utbetalningen med din bank",
      detail:
        "Belowmark-regel: banken bör känna till utbetalningsdatumet minst två veckor före fördelningssammanträdet. Lämna ärendenummer, domstolskassans kontouppgifter (Gerichtskasse) och betalningsreferens från kallelsen. Bankunderlaget sammanfattar detta åt banken.",
    },
    "de.pay": {
      title: "Överför kontantbudet (Bargebot)",
      detail:
        "Kontantbudet ska betalas före fördelningssammanträdet genom banköverföring till domstolskassan (Gerichtskasse); beloppet måste vara bokfört före sammanträdet och kvitto måste visas upp på plats (§ 49 (1), (3) ZVG). Kontant betalning är inte tillåten. Denna lista lägger överföringen fem dagar i förväg — det är en säkerhetsmarginal, inte en lagstadgad frist.",
    },
    "de.attend": {
      title: "Fördelningssammanträde (Verteilungstermin)",
      detail:
        "Ta med betalningsbevis (§ 49 (3) ZVG). Vid sammanträdet upprättas och verkställs fördelningsplanen (Teilungsplan) — detta är en förutsättning för din lagfart i fastighetsregistret (§ 130 ZVG).",
    },
    "de.default": {
      title: "Känn till följderna av utebliven betalning",
      detail:
        "Betalar du inte verkställs fördelningsplanen genom att fordran mot dig överlåts till de berättigade borgenärerna (§ 118 ZVG). Dessa kan då omedelbart begära en ny exekutiv auktion (Wiederversteigerung) mot dig utan ny exekutionstitel (§ 133 ZVG). Du förblir ägare och gäldenär — ångerrätt finns inte.",
    },
    "de.taxNotice": {
      title: "Betala fastighetsförvärvsskatt (Grunderwerbsteuer)",
      detail:
        "Domstolen anmäler klubbslaget till skattemyndigheten (§ 18 (1) nr 3 GrEStG). Skatten förfaller en månad efter delgivning av skattebeslutet (§ 15 GrEStG). Ange datumet för skattebeslutet ovan.",
    },
    "de.clearance": {
      title: "Skatteverkets godkännandeintyg (Unbedenklichkeitsbescheinigung)",
      detail:
        "Utan detta skrivs du inte in i fastighetsregistret (§ 22 (1) GrEStG). Skattemyndigheten utfärdar intyget när skatten är betald, säkerställd eller anstånd beviljats (§ 22 (2) GrEStG) och skickar det normalt direkt till domstolen eller inskrivningsmyndigheten. Följ upp om det går flera veckor efter betalning.",
    },
    "de.courtFees": {
      title: "Betala domstols- och inskrivningsavgifter",
      detail:
        "Klubbslagsavgift (0,5 avgift enligt KV 2214 GKG, baserad på högsta bud plus kvarstående rättigheter) samt senare avgiften för lagfart i fastighetsregistret (1,0 avgift enligt KV 14110 GNotKG). Budgränskalkylatorn i ärendeakten visar beloppen.",
    },
    "de.registry": {
      title: "Invänta domstolens lagfartsbegäran (Grundbuchersuchen)",
      detail:
        "När fördelningsplanen är verkställd och klubbslaget vunnit laga kraft begär domstolen att fastighetsregistret skriver in dig som ägare och raderar utsläckta rättigheter samt anteckningen om exekutiv auktion (§ 130 (1) ZVG). Bankens panträtt (Grundschuld) kan skrivas in först därefter (§ 130 (3) ZVG).",
    },
    "de.extract": {
      title: "Kontrollera fastighetsregisterutdraget",
      detail:
        "Begär ut ett utdrag efter inskrivningen: står du som ägare? Har auktionsanteckningen och utsläckta rättigheter raderats? Kvarstår endast de rättigheter som enligt auktionsvillkoren skulle ligga kvar?",
    },
    "de.eviction": {
      title: "Avhysning med stöd av klubbslagsbeslutet",
      detail:
        "Mot en boende utan kvarstående nyttjanderätt — till exempel tidigare ägare — fungerar själva klubbslagsbeslutet som exekutionstitel för avhysning (§ 93 (1) ZVG). Du behöver en verkställbar kopia med delgivningsbevis (§ 750 ZPO) och anlitar utmätningsman (§ 885 ZPO); ett begränsat verkställighetsuppdrag enligt § 885a ZPO kan spara kostnader. Gäller inte mot den som innehar en rättighet som kvarstår efter klubbslaget (§ 93 (1) mening 2 ZVG). Du behöver inte ersätta utlägg gjorda före klubbslaget (§ 93 (2) ZVG).",
    },
    "de.tenantTakeover": {
      title: "Ta över befintliga hyresavtal",
      detail:
        "Befintliga hyres- och arrendeavtal övergår på dig (§ 57 ZVG jämte § 566 BGB). Underrätta hyresgästerna skriftligen om ägarbytet och det nya bankkontot. Du kan bli skyldig att återbetala en deposition även om du aldrig mottog den från tidigare ägare (§ 566a BGB) — begär underlag för depositionen.",
    },
    "de.tenantNotice": {
      title: "Särskild uppsägningsrätt: endast till första möjliga datum",
      detail:
        "Du får säga upp med lagstadgad uppsägningstid, men endast till första tillåtna datum — annars går den särskilda rätten förlorad (§ 57a ZVG). För bostadshyra måste uppsägningen nå hyresgästen senast den tredje arbetsdagen i en månad (§ 573c BGB). Besittningsskydd gäller fortfarande: du behöver ett berättigat intresse, såsom eget boende (§ 573 BGB). Datumet här är försiktigt beräknat (lördagar räknas som arbetsdagar, helgdagar dras inte av) — låt en jurist granska uppsägningen.",
    },
    "de.handover": {
      title: "Dokumentera tillträdet",
      detail:
        "Nycklar, mätarställningar, skick med foton, brister och kvarlämnade föremål — med datum och underskrifter. Byt lås så snart du har tillträde.",
    },
    "de.inspect": {
      title: "Besiktiga skicket och planera renovering",
      detail:
        "Ingen garanti eller felansvar lämnas (§ 56 ZVG). Jämför faktiskt skick med värderingsutlåtandet och ta in offerter innan du beställer arbeten. Du kan sedan ersätta uppskattningarna i budgränskalkylatorn med verkliga offerter.",
    },
    "de.energy": {
      title: "Lagstadgade energieffektiviseringar efter ägarbyte",
      detail:
        "För en- och tvåfamiljshus som tidigare ägare bodde i den 2002-02-01 övergår vissa åtgärdskrav (t.ex. vindsisolering) på den nya ägaren med två års frist från ägarbytet (tidigare § 47 GEG). GEG ersattes 2026 av lagen om byggnadsmodernisering (Gebäudemodernisierungsgesetz) — kontrollera gällande regler med en energirådgivare.",
    },
    "de.permits": {
      title: "Kontrollera bygglov före ombyggnad",
      detail:
        "Om ändringar, ändrad användning eller åtgärder på kulturminnesmärkt byggnad kräver tillstånd styrs av delstatens lagstiftning (byggnadsordning, kulturmiljölag). Stäm av med byggnadsnämnden innan du påbörjar arbeten.",
    },
    "de.condo": {
      title: "Begär in handlingar för ägarlägenhet (WEG)",
      detail:
        "För ägarlägenheter: meddela förvaltaren om ägarbytet och begär ut budgetplan (Wirtschaftsplan), senaste årsredovisning, stämmoprotokoll och uppdelningsförklaring (Teilungserklärung). Se upp för beslutade extra uttaxeringar (Sonderumlagen).",
    },
  },
  TR: {
    "tr.pay": {
      title: "Betala auktionspriset (ihale bedeli) — 7 dagar",
      detail:
        "Köpeskilling och avgifter ska betalas inom sju dagar från publiceringen av auktionsprotokollet (artırma sonuç tutanağı), även om någon har begärt ogiltigförklaring av auktionen (Elektronik Satış Yönetmeliği art. 20/1; İİK art. 130). Sedan lag nr 7343 finns ingen förlängning med tio dagar. Ange protokollets publiceringsdatum ovan.",
    },
    "tr.fees": {
      title: "Förbered skatter och avgifter enligt Şartname",
      detail:
        "Lagfartsavgiften (tapu harcı) är 20 ‰ av köpeskillingen per part (lag nr 492 Harçlar Kanunu, tariff 4 art. 20/a). Om auktionsvillkoren (Şartname) lägger hela avgiften på köparen anser justitieministeriet detta tillåtet (İİDB, 2023-01-12) — då blir det 40 ‰. Tillkommer moms (KDV) enligt kungörelsen samt stämpelskatt (damga vergisi). Läs ditt ärendes Şartname.",
    },
    "tr.default": {
      title: "Känn till följderna av utebliven betalning",
      detail:
        "Om betalning inte sker i tid upphäver exekutionsmyndigheten klubbslaget (ihale) och du blir ersättningsskyldig för eventuell prisskillnad (İİK art. 133). För auktioner kungjorda från och med 2026-07-31 tillkommer dessutom en straffavgift på 5 % av budet (İİK art. 114 i lydelse enligt lag nr 7589).",
    },
    "tr.annulment": {
      title: "Invänta klanderfristen (ihalenin feshi)",
      detail:
        "Sakägare kan begära upphävande av auktionen inom sju dagar (ihalenin feshi, İİK art. 134), eller i särskilda fall från kännedom dock högst ett år. Medan en sådan prövning pågår kan lagfart inte beviljas. Beställ fram till dess inga arbeten som du inte kan avboka.",
    },
    "tr.registry": {
      title: "Följ upp lagfartsinskrivningen (tescil)",
      detail:
        "När klubbslaget vunnit laga kraft (kesinleşme) och betalats skickar exekutionsmyndigheten en officiell begäran (tescil müzekkeresi) till Tapu-kontoret om att skriva in dig som ägare (İİK art. 134). Följ upp att skrivelsen har skickats.",
    },
    "tr.deed": {
      title: "Kontrollera din Tapu-inskrivning",
      detail:
        "Kontrollera efter inskrivning via e-Devlet (Tapu Bilgileri): står du som ägare, och har utmätningar (haciz) och panträtter (ipotek) raderats?",
    },
    "tr.dask": {
      title: "Teckna en ny DASK-jordbävningsförsäkring",
      detail:
        "Obligatorisk jordbävningsförsäkring krävs enligt lag (lag nr 6305). Sedan 2026-09-05 går tidigare ägares försäkring inte längre över; den upphör vid lagfart (DASK allmänna villkor, Resmi Gazete 2026-08-21/33347). Teckna en egen försäkring; el- och vattenbolag kräver den ofta vid nyanslutning. Fråga Tapu-kontoret om den kontrolleras vid inskrivning efter auktion.",
    },
    "tr.propertyTax": {
      title: "Ordna fastighetsskatteregistrering (emlak vergisi)",
      detail:
        "Ägarbytet utlöser deklarationsplikt hos kommunen (lag nr 1319 art. 23); din skattskyldighet börjar nästkommande kalenderår (art. 33). Fråga kommunen om Tapu-kontorets underrättelse räcker och begär utdrag över eventuella obetalda skatter på fastigheten.",
    },
    "tr.eviction": {
      title: "Avhysning via exekutionsmyndigheten",
      detail:
        "Om gäldenären eller en boende utan rättstitel bor kvar utfärdar exekutionsmyndigheten på din begäran ett 15-dagars avhysningsföreläggande följt av tvångsavhysning (İİK art. 135/2). Hyresgäster med officiellt daterat hyresavtal från tiden före utmätningen är skyddade (se Hyresgäster). Dröj inte med din begäran.",
    },
    "tr.tenant": {
      title: "Hyresgäster: hyresavtalet går över på dig",
      detail:
        "Den nya ägaren träder in i hyresavtalet (TBK art. 310). Om du vill säga upp för eget behov måste du meddela hyresgästen skriftligen inom en månad från förvärvet och kan väcka avhysningstalan tidigast efter sex månader (TBK art. 351). Stäm av med en jurist vilket datum som räknas som förvärvsdag vid auktion — denna lista räknar försiktigt från auktionsdagen.",
    },
    "tr.handover": {
      title: "Dokumentera tillträdet",
      detail:
        "Nycklar, mätarställningar och skick med daterade foton. För över el-, vatten- och gasabonnemang (abonelik) på ditt namn och byt lås.",
    },
    "tr.inspect": {
      title: "Besiktiga skicket och planera renovering",
      detail:
        "Jämför faktiskt skick med värderingsutlåtandet (kıymet takdir raporu) och ta in offerter innan du beställer arbeten.",
    },
    "tr.permits": {
      title: "Tillstånd vid ombyggnad",
      detail:
        "Ändringar kan kräva bygglov (yapı ruhsatı, lag nr 3194 İmar Kanunu art. 21). Stäm av med kommunen innan arbetet påbörjas.",
    },
    "tr.condo": {
      title: "Meddela fastighetsförvaltningen",
      detail:
        "För lägenheter i flerfamiljshus: meddela förvaltningen (yönetim) och fråga efter månadsavgift (aidat) samt förvaltningsplan (yönetim planı, lag nr 634 Kat Mülkiyeti Kanunu).",
    },
  },
};
