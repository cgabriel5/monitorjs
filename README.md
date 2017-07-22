# monitor (monitorjs)

Small library that monitors an object.

##### Table of Contents

[What It Does](#what-it-does)  
[Add To Project](#add-to-project)  
[Access Library](#access-library)  
[API](#api)   
* [Instance](#instance-api)
    * [Signature](#signature-api) 
    * [Instance Creation](#instance-creation)  
    * [QuickTable Methods](#instance-quicktable-methods-reference)  
    * [Methods](#instance-methods-long) 

[Usage](#usage)  
[Contributing](#contributing)  
[TODO](#todo)  
[License](#license)  

<a name="what-it-does"></a>
### What It Does

* Monitors an object for any changes (adding / updating / triggering / deleting properties).

<a name="add-to-project"></a>
### Add To Project

```html
<script src="path/to/lib.js"></script>
```

<a name="access-library"></a>
### Access Library

```js
var Monitor = window.app.libs.Monitor;
```

<a name="api"></a>
## API

<a name="instance-api"></a>

<a name="signature-api"></a>
### Instance Signature

```js
/**
 * @param  {String: Optional} controller [Main function to handle all object changes.]
 * @return {Object: Required} obj        [The object to monitor for changes.]
 */
```

<a name="instance-creation"></a>
### Instance Creation

**Note**: Using the `new` keyword is not necessary. The library will make sure to use it for when when you don't. 

```js
// this...
var monitor = new Monitor(controller, obj);
// is the same as this
var monitor = Monitor(controller, obj);
```
**Note**: A controller is not necessary. Using listeners via the `instance.on` method is perfectly fine.

```js
// this...
var monitor = new Monitor(null, obj);
// is the same as this
var monitor = Monitor(null, obj);
```

<a name="instance-quicktable-methods-reference"></a>
### Instance QuickTable Methods Reference

Method | Function
------------ | -------------
**get** | Gets the value at the provided object path.
**set** | Sets the provided value at the provided path.
**unset** | Removes the last property of the provided path.
**trigger** | Triggers the provided path.
**on** | Adds a object path listener.
**off** | Removes the object path listener.
**clearCache** | Clears the entire monitor's cache.

<a name="instance-methods-long"></a>
### Instance Methods

**monitor.get** &mdash; Gets the value at the provided object path.

```js
monitor.get("path1.path2");
```

**monitor.set** &mdash; Sets the provided value at the provided path.

```js
// set the "path1.path2" to 12
monitor.set("path1.path2", 12);
```

**Note**: A `conditions` object should be used when trying to modify the object via the `set` and `trigger` methods from within the `controller` or attached path listeners using the `on` method. The conditions object serves to hold flags which, depending on your codes logic, allow for certain object modifications to run. For example, when you pass in a certain flag inside the `conditions` object you can have the code return.


```js
// set the "path1.path2" to 12 + add a conditions object
monitor.set("path1.path2", 12, {"someCondition": true});
```

**monitor.unset** &mdash; Removes the last property of the provided path.

```js
monitor.unset("path1.path2");
```

**monitor.trigger** &mdash; Triggers the provided path.

```js
// trigger the "path1.path2"
monitor.trigger("path1.path2");

// trigger the "path1.path2" + give a value
monitor.trigger("path1.path2", 14);

// trigger the "path1.path2" + give an empty value + add a conditions object
monitor.set("path1.path2", undefined, {"someCondition": true});
```

**monitor.on** &mdash; Adds an object path listener.

Parameter | Description
------------ | -------------
**filter** | The provided path's RegExp.toString string.
**path** | The path being activated.
**type** | The type of change (`add`/`delete`/`update`).
**newValue** | The changes new value.
**oldValue** | The changes old value.
**time** | A timestamp of when the change occurred.
**conditions** | Any passed conditions.

```js
// listen to the path "path1.*"
monitor.on(/^path1.\.*/g, function(filter, path, type, newValue, oldValue, time, conditions) {
    // logic...
});

// use a string to listen to the "path1.path2" path
// Note**: String paths get convert to RegExp objects.
monitor.on("path1.path2", function(filter, path, type, newValue, oldValue, time, conditions) {
    // logic
});

// listen to th paths "path1.*" except "path1.path4"
monitor.on(/^path1(?!.path4).*/, function(filter, path, type, newValue, oldValue, time, conditions) {
    // logic
});
```

**monitor.off** &mdash; Removes the object path listener.

**Note**: When removing a listener the provide path must be the same path that was provided with the `instance.on` method.

```js
monitor.off("path1.path2");

// callback can be provided
monitor.off("path1.path2", function(path) {
    // logic...
});
```

**monitor.clearCache** &mdash; Clears the *entire* monitor's cache.

```js
monitor.clearCache();
```

<a name="usage"></a>
### Usage

For a better understanding check out `index.html` and `js/source/test.js`. `js/source/test.js` contains examples showing how the library is used.

<a name="contributing"></a>
### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](https://github.com/cgabriel5/monitorjs/blob/master/CONTRIBUTING.md).

### TODO

- [ ] Clean/re-work code for better performance.
- [ ] Implement monitor listener namespaces.
- [ ] Expand cache clearing functionality (i.e. clear only specific path caches).

<a name="license"></a>
### License

This project uses the [MIT License](https://github.com/cgabriel5/monitorjs/blob/master/LICENSE.txt).