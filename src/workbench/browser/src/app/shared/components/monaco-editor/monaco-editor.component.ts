import { Component, Input, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { whatTextType } from '../../../utils';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import { JoinedEditorOptions } from 'ng-zorro-antd/code-editor';

type EventType = 'format' | 'copy' | 'search' | 'replace' | 'type' | 'download' | 'newTab';

const eventHash = new Map()
  .set('format', {
    label: $localize`Format`,
    icon: 'magic',
  })
  .set('copy', {
    label: $localize`:@@Copy:Copy`,
    icon: 'copy',
  })
  .set('search', {
    label: $localize`:@@Search:Search`,
    icon: 'search',
  })
  .set('replace', {
    label: $localize`Replace`,
    icon: 'file-text-one',
  });

@Component({
  selector: 'eo-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss'],
})
export class EoMonacoEditorComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @Input() eventList: EventType[] = [];
  @Input() hiddenList: string[] = [];
  @Input() set code(val) {
    if (val === this.$$code) {
      return;
    }
    try {
      this.$$code = JSON.stringify(val);
    } catch {
      this.$$code = String(val);
    }
  }
  /** Scroll bars appear over 20 lines */
  @Input() maxLine = 200;
  @Input() config: JoinedEditorOptions = {};
  @Input() editorType = 'json';
  @Input() autoFormat = false;
  @Input() disabled = false;
  @Input() completions = [];
  @Output() codeChange = new EventEmitter<string>();
  $$code = '';
  codeEdtor: editor.IStandaloneCodeEditor;
  isReadOnly = false;
  completionItemProvider: monaco.IDisposable;
  buttonList: any[] = [];
  typeList = [
    {
      value: 'json',
      label: 'JSON',
    },
    {
      value: 'xml',
      label: 'XML',
    },
    {
      value: 'html',
      label: 'HTML',
    },
    {
      value: 'text',
      label: 'Text',
    },
  ];
  defaultConfig: JoinedEditorOptions = {
    language: this.editorType || 'json',
    // automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    wrappingStrategy: 'advanced',
    minimap: {
      enabled: false,
    },
    overviewRulerLanes: 0,
    quickSuggestions: { other: true, strings: true },
  };
  /** monaco config */
  get editorOption(): JoinedEditorOptions {
    return { ...this.defaultConfig, ...this.config };
  }

  isNaN(val) {
    return Number.isNaN(Number(val));
  }

  constructor(private message: EoMessageService, private electron: ElectronService) {}

  ngAfterViewInit(): void {
    console.log('codeEdtor', this.codeEdtor);
    requestIdleCallback(() => this.rerenderEditor());
  }
  ngOnChanges() {
    // * update root type
    if (this.eventList.includes('type') && !this.hiddenList.includes('type')) {
      const type = whatTextType(this.$$code || '');
      this.editorType = type;
      if (this.autoFormat) {
        this.$$code = this.formatCode();
      }
    }
  }
  ngOnInit() {
    // console.log(this.codeEdtor.getSupportedActions());
    // To get the Ace instance:
    this.buttonList = this.electron.isElectron
      ? this.eventList
          .filter((it) => !['newTab', 'type'].includes(it))
          .map((it) => ({
            event: it,
            ...eventHash.get(it),
          }))
      : this.eventList
          .filter((it) => it !== 'type')
          .map((it) => ({
            event: it,
            ...eventHash.get(it),
          }));
  }

  ngOnDestroy(): void {
    this.codeEdtor?.dispose();
    this.completionItemProvider?.dispose();
  }

  private initMonacoEditorEvent() {
    console.log('initMonacoEditorEvent');

    this.completionItemProvider = window.monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        // find out if we are completing a property in the 'dependencies' object.
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: this.completions.map((n) => ({ ...n, range })),
        } as any;
      },
    });

    this.codeEdtor.onDidChangeModelDecorations(() => {
      updateEditorHeight(); // typing
      requestAnimationFrame(updateEditorHeight); // folding
    });

    this.codeEdtor.onDidChangeModelContent((e) => {
      this.codeChange.emit(this.codeEdtor.getValue());
    });

    this.codeEdtor.onDidBlurEditorText((e) => {
      this.codeChange.emit(this.codeEdtor.getValue());
    });

    let prevHeight = 0;

    const updateEditorHeight = () => {
      const editorElement = this.codeEdtor.getDomNode();

      if (!editorElement) {
        return;
      }

      const lineHeight = this.codeEdtor.getOption(editor.EditorOption.lineHeight);
      const lineCount = this.codeEdtor.getModel()?.getLineCount() || 1;
      const height = this.codeEdtor.getTopForLineNumber(Math.min(lineCount, this.maxLine)) + lineHeight;

      if (prevHeight !== height) {
        prevHeight = height;
        editorElement.style.height = `${height}px`;
        this.codeEdtor.layout();
      }
    };
  }
  log(event, txt) {
    console.log('ace event', event, txt);
  }
  handleBlur() {
    this.codeChange.emit(this.$$code);
  }
  handleChange() {
    this.codeChange.emit(this.$$code);
  }
  rerenderEditor() {
    this.codeEdtor?.layout?.();
  }
  formatCode() {
    this.codeEdtor.getAction('editor.action.formatDocument').run();
    return this.codeEdtor.getValue();
  }
  handleAction(event: EventType) {
    switch (event) {
      case 'format': {
        // * format code
        // const value = session.getValue();
        // const code = this.formatCode();
        // session.setValue(code);
        this.formatCode(); //自动格式化代码
        break;
      }
      case 'copy': {
        // * copy content
        const value = this.codeEdtor.getValue();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(value);
          this.message.success($localize`Copied`);
          return;
        }
        break;
      }
      case 'search': {
        // * search content
        this.codeEdtor.getAction('actions.find').run();
        break;
      }
      case 'replace': {
        this.codeEdtor.getAction('editor.action.startFindReplaceAction').run();
        break;
      }
      case 'newTab':
        {
          const tmpNewWin = window.open();
          const value = this.codeEdtor.getValue();
          const code = this.formatCode();
          tmpNewWin.document.open();
          tmpNewWin.document.write(code);
          tmpNewWin.document.close();
        }
        break;
      case 'download':
        {
          const value = this.codeEdtor.getValue();
          const code = this.formatCode();
          const a = document.createElement('a');
          const blob = new Blob([code]);
          const url = window.URL.createObjectURL(blob);
          const filename = `download.${this.editorType}`;
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
        break;
    }
  }

  handleInsert(code) {
    const p = this.codeEdtor.getPosition();
    this.codeEdtor.executeEdits('', [
      {
        range: new monaco.Range(p.lineNumber, p.column, p.lineNumber, p.column),
        text: code,
      },
    ]);
    this.codeEdtor.focus();
    // this.codeEdtor.trigger('keyboard', 'type', { text: code });
  }

  onEditorInitialized(codeEdtor) {
    this.codeEdtor = codeEdtor;
    this.initMonacoEditorEvent();
  }
}
