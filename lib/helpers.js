"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayJSONStyles = exports.displayJSON = void 0;
const displayJSON = (json, lv = 0) => {
    const mkup = Object.entries(json).map(([k, v]) => (`${JSON.stringify(v)}<br/>`)).join('');
    return `${mkup}<br/>`;
    // if (typeof json != 'string') {
    //     json = JSON.stringify(json, undefined, 2).replace("[", "[\n").replace("},", "},\n").replace("]", "\n]");
    // }
    // json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match: any) {
    //     var cls = 'number';
    //     if (/^"/.test(match)) {
    //         if (/:$/.test(match)) {
    //             cls = 'key';
    //         } else {
    //             cls = 'string';
    //         }
    //     } else if (/true|false/.test(match)) {
    //         cls = 'boolean';
    //     } else if (/null/.test(match)) {
    //         cls = 'null';
    //     }
    //     return '<span class="' + cls + '">' + match + '</span>';
    // });
};
exports.displayJSON = displayJSON;
exports.displayJSONStyles = `
pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
.string { color: green; }
.number { color: darkorange; }
.boolean { color: blue; }
.null { color: magenta; }
.key { color: red; }
`;
