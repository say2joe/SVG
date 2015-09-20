var Cabins = {
    selector: '#Cabins',
    decks: '#deckplans',
    highlight: 'lightblue',
    selectedRoom: 'cabin_room',
    confirmation: '#tmplConfirmation'
};

(function($, app) {
//app === Cabins

    app.cabins = [];
    app.deckplans = [];
    app.selection = '';
    app.categories = {};

    var $w = $(window),
        $b = $('body'),
        $f = $b.find('form'),
        $decks = $(app.decks);

    app.legend = function(svg) {
        var $sideview = $(svg.documentElement).appendTo('figure').show();
        $sideview.addClass('.sideview');
    };

    app.hover = function(event) {
        // Handled via CSS.
    };

    app.showSelection = function(text, visible) {
        // Add bounding box.
    };

    app.submitSelection = function(event) {
        if ($(this).hasClass('reserve')) {
            var $cabin_room = $('<input type="hidden"/>').attr('name', Cabins.selectedRoom);
            $f.append($cabin_room.val(app.selection)).submit();
        }
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
        }
        $.magnificPopup.open({
            items: {
                src: $(app.confirmation),
                type: 'inline'
            }
        });
    };

    app.setDeckplan = function(deck) {
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

    app.deckhover = function(event) {
        var id = $(event.target).attr('id').replace('dp-','');
        $('#shipview').find('D' + id).css({
            fill: (event.type === "mouseenter")? '#00f' : '#fff'
        });
    };

    app.handleEvents = function() {
        $decks.on('hover', app.deckhover)
            .on('hover', 'text', app.hover)
            .on('click', 'text', app.select);
        $('body').on('click', '.reserve',
            app.submitSelection
        );
    };

    app.init = function(svg) {
        var deck;
        try {
            svg.documentElement.setAttribute('id', 'dp-' + this);
            deck = $(svg.documentElement).appendTo($decks)[0];
            app.setDeckplan(deck);
        } catch (err) {
            console.log(err.message, 'for SVG of deck:', this.toString());
        } finally {
            if (!app.initialized) {
                app.handleEvents(deck);
                app.initialized = true;
            }
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
