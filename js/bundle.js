(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var soundmodels = require( 'soundmodels' );

$( document ).ready( function () {

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();

    // Save the name of the Sound Model class
    var modelClass = "";
    $( document )
        .ready( function () {
            var $jsmDropdownTitle = $( ".dropdown-toggle:first-child" );
            $( ".dropdown-toggle" )
                .dropdown();

            var location = ( window.location.href )
                .split( [ "#" ] )[ 1 ];

            window.onhashchange = urlChange;

            function urlChange() {
                window.location.reload();
                console.log( "reload " );
            }

            if ( typeof location !== 'undefined' ) {
                // Save models
                modelClass = location;
            } else {
                modelClass = $( ".dropdown-menu li:first-child" )
                    .text();
            }

            // Make the top dropdown title to be the last selected sound model
            $jsmDropdownTitle
                .html( modelClass + '<span class="caret"></span>' );
            // Make the selected value to be at the top
            $( ".dropdown-menu li a" )
                .click( function () {
                    $jsmDropdownTitle
                        .html( $( this )
                            .text() + '<span class="caret"></span>' );
                    $jsmDropdownTitle
                        .val( $( this )
                            .text() );
                } );

            // Swap models
            if ( typeof modelClass !== 'undefined' ) {
                swapModels( modelClass );
            }

        } );

    function swapModels( mc ) {

        var surfURL = "https://dl.dropboxusercontent.com/u/2117088/ocean_edge.mp3";
        var runURL = "https://dl.dropboxusercontent.com/u/2117088/WorkoutTrack.mp3";
        //var alienURL = "https://dl.dropboxusercontent.com/u/2117088/spaceship_11.mp3";
        var voiceURL = "https://dl.dropboxusercontent.com/u/77191118/sounds/gettysburg_address.mp3";

        // var bongoURL1 = "https://dl.dropboxusercontent.com/u/2117088/bongo1.wav";
        // var bongoURL2 = "https://dl.dropboxusercontent.com/u/2117088/bongo2.wav";
        // var bongoURL3 = "https://dl.dropboxusercontent.com/u/2117088/bongo3.wav";
        // var bongoURL4 = "https://dl.dropboxusercontent.com/u/2117088/bongo4.wav";

        // Buffer error with these files!!!
        var drumURL1 = "https://dl.dropboxusercontent.com/u/2117088/drum-2-1.mp3";
        var drumURL2 = "https://dl.dropboxusercontent.com/u/2117088/drum-2-2.mp3";
        var drumURL3 = "https://dl.dropboxusercontent.com/u/2117088/drum-2-3.mp3";
        var drumURL4 = "https://dl.dropboxusercontent.com/u/2117088/drum-2-4.mp3";

        var files = null;
        var Model = soundmodels.models[ mc ];

        // Switch files loading for different sound models
        switch ( mc ) {
        case "Looper":
        case "Activity":
            files = runURL;
            break;
        case "Trigger":
        case "MultiTrigger":
            files = [ drumURL1, drumURL2, drumURL3, drumURL4 ];
            break;
        case "Extender":
            files = surfURL;
            break;
        case "Scrubber":
            files = voiceURL;
            break;
        }

        // Load model class
        var sndModel = new Model( context, files, null, onLoad, onAudioStart, onAudioEnd );
        var $playerParams = $( '.player-params' );

        $( "#filebtn" )
            .on( 'change', handleFileSelect );

        function onAudioStart() {
            $( "#speaker" )
                .removeClass( "icon-nosound" )
                .addClass( "icon-sound" );
        }

        function onAudioEnd() {
            $( "#speaker" )
                .removeClass( "icon-sound" )
                .addClass( "icon-nosound" );
        }

        function onLoad( status ) {
            // After sound is loaded
            console.log( "Audio file Loaded: " + status );
            // Pass in the sound model object to tie interface to the model
            generateInterface( sndModel );
            // Generate sliders again everytime a new file is loaded.
            generateParam( sndModel );
        }

        function handleFileSelect( evt ) {
            // Load local sources
            var localSources = [];
            // FileList object
            var files = evt.target.files;
            // files is a FileList of File objects.
            for ( var i = 0; i < files.length; i++ ) {
                var f = files[ i ];
                localSources.push( f );
            }
            // Stop sound before setting source
            if ( sndModel.isPlaying ) {
                sndModel.stop();

            }
            // Remove sliders
            $playerParams.empty();
            sndModel.setSources( localSources, null, onLoad );
        }

        function generateInterface( snd ) {
            $( document )
                .ready( function () {
                    $( "#startbtn" )
                        .unbind( 'click' )
                        .attr( "disabled", false );
                    $( "#playbtn" )
                        .unbind( 'click' )
                        .attr( "disabled", false );
                    $( "#pausebtn" )
                        .unbind( 'click' )
                        .attr( "disabled", true );
                    $( "#stopbtn" )
                        .unbind( 'click' )
                        .attr( "disabled", true );
                    $( "#releasebtn" )
                        .unbind( 'click' )
                        .attr( "disabled", true );

                    // toggle sound
                    $( "#startbtn" )
                        .click( function () {
                            // toggle play button
                            //console.log( "play" );
                            snd.start( 0 );
                            $( "#pausebtn" )
                                .attr( "disabled", false );
                            $( "#stopbtn" )
                                .attr( "disabled", false );
                            $( "#releasebtn" )
                                .attr( "disabled", false );
                        } );

                    $( "#playbtn" )
                        .click( function () {
                            // toggle play button
                            //console.log( "play" );
                            snd.play();
                            $( "#pausebtn" )
                                .attr( "disabled", false );
                            $( "#stopbtn" )
                                .attr( "disabled", false );
                            $( "#releasebtn" )
                                .attr( "disabled", false );
                        } );

                    $( "#pausebtn" )
                        .click( function () {
                            //console.log( "pause" );
                            snd.pause();
                        } );
                    $( "#stopbtn" )
                        .click( function () {
                            //console.log( "stop" );
                            snd.stop( 0 );
                        } );

                    $( "#releasebtn" )
                        .click( function () {
                            //console.log( "release" );
                            snd.release();
                        } );

                    // Set Looper url sources
                    $( "#updateSource" )
                        .on( "click", function () {
                            // Get urls
                            var sourceurls = $( "#fileUrls" )
                                .val();
                            var sources = sourceurls.split( "," );
                            //console.log( sources, snd.isPlaying );
                            // Stop sound before setting source
                            if ( snd.isPlaying ) {
                                snd.stop();
                            }
                            // Remove sliders
                            $playerParams.empty();
                            snd.setSources( sources, onLoad );
                        } );

                } );
        }

        function generateParam( snd ) {
            // Loop through all the properties in Sound Model
            var allParams = snd.listParams();
            for ( var pIndex = 0; pIndex < allParams.length; pIndex++ ) {
                var param = allParams[ pIndex ];
                var paramName = param.name;
                //console.log( "props existed", paramName );
                var labelnode = "<div class='param-name'><label class='label label-info param-name'>" + paramName + "</label></div>";
                var slider = "<div class='pull-left param-slider'><div id='" + paramName + "' class='ui-slider'></div></div>";
                var switchBtn = "<div class='switch " + paramName + "'><input type='checkbox' checked data-toggle='switch' on-label='true' off-label='false' /></div>";
                var outputVal = "<div class='amount'><input type='text' id='" + paramName + "val' class='form-control input-sm' /></div>";
                // eventRand turns out to be a number!
                if ( typeof param.value === 'number' ) { // The rest of SPAudioParam
                    $playerParams
                        .append( "<div class='param-box'>" + labelnode + slider + outputVal + "</div>" );
                    makeSlider( param );
                } else if ( typeof param.value === 'boolean' ) {
                    $playerParams
                        .append( "<div class='param-box'>" + labelnode + switchBtn + outputVal + "</div>" );
                    makeSwitch( param );
                } else if ( param instanceof Array ) {
                    param.forEach( function ( thisArrayParam ) {

                        paramName = thisArrayParam.name;
                        var labelnode = "<div class='param-name'><label class='label label-info param-name'>" + paramName + "</label></div>";
                        var slider = "<div class='pull-left param-slider'><div id='" + paramName + "' class='ui-slider'></div></div>";
                        var switchBtn = "<div class='switch " + paramName + "'><input type='checkbox' checked data-toggle='switch' on-label='true' off-label='false' /></div>";
                        var outputVal = "<div class='amount'><input type='text' id='" + paramName + "val' class='form-control input-sm' /></div>";
                        if ( typeof thisArrayParam.value === 'number' ) { // The rest of SPAudioParam
                            $playerParams
                                .append( "<div class='param-box'>" + labelnode + slider + outputVal + "</div>" );
                            makeSlider( thisArrayParam );
                        } else if ( typeof thisArrayParam.value === 'boolean' ) {
                            $playerParams
                                .append( "<div class='param-box'>" + labelnode + switchBtn + outputVal + "</div>" );
                            makeSwitch( thisArrayParam );
                        }
                    } );
                }
            }
        }

        function makeSlider( param ) {
            // Make sliders
            $( "#" + param.name )
                .tickslider( {
                    step: 0.001,
                    min: param.minValue,
                    max: param.maxValue,
                    value: param.value,
                    slide: function ( event, ui ) {
                        // Update input label box
                        $( "#" + param.name + "val" )
                            .val( ui.value );
                        param.value = ui.value;
                    },
                    change: function ( event, ui ) {
                        param.value = ui.value;
                        //console.log( ui.value, snd[ id ].value );
                    }
                } );
            // Update text input when slider is sliding
            $( "#" + param.name + "val" )
                .val( $( "#" + param.name )
                    .tickslider( "value" ) );
            // Update Slider thumb with text input
            $( "#" + param.name + "val" )
                .change( function () {
                    $( "#" + param.name )
                        .tickslider( "value", this.value );
                } );
        }

        function makeSwitch( param ) {

            // Make switch
            $( "." + param.name )
                .bootstrapSwitch();

            $( "." + param.name )
                .bootstrapSwitch( "setState", param.value, true );

            $( "#" + param.name + "val" )
                .val( $( "." + param.name )
                    .bootstrapSwitch( "status" ) );

            $( "#" + param.name + "val" )
                .change( function ( event ) {
                    //console.log( "change", event.target.value );
                    if ( event.target.value === "false" ) {
                        $( "." + param.name )
                            .bootstrapSwitch( "setState", false, true );
                        param.value = false;
                    } else if ( event.target.value === "true" ) {
                        $( "." + param.name )
                            .bootstrapSwitch( "setState", true, true );
                        param.value = true;
                    }

                } );
            $( "." + param.name )
                .on( "switch-change", function ( event, data ) {
                    $( "#" + param.name + "val" )
                        .val( data.value );
                    param.value = data.value;
                    //console.log( "data ", data.value, snd[ param.name ].value );
                } );
        }
    }
} );

},{"soundmodels":8}],2:[function(require,module,exports){
(function (global){
/*soundmodels - v2.5.4 - Tue Apr 21 2015 11:27:00 GMT+0800 (SGT) */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SPAudioBuffer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function SPAudioBuffer(e,t,r,n,o){if(!(e instanceof AudioContext))return void log.error("First argument to SPAudioBuffer must be a valid AudioContext");var i,a,u,f;this.audioContext=e,this.duration=null,Object.defineProperty(this,"numberOfChannels",{get:function(){return this.buffer?this.buffer.numberOfChannels:0}}),Object.defineProperty(this,"sampleRate",{get:function(){return this.buffer?this.buffer.sampleRate:0}}),this.getChannelData=function(e){return this.buffer?this.buffer.getChannelData(e):null},this.isSPAudioBuffer=!0,Object.defineProperty(this,"buffer",{set:function(e){if(null===u)this.startPoint=0;else if(u>e.length/e.sampleRate)return void log.error("SPAudioBuffer : startPoint cannot be greater than buffer length");if(null===f)this.endPoint=this.rawBuffer_.length;else if(f>e.length/e.sampleRate)return void log.error("SPAudioBuffer : endPoint cannot be greater than buffer length");a=e,this.updateBuffer()}.bind(this),get:function(){return i}}),this.sourceURL=null,Object.defineProperty(this,"startPoint",{set:function(e){return void 0!==f&&e>=f?void log.error("SPAudioBuffer : startPoint cannot be greater than endPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : startPoint cannot be greater than or equal to buffer length"):(u=e,void this.updateBuffer())}.bind(this),get:function(){return u}}),Object.defineProperty(this,"endPoint",{set:function(e){return void 0!==u&&u>=e?void log.error("SPAudioBuffer : endPoint cannot be lesser than startPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : endPoint cannot be greater than buffer or equal to length"):(f=e,void this.updateBuffer())}.bind(this),get:function(){return f}}),this.updateBuffer=function(){if(a){if((null===u||void 0===u)&&(u=0),(null===f||void 0===f)&&(f=a.duration),this.duration=f-u,this.length=Math.ceil(a.sampleRate*this.duration)+1,this.length>0){i&&i.length==this.length&&i.numberOfChannels==a.numberOfChannels&&i.sampleRate==a.sampleRate||(i=this.audioContext.createBuffer(a.numberOfChannels,this.length,a.sampleRate));for(var e=Math.floor(u*a.sampleRate),t=Math.ceil(f*a.sampleRate),r=0;r<a.numberOfChannels;r++){var n=new Float32Array(a.getChannelData(r));i.getChannelData(r).set(n.subarray(e,t))}}}else this.duration=0};var l=Object.prototype.toString.call(t),s=Object.prototype.toString.call(r),h=Object.prototype.toString.call(n),d=Object.prototype.toString.call(o);"[object String]"===l||"[object File]"===l?this.sourceURL=t:"[object AudioBuffer]"===l?this.buffer=t:log.error("Incorrect Parameter Type. url can only be a String, File or an AudioBuffer"),"[object Number]"===s?this.startPoint=parseFloat(r):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. startPoint should be a Number. Setting startPoint to 0"),"[object Number]"===h?this.endPoint=parseFloat(n):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. endPoint should be a Number. Setting endPoint to end of dile"),"[object AudioBuffer]"!==d||this.buffer||(this.buffer=o)}var log=_dereq_("loglevel");module.exports=SPAudioBuffer;
},{"loglevel":2}],2:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e])}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(){r.setLevel(r.levels.TRACE)},r.disableAll=function(){r.setLevel(r.levels.SILENT)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});


},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
/*soundmodels - v2.5.4 - Tue Apr 21 2015 11:27:00 GMT+0800 (SGT) */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Compressor = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Compressor(e){if(!(this instanceof Compressor))throw new TypeError("Compressor constructor cannot be called as a function.");BaseEffect.call(this,e),this.maxSources=0,this.minSources=0,this.effectName="Compressor";var r=this.audioContext.createDynamicsCompressor();this.inputNode=r,this.outputNode=r,this.registerParameter(new SPAudioParam(this,"attack",0,1,.003,r.attack),!1),this.registerParameter(new SPAudioParam(this,"knee",0,40,30,r.knee),!1),this.registerParameter(new SPAudioParam(this,"ratio",0,20,12,r.ratio),!1),this.registerParameter(new SPAudioParam(this,"release",0,1,.25,r.release),!1),this.registerParameter(new SPAudioParam(this,"threshold",-100,0,-24,r.threshold),!1),this.isInitialized=!0}var BaseEffect=_dereq_("../core/BaseEffect"),SPAudioParam=_dereq_("../core/SPAudioParam");Compressor.prototype=Object.create(BaseEffect.prototype),module.exports=Compressor;
},{"../core/BaseEffect":4,"../core/SPAudioParam":6}],2:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e])}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(){r.setLevel(r.levels.TRACE)},r.disableAll=function(){r.setLevel(r.levels.SILENT)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});


},{}],3:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;


},{}],4:[function(_dereq_,module,exports){
"use strict";function BaseEffect(t){function e(t){function e(){log.debug("Booting ",t),n.start(0),n.stop(t.currentTime+1e-4),window.liveAudioContexts.push(t),window.removeEventListener("touchstart",e)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(i&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(t)<0)){var n=t.createOscillator(),o=t.createGain();o.gain.value=0,n.connect(o),o.connect(t.destination),window.addEventListener("touchstart",e)}}void 0===t||null===t?(log.debug("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=t,e(this.audioContext),this.inputNode=null,Object.defineProperty(this,"numberOfInputs",{enumerable:!0,configurable:!1,get:function(){return this.inputNode.numberOfOutputs||0}}),this.outputNode=null,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.outputNode.numberOfOutputs||0}}),this.isPlaying=!1,this.isInitialized=!1,this.destinations=[],this.effectName="Effect",this.isBaseEffect=!0,this.parameterList_=[]}_dereq_("../core/AudioContextMonkeyPatch")();var log=_dereq_("loglevel");BaseEffect.prototype.connect=function(t,e,i){t instanceof AudioNode?(this.outputNode.connect(t,e,i),this.destinations.push({destination:t,output:e,input:i})):t.inputNode instanceof AudioNode?(this.outputNode.connect(t.inputNode,e,i),this.destinations.push({destination:t.inputNode,output:e,input:i})):log.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseEffect.prototype.disconnect=function(t){this.outputNode.disconnect(t),this.destinations=[]},BaseEffect.prototype.registerParameter=function(t,e){(void 0===e||null===e)&&(e=!1),Object.defineProperty(this,t.name,{enumerable:!0,configurable:e,value:t});var i=this,n=!1;this.parameterList_.forEach(function(e,o){e.name===t.name&&(i.parameterList_.splice(o,1,t),n=!0)}),n||this.parameterList_.push(t)},BaseEffect.prototype.listParams=function(){return this.parameterList_},module.exports=BaseEffect;


},{"../core/AudioContextMonkeyPatch":3,"loglevel":2}],5:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=2048,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;


},{}],6:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,i,n,o,u,r){var l,f=1e-4,c=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(f){if(log.debug("Setting param",t,"value to",f),typeof f!=typeof n)return void log.error("Attempt to set a",typeof n,"parameter to a",typeof f,"value");if("number"==typeof f&&(f>i?(log.debug(this.name,"clamping to max"),f=i):a>f&&(log.debug(this.name+" clamping to min"),f=a)),s=f,"function"==typeof u&&(f=u(f)),m||(log.debug("Clearing Automation for",t),window.clearInterval(l)),m=!1,"function"==typeof r&&e.audioContext)r(o,f,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(f,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):(log.debug("Setting param",t,"through setter"),a.setValueAtTime(f,e.audioContext.currentTime))})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof n?(this.defaultValue=n,this.value=n):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof i?this.maxValue=i:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var i=this;webAudioDispatch(function(){i.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,i){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,i)});else{var n=this,r=n.value,s=e.audioContext.currentTime;log.debug("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,n.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/i),Math.abs(n.value-t)<f&&window.clearInterval(l))},c)}},this.setValueCurveAtTime=function(t,a,i){if(o){if("function"==typeof u)for(var n=0;n<t.length;n++)t[n]=u(t[n]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,i)})}else{var r=this,f=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var n=Math.floor(t.length*(e.audioContext.currentTime-f)/i);n<t.length?(m=!0,r.value=t[n]):window.clearInterval(l)}},c)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;0===n&&(n=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n*Math.pow(t/n,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n+(t-n)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config"),log=_dereq_("loglevel");SPAudioParam.createPsuedoParam=function(e,t,a,i,n){return new SPAudioParam(e,t,a,i,n,null,null,null)},module.exports=SPAudioParam;


},{"../core/Config":5,"../core/WebAudioDispatch":7,"loglevel":2}],7:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;t>=i||.005>i-t?(log.debug("Dispatching now"),e()):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;


},{"loglevel":2}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
/*soundmodels - v2.5.4 - Tue Apr 21 2015 11:27:00 GMT+0800 (SGT) */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Distorter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Distorter(t){function e(t,e){for(var a=100*e,c=0;i>c;c++){var n=2*c/i-1;o[c]=(3+a)*n*20*s/(Math.PI+a*Math.abs(n))}r.curve=o}if(!(this instanceof Distorter))throw new TypeError("Distorter constructor cannot be called as a function.");BaseEffect.call(this,t),this.maxSources=0,this.minSources=0,this.effectName="Distorter";var r=this.audioContext.createWaveShaper(),a=this.audioContext.createBiquadFilter();this.inputNode=a,this.outputNode=r,a.type="bandpass",a.connect(r);var i=22050,o=new Float32Array(i),s=Math.PI/180;this.registerParameter(new SPAudioParam(this,"drive",0,1,.5,null,null,e),!1),this.registerParameter(new SPAudioParam(this,"color",0,22050,800,a.frequency),!1),this.isInitialized=!0}var BaseEffect=_dereq_("../core/BaseEffect"),SPAudioParam=_dereq_("../core/SPAudioParam");Distorter.prototype=Object.create(BaseEffect.prototype),module.exports=Distorter;
},{"../core/BaseEffect":4,"../core/SPAudioParam":6}],2:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e])}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(){r.setLevel(r.levels.TRACE)},r.disableAll=function(){r.setLevel(r.levels.SILENT)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});


},{}],3:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;


},{}],4:[function(_dereq_,module,exports){
"use strict";function BaseEffect(t){function e(t){function e(){log.debug("Booting ",t),n.start(0),n.stop(t.currentTime+1e-4),window.liveAudioContexts.push(t),window.removeEventListener("touchstart",e)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(i&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(t)<0)){var n=t.createOscillator(),o=t.createGain();o.gain.value=0,n.connect(o),o.connect(t.destination),window.addEventListener("touchstart",e)}}void 0===t||null===t?(log.debug("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=t,e(this.audioContext),this.inputNode=null,Object.defineProperty(this,"numberOfInputs",{enumerable:!0,configurable:!1,get:function(){return this.inputNode.numberOfOutputs||0}}),this.outputNode=null,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.outputNode.numberOfOutputs||0}}),this.isPlaying=!1,this.isInitialized=!1,this.destinations=[],this.effectName="Effect",this.isBaseEffect=!0,this.parameterList_=[]}_dereq_("../core/AudioContextMonkeyPatch")();var log=_dereq_("loglevel");BaseEffect.prototype.connect=function(t,e,i){t instanceof AudioNode?(this.outputNode.connect(t,e,i),this.destinations.push({destination:t,output:e,input:i})):t.inputNode instanceof AudioNode?(this.outputNode.connect(t.inputNode,e,i),this.destinations.push({destination:t.inputNode,output:e,input:i})):log.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseEffect.prototype.disconnect=function(t){this.outputNode.disconnect(t),this.destinations=[]},BaseEffect.prototype.registerParameter=function(t,e){(void 0===e||null===e)&&(e=!1),Object.defineProperty(this,t.name,{enumerable:!0,configurable:e,value:t});var i=this,n=!1;this.parameterList_.forEach(function(e,o){e.name===t.name&&(i.parameterList_.splice(o,1,t),n=!0)}),n||this.parameterList_.push(t)},BaseEffect.prototype.listParams=function(){return this.parameterList_},module.exports=BaseEffect;


},{"../core/AudioContextMonkeyPatch":3,"loglevel":2}],5:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=2048,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;


},{}],6:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,i,n,o,u,r){var l,f=1e-4,c=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(f){if(log.debug("Setting param",t,"value to",f),typeof f!=typeof n)return void log.error("Attempt to set a",typeof n,"parameter to a",typeof f,"value");if("number"==typeof f&&(f>i?(log.debug(this.name,"clamping to max"),f=i):a>f&&(log.debug(this.name+" clamping to min"),f=a)),s=f,"function"==typeof u&&(f=u(f)),m||(log.debug("Clearing Automation for",t),window.clearInterval(l)),m=!1,"function"==typeof r&&e.audioContext)r(o,f,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(f,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):(log.debug("Setting param",t,"through setter"),a.setValueAtTime(f,e.audioContext.currentTime))})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof n?(this.defaultValue=n,this.value=n):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof i?this.maxValue=i:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var i=this;webAudioDispatch(function(){i.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,i){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,i)});else{var n=this,r=n.value,s=e.audioContext.currentTime;log.debug("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,n.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/i),Math.abs(n.value-t)<f&&window.clearInterval(l))},c)}},this.setValueCurveAtTime=function(t,a,i){if(o){if("function"==typeof u)for(var n=0;n<t.length;n++)t[n]=u(t[n]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,i)})}else{var r=this,f=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var n=Math.floor(t.length*(e.audioContext.currentTime-f)/i);n<t.length?(m=!0,r.value=t[n]):window.clearInterval(l)}},c)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;0===n&&(n=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n*Math.pow(t/n,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n+(t-n)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config"),log=_dereq_("loglevel");SPAudioParam.createPsuedoParam=function(e,t,a,i,n){return new SPAudioParam(e,t,a,i,n,null,null,null)},module.exports=SPAudioParam;


},{"../core/Config":5,"../core/WebAudioDispatch":7,"loglevel":2}],7:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;t>=i||.005>i-t?(log.debug("Dispatching now"),e()):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;


},{"loglevel":2}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function (global){
/*soundmodels - v2.5.4 - Tue Apr 21 2015 11:27:00 GMT+0800 (SGT) */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fader = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Fader(e){function t(e){return log.debug("Setting volume to ",e/100),e/100}function r(e){return log.debug("Setting volume (DB) to ",Converter.dBFStoRatio(e)),Converter.dBFStoRatio(e)}if(!(this instanceof Fader))throw new TypeError("Fader constructor cannot be called as a function.");BaseEffect.call(this,e),this.maxSources=0,this.minSources=0,this.effectName="Fader";var o=this.audioContext.createGain();this.inputNode=o,this.outputNode=o,this.registerParameter(new SPAudioParam(this,"volume",0,100,100,o.gain,t,null),!1),this.registerParameter(new SPAudioParam(this,"volumeInDB",-80,0,0,o.gain,r,null),!1),this.isInitialized=!0}var BaseEffect=_dereq_("../core/BaseEffect"),SPAudioParam=_dereq_("../core/SPAudioParam"),Converter=_dereq_("../core/Converter"),log=_dereq_("loglevel");Fader.prototype=Object.create(BaseEffect.prototype),module.exports=Fader;
},{"../core/BaseEffect":4,"../core/Converter":6,"../core/SPAudioParam":7,"loglevel":2}],2:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e])}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(){r.setLevel(r.levels.TRACE)},r.disableAll=function(){r.setLevel(r.levels.SILENT)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});


},{}],3:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;


},{}],4:[function(_dereq_,module,exports){
"use strict";function BaseEffect(t){function e(t){function e(){log.debug("Booting ",t),n.start(0),n.stop(t.currentTime+1e-4),window.liveAudioContexts.push(t),window.removeEventListener("touchstart",e)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(i&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(t)<0)){var n=t.createOscillator(),o=t.createGain();o.gain.value=0,n.connect(o),o.connect(t.destination),window.addEventListener("touchstart",e)}}void 0===t||null===t?(log.debug("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=t,e(this.audioContext),this.inputNode=null,Object.defineProperty(this,"numberOfInputs",{enumerable:!0,configurable:!1,get:function(){return this.inputNode.numberOfOutputs||0}}),this.outputNode=null,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.outputNode.numberOfOutputs||0}}),this.isPlaying=!1,this.isInitialized=!1,this.destinations=[],this.effectName="Effect",this.isBaseEffect=!0,this.parameterList_=[]}_dereq_("../core/AudioContextMonkeyPatch")();var log=_dereq_("loglevel");BaseEffect.prototype.connect=function(t,e,i){t instanceof AudioNode?(this.outputNode.connect(t,e,i),this.destinations.push({destination:t,output:e,input:i})):t.inputNode instanceof AudioNode?(this.outputNode.connect(t.inputNode,e,i),this.destinations.push({destination:t.inputNode,output:e,input:i})):log.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseEffect.prototype.disconnect=function(t){this.outputNode.disconnect(t),this.destinations=[]},BaseEffect.prototype.registerParameter=function(t,e){(void 0===e||null===e)&&(e=!1),Object.defineProperty(this,t.name,{enumerable:!0,configurable:e,value:t});var i=this,n=!1;this.parameterList_.forEach(function(e,o){e.name===t.name&&(i.parameterList_.splice(o,1,t),n=!0)}),n||this.parameterList_.push(t)},BaseEffect.prototype.listParams=function(){return this.parameterList_},module.exports=BaseEffect;


},{"../core/AudioContextMonkeyPatch":3,"loglevel":2}],5:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=2048,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;


},{}],6:[function(_dereq_,module,exports){
"use strict";function Converter(){}Converter.semitonesToRatio=function(t){return Math.pow(2,t/12)},Converter.ratioToDBFS=function(t){return 20*Math.log10(t)},Converter.dBFStoRatio=function(t){return Math.pow(10,t/20)},module.exports=Converter;


},{}],7:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,i,n,o,u,r){var l,f=1e-4,c=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(f){if(log.debug("Setting param",t,"value to",f),typeof f!=typeof n)return void log.error("Attempt to set a",typeof n,"parameter to a",typeof f,"value");if("number"==typeof f&&(f>i?(log.debug(this.name,"clamping to max"),f=i):a>f&&(log.debug(this.name+" clamping to min"),f=a)),s=f,"function"==typeof u&&(f=u(f)),m||(log.debug("Clearing Automation for",t),window.clearInterval(l)),m=!1,"function"==typeof r&&e.audioContext)r(o,f,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(f,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):(log.debug("Setting param",t,"through setter"),a.setValueAtTime(f,e.audioContext.currentTime))})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof n?(this.defaultValue=n,this.value=n):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof i?this.maxValue=i:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var i=this;webAudioDispatch(function(){i.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,i){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,i)});else{var n=this,r=n.value,s=e.audioContext.currentTime;log.debug("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,n.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/i),Math.abs(n.value-t)<f&&window.clearInterval(l))},c)}},this.setValueCurveAtTime=function(t,a,i){if(o){if("function"==typeof u)for(var n=0;n<t.length;n++)t[n]=u(t[n]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,i)})}else{var r=this,f=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var n=Math.floor(t.length*(e.audioContext.currentTime-f)/i);n<t.length?(m=!0,r.value=t[n]):window.clearInterval(l)}},c)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;0===n&&(n=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n*Math.pow(t/n,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n+(t-n)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config"),log=_dereq_("loglevel");SPAudioParam.createPsuedoParam=function(e,t,a,i,n){return new SPAudioParam(e,t,a,i,n,null,null,null)},module.exports=SPAudioParam;


},{"../core/Config":5,"../core/WebAudioDispatch":8,"loglevel":2}],8:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;t>=i||.005>i-t?(log.debug("Dispatching now"),e()):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;


},{"loglevel":2}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
(function (global){
/*soundmodels - v2.5.4 - Tue Apr 21 2015 11:27:00 GMT+0800 (SGT) */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Filter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Filter(e){function t(e,t){"string"==typeof t?r.type=t:console.warn("Unknown filter type",t)}if(!(this instanceof Filter))throw new TypeError("Filter constructor cannot be called as a function.");BaseEffect.call(this,e),this.maxSources=0,this.minSources=0,this.effectName="Filter";var r=this.audioContext.createBiquadFilter();this.inputNode=r,this.outputNode=r,this.registerParameter(new SPAudioParam(this,"frequency",10,this.audioContext.sampleRate/2,350,r.frequency),!1),this.registerParameter(new SPAudioParam(this,"detune",-1200,1200,0,r.detune),!1),this.registerParameter(new SPAudioParam(this,"Q",1e-4,1e3,1,r.Q),!1),this.registerParameter(new SPAudioParam(this,"type","lowpass","allpass","lowpass",null,null,t),!1),this.isInitialized=!0}var BaseEffect=_dereq_("../core/BaseEffect"),SPAudioParam=_dereq_("../core/SPAudioParam");Filter.prototype=Object.create(BaseEffect.prototype),module.exports=Filter;
},{"../core/BaseEffect":4,"../core/SPAudioParam":6}],2:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e])}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(){r.setLevel(r.levels.TRACE)},r.disableAll=function(){r.setLevel(r.levels.SILENT)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});


},{}],3:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;


},{}],4:[function(_dereq_,module,exports){
"use strict";function BaseEffect(t){function e(t){function e(){log.debug("Booting ",t),n.start(0),n.stop(t.currentTime+1e-4),window.liveAudioContexts.push(t),window.removeEventListener("touchstart",e)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(i&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(t)<0)){var n=t.createOscillator(),o=t.createGain();o.gain.value=0,n.connect(o),o.connect(t.destination),window.addEventListener("touchstart",e)}}void 0===t||null===t?(log.debug("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=t,e(this.audioContext),this.inputNode=null,Object.defineProperty(this,"numberOfInputs",{enumerable:!0,configurable:!1,get:function(){return this.inputNode.numberOfOutputs||0}}),this.outputNode=null,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.outputNode.numberOfOutputs||0}}),this.isPlaying=!1,this.isInitialized=!1,this.destinations=[],this.effectName="Effect",this.isBaseEffect=!0,this.parameterList_=[]}_dereq_("../core/AudioContextMonkeyPatch")();var log=_dereq_("loglevel");BaseEffect.prototype.connect=function(t,e,i){t instanceof AudioNode?(this.outputNode.connect(t,e,i),this.destinations.push({destination:t,output:e,input:i})):t.inputNode instanceof AudioNode?(this.outputNode.connect(t.inputNode,e,i),this.destinations.push({destination:t.inputNode,output:e,input:i})):log.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseEffect.prototype.disconnect=function(t){this.outputNode.disconnect(t),this.destinations=[]},BaseEffect.prototype.registerParameter=function(t,e){(void 0===e||null===e)&&(e=!1),Object.defineProperty(this,t.name,{enumerable:!0,configurable:e,value:t});var i=this,n=!1;this.parameterList_.forEach(function(e,o){e.name===t.name&&(i.parameterList_.splice(o,1,t),n=!0)}),n||this.parameterList_.push(t)},BaseEffect.prototype.listParams=function(){return this.parameterList_},module.exports=BaseEffect;


},{"../core/AudioContextMonkeyPatch":3,"loglevel":2}],5:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=2048,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;


},{}],6:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,i,n,o,u,r){var l,f=1e-4,c=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(f){if(log.debug("Setting param",t,"value to",f),typeof f!=typeof n)return void log.error("Attempt to set a",typeof n,"parameter to a",typeof f,"value");if("number"==typeof f&&(f>i?(log.debug(this.name,"clamping to max"),f=i):a>f&&(log.debug(this.name+" clamping to min"),f=a)),s=f,"function"==typeof u&&(f=u(f)),m||(log.debug("Clearing Automation for",t),window.clearInterval(l)),m=!1,"function"==typeof r&&e.audioContext)r(o,f,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(f,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):(log.debug("Setting param",t,"through setter"),a.setValueAtTime(f,e.audioContext.currentTime))})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof n?(this.defaultValue=n,this.value=n):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof i?this.maxValue=i:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var i=this;webAudioDispatch(function(){i.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,i){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,i)});else{var n=this,r=n.value,s=e.audioContext.currentTime;log.debug("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,n.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/i),Math.abs(n.value-t)<f&&window.clearInterval(l))},c)}},this.setValueCurveAtTime=function(t,a,i){if(o){if("function"==typeof u)for(var n=0;n<t.length;n++)t[n]=u(t[n]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,i)})}else{var r=this,f=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var n=Math.floor(t.length*(e.audioContext.currentTime-f)/i);n<t.length?(m=!0,r.value=t[n]):window.clearInterval(l)}},c)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;0===n&&(n=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n*Math.pow(t/n,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n+(t-n)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config"),log=_dereq_("loglevel");SPAudioParam.createPsuedoParam=function(e,t,a,i,n){return new SPAudioParam(e,t,a,i,n,null,null,null)},module.exports=SPAudioParam;


},{"../core/Config":5,"../core/WebAudioDispatch":7,"loglevel":2}],7:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;t>=i||.005>i-t?(log.debug("Dispatching now"),e()):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;


},{"loglevel":2}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
(function (global){
/*soundmodels - v2.5.4 - Tue Apr 21 2015 11:27:00 GMT+0800 (SGT) */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Panner = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Panner(e){function t(e){return e/90}function n(e,t){var n=parseInt(t),r=n+90;r>90&&(r=180-r);var i=Math.sin(n*(Math.PI/180)),o=Math.sin(r*(Math.PI/180));a.setPosition(i,0,o)}if(!(this instanceof Panner))throw new TypeError("Panner constructor cannot be called as a function.");BaseEffect.call(this,e),this.maxSources=0,this.minSources=0,this.effectName="Panner";var a,r="function"==typeof this.audioContext.createStereoPanner;r?(log.debug("using native panner"),a=this.audioContext.createStereoPanner()):(log.debug("using 3D panner"),a=this.audioContext.createPanner()),this.inputNode=a,this.outputNode=a,r?this.registerParameter(new SPAudioParam(this,"pan",-90,90,0,a.pan,t),!1):this.registerParameter(new SPAudioParam(this,"pan",-90,90,0,null,null,n),!1),this.isInitialized=!0}var BaseEffect=_dereq_("../core/BaseEffect"),SPAudioParam=_dereq_("../core/SPAudioParam"),log=_dereq_("loglevel");Panner.prototype=Object.create(BaseEffect.prototype),module.exports=Panner;
},{"../core/BaseEffect":4,"../core/SPAudioParam":6,"loglevel":2}],2:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e])}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(){r.setLevel(r.levels.TRACE)},r.disableAll=function(){r.setLevel(r.levels.SILENT)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});


},{}],3:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;


},{}],4:[function(_dereq_,module,exports){
"use strict";function BaseEffect(t){function e(t){function e(){log.debug("Booting ",t),n.start(0),n.stop(t.currentTime+1e-4),window.liveAudioContexts.push(t),window.removeEventListener("touchstart",e)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(i&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(t)<0)){var n=t.createOscillator(),o=t.createGain();o.gain.value=0,n.connect(o),o.connect(t.destination),window.addEventListener("touchstart",e)}}void 0===t||null===t?(log.debug("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=t,e(this.audioContext),this.inputNode=null,Object.defineProperty(this,"numberOfInputs",{enumerable:!0,configurable:!1,get:function(){return this.inputNode.numberOfOutputs||0}}),this.outputNode=null,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.outputNode.numberOfOutputs||0}}),this.isPlaying=!1,this.isInitialized=!1,this.destinations=[],this.effectName="Effect",this.isBaseEffect=!0,this.parameterList_=[]}_dereq_("../core/AudioContextMonkeyPatch")();var log=_dereq_("loglevel");BaseEffect.prototype.connect=function(t,e,i){t instanceof AudioNode?(this.outputNode.connect(t,e,i),this.destinations.push({destination:t,output:e,input:i})):t.inputNode instanceof AudioNode?(this.outputNode.connect(t.inputNode,e,i),this.destinations.push({destination:t.inputNode,output:e,input:i})):log.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseEffect.prototype.disconnect=function(t){this.outputNode.disconnect(t),this.destinations=[]},BaseEffect.prototype.registerParameter=function(t,e){(void 0===e||null===e)&&(e=!1),Object.defineProperty(this,t.name,{enumerable:!0,configurable:e,value:t});var i=this,n=!1;this.parameterList_.forEach(function(e,o){e.name===t.name&&(i.parameterList_.splice(o,1,t),n=!0)}),n||this.parameterList_.push(t)},BaseEffect.prototype.listParams=function(){return this.parameterList_},module.exports=BaseEffect;


},{"../core/AudioContextMonkeyPatch":3,"loglevel":2}],5:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=2048,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;


},{}],6:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,i,n,o,u,r){var l,f=1e-4,c=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(f){if(log.debug("Setting param",t,"value to",f),typeof f!=typeof n)return void log.error("Attempt to set a",typeof n,"parameter to a",typeof f,"value");if("number"==typeof f&&(f>i?(log.debug(this.name,"clamping to max"),f=i):a>f&&(log.debug(this.name+" clamping to min"),f=a)),s=f,"function"==typeof u&&(f=u(f)),m||(log.debug("Clearing Automation for",t),window.clearInterval(l)),m=!1,"function"==typeof r&&e.audioContext)r(o,f,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(f,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):(log.debug("Setting param",t,"through setter"),a.setValueAtTime(f,e.audioContext.currentTime))})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof n?(this.defaultValue=n,this.value=n):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof i?this.maxValue=i:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var i=this;webAudioDispatch(function(){i.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,i){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,i)});else{var n=this,r=n.value,s=e.audioContext.currentTime;log.debug("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,n.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/i),Math.abs(n.value-t)<f&&window.clearInterval(l))},c)}},this.setValueCurveAtTime=function(t,a,i){if(o){if("function"==typeof u)for(var n=0;n<t.length;n++)t[n]=u(t[n]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,i)})}else{var r=this,f=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var n=Math.floor(t.length*(e.audioContext.currentTime-f)/i);n<t.length?(m=!0,r.value=t[n]):window.clearInterval(l)}},c)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;0===n&&(n=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n*Math.pow(t/n,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n+(t-n)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config"),log=_dereq_("loglevel");SPAudioParam.createPsuedoParam=function(e,t,a,i,n){return new SPAudioParam(e,t,a,i,n,null,null,null)},module.exports=SPAudioParam;


},{"../core/Config":5,"../core/WebAudioDispatch":7,"loglevel":2}],7:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;t>=i||.005>i-t?(log.debug("Dispatching now"),e()):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;


},{"loglevel":2}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
module.exports = {
	models : {
		Looper : require('./models/Looper.js'),
		Activity : require('./models/Looper.js'),
		Trigger : require('./models/Looper.js'),
		MultiTrigger : require('./models/Looper.js'),
		Extender : require('./models/Looper.js'),
		Scrubber : require('./models/Looper.js')
	},
	core : {
		SPAudioBuffer : require('./core/SPAudioBuffer.js')
	},
	effect : {
		Compressor : require('./effects/Compressor.js'),
		Distorter : require('./effects/Distorter.js'),
		Fader : require('./effects/Fader.js'),
		Filter : require('./effects/Filter.js'),
		Panner : require('./effects/Panner.js'),
	}
}

},{"./core/SPAudioBuffer.js":2,"./effects/Compressor.js":3,"./effects/Distorter.js":4,"./effects/Fader.js":5,"./effects/Filter.js":6,"./effects/Panner.js":7,"./models/Looper.js":9}],9:[function(require,module,exports){
(function (global){
/*soundmodels - v2.5.4 - Tue Apr 21 2015 11:27:00 GMT+0800 (SGT) */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Looper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Looper(e,t,i,o,a,n,r){function u(e){d=[],c.forEach(function(e){e.disconnect()}),s.multiTrackGain.length=0,multiFileLoader.call(s,e,s.audioContext,s.onLoadProgress,f)}if(!(this instanceof Looper))throw new TypeError("Looper constructor cannot be called as a function.");BaseSound.call(this,e),this.maxSources=Config.MAX_VOICES,this.minSources=1,this.modelName="Looper",this.onLoadProgress=i,this.onLoadComplete=o,this.onAudioStart=a,this.onAudioEnd=n;var s=this,c=[],l=[],d=[],f=function(e,t){s.multiTrackGain.length=t.length,t.forEach(function(e,i){l.push(0),p(e,i,t.length)}),d&&d.length>0&&s.registerParameter(new SPAudioParam(s,"playSpeed",0,10,1,d,null,m),!0),e&&(s.isInitialized=!0),"function"==typeof s.onLoadComplete&&window.setTimeout(function(){"function"==typeof s.onLoadComplete&&s.onLoadComplete(e,t)},0)},p=function(e,t,i){var o;if(o=c[t]instanceof SPAudioBufferSourceNode?c[t]:new SPAudioBufferSourceNode(s.audioContext),o.buffer=e,o.loopEnd=e.duration,o.onended=function(e){h(e,t,o)},i>1){var a=new SPAudioParam(s,"track-"+t+"-gain",0,1,1,o.gain,null,null);s.multiTrackGain.splice(t,1,a)}o.connect(s.releaseGainNode),c.splice(t,1,o),d.push(o.playbackRate)},h=function(e,t,i){var o=s.audioContext.currentTime;if(i.resetBufferSource(o,s.releaseGainNode),s.multiTrackGain.length>1){var a=new SPAudioParam(s,"track-"+t+"-gain"+t,0,1,1,i.gain,null,null);s.multiTrackGain.splice(t,1,a)}"function"==typeof s.onTrackEnd&&r(s,t);var n=c.reduce(function(e,t){return e&&(t.playbackState===t.FINISHED_STATE||t.playbackState===t.UNSCHEDULED_STATE)},!0);n&&s.isPlaying&&(s.isPlaying=!1,"function"==typeof s.onAudioEnd&&s.onAudioEnd())},m=function(e,t,i){if(s.isInitialized){var o=6.90776,a=c[0]?c[0].playbackRate.value:1;s.isPlaying?(log.debug("easingIn/Out"),t>a?c.forEach(function(e){e.playbackRate.cancelScheduledValues(i.currentTime),e.playbackRate.setTargetAtTime(t,i.currentTime,s.easeIn.value/o)}):a>t&&c.forEach(function(e){e.playbackRate.cancelScheduledValues(i.currentTime),e.playbackRate.setTargetAtTime(t,i.currentTime,s.easeOut.value/o)})):(log.debug("changing directly"),c.forEach(function(e){e.playbackRate.cancelScheduledValues(i.currentTime),e.playbackRate.setValueAtTime(t,i.currentTime)}))}};this.onTrackEnd=r,this.registerParameter(new SPAudioParam(this,"playSpeed",0,10,1.005,null,null,m),!0),this.registerParameter(SPAudioParam.createPsuedoParam(this,"easeIn",.05,10,.05)),this.registerParameter(SPAudioParam.createPsuedoParam(this,"easeOut",.05,10,.05));var S=[];S.name="multiTrackGain",this.registerParameter(S,!1),this.registerParameter(SPAudioParam.createPsuedoParam(this,"maxLoops",-1,1,-1)),this.setSources=function(e,t,i){BaseSound.prototype.setSources.call(this,e,t,i),u(e)},this.play=function(){if(!this.isInitialized)throw new Error(this.modelName,"hasn't finished Initializing yet. Please wait before calling start/play");var e=this.audioContext.currentTime;this.isPlaying||(c.forEach(function(t,i){var o=l&&l[i]?l[i]:t.loopStart;t.loop=1!==s.maxLoops.value,t.start(e,o)}),BaseSound.prototype.start.call(this,e),webAudioDispatch(function(){"function"==typeof s.onAudioStart&&s.onAudioStart()},e,this.audioContext))},this.start=function(e,t,i,o){return this.isInitialized?void(this.isPlaying||(c.forEach(function(o){t=o.loopStart+parseFloat(t)||0,("undefined"==typeof i||null===i)&&(i=o.buffer.duration),o.loop=1!==s.maxLoops.value,o.start(e,t,i)}),BaseSound.prototype.start.call(this,e,t,i,o),webAudioDispatch(function(){"function"==typeof s.onAudioStart&&s.onAudioStart()},e,this.audioContext))):void log.warn(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play")},this.stop=function(e){s.isPlaying&&(c.forEach(function(t,i){t.stop(e),l[i]=0}),BaseSound.prototype.stop.call(this,e),webAudioDispatch(function(){"function"==typeof s.onAudioEnd&&s.isPlaying===!1&&s.onAudioEnd()},e,this.audioContext))},this.pause=function(){s.isPlaying&&(c.forEach(function(e,t){e.stop(0),l[t]=e.playbackPosition/e.buffer.sampleRate}),BaseSound.prototype.stop.call(this,0),webAudioDispatch(function(){"function"==typeof s.onAudioEnd&&s.onAudioEnd()},0,this.audioContext))},this.release=function(e,t,i){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var o=.5;t=t||o,BaseSound.prototype.release.call(this,e,t,i),i&&(this.releaseGainNode=this.audioContext.createGain(),this.destinations.forEach(function(e){s.releaseGainNode.connect(e.destination,e.output,e.input)}),c.forEach(function(i,o){i.stop(e+t),l[o]=0,i.resetBufferSource(e,s.releaseGainNode);var a=new SPAudioParam(s,"gain-"+o,0,1,1,i.gain,null,null);s.multiTrackGain.splice(o,1,a)}),this.isPlaying=!1,webAudioDispatch(function(){"function"==typeof s.onAudioEnd&&s.isPlaying===!1&&s.onAudioEnd()},e+t,this.audioContext))},u(t)}var Config=_dereq_("../core/Config"),BaseSound=_dereq_("../core/BaseSound"),SPAudioParam=_dereq_("../core/SPAudioParam"),SPAudioBufferSourceNode=_dereq_("../core/SPAudioBufferSourceNode"),multiFileLoader=_dereq_("../core/MultiFileLoader"),webAudioDispatch=_dereq_("../core/webAudioDispatch"),log=_dereq_("loglevel");Looper.prototype=Object.create(BaseSound.prototype),module.exports=Looper;
},{"../core/BaseSound":4,"../core/Config":5,"../core/MultiFileLoader":8,"../core/SPAudioBufferSourceNode":10,"../core/SPAudioParam":11,"../core/webAudioDispatch":14,"loglevel":2}],2:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e])}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(){r.setLevel(r.levels.TRACE)},r.disableAll=function(){r.setLevel(r.levels.SILENT)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});


},{}],3:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;


},{}],4:[function(_dereq_,module,exports){
"use strict";function BaseSound(e){function t(e){function t(){log.debug("Booting ",e),n.start(0),n.stop(e.currentTime+1e-4),window.liveAudioContexts.push(e),window.removeEventListener("touchstart",t)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(i&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(e)<0)){var n=e.createOscillator(),o=e.createGain();o.gain.value=0,n.connect(o),o.connect(e.destination),window.addEventListener("touchstart",t)}}void 0===e||null===e?(log.debug("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,t(this.audioContext),this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.releaseGainNode.numberOfOutputs}});var i=0;Object.defineProperty(this,"maxSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),i=Math.round(e)},get:function(){return i}});var n=0;Object.defineProperty(this,"minSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),n=Math.round(e)},get:function(){return n}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.destinations=[],this.modelName="Model",this.onLoadProgress=null,this.onLoadComplete=null,this.onAudioStart=null,this.onAudioEnd=null,this.isBaseSound=!0,this.parameterList_=[],this.connect(this.audioContext.destination)}_dereq_("../core/AudioContextMonkeyPatch")();var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),log=_dereq_("loglevel");BaseSound.prototype.connect=function(e,t,i){e instanceof AudioNode?(this.releaseGainNode.connect(e,t,i),this.destinations.push({destination:e,output:t,input:i})):e.inputNode instanceof AudioNode?(this.releaseGainNode.connect(e.inputNode,t,i),this.destinations.push({destination:e.inputNode,output:t,input:i})):log.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseSound.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e),this.destinations=[]},BaseSound.prototype.start=function(e,t,i,n){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime),this.releaseGainNode.gain.cancelScheduledValues(e),"undefined"!=typeof n?(log.debug("Ramping from "+t+"  in "+n),this.releaseGainNode.gain.setValueAtTime(0,e),this.releaseGainNode.gain.linearRampToValueAtTime(1,e+n)):this.releaseGainNode.gain.setValueAtTime(1,e);var o=this;webAudioDispatch(function(){o.isPlaying=!0},e,this.audioContext)},BaseSound.prototype.stop=function(e){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var t=this;webAudioDispatch(function(){t.isPlaying=!1},e,this.audioContext),this.releaseGainNode.gain.cancelScheduledValues(e)},BaseSound.prototype.release=function(e,t,i){if(this.isPlaying){var n=.5;if(("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),!i){var o=this;webAudioDispatch(function(){o.pause()},e+t,this.audioContext)}}},BaseSound.prototype.setSources=function(e,t,i){this.isInitialized=!1,"function"==typeof t&&(this.onLoadProgress=t),"function"==typeof i&&(this.onLoadComplete=i)},BaseSound.prototype.play=function(){this.start(0)},BaseSound.prototype.pause=function(){this.isPlaying=!1},BaseSound.prototype.registerParameter=function(e,t){(void 0===t||null===t)&&(t=!1),Object.defineProperty(this,e.name,{enumerable:!0,configurable:t,value:e});var i=this,n=!1;this.parameterList_.forEach(function(t,o){t.name===e.name&&(i.parameterList_.splice(o,1,e),n=!0)}),n||this.parameterList_.push(e)},BaseSound.prototype.listParams=function(){return this.parameterList_},BaseSound.prototype.setOutputEffect=function(e){this.disconnect(),this.connect(e),e.connect(this.audioContext.destination)},module.exports=BaseSound;


},{"../core/AudioContextMonkeyPatch":3,"../core/WebAudioDispatch":13,"loglevel":2}],5:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=2048,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;


},{}],6:[function(_dereq_,module,exports){
"use strict";function DetectLoopMarkers(e){var r=0,n=0,o=!0,u=5e3,t=44100,a=.5,l=2e4,f=.01,c=1024,d=16,g=[],i=0,s=function(e,r){log.debug("Checking for loop marks at "+r);for(var n=0,o=r+d;r+d+c>o;++o)n+=Math.abs(e[o]);return f>n/c},b=function(e){return function(r,n,o){var u;return u=o%2===0?n[e]>a:n[e]<-a,r&&u}},v=function(o){var a=null,f=null;r=0,n=i;for(var c=0;null===a&&i>c&&l>c;){if(o.reduce(b(c),!0)&&(1!==o.length||s(o[0],c))){a=c;break}c++}for(c=i;null===f&&c>0&&l>i-c;){if(o.reduce(b(c),!0)){f=c;break}c--}var d=Math.round(u/2*e.sampleRate/t);return null!==a&&null!==f&&f>a+d?(r=a+d,n=f-d,log.debug("Found loop between "+r+" - "+n),log.debug("Spikes at  "+a+" - "+f),!0):(log.debug("No loop found"),!1)},h=function(e){return function(r,n){return r&&Math.abs(n[e])<f}},p=function(e){var o=!0;for(r=0;l>r&&i>r&&(o=e.reduce(h(r),!0));)r++;for(n=i;l>i-n&&n>0&&(o=e.reduce(h(n),!0));)n--;r>n&&(r=0)};i=e.length;for(var k=0;k<e.numberOfChannels;k++)g.push(new Float32Array(e.getChannelData(k)));return v(g)||(p(g),o=!1),{marked:o,start:r,end:n}}var log=_dereq_("loglevel");module.exports=DetectLoopMarkers;


},{"loglevel":2}],7:[function(_dereq_,module,exports){
"use strict";function FileLoader(e,r,t,n){function a(){var r=Object.prototype.toString.call(e),t=/[^.]+$/.exec(e);if("[object String]"===r){var a=new XMLHttpRequest;a.open("GET",e,!0),a.responseType="arraybuffer",a.addEventListener("progress",n,!1),a.onload=function(){o(a.response,t)},a.send()}else if("[object File]"===r||"[object Blob]"===r){var i=new FileReader;i.addEventListener("progress",n,!1),i.onload=function(){o(i.result,t)},i.readAsArrayBuffer(e)}}function o(n,a){r.decodeAudioData(n,function(e){if(l=!0,i=e,u=0,f=i.length,"wav"!==a[0]){var r=detectLoopMarkers(i);r&&(u=r.start,f=r.end)}t&&"function"==typeof t&&t(!0)},function(){log.error("Error Decoding "+e),t&&"function"==typeof t&&t(!1)})}if(!(this instanceof FileLoader))throw new TypeError("FileLoader constructor cannot be called as a function.");var i,u=0,f=0,l=!1,s=function(e){var r=/^[0-9]+$/;return r.test(e)?!0:!1},d=function(e,t){"undefined"==typeof t&&(t=i.length),s(e)?s(t)||(log.debug("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer"),t=Number.isNan(t)?0:Math.round(Number(t))):(e=Number.isNan(e)?0:Math.round(Number(e)),log.debug("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer. Coercing it to an Integer - start")),e>t&&(log.warn("Incorrect parameter Type - FileLoader getBuffer start parameter "+e+" should be smaller than end parameter "+t+" . Setting them to the same value "+e),t=e),(e>f||u>e)&&(log.warn("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+i.length+" . Setting start to "+u),e=u),(t>f||u>t)&&(log.warn("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+i.length+" . Setting start to "+f),t=f);var n=t-e;if(!i)return log.error("No Buffer Found - Buffer loading has not completed or has failed."),null;for(var a=r.createBuffer(i.numberOfChannels,n,i.sampleRate),o=0;o<i.numberOfChannels;o++){var l=new Float32Array(i.getChannelData(o));a.getChannelData(o).set(l.subarray(e,t))}return a};this.getBuffer=function(e,r){return"undefined"==typeof e&&(e=0),"undefined"==typeof r&&(r=f-u),d(u+e,u+r)},this.getRawBuffer=function(){return l?i:(log.error("No Buffer Found - Buffer loading has not completed or has failed."),null)},this.isLoaded=function(){return l},a()}var detectLoopMarkers=_dereq_("../core/DetectLoopMarkers"),log=_dereq_("loglevel");module.exports=FileLoader;


},{"../core/DetectLoopMarkers":6,"loglevel":2}],8:[function(_dereq_,module,exports){
"use strict";function MultiFileLoader(e,o,r,u){function i(){if(!e)return log.debug("Setting empty source. No sound may be heard"),void u(!1,c);if(!(e instanceof Array)){var o=[];o.push(e),e=o}return e.length<f.minSources||e.length>f.maxSources?(log.error("Unsupported number of Sources. "+f.modelName+" only supports a minimum of "+f.minSources+" and a maximum of "+f.maxSources+" sources. Trying to load "+e.length+"."),void u(!1,c)):(a=e.length,c=new Array(a),void e.forEach(function(e,o){t(e,n(o))}))}function t(e,o){var u,i=Object.prototype.toString.call(e);if("[object AudioBuffer]"===i)u=new SPAudioBuffer(f.audioContext,e),o(!0,u);else if(e.isSPAudioBuffer&&e.buffer)o(!0,e);else if("[object String]"===i||"[object File]"===i||e.isSPAudioBuffer&&e.sourceURL){var t;e.isSPAudioBuffer&&e.sourceURL?(t=e.sourceURL,u=e):(t=e,u=new SPAudioBuffer(f.audioContext,t));var n=new FileLoader(t,f.audioContext,function(e){e?(u.buffer=n.getBuffer(),o(e,u)):o(e)},function(e){r&&"function"==typeof r&&r(e,u)})}else log.error("Incorrect Parameter Type - Source is not a URL, File or AudioBuffer or doesn't have sourceURL or buffer"),o(!1,{})}function n(e){return function(o,r){if(o&&(log.debug("Loaded track",e,"successfully"),c[e]=r),a--,0===a){for(var i=!0,t=0;t<c.length;++t)if(!c[t]){i=!1;break}u(i,c)}}}var f=this;this.audioContext=o;var a=0,c=[];i()}var FileLoader=_dereq_("../core/FileLoader"),SPAudioBuffer=_dereq_("../core/SPAudioBuffer"),log=_dereq_("loglevel");module.exports=MultiFileLoader;


},{"../core/FileLoader":7,"../core/SPAudioBuffer":9,"loglevel":2}],9:[function(_dereq_,module,exports){
"use strict";function SPAudioBuffer(e,t,r,n,o){if(!(e instanceof AudioContext))return void log.error("First argument to SPAudioBuffer must be a valid AudioContext");var i,a,u,f;this.audioContext=e,this.duration=null,Object.defineProperty(this,"numberOfChannels",{get:function(){return this.buffer?this.buffer.numberOfChannels:0}}),Object.defineProperty(this,"sampleRate",{get:function(){return this.buffer?this.buffer.sampleRate:0}}),this.getChannelData=function(e){return this.buffer?this.buffer.getChannelData(e):null},this.isSPAudioBuffer=!0,Object.defineProperty(this,"buffer",{set:function(e){if(null===u)this.startPoint=0;else if(u>e.length/e.sampleRate)return void log.error("SPAudioBuffer : startPoint cannot be greater than buffer length");if(null===f)this.endPoint=this.rawBuffer_.length;else if(f>e.length/e.sampleRate)return void log.error("SPAudioBuffer : endPoint cannot be greater than buffer length");a=e,this.updateBuffer()}.bind(this),get:function(){return i}}),this.sourceURL=null,Object.defineProperty(this,"startPoint",{set:function(e){return void 0!==f&&e>=f?void log.error("SPAudioBuffer : startPoint cannot be greater than endPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : startPoint cannot be greater than or equal to buffer length"):(u=e,void this.updateBuffer())}.bind(this),get:function(){return u}}),Object.defineProperty(this,"endPoint",{set:function(e){return void 0!==u&&u>=e?void log.error("SPAudioBuffer : endPoint cannot be lesser than startPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : endPoint cannot be greater than buffer or equal to length"):(f=e,void this.updateBuffer())}.bind(this),get:function(){return f}}),this.updateBuffer=function(){if(a){if((null===u||void 0===u)&&(u=0),(null===f||void 0===f)&&(f=a.duration),this.duration=f-u,this.length=Math.ceil(a.sampleRate*this.duration)+1,this.length>0){i&&i.length==this.length&&i.numberOfChannels==a.numberOfChannels&&i.sampleRate==a.sampleRate||(i=this.audioContext.createBuffer(a.numberOfChannels,this.length,a.sampleRate));for(var e=Math.floor(u*a.sampleRate),t=Math.ceil(f*a.sampleRate),r=0;r<a.numberOfChannels;r++){var n=new Float32Array(a.getChannelData(r));i.getChannelData(r).set(n.subarray(e,t))}}}else this.duration=0};var l=Object.prototype.toString.call(t),s=Object.prototype.toString.call(r),h=Object.prototype.toString.call(n),d=Object.prototype.toString.call(o);"[object String]"===l||"[object File]"===l?this.sourceURL=t:"[object AudioBuffer]"===l?this.buffer=t:log.error("Incorrect Parameter Type. url can only be a String, File or an AudioBuffer"),"[object Number]"===s?this.startPoint=parseFloat(r):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. startPoint should be a Number. Setting startPoint to 0"),"[object Number]"===h?this.endPoint=parseFloat(n):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. endPoint should be a Number. Setting endPoint to end of dile"),"[object AudioBuffer]"!==d||this.buffer||(this.buffer=o)}var log=_dereq_("loglevel");module.exports=SPAudioBuffer;


},{"loglevel":2}],10:[function(_dereq_,module,exports){
"use strict";function SPAudioBufferSourceNode(e){function t(t){for(var n=new Float32Array(t.length),a=e.createBuffer(1,t.length,44100),o=0;o<t.length;o++)n[o]=o;return a.getChannelData(0).set(n),a}function n(){i.connect(c),i.onaudioprocess=a}function a(e){var t=e.inputBuffer.getChannelData(0);f=t[t.length-1]||0}function o(e,t){return function(n){e.playbackState=e.FINISHED_STATE,"function"==typeof t&&t(n)}}var r,u=e.createBufferSource(),i=e.createScriptProcessor(256,1,1),c=e.createGain(),f=0;this.audioContext=e,this.playbackState=0,this.channelCount=null,this.channelCountMode=null,this.channelInterpretation=null,this.numberOfInputs=null,this.numberOfOutputs=null,this.UNSCHEDULED_STATE=0,this.SCHEDULED_STATE=1,this.PLAYING_STATE=2,this.FINISHED_STATE=3,this.playbackRate=null,Object.defineProperty(this,"loopEnd",{enumerable:!0,configurable:!1,set:function(e){u.loopEnd=e,r.loopEnd=e},get:function(){return u.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,configurable:!1,set:function(e){u.loopStart=e,r.loopStart=e},get:function(){return u.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,configurable:!1,set:function(e){u.onended=o(this,e)},get:function(){return u.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,configurable:!1,set:function(e){u.loop=e,r.loop=e},get:function(){return u.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,configurable:!1,get:function(){return f}}),Object.defineProperty(this,"buffer",{enumerable:!0,configurable:!1,set:function(n){u&&u.disconnect(),r&&r.disconnect(),u=e.createBufferSource(),r=e.createBufferSource(),n.isSPAudioBuffer?(u.buffer=n.buffer,r.buffer=t(n.buffer)):n instanceof AudioBuffer&&(u.buffer=n,r.buffer=t(n)),r.connect(i),u.connect(c),this.channelCount=u.channelCount,this.channelCountMode=u.channelCountMode,this.channelInterpretation=u.channelInterpretation,this.numberOfInputs=u.numberOfInputs,this.numberOfOutputs=u.numberOfOutputs,this.playbackRate=new SPPlaybackRateParam(this,u.playbackRate,r.playbackRate)},get:function(){return u.buffer}}),Object.defineProperty(this,"gain",{enumerable:!0,configurable:!1,get:function(){return c.gain}}),this.connect=function(e,t,n){c.connect(e,t,n)},this.disconnect=function(e){c.disconnect(e)},this.start=function(e,t,n){"undefined"==typeof n&&(n=u.buffer.duration),"undefined"==typeof t&&(t=0),this.playbackState===this.UNSCHEDULED_STATE&&(0===t&&n===u.buffer.duration?(u.start(e),r.start(e)):(u.start(e,t,n),r.start(e,t,n)),this.playbackState=this.SCHEDULED_STATE);var a=this;webAudioDispatch(function(){a.playbackState=a.PLAYING_STATE},e,this.audioContext)},this.stop=function(e){(this.playbackState===this.PLAYING_STATE||this.playbackState===this.SCHEDULED_STATE)&&(u.stop(e),r.stop(e))},this.resetBufferSource=function(t,n){var a=this;webAudioDispatch(function(){log.debug("Resetting BufferSource",a.buffer.length),i.disconnect();var t=a.audioContext.createGain();t.gain.value=c.gain.value,c=t;var f=a.audioContext.createBufferSource();f.buffer=u.buffer,f.loopStart=u.loopStart,f.loopEnd=u.loopEnd,f.onended=o(a,u.onended),u.onended=null,r.disconnect();var l=e.createBufferSource();l.buffer=r.buffer,u=f,r=l;var s=a.playbackRate.value;a.playbackRate=new SPPlaybackRateParam(a,u.playbackRate,r.playbackRate),a.playbackRate.setValueAtTime(s,0),r.connect(i),u.connect(c),i.connect(c),a.connect(n),a.playbackState=a.UNSCHEDULED_STATE},t,this.audioContext)},n()}var SPPlaybackRateParam=_dereq_("../core/SPPlaybackRateParam"),webAudioDispatch=_dereq_("../core/WebAudioDispatch"),log=_dereq_("loglevel");module.exports=SPAudioBufferSourceNode;


},{"../core/SPPlaybackRateParam":12,"../core/WebAudioDispatch":13,"loglevel":2}],11:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,i,n,o,u,r){var l,f=1e-4,c=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(f){if(log.debug("Setting param",t,"value to",f),typeof f!=typeof n)return void log.error("Attempt to set a",typeof n,"parameter to a",typeof f,"value");if("number"==typeof f&&(f>i?(log.debug(this.name,"clamping to max"),f=i):a>f&&(log.debug(this.name+" clamping to min"),f=a)),s=f,"function"==typeof u&&(f=u(f)),m||(log.debug("Clearing Automation for",t),window.clearInterval(l)),m=!1,"function"==typeof r&&e.audioContext)r(o,f,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(f,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):(log.debug("Setting param",t,"through setter"),a.setValueAtTime(f,e.audioContext.currentTime))})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof n?(this.defaultValue=n,this.value=n):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof i?this.maxValue=i:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var i=this;webAudioDispatch(function(){i.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,i){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,i)});else{var n=this,r=n.value,s=e.audioContext.currentTime;log.debug("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,n.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/i),Math.abs(n.value-t)<f&&window.clearInterval(l))},c)}},this.setValueCurveAtTime=function(t,a,i){if(o){if("function"==typeof u)for(var n=0;n<t.length;n++)t[n]=u(t[n]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,i)})}else{var r=this,f=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var n=Math.floor(t.length*(e.audioContext.currentTime-f)/i);n<t.length?(m=!0,r.value=t[n]):window.clearInterval(l)}},c)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;0===n&&(n=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n*Math.pow(t/n,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n+(t-n)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config"),log=_dereq_("loglevel");SPAudioParam.createPsuedoParam=function(e,t,a,i,n){return new SPAudioParam(e,t,a,i,n,null,null,null)},module.exports=SPAudioParam;


},{"../core/Config":5,"../core/WebAudioDispatch":13,"loglevel":2}],12:[function(_dereq_,module,exports){
"use strict";function SPPlaybackRateParam(e,t,a){this.defaultValue=t.defaultValue,this.maxValue=t.maxValue,this.minValue=t.minValue,this.name=t.name,this.units=t.units,this.isSPPlaybackRateParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(i){e.playbackState===e.PLAYING_STATE?(t.setTargetAtTime(i,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT),a.setTargetAtTime(i,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT)):(t.setValueAtTime(i,e.audioContext.currentTime),a.setValueAtTime(i,e.audioContext.currentTime))},get:function(){return t.value}}),t.value=t.value,a.value=t.value,this.linearRampToValueAtTime=function(e,i){t.linearRampToValueAtTime(e,i),a.linearRampToValueAtTime(e,i)},this.exponentialRampToValueAtTime=function(e,i){t.exponentialRampToValueAtTime(e,i),a.exponentialRampToValueAtTime(e,i)},this.setValueCurveAtTime=function(e,i,u){t.setValueCurveAtTime(e,i,u),a.setValueCurveAtTime(e,i,u)},this.setTargetAtTime=function(e,i,u){t.setTargetAtTime(e,i,u),a.setTargetAtTime(e,i,u)},this.setValueAtTime=function(e,i){t.setValueAtTime(e,i),a.setValueAtTime(e,i)},this.cancelScheduledValues=function(e){t.cancelScheduledValues(e),a.cancelScheduledValues(e)}}var Config=_dereq_("../core/Config");module.exports=SPPlaybackRateParam;


},{"../core/Config":5}],13:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;t>=i||.005>i-t?(log.debug("Dispatching now"),e()):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;


},{"loglevel":2}],14:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;t>=i||.005>i-t?(log.debug("Dispatching now"),e()):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;


},{"loglevel":2}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
