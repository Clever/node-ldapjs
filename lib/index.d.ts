// Type definitions for ldapjs 1.0
// Project: http://ldapjs.org
// Definitions by: Charles Villemure <https://github.com/cvillemure>, Peter Kooijmans <https://github.com/peterkooijmans>, Pablo Moleri <https://github.com/pmoleri>
// Modified by Taylor Sutton <https://github.com/taylor-sutton> for Clever's fork
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// This file is covered by the DefinitelyTyped project's MIT license, respective of each contributor listed above.

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/// <reference types="node" />

import { EventEmitter } from "events";

export interface Error {
  code: number;
  name: string;
  message: string;
}

export interface ErrorCallback {
  (error: Error): void;
}

export interface CompareCallback {
  (error: Error, matched?: boolean): void;
}

export interface ExopCallback {
  (error: Error, value: string, result?: any): void;
}

export interface CallBack {
  (error: Error, result?: any): void;
}

export interface ClientOptions {
  url: string;
  tlsOptions?: Object;
  socketPath?: string;
  log?: any;
  timeout?: number;
  connectTimeout?: number;
  idleTimeout?: number;
  reconnect?: boolean | {
    initialDelay?: number,
    maxDelay?: number,
    failAfter?: number
  };
  strictDN?: boolean;
  queueSize?: number;
  queueTimeout?: number;
  queueDisable?: boolean;
  bindDN?: string;
  bindCredentials?: string;
  createConnection?: (port: number, host: string, onConnect: () => void, onSocketDefined: (socket: net.Socket) => void, onError: (error: any) => void) => void;
}

export interface SearchOptions {
  scope?: string;
  filter?: string | Filter;
  attributes?: string[];
  sizeLimit?: number;
  timeLimit?: number;
  derefAliases?: number;
  typesOnly?: boolean;
  paged?: boolean | {
    pageSize?: number;
    pagePause?: boolean;
  }
}

export interface Change {
  operation: string;
  modification: {
    [key: string]: any;
  };
}

export var Change: {
  new(change: Change): Change;
}

export type SearchReference = any;

export interface SearchCallbackResponse extends EventEmitter {
  on(event: "searchEntry", listener: (entry: SearchEntry) => void): this;
  on(event: "searchReference", listener: (referral: SearchReference) => void): this;
  on(event: "page", listener: (res: LDAPResult, cb: (...args: any[]) => void) => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: "end", listener: (res: LDAPResult | null) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
}

export interface SearchCallBack {
  (error: Error | null, result: SearchCallbackResponse): void;
}

export type Control = any;

export interface Client extends EventEmitter {

  connected: boolean;

  /**
   * Performs a simple authentication against the server.
   *
   * @param dn the DN to bind as.
   * @param password the userPassword associated with name.
   * @param controls (optional) either a Control or [Control].
   * @param callback callback of the form f(err, res).
   * @throws {TypeError} on invalid input.
   */
  bind(dn: string, password: string, callback: CallBack): void;
  bind(dn: string, password: string, controls: Control | Array<Control>, callback: CallBack): void;

  /**
   * Adds an entry to the LDAP server.
   *
   * Entry can be either [Attribute] or a plain JS object where the
   * values are either a plain value or an array of values.  Any value (that's
   * not an array) will get converted to a string, so keep that in mind.
   *
   * @param name the DN of the entry to add.
   * @param entry an array of Attributes to be added or a JS object.
   * @param controls (optional) either a Control or [Control].
   * @param callback of the form f(err, res).
   * @throws {TypeError} on invalid input.
   */
  add(name: string, entry: Object, callback: ErrorCallback): void;
  add(name: string, entry: Object, controls: Control | Array<Control>, callback: ErrorCallback): void;

  /**
   * Compares an attribute/value pair with an entry on the LDAP server.
   *
   * @param name the DN of the entry to compare attributes with.
   * @param attr name of an attribute to check.
   * @param value value of an attribute to check.
   * @param controls (optional) either a Control or [Control].
   * @param callback of the form f(err, boolean, res).
   * @throws {TypeError} on invalid input.
   */
  compare(name: string, attr: string, value: string, callback: CompareCallback): void;
  compare(name: string, attr: string, value: string, controls: Control | Array<Control>, callback: CompareCallback): void;

