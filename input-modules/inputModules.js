class inputModule extends module {
    constructor() {
        super('inputmodule', ``, {});
        super.init();
    }
}

const input = new inputModule();
input.setHTMLSource('/input-modules/inputHTML.triv');
input.setJSSource('/input-modules/inputJS.triv');
