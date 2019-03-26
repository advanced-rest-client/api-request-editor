import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {afterNextRender} from '../../@polymer/polymer/lib/utils/render-status.js';
import {EventsTargetMixin} from '../../@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import {AmfHelperMixin} from '../../@api-components/amf-helper-mixin/amf-helper-mixin.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@polymer/polymer/lib/elements/dom-if.js';
import '../../@api-components/api-url-data-model/api-url-data-model.js';
import '../../@api-components/api-url-editor/api-url-editor.js';
import '../../@api-components/api-url-params-editor/api-url-params-editor.js';
import '../../@api-components/authorization-panel/authorization-panel.js';
import '../../@api-components/api-headers-editor/api-headers-editor.js';
import '../../@api-components/api-body-editor/api-body-editor.js';
import '../../@api-components/raml-aware/raml-aware.js';
import '../../@polymer/paper-tabs/paper-tabs.js';
import '../../@polymer/paper-tabs/paper-tab.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/iron-pages/iron-pages.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/paper-spinner/paper-spinner.js';
import '../../@polymer/paper-toast/paper-toast.js';
import '../../@api-components/api-form-mixin/api-form-styles.js';
import '../../@advanced-rest-client/uuid-generator/uuid-generator.js';
/**
 * `api-request-editor`
 * A request editor that builds the UI based on
 * [AMF](https://github.com/mulesoft/amf/) model.
 *
 * The fors are generated automatically based on endponit's definition.
 *
 * Set AMF json/ld model to `amfModel` property. It accepts the generated
 * API specification model (first element is a shape of
 * `http://raml.org/vocabularies/document#Document` type).
 *
 * To build request editor view for an endpoint defined in an API, set `selected`
 * property to the id of the operation that is defined in the spec. The
 * element lookup for the definition and applies it to the editors.
 *
 * This element is to replace deprecated `advanced-rest-client/raml-request-editor`.
 *
 * ## Changes in version 2
 *
 * - XHR element is not included in the element. Use
 * `advanced-rest-client/xhr-simple-request` in your application or handle
 * `api-request` custom event to make a request
 * - The element does not include any polyfills
 * - `redirectUrl` is now `redirectUri`
 * - `api-console-request` event is now `api-request` event
 * - `api-console-response` event is now `api-response` event
 * - Added more details to `api-request` custom event (comparing to
 * `api-console-request`)
 * - The user is able to enable/disable query parameters and headers. Set
 * `allow-disable-params` attribute to enable this behavior.
 * - The user is able to add custom query parameters or headers.
 * Set `allow-custom` attribute to enable this behavior.
 * - From authorization panel changes:
 *  - `auth-settings-changed` custom event is stopped from bubbling.
 *  Listen for `authorization-settings-changed` event instead.
 * - From auth-method-oauth2 changes:
 *  - Added `deliveryMethod` and `deliveryName` properties to the
 *  `detail.setting` object.
 * - From auth-method-oauth1 changes:
 *  - Crypto library is no longer included into the element. Use
 *  `advanced-rest-client/cryptojs-lib` component to include the library
 *  if your project doesn't use crypto libraries already.
 *
 * ## api-request event
 *
 * Dispatched when "send" button is pressed by the user and the element passes
 * validation.
 * The application should handle the event and make the connection to remote
 * server using passed parameters. When the response is ready the application
 * must inform the elements about the response by dispatching `api-response`
 * custom event.
 *
 * Note that if you set `eventsTarget` property the event must be dispatched
 * at most on `eventsTarget` node (or any child node).
 *
 * API components has `advanced-rest-client/xhr-simple-request` element to
 * handle `api-request` and `abort-api-request` events and to use XHR to
 * make the connection. Note that it may not always work if the API does not
 * allows CORS.
 *
 * The api-request event has the following properties:
 *
 * - url (`String`) - Endpoint full and final url. Note that if the API does
 * not specify base uri and `baseUri` property is not set then the `url`
 * can be relative url to the resource.
 * - method (`String`) - HTTP method. User cannot change this value, it is
 * encoded in the endpoint description
 * - headers (`String`) - valid HTTP headers string
 * - payload (`String|FormData|File|Blob|undefined`) - Request body
 * - id (`String`) - A unique request identifier. This ID has to be
 *   reported back by `api-response` event. It is generated when `execute()`
 *   function is called.
 * - auth (`Object|undefined`) - Current authorization settings received
 *   from the authorization panel.
 *   In case of basic, oauth 1 and oauth 2 authorizations, the token is
 *   applied to the headers or query parameters so no action is required.
 * - authType (`String|undefined`) - Name of the authorization methods.
 *   One of `advanced-rest-client/auth-methods`.
 * - queryModel (`Array<Object>`) - Query parameters data view model.
 * - pathModel (`Array<Object>`) - URI parameters data view model
 * - headersModel (`Array<Object>`) - Headers data view model
 *
 * Do not change `queryModel`, `pathModel` and `headersModel` as it would
 * make it out of sync with the application and any change won't be
 * reflected in the editor. In future release this may be read only object.
 *
 * ## abort-api-request event
 *
 * The event is dispatched when the user press `abort` button.
 * The transport must send `api-response` custom event with error message
 * so the state of the UI is updated.
 *
 * The event contains the following properties:
 *
 * - url (`String`) The request URL. Can be empty string. Also, it may be
 * different URL that the one used to send the request if the user changed
 * it in between. Use the `id` property to compare requests.
 * - id (`String`)  Generated UUID of the request with `api-request` event.
 *
 * ## api-response event
 *
 * This element does not act on this event. See `api-request-panel`
 * documentation for more information.
 *
 * ## Limitations
 *
 * Editors used in this element usually don't perform operations right after
 * a property change. Body/Headers/Auth editors uses
 * `Polymer.RenderStatus.afterNextRender` method before they start computing
 * properties from model. Then, if DOM change is required then this operation
 * is also async. This causes a delay between selection/AMF model change
 * and reseting the properties. For example authorization state can be passed
 * to this element after at least 2 calls to `requestAnimationFrame()`.
 * Take this into the ccount when using element's API.
 *
 * ## Styling
 *
 * `<api-request-editor>` provides the following custom properties and
 * mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-request-editor` | Mixin applied to this elment | `{}`
 * `--api-request-editor-container` | Mixin applied to the main container | `{}`
 * `--warning-primary-color` | Theme property, warning primary color | `#FF7043`
 * `--arc-font-body1` | Theme mixin, default font definition | `{}`
 * `--error-color` | Theme variable, error color.  | ``
 * `--api-request-editor-editors-border-color | Border color of editors in tabs | `transparent`
 * `--primary-button-background-color` | Theme property, background color
 * of the primary action button. Applied to "send" and "abort" buttons | `--primary-color`
 * `--primary-button-color` | Theme property, font color of the primary
 * action button. Applied to "send" and "abort" buttons  | `#fff`
 * `--action-button` | Theme mixin, applied to "send" and "abort" buttons | `{}`
 * `--primary-button-hover-background-color` | Theme property, background
 * color of the primary action button when hovering. Applied to "send" and
 * "abort" buttons | `--accent-color`
 * `--primary-button-hover-color` | Theme property, font color of the
 * primary action button when hovering. Applied to "send" and "abort" buttons  | `#fff`
 * `--action-button-hover` | Theme mixin, applied to "send" and "abort"
 * buttons when hovering | `{}`
 * `--primary-button-disabled-background-color` | Theme property, background
 * color of the primary action button when disabled. Applied to "send"
 * and "abort" buttons | `--accent-color`
 * `--primary-button-disabled-color` | Theme property, font color of the
 * primary action button when disabled. Applied to "send" and "abort"
 * buttons  | `#fff`
 * `--action-button-disabled` | Theme mixin, applied to "send" and "abort"
 * buttons when disabled | `{}`
 * `--api-request-editor-container-narrow` | Mixin applied to the main
 * container when `narrow` property is set. | `{}`
 * `--api-request-editor-send-valid-button` | Mixin applied to the send
 * button when request is valid | `{}`
 * `--api-request-editor-abort-button` | Mixin applied to the abort button | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @appliesMixin EventsTargetMixin
 * @appliesMixin AmfHelperMixin
 * @memberof ApiElements
 */