  /**
   * Deletes an entry from the LDAP server.
   *
   * @param name the DN of the entry to delete.
   * @param controls (optional) either a Control or [Control].
   * @param callback of the form f(err, res).
   * @throws {TypeError} on invalid input.
   */
  del(name: string, callback: ErrorCallback): void;
  del(name: string, controls: Control | Array<Control>, callback: ErrorCallback): void;

  /**
   * Performs an extended operation on the LDAP server.
   *
   * Pretty much none of the LDAP extended operations return an OID
   * (responseName), so I just don't bother giving it back in the callback.
   * It's on the third param in `res` if you need it.
   *
   * @param name the OID of the extended operation to perform.
   * @param value value to pass in for this operation.
   * @param controls (optional) either a Control or [Control].
   * @param callback of the form f(err, value, res).
   * @throws {TypeError} on invalid input.
   */
  exop(name: string, value: string, callback: ExopCallback): void;
  exop(name: string, value: string, controls: Control | Array<Control>, callback: ExopCallback): void;

  /**
   * Performs an LDAP modify against the server.
   *
   * @param name the DN of the entry to modify.
   * @param change update to perform (can be [Change]).
   * @param controls (optional) either a Control or [Control].
   * @param callback of the form f(err, res).
   * @throws {TypeError} on invalid input.
   */
  modify(name: string, change: Change | Array<Change>, callback: ErrorCallback): void;
  modify(name: string, change: Change | Array<Change>, controls: Control | Array<Control>, callback: ErrorCallback): void;

  /**
   * Performs an LDAP modifyDN against the server.
   *
   * This does not allow you to keep the old DN, as while the LDAP protocol
   * has a facility for that, it's stupid. Just Search/Add.
   *
   * This will automatically deal with "new superior" logic.
   *
   * @param {String} name the DN of the entry to modify.
   * @param {String} newName the new DN to move this entry to.
   * @param {Control} controls (optional) either a Control or [Control].
   * @param {Function} callback of the form f(err, res).
   * @throws {TypeError} on invalid input.
   */
  modifyDN(name: string, newName: string, callback: ErrorCallback): void;
  modifyDN(name: string, newName: string, controls: Control | Array<Control>, callback: ErrorCallback): void;

  /**
   * Performs an LDAP search against the server.
   *
   * Note that the defaults for options are a 'base' search, if that's what
   * you want you can just pass in a string for options and it will be treated
   * as the search filter.  Also, you can either pass in programatic Filter
   * objects or a filter string as the filter option.
   *
   * Note that this method is 'special' in that the callback 'res' param will
   * have two important events on it, namely 'searchEntry' and 'end' that you can hook
   * to.  The former will emit a SearchEntry object for each record that comes
   * back, and the latter will emit a normal LDAPResult object.
   *
   * @param {String} base the DN in the tree to start searching at.
   * @param {SearchOptions} options parameters
   * @param {Control} controls (optional) either a Control or [Control].
   * @param {Function} callback of the form f(err, res).
   * @throws {TypeError} on invalid input.
   */
  search(base: string, options: SearchOptions, callback: SearchCallBack): void;
  search(base: string, options: SearchOptions, callback: SearchCallBack, _bypass: boolean): void;
  search(base: string, options: SearchOptions, controls: Control | Array<Control>, callback: SearchCallBack): void;
  search(base: string, options: SearchOptions, controls: Control | Array<Control>, callback: SearchCallBack, _bypass: boolean): void;

  /**
   * Attempt to secure connection with StartTLS.
   */
  starttls(options: Object, controls: Control | Array<Control>, callback: CallBack): void;
  starttls(options: Object, controls: Control | Array<Control>, callback: CallBack, _bypass: boolean): void;

