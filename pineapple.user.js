// ==UserScript==
// @name         Pineapple-Devloader
// @license      MIT (https://opensource.org/licenses/MIT)
// @version      1.0.0
// @match        https://docs.python.org/3/*
// @run-at       document-end
// ==/UserScript==

const CSS = [
    {
        s: "body",
        r: `font-size: 14px;`
    },
    {
        s: "div.body",
        r: `max-width: initial;`
    },
    {
        s: ".sphinxsidebarwrapper",
        r: `position: relative;`
    },
    {
        s: "pre",
        r: `background: #f5f5f5;`
    },
    {
        s: ".versionmodified",
        r: `color: red; font-weight: bold; font-size: 110%;`,
    },
];

(() => {
    const $hr = $(`hr.docutils`);

    const docData = $(`dt code.descname`).map((i,e) => {
        const $e = $(e).parent();
        const className = $e.find(".descclassname").text();
        const methodName = $e.find(".descname").text();
        const url = $e.find("a.headerlink").attr("href");
        return {className, methodName, url}
    }).get();

    $hr.after(`<div style="width: 100%; display: flex; flex-direction: column;">
        <h4>Module Contents</h4>
        <div style="column-count: 4">
            ${docData.map(dd => `<div style="width: 100%; margin-bottom: 1px; border-bottom: 1px solid #ccc; padding: 1px;">
                <a href="${dd.url}" style="display: block;">${dd.className}<b>${dd.methodName}</b></a>
            </div>`).join("")}
        </div>
    </div>`);
})();

window.addEventListener("load", () => {
    (function injectCss () {
        function addCss (sheet, selector, rules){
            const index = sheet.cssRules.length;
            try {
                if ("insertRule" in sheet) {
                    sheet.insertRule(selector + "{" + rules + "}", index);
                } else if ("addRule" in sheet) {
                    sheet.addRule(selector, rules, index);
                }
            } catch (e) {
                if ((!selector && selector.startsWith("-webkit-"))) {
                    console.error(e);
                    console.error(`Selector was "${selector}"; rules were "${rules}"`);
                }
            }
        }

        function addAllCss () {
            const targetSheet =  [...window.document.styleSheets]
                .reverse()[0];

            CSS.forEach(r => addCss(targetSheet, r.s, r.r));
        }

        addAllCss();
    })();
});