class ApiRequestEditor extends AmfHelperMixin(EventsTargetMixin(PolymerElement)) {
  static get template() {
    return html`
    <style include="api-form-styles">
    :host {
      display: block;
      @apply --arc-font-body1;
      @apply --api-request-editor;
    }

    .content {
      height: 100%;
      @apply --layout-vertical;
      @apply --api-request-editor-container;
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
      @apply --arc-font-body2;
      color: var(--error-color);
      margin-left: 12px;
    }

    paper-spinner {
      margin-right: 8px;
    }

    iron-pages>* {
      border: 1px var(--api-request-editor-editors-border-color, transparent) solid;
      min-height: 120px;
    }

    .action-bar {
      @apply --layout-horizontal;
      @apply --layout-center;
      margin-top: 8px;
    }

    .send-button {
      background-color: var(--primary-button-background-color, var(--primary-color));
      color: var(--primary-button-color, #fff);
      @apply --action-button;
    }

    .send-button:not([disabled]):hover {
      background-color: var(--primary-button-hover-background-color, var(--primary-color));
      color: var(--primary-button-hover-color, #fff);
      @apply --action-button-hover;
    }

    .send-button[disabled] {
      background-color: var(--primary-button-disabled-background-color, rgb(234, 234, 234));
      color: var(--primary-button-disabled-color, #a8a8a8);
      @apply --action-button-disabled;
    }

    .send-button:not([disabled]):hover {
      @apply --api-request-editor-send-button-hover;
    }

    .send-button.abort {
      @apply --api-request-editor-abort-button;
    }

    .send-button.abort:hover {
      @apply --api-request-editor-abort-button-hover;
    }

    .url-editor {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    api-url-editor {
      @apply --layout-flex;
    }

    :host([narrow]) .content {
      @apply --layout-vertical;
      @apply --api-request-editor-container-narrow;
    }

    :host([narrow]) api-url-editor {
      width: auto;
    }
    </style>
    <template is="dom-if" if="[[aware]]">
      <raml-aware raml="{{amfModel}}" scope="[[aware]]"></raml-aware>
    </template>
    <api-url-data-model amf-model="[[amfModel]]" base-uri="[[baseUri]]"
      endpoint-path="{{endpointPath}}" api-base-uri="{{apiBaseUri}}" selected="[[selected]]"
      path-model="{{pathModel}}" query-model="{{queryModel}}"></api-url-data-model>
    <div class="content">
      <div class="url-editor" hidden\$="[[noUrlEditor]]">
        <api-url-editor required="" auto-validate="" invalid="{{urlInvalid}}"
        base-uri="[[apiBaseUri]]" endpoint-path="[[endpointPath]]"
        query-model="{{queryModel}}" path-model="{{pathModel}}"
        events-target="[[eventsTarget]]" value="{{url}}"></api-url-editor>
      </div>
      <paper-tabs selected="{{selectedTab}}">
        <paper-tab hidden\$="[[authNotRequired]]">
          Authorization
          <iron-icon icon="arc:warning" class="panel-warning"
            hidden\$="[[authValid]]" title="Fill up missing authorization data"></iron-icon>
        </paper-tab>
        <paper-tab>
          Parameters
          <template is="dom-if" if="[[paramsInvalid]]">
            <iron-icon icon="arc:warning" class="panel-warning" title="Fill up missing parameter"></iron-icon>
          </template>
        </paper-tab>
        <paper-tab>
          Headers
          <template is="dom-if" if="[[headersInvalid]]">
            <iron-icon icon="arc:warning" class="panel-warning" title="Fill up missing headers"></iron-icon>
          </template>
        </paper-tab>
        <paper-tab hidden\$="[[!isPayloadRequest]]">Body</paper-tab>
      </paper-tabs>
      <iron-pages selected="{{selectedTab}}">
        <authorization-panel amf-model="[[amfModel]]"
          events-target="[[eventsTarget]]" hidden\$="[[authNotRequired]]"
          secured-by="[[securedBy]]" redirect-uri="[[redirectUri]]"
          auth-required="{{authRequired}}" auth-valid="{{authValid}}"
          no-docs="[[noDocs]]"></authorization-panel>
        <api-url-params-editor uri-model="{{pathModel}}"
          query-model="{{queryModel}}" narrow="[[narrow]]" allow-custom="[[allowCustom]]"
          invalid="{{paramsInvalid}}" no-docs="[[noDocs]]"></api-url-params-editor>
        <api-headers-editor events-target="[[eventsTarget]]" amf-model="[[amfModel]]"
          amf-headers="[[apiHeaders]]" narrow="[[narrow]]" content-type="{{contentType}}"
          is-payload="[[isPayloadRequest]]" value="{{headers}}" allow-custom="[[allowCustom]]"
          allow-disable-params="[[allowDisableParams]]" allow-hide-optional="[[allowHideOptional]]"
          auto-validate="" invalid="{{headersInvalid}}" no-docs="[[noDocs]]"></api-headers-editor>
        <api-body-editor events-target="[[eventsTarget]]"
          amf-model="[[amfModel]]" amf-body="[[apiPayload]]" narrow="[[narrow]]"
          hidden\$="[[!isPayloadRequest]]" content-type="{{contentType}}"
          value="{{payload}}" allow-custom="[[allowCustom]]"
          allow-disable-params="[[allowDisableParams]]"
          allow-hide-optional="[[allowHideOptional]]"></api-body-editor>
      </iron-pages>
      <div class="action-bar">
        <template is="dom-if" if="[[!loadingRequest]]">
          <paper-button class="send-button" on-click="_sendHandler" disabled="[[_computeSendDisabled(urlInvalid, paramsInvalid, headersInvalid)]]">[[_computeSendLabel(authValid)]]</paper-button>
        </template>
        <template is="dom-if" if="[[loadingRequest]]">
          <paper-button class="send-button abort" on-click="_abortRequest">Abort</paper-button>
        </template>
        <template is="dom-if" if="[[invalid]]">
          <span class="invalid-info">Fill in required parameters</span>
        </template>
        <paper-spinner alt="Loading request" active="[[loadingRequest]]"></paper-spinner>
      </div>
    </div>
    <paper-toast text="Authorization for this endpoint is required" id="authFormError"
      horizontal-align="right" horizontal-offset="12"></paper-toast>
    <uuid-generator id="uuid"></uuid-generator>
`;
  }

