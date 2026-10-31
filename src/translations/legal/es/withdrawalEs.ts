import { operatorAddress, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email}, Teléfono ${LEGAL_OPERATOR.phone}`;

export const WITHDRAWAL_ES: LegalDocument = {
  title: "Información sobre el desistimiento y extinción en contenidos digitales",
  asOf: "Actualizado el 31 de octubre de 2026",
  basis: "Para consumidores en contratos sobre contenidos digitales que no se presten en un soporte material (§§ 312g, 355, 356 apdo. 5 BGB / Art. 103 m TRLGDCU).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Extinción anticipada del derecho de desistimiento (§ 356 apdo. 5 BGB)",
      paragraphs: [
        "El derecho de desistimiento en un contrato para el suministro de contenidos digitales que no se presten en un soporte material (activación del acceso digital completo a valores de tasación, análisis de informes, límites legales de puja, calculadoras de plazos y documentos en Belowmark) se extingue inmediatamente con el inicio de la ejecución del contrato cuando:",
        "1. usted haya consentido expresamente en que comencemos la ejecución del contrato antes de que finalice el plazo de desistimiento,",
        "2. usted haya confirmado que conoce que, al dar su consentimiento, pierde su derecho de desistimiento con el inicio de la ejecución del contrato, y",
        "3. le hayamos proporcionado una confirmación de conformidad con el § 312f apdo. 2 BGB en un soporte duradero (por correo electrónico).",
        "Dado que usted otorga este consentimiento y confirmación durante el proceso de pedido al aceptar los Términos y Condiciones antes de hacer clic en \"Pedir con obligación de pago\" y su acceso completo se activa inmediatamente después de confirmarse el pago, queda excluido el desistimiento conforme al § 356 apdo. 5 BGB una vez activado el acceso digital.",
      ],
    },
    {
      id: "recht",
      heading: "2. Derecho legal de desistimiento (antes del inicio de la ejecución)",
      paragraphs: [
        "En caso de que excepcionalmente aún no haya comenzado la ejecución del contrato (activación del acceso digital), se aplicará el siguiente derecho legal de desistimiento:",
        "Tiene usted derecho a desistir del presente contrato en un plazo de catorce días naturales sin necesidad de justificación. El plazo de desistimiento expirará a los catorce días naturales del día de la celebración del contrato.",
        `Para ejercer el derecho de desistimiento, deberá usted notificarnos (${contact}) su decisión de desistir del contrato a través de una declaración inequívoca (por ejemplo, una carta enviada por correo postal o correo electrónico). Podrá utilizar el modelo de formulario de desistimiento que figura a continuación, aunque su uso no es obligatorio.`,
        "Para cumplir el plazo de desistimiento, basta con que la comunicación relativa al ejercicio por su parte de este derecho sea enviada antes de que venza el plazo correspondiente y antes de la activación del acceso digital.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Consecuencias de un desistimiento válido (antes de la activación)",
      paragraphs: [
        "En caso de desistimiento válido por su parte antes de que el derecho de desistimiento se haya extinguido mediante la activación del acceso digital conforme al § 356 apdo. 5 BGB, le devolveremos todos los pagos recibidos de usted sin ninguna demora indebida y, en todo caso, a más tardar catorce días naturales a partir de la fecha en que se nos informe de su decisión de desistir del presente contrato. Procederemos a efectuar dicho reembolso utilizando el mismo medio de pago empleado por usted para la transacción inicial.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Cancelación de suscripciones en curso",
      paragraphs: [
        "Con independencia de la extinción del derecho de desistimiento por activación inmediata (§ 356 apdo. 5 BGB), puede usted cancelar en cualquier momento una suscripción mensual activa (Investor Mensual o Pro Mensual) con efecto al final del mes de facturación ya abonado — con un clic en su cuenta o mediante \"Cancelar contratos aquí\" en el pie de cada página.",
      ],
    },
    {
      id: "formular",
      heading: "5. Modelo de formulario de desistimiento",
      paragraphs: [
        "(Aplicable únicamente si el derecho de desistimiento no se ha extinguido ya conforme al § 356 apdo. 5 BGB por la activación del acceso digital.)",
        `A la atención de ${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email}:`,
        "Por la presente le comunico/comunicamos (*) que desisto de mi/desistimos de nuestro (*) contrato de suministro de los siguientes contenidos digitales (*):",
        "Pedido el (*):",
        "Nombre del consumidor o de los consumidores:",
        "Domicilio del consumidor o de los consumidores:",
        "Firma del consumidor o de los consumidores (solo si el presente formulario se presenta en papel):",
        "Fecha:",
        "(*) Táchese lo que no proceda.",
      ],
    },
  ],
};
