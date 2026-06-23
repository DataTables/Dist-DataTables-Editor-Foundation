/*! Editor Foundation styling 3.0.0-dev for DataTables
 * Copyright (c) SpryMedia Ltd - https://datatables.net/license/plus
 */

(function(factory){
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['datatables.net-zf', 'datatables.net-editor'], function (dt) {
			return factory(window, document, dt);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		var cjsRequires = function (root) {
			if (! root.DataTable) {
				require('datatables.net-zf')(root);
			}

			if (! window.DataTable.Editor) {
				require('datatables.net-editor')(root);
			}
		};

		if (typeof window === 'undefined') {
			module.exports = function (root) {
				if (! root) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				cjsRequires(root);
				return factory(root, root.document, root.DataTable);
			};
		}
		else {
			cjsRequires(window);
			module.exports = factory(window, window.document, window.DataTable);
		}
	}
	else {
		// Browser
		factory(window, document, window.DataTable);
	}
}(function(window, document, DataTable) {
'use strict';



//
// Note that this file does use jQuery as Bootstrap 3's JS depends on jQuery for
// its modal, so we know that it must be present.
//

// Set the default display controller to be our foundation control
DataTable.Editor.defaults.display = 'foundation';

// Change the default classes from Editor to be classes for Foundation
DataTable.util.object.assignDeep(DataTable.Editor.classes, {
	field: {
		wrapper: 'DTE_Field row',
		label: 'small-4 columns inline',
		input: 'small-8 columns DTE_Field_Input',
		inputError: 'is-invalid-input',
		error: 'error',
		multiValue: 'panel radius multi-value',
		multiInfo: 'small',
		multiRestore: 'panel radius multi-restore',
		'msg-labelInfo': 'label secondary',
		'msg-info': 'label secondary',
		'msg-message': 'label secondary',
		'msg-error': 'label alert'
	},
	form: {
		button: 'button small',
		buttonInternal: 'button small',
		buttonSubmit: 'button small'
	}
});

/*
 * Foundation display controller - this is effectively a proxy to the Foundation
 * modal control.
 */
var shown = false;
var reveal;

// Get the Foundation library from DT or local
function getFoundation() {
	let dtF = DataTable.use('foundation');

	if (dtF) {
		return dtF;
	}

	if (window.Foundation) {
		return window.Foundation;
	}

	throw new Error(
		'No Foundation library. Set it with `DataTable.use(foundation);`'
	);
}

const dom = {
	content: null,
	close: null
};

DataTable.Editor.fieldTypes.autocomplete.dropDownBody = true;
DataTable.Editor.fieldTypes.tags.dropDownBody = true;

DataTable.Editor.display.foundation = DataTable.util.object.assignDeep(
	{},
	DataTable.Editor.models.displayController,
	{
		init: function () {
			var $ = DataTable.use('jq');

			if (!dom.content) {
				dom.content = $(
					'<div class="reveal reveal-modal DTED" data-reveal></div>'
				);
				dom.close = $(
					'<button class="close close-button">&times;</div>'
				);
			}

			if (!reveal) {
				let foundation = getFoundation();

				reveal = new foundation.Reveal(dom.content, {
					closeOnClick: false
				});
			}

			return DataTable.Editor.display.foundation;
		},

		open: function (dte, append, callback) {
			var $ = DataTable.use('jq');
			var content = dom.content;

			content.children().detach();
			content.append(append);
			content.prepend(dom.close);

			dom.close
				.attr('title', dte.i18n.close)
				.off('click.dte-zf')
				.on('click.dte-zf', function () {
					dte.close('icon');
				});

			$(document)
				.off('click.dte-zf')
				.on(
					'click.dte-zf',
					'div.reveal-modal-bg, div.reveal-overlay',
					function (e) {
						if ($(e.target).closest(dom.content).length) {
							return;
						}
						dte.background();
					}
				);

			if (shown) {
				if (callback) {
					callback();
				}
				return;
			}

			shown = true;

			$(dom.content).one('open.zf.reveal', function () {
				if (callback) {
					callback();
				}
			});

			reveal.open();
		},

		close: function (dte, callback) {
			if (shown) {
				reveal.close();
				shown = false;
			}

			if (callback) {
				callback();
			}
		},

		node: function () {
			return dom.content[0];
		}
	}
);


return DataTable.Editor;
}));
