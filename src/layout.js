function LayoutView(x, y, width, height) {
    this.prevFrame = NSMakeRect(0, 0, 0, 0);
    this._views = [];
    var _view = NSView.alloc().initWithFrame(NSMakeRect(x, y, width, height == undefined ? 0 : height));
    this.view = function () {
        return _view;
    };
    return this;
}
LayoutView.prototype.add = function (view, layout) {
    if (view instanceof LayoutView) {
        return this.add(view.view(), layout);
    }
    var f = view.frame();
    var newFrame = f;
    if (layout === undefined) {
        //position it under previous element, and resize parent
        this.increaseHeight(f.size.height);
        newFrame = NSMakeRect(f.origin.x, 0, f.size.width, f.size.height);
        view.setFrame(newFrame);
    } else if (layout === "absolute/resize") {
        //position it absolutely, and resize parent if necessary
        var delta = f.size.height - this.height();
        if (delta > 0) {
            this.increaseHeight(delta);
        }
    } else if (layout === "absolute") {
        //just position it absolutely without resizing
    }
    this.prevFrame = newFrame;
    this.view().addSubview(view);
    this._views.push(view);

    return this;
};
LayoutView.prototype.addPadding = function (px) {
    //adds vertical padding at current position
    this.increaseHeight(px);
};
LayoutView.prototype.increaseHeight = function (delta) {
    var f = this.view().frame();

    //resize main view
    this.view().setFrame(NSMakeRect(f.origin.x, f.origin.y, f.size.width, f.size.height + delta));

    //translate each subview
    for (var i = 0; i < this._views.length; ++i) {
        var v = this._views[i];
        f = v.frame();
        v.setFrame(NSMakeRect(f.origin.x, f.origin.y + delta, f.size.width, f.size.height));
    }
    if (this._views.length) {
        //update prevFrame val
        this.prevFrame = this._views[this._views.length - 1].frame();
    }
};
LayoutView.prototype.height = function () {
    if (this._views.length == 0) {
        return 0;
    }
    var f = this._views[0].frame();
    return Math.abs(f.origin.y) + f.size.height;
};
module.exports =  LayoutView