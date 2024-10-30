import * as ejs from 'ejs';
import * as YAML from 'js-yaml';
import { parseDate, formatDate, calcAge, toHiragana, toKatakana } from './helpers';

export function resumeParams(yamlStr = '') {
  const yaml: any = YAML.load(yamlStr) || {};

  const conf = yaml.config || {};
  const dateType = conf.date_type || 'Wareki';

  let timeNow = new Date();
  if (yaml.date as string) {
    timeNow = parseDate(yaml.date) || timeNow;
  }

  let dateToday: string = formatDate(timeNow, dateType);
  yaml.date = dateToday;
  let birthday = parseDate(yaml.birth_day || yaml.birthday);
  if (birthday) {
    yaml.age = calcAge(birthday, timeNow);
    yaml.birthday = formatDate(birthday, dateType);
  }

  for (let key of ['name_kana', 'address_kana', 'address_kana2']) {
    if (conf.kana_type.toLowerCase() === 'hiragana') {
      yaml[key] = toHiragana(yaml[key]);
    } else if (conf.kana_type.toLowerCase() === 'katakana') {
      yaml[key] = toKatakana(yaml[key]);
    }
  }

  return { dateToday, yaml, conf, dateType };
}


export async function load(path: string) {
  return (await fetch(path)).text();
}

export async function render(template: string, params: any = {}) {
  const { dateToday = {}, yaml = {}, conf = {} } = params;


  let html = await ejs.render(template, { yaml, conf }, { async: true });

  return html;
}
