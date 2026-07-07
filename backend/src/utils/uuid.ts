import crypto from "crypto";

export function generateUniqueOtp(length:number): string {
  const digits =
    "0123456789";
  let uniqueOtp = "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    uniqueOtp += digits[array[i]! % digits.length];
  }
  return uniqueOtp;  
}


export function generateUniqueToken(length:number): string {
  const digits =
    "ABCDEFGHIJKlmnopqrstuvwxyz0123456789";
  let uniqueToken = "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    uniqueToken += digits[array[i]! % digits.length];
  }
  return uniqueToken;  
}