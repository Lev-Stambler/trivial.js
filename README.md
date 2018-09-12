# trivial.js

## Summary

The idea of this framework-esc javascript library is so that frontend developers, creating static websites can simply import the library with a script tag:

```
<script src = 'https://hostingLink/trivial.js'></script>
```
The point is to make javascript and web dev simple, setupless, and susinct
This library gives the tools needed to create custom tags, which we call modules. 

## Usage

### The Basics of the Module Class

The constructor for the module is made up of **the tag name, the HTML, and the replacing variables** (see **module.replacingObjects**).
Every created module is class based, so one could make a template for a module like: 

```
class customMod extends module {
  constructor() {
    const html = `<div class = 'superCool'>
      <(var)>
    </div>`;
    super('tagName', html, { var: "ecstatic" })
  }
}
```

The to implement the module, an instance of the class must be made. So for the custom moudle class defined:

```
let customTag = new customMod();
```

Then in order to initialize the module and make all changes to the DOM `module.init()` must be called:
```
customTag.init();
```

A custom module does not have to be defined through extending the class though 
```
const html = `<div class = 'superCool'>
  <(superCoolVar)>
</div>`;
const customTag = new module('tagName', html, { var: "ecstatic" });
customTag.init();
```

The above yields the same results as creating the custom class.

### Replacing Variables

The HTML that is inputed into a module can have variables within the HTML. These can be defined in the third input to the module constructor. 
```
<describer></describer>

<script>
  const html = `<div class = 'superCool'>
    I am <(adj)>
  </div>`;
  const customTag = new module('describer', html, { adj: "blue" });
  customTag.init();
</script>
```
So within the describer tag, the user will see **I am blue** rather than **I am <(adj)>**

#### Inherit Variables

The trivial library also comes with inherit variables. For now, there are three: 
* count 
* countFromOne
* innerHTML.

count and countFromOne are similar. Count returns which instance of a module it is. countFromOne does the same, but rather than starting from 0 it starts from 1

```
<describer></describer><br/>
<describer></describer><br/>
<describer></describer>

<script>
  const html = `<div class = 'superCool'>
    I am number <(count)> and <(adj)>
  </div>`;
  const customTag = new module('describer', html, { adj: "blue" });
  customTag.init();
</script>
```
So the user will see: 
```
I am number 0 and blue
I am number 1 and blue
I am number 2 and blue
```

the innerHTML variable will be set equal to what was inside a custom tag **before** init() is called on the tag. After the first init() is called, the tag's inner HTML is set to null, and the innerHTML will be stored within a variable but not visible in the web page unless <(innerHTML)> is placed in the HTML:

```
<describer>one, da da da da da da dada. dadada da da da da I am number one!</describer>

<script>
  const html = `<div class = 'superCool'>
    I am number <(innerHTML)>
  </div>`;
  const customTag = new module('describer', html, { adj: "blue" });
  customTag.init();
</script>
```
So the user will see: 
```
I am number one, da da da da da da dada. dadada da da da da I am number one!
```

### Replacing Variables with a Tag's Attributes

The HTML that is inputed into a module can also have variables within the HTML which correspond to a tag's attributes. The syntax looks like `<{attribute}>`
```
<describer description = 'this is a cool library'></describer>

<script>
  const html = `<div class = 'superCool'>
    It's true that <{description}>
  </div>`;
  const customTag = new module('describer', html, {});
  customTag.init();
</script>
```
So within the describer tag, the user will see **It's true that this is a cool library** rather than **It's true that <{description}>**

### Shadow Root

trivial.js also comes with a convenient method to create a shadow root for each instance of the module.
```
const html = `<div class = 'superCool'>
  This will be a shadow root
</div>

<style>
div {
  background-color: red;
}
</style>`;
let customTag = new module('describer', html, {});
customTag.init();
customTag.shadowRoot = true;
```
In order to delete the shadow root, simply do `customTag.shadowRoot = false`

### Importing HTML, CSS, and Javascript

Simply call the function `setHTMLSource` with the url of the html as a parameter. Some servers and browsers automatically treat html files differently (i.e. they require the <html></html> tags and so on), so we recommend that the extention of the file is set to .triv (you know just to show the love)
```
let customTag = new module('describer', html, {});
customTag.init();
customTag.setHTMLSource('/myModHtml.triv');

```
myModHtml.triv may look something like this:
```
<div>
I am element number <(countFromOne)>. I know that this library is just the <{adj}>
</div>
<style>
  Some styling here
</style>
```

Loading CSS and Javascript are basically the same idea. For CSS just call the setCSSSource with the url as the parameter (ex `customTag.setCSSSource('/mySiteStyle.css')`) and with Javascript use the setJSSource (ex `customTag.setJSSource('/mySiteScript.js')`)

## The Trivial Object

#### trivial.initAll()
trivial.initAll() calls a function which calls the init() function of all module objects

#### trivial.updatingModule(classes)

trivial.updatingModule(classes) causes the inputed classes to call the init() function on a DOM change. If different modules are nested, the input argument of the updatingModule class must be in nested order. Check out the image gallery example for further explanation.

```
<module1>
  <module2>
    I am now bolded and large!
  </module2>
</module1>

<script>
  var module1 = new module('module1', `<h1><(innerHTML)></h1>`, {});
  var module2 = new module('module2', `<b><(innerHTML)></b>`, {});
  module1.init(function () {
    setTimeout(() => { module2.init() }, 10);
  });
  trivial.updatingModule([module1, module2]);

  //module 2 has to be put in after module 1
</script>
```


## Authors

* **Lev Stambler** - *Initial work* - [Lev-Stambler](https://github.com/Lev-Stambler)

**Currently Lev Stambler is the only contributor. If you are intersted in contributing, please leave a comment below. (I read them all for now)**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
