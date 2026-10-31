import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Task texts in Spanish, for both markets. Every statement has its source in closingTasks.ts. */
export const CLOSING_TASKS_ES: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Asegurar el auto de adjudicación (Zuschlagsbeschluss)",
      detail:
        "Con la adjudicación usted se convierte en propietario incluso antes de la inscripción en el registro de la propiedad (§ 90 ZVG). Solicite la entrega o el envío de la resolución y consérvela: más adelante también será el título ejecutivo para un lanzamiento. La tasa de adjudicación (0,5 de tasa según KV 2214 GKG) la factura el juzgado por separado.",
    },
    "de.appeal": {
      title: "Esperar a la firmeza (Rechtskraft)",
      detail:
        "Contra la adjudicación cabe recurso inmediato de queja (sofortige Beschwerde). Para todos los presentes en la subasta o en el acto de pronunciamiento, el plazo comienza con el pronunciamiento (§ 98 ZVG) y es de dos semanas (§ 569 ZPO). Para los ausentes corre desde la notificación, por lo que la firmeza puede producirse más tarde. Hasta entonces, no encargue trabajos que no pueda cancelar.",
    },
    "de.risk": {
      title: "Tratar el inmueble como suyo desde hoy",
      detail:
        "El riesgo de pérdida fortuita pasa a usted con la adjudicación, al igual que los frutos y las cargas (§ 56 ZVG). Compruebe si el inmueble está asegurado (desocupación, heladas, accesos) y documente el estado con fotografías fechadas.",
    },
    "de.insurerNotice": {
      title: "Informar a la aseguradora del edificio",
      detail:
        "Un seguro de edificio existente se transmite a usted (§ 99 en relación con el § 95 VVG). La transmisión debe comunicarse sin demora a la aseguradora; de lo contrario, puede quedar liberada de su obligación de indemnizar (§ 97 VVG). Pregunte en el juzgado de ejecución o revise la tasación para conocer la aseguradora y el número de póliza. Si no existe contrato, asegúrelo usted mismo de inmediato.",
    },
    "de.insuranceCancel": {
      title: "Revisar el seguro asumido y rescindirlo si procede",
      detail:
        "Puede rescindir el contrato asumido con efecto inmediato o al final del período de seguro en curso, pero solo dentro del mes siguiente a la adquisición; si desconocía el contrato, desde que tuvo conocimiento de él (§ 96 apdo. 2 VVG). Rescíndalo únicamente si la nueva cobertura entra en vigor sin interrupción.",
    },
    "de.charges": {
      title: "Asumir los gastos corrientes",
      detail:
        "Desde la adjudicación usted asume las cargas (§ 56 ZVG): impuesto sobre bienes inmuebles proporcional, cuota de comunidad (Hausgeld) en propiedad horizontal, electricidad, agua y calefacción. Anote las lecturas de los contadores e informe a las suministradoras y, en su caso, a la administración de la comunidad (WEG-Verwaltung). Los atrasos de cuotas del propietario anterior se atienden con el producto de la subasta (clase 2, § 10 apdo. 1 n.º 2 ZVG); según el Tribunal Supremo Federal (BGH V ZR 209/12), este privilegio no genera responsabilidad real del adquirente.",
    },
    "de.interest": {
      title: "Tener en cuenta el devengo de intereses sobre el remate en metálico (Bargebot)",
      detail:
        "El remate a pagar (Bargebot) devenga intereses desde la adjudicación (§ 49 apdo. 2 ZVG) al 4 % anual (§ 246 BGB). Los intereses corren hasta el pago. Aclare con el letrado judicial (Rechtspfleger) si le conviene realizar una consignación anticipada en el juzgado (§ 49 apdo. 4 ZVG).",
    },
    "de.summons": {
      title: "Registrar la citación a la comparecencia de reparto (Verteilungstermin)",
      detail:
        "Tras la adjudicación, el juzgado señala la comparecencia de reparto y le cita como adjudicatario; la citación debe recibirse al menos dos semanas antes (§ 105 ZVG). Introduzca la fecha arriba: con ella la lista calcula el pago y la comparecencia.",
    },
    "de.financing": {
      title: "Coordinar el desembolso con el banco",
      detail:
        "Regla Belowmark: dos semanas antes de la comparecencia de reparto, el banco debe conocer la disposición de fondos. Facilítele el número de expediente, la caja judicial (Gerichtskasse) y el concepto que figuran en la citación. El dosier bancario resume estos datos para su entidad.",
    },
    "de.pay": {
      title: "Transferir el remate en metálico (Bargebot)",
      detail:
        "El Bargebot debe abonarse antes de la comparecencia de reparto mediante transferencia a la caja judicial (Gerichtskasse); el importe debe estar abonado en cuenta antes del acto y el justificante debe presentarse en la comparecencia (§ 49 apdos. 1 y 3 ZVG). No se admite el pago en efectivo. La lista fija la transferencia cinco días antes como margen de seguridad, no como plazo legal.",
    },
    "de.attend": {
      title: "Comparecencia de reparto (Verteilungstermin)",
      detail:
        "Lleve el justificante de pago (§ 49 apdo. 3 ZVG). En el acto se elabora y ejecuta el plan de reparto (Teilungsplan), requisito indispensable para su inscripción en el registro de la propiedad (§ 130 ZVG).",
    },
    "de.default": {
      title: "Conocer las consecuencias del impago",
      detail:
        "Si no paga, el plan de reparto se ejecuta transfiriendo el crédito contra usted a los acreedores con derecho (§ 118 ZVG). Estos pueden instar de inmediato una nueva subasta en quiebra (Wiederversteigerung) contra usted sin necesidad de nuevo título (§ 133 ZVG). Usted sigue siendo propietario y deudor: no existe derecho de desistimiento.",
    },
    "de.taxNotice": {
      title: "Pagar el impuesto de transmisiones patrimoniales (Grunderwerbsteuer)",
      detail:
        "El juzgado comunica la adjudicación a la agencia tributaria (§ 18 apdo. 1 n.º 3 GrEStG). El impuesto vence un mes después de la notificación de la liquidación (§ 15 GrEStG). Introduzca arriba la fecha de la liquidación.",
    },
    "de.clearance": {
      title: "Certificado de solvencia fiscal (Unbedenklichkeitsbescheinigung)",
      detail:
        "Sin él no será inscrito en el registro de la propiedad (§ 22 apdo. 1 GrEStG). La agencia tributaria lo expide una vez pagado, garantizado o aplazado el impuesto (§ 22 apdo. 2 GrEStG) y suele enviarlo directamente al juzgado o al registro de la propiedad. Consulte si transcurren semanas tras el pago.",
    },
    "de.courtFees": {
      title: "Pagar las costas judiciales y registrales",
      detail:
        "Tasa de adjudicación (0,5 de tasa según KV 2214 GKG, sobre la puja máxima más los derechos subsistentes) y posteriormente la tasa por su inscripción registral (1,0 de tasa según KV 14110 GNotKG). El cálculo del límite de puja en la ficha del expediente muestra los importes.",
    },
    "de.registry": {
      title: "Esperar el exhorto al registro de la propiedad (Grundbuchersuchen)",
      detail:
        "Una vez ejecutado el plan de reparto y firme la adjudicación, el juzgado solicita al registro de la propiedad su inscripción como propietario y la cancelación de los derechos extinguidos y de la nota de subasta (§ 130 apdo. 1 ZVG). Una deuda territorial (Grundschuld) a favor de su banco solo puede inscribirse después (§ 130 apdo. 3 ZVG).",
    },
    "de.extract": {
      title: "Revisar la nota simple / extracto registral (Grundbuchauszug)",
      detail:
        "Tras la inscripción, solicite un extracto: ¿figura usted como propietario? ¿Se han cancelado la nota de subasta y los derechos extinguidos? ¿Solo permanecen inscritos los derechos que debían subsistir según las condiciones de la subasta?",
    },
    "de.eviction": {
      title: "Lanzamiento en virtud del auto de adjudicación",
      detail:
        "Frente al poseedor, como el anterior propietario, el propio auto de adjudicación constituye el título ejecutivo de lanzamiento (§ 93 apdo. 1 ZVG). Necesita una copia ejecutiva con constancia de notificación (§ 750 ZPO) para encargar el lanzamiento al agente judicial (§ 885 ZPO); un encargo limitado según el § 885a ZPO puede ahorrar costes. No procede frente a poseedores con un derecho que subsista tras la adjudicación (§ 93 apdo. 1 frase 2 ZVG). No tiene que reembolsar gastos realizados antes de la adjudicación (§ 93 apdo. 2 ZVG).",
    },
    "de.tenantTakeover": {
      title: "Subrogarse en el contrato de arrendamiento",
      detail:
        "Los contratos de arrendamiento vigentes se transmiten a usted (§ 57 ZVG en relación con el § 566 BGB). Informe por escrito a los inquilinos del cambio de propietario y de la nueva cuenta bancaria. Puede responder de la devolución de la fianza aunque nunca la haya recibido del propietario anterior (§ 566a BGB): solicite justificante de la fianza.",
    },
    "de.tenantNotice": {
      title: "Resolución extraordinaria: solo para la primera fecha permitida",
      detail:
        "Puede resolver el contrato con el preaviso legal, pero únicamente para el primer término permitido; de lo contrario, pierde ese derecho especial (§ 57a ZVG). En vivienda, la notificación debe llegar a más tardar el tercer día hábil del mes (§ 573c BGB). Se mantiene la protección al inquilino: necesita un interés legítimo, p. ej. necesidad de vivienda propia (§ 573 BGB). La fecha aquí indicada se calcula de forma prudente (los sábados cuentan, no se descuentan festivos): haga revisar la rescisión por un abogado.",
    },
    "de.handover": {
      title: "Documentar la entrega",
      detail:
        "Llaves, lecturas de contadores, estado con fotografías, desperfectos y objetos abandonados, con fecha y firma. Cambie las cerraduras en cuanto tome posesión.",
    },
    "de.inspect": {
      title: "Evaluar el estado y planificar la reforma",
      detail:
        "No existe garantía por vicios (§ 56 ZVG). Compare el estado real con el informe de tasación y pida presupuestos antes de adjudicar obras. Así podrá sustituir las estimaciones de reforma del límite de puja por presupuestos reales.",
    },
    "de.energy": {
      title: "Obligaciones de rehabilitación energética tras el cambio de propietario",
      detail:
        "En viviendas unifamiliares y bifamiliares habitadas por el propietario anterior el 01.02.2002, determinadas obligaciones de mejora energética (p. ej. aislamiento del forjado superior) recaen sobre el nuevo propietario con un plazo de dos años desde la transmisión (antes § 47 GEG). La GEG fue sustituida en 2026 por la Ley de Modernización de Edificios (Gebäudemodernisierungsgesetz): consulte la normativa vigente con un asesor energético.",
    },
    "de.permits": {
      title: "Aclarar licencias antes de reformar",
      detail:
        "Si una reforma, un cambio de uso o trabajos en un monumento protegido requieren licencia depende de la legislación de cada estado federado (normativa urbanística y de patrimonio). Consulte en la oficina de urbanismo antes de iniciar las obras.",
    },
    "de.condo": {
      title: "Solicitar la documentación de la comunidad (WEG)",
      detail:
        "En propiedad horizontal: informe a la administración del cambio de propietario y solicite el presupuesto anual (Wirtschaftsplan), la última liquidación anual, el libro de acuerdos y la escritura de división horizontal (Teilungserklärung). Preste atención a las derramas extraordinarias aprobadas (Sonderumlagen).",
    },
  },
  TR: {
    "tr.pay": {
      title: "Pagar el precio de adjudicación (ihale bedeli) — 7 días",
      detail:
        "El precio de compra y los gastos deben abonarse dentro de los siete días siguientes a la publicación del acta de resultado de la subasta (artırma sonuç tutanağı), incluso si alguien ha solicitado la anulación de la subasta (Elektronik Satış Yönetmeliği art. 20/1; İİK art. 130). Desde la Ley n.º 7343 ya no existe prórroga de diez días. Introduzca arriba la fecha de publicación del acta.",
    },
    "tr.fees": {
      title: "Preparar los gastos según la Şartname",
      detail:
        "La tasa registral (tapu harcı) asciende al 20 ‰ del precio de venta por cada parte (Ley n.º 492 Harçlar Kanunu, Tarifa 4 art. 20/a). Si el pliego de condiciones (Şartname) atribuye la totalidad de las tasas de Tapu al comprador, el Ministerio de Justicia lo considera admisible (İİDB, 12.01.2023), con lo que asciende al 40 ‰. A ello se suman el IVA (KDV) según el edicto y el impuesto de timbre (damga vergisi). Lea la Şartname de su procedimiento.",
    },
    "tr.default": {
      title: "Conocer las consecuencias del impago",
      detail:
        "Si no se paga, la oficina de ejecución anula la adjudicación (ihale) y usted responde de la diferencia de precio (İİK art. 133). Para las ventas anunciadas a partir del 31.07.2026 se añade una penalización del 5 % de la puja (İİK art. 114 redactado por la Ley n.º 7589).",
    },
    "tr.annulment": {
      title: "Esperar el plazo de impugnación de la subasta (ihalenin feshi)",
      detail:
        "Los interesados pueden solicitar la anulación de la subasta en el plazo de siete días (ihalenin feshi, İİK art. 134), o en casos especiales desde que tuvieron conocimiento, con un máximo de un año. Mientras esté pendiente un procedimiento no se practica la inscripción. Hasta entonces, no encargue trabajos que no pueda cancelar.",
    },
    "tr.registry": {
      title: "Hacer seguimiento de la inscripción registral (tescil)",
      detail:
        "Una vez firme la adjudicación (kesinleşme) y pagado el precio, la oficina de ejecución dirige oficio al registro de Tapu para inscribirle como propietario (İİK art. 134). Pregunte si el oficio de inscripción (tescil müzekkeresi) ya ha sido enviado.",
    },
    "tr.deed": {
      title: "Comprobar la inscripción en el Tapu",
      detail:
        "Tras la inscripción, compruebe a través de e-Devlet (Tapu Bilgileri): ¿figura usted como propietario y se han cancelado los embargos (haciz) e hipotecas (ipotek)?",
    },
    "tr.dask": {
      title: "Contratar una nueva póliza antisísmica DASK",
      detail:
        "El seguro obligatorio contra terremotos es preceptivo (Ley n.º 6305). Desde el 05.09.2026 la póliza del propietario anterior ya no se traspasa, sino que se extingue con la inscripción (Condiciones DASK, Boletín Oficial 21.08.2026/33347). Contrate su propia póliza; las compañías suministradoras suelen exigirla para dar de alta los suministros. Consulte en la oficina del Tapu si la exigen al inscribir una subasta.",
    },
    "tr.propertyTax": {
      title: "Regularizar el impuesto sobre bienes inmuebles (emlak vergisi)",
      detail:
        "La transmisión de la propiedad obliga a presentar declaración ante el ayuntamiento (Ley n.º 1319 art. 23); usted pasa a ser sujeto pasivo a partir del año siguiente (art. 33). Pregunte en el ayuntamiento si basta con la comunicación del Tapu y solicite información sobre posibles deudas tributarias pendientes del inmueble.",
    },
    "tr.eviction": {
      title: "Lanzamiento a través de la oficina de ejecución",
      detail:
        "Si en el inmueble reside el deudor o un ocupante sin título, la oficina de ejecución notifica a instancia suya un requerimiento de desalojo con un plazo de 15 días, tras el cual se procede al lanzamiento (İİK art. 135/2). Los inquilinos con contrato de fecha fehaciente anterior al embargo están protegidos (véase Inquilinos). No demore la solicitud.",
    },
    "tr.tenant": {
      title: "Inquilinos: el contrato de arrendamiento continúa",
      detail:
        "El nuevo propietario pasa a ser parte del contrato de arrendamiento (TBK art. 310). Si desea resolver por necesidad de vivienda propia, debe notificarlo por escrito al inquilino dentro del mes siguiente a la adquisición y podrá interponer demanda como pronto a los seis meses (TBK art. 351). Aclare con un abogado qué fecha cuenta como adquisición en una subasta: la lista calcula de forma prudente desde la fecha de la ihale.",
    },
    "tr.handover": {
      title: "Documentar la entrega",
      detail:
        "Llaves, lecturas de contadores y estado con fotografías fechadas. Poner a su nombre los suministros de electricidad, agua y gas (abonelik) y cambiar las cerraduras.",
    },
    "tr.inspect": {
      title: "Evaluar el estado y planificar la reforma",
      detail:
        "Compare el estado real con el informe de valoración (kıymet takdir raporu) y solicite presupuestos antes de adjudicar obras.",
    },
    "tr.permits": {
      title: "Licencia para obras de reforma",
      detail:
        "Para realizar reformas puede ser necesaria una licencia de obras (yapı ruhsatı, Ley n.º 3194 İmar Kanunu art. 21). Consulte previamente en el ayuntamiento.",
    },
    "tr.condo": {
      title: "Informar a la administración de la finca",
      detail:
        "En pisos en régimen de propiedad horizontal: informe a la administración (yönetim) y solicite información sobre la cuota mensual (aidat) y el estatuto de la comunidad (yönetim planı, Ley n.º 634 Kat Mülkiyeti Kanunu).",
    },
  },
};
