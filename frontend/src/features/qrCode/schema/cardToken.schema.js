import { z } from "zod";

/*
  Valida SOLO la forma del token ("userId.version.firma"), non la sua autenticità:
  la firma HMAC è verificabile solo lato server (richiede CARD_SECRET). Questo schema
  serve a scartare subito scansioni palesemente non pertinenti (es. barcode di un libro,
  QR di un'altra app) senza sprecare una chiamata di rete.
*/

export const CardTokenSchema = z
    .string()
    .regex(/^\d+\.\d+\.[A-Za-z0-9_-]+$/, "Codice non riconosciuto come tessera");