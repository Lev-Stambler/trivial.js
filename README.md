# trivial.js

## Summary

The idea of this framework-esc javascript library is so that frontend developers, creating static websites can simply import the library with a script tag:

```
<script src = 'https://hostingLink/trivial.js'></script>
```
This library gives the tools needed to create custom tags, which we call modules. 

## Usage

### The Basics

The constructor for the module is made up of **the tag name, the HTML, and the replacing variables** (see **module.replacingObjects**).
Every created module is class based, so one could make a template for a module like: 

```
class customMod extends module {
  constructor() {
    const html = `<div class = 'superCool'>
      <{var}>
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
  <{superCoolVar}>
</div>`;
const customTag = new module('tagName', html, { var: "ecstatic" });
customTag.init();
```

The above yields the same results as creating the custom class.

### Replacing Variables

The HTML that is inputed into a module can have variables within the HTML. These can be defined in third input to the module constructor. 
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

the innerHTML variable will be set equal to what was inside a custom tag **before** init() is called on the tag. After init() is wiped the innerHTML will be stored within a variable but not visible in the web page unless the <()>:

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

## Authors

* **Lev Stambler** - *Initial work* - [Lev-Stambler](https://github.com/Lev-Stambler)

**Currently Lev Stambler is the only contributor. If you are intersted in contributing, please leave a comment below. (I read them all for now)**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
