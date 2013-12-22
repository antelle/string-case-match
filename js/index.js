(function() {
    "use strict";

    var matcher;
    var allItems;

    $(function() {
        $("[title]").tooltip();
        $("#search-list a").click(function(e) {
            e.preventDefault();
            $("#search-list a").removeClass("active");
            $(this).addClass("active");
            loadWordsList();
        });

        loadWordsList();

        $("#txt-search").keyup(function() {
            var query = $("#txt-search").val();
            searchItems(query);
        });
    });

    function loadWordsList() {
        $("#list-results").html("");
        var txt = $("#txt-search");
        txt.val("").prop("disabled", true).prop("placeholder", "Loading words list...");
        var url = "data/" + $("#search-list a.active").data("file");
        $.ajax({
            type: "GET",
            url: url,
            success: function(result) {
                allItems = $.trim(result).split("\n");
                initMatcher();
                txt.prop("disabled", false).prop("placeholder", "Please type something to search...").focus();
            },
            error: function() {
                txt.prop("placeholder", "Error loading words list :(");
            }
        })
        initMatcher();
    }

    function initMatcher() {
        matcher = new StringCaseMatch(allItems, { start: "<i>", end: "</i>" });
    }

    function searchItems(query) {
        if (!query.length) {
            $("#list-results").html("");
            return;
        }
        var matches = matcher.matches(query);
        var items = "";
        var maxItems = 10;
        for (var i = 0; i < matches.length; i++) {
            if (i >= maxItems) {
                items += "<li class=\"list-group-item text-muted\">(first " + maxItems + " items shown of " + matches.length + " matching)</li>";
                break;
            }
            items += "<li class=\"list-group-item\">" + matches[i] + "</li>";
        }
        if (!matches.length) {
            items = "<li class=\"list-group-item text-muted\">Nothing found, total items: " + allItems.length + "</li>";
        }
        $("#list-results").html(items);
    }
})();