  /**
   * Unbinds this client from the LDAP server.
   *
   * Note that unbind does not have a response, so this callback is actually
   * optional; either way, the client is disconnected.
   *
   * @param {Function} callback of the form f(err).
   * @throws {TypeError} if you pass in callback as not a function.
   */
  unbind(callback?: ErrorCallback): void;

  /**
   * Disconnect from the LDAP server and do not allow reconnection.
   *
   * If the client is instantiated with proper reconnection options, it's
   * possible to initiate new requests after a call to unbind since the client
   * will attempt to reconnect in order to fulfill the request.
   *
   * Calling destroy will prevent any further reconnection from occurring.
   *
   * @param {Object} err (Optional) error that was cause of client destruction
   */
  destroy(err?: any): void;
}

export function createClient(options?: ClientOptions): Client;

declare class Filter {
  matches(obj: any): boolean;
  type: string;
}

export function parseFilter(filterString: string): Filter;

export class EqualityFilter extends Filter {
  constructor(options: { attribute: string, value: string })
}

export class PresenceFilter extends Filter {
  constructor(options: { attribute: string })
}

export class SubstringFilter extends Filter {
  constructor(options: { attribute: string, initial: string, any?: string[], final?: string })
}

export class GreaterThanEqualsFilter extends Filter {
  constructor(options: { attribute: string, value: string })
}

export class LessThanEqualsFilter extends Filter {
  constructor(options: { attribute: string, value: string })
}

export class AndFilter extends Filter {
  constructor(options: { filters: Filter[] })
}

export class OrFilter extends Filter {
  constructor(options: { filters: Filter[] })
}

export class NotFilter extends Filter {
  constructor(options: { filter: Filter })
}

export class ApproximateFilter extends Filter {
  constructor(options: { attribute: string, value: string })
}

export interface AttributeJson {
  type: string;
  vals: string[];
}

export class Attribute {
  private type: string;
  readonly buffers: Buffer[];

  /**
   *  Array of string values, binaries are represented in base64.
   *  get: When reading it always returns an array of strings.
   *  set: When assigning it accepts either an array or a single value.
   *       `Buffer`s are assigned directly, any other value is converted to string and loaded into a `Buffer`.
   */
  vals: string | string[];

  readonly json: AttributeJson;

  /** Stringified json property */
  toString(): string;

  static isAttribute(object: any): object is Attribute;
  static compare(a: Attribute, b: Attribute): number;
}

interface LDAPMessageJsonObject {
  messageID: number;
  protocolOp: string | undefined;
  controls: Control[];
  [k: string]: any;
}

export abstract class LDAPMessage {
  messageID: number;
  protocolOp: string | undefined;
  controls: Control[];
  log: any;
  readonly id: number;
  readonly dn: string;
  readonly type: string;

  /** A plain object with main properties */
  readonly json: LDAPMessageJsonObject;

  /** Stringified json property */
  toString(): string;
  parse(ber: Buffer): boolean;
  toBer(): Buffer;
}

export class LDAPResult extends LDAPMessage {
  readonly type: "LDAPResult";
  /** Result status 0 = success */
  status: number;
  matchedDN: string;
  errorMessage: string;
  referrals: string[];
  connection: any;
}

export interface SearchEntryObject {
  dn: string;
  controls: Control[];
  [p: string]: string | string[];
}

export interface SearchEntryRaw {
  dn: string;
  controls: Control[];
  [p: string]: string | Buffer | Buffer[];
}

export class SearchEntry extends LDAPMessage {
  readonly type: "SearchEntry";
  objectName: string | null;
  attributes: Attribute[];

  readonly json: LDAPMessageJsonObject & { objectName: string, attributes: AttributeJson[] };

  /**
   * Retrieve an object with `dn`, `controls` and every `Atttribute` as a property with their value(s)
   */
  readonly object: SearchEntryObject;

  /**
   * Retrieve an object with `dn`, `controls` and every `Atttribute` as a property, using raw `Buffer`(s) as attribute values.
   */
  readonly raw: SearchEntryRaw;
}
