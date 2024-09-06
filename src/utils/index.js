import BigNumber from "bignumber.js";

export function formatAddress(address, prefix = 4) {
  return address.slice(0, prefix + 2) + "..." + address.slice(-prefix);
}
export function formatID(id) {
  if((id?.length ?? 0) > 5){
    return id.slice(0, 3) + "..." + id.slice(-2);
  }
  return id.toString().padStart(4, '0');
}
export function getImage(src){
  if(src?.startsWith("http") || src == "/default.png"){
    return src;
  }
  if(src?.startsWith("ipfs")){
    return `https://ipfs.io/ipfs/${src?.split('//')[1]}`;
  }
}
export function isNumeric(num) {
  return !isNaN(num) && !isNaN(parseFloat(num));
}
export function numberWithCommas(x, fractionDigits) {
  const [naturalPart, decimalPart] = x.toString().split(".");
  let out = naturalPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decimalPart) {
    if (!isNumeric(fractionDigits)) out += "." + decimalPart;
    else if (decimalPart.length >= fractionDigits) out += "." + decimalPart.substr(0, fractionDigits);
    else out += "." + decimalPart + "0".repeat(fractionDigits - decimalPart.length);
  }
  return out;
}
export function formatPrice(price) {
  if (price < 1e6) return numberWithCommas(Number(price.toFixed(4)));
  if (price < 1e15) {
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixNum = Math.floor((("" + parseInt(price)).length - 1) / 3);
    let shortValue = parseFloat((price / Math.pow(1000, suffixNum)).toFixed(1));
    return shortValue + suffixes[suffixNum];
  }
  return BigNumber(price).toExponential(1);
}
export async function sleep(time = 2000) {
  await new Promise(r => setTimeout(r, time));
}
export function convertSecondsToTime(secondsInput) {
  let minutes = Math.floor(secondsInput / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  minutes = minutes % 60;
  hours = hours % 24;
  return `${days}D ${hours}H  ${minutes}M`;
}

export const getTypeOf = value => Object.prototype.toString.call(value).slice(8, -1);

export const AuctionType = {
  English: 0,
  Vickrey: 1,
  Dutch: 2, 
  Seal1: 3,
  Seal2: 4
}

export const getAuctionNameFromType = (auctionType) => {
  switch(auctionType.toString()) {
    case "0":
      return "English au";
    case "1":
      return "Vickrey au";
    case "2":
      return "Dutch au";
    case "3":
      return "Sealed v1 au";
    case "4":
      return "Sealed v2 au";
    default: 
      return "";
  }
}

export const getAuctionShortNameFromType = (auctionType) => {
  switch(auctionType.toString()) {
    case "0":
      return "EA";
    case "1":
      return "VA";
    case "2":
      return "DA";
    case "3":
      return "SA1";
    case "4":
      return "SA2";
    default: 
      return "";
  }
}

export const getOnlyAuctionNameFromType = (auctionType) => {
  switch(auctionType.toString()) {
    case "0":
      return "English";
    case "1":
      return "Vickrey";
    case "2":
      return "Dutch";
    case "3":
      return "Sealed v1";
    case "4":
      return "Sealed v2";
    default: 
      return "";
  }
}
export function canConvertToBigInt(str) {
  try {
    BigInt(str);
    return true;
  } catch (error) {
    return false;
  }
}
export function calculateRelativeTime(targetTime) {
  const currentTime = new Date().getTime();
  const timeDifference = targetTime - currentTime;

  const millisecondsPerMinute = 60 * 1000;
  const millisecondsPerHour = millisecondsPerMinute * 60;
  const millisecondsPerDay = millisecondsPerHour * 24;

  let remainingTime = Math.abs(timeDifference);

  const days = Math.floor(remainingTime / millisecondsPerDay);
  remainingTime %= millisecondsPerDay;

  const hours = Math.floor(remainingTime / millisecondsPerHour);
  remainingTime %= millisecondsPerHour;

  const minutes = Math.floor(remainingTime / millisecondsPerMinute);

  return `${days}D ${hours}H ${minutes}M ago`;
}

export const isValidParams = (param) => {
  if(param == null) return true;
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(param);
}

export const allSameValue = (array, fieldName) => {
  if (array.length === 0) return true;
  const firstValue = array[0][fieldName];
  return array.every(element => (element.contract_type == "ERC1155" || parseInt(element.amount) > 1) && element[fieldName] === firstValue);
};