let storedHTML = [];
let HTMLFound = [];
let HTMLLoading = [];

class singlePageLink extends module {
    constructor(fadeTime) {

        const innerScript = `<a><(innerHTML)></a>\<script\>
                            if (!HTMLLoading['<{src}>'] || HTMLLoading['<{src}>'] === undefined) {
                                console.log('z');
                                HTMLLoading['<{src}>'] = true;
                                $.get(\`<{src}>\`, (res) => {
                                    storedHTML["<{src}>"] =  res;    
                                    HTMLFound["<{src}>"] = true;
                                });
                            }                        
                        \</script\>`;
        super('a-sp', innerScript, { fadeTime });
        const superScope = this;
        super.init(() => {
            var j = 0;

            // let defaultInnerSet = false;
            function checkForSourceFound() {
                setTimeout(() => {
                    let htmlLoaded = true
                    for (j =j; j < HTMLFound.length; j++) {
                        if (eval('HTMLFound[\'<{src}>\']') === false) {
                            htmlLoaded = false, checkForSourceFound();
                            break;
                        }
                    }
                    if (htmlLoaded === true) {
                        superScope.addEvent('click', (e) => {
                            e.preventDefault();
                            $('#<{containerid}>').fadeOut(0, () => {
                                const setContainerHTMLScript = `document.getElementById('<{containerid}>').innerHTML = storedHTML["<{src}>"]`;
                                eval(setContainerHTMLScript);
                                $(document).trigger('domChanged');
                                const scriptTags = eval(`document.getElementById('<{containerid}>')`).getElementsByTagName('script');
                                for(var i = 0; i < scriptTags.length; i++) eval (scriptTags[i].innerHTML);

                                $('#<{containerid}>').fadeIn(parseInt('<(fadeTime)>'), () => {
                                });

                            });
                        });
                    }

                }, 20)
            }
            checkForSourceFound();
            setTimeout(() => {
                eval();
            }, 20);
        });
        
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