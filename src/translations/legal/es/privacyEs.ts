import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const PRIVACY_ES: LegalDocument = {
  title: "Política de privacidad",
  asOf: "Actualizado el 31 de octubre de 2026",
  basis: "Información conforme a los artículos 13 y 14 del Reglamento General de Protección de Datos (RGPD).",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Responsable del tratamiento",
      paragraphs: [
        `${operatorAddress()}. E-Mail ${LEGAL_OPERATOR.email}, Teléfono ${LEGAL_OPERATOR.phone}. No hemos designado un delegado de protección de datos porque no existe obligación legal de hacerlo.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Acceso al sitio web",
      paragraphs: [
        "Al acceder a cada página, el servidor procesa los datos técnicamente necesarios: dirección IP, fecha y hora, URL solicitada, identificador del navegador y código de respuesta del servidor. La base jurídica es el art. 6 apdo. 1 letra f del RGPD (interés legítimo en un funcionamiento seguro y sin fallos).",
        `La propia aplicación no guarda registros de acceso. En el proveedor de alojamiento pueden generarse registros técnicos: ${filled(LEGAL_OPERATOR.hosting, "Indicar proveedor de alojamiento, ubicación del servidor y plazo de conservación")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Cuenta e inicio de sesión",
      paragraphs: [
        "Para cada cuenta almacenamos: dirección de correo electrónico, un hash criptográfico de la contraseña (scrypt, nunca en texto plano), mercado e idioma seleccionados, fecha de confirmación del correo, fin del periodo de prueba, tarifa contratada y su duración, así como la fecha del último acceso. La base jurídica es el art. 6 apdo. 1 letra b del RGPD (ejecución del contrato).",
        "Por cada sesión guardamos un hash del navegador, una dirección IP truncada y la fecha de caducidad para detectar cookies de sesión robadas y cerrar la sesión en todos los dispositivos (art. 6 apdo. 1 letra f del RGPD).",
        "En el registro y el inicio de sesión, el navegador calcula un identificador técnico del dispositivo (tarjeta gráfica, pantalla, núcleos de CPU, zona horaria) y lo guarda en el almacenamiento local (\"ec_hw_id\") con el único fin de reconocer dispositivos bloqueados y proteger las cuentas frente a ataques automatizados (§ 25 apdo. 2 n.º 2 TDDDG, art. 6 apdo. 1 letra f del RGPD).",
        "Comprobamos las contraseñas nuevas frente a filtraciones conocidas (Have I Been Pwned) transmitiendo únicamente los cinco primeros caracteres de un hash SHA-1 (k-anonimato, art. 6 apdo. 1 letra f del RGPD).",
        "Para evitar abusos, contabilizamos las solicitudes por dirección IP y correo electrónico durante breves intervalos de tiempo.",
      ],
    },
    {
      id: "app",
      heading: "4. Contenidos que usted guarda en su cuenta",
      paragraphs: [
        "La lista de seguimiento con notas y las búsquedas guardadas (alertas) se almacenan en nuestra base de datos. Las tasaciones subidas se analizan; se guarda el resultado del análisis (nombre de archivo, fragmentos con número de página), pero no el archivo PDF. Base jurídica: art. 6 apdo. 1 letra b del RGPD.",
        "Si está activado el análisis avanzado de tasaciones, el texto del informe se transmite a nuestro encargado del tratamiento de IA (cláusulas contractuales tipo de la UE conforme al art. 46 apdo. 2 letra c del RGPD).",
        "La lista de verificación, los cálculos de puja máxima, sus notas de valoración, los comparables y el dossier bancario se guardan únicamente en su navegador (almacenamiento local \"belowmark:…\") y nunca llegan a nuestro servidor.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Contratación y pago",
      paragraphs: [
        "Al realizar un pedido guardamos la orden: tarifa, precio, mercado, versión de las condiciones generales, momento de su consentimiento para el inicio inmediato del servicio y estado del pago (art. 6 apdo. 1 letras b y c del RGPD).",
        "El pago se realiza en la página de pago de Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublín 2, Irlanda. Usted introduce los datos de pago directamente en Stripe y nunca llegan a nosotros. De Stripe recibimos el número de cliente, el estado del pago y la factura (política de privacidad de Stripe: stripe.com/es/privacy).",
        "La página de pago de Stripe se encuentra en un dominio de Stripe. En belowmark.com no cargamos scripts externos de Stripe.",
        "Conservamos las facturas y justificantes contables durante los plazos exigidos por la legislación mercantil y tributaria (§ 147 AO, § 257 HGB).",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Cancelación y desistimiento",
      paragraphs: [
        "Las declaraciones enviadas mediante \"Cancelar contratos aquí\" y \"Desistir del contrato\" se almacenan con nombre, correo electrónico, referencia del contrato, contenido y fecha y hora de recepción, enviándose un acuse de recibo por correo electrónico. Se conservan durante tres años desde el final del año de recepción (art. 6 apdo. 1 letras c y f del RGPD).",
      ],
    },
    {
      id: "mail",
      heading: "7. Correos electrónicos",
      paragraphs: [
        `Solo enviamos correos electrónicos necesarios para el contrato: enlaces de confirmación, enlaces de contraseña, confirmaciones de pedido y cancelación, así como las alertas que usted mismo haya creado. Sin publicidad, sin boletines y sin seguimiento de aperturas o clics. Envío a través de ${filled(LEGAL_OPERATOR.mailProvider, "Indicar proveedor SMTP")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Cookies y almacenamiento local",
      paragraphs: [
        "No utilizamos cookies de análisis, publicidad ni seguimiento, ni integramos servicios de terceros con ese fin. Por ello no se muestra ningún banner de consentimiento.",
        "Cookie de sesión (\"__Host-bm_session\"): mantiene iniciada la sesión; estrictamente necesaria para el servicio solicitado (§ 25 apdo. 2 n.º 2 TDDDG). Caduca al cerrar el navegador o a los 30 días si marca \"Mantener la sesión iniciada\".",
        "\"BELOWMARK_COUNTRY\" y \"BELOWMARK_MARKET\" (un año cada una): recuerdan el país y el mercado elegidos para mostrar el idioma y los precios correspondientes.",
        "Las fuentes tipográficas se cargan desde nuestro propio servidor, no desde Google.",
      ],
    },
    {
      id: "karten",
      heading: "9. Mapas e imágenes aéreas",
      paragraphs: [
        "En la ficha de un inmueble, su navegador carga teselas de mapa directamente de basemap.de, OpenStreetMap e imágenes aéreas de Esri (server.arcgisonline.com). Estos proveedores reciben su dirección IP y la coordenada de la tesela (art. 6 apdo. 1 letra f del RGPD).",
        "Los enlaces a Google Maps, portales judiciales y portales de anuncios solo abren páginas externas cuando usted hace clic en ellos.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Plazo de conservación y supresión",
      paragraphs: [
        "Conservamos los datos de la cuenta hasta que usted la elimine. En su cuenta, dentro de \"Sus datos\", puede descargar toda la información almacenada en formato JSON y eliminar la cuenta usted mismo. Los pedidos y declaraciones se conservan sin vinculación personal únicamente durante los plazos legales de retención fiscal.",
        "Los enlaces de un solo uso (confirmación de correo, restablecimiento de contraseña) se eliminan al utilizarlos y caducan a las 24 horas o a la hora, respectivamente.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Sus derechos",
      paragraphs: [
        "Tiene derecho de acceso (art. 15), rectificación (art. 16), supresión (art. 17), limitación del tratamiento (art. 18), portabilidad de los datos (art. 20) y oposición (art. 21 del RGPD). Puede dirigirse a la dirección indicada más arriba o ejecutar la exportación y eliminación directamente desde su cuenta.",
        `Puede presentar una reclamación ante una autoridad de control de protección de datos, en particular ante la competente para nuestra sede: ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "No se toman decisiones individuales automatizadas ni se elaboran perfiles en el sentido del art. 22 del RGPD.",
      ],
    },
  ],
};
