import { load } from './ts/render';
import { initEditor } from './ts/editor';
import { ResumeGenerator } from './ts/generator';

import v from './ts/version.json';

const verArea = document.querySelector('#version') as HTMLElement;
if (verArea) {
  verArea.textContent = `v${v.version}`;
}

(async () => {
  const yaml = await load('./views/temp.yaml');
  // console.log(yaml);
  // const temp = await resume.load('./views/resume-A3.ejs');
  // console.log(temp);

  const input = document.querySelector('input#photoInput') as HTMLInputElement;
  const generator = new ResumeGenerator('./views/resume-A3.ejs', input);
  await generator.init();
  window['generator'] = generator;

  input.addEventListener('change', async () => {
    const photoBlobUrl = await generator.updatePhotoBlob(input);
    console.log('photoBlobUrl:', photoBlobUrl);
  });

  // console.log('version:', v.version);

  // const iframe = document.createElement('iframe');
  // iframe.src = '/';
  // iframe.style.width = '10px';
  // iframe.style.height = '10px';
  // iframe.style.opacity = '0';
  // document.body.appendChild(iframe);

  const textArea = document.querySelector('#yaml') as HTMLTextAreaElement;
  if (textArea) {
    textArea.value = yaml;

    const yamlEditor = initEditor(textArea);
    window['yamlEditor'] = yamlEditor;

    // window['yamlEditor'] = yamlEditor;
    // window['editorSave'] = () => {
    //   window['yamlEditor']?.save();
    //   return true;
    // };
  }

  const preview = document.querySelector('button#preview') as HTMLButtonElement;
  const download = document.querySelector('button#download') as HTMLButtonElement;

  preview.addEventListener('click', async () => {
    const yaml = textArea.value;
    // const params = resume.resumeParams(yaml);
    // console.log(params);
    // const html = await resume.render(temp, params);

    // let blob = new Blob([html], { type: 'text/html' });
    // let url = URL.createObjectURL(blob);
    // // let url = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    // let a = document.createElement('a');
    // a.href = url; a.target = '_blank';
    // document.body.appendChild(a);
    // a.click();
    const url = generator.preview(yaml);
    console.log('htmlUrl:', url);
  });

  download.addEventListener('click', async () => {
    const yaml = textArea.value;
    // const params = resume.resumeParams(yaml);
    // console.log(params);
    // const html = await resume.render(temp, params);
    // // iframe.contentWindow?.document.write(html); // Bug: violates the following Content Security Policy directive: "default-src 'none'"
    // // iframe.contentWindow?.document.close();
    // // iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    // let blob = new Blob([html], { type: 'text/html' });
    // let url = URL.createObjectURL(blob);
    // iframe.src = url;

    const pdfUrl = await generator.downloadPdf(yaml);
    console.log('pdfUrl:', pdfUrl);
  });

  // window.addEventListener('message', function (e) {
  //   if (!e.data.eventName) return;

  //   if (e.data.eventName === 'DOMContentLoaded') {
  //     iframe.contentWindow?.postMessage({ eventName: 'print' }, '*');
  //   }

  //   if (e.data.pdfUrl) {
  //     let fileName = e.data.fileName || 'resume.pdf';
  //     let a = document.createElement('a');
  //     a.href = e.data.pdfUrl;
  //     // a.target = '_blank';
  //     a.download = fileName;
  //     document.body.appendChild(a);
  //     a.click();
  //     console.log('pdfUrl:', a);
  //     a.remove();
  //   }
  //   console.log(e);
  // });


  // console.log(html);

  // const newPage = window.open('about:blank', '_blank');
  // if (newPage) {
  //   newPage.document.write(html);
  //   newPage.document.close();
  // }

  // const iframe = document.createElement('iframe');
  // iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  // document.body.appendChild(iframe);

  // if (iframe.contentWindow) {
  //   iframe.contentWindow.document.write(html);
  //   iframe.contentWindow.document.close();

  //   let iDoc = iframe.contentWindow.document;
  //   setTimeout(function () {
  //     if (iDoc.querySelector('#pdfUrl')) {
  //       console.log(iDoc.querySelector('#pdfUrl'));
  //       // const pdfUrl = iDoc.querySelector('#pdfUrl')?.getAttribute('href');

  //       // if (pdfUrl) {
  //       //   let a = document.createElement('a');
  //       //   a.href = pdfUrl;
  //       //   a.target = '_blank';
  //       //   // a.download = 'resume.pdf';
  //       //   document.body.appendChild(a);
  //       //   a.click();
  //       // }
  //     }
  //   }, 2000);
  // }

})();
