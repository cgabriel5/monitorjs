(function() {

    "use strict";

    var library = (function() {

        // =============================== Helper Functions

        /**
         * @description [Generates a simple ID containing letters and numbers.]
         * @param  {Number} length [The length the ID should be. Max length is 22 characters]
         * @return {String}        [The newly generated ID.]
         * @source {http://stackoverflow.com/a/38622545}
         */
        function id(length) {
            return Math.random().toString(36).substr(2, length);
        }
        /**
         * @description [Returns index of given value in provided array.]
         * @param  {Array}    array [The array to check against.]
         * @param  {Integer}  value [The value to check.]
         * @return {Integer}        [Returns the index value. -1 if not in array.]
         */
        function index(array, value) {
            return array.indexOf(value);
        }
        /**
         * @description [Checks if the given value is in provided array or string.]
         * @param  {Array|String}   iterable [The array or string to check against.]
         * @param  {Any}            value    [The value to check.]
         * @return {Boolean}                 [description]
         * @source [https://www.joezimjs.com/javascript/great-mystery-of-the-tilde/]
         * @source [http://stackoverflow.com/questions/12299665/what-does-a-tilde-do-
         * when-it-precedes-an-expression/12299717#12299717]
         */
        function includes(iterable, value) {
            return -~index(iterable, value);
        }
        /**
         * @description [Checks if the provided index exists.]
         * @param  {Number} index [The index (number) to check.]
         * @return {Boolean}       [False if -1. Otherwise, true.]
         */
        function indexed(index) {
            return (-~index ? true : false);
        }
        /**
         * @description [Makes an Array from an array like object (ALO). ALO must have a length property
         *               for it to work.]
         * @param  {ALO} alo [The ALO.]
         * @return {Array}   [The created array.]
         */
        function to_array(alo) {
            // vars
            var true_array = [];
            // loop through ALO and pushing items into true_array
            for (var i = 0, l = alo.length; i < l; i++) true_array.push(alo[i]);
            return true_array;
        }
        /**
         * @description [Returns the data type of the provided object.]
         * @param  {Any} object [The object to check.]
         * @return {String}    [The data type of the checked object.]
         */
        var dtype = function(object) {
            // will always return something like "[object {type}]"
            return Object.prototype.toString.call(object)
                .replace(/(\[object |\])/g, "")
                .toLowerCase();
        };
        /**
         * @description [Check if the provided object is of the provided data types.]
         * @param  {Any} object [The object to check.]
         * @param  {String}  types  [The allowed data type the object may be.]
         * @return {Boolean}        [Boolean indicating whether the object is of the
         *                           allowed data types.]
         */
        dtype.is = function(object, types) {
            // get the object type
            var type = this(object);
            // prepare the types
            types = "|" + types.toLowerCase().trim() + "|";
            // check if the object's type is in the list
            return Boolean((-~types.indexOf("|" + type + "|")));
        };
        /**
         * @description [Check if the provided object is not of the provided data types.]
         * @param  {Any} object [The object to check.]
         * @param  {String}  types  [The prohibited data types.]
         * @return {Boolean}        [Boolean indicating whether the object is not of the
         *                           allowed data types.]
         */
        dtype.isnot = function(object, types) {
            // return the inverse of the is method
            return !(this.is(object, types));
        };
        /**
         * @description [A class wrapper. Creates a class based on provided object containing class constructor__ and methods__.
         *               If class needs to extend another, provide it under the extend__ property.]
         * @param  {Object} cobject [The class object containing three properties: constructor__, methods__, and extend__.
         *                           .constructor__ {Function}       [The class constructor]
         *                           .methods__     {Object}         [Object containing class methods.]
         *                           .extend__      {Boolean|Object} [Set to false if does not need to extend. Otherwise, provide the
         *                                                            class to extend.]
         *                           ]
         * @return {Function}         [Returns class constructor.]
         */
        function class__(cobject) {

            // cache class data
            var constructor = cobject.constructor__,
                methods = cobject.methods__,
                parent = cobject.extend__;

            // extend if parent class provided
            if (parent) {
                constructor.prototype = Object.create(parent.prototype);
                constructor.prototype.constructor = constructor;
            }

            // cache prototype
            var prototype = constructor.prototype;

            // add class methods to prototype
            for (var method in methods) {
                if (methods.hasOwnProperty(method)) {
                    prototype[method] = methods[method];
                }
            }

            return constructor;

        }

        // =============================== Core Library Functions

        /**
         * @description [Normalize the passed in parameters. As the functions signature varies,
         *               the arguments need to be normalized.]
         * @return {Array} [The normalized array containing the passed in arguments.]
         */
        function normalize_args() {

            // http://stackoverflow.com/a/960870
            // var args = [].slice.call(arguments);

            // work the arguments
            var args = arguments,
                argl = args.length;

            // args can either be 2 items or 1
            if (!-~[1, 2].indexOf(argl)) return [];

            // convert arguments to an array
            if (argl === 2) {
                args = [
                    [arguments[0], arguments[1]]
                ];
            } else {
                if (dtype(arguments[0], "object")) {
                    // turn the object into an array
                    args = [];
                    var obj = arguments[0];
                    for (var key in obj) {
                        args.push([key, obj[key]]);
                    }
                }
            }

            // return the normalized arguments
            return args;

        }

        // =============================== Library Class

        var Library = class__({

            // class constructor
            "constructor__": function(controller, object) {

                // if user does not invoke query with new keyword we use it for them by
                // returning a new instance of the selector with the new keyword.
                if (!(this instanceof Library)) return new Library(controller, object);

                // set the controller
                this.controller = (controller || undefined);
                this.object = (object || {});

            },

            // class methods
            "methods__": {

                // trigger methods
                "set": function() {

                    // cache the object
                    var _ = this,
                        object = _.object,
                        args = normalize_args.apply(null, arguments);

                    // loop through array and set the key::value pairs
                    for (var i = 0, l = args.length; i < l; i++) {
                        // cache the current pair
                        var pair = args[i],
                            key = pair[0],
                            value = pair[1];

                        // check whether the key exists
                        var check = _.hasKey(key);

                        var type = (check ? "update" : "add");
                        var old_value = (check ? object[key] : undefined);

                        // set the value
                        object[key] = (value || undefined);

                        // call the callback (controller) if provided
                        if (this.controller) this.controller.call(_, key, type, value, old_value, Date.now());
                    }

                },
                "unset": function(property) {

                    // cache the object
                    var _ = this,
                        object = _.object,
                        args = to_array(arguments);

                    // loop through array and unset keys
                    for (var i = 0, l = args.length; i < l; i++) {
                        // cache the current pair
                        var key = args[i];

                        // check whether the key exists
                        var check = _.hasKey(key);

                        // if key does not exists skip iteration
                        if (!check) continue;

                        // var type = (check ? "update" : "add");
                        var old_value = (check ? object[key] : undefined);

                        // unset the value
                        delete object[key];

                        // call the callback (controller) if provided
                        if (this.controller) this.controller.call(_, key, "delete", undefined, old_value, Date.now());
                    }

                },
                "trigger": function() {

                    // cache the object
                    var _ = this,
                        object = _.object,
                        args = to_array(arguments);

                    // loop through array and unset keys
                    for (var i = 0, l = args.length; i < l; i++) {
                        // cache the current pair
                        var key = args[i];

                        // if key does not exists skip iteration
                        if (!_.hasKey(key)) continue;

                        // call the callback (controller) if provided
                        if (this.controller) this.controller.call(_, key, "trigger", object[key], undefined, Date.now());
                    }

                },
                // helper methods
                "get": function(property) {

                    // cache the object
                    var _ = this,
                        object = _.object;

                    return object[property] || undefined;

                },
                "keys": function() {

                    // cache the object
                    var _ = this,
                        object = _.object,
                        keys = [];

                    for (var key in object) {

                        if (_.hasKey(key)) keys.push(key);

                    }

                    // return the keys
                    return keys;

                },
                "entries": function() {

                    // cache the object
                    var _ = this,
                        object = _.object,
                        entries = [];

                    for (var key in object) {

                        if (_.hasKey(key)) entries.push([key, object[key]]);

                    }

                    // return the keys
                    return entries;

                },
                "hasKey": function(key) {

                    // cache the object
                    var _ = this,
                        object = _.object;

                    // return boolean indicating whether the object has the provided key
                    return (object.hasOwnProperty(key) ? true : false);

                },
                "keyHasValue": function(key, value) {

                    // cache the object
                    var _ = this,
                        object = _.object;

                    // return boolean indicating whether the object has the provided key
                    return ((_.hasKey(key) && object[key] === value) ? true : false);

                },
                "raw": function(clone) {

                    // cache the object
                    var _ = this,
                        object = _.object;

                    // clone the object if clone flag provided
                    if (clone) {

                        // create the new object
                        var obj = {};
                        // copy the properties
                        for (var key in object) {
                            if (_.hasKey(key)) {
                                obj[key] = object[key];
                            }
                        }
                        // reset the object ref
                        object = obj;

                    }

                    // return boolean indicating whether the object has the provided key
                    return object;

                }
            },

            // class to extend
            "extend__": false

        });

        // return library to add to global scope later...
        return Library;

    })();

    // =============================== Global Library Functions/Methods/Vars

    // =============================== Attach Library To Global Scope

    // add to global scope for ease of use
    // use global app var or create it if not present
    var app = (window.app || (window.app = {}));
    // get the libs object from within the app object
    // if it does not exist create it
    var libs = (app.libs || (app.libs = {}));
    // add the library to the libs object
    libs.Monitor = library;

})();
