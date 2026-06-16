/**
 * PromptPay QR Code Payload Generator (EMVCo Specification)
 * 
 * Supports both:
 * 1. Mobile Phone numbers (10 digits, e.g. 0897654321)
 * 2. National ID / Tax ID cards (13 digits, e.g. 1100401206065)
 */

/**
 * Calculates the standard CRC16-CCITT checksum (Polynomial: 0x1021, Initial: 0xFFFF)
 * as required by EMVCo Specifications.
 */
export function calculateCRC16(data: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xFF;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generates the raw EMVCo payload string for PromptPay.
 * 
 * @param target The PromptPay target account (e.g. "0897654321" or "1100401206065")
 * @param amount Optional payment amount. If specified or > 0, it locks the amount.
 */
export function generatePromptPayPayload(target: string, amount?: number): string {
  const sanitizedTarget = target.replace(/\D/g, '');
  
  // Tag 00: Payload Format Indicator (Fixed constant "01")
  let payload = "000201";
  
  // Tag 01: Point of Initiation Method
  // "11" for static (user inputs amount), "12" for dynamic (with amount locked)
  const isDynamic = amount !== undefined && amount > 0;
  payload += isDynamic ? "010212" : "010211";
  
  // Tag 29: Merchant Account Information (PromptPay AID)
  // AID standard value is "A000000677010111"
  const aid = "0016A000000677010111";
  
  let targetField = "";
  if (sanitizedTarget.length === 10) {
    // Phone number: Replace leading 0 with 66 and pad with "00". Total length must be 13.
    const formattedPhone = "0066" + sanitizedTarget.slice(1);
    targetField = "0113" + formattedPhone;
  } else if (sanitizedTarget.length === 13) {
    // National ID or Tax ID: standard 13 digits
    targetField = "0213" + sanitizedTarget;
  } else {
    // Unsupported target length, default to phone-style or national-style if possible
    targetField = sanitizedTarget.length > 10 ? "0213" + sanitizedTarget.slice(0, 13) : "0113" + sanitizedTarget;
  }
  
  // Tag 29 contains AID and target field
  const tag29Value = aid + targetField;
  const tag29Length = tag29Value.length.toString().padStart(2, '0');
  payload += "29" + tag29Length + tag29Value;
  
  // Tag 53: Transaction Currency (Fixed "764" for Thai Baht)
  payload += "5303764";
  
  // Tag 54: Transaction Amount
  if (isDynamic && amount) {
    const formattedAmount = amount.toFixed(2);
    const amountLength = formattedAmount.length.toString().padStart(2, '0');
    payload += "54" + amountLength + formattedAmount;
  }
  
  // Tag 58: Country Code (Fixed "TH")
  payload += "5802TH";
  
  // Tag 63: CRC prefix (Value contains characters but is computed with checksum)
  payload += "6304";
  
  // Append checksum
  const crc = calculateCRC16(payload);
  payload += crc;
  
  return payload;
}
