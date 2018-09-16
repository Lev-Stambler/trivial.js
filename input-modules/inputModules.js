class inputModule extends module {
    constructor() {
        super('inputmodule', `<input id="trivial-input-<(count)>" />
        <script>
            
            let inputElement = document.getElementById('trivial-input-<(count)>');
            let inputModElement = document.getElementsByTagName('inputmodule')[<(count)>];

            // inputElement.className = inputModElement.className;
            // inputModElement.className = '';

            // const id = inputModElement.id;
            // inputModElement.id = '';
            // inputElement.id = id;

            // const type = inputModElement.getAttribute('type');
            // inputElement.type = type;
            // inputModElement.type = '';


             for (var i = 0, atts = inputModElement.attributes, n = atts.length, arr = []; i < n; i++){

                inputElement.setAttribute(atts[i].nodeName, atts[i].nodeValue);
                inputModElement.setAttribute(atts[i].nodeName, '');
            }
            if(inputElement.getAttribute('type') === 'submit') {
                if(inputElement.getAttribute('onclick') === '') inputElement.setAttribute('onclick', trivialFormValidate);
            }

            if(\`<(innerHTML)>\`.replace(/\\n/g, '') !== '') inputElement.value = \`<(innerHTML)>\`; 
            
        </script>`, {});
    }
}

const input = new inputModule();
input.init();
// input.setHTMLSource('/input-modules/inputHTML.triv');
// input.setJSSource('/input-modules/inputJS.triv');
