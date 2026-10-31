import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Task texts in English, for both markets. Every statement has its source in closingTasks.ts. */
export const CLOSING_TASKS_EN: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Secure the award ruling (Zuschlagsbeschluss)",
      detail:
        "With the award, you become the owner even before registration in the land register (§ 90 ZVG). Have the ruling handed to you or sent to you and keep it safe: later, it also serves as the enforcement title for an eviction. The court will invoice the award fee separately (0.5 fee under KV 2214 GKG).",
    },
    "de.appeal": {
      title: "Wait for legal finality (Rechtskraft)",
      detail:
        "An immediate appeal (sofortige Beschwerde) can be lodged against the award. For everyone present at the auction or pronouncement hearing, the deadline begins with the pronouncement (§ 98 ZVG) and runs for two weeks (§ 569 ZPO). For absent parties, it only begins upon service — so legal finality may occur later. Until then, do not commission any work that you cannot cancel.",
    },
    "de.risk": {
      title: "Treat the property as yours from today",
      detail:
        "The risk of accidental loss passes to you with the award, along with benefits and burdens (§ 56 ZVG). Check whether the property is secure (vacancy, frost, access) and document its condition with dated photos.",
    },
    "de.insurerNotice": {
      title: "Notify the building insurer",
      detail:
        "An existing building insurance policy transfers to you (§ 99 in conjunction with § 95 VVG). You must notify the insurer of the acquisition without delay; otherwise the insurer may be released from liability (§ 97 VVG). Ask the foreclosure court or check the valuation report for the insurer and policy number. If no policy exists, insure the property yourself immediately.",
    },
    "de.insuranceCancel": {
      title: "Review inherited insurance and cancel if appropriate",
      detail:
        "You may cancel the inherited policy with immediate effect or at the end of the current insurance period, but only within one month of acquisition — or within one month of learning of the policy if you were unaware of it (§ 96 (2) VVG). Only cancel once seamless replacement cover is in place.",
    },
    "de.charges": {
      title: "Take over ongoing charges",
      detail:
        "From the award onwards, you bear all ongoing charges (§ 56 ZVG): pro-rata property tax, HOA fees (Hausgeld) for condominiums, electricity, water, and heating. Record meter readings and notify utility providers and, where applicable, the condominium manager (WEG-Verwaltung). The previous owner's HOA arrears are paid out of the auction proceeds (rank class 2, § 10 (1) no. 2 ZVG); per the Federal Court of Justice (BGH V ZR 209/12), this privilege does not create in-rem liability for the buyer.",
    },
    "de.interest": {
      title: "Mind the 4% interest on the cash bid (Bargebot)",
      detail:
        "The cash bid bears interest from the award onwards (§ 49 (2) ZVG) at 4% per year (§ 246 BGB). Interest accrues until payment. Clarify with the judicial officer (Rechtspfleger) whether an earlier deposit with the court (§ 49 (4) ZVG) makes sense in your case.",
    },
    "de.summons": {
      title: "Enter the summons to the distribution hearing (Verteilungstermin)",
      detail:
        "After the award, the court schedules the distribution hearing and summons you as the buyer; the summons must be served at least two weeks in advance (§ 105 ZVG). Enter the date above — the checklist calculates payment and hearing deadlines from it.",
    },
    "de.financing": {
      title: "Coordinate disbursement with your bank",
      detail:
        "Belowmark rule: your bank should know the drawdown date at least two weeks before the distribution hearing. Provide the case number, court cashier details (Gerichtskasse), and payment reference from the summons. The bank file summarises this for your bank.",
    },
    "de.pay": {
      title: "Transfer the cash bid (Bargebot)",
      detail:
        "The cash bid must be paid before the distribution hearing by bank transfer to the court cashier (Gerichtskasse); the amount must be credited before the hearing and proof of payment must be presented at the hearing (§ 49 (1), (3) ZVG). Cash payment is not permitted. This list schedules the transfer five days in advance — that is a safety buffer, not a statutory deadline.",
    },
    "de.attend": {
      title: "Distribution hearing (Verteilungstermin)",
      detail:
        "Bring proof of payment (§ 49 (3) ZVG). At the hearing, the distribution plan (Teilungsplan) is drawn up and executed — this is a prerequisite for your registration in the land register (§ 130 ZVG).",
    },
    "de.default": {
      title: "Understand the consequences of non-payment",
      detail:
        "If you fail to pay, the distribution plan is executed by assigning the claim against you to the entitled creditors (§ 118 ZVG). Those creditors can then immediately pursue a resale auction (Wiederversteigerung) against you without a new enforcement title (§ 133 ZVG). You remain the owner and debtor — withdrawal is not possible.",
    },
    "de.taxNotice": {
      title: "Pay real estate transfer tax (Grunderwerbsteuer)",
      detail:
        "The court notifies the tax office of the award (§ 18 (1) no. 3 GrEStG). The tax falls due one month after notification of the assessment notice (§ 15 GrEStG). Enter the date of the assessment notice above.",
    },
    "de.clearance": {
      title: "Tax clearance certificate (Unbedenklichkeitsbescheinigung)",
      detail:
        "Without it, you will not be entered in the land register (§ 22 (1) GrEStG). The tax office issues it once the tax has been paid, secured, or deferred (§ 22 (2) GrEStG) and usually sends it directly to the court or land registry. Follow up if several weeks pass after payment.",
    },
    "de.courtFees": {
      title: "Pay court and registry fees",
      detail:
        "Award fee (0.5 fee under KV 2214 GKG, based on the highest bid plus surviving rights) and later the fee for your land register entry (1.0 fee under KV 14110 GNotKG). The bid limit calculator on the case sheet shows these amounts.",
    },
    "de.registry": {
      title: "Await the court's land registry request (Grundbuchersuchen)",
      detail:
        "Once the distribution plan has been executed and the award is final, the court requests the land registry to enter you as owner and to delete extinguished rights as well as the foreclosure notice (§ 130 (1) ZVG). A land charge (Grundschuld) for your bank can only be registered afterwards (§ 130 (3) ZVG).",
    },
    "de.extract": {
      title: "Check the land register extract",
      detail:
        "After registration, request an extract: are you listed as owner? Have the foreclosure notice and extinguished rights been deleted? Do only the rights remain that were set to survive under the auction terms?",
    },
    "de.eviction": {
      title: "Eviction based on the award ruling",
      detail:
        "Against an occupant without a surviving right — such as the former owner — the award ruling itself serves as the eviction title (§ 93 (1) ZVG). You need an enforceable copy with proof of service (§ 750 ZPO) and instruct the bailiff (§ 885 ZPO); a limited enforcement order under § 885a ZPO can save costs. Not available against occupants holding a right that survives the award (§ 93 (1) sentence 2 ZVG). You do not have to reimburse expenditures made before the award (§ 93 (2) ZVG).",
    },
    "de.tenantTakeover": {
      title: "Take over existing tenancies",
      detail:
        "Existing lease and rental agreements transfer to you (§ 57 ZVG in conjunction with § 566 BGB). Notify tenants in writing of the change of ownership and the new bank account. You may be liable for returning a security deposit even if you never received it from the former owner (§ 566a BGB) — request proof of the deposit.",
    },
    "de.tenantNotice": {
      title: "Special termination right: first possible date only",
      detail:
        "You may terminate with the statutory notice period, but only for the first permissible date — otherwise the special right is lost (§ 57a ZVG). For residential leases, the notice must reach the tenant no later than the third working day of a month (§ 573c BGB). Statutory tenant protection still applies: you need a legitimate interest such as owner occupancy (§ 573 BGB). The date shown here is calculated conservatively (Saturdays count as working days, public holidays are not deducted) — have a lawyer review the termination.",
    },
    "de.handover": {
      title: "Document the handover",
      detail:
        "Keys, meter readings, condition with photos, defects, items left behind — with date and signatures. Change the locks as soon as you have possession.",
    },
    "de.inspect": {
      title: "Survey condition and plan renovations",
      detail:
        "There is no warranty (§ 56 ZVG). Compare the actual condition with the valuation report and obtain quotes before awarding contracts. You can then replace the renovation estimates in the bid limit calculator with real quotes.",
    },
    "de.energy": {
      title: "Mandatory energy retrofits after change of ownership",
      detail:
        "For single- and two-family houses that the previous owner occupied on 01.02.2002, certain retrofit obligations (e.g. top-floor ceiling insulation) pass to the new owner with a two-year deadline from transfer of ownership (formerly § 47 GEG). The GEG was replaced in 2026 by the Building Modernisation Act (Gebäudemodernisierungsgesetz) — check the current rules with an energy advisor.",
    },
    "de.permits": {
      title: "Clarify permits before structural work",
      detail:
        "Whether alterations, a change of use, or work on a listed building require a permit is governed by state law (building code, heritage protection act). Check with the local building authority before starting work.",
    },
    "de.condo": {
      title: "Request condominium (WEG) documents",
      detail:
        "For condominiums: notify the property manager of the change of ownership and request the budget plan (Wirtschaftsplan), latest annual statement, resolution collection, and declaration of division (Teilungserklärung). Watch out for approved special assessments (Sonderumlagen).",
    },
  },
  TR: {
    "tr.pay": {
      title: "Pay the auction price (ihale bedeli) — 7 days",
      detail:
        "The purchase price and fees must be paid within seven days of publication of the auction outcome protocol (artırma sonuç tutanağı), even if someone has applied to annul the auction (Elektronik Satış Yönetmeliği Art. 20/1; İİK Art. 130). Since Law No. 7343, there is no longer a ten-day extension. Enter the protocol publication date above.",
    },
    "tr.fees": {
      title: "Prepare taxes and fees under the Şartname",
      detail:
        "Land registry fee (tapu harcı) is 20‰ of the sale price per party (Law No. 492 Harçlar Kanunu, Tariff 4 Art. 20/a). If the auction terms (Şartname) assign all tapu fees to the buyer, the Ministry of Justice considers this permissible (İİDB, 12.01.2023) — making it 40‰. Add VAT (KDV) as stated in the notice and stamp duty (damga vergisi). Read the Şartname of your proceeding.",
    },
    "tr.default": {
      title: "Understand the consequences of non-payment",
      detail:
        "If payment is not made on time, the enforcement office cancels the award (ihale) and you are liable for any shortfall (İİK Art. 133). For auctions announced on or after 31.07.2026, an additional penalty of 5% of the bid applies (İİK Art. 114 as amended by Law No. 7589).",
    },
    "tr.annulment": {
      title: "Wait out the annulment period (ihalenin feshi)",
      detail:
        "Interested parties can request annulment of the auction within seven days (ihalenin feshi, İİK Art. 134), or in special cases from the date of knowledge up to one year at most. While a proceeding is pending, title cannot be registered. Until then, do not commission any work that you cannot cancel.",
    },
    "tr.registry": {
      title: "Track land registry registration (tescil)",
      detail:
        "Once the award is final (kesinleşme) and paid, the enforcement office sends an official request (tescil müzekkeresi) to the Tapu office to register you as owner (İİK Art. 134). Follow up to confirm whether the letter has been dispatched.",
    },
    "tr.deed": {
      title: "Verify your Tapu registration",
      detail:
        "After registration, check via e-Devlet (Tapu Bilgileri): are you listed as owner, and have attachments (haciz) and mortgages (ipotek) been deleted?",
    },
    "tr.dask": {
      title: "Take out a new DASK earthquake policy",
      detail:
        "Compulsory earthquake insurance is mandatory (Law No. 6305). Since 05.09.2026, the previous owner's policy no longer transfers; it terminates upon registration (DASK General Conditions, Official Gazette 21.08.2026/33347). Take out your own policy; utility providers often require it for new connections. Ask the Tapu office whether they verify it upon registration following an auction.",
    },
    "tr.propertyTax": {
      title: "Settle property tax (emlak vergisi) registration",
      detail:
        "Transfer of ownership triggers a declaration requirement with the municipality (Law No. 1319 Art. 23); your tax liability begins the following calendar year (Art. 33). Ask the municipality whether the Tapu office's notification is sufficient and request a statement of any outstanding taxes on the property.",
    },
    "tr.eviction": {
      title: "Eviction through the enforcement office",
      detail:
        "If the debtor or an occupant without title lives in the property, the enforcement office serves a 15-day eviction order upon your request, followed by compulsory eviction (İİK Art. 135/2). Tenants holding an officially dated lease from before the attachment are protected (see Tenants). Do not delay your request.",
    },
    "tr.tenant": {
      title: "Tenants: the lease transfers to you",
      detail:
        "The new owner becomes party to the lease (TBK Art. 310). If you wish to terminate for owner occupancy, you must notify the tenant in writing within one month of acquisition and may file an eviction lawsuitafter six months at the earliest (TBK Art. 351). Clarify with a lawyer which date counts as acquisition in an auction — this list calculates conservatively from the auction date.",
    },
    "tr.handover": {
      title: "Document the handover",
      detail:
        "Keys, meter readings, condition with dated photos. Transfer electricity, water, and gas subscriptions (abonelik) to your name and change the locks.",
    },
    "tr.inspect": {
      title: "Survey condition and plan renovations",
      detail:
        "Compare the actual condition with the valuation report (kıymet takdir raporu) and obtain quotes before awarding contracts.",
    },
    "tr.permits": {
      title: "Permits for alterations",
      detail:
        "Alterations may require a building permit (yapı ruhsatı, Law No. 3194 İmar Kanunu Art. 21). Check with the municipality before starting work.",
    },
    "tr.condo": {
      title: "Notify the building management",
      detail:
        "For condominiums: notify the building management (yönetim) and ask for the monthly dues (aidat) and management plan (yönetim planı, Law No. 634 Kat Mülkiyeti Kanunu).",
    },
  },
};
