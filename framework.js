class module {
    //fix replacingAttr array issue

    constructor(tagName, innerReplace, replacingObjects) {
        this._tagName = tagName;
        this._innerReplace = innerReplace;
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
    }


    set shadowDOM(isShadow) {
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

    set innerReplace(newInnerReplace) {
        this._innerReplace = newInnerReplace
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


    setCssSource(url) {
        const scope = this;
        $.get(url, function (res) {
            scope.setCss(res)
        });
    }


    setHtmlSource(url) {
        const scope = this;
        $.get(url, function (res) {
            scope.innerReplace = res;
        });

    }

    setCss(cssCode) {
        //for now on sets init must be done inorder to find all components and add necessary stuff
        this.init();
        const style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            // This is required for IE8 and below.
            style.styleSheet.cssText = cssCode;
        }
        else {
            style.appendChild(document.createTextNode(cssCode));
        }
        for (var i = 0; i < this._tags.length; i++) {
            if (this._shadowDOM) this._tags[i].getElementsByClassName("moduleOuterSpanIterate" + i + "Tag" + this._tagName)[0].shadowRoot.innerHTML += style.outerHTML;
            else this._tags[i].getElementsByClassName("moduleOuterSpanIterate" + i + "Tag" + this._tagName)[0].innerHTML += style.outerHTML;
        }
        return true;
    }



    setJavascript(jsCode) {
        if (!this._hasInitialized) this.init();
        const jsTag = document.createElement('script');
        if (jsTag.styleSheet) {
            // This is required for IE8 and below.
            style.styleSheet.cssText = cssCode;
        } else {
            jsTag.appendChild(document.createTextNode(jsCode));
        }
        for (var i = 0; i < this._tags.length; i++) {
            this._tags[i].appendChild(jsTag);
        }
        return true
    }

    addEvent(event, func, replacingObjects) {
        if (!this._hasInitialized) this.init()
        for (var key in replacingObjects) {
            const funcString = this.replaceVar(String(func), key, replacingObjects[key])
            for (var i = 0; i < this._tags.length; i++) {
                this._tags[i].addEventListener(event, eval(funcString))
            }
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

    init() {
        document.createElement(this._tagName);
        this._replacingAttributes = this.findAttributes(this._innerReplace, []);
        this._innerReplace = this.replaceVar(this._innerReplace);

        this._tags = document.getElementsByTagName(this._tagName);
        console.log(this._tags.length)
        for (var i = 0; i < this._tags.length; i++) {
            let outerSpan;
            let newInnerReplace = '';
            this._replacingAttributes = this.findAttributes(this._innerReplace, []);

            newInnerReplace = this.replaceAllAttributes(this._innerReplace, this._replacingAttributes, this._tags[i]);
            outerSpan = document.createElement('span');
            const spanClass = "moduleOuterSpanIterate" + i + "Tag" + this._tagName;
            outerSpan.className += spanClass;
            //if else to handle null innercurrenthtml
            //filtered html is html not javascript generated
            let filteredHtml = '';
            if (this._currentInnerHtml[i] === undefined && this._tags[i].getElementsByClassName(spanClass).length > 0) {
                if(this._shadowDOM)
                    filteredHtml = this._tags[i].getElementsByClassName(spanClass)[0].shadowRoot.innerHTML;
                else filteredHtml = this._tags[i].getElementsByClassName(spanClass)[0].innerHTML;
            }
            else if (this._tags[i].getElementsByClassName(spanClass).length > 0){
                
                const re = this._currentInnerHtml[i];
                console.log(re == this._tags[i].getElementsByClassName(spanClass)[0].innerHTML)
                if(this._shadowDOM)
                    filteredHtml = this._tags[i].getElementsByClassName(spanClass)[0].shadowRoot.innerHTML.split(re).join('');
                else filteredHtml = this._tags[i].getElementsByClassName(spanClass)[0].innerHTML.split(re).join('');
            }
            else {
                filteredHtml = this._tags[i].innerHTML;
            }
            if (this._shadowDOM) {
                outerSpan.attachShadow({ mode: 'open' });
                outerSpan.shadowRoot.innerHTML = newInnerReplace + filteredHtml;
            }
            else outerSpan.innerHTML = newInnerReplace + filteredHtml;
            
            this._tags[i].innerHTML = '';
            this._tags[i].append(outerSpan);

            //the html has to be evaluated in order to correct errors in html and normalize

            let htmlEval = document.createElement('span');
            htmlEval.innerHTML = newInnerReplace;
            this._currentInnerHtml[i] = htmlEval.innerHTML;//outerSpan.outerHTML;
        }
        this._hasInitialized = true;

        return true;
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

    replaceVar(nonReplacedString) {
        for (var key in this._replacingObjects) {
            const replaceString = this._varOpener + key + this._varCloser;
            const re = new RegExp(replaceString, 'g');
            nonReplacedString = nonReplacedString.replace(re, this._replacingObjects[key]);
        }
        return nonReplacedString;
    }

}

var trivial = {
    refreshOnDOMChange: function(classes) {
        if(Object.prototype.toString.call(classes) === '[object Array]') {
            document.addEventListener('change', function () {
                for(var i = 0; i < classes.length; i++) {
                    classes[i].init();
                }
            });
        }
        else {
            document.addEventListener('change', function () {
                classes.init();
            });
        }
    }
}