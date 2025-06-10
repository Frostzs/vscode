/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';

suite('Tab width for fit and shrink', () => {
	let container: HTMLElement;
	let control: any;
	let fakeGroupsView: any;

	ensureNoDisposablesAreLeakedInTestSuite();

	class TestMultiEditorTabsControl {
		public tabsContainer: HTMLElement;
		public tabSizingFixedDisposables = { clear: () => { }, add: <T>(o: T) => o };
		public groupsView: any;
		public updateTabsFixedWidth = () => { };
		constructor(tabsContainer: HTMLElement, groupsView: any) {
			this.tabsContainer = tabsContainer;
			this.groupsView = groupsView;
		}
		public updateTabSizing(fromEvent: boolean) {
			const options = this.groupsView.partOptions;
			if (options.tabSizing === 'fit' || options.tabSizing === 'shrink') {
				if (fromEvent) {
					this.tabsContainer.style.setProperty('--tab-sizing-max-width', options.tabSizingFitShrinkMaxWidth + 'px');
				} else {
					this.tabsContainer.style.removeProperty('--tab-sizing-max-width');
				}
				this.tabsContainer.style.removeProperty('--tab-sizing-fixed-min-width');
				this.tabsContainer.style.removeProperty('--tab-sizing-fixed-max-width');
			}
		}
	}

	setup(() => {
		container = document.createElement('div');
		const tabsContainer = document.createElement('div');
		container.appendChild(tabsContainer);

		fakeGroupsView = {
			partOptions: {
				tabSizing: 'fit',
				tabSizingFitShrinkMaxWidth: 222,
				tabSizingFixedMinWidth: 80,
				tabSizingFixedMaxWidth: 120
			}
		};

		control = new TestMultiEditorTabsControl(tabsContainer, fakeGroupsView);
	});

	test('sets --tab-sizing-max-width when tabSizing is fit and fromEvent is true', () => {
		fakeGroupsView.partOptions.tabSizing = 'fit';
		fakeGroupsView.partOptions.tabSizingFitShrinkMaxWidth = 222;

		control.updateTabSizing(true);

		assert.strictEqual(
			control.tabsContainer.style.getPropertyValue('--tab-sizing-max-width'),
			'222px'
		);
	});

	test('removes fixed width variables when tabSizing is fit', () => {
		control.tabsContainer.style.setProperty('--tab-sizing-fixed-min-width', '80px');
		control.tabsContainer.style.setProperty('--tab-sizing-fixed-max-width', '120px');
		fakeGroupsView.partOptions.tabSizing = 'fit';

		control.updateTabSizing(true);

		assert.strictEqual(
			control.tabsContainer.style.getPropertyValue('--tab-sizing-fixed-min-width'),
			''
		);
		assert.strictEqual(
			control.tabsContainer.style.getPropertyValue('--tab-sizing-fixed-max-width'),
			''
		);
	});

	test('does not set --tab-sizing-max-width if fromEvent is false (fit)', () => {
		fakeGroupsView.partOptions.tabSizing = 'fit';
		fakeGroupsView.partOptions.tabSizingFitShrinkMaxWidth = 333;

		control.updateTabSizing(false);

		assert.strictEqual(
			control.tabsContainer.style.getPropertyValue('--tab-sizing-max-width'),
			''
		);
	});

	test('sets --tab-sizing-max-width when tabSizing is shrink and fromEvent is true', () => {
		fakeGroupsView.partOptions.tabSizing = 'shrink';
		fakeGroupsView.partOptions.tabSizingFitShrinkMaxWidth = 150;

		control.updateTabSizing(true);

		assert.strictEqual(
			control.tabsContainer.style.getPropertyValue('--tab-sizing-max-width'),
			'150px'
		);
	});

	test('removes fixed width variables when tabSizing is shrink', () => {
		control.tabsContainer.style.setProperty('--tab-sizing-fixed-min-width', '80px');
		control.tabsContainer.style.setProperty('--tab-sizing-fixed-max-width', '120px');
		fakeGroupsView.partOptions.tabSizing = 'shrink';

		control.updateTabSizing(true);

		assert.strictEqual(
			control.tabsContainer.style.getPropertyValue('--tab-sizing-fixed-min-width'),
			''
		);
		assert.strictEqual(
			control.tabsContainer.style.getPropertyValue('--tab-sizing-fixed-max-width'),
			''
		);
	});

	test('does not set --tab-sizing-max-width if fromEvent is false (shrink)', () => {
		fakeGroupsView.partOptions.tabSizing = 'shrink';
		fakeGroupsView.partOptions.tabSizingFitShrinkMaxWidth = 111;

		control.updateTabSizing(false);

		assert.strictEqual(
			control.tabsContainer.style.getPropertyValue('--tab-sizing-max-width'),
			''
		);
	});
});
