# monitor (monitorjs)

Small library that monitors an object.

##### Table of Contents

[What It Does](#what-it-does)  
[Add To Project](#add-to-project)  
[Access Library](#access-library)  
[Instance Creation](#instance-creation)  
[API](#api)   
* [Instance](#instance-api)
    * [QuickTable](#instance-quicktable-reference)  
    * [Methods](#instance-methods-long) 

[Usage](#usage)  
[Contributing](#contributing)  
[License](#license)  

<a name="what-it-does"></a>
### What It Does

* Monitors an object for any changes (adding / updating / triggering / deleting properties).

<a name="add-to-project"></a>
### Add To Project

```html
<script src="my_js_directory_path/monitor.js"></script>
```

<a name="access-library"></a>
### Access Library

```js
var Monitor = window.app.libs.Monitor;
```

<a name="instance-creation"></a>
### Instance Creation

```js
var monitor = new Monitor(controller, obj);
// p1: Optional Controller Function
// p2: The object to monitor

// Using the "new" keyword is not necessary. If not used
// the library will make sure to use it for you.
var monitor = Monitor(controller, obj);
```

<a name="api"></a>
### API
 
 <a name="instance-api"></a>
### API &mdash; Instance

<a name="instance-quicktable-reference"></a>
### Instance QuickTable Reference

Method | Function
------------ | -------------
**get** | Gets the value at the provided object path
**set** | Sets the provided value at the provided path
**unset** | Removes the last property of the provided path
**trigger** | Triggers the provided path
**on** | Adds a object path listener
**off** | Removes the object path listener

<a name="instance-methods-long"></a>
### Instance Methods

**monitor.get** Gets the value at the provided object path.

```js
monitor.get("path1.path2");
```

**monitor.get** Sets the provided value at the provided path.

```js
monitor.set("path1.path2", 12);
```

**monitor.unset** Removes the last property of the provided path.

```js
monitor.unset("path1.path2");
```

**monitor.trigger** Triggers the provided path.

```js
monitor.trigger("path1.path2");
```

**monitor.on** Adds a object path listener.

```js
monitor.on("path1.path2");
```

**monitor.off** Removes the object path listener.

```js
monitor.off("path1.path2");
```

<a name="usage"></a>
### Usage

For a better understanding check out `index.html` and `app.js`. `app.js` contains examples showing how the library is used.

<a name="contributing"></a>
### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](https://github.com/cgabriel5/monitorjs/blob/master/CONTRIBUTING.md).

<a name="license"></a>
### License

This project uses the [MIT License](https://github.com/cgabriel5/monitorjs/blob/master/LICENSE.txt).