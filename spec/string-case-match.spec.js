(function() {
    "use strict";
    describe("StringCaseMatch.rank", function() {
        var match;

        beforeEach(function() {
            match = new StringCaseMatch();
        });

        it("Matches equal strings", function() {
            expect(match.rank("hello", "hello")).toBe(1);
        });
        it("Doesn't match totally different strings", function() {
            expect(match.rank("hello", "bye")).toBeFalsy();
        });

        it("Matches CamelCase strings by first letters", function() {
            expect(match.rank("HelloWorld", "hw")).toBeTruthy();
            expect(match.rank("HelloEvilWorld", "he")).toBeTruthy();
            expect(match.rank("HelloEvilWorld", "hew")).toBeTruthy();
        });
        it("Matches CamelCase strings by first letters in middle words", function() {
            expect(match.rank("HelloWorld", "w")).toBeTruthy();
            expect(match.rank("HelloEvilWorld", "ew")).toBeTruthy();
        });
        it("Matches CamelCase strings by single word start letter", function() {
            expect(match.rank("HelloWorld", "h")).toBeTruthy();
            expect(match.rank("HelloWorld", "w")).toBeTruthy();
            expect(match.rank("HelloEvilWorld", "e")).toBeTruthy();
        });
        it("Matches CamelCase strings by word parts", function() {
            expect(match.rank("HelloWorld", "hew")).toBeTruthy();
            expect(match.rank("HelloWorld", "hewo")).toBeTruthy();
            expect(match.rank("HelloWorld", "hwo")).toBeTruthy();
            expect(match.rank("HelloWorld", "hellow")).toBeTruthy();
            expect(match.rank("HelloWorld", "helloworld")).toBeTruthy();
            expect(match.rank("HelloWorld", "hellworld")).toBeTruthy();
            expect(match.rank("HelloWorld", "hellwor")).toBeTruthy();
        });
        it("Matches CamelCase strings by letters with spaces", function() {
            expect(match.rank("HelloWorld", "h w")).toBeTruthy();
        });
        it("Doesn't match CamelCase strings by letters with separators", function() {
            expect(match.rank("HelloWorld", "h-w")).toBeFalsy();
        });

        it("Matches pascalCase strings by first letters", function() {
            expect(match.rank("helloWorld", "hw")).toBeTruthy();
            expect(match.rank("helloEvilWorld", "he")).toBeTruthy();
            expect(match.rank("helloEvilWorld", "hew")).toBeTruthy();
        });
        it("Matches pascalCase strings by first letters in middle words", function() {
            expect(match.rank("helloWorld", "w")).toBeTruthy();
            expect(match.rank("helloEvilWorld", "ew")).toBeTruthy();
        });
        it("Matches pascalCase strings by single word start letter", function() {
            expect(match.rank("helloWorld", "h")).toBeTruthy();
            expect(match.rank("helloWorld", "w")).toBeTruthy();
            expect(match.rank("helloEvilWorld", "e")).toBeTruthy();
        });
        it("Matches pascalCase strings by word parts", function() {
            expect(match.rank("helloWorld", "hew")).toBeTruthy();
            expect(match.rank("helloWorld", "hewo")).toBeTruthy();
            expect(match.rank("helloWorld", "hwo")).toBeTruthy();
            expect(match.rank("helloWorld", "hellow")).toBeTruthy();
            expect(match.rank("helloWorld", "helloworld")).toBeTruthy();
            expect(match.rank("helloWorld", "hellworld")).toBeTruthy();
            expect(match.rank("helloWorld", "hellwor")).toBeTruthy();
        });
        it("Matches pascalCase strings by letters with spaces", function() {
            expect(match.rank("helloWorld", "h w")).toBeTruthy();
        });
        it("Doesn't match pascalCase strings by letters with separators", function() {
            expect(match.rank("helloWorld", "h-w")).toBeFalsy();
        });

        it("Matches dash-case strings by first letters", function() {
            expect(match.rank("hello-world", "hw")).toBeTruthy();
            expect(match.rank("hello-evil-world", "he")).toBeTruthy();
            expect(match.rank("helloEvilWorld", "hew")).toBeTruthy();
        });
        it("Matches dash-case strings by first letters in middle words", function() {
            expect(match.rank("hello-world", "w")).toBeTruthy();
            expect(match.rank("hello-evil-world", "ew")).toBeTruthy();
        });
        it("Matches dash-case strings by single word start letter", function() {
            expect(match.rank("hello-world", "h")).toBeTruthy();
            expect(match.rank("hello-world", "w")).toBeTruthy();
            expect(match.rank("hello-evil-world", "e")).toBeTruthy();
        });
        it("Matches dash-case strings by word parts", function() {
            expect(match.rank("hello-world", "hew")).toBeTruthy();
            expect(match.rank("hello-world", "hewo")).toBeTruthy();
            expect(match.rank("hello-world", "hwo")).toBeTruthy();
            expect(match.rank("hello-world", "hellow")).toBeTruthy();
            expect(match.rank("hello-world", "helloworld")).toBeTruthy();
            expect(match.rank("hello-world", "hellworld")).toBeTruthy();
            expect(match.rank("hello-world", "hellwor")).toBeTruthy();
        });
        it("Matches dash-case strings by letters with spaces", function() {
            expect(match.rank("hello-world", "h w")).toBeTruthy();
        });
        it("Matches dash-case strings by letters with separators", function() {
            expect(match.rank("hello-world", "h-w")).toBeTruthy();
            expect(match.rank("hello-world.js", "h-w.j")).toBeTruthy();
            expect(match.rank("hello-world.js", "h-w.js")).toBeTruthy();
            expect(match.rank("hello-world.js", "w.js")).toBeTruthy();
        });
        it("Matches dash-case strings by letters with skipped separators", function() {
            expect(match.rank("hello-world.js", "h-.js")).toBeTruthy();
            expect(match.rank("hello-world.js", "h-js")).toBeTruthy();
            expect(match.rank("hello-world.js", "h.js")).toBeTruthy();
        });
        it("Doesn't match dash-case strings by letters with another separators", function() {
            expect(match.rank("hello-world", "h/w")).toBeFalsy();
        });

        it("Matches space phrase strings by first letters", function() {
            expect(match.rank("hello world", "hw")).toBeTruthy();
            expect(match.rank("hello evil world", "he")).toBeTruthy();
            expect(match.rank("hello evil world", "hew")).toBeTruthy();
        });
        it("Matches space phrase strings by first letters in middle words", function() {
            expect(match.rank("hello world", "w")).toBeTruthy();
            expect(match.rank("hello evil world", "ew")).toBeTruthy();
        });
        it("Matches space phrase strings by single word start letter", function() {
            expect(match.rank("hello world", "h")).toBeTruthy();
            expect(match.rank("hello world", "w")).toBeTruthy();
            expect(match.rank("helloEvilWorld", "e")).toBeTruthy();
        });
        it("Matches space phrase strings by word parts", function() {
            expect(match.rank("hello world", "hew")).toBeTruthy();
            expect(match.rank("hello world", "hewo")).toBeTruthy();
            expect(match.rank("hello world", "hwo")).toBeTruthy();
            expect(match.rank("hello world", "hellow")).toBeTruthy();
            expect(match.rank("hello world", "helloworld")).toBeTruthy();
            expect(match.rank("hello world", "hellworld")).toBeTruthy();
            expect(match.rank("hello world", "hellwor")).toBeTruthy();
        });
        it("Matches space phrase strings by letters with spaces", function() {
            expect(match.rank("hello world", "h w")).toBeTruthy();
        });
        it("Doesn't match space phrase strings by letters with separators", function() {
            expect(match.rank("hello world", "h-w")).toBeFalsy();
        });

        it("Matches start of word", function() {
            expect(match.rank("hello", "he")).toBeTruthy();
            expect(match.rank("hello", "hell")).toBeTruthy();
        });
        it("Matches part of word in the end", function() {
            expect(match.rank("hello", "ello")).toBeTruthy();
            expect(match.rank("hello", "llo")).toBeTruthy();
        });
        it("Matches part of word in the middle", function() {
            expect(match.rank("hello", "el")).toBeTruthy();
            expect(match.rank("trololo", "ol")).toBeTruthy();
        });
        it("Doesn't match part of word with next abbreviation", function() {
            expect(match.rank("helloWorld", "elw")).toBeFalsy();
        });
        it("Doesn't match extra words with spaces in the query", function() {
            expect(match.rank("hello world", "esgrsregsg llo")).toBeFalsy();
        });
        it("Expects a space if the query contains space", function() {
            expect(match.rank("hello world", "h ello")).toBeFalsy();
        });

        it("Matches single letter at start", function() {
            expect(match.rank("hello", "h")).toBeTruthy();
        });
        it("Matches single letter at start when there's such letter in the middle also", function() {
            expect(match.rank("hellohehe", "h")).toBeTruthy();
        });
        it("Doesn't match single letter in the middle of a word", function() {
            expect(match.rank("hello", "e")).toBeFalsy();
        });
        it("Doesn't match single letter at the end", function() {
            expect(match.rank("hello", "o")).toBeFalsy();
        });

        it("Matches special characters", function() {
            expect(match.rank("Strauß", "auß")).toBeTruthy();
        });
        it("Matches digits", function() {
            expect(match.rank("123", "12")).toBeTruthy();
            expect(match.rank("hello123", "12")).toBeTruthy();
        });
        it("Matches digits as words", function() {
            expect(match.rank("hello123", "he12")).toBeTruthy();
        });

        it("Matches diacritics with simple chars", function() {
            expect(match.rank("Strauß", "straus")).toBeTruthy();
            expect(match.rank("ёж", "еж")).toBeTruthy();
            expect(match.rank("tränen", "ran")).toBeTruthy();
        });

        it("Favors correct case", function() {
            expect(match.rank("hello", "hello")).toBeGreaterThan(match.rank("hello", "Hello"));
            expect(match.rank("helloWorld", "hW")).toBeGreaterThan(match.rank("helloWorld", "hw"));
        });
        it("Favors longer strings", function() {
            expect(match.rank("hello", "hell")).toBeGreaterThan(match.rank("hello", "he"));
            expect(match.rank("hello", "ello")).toBeGreaterThan(match.rank("hello", "lo"));
        });
        it("Favors words matching", function() {
            expect(match.rank("helloWorld", "hw")).toBeGreaterThan(match.rank("helloWorld", "oWo"));
        });
        it("Favors correct separators", function() {
            expect(match.rank("hello-world", "h-w")).toBeGreaterThan(match.rank("hello-world", "hw"));
            expect(match.rank("hello-world", "h-w")).toBeGreaterThan(match.rank("hello-world", "h w"));
        });
        it("Favors correct diacritics", function() {
            expect(match.rank("Füße", "füße")).toBeGreaterThan(match.rank("Füße", "fuse"));
        });
    });

    describe("StringCaseMatch.match", function() {
        it("Returns matched string", function() {
            expect(new StringCaseMatch(["hello"]).matches("hello")).toEqual(["hello"]);
        });
        it("Returns empty array if empty", function() {
            expect(new StringCaseMatch([]).matches("hello")).toEqual([]);
            expect(new StringCaseMatch().matches("hello")).toEqual([]);
        });
        it("Returns array of strings", function() {
            expect(new StringCaseMatch(["hello", "trololo"]).matches("lo")).toEqual(["hello", "trololo"]);
        });
        it("Returns empty if nothing matches", function() {
            expect(new StringCaseMatch(["hello", "trololo"]).matches("bye")).toEqual([]);
        });
        it("Doesn't return nulls", function() {
            expect(new StringCaseMatch(["hello", null]).matches("hell")).toEqual(["hello"]);
        });
        it("Doesn't return empty strings", function() {
            expect(new StringCaseMatch(["hello", ""]).matches("hell")).toEqual(["hello"]);
        });
        it("Returns strings limited by top", function() {
            expect(new StringCaseMatch(["hello", "trololo"]).matches("lo", 1)).toEqual(["hello"]);
            expect(new StringCaseMatch(["hello", "trololo"]).matches("lo", 2)).toEqual(["hello", "trololo"]);
            expect(new StringCaseMatch(["hello", "trololo"]).matches("lo", 3)).toEqual(["hello", "trololo"]);
        });
        it("Sorts strings by rank", function() {
            expect(new StringCaseMatch(["Hello", "hell", "hello"]).matches("hell")).toEqual(["hell", "hello", "Hello"]);
        });
        it("Highlights matching parts of string", function() {
            expect(new StringCaseMatch(["Hello-World"], { start: "<i>", end: "</i>" }).matches("hellWo")).toEqual(["<i>Hell</i>o-<i>Wo</i>rld"]);
            expect(new StringCaseMatch(["Hello-World"], { start: "<i>", end: "</i>" }).matches("h")).toEqual(["<i>H</i>ello-World"]);
            expect(new StringCaseMatch(["Hello-World"], { start: "<i>", end: "</i>" }).matches("ld")).toEqual(["Hello-Wor<i>ld</i>"]);
        });
        it("Monitors search array changes", function() {
            var strs = ["Hello", "hello"];
            var matcher = new StringCaseMatch(strs);
            expect(matcher.matches("hell")).toEqual(["hello", "Hello"]);
            strs.push("hell");
            expect(matcher.matches("hell")).toEqual(["hell", "hello", "Hello"]);
            strs.splice(0, 1);
            expect(matcher.matches("hell")).toEqual(["hell", "hello"]);
        });
    });
})();