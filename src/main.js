const sketch = require('sketch')
var ui = require('./ui')
var UI = require('sketch/ui')
var dom = require('sketch/dom')


function changePage(one, from, to) {
				if(from.indexOf(to.id) > -1) {
								one.sharedStyleId = to.id;
				}
				one.affectedLayer && changePage(one.affectedLayer, from, to)
				one.overrides && one.overrides.forEach(y => changePage(y, from, to))
				one.layers && one.layers.forEach(y => changePage(y, from, to))

}



export default function(context) {
				try{

								const document = sketch.fromNative(context.document)
								let dialog = ui.dialog('合并', '');
								let styles = document.getSharedTextStyles()
								let names = styles.map(x => {
												return x.name;
								});
								let layers = document.selectedLayers
								layers.forEach(x => {
												let label = ui.label(x.name);
												dialog.addAccessoryView(label);
								})

								let to = ui.popupButton(names)
								dialog.addAccessoryView(to);
								let responseCode = dialog.runModal();
								if (responseCode === 1000) {
												let fromValue = [];
												layers.forEach(x => {
																fromValue.push(x.sharedStyleId)
												})
												let toIndex = to.indexOfSelectedItem();
												let toValue = styles[toIndex];
												let document = dom.getSelectedDocument();

												document.pages.forEach(x => {
																changePage(x, fromValue, toValue);
												})

								}

				}catch(e) {
								UI.alert('error', e.toString())
				}
}
