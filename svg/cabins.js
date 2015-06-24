var $w = $(window), $b = $('body');

var Cabins = {
    selector: '#Cabins',
    highlight: 'lightblue'
};

(function(app){

    app.deckplans = [];
    app.selection = [];

    app.hover = function(event) {
        // Handled via CSS.
    };

    app.showSelection = function(text, visible) {
        // Add bounding box.
    };

    app.select = function(event) {
        var i = 0,
            cabins = app.selection,
            roomNo = this.textContent,
            cabin = this.toggleClass('selected');
        if (cabin.hasClass('selected')) {
            app.showSelection(this, true);
            cabins.push(roomNo);
        } else if ((i = cabins.indexOf(roomNo)) > -1) {
            app.showSelection(this, false);
            cabins.splice(i, 1);
        }
    };

    app.handleEvents = function(deck) {
        $(deck).find(this.selector)
            .on('click', 'text', app.select)
            .on('hover', 'text', app.hover);
    };

    app.setDeckplans = function(deck) {
        deck.cabins = [];
        app.deckplans.push(deck);
        $(deck).find(this.selector)
            .children('text').each(function(){
                deck.cabins.push(this.textContent);
            });
    };

    app.init = function(svg) {
        var deck = $(svg.documentElement).appendTo($b)[0];
        app.setDeckplans(deck);
        app.handleEvents(deck);
    };

})(Cabins);

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
