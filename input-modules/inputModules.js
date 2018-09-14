class inputModule extends module {
    constructor() {
        super('inputmodule', `<input id="trivial-input-<(count)>" />
        <script>
        let inputElement = document.getElementById('trivial-input-<(count)>');
        const inputModElement = document.getElementsByTagName('inputmodule')[<(count)>];
        const attrs = inputModElement.attributes.value;
        for (var key in attrs) {
            inputElement.setAttribute(key, attrs[key]);
        }
        </script>`, {});
        super.init();
    }
}

const input = new inputModule();
// input.setHTMLSource('/input-modules/inputHTML.triv');
// input.setJSSource('/input-modules/inputJS.triv');
