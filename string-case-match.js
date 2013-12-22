/**
 * @license StringCaseMatch | (c) 2013 Antelle | https://github.com/antelle/string-case-match/blob/master/MIT-LICENSE.txt
 */

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {
    "use strict";

    var CHAR_LETTER = "l";
    var CHAR_LETTER_LOWER = "ll";
    var CHAR_LETTER_UPPER = "lu";
    var CHAR_DIGIT = "d";
    var CHAR_SPACE = "s";
    var CHAR_SYMBOL = "x";

    var MATCH_TYPE_FIRST = "f";
    var MATCH_TYPE_WORD_START = "w";
    var MATCH_TYPE_MIDDLE = "l";
    var MATCH_TYPE_SEP = "s";
    var MATCH_TYPE_SEQUENCE = "q";

    /**
     * String matching class. Given a set of strings to match, will be able to search it by different input.
     * @example
     * var StringCaseMatch = require("string-case-match");
     * var matcher = new StringCaseMatch(["abc", "HelloWorld"]);
     * var results = matcher.matches("hw");
     * var top5Results = matcher.matches("hw", 5);
     * @param {String[]} [strings] - strings which will be searched
     * @param {Object} [config] - configuration paramters
     * @constructor
     */
    var StringCaseMatch = function(strings, config) {
        var result = [];
        if (strings) {
            for (var i = 0; i < strings.length; i++) {
                if (strings[i])
                    result.push(strings[i]);
            }
        }
        this.strings = result;
        if (config)
            this.config = config;
    };

    StringCaseMatch.prototype.config = {
        start: "",
        end: ""
    };

    /**
     * Gets matches with str used as input
     * @param {String} query - input string
     * @param {Number} [top] - max top strings to match; by default will return all matches
     * @return {String[]} - matched set of strings, sorted by match value
     */
    StringCaseMatch.prototype.matches = function(query, top) {
        if (!query)
            return [];
        var matched = [];
        var strs = this.strings;
        var len = strs.length;
        var i;
        for (i = 0; i < len; i++) {
            var match = getBestMatch(strs[i], query);
            //console.log(JSON.stringify(strs[i]) + " [" + query + "] => " + match.rank);
            if (match && match.rank > 0)
                matched.push({ str: strs[i], match: match });
        }
        matched.sort(function(x, y) { return y.match.rank - x.match.rank; });
        var result = [];
        var max = top > 0 ? Math.min(top, matched.length) : matched.length;
        var needHighlight = this.config.start || this.config.end;
        for (i = 0; i < max; i++) {
            var str = matched[i].str;
            if (needHighlight)
                str = highlightStr(str, matched[i].match, this.config);
            result.push(str);
        }
        return result;
    };

    /**
     * Gets rank of string against a query
     * @param {String} str - source string to search in
     * @param {String} query - query string
     * @returns {Number} - rank [0..1], more is better
     */
    StringCaseMatch.prototype.rank = function(str, query) {
        var bestMatch = getBestMatch(str, query);
        return bestMatch ? bestMatch.rank : 0;
    };

    function getBestMatch(str, query) {
        if (!query || !str)
            return 0;

        var i, queryIx, strIx, queryCharCls, strCharCls, strict;

        var strLen = str.length;
        var strLower = str.toLowerCase();
        var strCharClasses = [];
        for (i = 0; i < strLen; i++)
            strCharClasses.push(getCharClass(str[i]));

        var queryLen = query.length;
        var queryLower = query.toLowerCase();
        var queryCharClasses = [];
        for (i = 0; i < queryLen; i++)
            queryCharClasses.push(getCharClass(query[i]));

        var matches = [];
        for (strIx = 0; strIx < strLen; strIx++) {
            if (strLower[strIx] == queryLower[0]) {
                strCharCls = strCharClasses[strIx];
                var matchType;
                if (strIx == 0)
                    matchType = MATCH_TYPE_FIRST;
                else if (strCharCls == CHAR_SPACE || strCharCls == CHAR_SYMBOL)
                    matchType = MATCH_TYPE_SEP;
                else
                    matchType = isWordStart(strCharClasses[strIx], strCharClasses[strIx - 1]) ? MATCH_TYPE_WORD_START : MATCH_TYPE_MIDDLE;
                strict = query[0] == str[strIx];
                matches.push({ pos: strIx, type: matchType, strict: strict });
            }
        }

        if (matches.length == 0)
            return 0;

        for (queryIx = 1; queryIx < queryLen; queryIx++) {
            queryCharCls = queryCharClasses[queryIx];
            var newMatches = [];
            matchloop:
            for (i = 0; i < matches.length; i++) {
                var match = matches[i];
                for (strIx = match.pos + 1; strIx < strLen; strIx++) {
                    strCharCls = strCharClasses[strIx];
                    strict = str[strIx] == query[queryIx];
                    var equals = strict || strLower[strIx] == queryLower[queryIx];
                    if (strIx == match.pos + 1) {
                        if (match.waitNewWord)
                            continue;
                        if (equals) {
                            newMatches.push({ prev: match, pos: strIx, type: MATCH_TYPE_SEQUENCE, strict: strict });
                            continue;
                        } else {
                            var firstMatchItem = match;
                            while (firstMatchItem.prev)
                                firstMatchItem = firstMatchItem.prev;
                            if (firstMatchItem.type == MATCH_TYPE_MIDDLE)
                                continue matchloop;
                        }
                    }
                    if (strCharCls == CHAR_SPACE || strCharCls == CHAR_SYMBOL) {
                        if (queryCharCls == CHAR_SPACE) {
                            newMatches.push({ prev: match, pos: strIx, type: MATCH_TYPE_SEP, strict: strict });
                        } else if (queryCharCls == CHAR_SYMBOL) {
                            if (equals)
                                newMatches.push({ prev: match, pos: strIx, type: MATCH_TYPE_SEP, strict: strict });
                        }
                        continue;
                    }
                    var strCharWordStart = isWordStart(strCharClasses[strIx], strCharClasses[strIx - 1]);
                    //console.log("#" + strIx + " (" + str[strIx] + ", " + query[queryIx] + "): " + strCharCls + (strCharWordStart ? " ws" : "") + (equals ? " eq" : ""));
                    if (equals && strCharWordStart) {
                        newMatches.push({ prev: match, pos: strIx, type: MATCH_TYPE_WORD_START, strict: strict });
                    }
                }
                if (queryCharCls == CHAR_SPACE) {
                    match.waitNewWord = true;
                    newMatches.push(match);
                }
            }
            matches = newMatches;
        }

        if (matches.length == 0)
            return 0;

        for (i = 0; i < matches.length; i++) {
            matches[i] = convertMatch(matches[i]);
            rankMatch(matches[i], str, query);
        }
        matches.sort(function (x, y) { return y.rank - x.rank });
        //console.log("Matches: " + JSON.stringify(matches));
        return matches[0];
    }

    function isWordStart(chCls, chClsPrev) {
        return (chCls[0] == CHAR_LETTER && (chClsPrev[0] != CHAR_LETTER || chCls == CHAR_LETTER_UPPER && chClsPrev == CHAR_LETTER_LOWER))
            || chCls == CHAR_DIGIT && chClsPrev != CHAR_DIGIT;
    }

    function getCharClass(ch) {
        var chUpper = ch.toUpperCase();
        if (chUpper != ch.toLowerCase() || ch == "ß")
            return ch == chUpper ? CHAR_LETTER_UPPER : CHAR_LETTER_LOWER;
        if (ch >= "0" && ch <= "9")
            return CHAR_DIGIT;
        if (ch == " " || ch == "\t")
            return CHAR_SPACE;
        return CHAR_SYMBOL;
    }

    function convertMatch(match) {
        var linearMatch = { ch: [] };
        while (match) {
            linearMatch.ch.unshift({ pos: match.pos, type: match.type, strict: match.strict });
            match = match.prev;
        }
        return linearMatch;
    }

    function rankMatch(match, str, query) {
        match.rank = 0;
        if (match.ch.length == 0)
            return;
        var nonStricts = 0;
        for (var i = 0; i < match.ch.length; i++)
            if (!match.ch[i].strict)
                nonStricts++;
        if (match.ch.length == 1 && match.ch[0].type != MATCH_TYPE_FIRST && match.ch[0].type != MATCH_TYPE_WORD_START)
            return;

        var rank = 1;
        rank -= 0.1 * (nonStricts / match.ch.length);
        if (match.ch[0].type == MATCH_TYPE_MIDDLE)
            rank -= 0.5;
        var matchLen = Math.min(match.ch.length, query.length, str.length);
        rank *= matchLen / str.length;
        match.rank = rank;
    }

    function highlightStr(str, match, config) {
        var result = "";
        var matchIx = 0;
        var isHighlighted = false;
        for (var strIx = 0; strIx < str.length; strIx++) {
            var curMatchCh = match.ch[matchIx];
            if (curMatchCh && curMatchCh.pos == strIx) {
                if (!isHighlighted) {
                    result += config.start;
                    isHighlighted = true;
                }
                result += str[strIx];
                matchIx++;
                continue;
            }
            if (isHighlighted) {
                result += config.end;
                isHighlighted = false;
            }
            result += str[strIx];
        }
        if (isHighlighted)
            result += config.end;
        return result;
    }

    if ((typeof module === "object") && module.exports)
        module.exports = StringCaseMatch;
    else if ((typeof define === "function") && define.amd)
        define(function() { return StringCaseMatch; });
    else if (typeof window === "object")
        window.StringCaseMatch = StringCaseMatch;
})();