  static get is() {
    return 'api-request-editor';
  }
  static get properties() {
    return {
      /**
       * `raml-aware` scope property to use.
       */
      aware: String,
      /**
       * An `@id` of selected AMF shape. When changed it computes
       * method model for the selection.
       */
      selected: String,
      /**
       * AMF API model.
       * The element extracts method definition from passed model
       * and by using `selected`.
       */
      amfModel: Object,
      _webApi: {
        type: Object,
        computed: '_computeWebApi(amfModel)'
      },
      /**
       * Computed method declaration in the AMF model.
       */
      _methodModel: {
        type: Object,
        computed: '_computeMethodModel(_webApi, selected)'
      },
      /**
       * Hides the URL editor from the view.
       * The editor is still in the DOM and the `urlInvalid` property still will be set.
       */
      noUrlEditor: Boolean,
      /**
       * A base URI for the API. To be set if RAML spec is missing `baseUri`
       * declaration and this produces invalid URL input. This information
       * is passed to the URL editor that prefixes the URL with `baseUri` value
       * if passed URL is a relative URL.
       */
      baseUri: String,
      /**
       * Computed from AMF model for the metod HTTP method name.
       *
       * @type {String}
       */
      httpMethod: {
        type: Boolean,
        value: false,
        computed: '_computeHttpMethod(_methodModel)',
        notify: true
      },
      /**
       * Headers for the request.
       *
       * @type {String|undefined}
       */
      headers: {
        type: String,
        notify: true
      },
      /**
       * Body for the request. The type of the body depends on
       * defined in the API media type.
       *
       * @type {String|FormData|File}
       */
      payload: {
        type: String,
        notify: true
      },
      /**
       * Final request URL including settings like `baseUri`, AMF
       * model settings and user provided parameters.
       * This value is always compoted by `api-url-editor` even if it's
       * hidden from the view.
       */
      url: {
        type: String,
        notify: true,
        observer: '_urlChanged'
      },
      /**
       * Selected request tab.
       */
      selectedTab: {
        type: Number,
        value: 0,
        notify: true,
        observer: '_selectedTabChanged'
      },
      /**
       * Current content type.
       *
       * @type {String|undefined}
       */
      contentType: {
        type: String,
        notify: true
      },
      /**
       * Computed value of security scheme from selected method.
       *
       * @type {Array<Object>}
       */
      securedBy: {
        type: Array,
        computed: '_computeSecuredBy(_methodModel)'
      },
      /**
       * Computed list of headers in the AMF model
       *
       * @type {Array<Object>}
       */
      apiHeaders: {
        type: Array,
        computed: '_computeHeaders(_methodModel)'
      },
      /**
       * Defined by the API payload data.
       *
       * @type {Array<Object>|undefined}
       */
      apiPayload: {
        type: Array,
        computed: '_computeApiPayload(_methodModel)'
      },
      /**
       * Computed value if the method can carry a payload.
       */
      isPayloadRequest: {
        type: Boolean,
        value: false,
        notify: true,
        computed: '_computeIsPayloadRequest(httpMethod)',
        observer: '_isPayloadChanged'
      },
      /**
       * OAuth2 redirect URI.
       * This value **must** be set in order for OAuth 1/2 to work properly.
       */
      redirectUri: String,
      /**
       * Inheritet from the authorization panel state if authorization is
       * required. Authorization may be not required if one of the
       * authorization methods is `nil` (RAML).
       */
      authRequired: {type: Boolean, notify: true},
      /**
       * Inheritet from the authorization panel state if authorization
       * data is valid.
       */
      authValid: {type: Boolean, notify: true},
      /**
       * If set it will renders the view in the narrow layout.
       */
      narrow: {
        type: Boolean,
        reflectToAttribute: true
      },
      /**
       * Computed value of if authorization is required for the endpoint.
       * If the auth is not required then the authorization tab is removed
       * from the view.
       */
      authNotRequired: {
        type: Boolean,
        value: true,
        notify: true,
        computed: '_computeNoAuth(securedBy)',
        observer: '_noAuthChanged'
      },
      /**
       * Flag set when the request is being made.
       */
      loadingRequest: {
        type: Boolean,
        notify: true,
        value: false
      },
      /**
       * If set it computes `hasOptional` property and shows checkbox in the
       * form to show / hide optional properties.
       */
      allowHideOptional: Boolean,
      /**
       * If set, enable / disable param checkbox is rendered next to each
       * form item.
       */
      allowDisableParams: Boolean,
      /**
       * When set, renders "add custom" item button.
       * If the element is to be used withouth AMF model this should always
       * be enabled. Otherwise users won't be able to add a parameter.
       */
      allowCustom: Boolean,
      // Selected by the user auth method (if any)
      authMethod: String,
      // Current authorization settings.
      authSettings: Object,
      /**
       * Generated request ID when the request is sent. This value is reported
       * in send and abort events
       */
      requestId: String,
      /**
       * Request query parameters view model
       * @type {Array<Object>}
       */
      queryModel: {
        type: Array,
        notify: true
      },
      /**
       * Request path parameters view model
       * @type {Array<Object>}
       */
      pathModel: {
        type: Array,
        notify: true
      },
      /**
       * Computed when URL params editor is invalid.
       */
      paramsInvalid: {
        type: Boolean,
        notify: true
      },
      /**
       * Computed when headers editor is invalid.
       */
      headersInvalid: {
        type: Boolean,
        notify: true
      },
      /**
       * Prohibits rendering of the documentation (the icon and the
       * description).
       */
      noDocs: Boolean,
      /**
       * Computed value, true if any of the editors has invalid state.
       */
      invalid: {
        type: Boolean,
        notify: true,
        observer: '_invalidChnaged',
        computed:
        '_computeInvalid(urlInvalid, paramsInvalid, headersInvalid, authValid, authNotRequired)'
      },
      /**
       * Validity state of the URL editor
       */
      urlInvalid: {type: Boolean, notify: true}
    };
  }
  static get observers() {
    return [
      '_pathModelChanged(pathModel.*)',
      '_queryModelChanged(queryModel.*)'
    ];
  }
  /**
   * @constructor
   */
  constructor() {
    super();
    this._authSettingsChanged = this._authSettingsChanged.bind(this);
    this._responseHandler = this._responseHandler.bind(this);
    this._authRedirectChangedHandler = this._authRedirectChangedHandler.bind(this);
  }

