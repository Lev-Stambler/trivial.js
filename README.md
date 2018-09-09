# trivial.js

## Summary

The idea of this framework-esc javascript library is so that frontend developers, creating static websites can simply import the library with a script tag:

```
<script src = 'https://hostingLink/trivial.js'></script>
```
This library gives the tools needed to create custom tags, which we call modules. 

## Usage

### The Basics

The constructor for the module is made up of the tag name, the HTML, and the replacing variables (see **module.replacingObjects**).
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


## Authors

* **Lev Stambler** - *Initial work* - [Lev-Stambler](https://github.com/Lev-Stambler)

**Currently Lev Stambler is the only contributor. If you are intersted in contributing, please leave a comment below. (I read them all for now)**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
