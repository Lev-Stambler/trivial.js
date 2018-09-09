class module {
    //fix replacingAttr array issue

    constructor(tagName, innerReplace, replacingObjects) {
        this._tagName = tagName;
        this._rawInnerHTML = innerReplace;
        this._replacingObjects = replacingObjects;
        this._hasInitialized = false;
        this.varOpener = '<(';
        this.varCloser = ')>';
        this.attributeOpener = '<{';
        this.attributeCloser = '}>';
        this._currentInnerHtml = [];
        this._replacingAttributes = [];
        this._css = '';
        this._shadowDOM = false;
        this._cssNode = document.createElement('style');
        this._cssNode.type = 'text/css';
        this._jsNode = document.createElement('script');
        this._jsNode.type = 'text/javascript';
        this._originalHTML = [];
    }


    set shadowRoot(isShadow) {
        if (isShadow) {
            this._shadowDOM = true;
            if (this._hasInitialized)
                for (var i = 0; i < this._tags.length; i++)
                    this.init();
        }
        else {
            if (this._shadowDOM) this.init();
            this._shadowDOM = false;
        }
    }

    set css(cssCode) {
        this.setCss(cssCode);
    }


    set attributeOpener(opener) {
        this._attributeOpener = this.escapeRegex(opener);
    }

    set attributeCloser(closer) {
        this._attributeCloser = this.escapeRegex(closer);
    }

    set varOpener(opener) {
        this._varOpener = this.escapeRegex(opener)
    }

    set varCloser(closer) {
        this._varCloser = this.escapeRegex(closer)
    }

    set tagName(newTagName) {
        this._tagName = newTagName
        if (this._hasInitialized) this.init()
    }

    set innerHTML(newInnerReplace) {
        this._rawInnerHTML = newInnerReplace
        if (this._hasInitialized) this.init()
    }

    set replacingObjects(newReplacingObjects) {
        //add more complexity to this one later. Maybe have appending replacing object etc
        this._replacingObjects = newReplacingObjects
        if (this._hasInitialized) this.init()
    }

    setJavascriptSource(url) {
        const scope = this;
        $.get(url, function (res) {
            scope.setJavsascript(res)
        });
    }


    setCSSSource(url) {
        const scope = this;
        $.get(url, function (res) {
            scope.setCss(res);
        });
    }

    setJSSource(url) {
        const scope = this;
        $.get(url, function (res) {
            scope.setJS(res);
        });
    }

    setHTMLSource(url) {
        const scope = this;
        $.get(url, function (res) {
            scope.innerHTML = res;
        });

    }

    setJS(jsCode) {
        //for now on sets init must be done inorder to find all components and add necessary stuff
        if (!this._hasInitialized) this.init();

        this._jsNode.appendChild(document.createTextNode(jsCode));

        for (var i = 0; i < this._tags.length; i++) {
            if (this._shadowDOM) this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].shadowRoot.innerHTML += this._jsNode.outerHTML;
            else this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].innerHTML += this._jsNode.outerHTML;
        }
        return true;
    }

    setCss(cssCode) {
        //for now on sets init must be done inorder to find all components and add necessary stuff
        if (!this._hasInitialized) this.init();

        if (this._cssNode.styleSheet) {
            // This is required for IE8 and below.
            this._cssNode.styleSheet.cssText += cssCode;
        }
        else {
            this._cssNode.appendChild(document.createTextNode(cssCode));
        }
        for (var i = 0; i < this._tags.length; i++) {
            if (this._shadowDOM) this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].shadowRoot.innerHTML += this._cssNode.outerHTML;
            else this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].innerHTML += this._cssNode.outerHTML;
        }
        return true;
    }

    refreshCss() {
        for (var i = 0; i < this._tags.length; i++) {
            if (this._shadowDOM) {
                let styleTag = this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].getElementsByTagName('style');
                if (styleTag.length > 0) {
                    for (var j = 0; j < styleTag.length; j++)
                        styleTag[j].outerHTML = styleTag[j].outerHTML.split(this._cssNode).join('');
                }
                // if (this._tags[i].getElementsByTagName('style'))
                this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].shadowRoot.innerHTML += this._cssNode.outerHTML;
            }
            else {
                let styleTag = this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].getElementsByTagName('style');
                if (styleTag.length > 0) {
                    for (var j = 0; j < styleTag.length; j++)
                        styleTag[j].outerHTML = styleTag[j].outerHTML.split(this._cssNode).join('');
                }
                this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].innerHTML += this._cssNode.outerHTML;
            }
        }
    }
    //shadow dom does not work with this : (
    refreshJS() {
        for (var i = 0; i < this._tags.length; i++) {
            if (this._shadowDOM) {
                let scriptTag = this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].getElementsByTagName('script');
                if (scriptTag.length > 0) {
                    for (var j = 0; j < scriptTag.length; j++)
                        scriptTag[j].outerHTML = scriptTag[j].outerHTML.split(this._jsNode).join('');
                }
                // if (this._tags[i].getElementsByTagName('script'))
                this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].shadowRoot.innerHTML += this._jsNode.outerHTML;
            }
            else {
                let scriptTag = this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].getElementsByTagName('scirpt');
                if (scriptTag.length > 0) {
                    for (var j = 0; j < scriptTag.length; j++)
                    scriptTag[j].outerHTML = scriptTag[j].outerHTML.split(this._cssNode).join('');
                }
                this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].innerHTML += this._jsNode.outerHTML;
            }
        }
    }


    addEvent(event, func) {
        if (!this._hasInitialized) this.init()
        for (var i = 0; i < this._tags.length; i++) {
            const funcString = this.replaceAllAttributes(this.replaceVar(String(func), i), this._replacingAttributes, this._tags[i]);
            if (this._shadowDOM)
                this._tags[i].getElementsByClassName("moduleOuterSpanTag" + this._tagName)[0].shadowRoot.addEventListener(event, eval(funcString));
            else this._tags[i].addEventListener(event, eval(funcString));
        }

        return true
    }

    escapeRegex(string) {
        const toEscape = '.^$*+?()[]{}\\|&-<>'.split('')
        const backSlash = String('\\')
        for (var i = 0; i < toEscape.length; i++) {
            const re = new RegExp(backSlash + toEscape[i], 'g');
            string = string.replace(re, (backSlash + toEscape[i]).replace(/\\\\/g, '\\'));
            //slow but seems to be only way to not interfere with input text yet replace the \\ with \
        }
        return string.replace(/[\n\t]/g, '')
    }

    init(callback) {
        document.createElement(this._tagName);
        this._replacingAttributes = this.findAttributes(this._rawInnerHTML, []);

        this._tags = document.getElementsByTagName(this._tagName);
        const spanClass = "moduleOuterSpanTag" + this._tagName;

        for (var i = 0; i < this._tags.length; i++) {

            if (this._tags[i].getElementsByClassName(spanClass).length < 1) this._originalHTML.splice(i, 0, this._tags[i].innerHTML);
            this._varReplacedInnerHTML = this.replaceVar(this._rawInnerHTML, i);
            let outerSpan;
            let newInnerReplace = '';
            this._replacingAttributes = this.findAttributes(this._varReplacedInnerHTML, []);

            newInnerReplace = this.replaceAllAttributes(this._varReplacedInnerHTML, this._replacingAttributes, this._tags[i]);
            outerSpan = document.createElement('span');

            outerSpan.className += spanClass;
            //if else to handle null innercurrenthtml
            //filtered html is html not javascript generated
            // let filteredHtml = '';
            // if (this._currentInnerHtml[i] === undefined && this._tags[i].getElementsByClassName(spanClass).length > 0) {
            //     if (this._shadowDOM)
            //         filteredHtml = this._tags[i].getElementsByClassName(spanClass)[0].shadowRoot.innerHTML;
            //     else filteredHtml = this._tags[i].getElementsByClassName(spanClass)[0].innerHTML;
            // }
            // else if (this._tags[i].getElementsByClassName(spanClass).length > 0) {
            //     const re = this._currentInnerHtml[i];
            //     if (this._shadowDOM)
            //         filteredHtml = this._tags[i].getElementsByClassName(spanClass)[0].shadowRoot.innerHTML.split(re).join('');
            //     else filteredHtml = this._tags[i].getElementsByClassName(spanClass)[0].innerHTML.split(re).join('');
            // }
            // else {
            //     filteredHtml = this._tags[i].innerHTML;
            // }
            if (this._shadowDOM) {
                outerSpan.attachShadow({ mode: 'open' });
                outerSpan.shadowRoot.innerHTML = newInnerReplace;// + filteredHtml;
                outerSpan.shadowRoot.innerHTML += this._cssNode.outerHTML;
            }
            else {
                outerSpan.innerHTML = newInnerReplace;// + filteredHtml;
                outerSpan.innerHTML += this._cssNode.outerHTML;

            }
            this._tags[i].innerHTML = '';
            this._tags[i].append(outerSpan);

            //the html has to be evaluated in order to correct errors in html and normalize            
            // this._currentInnerHtml[i] = newInnerReplace.evaluateHTML();//outerSpan.outerHTML;
        }
        this._hasInitialized = true;
        try {
            callback(true);
        }
        catch {
            return true;
        }
    }

    findAttributes(nonReplacedString, arr) {
        const openRegex = this._attributeOpener;
        const closeRegex = this._attributeCloser;
        const filteredAttributeOpener = openRegex.replace(/\\/g, '');
        const filteredAttributeCloser = closeRegex.replace(/\\/g, '')
        if (nonReplacedString.indexOf(filteredAttributeOpener) === -1) return arr;
        else {
            const opening = nonReplacedString.indexOf(filteredAttributeOpener);
            const closing = nonReplacedString.indexOf(filteredAttributeCloser);
            const attribute = nonReplacedString.substring(opening + filteredAttributeOpener.length, closing);
            arr.push(attribute);
            nonReplacedString = nonReplacedString.substring(closing + filteredAttributeCloser.length);
            return this.findAttributes(nonReplacedString, arr);
        }
    }

    replaceAllAttributes(nonReplacedString, attributes, tag) {
        for (var i = 0; i < attributes.length; i++) {

            const replaceString = this._attributeOpener + attributes[i] + this._attributeCloser;
            const re = new RegExp(replaceString, 'g');
            nonReplacedString = nonReplacedString.replace(re, tag.getAttribute(attributes[i]));
        }
        return nonReplacedString;

    }

    replaceVar(nonReplacedString, count) {
        nonReplacedString = this.replaceInheritVar(nonReplacedString, count);
        for (var key in this._replacingObjects) {

            const replaceString = this._varOpener + key + this._varCloser;
            const re = new RegExp(replaceString, 'g');
            nonReplacedString = nonReplacedString.replace(re, this._replacingObjects[key]);
        }
        return nonReplacedString;
    }

    replaceInheritVar(nonReplacedString, count) {

        const reCount = RegExp((this._varOpener + 'count' + this._varCloser), 'g');
        nonReplacedString = nonReplacedString.replace(reCount, count);

        const reCountFromOne = RegExp((this._varOpener + 'countFromOne' + this._varCloser), 'g');
        nonReplacedString = nonReplacedString.replace(reCountFromOne, count + 1);

        const reInnerHTML = RegExp((this._varOpener + 'innerHTML' + this._varCloser), 'g');
        nonReplacedString = nonReplacedString.replace(reInnerHTML, this._originalHTML[count]);

        return nonReplacedString;

    }

}

