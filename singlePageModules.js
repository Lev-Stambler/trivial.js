let storedHTML = [];
let HTMLFound = [];


class singlePageLink extends module {
    constructor(fadeTime, onLoad) {

        if(fadeTime === undefined) fadeTime = 0;


        const innerScript = `<a><(innerHTML)></a>\<script\>
                            $.get(\`<{src}>\`, (res) => {
                            storedHTML["<{src}>"] =  res;    
                            HTMLFound["<{src}>"] = true;
                        });
                        
                        \</script\>`;
        super('a-sp', innerScript, {});
        this.fadeTime = fadeTime;
        const superScope = this;
        super.init(() => {
            var i = 0;
            let defaultInnerSet = false;
            function checkForSourceFound() {
                setTimeout(() => {
                    console.log('aa')
                    let htmlLoaded = true
                    for (var j = 0; j < HTMLFound.length; j++) {
                        if (eval('HTMLFound[\'<{src}>\']') === false) {
                            htmlLoaded = false, checkForSourceFound();
                            break;
                        }
                    }
                    if (htmlLoaded === true) {
                        var fadingTime = superScope.fadeTime;
                        console.log(fadingTime)
                        superScope.addEvent('click', (e, fadingTime) => {
                            e.preventDefault();
                            console.log('aa');
                            $('#<{containerid}>').fadeOut(0);
                            const setContainerHTMLScript = `document.getElementById('<{containerid}>').innerHTML = storedHTML["<{src}>"]`;
                            $('#<{containerid}>').fadeIn(fadingTime);
                            eval(setContainerHTMLScript);
                        });
                    }
                }, 20)
            }
            checkForSourceFound();

            setTimeout(() => {
                eval();
            }, 20);
        });
        super.setCss(`a:hover {
            cursor: pointer;
        }`)
    }

}



class defaultHTML extends module {
    constructor () {
        super('default-html', `<script>
            $.get(\`<{src}>\`, (res) => {
                document.getElementsByTagName('default-html')[<(count)>].innerHTML = res;
            });
            </script>`, {});
        super.init();
    }
}

const defaultHTMLMod = new defaultHTML();