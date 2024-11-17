import * as resume from './render';

interface eventData {
  eventName: string;
  pdfUrl?: string;
  fileName?: string;
}

export class ResumeGenerator {
  tempPath: string;
  temp: string;
  renderArea: HTMLIFrameElement;
  params: resume.resumeParams;
  photoInput: HTMLInputElement;
  photoBlobUrl: string;
  htmlBlobUrl: string;
  pdfBlobUrl: string;

  constructor(tempPath: string, photoInput?: HTMLElement) {
    this.tempPath = tempPath;
    if (photoInput) this.photoInput = photoInput as HTMLInputElement;
  }

  createIframe(debug = false) {
    const iframe = document.createElement('iframe');
    iframe.src = '/';
    iframe.style.width = '10px';
    iframe.style.height = '10px';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.opacity = '0';
    iframe.style.zIndex = '-10000';

    if (debug) {
      iframe.style.border = '1px solid red';
      iframe.style.width = '350px';
      iframe.style.height = '200px';
      iframe.style.opacity = '.8';
      iframe.style.zIndex = '10000';
    }

    this.renderArea = iframe;
  }

  async init(debug = false) {
    this.temp = await resume.load(this.tempPath);
    if (!this.renderArea) {
      this.createIframe(debug);
    }
    document.body.appendChild(this.renderArea);
  }

  async updatePhotoBlob(photo: HTMLInputElement = this.photoInput) {
    this.clearPhotoBlobUrls();
    if (!(photo.files && photo.files.length)) return;

    const file = photo.files[0];
    const blob = new Blob([file], { type: file.type });
    this.photoBlobUrl = URL.createObjectURL(blob);

    return this.photoBlobUrl;
  }

  async render2htmlBlob(yamlStr: string) {
    this.clearHtmlBlobUrls();
    if (!this.temp) await this.init();

    this.params = resume.resumeParams(yamlStr);

    await this.updatePhotoBlob();
    if (this.photoBlobUrl) this.params.yaml.photo = this.photoBlobUrl;

    const html = await resume.render(this.temp, this.params);
    const blob = new Blob([html], { type: 'text/html' });
    this.htmlBlobUrl = URL.createObjectURL(blob);

    return this.htmlBlobUrl;
  }

  async render2iframe(yamlStr: string) {
    const url = await this.render2htmlBlob(yamlStr);

    return new Promise(async (resolve, _reject) => {
      const onReady = (event: MessageEvent) => {
        const eventName = event.data.eventName;
        if (eventName !== 'DOMContentLoaded') return;

        window.removeEventListener('message', onReady);
        resolve(event.data as eventData);
      }

      window.addEventListener('message', onReady);
      this.renderArea.src = url;
    });
  }

  async render2pdf(yamlStr: string) {
    this.clearPdfBlobUrls();
    await this.render2iframe(yamlStr);

    return new Promise((resolve, _reject) => {
      const onPdfUrl = (event: MessageEvent) => {
        const eventName = event.data.eventName;
        const pdfUrl = event.data.pdfUrl;
        if (eventName !== 'pdfUrl') return;

        window.removeEventListener('message', onPdfUrl);
        this.pdfBlobUrl = pdfUrl;
        resolve(event.data as eventData);
      }

      window.addEventListener('message', onPdfUrl);
      this.renderArea.contentWindow?.postMessage({ eventName: 'print' }, '*');
    });
  }

  async preview(yamlStr: string) {
    const url = await this.render2htmlBlob(yamlStr);

    const a = document.createElement('a');
    a.href = url; a.target = '_blank';
    document.body.appendChild(a);
    a.click(); a.remove();

    return url;
  }

  async downloadPdf(yamlStr: string) {
    const { pdfUrl, fileName } = await this.render2pdf(yamlStr) as eventData;
    if (!pdfUrl) return;

    const a = document.createElement('a');
    a.href = pdfUrl; a.download = fileName || 'resume.pdf';
    document.body.appendChild(a);
    a.click(); a.remove();

    return pdfUrl;
  }

  clearHtmlBlobUrls() {
    if (this.htmlBlobUrl) URL.revokeObjectURL(this.htmlBlobUrl);
    this.htmlBlobUrl = '';
  }

  clearPdfBlobUrls() {
    if (this.pdfBlobUrl) URL.revokeObjectURL(this.pdfBlobUrl);
    this.pdfBlobUrl = '';
  }

  clearPhotoBlobUrls() {
    if (this.photoBlobUrl) URL.revokeObjectURL(this.photoBlobUrl);
    this.photoBlobUrl = '';
  }
}
