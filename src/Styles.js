import { css } from 'lit-element';

export default css`
:host {
  display: block;
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content > * {
  margin: 0;
}

[hidden] {
  display: none !important;
}

.panel-warning {
  width: 16px;
  height: 16px;
  margin-left: 4px;
  color: var(--error-color, #FF7043);
}

.invalid-info {
  color: var(--error-color);
  margin-left: 12px;
}

paper-spinner {
  margin-right: 8px;
}

.action-bar {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 8px;
}

.url-editor {
  display: flex;
  flex-direction: row;
  align-items: center;
}

api-url-editor {
  flex: 1;
}

.send-button {
  white-space: nowrap;
}

.section-title {
  margin: 0.83em 8px;
  letter-spacing: 0.1rem;
  font-size: 20px;
  font-weight: 200;
}

.editor-section {
  margin: 8px 0;
}

api-body-editor,
api-headers-editor,
api-url-params-editor,
authorization-panel {
  margin: 0;
  padding: 0;
}

:host([compatibility]) .section-title {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: initial;
}

:host([narrow]) .content {
  display: flex;
  flex-direction: columns;
}

:host([narrow]) api-url-editor {
  width: auto;
}
`;