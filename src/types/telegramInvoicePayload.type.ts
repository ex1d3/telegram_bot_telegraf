/*
  tg - user telegram id;
  userType - false: не авторизованый, true: авторизованый;
  payloadCode - код payload`а
  deepPayloadCode - параматры кода.
*/
export type TelegramInvoicePayload = {
  tg: string;
  userType: boolean;
  code: string;
  codeParams: string;
}