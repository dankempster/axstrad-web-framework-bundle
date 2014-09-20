window.axstrad = window.axstrad || {};
window.axstrad.keyCode = window.axstrad.keyCode || {};

/**
 * Returns whether <em>code</em> is within specified <em>range</em>.
 *
 * For <em>range</em> allowed values see axstrad.KEY.RANGE
 */
window.axstrad.keyCode.inRange = function(code, range)
{
    if (!axstrad.KEY.RANGE[range]) {
        console.error('KeyCode Range \''+range+'\' doesn\'t exist');
    }

    return code >= axstrad.KEY.RANGE[range].START && code <= axstrad.KEY.RANGE[range].END;
};

/**
 * Returns TRUE/FALSE if <em>code</em> is a navigation key.
 *
 * The following are classed as navigation keys
 *  - cursors
 *  - page up/down
 *  - home/end
 */
window.axstrad.keyCode.isNav = function(code)
{
    return axstrad.keyCode.inRange(code, 'CURSOR')
        || axstrad.keyCode.inRange(code, 'ACTION')
        || axstrad.keyCode.inRange(code, 'PAGE')
};

/**
 * Returns TRUE/FALSE if <em>code</em> is a modifier key.
 *
 * Modifier keys:
 *  - Shift
 *  - Alt
 *  - Ctrl
 */
window.axstrad.keyCode.isModifier = function(code)
{
    return code == axstrad.KEY.SHIFT
        || code == axstrad.KEY.CTRL
        || code == axstrad.KEY.ALT
};

/**
 * Returns TRUE/FALSE if <em>code</em> is not a character key or BACKSPACE or DELETE.
 */
window.axstrad.keyCode.isNonChar = function(code)
{
    return axstrad.keyCode.isNav(code)
        || axstrad.keyCode.isModifier(code)
        || axstrad.KEY.ESCAOE == code
        || axstrad.keyCode.inRange(code, 'FUNCKEY')
        || axstrad.KEY.CMD == code
        || axstrad.KEY.WIN == code
};


/**
 * The Key codes to keys for readable code
 *
 * if (code == 8)
 *     VS.
 * if (code == axstrad.KEY.BACKSPACE)
 *
 * I prefer the latter :-)
 */
window.axstrad.KEY = {
    BACKSPACE: 8,
    TAB: 9,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESCAPE: 27,
    SPACE: 32,
    PAGE: {
        UP: 33,
        DOWN: 34
    },
    END: 35,
    HOME: 36,
    CURSOR: {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    },
    DELETE: 46,

    NUM0: 48,
    NUM1: 49,
    NUM2: 50,
    NUM3: 51,
    NUM4: 52,
    NUM5: 53,
    NUM6: 54,
    NUM7: 55,
    NUM8: 56,
    NUM9: 57,

    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,

    HYPHEN: 109,

    F1 : 112,
    F2 : 113,
    F3 : 114,
    F4 : 115,
    F5 : 116,
    F6 : 117,
    F7 : 118,
    F8 : 119,
    F9 : 120,
    F10: 121,
    F11: 122,
    F12: 123,

    // OS Keys
    WIN: 91,  // Windows Key for Windows OS
    CMD: 224, // CMD key for OSX

    RANGE: {
        CURSOR: {
            START: 37,
            END: 40
        },
        LETTER: {
            START: 65,
            END: 90
        },
        NUM: {
            START: 48,
            END: 57
        },
        NUMPAD: {
            START: 96,
            END: 105
        },
        ACTION: { // Home/End
            START: 36,
            END: 35
        },
        PAGE: { // Page Up/Down
            START: 33,
            END: 34
        },
        FUNCKEY: {
            START: 112,
            END: 123
        }
    }
};
