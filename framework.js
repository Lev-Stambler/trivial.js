class module {
    //fix replacingAttr array issue

    constructor(tagName, innerReplace, replacingObjects) {
        this._tagName = tagName;
        this._innerReplace = innerReplace;
        this._replacingObjects = replacingObjects;
        this._hasInitialized = false;
        this._varOpener = (this.varOpener = '{{');
        this._varCloser = (this.varCloser = '}}');
        this.attributeOpener = '|{';
        this.attributeCloser = '}|';
        this._currentInnerHtml = [];
        this._replacingAttributes = [];
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
        const toEscape = '.^$*+?()[]{}\\|'.split('')
        const backSlash = String('\\')
        for (var i = 0; i < toEscape.length; i++) {
            const re = new RegExp(backSlash + toEscape[i], 'g');
            string = string.replace(re, (backSlash + toEscape[i]).replace(/\\\\/g, '\\'));
            //slow but seems to be only way to not interfere with input text yet replace the \\ with \
        }
        return string
    }

    init() {
        document.createElement(this._tagName);
        this._replacingAttributes = this.findAttributes(this._innerReplace, []);
        for (var key in this._replacingObjects) {
            this._innerReplace = this.replaceVar(this._innerReplace, key, this._replacingObjects[key]);
        }
        this._tags = document.getElementsByTagName(this._tagName);
        
        for (var i = 0; i < this._tags.length; i++) {
            let newInnerReplace = '';
            this._replacingAttributes = this.findAttributes(this._innerReplace, []);

            console.log(i);
            newInnerReplace = this.replaceAllAttributes(this._innerReplace, this._replacingAttributes, this._tags[i]);
            const filteredHtml = this._tags[i].innerHTML.replace(this._currentInnerHtml[i], '');
            this._tags[i].innerHTML = newInnerReplace + filteredHtml;
            this._currentInnerHtml[i] = this.escapeRegex(this._tags[i].innerHTML);
        }
        this._hasInitialized = true
        return true
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
        for(var i = 0; i < attributes.length; i++) {
            console.log(attributes[i])
            const replaceString = this._attributeOpener + attributes[i] + this._attributeCloser;
            const re = new RegExp(replaceString, 'g');
            nonReplacedString = nonReplacedString.replace(re, tag.getAttribute(attributes[i]));
        }
        return nonReplacedString;
        // if (attributes.length < 1 || attributes === []) {

        //     return nonReplacedString;
        //     // else reject(null)
        // }
        // else {
        //     const attribute = attributes[attributes.length - 1];
        //     console.log(attribute)
        //     const replaceString = this._attributeOpener + attribute + this._attributeCloser;
        //     const re = new RegExp(replaceString, 'g');
        //     nonReplacedString = nonReplacedString.replace(re, tag.getAttribute(attribute));
        //     return this.replaceAllAttributes(nonReplacedString, attributes.splice(0, attributes.length - 1), tag);
        // }
    }

    replaceVar(nonReplacedString, key, val) {
        const replaceString = this._varOpener + key + this._varCloser;
        const re = new RegExp(replaceString, 'g');
        return nonReplacedString.replace(re, val);
    }

}

// <script src = 'C:/Users/levst/Documents/Programming/JS Framework/Front Render/framework.js'></script>  '\\{\\{' '\\}\\}'