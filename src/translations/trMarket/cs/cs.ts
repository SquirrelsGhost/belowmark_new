import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_CS: ITrMarketTranslation = {
  Age: {
    Title: "Stáří odhadní ceny",
    Lead: "Muhammen bedel je nominální částka z roku zahájení exekučního řízení. Při turecké inflaci to u starších spisů není žádný detail.",
    FileYear: "Rok spisu",
    Basis: "Ocenění stanoveno nejpozději v prosinci {year} — nejzazší možné datum v daném roce, tedy nejkonzervativnější údaj.",
    Factor: "Spotřebitelské ceny od té doby",
    Lost: "Ztráta kupní síly nominální částky",
    Today: "Odhadní cena v lirách za {month}",
    TodayNote: "Pouze přepočet podle kupní síly — nejedná se o nový posudek ani o tržní cenu.",
    Young: "Spis z roku {year}: ocenění je čerstvé, inflační přepočet zde nepřináší přidanou hodnotu.",
    NoYear: "Spisová značka neuvádí rok. Bez roku nelze inflační srovnání provést.",
    Unavailable: "Oficiální řada cenového indexu není dostatečně aktuální. Raději žádný údaj než zastaralý.",
    Source: "{label}, {source} · ke dni {month}",
  },

  Euro: {
    Title: "Přepočet na eura",
    Value: "Odhadní cena",
    StartingBid: "Nejnižší podání",
    AllIn: "Nejnižší podání vč. vedlejších nákladů",
    Rate: "1 € = {rate} · nákupní devizový kurz TCMB ze dne {date}",
    Note: "Přepočteno denním kurzem centrální banky, nikoli kurzem v den platby. Vypořádání probíhá v tureckých lirách.",
    Unavailable: "Není uložen žádný aktuální kurz centrální banky{last}. Částky v eurech se zobrazí ihned po načtení dnešního kurzu — nikdy nepřepočítáváme zastaralým kurzem.",
    LastRate: " (poslední kurz ze dne {date})",
  },

  CheckKit: {
    Title: "Kontrolní sada pro e-Satış",
    Lead: "Fotografie, znalecký posudek a dražební podmínky jsou na portálu e-Satış a vyžadují přihlášení přes e-Devlet. Přímé odkazy nepřenášejí vyhledávací parametry — zkopírujte tyto údaje a vložte je přímo do portálu.",
    Copy: "Zkopírovat kontrolní sadu",
    Copied: "Zkopírováno",
    Open: "Otevřít e-Satış",
    NotStated: "neuvedeno",
  },

  Converter: {
    Title: "Převodník měn ₺ ↔ €",
    Subtitle: "Podle denního kurzu TCMB",
    Lira: "Částka v lirách",
    Euro: "Částka v eurech",
    Unavailable: "Není uložen žádný aktuální kurz centrální banky{last}. Převodník se zobrazí ihned po načtení dnešního kurzu.",
  },
};
