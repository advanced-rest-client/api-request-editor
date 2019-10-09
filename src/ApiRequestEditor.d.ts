/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/ApiRequestEditor.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {html, css, LitElement} from 'lit-element';

import {EventsTargetMixin} from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';

import {AmfHelperMixin} from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

export {ApiRequestEditor};

declare namespace ApiElements {

  /**
   * `api-request-editor`
   */
  class ApiRequestEditor extends
    EventsTargetMixin(
    AmfHelperMixin(
    Object)) {

    /**
     * An `@id` of selected AMF shape. When changed it computes
     * method model for the selection.
     */
    selected: string|null|undefined;
    url: any;

    /**
     * Computed value, true if any of the editors has invalid state.
     */
    invalid: boolean|null|undefined;
    readonly httpMethod: any;
    readonly headers: any;
    readonly payload: any;
    readonly contentType: any;
    readonly securedBy: any;
    readonly apiHeaders: any;
    readonly apiPayload: any;
    readonly isPayloadRequest: any;
    readonly authInvalid: any;
    readonly loadingRequest: any;
    readonly requestId: any;
    readonly _sendLabel: any;
    readonly _hideParamsEditor: any;

    /**
     * `raml-aware` scope property to use.
     */
    aware: string|null|undefined;

    /**
     * Hides the URL editor from the view.
     * The editor is still in the DOM and the `urlInvalid` property still will be set.
     */
    noUrlEditor: boolean|null|undefined;

    /**
     * A base URI for the API. To be set if RAML spec is missing `baseUri`
     * declaration and this produces invalid URL input. This information
     * is passed to the URL editor that prefixes the URL with `baseUri` value
     * if passed URL is a relative URL.
     */
    baseUri: string|null|undefined;

    /**
     * If set it computes `hasOptional` property and shows checkbox in the
     * form to show / hide optional properties.
     */
    allowHideOptional: boolean|null|undefined;

    /**
     * If set, enable / disable param checkbox is rendered next to each
     * form item.
     */
    allowDisableParams: boolean|null|undefined;

    /**
     * When set, renders "add custom" item button.
     * If the element is to be used withouth AMF model this should always
     * be enabled. Otherwise users won't be able to add a parameter.
     */
    allowCustom: boolean|null|undefined;

    /**
     * API server definition from the AMF model.
     *
     * This value to be set when partial AMF mnodel for an endpoint is passed
     * instead of web api to be passed to the `api-url-data-model` element.
     *
     * Do not set with full AMF web API model.
     */
    server: object|null|undefined;

    /**
     * Supported protocl versions.
     *
     * E.g.
     *
     * ```json
     * ["http", "https"]
     * ```
     *
     * This value to be set when partial AMF mnodel for an endpoint is passed
     * instead of web api to be passed to the `api-url-data-model` element.
     *
     * Do not set with full AMF web API model.
     */
    protocols: any[]|null|undefined;

    /**
     * API version name.
     *
     * This value to be set when partial AMF mnodel for an endpoint is passed
     * instead of web api to be passed to the `api-url-data-model` element.
     *
     * Do not set with full AMF web API model.
     */
    version: string|null|undefined;

    /**
     * Enables compatibility with Anypoint styling
     */
    compatibility: boolean|null|undefined;

    /**
     * Enables Material Design outlined style
     */
    outlined: boolean|null|undefined;

    /**
     * When set the editor is in read only mode.
     */
    readOnly: boolean|null|undefined;

    /**
     * When set all controls are disabled in the form
     */
    disabled: boolean|null|undefined;

    /**
     * OAuth2 redirect URI.
     * This value **must** be set in order for OAuth 1/2 to work properly.
     */
    redirectUri: string|null|undefined;

    /**
     * If set it will renders the view in the narrow layout.
     */
    narrow: boolean|null|undefined;

    /**
     * Prohibits rendering of the documentation (the icon and the
     * description).
     */
    noDocs: boolean|null|undefined;

    /**
     * Computed from AMF model for the metod HTTP method name.
     */
    _httpMethod: String|null;

    /**
     * Headers for the request.
     */
    _headers: String|null|undefined;

    /**
     * Body for the request. The type of the body depends on
     * defined in the API media type.7
     */
    _payload: String|FormData|File|null;

    /**
     * Final request URL including settings like `baseUri`, AMF
     * model settings and user provided parameters.
     * This value is always computed by the `api-url-editor` even if it's
     * hidden from the view.
     */
    _url: string|null|undefined;

    /**
     * Current content type.
     */
    _contentType: String|null|undefined;

    /**
     * Computed value of security scheme from selected method.
     */
    _securedBy: Array<object|null>|null;

    /**
     * Computed list of headers in the AMF model
     */
    _apiHeaders: Array<object|null>|null;

    /**
     * Defined by the API payload data.
     */
    _apiPayload: Array<object|null>|null|undefined;

    /**
     * Computed value if the method can carry a payload.
     */
    _isPayloadRequest: boolean|null|undefined;

    /**
     * Inheritet from the authorization panel state if authorization
     * data is valid.
     */
    _authInvalid: boolean|null|undefined;

    /**
     * Flag set when the request is being made.
     */
    _loadingRequest: boolean|null|undefined;

    /**
     * Selected by the user auth method (if any)
     */
    _authMethod: string|null|undefined;

    /**
     * Current authorization settings.
     */
    _authSettings: object|null|undefined;

    /**
     * Generated request ID when the request is sent. This value is reported
     * in send and abort events
     */
    _requestId: string|null|undefined;

    /**
     * Request query parameters view model
     */
    _queryModel: Array<object|null>|null;

    /**
     * Request path parameters view model
     */
    _pathModel: Array<object|null>|null;

    /**
     * Computed when URL params editor is invalid.
     */
    _paramsInvalid: boolean|null|undefined;

    /**
     * Computed when headers editor is invalid.
     */
    _headersInvalid: boolean|null|undefined;

    /**
     * Validity state of the URL editor
     */
    _urlInvalid: boolean|null|undefined;
    _endpointUri: string|null|undefined;
    _apiBaseUri: string|null|undefined;

    /**
     * Computes model definition for headers.
     *
     * @param model Method model
     * @returns List of headers or undefined.
     */
    _computeHeaders(model: object|null): any[]|null|undefined;
    _attachListeners(node: any): void;
    _detachListeners(node: any): void;

    /**
     * Dispatches bubbling and composed custom event.
     * By default the event is cancelable until `cancelable` property is set to false.
     *
     * @param type Event type
     * @param detail A detail to set
     * @param cancelable When false the event is not cancelable.
     */
    _dispatch(type: String|null, detail: any|null, cancelable: Boolean|null): CustomEvent|null;

    /**
     * Sends usage google analytics event
     *
     * @param action Action description
     * @param label Event label
     */
    _sendGaEvent(action: String|null, label: String|null): CustomEvent|null;

    /**
     * Clears the request properties.
     */
    clearRequest(): void;
    _selectedChanged(): void;
    _computeMethodAmfModel(model: any, selected: any): any;

    /**
     * Computes AMF model for authorization panel.
     *
     * @param model Current method model.
     * @returns List of security definitions for the endpoint.
     */
    _computeSecuredBy(model: object|null): any[]|null|undefined;

    /**
     * Computes value for `apiPayload` property from AMF model for current
     * method.
     *
     * @param model Operation model.
     * @returns Method payload.
     */
    _computeApiPayload(model: object|null): Array<object|null>|null|undefined;

    /**
     * Computes value for `isPayloadRequest`.
     * Only `GET` and `HEAD` methods are known as ones that can't carry a
     * payload. For any other HTTP method this always returns true.
     *
     * @param method HTTP method value
     */
    _computeIsPayloadRequest(method: String|null): Boolean|null;

    /**
     * Handles send button click.
     * Depending on authorization validity it either sends the
     * request or forces authorization and sends the request.
     */
    _sendHandler(): void;

    /**
     * To be called when the user want to execute the request but
     * authorization is invalid (missin values).
     * This function brings the auth panel to front and displays error toast
     *
     * TODO: There is a case when the user didn't requested OAuth2 token
     * but provided all the data. This function should check for this
     * condition and call authorization function automatically.
     */
    authAndExecute(): void;

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
    execute(): void;

    /**
     * Sends the `abort-api-request` custom event to cancel the request.
     * Calling this method befor sending request may have unexpected
     * behavior because `requestId` is only set with `execute()` method.
     */
    abort(): void;

    /**
     * Event handler for abort click.
     */
    _abortRequest(): void;

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
     */
    serializeRequest(): object|null;

    /**
     * Handler for the `authorization-settings-changed` dispatched by
     * authorization panel. Sets auth settings and executes the request if
     * any pending if valid.
     */
    _authSettingsChanged(e: CustomEvent|null): void;

    /**
     * Handler for the `api-response` custom event.
     * Clears the loading state.
     */
    _responseHandler(e: CustomEvent|null): void;

    /**
     * Handler for the `oauth2-redirect-uri-changed` custom event. Changes
     * the `redirectUri` property.
     */
    _authRedirectChangedHandler(e: CustomEvent|null): void;

    /**
     * Dispatches `url-value-changed` event when url value change.
     */
    _urlChanged(value: String|null): void;

    /**
     * Sets `invalid` and `aria-invalid` attributes on the element.
     *
     * @param invalid Current state of ivalid state
     */
    _invalidChnaged(invalid: Boolean|null): void;
    _apiChanged(e: any): void;
    _urlHandler(e: any): void;
    _endpointUriHandler(e: any): any;
    _apiBaseUriHandler(e: any): any;
    _pathModelHandler(e: any): any;
    _queryModelHandler(e: any): any;
    _contentTypeHandler(e: any): any;
    _authInvalidChanged(e: any): void;
    _paramsInvalidChanged(e: any): void;
    _headersInvalidChanged(e: any): void;
    _urlInvalidChanged(e: any): void;
    _headersHandler(e: any): void;
    _payloadHandler(e: any): void;
    _reValidate(): any;
    render(): any;
  }
}