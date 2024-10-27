import * as ejs from 'ejs';

// console.log(ejs);
let people: string[] = ['geddy', 'neil', 'alex'];
ejs.render('<%= people.join(", "); %>', { people }, { async: true }).then((html) => {
  console.log(html);
});

console.log('Hello World');