var trivial = {
    //needs to be on dom change
    updatingModule: function (classes) {
        this.updateAll = function () {
            if (Object.prototype.toString.call(classes) === '[object Array]') {
                for (var i = 0; i < classes.length; i++) {
                    classes[i].init();
                    classes[i].refreshCss();
                    //instead of having it initialize make it so that the tags are updated and that the currentHtml[i] is updated
                    //nmvnd you will have to make the init function eval the different tags
                }
            }
            else {
                document.addEventListener('change', function () {
                    classes.init();
                    classes.refreshCss();
                });
            }
        }
    },
    updateAll: '',
    refreshOnDOMChange: function (classes) {
        if (Object.prototype.toString.call(classes) === '[object Array]') {
            document.getElementsByTagName('body')[0].addEventListener('change', function () {
                for (var i = 0; i < classes.length; i++) {
                    classes[i].init();
                    classes[i].refreshCss();
                    //instead of having it initialize make it so that the tags are updated and that the currentHtml[i] is updated
                    //nmvnd you will have to make the init function eval the different tags
                }
            });
        }
        else {
            document.addEventListener('change', function () {
                classes.init();
                classes.refreshCss();
            });
        }
    }
}

String.prototype.evaluateText = function () {
    let htmlEval = document.createElement('span');
    htmlEval.innerHTML = this;
    return htmlEval.innerText;
}

String.prototype.evaluateHTML = function () {
    let htmlEval = document.createElement('span');
    htmlEval.innerHTML = this;
    return htmlEval.innerHTML;
}

// customElements.define('trivial-module', module);
