var $w = $(window), $b = $('body');

var Cabins = {
    selector: '#Cabins',
    highlight: 'lightblue',
    confirmation: '#tmplConfirmation'
};

(function($, app) {
//app === Cabins

    app.cabins = [];
    app.deckplans = [];
    app.selection = '';
    app.categories = {};

    app.hover = function(event) {
        // Handled via CSS.
    };

    app.showSelection = function(text, visible) {
        // Add bounding box.
    };

    app.submitSelection = function() {
        var $cabin_room = $('<input name="cabin_room"/>').val(app.selection);
        $cabin_room.appendTo(window.opener.document.forms[0]);
    };

    app.select = function(event) {
        var cabin, i = 0;
        app.cabins.forEach(function(cabin) {
            d3.select(cabin).classed('selected', false);
        });
        if (this.toggleClass) {
            cabin = this.toggleClass('selected');
            if (cabin.hasClass('selected')) {
                app.selection = this.textContent;
                app.showSelection(this, true);
            }
        } else {
            $.magnificPopup.open({
                items: {
                    src: $(this.confirmation),
                    type: 'inline'
                }
            });
        }
    };

    app.setDeckplans = function(deck) {
        deck.cabins = [];
        app.deckplans.push(deck);
        var re = /^([A-z]+)(\s|\-)?(\d+)$/i;
        $(deck).find(this.selector)
            .children('text').each(function(){
                var category = this.textContent.replace(re, '$1'),
                    bucket = app.categories[category],
                    roomNo = this.textContent;
                if (bucket && bucket.length) {
                    if (bucket.indexOf(deck) < 0) bucket.push(deck);
                } else {
                    app.categories[category] = [deck];
                }
                if (app.open.indexOf(roomNo) > -1) {
                    if (app.prevCabin === roomNo) {
                        $(this).trigger('click');
                    }
                    $(deck).add(this).show();
                    deck.cabins.push(roomNo);
                    app.cabins.push(this);
                }
            });
    };

    app.handleEvents = function(deck) {
        $(deck).find(this.selector)
            .on('click', 'text', app.select)
            .on('hover', 'text', app.hover);
        $(Cabins.confirmation)
            .on('click', 'button', this.submitSelection);
    };

    app.init = function(svg) {
        try {
            svg.documentElement.setAttribute('id', 'dp-' + this);
            var deck = $(svg.documentElement).appendTo($b)[0];
            app.prevCabin = location.search.substr(1);
            app.handleEvents(deck);
            app.setDeckplans(deck);
        } catch (err) {
            console.log(err.message);
        }
    };

})(jQuery, Cabins);

/*
Augment SVG elements with helper methods:
 */
SVGElement.prototype.hasClass = function(classNames) {
    return new RegExp('(\\s|^)' + classNames + '(\\s|$)').test(this.getAttribute('class'));
};
SVGElement.prototype.toggleClass = function(classNames) {
    d3.select(this).classed(classNames, !this.hasClass(classNames));
    return this;
};
