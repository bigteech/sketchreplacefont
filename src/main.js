const sketch = require('sketch')
var ui = require('./ui')
var UI = require('sketch/ui')
var dom = require('sketch/dom')
var layout = require('./layout')

function changePage(one, from, to) {
	if (from.indexOf(to.id) > -1) {
		one.sharedStyleId = to.id;
	}
	one.affectedLayer && changePage(one.affectedLayer, from, to)
	one.overrides && one.overrides.forEach(y => changePage(y, from, to))
	one.layers && one.layers.forEach(y => changePage(y, from, to))

}



export default function (context) {
	try {

		const document = sketch.fromNative(context.document)
		let dialog = ui.dialog('合并', '');
		let styles = document.getSharedTextStyles()
		let names = styles.map(x => {
			return x.name;
		});
		let checkboxs = [];
		let scrollview = ui.scrollview();
		scrollview.setHasVerticalScroller(true);
		scrollview.setHasHorizontalScroller(true);
		let scrollContent = new layout(0, 0, 300, 600);
		names.forEach((x, y) => {
			let checkbox = ui.checkbox(false, x, y * 20);
			scrollContent.add(checkbox);
			checkboxs.push(checkbox);
		})
		scrollview.setDocumentView(scrollContent.view()); dialog.addAccessoryView(scrollview);
		let to = ui.popupButton(names)

		dialog.addAccessoryView(to);
		let responseCode = dialog.runModal();
		if (responseCode === 1000) {
			let ids = [];
			checkboxs.forEach((x, y) => {
				if (parseInt(x.stringValue())) {
					ids.push(styles[y].sharedStyleId)
				}
			})
			let toIndex = to.indexOfSelectedItem();
			let toValue = styles[toIndex];
			let document = dom.getSelectedDocument();

			document.pages.forEach(x => {
				changePage(x, ids, toValue);
			})

		}

	} catch (e) {
		UI.alert('error', e.toString())
	}
}