  _attachListeners(node) {
    this.addEventListener('authorization-settings-changed', this._authSettingsChanged);
    window.addEventListener('api-response', this._responseHandler);
    node.addEventListener('oauth2-redirect-uri-changed', this._authRedirectChangedHandler);
  }

  _detachListeners(node) {
    this.removeEventListener('authorization-settings-changed', this._authSettingsChanged);
    window.removeEventListener('api-response', this._responseHandler);
    node.removeEventListener('oauth2-redirect-uri-changed', this._authRedirectChangedHandler);
  }
  /**
   * Dispatches bubbling and composed custom event.
   * By default the event is cancelable until `cancelable` property is set to false.
   * @param {String} type Event type
   * @param {?any} detail A detail to set
   * @param {?Boolean} cancelable When false the event is not cancelable.
   * @return {CustomEvent}
   */
  _dispatch(type, detail, cancelable) {
    if (typeof cancelable !== 'boolean') {
      cancelable = true;
    }
    const e = new CustomEvent(type, {
      bubbles: true,
      composed: true,
      cancelable,
      detail
    });
    this.dispatchEvent(e);
    return e;
  }

  /**
   * Sends usage google analytics event
   * @param {String} action Action description
   * @param {String} label Event label
   * @return {CustomEvent}
   */
  _sendGaEvent(action, label) {
    return this._dispatch('send-analytics', {
      type: 'event',
      category: 'Request editor',
      action,
      label
    }, false);
  }
  /**
   * Clears the request properties.
   */
  clearRequest() {
    this.set('url', '');
    this.set('headers', '');
    this.set('payload', '');
    this.shadowRoot.querySelector('authorization-panel').clear();
    this.selectedTab = 0;
    this._dispatch('request-clear-state');
    this._sendGaEvent('Clear request');
  }
  /**
   * Computes AMF model for authorization panel.
   *
   * @param {Object} model Current method model.
   * @return {Array|undefined} List of security definitions for the endpoint.
   */
  _computeSecuredBy(model) {
    if (!model) {
      return;
    }
    const key = this._getAmfKey(this.ns.raml.vocabularies.security + 'security');
    let data = model[key];
    if (data && !(data instanceof Array)) {
      data = [data];
    }
    return data;
  }
  /**
   * Computes model definition for headers.
   *
   * @param {?Object} model Method model
   * @return {Array|undefined} List of headers or undefined.
   */
  _computeHeaders(model) {
    if (!model) {
      return;
    }
    const expects = this._computeExpects(model);
    if (!expects) {
      return;
    }
    const key = this._getAmfKey(this.ns.raml.vocabularies.http + 'header');
    let headers = expects[key];
    if (headers && !(headers instanceof Array)) {
      headers = [headers];
    }
    return headers;
  }
  /**
   * Computes if authorization for the endpoint is set.
   *
   * @param {Object} model Operation model.
   * @return {Boolean}
   */
  _computeNoAuth(model) {
    return !(model && model[0]);
  }
  /**
   * Computes value for `httpMethod` property from AMF model for current
   * operation.
   *
   * @param {Object} model Operation model.
   * @return {String} Method name.
   */
  _computeHttpMethod(model) {
    return this._getValue(model, this.ns.w3.hydra.core + 'method');
  }
  /**
   * Computes value for `apiPayload` property from AMF model for current
   * method.
   *
   * @param {Object} model Operation model.
   * @return {Array<Object>|undefined} Method payload.
   */
  _computeApiPayload(model) {
    if (!model) {
      return;
    }
    const expects = this._computeExpects(model);
    if (!expects) {
      return;
    }
    const key = this._getAmfKey(this.ns.raml.vocabularies.http + 'payload');
    let payload = expects[key];
    if (payload && !(payload instanceof Array)) {
      payload = [payload];
    }
    return payload;
  }
  /**
   * Computes value for `isPayloadRequest`.
   * Only `GET` and `HEAD` methods are known as ones that can't carry a
   * payload. For any other HTTP method this always returns true.
   *
   * @param {String} method HTTP method value
   * @return {Boolean}
   */
  _computeIsPayloadRequest(method) {
    return ['get', 'head'].indexOf(method) === -1;
  }
  /**
   * Updates tabs selection when `authNotRequired` property change.
   * It changes selection to the next tab if there's no authorization
   * and current selected editor is authorization.
   *
   * @param {Boolean} value Current value for `authNotRequired`
   */
  _noAuthChanged(value) {
    if (!value && this.selectedTab === 2) {
      this.selectedTab = 0;
    } else if (value && this.selectedTab === 0) {
      this.selectedTab = 1;
    }
    this._refreshTabs();
    this._sendGaEvent('no-auth-changed', String(value));
  }
  /**
   * Updates the state of the body editor when switching to it.
   * Code mirror does not property calculate it's value when
   * the editor is not visible. This forces to refresh the value of the
   * editor.
   *
   * @param {Number} selected Selected tam index.
   */
  _selectedTabChanged(selected) {
    if (selected === 3) {
      afterNextRender(this, () => {
        this.shadowRoot.querySelector('api-body-editor').refreshPanel();
      });
    }
    this._sendGaEvent('tab-changed', selected);
  }
  /**
   * Refreshes tabs selection when `isPayloadRequest` peroperty chnage.
   *
   * @param {Boolean} state
   */
  _isPayloadChanged(state) {
    if (!state) {
      this.payload = undefined;
    }
    if (!state && this.selectedTab === 3) {
      this.selectedTab = 1;
    }
    this._refreshTabs();
  }
  /**
   * Refreshes tabs selection. To be called when number of tabs changes.
   */
  _refreshTabs() {
    const tabs = this.shadowRoot && this.shadowRoot.querySelector('paper-tabs');
    if (!tabs) {
      return;
    }
    tabs.notifyResize();
  }
  /**
   * Handles send button click.
   * Depending on authorization validity it either sends the
   * request or forces authorization and sends the request.
   */
  _sendHandler() {
    if (this.authValid) {
      this.execute();
    } else {
      this.authAndExecute();
    }
  }

