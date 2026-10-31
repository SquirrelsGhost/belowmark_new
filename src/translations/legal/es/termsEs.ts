import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export function vatSentenceEs(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") {
    return "Todos los precios son precios finales. De conformidad con el § 19 de la Ley alemana del IVA (UStG), no se aplica el impuesto sobre el valor añadido.";
  }
  return "Todos los precios son precios finales e incluyen el impuesto sobre el valor añadido (IVA) legalmente aplicable.";
}

export function termsEs(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Términos y Condiciones Generales (AGB)",
    asOf: "Actualizado el 31 de octubre de 2026",
    basis: "Para el uso de la plataforma Belowmark (belowmark.com).",
    sections: [
      {
        id: "geltung",
        heading: "1. Ámbito de aplicación y partes contratantes",
        paragraphs: [
          `Las presentes condiciones generales se aplican a todos los contratos sobre el uso del servicio en línea Belowmark celebrados entre ${operatorAddress()} (en adelante, el "Proveedor") y el cliente.`,
          "Es consumidor toda persona física que celebre el contrato con fines que sean predominantemente ajenos a su actividad comercial, empresarial o profesional independiente (§ 13 BGB / TRLGDCU). Las condiciones divergentes del cliente solo serán aplicables si el Proveedor las acepta expresamente.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Objeto del servicio",
        paragraphs: [
          "Belowmark recopila información publicada oficialmente sobre subastas judiciales y administrativas en Europa (Alemania, Austria, Suiza, Italia, España, Francia, Reino Unido) y Turquía, la estructura y calcula a partir de ella indicadores clave (por ejemplo, umbrales legales de adjudicación, depósito de consignación y gastos de adquisición). Durante la vigencia del contrato, el cliente recibe acceso personal a la aplicación web para el mercado seleccionado al registrarse.",
          "Belowmark es una herramienta de investigación y análisis previo. El servicio no constituye asesoramiento jurídico, fiscal, inmobiliario ni de inversión y no incluye recomendación alguna para presentar una puja determinada. Toda la información debe verificarse en el edicto y expediente judicial original antes de tomar cualquier decisión económica.",
          "Los datos proceden de fuentes de terceros (portales judiciales como el Portal de Subastas del BOE, boletines oficiales y portales de anuncios). El Proveedor no garantiza la exactitud, integridad ni actualidad de dichos datos; el inventario puede ser incompleto. Los valores calculados son resultados matemáticos basados en esta información y no constituyen tasaciones oficiales.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Tarifas y planes",
        paragraphs: [
          "Free Scout: uso gratuito por tiempo indefinido con alcance limitado (lista de inmuebles visible, valores de tasación y fechas de subasta bloqueados). No se solicitan datos de pago.",
          "Periodo de prueba: tras confirmar su dirección de correo electrónico, el cliente obtiene durante 14 días de forma gratuita el alcance del acceso Investor. El periodo de prueba finaliza automáticamente y no se convierte en una suscripción de pago.",
          "Investor Mensual: acceso completo individual por 39,00 € / £35 / CHF 39 (mercados europeos) o 599,00 TL (mercado de Turquía) al mes, pagadero por adelantado, con renovación automática mensual salvo cancelación.",
          "Investor Tres Meses: acceso completo durante tres meses naturales mediante un pago único por adelantado de 99,00 € / £89 / CHF 99 (mercados europeos) o 1.490,00 TL (mercado de Turquía). No se renueva automáticamente; no requiere cancelación.",
          "Pro Mensual: acceso completo que incluye enlaces para clientes con membrete propio y listas de equipo compartidas (hasta 3 equipos con hasta 5 plazas cada uno) por 129,00 € / £115 / CHF 129 (mercados europeos) o 1.990,00 TL (mercado de Turquía) al mes, pagadero por adelantado, con renovación automática mensual.",
          "Pro Tres Meses: acceso completo Pro durante tres meses naturales mediante un pago único por adelantado de 329,00 € / £295 / CHF 329 (mercados europeos) o 4.990,00 TL (mercado de Turquía). No se renueva automáticamente; no requiere cancelación. Los cupos ampliados para equipos corporativos (desde 299,00 € al mes) se acuerdan individualmente previa solicitud.",
          vatSentenceEs(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Celebración del contrato",
        paragraphs: [
          "Con el registro y la confirmación del correo electrónico se celebra un contrato de uso gratuito (Free Scout con periodo de prueba).",
          "El acceso de pago Investor o Pro se contrata en la cuenta a través del resumen del pedido, donde se detallan la tarifa, el precio, la duración y la renovación. Al hacer clic en el botón \"Pedir con obligación de pago\", el cliente presenta una oferta vinculante y es redirigido a la página de pago del proveedor Stripe. El contrato se perfecciona en cuanto Stripe confirma el pago y el Proveedor activa el acceso; el cliente recibe una confirmación por correo electrónico.",
          "El Proveedor almacena el texto del contrato (pedido, tarifa, precio y versión vigente de estas condiciones) y lo envía por correo electrónico junto con la confirmación. La versión actual está disponible en todo momento en belowmark.com/agb.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Pago y facturas",
        paragraphs: [
          "El pago se procesa a través de Stripe Payments Europe, Ltd. (Irlanda). El cliente introduce sus datos de pago exclusivamente en la página de pago de Stripe; el Proveedor nunca los almacena.",
          "Las suscripciones mensuales se cobran por adelantado al inicio de cada mes. Las facturas están disponibles en la cuenta bajo \"Facturas y métodos de pago\" y se envían por correo electrónico.",
          "Si falla un cobro, Stripe volverá a intentarlo. Si no se recibe el pago, el acceso completo finaliza al término del periodo abonado, manteniéndose el alcance gratuito.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Duración y cancelación",
        paragraphs: [
          "La suscripción mensual Investor o Pro tiene una duración indefinida y puede cancelarse en cualquier momento con efecto al final del mes ya abonado. Hasta esa fecha se mantiene el acceso completo. En caso de cancelación ordinaria no se realiza ningún reembolso proporcional por el mes en curso.",
          `La cancelación puede realizarse mediante el botón "Cancelar contratos aquí" situado en el pie de cada página (accesible sin iniciar sesión), dentro de la cuenta, a través del portal de clientes de Stripe o en forma de texto dirigida a ${LEGAL_OPERATOR.email}. Tras cancelar mediante el botón de cancelación, el cliente recibe de inmediato una confirmación por correo electrónico con el contenido, la fecha y hora de recepción y la fecha de finalización del contrato.`,
          "Los paquetes de tres meses finalizan automáticamente al concluir los meses contratados. El contrato gratuito Free Scout puede darse por terminado en cualquier momento eliminando la cuenta.",
          "El derecho de resolución extraordinaria por causa justificada permanece intacto para ambas partes.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Derecho de desistimiento y extinción en contenidos digitales (§ 356 apdo. 5 BGB / Art. 103 m TRLGDCU)",
        paragraphs: [
          "Belowmark es un producto digital con activación inmediata tras la recepción del pago. Al aceptar estos Términos y Condiciones durante el proceso de pedido, el cliente consiente expresamente en que el Proveedor comience la ejecución del contrato (puesta a disposición y activación inmediata del acceso digital de pago) antes de que expire el plazo de desistimiento, y confirma que conoce que su derecho legal de desistimiento se extingue inmediatamente con la activación del acceso (§ 356 apdo. 5 BGB).",
          "La información completa sobre la extinción del derecho de desistimiento conforme al § 356 apdo. 5 BGB puede consultarse en belowmark.com/widerruf y se envía al cliente por correo electrónico junto con la confirmación del contrato.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Disponibilidad del servicio",
        paragraphs: [
          "El Proveedor se esfuerza por mantener el servicio disponible de forma ininterrumpida, pero no garantiza un porcentaje de disponibilidad específico. Tareas de mantenimiento, incidencias de terceros o caídas de los portales oficiales de origen pueden limitar temporalmente el acceso o la actualización de los datos.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Derechos de uso, prohibición de scraping y bloqueo de cuenta sin reembolso",
        paragraphs: [
          "El cliente recibe un derecho simple e intransferible para utilizar el servicio durante la vigencia del contrato exclusivamente para sus propios fines de investigación a través de un navegador web estándar. Queda estrictamente prohibido en particular: (a) compartir las credenciales de acceso o el uso compartido de una cuenta por varias personas fuera de las plazas de equipo contratadas, (b) cualquier lectura, extracción, copia o indexación sistemática, automatizada o basada en scripts de datos, textos, indicadores o documentos (en especial mediante bots, crawlers, scrapers, navegadores headless o scripts), (c) eludir medidas técnicas de protección, límites de consultas (rate-limits) o mecanismos de seguridad (incluida la activación de trampas honeypot), así como (d) la descarga masiva, reventa, sublicencia o puesta a disposición del público de los datos o documentos procesados.",
          "El incumplimiento de las prohibiciones anteriores constituye una infracción grave de las obligaciones contractuales esenciales y faculta al Proveedor para la resolución extraordinaria inmediata por causa justificada (§ 314 BGB), así como para el bloqueo inmediato y permanente de la cuenta de usuario y del identificador del dispositivo utilizado sin necesidad de advertencia previa.",
          "En caso de dicho bloqueo de cuenta o resolución extraordinaria causados por el incumplimiento contractual del cliente (en particular por scraping, extracción automatizada de datos o elusión de mecanismos de seguridad), el derecho de uso se extingue con efecto inmediato. En este caso queda excluido cualquier derecho del cliente al reembolso total o proporcional de las cuotas ya abonadas correspondientes al mes de facturación en curso o a los periodos fijos plurimensuales contratados. Quedan a salvo las demás reclamaciones por daños y perjuicios y acciones de cesación del Proveedor.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Limitación de responsabilidad",
        paragraphs: [
          "El Proveedor responde sin limitación en caso de dolo y negligencia grave, por daños a la vida, la integridad física o la salud, así como en virtud de la legislación imperativa sobre responsabilidad por productos defectuosos. En caso de negligencia leve, solo responde por el incumplimiento de obligaciones contractuales esenciales y de forma limitada al daño previsible y típico del contrato.",
          "Salvo que concurra alguno de los supuestos del párrafo anterior, el Proveedor no responde de las decisiones económicas del cliente, en particular de las pujas realizadas en subastas ni de sus consecuencias.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Modificación de estas condiciones y de los precios",
        paragraphs: [
          "El Proveedor comunicará en forma de texto cualquier modificación de estas condiciones o del precio de la suscripción mensual al menos seis semanas antes de su entrada en vigor. Solo surtirán efecto si el cliente presta su consentimiento; si no lo presta, cualquiera de las partes podrá resolver el contrato en la fecha de entrada en vigor de la modificación.",
        ],
      },
      {
        id: "recht",
        heading: "12. Legislación aplicable y jurisdicción",
        paragraphs: [
          "Se aplica la legislación alemana con exclusión de la Convención de las Naciones Unidas sobre los Contratos de Compraventa Internacional de Mercaderías (CISG). Frente a los consumidores, esta elección de ley solo se aplica en la medida en que no prive al consumidor de la protección que le otorgan las disposiciones imperativas de la ley del Estado en el que tenga su residencia habitual.",
          `Si el cliente es comerciante, persona jurídica de derecho público o patrimonio especial de derecho público, el fuero competente exclusivo será el del domicilio social del Proveedor (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
