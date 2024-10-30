import * as resume from './ts/render';


(async () => {
  const yaml = await resume.load('./views/temp.yaml');
  // console.log(yaml);
  const params = resume.resumeParams(yaml);
  console.log(params);

  const temp = await resume.load('./views/resume-A3.ejs');
  // console.log(temp);
  const html = await resume.render(temp, params);
  console.log(html);

  const newPage = window.open('about:blank', '_blank');
  if (newPage) {
    newPage.document.write(html);
  }

  // const iframe = document.createElement('iframe');
  // iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  // document.body.appendChild(iframe);

  // const iframe = document.createElement('iframe');
  // iframe.src = '/'; iframe.style.width = '100%';
  // document.body.appendChild(iframe);
  // if (iframe.contentWindow) {
  //   iframe.contentWindow.document.write(html);
  //   iframe.contentWindow.document.close();
  // }
})();
