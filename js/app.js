// define the profile var outside to access via console
var profile;

document.onreadystatechange = function() {

    "use strict";

    /* [functions.utils] */

    // get the libs

    var libs = app.libs,
        Monitor = libs.Monitor;

    // all resources have loaded (document + subresources)
    if (document.readyState == "complete") {

        var $name = document.getElementById("name");

        // create the object to monitor
        var obj = {
            "name": "John Doe"
        };

        // controller function to handle object changes
        var controller = function(propName, type, newValue, oldValue, time) {

            // define vars
            var msg;

            // if checks
            if (type === "add" || type === "trigger") {

                msg = "The property " + propName + " was added to object.";

                if (propName === "name") {
                    $name.textContent = newValue;
                }

            } else if (type === "update" || type === "trigger") {

                msg = "The property " + propName + " was updated to object.";

                if (propName === "name") {
                    $name.textContent = newValue;
                }

            } else if (type === "delete") {

                msg = "The property " + propName + " was deleted from object.";

                if (propName === "name") {
                    $name.textContent = "";
                }

            }

            // print the message
            console.log(msg);

        };

        // create new monitor
        profile = new Monitor(controller, obj);

    }

};

// http://stackoverflow.com/questions/6906108/in-javascript-how-can-i-dynamically-get-a-nested-property-of-an-object
// https://lodash.com/docs/4.17.4#set
