export function formatDate(date = new Date(), dateType = 'Seireki') {
  // ImperialEras / Wareki
  // Gregorian / Seireki

  dateType = dateType.replace(/\-|\s/, '').trim().toLowerCase();
  let dateStr = '';
  switch (dateType) {
    case 'wareki':
    case 'imperialeras':
    case 'ja':
      dateStr = date.toLocaleString('ja-JP-u-ca-japanese', {
        era: "long", year: "numeric", month: "long", day: "numeric",
      });
      break;
    case 'seireki':
    case 'gregorian':
    default:
      dateStr = date.toLocaleDateString('ja-JP', {
        year: "numeric", month: "long", day: "numeric",
      });
      break;
  }

  return dateStr;
}

export function parseDate(dateStr = '') {
  dateStr = dateStr.replace(/年|月/g, '-').replace(/日/g, '').trim();
  let matches = dateStr.match(/(明治|大正|昭和|平成|令和)([元0-9０-９]+)-/);
  if (!matches) {
    let date = new Date(zen2han(dateStr));
    if (date.toString() !== 'Invalid Date') {
      return date;
    }
    return null;
  } else {
    const eraName = matches[1];
    let year = parseInt(matches[2].replace(/[元０-９]/g, match => {
      if (match === '元') { return '1' }
      return String.fromCharCode(match.charCodeAt(0) - 65248);
    }));

    switch (eraName) {
      case '明治':
        year += 1867;
        break;
      case '大正':
        year += 1911;
        break;
      case '昭和':
        year += 1925;
        break;
      case '平成':
        year += 1988;
        break;
      case '令和':
        year += 2018;
        break;
      default:
        return null;
    }

    matches = dateStr.match(/-([0-9０-９]+)-/); // 月
    let month = 0;
    if (matches) {
      month = parseInt(zen2han(matches[1]));
    }

    matches = dateStr.match(/-([0-9０-９]+)$/); // 日
    let day = 0;
    if (matches) {
      day = parseInt(zen2han(matches[1]));
    }

    return new Date([year, month, day].filter(val => val).join('-'));
  }
}

export function calcAge(birthday: Date, timeNow = new Date()) {
  const birthdayThisYear = new Date(timeNow.getFullYear(), birthday.getMonth(), birthday.getDate());
  let age = timeNow.getFullYear() - birthday.getFullYear();
  if (timeNow < birthdayThisYear) {
    age--;
  }

  return age;
}

export function han2zen(str: string) {
  return str.replace(/[a-zA-Z0-9]/g, match => String.fromCharCode(match.charCodeAt(0) + 65248));
}

export function zen2han(str: string) {
  return str.replace(/[ａ-ｚＡ-Ｚ０-９]/g, match => String.fromCharCode(match.charCodeAt(0) - 65248));
}

export function toHiragana(str = '') {
  return str.replace(/[\u30a1-\u30f6]/g, match => String.fromCharCode(match.charCodeAt(0) - 0x60));
}

export function toKatakana(str = '') {
  return str.replace(/[\u3041-\u3096]/g, match => String.fromCharCode(match.charCodeAt(0) + 0x60));
}
