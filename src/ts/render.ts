import * as ejs from 'ejs';
import * as YAML from 'js-yaml';
import {
  parseDate, formatDate, calcAge,
  toHiragana, toKatakana,
  zen2han, han2zen,
} from './helpers';

export interface listElement {
  year?: string;
  month?: string;
  value?: string;
  align?: 'left' | 'center' | 'right';
}

export interface config {
  alphaNum: 'Zenkaku' | 'Hankaku' | string;
  dateType: 'Seireki' | 'Wareki' | string;
  kanaType: 'Hiragana' | 'Katakana' | string;
}

export interface resumeParams {
  metaData: { dateType: string };
  yaml: any;
  conf: config;
  eduExp: listElement[];
  lics: listElement[];
}

export function resumeParams(yamlStr = '') {
  const yaml: any = YAML.load(yamlStr, { json: true }) || {};

  const confRaw = yaml.config || {};
  const alphaNum: string = confRaw.alpha_num || 'Hankaku';
  const dateType: string = confRaw.date_type || 'Wareki';
  const kanaType: string = confRaw.kana_type || 'Katakana';


  let timeNow = new Date();
  if (yaml.date as string) {
    timeNow = parseDate(yaml.date) || timeNow;
  }
  yaml.date = formatDate(timeNow, dateType);

  // let dateToday: string = formatDate(timeNow, dateType);
  // yaml.date = dateToday;
  let birthday = parseDate(yaml.birth_day || yaml.birthday);
  if (birthday) {
    yaml.age = calcAge(birthday, timeNow).toString();
    yaml.birthday = formatDate(birthday, dateType);
  }

  for (let key of ['name_kana', 'address_kana', 'address2_kana']) {
    if (kanaType?.toLowerCase() === 'hiragana') {
      yaml[key] = toHiragana(yaml[key]);
    } else if (kanaType?.toLowerCase() === 'katakana') {
      yaml[key] = toKatakana(yaml[key]);
    }
  }

  let eduExp: listElement[] = [];
  const edus: listElement[] = yaml.education || [];
  const exps: listElement[] = yaml.experience || [];

  if (edus.length > 0) {
    eduExp.push({ value: '学歴', align: 'center' });
    for (const edu of edus) {
      eduExp.push(formatListElement(edu as listElement, dateType, alphaNum));
    }
  }

  if (exps.length > 0) {
    if (eduExp.length > 0) eduExp.push({ value: '' }); // 空白行を追加
    if (eduExp.length === 14) eduExp.push({ value: '' }); // 1ページ目が満タン、'職歴'を新しいページに

    eduExp.push({ value: '職歴', align: 'center' });
    for (const exp of exps) {
      eduExp.push(formatListElement(exp as listElement, dateType, alphaNum));
    }
  }
  if (eduExp.length > 0) eduExp.push({ value: '以上', align: 'right' }); // 最終行に'以上'を追加
  // ブランク行を追加
  if (eduExp.length < 30) {
    eduExp = eduExp.concat(new Array(30 - eduExp.length).fill({}));
  }

  let lics: listElement[] = yaml.licenses || yaml.licences || [];
  for (let i = 0; i < lics.length; i++) {
    lics[i] = formatListElement(lics[i] as listElement, dateType, alphaNum);
  }
  // ブランク行を追加
  if (lics.length < 10) {
    lics = lics.concat(new Array(10 - lics.length).fill({}));
  }

  for (let key in yaml) {
    if (typeof yaml[key] !== 'string') { continue; }
    const skipKeys = ['photo', 'image', 'email']
    if (skipKeys.includes(key)) { continue; }

    if (alphaNum?.toLowerCase() === 'zenkaku') {
      yaml[key] = han2zen(yaml[key]);
    } else if (alphaNum?.toLowerCase() === 'hankaku') {
      yaml[key] = zen2han(yaml[key]);
    }
  }

  // 改行を<br>に変換
  for (const key of ['motivation', 'request']) {
    if (!yaml[key]) { continue; }
    yaml[key] = yaml[key].toString().replace(/\r\n|\r|\n/g, '<br>');
  }

  const metaData = { dateType };
  const conf: config = { alphaNum, dateType, kanaType };

  return { metaData, yaml, conf, eduExp, lics };
}


function formatListElement(element: listElement, dateType?: string, alphaNum?: string): listElement {
  let { year, month, value, align = 'left' } = element;
  if (year && month) {
    let str = `${year.toString().replace('年', '')}-${month.toString().replace('月', '')}`;
    let yearMonthDate = parseDate(str);
    if (yearMonthDate) {
      let matches = formatDate(yearMonthDate, dateType).match(/^(.+?)年(.+?)月/);
      if (matches) {
        year = matches[1];
        month = matches[2];
      }
    }
  }

  if (alphaNum?.toLowerCase() === 'zenkaku') {
    year = han2zen(year || '');
    month = han2zen(month || '');
    value = han2zen(value || '');
  } else if (alphaNum?.toLowerCase() === 'hankaku') {
    year = zen2han(year || '');
    month = zen2han(month || '');
    value = zen2han(value || '');
  }

  return { year, month, value, align };
}

export async function load(path: string) {
  return (await fetch(path)).text();
}

export async function render(template: string, params: any = {}) {
  const { yaml = {}, conf = {}, eduExp = [], lics = [] } = params;


  let html = await ejs.render(template, { yaml, conf, eduExp, lics }, { async: true });

  return html;
}