  /**
   * To be called when the user want to execute the request but
   * authorization is invalid (missin values).
   * This function brings the auth panel to front and displays error toast
   *
   * TODO: There is a case when the user didn't requested OAuth2 token
   * but provided all the data. This function should check for this
   * condition and call authorization function automatically.
   */
  authAndExecute() {
    this.__requestAuthAwaiting = true;
    const panel = this.shadowRoot.querySelector('authorization-panel');
    let result;
    if (panel) {
      result = panel.forceTokenAuthorization();
    }
    if (!result) {
      if (this.selectedTab !== 0) {
        this.selectedTab = 0;
      }
      this.$.authFormError.opened = true;
    }
  }
  /**
   * Executes the request by dispatching `api-request` custom event.
   * The event must be handled by hosting application to ensure transport.
   * Use `advanced-rest-client/xhr-simple-request` component to add logic
   * that uses XHR as a transport.
   *
   * Hosting application also must reset state of `loadingRequest` property
   * once the response is ready. It also can dispatch `api-response`
   * custom event handled by this element to reset state. This is also
   * handled by `xhr-simple-request` component.
   */
  execute() {
    this.loadingRequest = true;
    const request = this.serializeRequest();
    this.requestId = this.$.uuid.generate();
    request.id = this.requestId;
    this._dispatch('api-request', request);
    this._sendGaEvent('request-execute', 'true');
  }
  /**
   * Sends the `abort-api-request` custom event to cancel the request.
   * Calling this method befor sending request may have unexpected
   * behavior because `requestId` is only set with `execute()` method.
   */
  abort() {
    this._dispatch('abort-api-request', {
      url: this.url,
      id: this.requestId
    });
    this._sendGaEvent('request-abort', 'true');
    this.loadingRequest = false;
    this.requestId = undefined;
  }
  /**
   * Event handler for abort click.
   */
  _abortRequest() {
    this.abort();
  }
  /**
   * Returns an object with the request properties.
   * The object contains:
   * - `method` (String)
   * - `url` (String)
   * - `headers` (String)
   * - `payload` (String)
   * - `auth` (Object)
   *
   * The `auth` property is optional and is only added to the request if
   * simple `authorization` header will not work. For example NTLM auth
   * method has to be made on a single socket connection (authorization
   * and the request) so it can't be made before the request.
   *
   * The `auth` object contains 2 properties:
   * - `type` (String) the authorization type - one of from the
   * `auth-methods` element
   * - `settings` (Object) Authorization parameters entered by the user.
   * It vary and depends on selected auth method.
   * For example in case of the NTLM it will be: `username`, `password` and
   * `domain`. See `advanced-rest-client/auth-methods` for model descriptions.
   *
   * @return {Object}
   */
  serializeRequest() {
    const result = {
      method: (this.httpMethod || 'get').toUpperCase(),
      url: this.url,
      headers: this.headers || '',
      payload: this.payload,
      queryModel: this.queryModel,
      pathModel: this.pathModel,
      headersModel: this.shadowRoot.querySelector('api-headers-editor').viewModel
    };
    if (this.authMethod && this.authSettings) {
      result.auth = this.authSettings;
      result.authType = this.authMethod;
    }
    return result;
  }
  /**
   * Handler for the `authorization-settings-changed` dispatched by
   * authorization panel. Sets auth settings and executes the request if
   * any pending if valid.
   *
   * @param {CustomEvent} e
   */
  _authSettingsChanged(e) {
    this.authMethod = e.detail.type;
    this.authSettings = e.detail.settings;
    if (e.detail.valid && this.__requestAuthAwaiting) {
      this.__requestAuthAwaiting = false;
      this.execute();
    }
  }
  /**
   * Handler for the `api-response` custom event.
   * Clears the loading state.
   *
   * @param {CustomEvent} e
   */
  _responseHandler(e) {
    if (!e.detail || (e.detail.id !== this.requestId)) {
      return;
    }
    this.loadingRequest = false;
  }
  /**
   * Handler for the `oauth2-redirect-uri-changed` custom event. Changes
   * the `redirectUri` property.
   * @param {CustomEvent} e
   */
  _authRedirectChangedHandler(e) {
    this.redirectUri = e.detail.value;
  }
  /**
   * Handler for path model change
   * @param {Object} record Polymer's change record
   */
  _pathModelChanged(record) {
    const model = record.base;
    const path = record.path;
    if (!model || !path) {
      return;
    }
    if (path === 'pathModel' || (/^pathModel\.\d+\.(name|value|schema\.enabled)$/).test(path)) {
      this._notifyModelChanged('path', model);
    }
  }
  /**
   * Handler for query model change
   * @param {Object} record Polymer's change record
   */
  _queryModelChanged(record) {
    const model = record.base;
    const path = record.path;
    if (!model || !path) {
      return;
    }
    if (path === 'queryModel' || path === 'queryModel.length' ||
      (/^queryModel\.\d+\.(name|value|schema\.enabled)$/).test(path)) {
      this._notifyModelChanged('query', model);
    }
  }
  /**
   * Dispatches model change event
   * @param {String} type Model name
   * @param {Array} model Current model value.
   */
  _notifyModelChanged(type, model) {
    const result = [];
    if (model) {
      model.forEach((item) => {
        if (!item.name) {
          return;
        }
        result.push({
          name: item.name,
          value: item.value,
          enabled: item.schema.enabled
        });
      });
    }
    this._dispatch('request-' + type + '-model-changed', {
      value: result
    });
  }
  /**
   * Dispatches `url-value-changed` event when url value change.
   * @param {String} value
   */
  _urlChanged(value) {
    this._dispatch('url-value-changed', {
      value
    });
  }
  /**
   * Computes value if `invalid` property.
   * @param {Boolean} urlInvalid
   * @param {Boolean} paramsInvalid
   * @param {Boolean} headersInvalid
   * @param {Boolean} authValid
   * @param {Boolean} authNotRequired
   * @return {Boolean}
   */
  _computeInvalid(urlInvalid, paramsInvalid, headersInvalid, authValid, authNotRequired) {
    if (urlInvalid || paramsInvalid || headersInvalid) {
      return true;
    }
    return authNotRequired === false && authValid === false;
  }
  /**
   * Sets `invalid` and `aria-invalid` attributes on the element.
   * @param {Boolean} invalid Current state of ivalid state
   */
  _invalidChnaged(invalid) {
    if (invalid) {
      this.setAttribute('invalid', true);
      this.setAttribute('aria-invalid', true);
    } else {
      this.removeAttribute('invalid');
      this.removeAttribute('aria-invalid');
    }
  }
  /**
   * Computes label for the send button.
   * If authorization state is ivalid then label is different.
   * @param {Boolean} authValid [description]
   * @return {String}
   */
  _computeSendLabel(authValid) {
    return authValid ? 'Send' : 'Authorize and send';
  }
  /**
   * Computes value to disable send button when the form is invalid.
   * THe button is active when auth is the only invalid state
   * @param {Boolean} urlInvalid
   * @param {Boolean} paramsInvalid
   * @param {Boolean} headersInvalid
   * @return {Boolean}
   */
  _computeSendDisabled(urlInvalid, paramsInvalid, headersInvalid) {
    if (urlInvalid || paramsInvalid || headersInvalid) {
      return true;
    }
    return false;
  }
  /**
   * Dispatched when the user requests to send current request.
   *
   * This event can be cancelled.
   *
   * @event api-request
   * @param {String} url The request URL. Can be empty string.
   * @param {String} method HTTP method name. Can be empty.
   * @param {String} headers HTTP headers string. Can be empty.
   * @param {String|File|FormData} payload Message body. Can be undefined.
   * @param {?Object} auth Authorization settings from the auth panel.
   * May be `undefined`.
   * @param {?String} authType Name of the authorization methods. One of
   * `advanced-rest-client/auth-methods`.
   * @param {String} id Generated UUID for the request. Each call of
   * `execute()` function regenerates the `id`.
   * @param {?Array<Object>} queryModel Query parameters data view model
   * @param {?Array<Object>} pathModel URI parameters data view model
   * @param {?Array<Object>} headersModel Headers data view model
   */
  /**
   * Fired when the user requests to abort current request.
   *
   * This event can be cancelled.
   *
   * @event abort-api-request
   * @param {String} url The request URL. Can be empty string. Also, it may be
   * different URL that the one used to send the request if the user changed
   * it in between. Use the `id` property to compare requests.
   * @param {String} id Generated UUID of the request with `send-request`
   * event.
   */

  /**
   * Dispatched when query model changed.
   *
   * @event request-query-model-changed
   * @param {Array<Object>} value List of current query parameters.
   * Each object contains `name`, `value` and `enabled` property.
   * If `enable` equals `false` (boolean) it means that the user disabled
   * this property in the editor.
   */
  /**
   * Dispatched when path variables model changed.
   *
   * @event request-path-model-changed
   * @param {Array<Object>} value List of current path parameters.
   * Each object contains `name`, `value` and `enabled` property.
   * Enabled property is here only for consistency with
   * `request-query-model-changed`. The UI does not offer turning this
   * properties off. It's always true
   */
  /**
   * Dispatched when request URL change
   * @event url-value-changed
   * @param {String} value New value of request URL
   */
}
window.customElements.define(ApiRequestEditor.is, ApiRequestEditor);
