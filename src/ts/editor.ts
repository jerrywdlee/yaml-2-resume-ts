import CodeMirror from 'codemirror';

export function initEditor(textArea: HTMLTextAreaElement) {

  const options = {
    lineNumbers: true,
    mode: 'yaml',
    theme: 'elegant',
    viewportMargin: Infinity,
    lineWrapping: true,
    indentUnit: 2,
    tabSize: 2,
    // styleActiveLine: { nonEmpty: true },
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
  };

  const yamlEditor = CodeMirror.fromTextArea(textArea, options as CodeMirror.EditorConfiguration);
  yamlEditor.setSize('100%', '100%');

  yamlEditor.setOption('extraKeys', {
    Tab: cm => {
      const spaces = Array((cm.getOption('indentUnit') || 2) + 1).join(" ");
      cm.replaceSelection(spaces);
    }
  });

  yamlEditor.on('change', () => { yamlEditor.save() });
  yamlEditor.on('focus', () => { yamlEditor.setOption('styleActiveLine' as any, { nonEmpty: true }) });
  yamlEditor.on('blur', () => { yamlEditor.setOption('styleActiveLine' as any, false) });

  return yamlEditor;
}
