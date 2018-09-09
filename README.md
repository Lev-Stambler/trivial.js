# trivial.js

## Summary

The idea of this framework-esc javascript library is so that frontend developers, creating static websites can simply import the library with a script tag:

```
<script src = 'https://hostingLink/trivial.js'></script>
```
This library gives the tools needed to create custom tags, which we call modules. The constructor for the module is made up of the tag name, the HTML, and the replacing variables (see **module.replacingObjects**).
Every created module is class based, so one could make a template for a module like: 

```
class customMod extends module {
  constructor() {
    const html = `<div class = 'superCool'>
      <{superCoolVar}>
    </div>`;
    super('tagName', html, { superCoolVar: "ecstatic" })
  }
}
```

