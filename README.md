# Firefox-Scripts

My scripts to improve my experience with Firefox.

Requires [MrOtherGuy/fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig) to be installed.

Following the instructions, there should be a `chrome` directory inside the targeted profile with two directories: `JS` and `CSS`. The contents of this repository can be copied over as preferred.

## Brief Explanation

### CSS Styles
<details>
	<summary><code>addAccentColor.uc.css</code></summary>
	<ul>
		<li>Target: Menu borders, tab borders, and folder icons.</li>
		<li>Effect: Applies an accent color (Light blue, by default).</li>
	</ul>
</details>
<details>
	<summary><code>addMenuIcons.uc.css</code></summary>
	<ul>
		<li>Target: All menu items.</li>
		<li>Effect: Loads icons for all menus.</li>
		<ul>
			<li>For some reason, someone decided that icons were unnecessary. Unbelievable.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>floatingSidebar.uc.css</code></summary>
	<ul>
		<li>Target: The sidebar.</li>
		<li>Effect: Turns the sidebar into a floating panel, leaving the page under it untouched.</li>
		<ul>
			<li>By default, it squeezed the whole page, which was inconvenient.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>improveEditBookmarkPopup.uc.css</code></summary>
	<ul>
		<li>Target: The edit-bookmark popup that appears when clicking the star icon.</li>
		<li>Effect: Adds many small adjustments to the edit-bookmark popup.</li>
		<ul>
			<li>Increases size, adds the URL field, removes labels, and more.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>improveFullscreenPopup.uc.css</code></summary>
	<ul>
		<li>Target: The popup that appears when hovering the cursor on the top edge when in fullscreen mode.</li>
		<li>Effect: Makes the fullscreen-exit popup bigger.</li>
		<ul>
			<li>By default, it was way too small. That made clicking it inconvenient.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>improvePlacesEditBookmarkPanel.uc.css</code></summary>
	<ul>
		<li>Target: The edit-bookmark panel at the bottom of the Places window.</li>
		<li>Effect: Adds many small adjustments to the edit-bookmark panel.</li>
		<ul>
			<li>Removes labels, unnecessary texts, and more.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>improvePrivateBrowsingNewPage.uc.css</code></summary>
	<ul>
		<li>Target: The new-page (When in private browser mode).</li>
		<li>Effect: Improves the page.</li>
		<ul>
			<li>Sets the background to black, removes unnecessary text, and centers the logo.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>improveTabCloseButton.uc.css</code></summary>
	<ul>
		<li>Target: The close buttons from the tabs.</li>
		<li>Effect: Changes the behaviour of the close buttons.</li>
		<ul>
			<li>When tabs are big, show button.</li>
			<li>When tabs are small, hide button, and only show on hover.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>removeCheckboxFromConfirmationPopups.uc.css</code></summary>
	<ul>
		<li>Target: The checkbox from the confirmation popups.</li>
		<ul>
			<li>For example, the popup that appears when too many tabs are open.</li>
		</ul>
		<li>Effect: Hides the checkbox.</li>
		<ul>
			<li>The checkbox could be accidentally unchecked.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>removeOpenAllTabsButton.uc.css</code></summary>
	<ul>
		<li>Target: The menu item at the end of every bookmark menu.</li>
		<li>Effect: Removes the button.</li>
		<ul>
			<li>The button used space, and wasn't really useful.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>removePrivateBrowsingLabel.uc.css</code></summary>
	<ul>
		<li>Target: The text alongside the private browsing icon (When in private browser mode).</li>
		<li>Effect: Removes the text and leaves only the icon.</li>
		<ul>
			<li>By default, it was too big. It was getting in the way of the tabs.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>removeTabScroll.uc.css</code></summary>
	<ul>
		<li>Target: The scroll that appears when too many tabs are open.</li>
		<li>Effect: Removes the scroll.</li>
		<ul>
			<li>Without it, the tabs simply decrease in size.</li>
			<li>It means that every tab is now visible.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>resizeTabContainerSpaces.uc.css</code></summary>
	<ul>
		<li>Target: The space before and after the tabs container.</li>
		<li>Effect: Reduces the spaces.</li>
		<ul>
			<li>With less of it, tabs have more space.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>showScrollbarInMenus.uc.css</code></summary>
	<ul>
		<li>Target: Bookmark menus.</li>
		<li>Effect: Adds a thin scroll to the menus.</li>
		<ul>
			<li>It's very helpful to tell the actual size of the menu.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>toggleTabSoundOnlyWhenSelected.uc.css</code></summary>
	<ul>
		<li>Target: The sound toggle from the tabs.</li>
		<li>Effect: Changes the behaviour of the sound toggles.</li>
		<ul>
			<li>It can only be clicked when the tab is selected.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>trimContextMenu.uc.cs</code></summary>
	<ul>
		<li>Target: All the context menus.</li>
		<li>Effect: Removes unnecessary items.</li>
		<ul>
			<li>Set image as background, Pocket stuff, sort by name, and more.</li>
		</ul>
	</ul>
</details>

### JS Scripts
<details>
	<summary><code>addAutoExportHTMLToggler.uc.js</code></summary>
	<ul>
		<li>Target: The main menu.</li>
		<li>Effect: Creates a new button in the main menu.</li>
		<ul>
			<li>The button allows to toggle <code>browser.bookmarks.autoExportHTML</code>.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>addDelayToMenuPopupClose.uc.js</code><b> (WIP)</b></summary>
	<ul>
		<li>Target: All menus.</li>
		<li>Effect: When dragging a item (A bookmark), the menu should stay open for a little bit before closing.</li>
		<ul>
			<li>By default, it immediately closes as soon as the item is dragged outside. Very annoying.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>addPlaceholderOnFields.uc.js</code></summary>
	<ul>
		<li>Target: The text fields when editing a bookmark.</li>
		<li>Effect: Adds a descriptive text inside the fields.</li>
		<ul>
			<li>If the label at the side is removed, there is nothing to tell what the field is about. The placeholder addresses that</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>dinamicRecentFolders.uc.js</code><b> (WIP)</b></summary>
	<ul>
		<li>Target: The list of recent bookmark folders.</li>
		<li>Effect: Creating or editing a bookmark folder adds it to the list of recent folders.</li>
		<ul>
			<li>By default, only using a folder added it to the list.</li>
		</ul>
	</ul>
</details>
<details>
	<summary><code>multiRowTabs.uc.js</code><b> (WIP)</b></summary>
	<ul>
		<li>Target: Tabs.</li>
		<li>Effect: Allows the use of multiple rows of tabs!</li>
		<ul>
			<li>It even scrolls vertically!</li>
		</ul>
	</ul>
</details>
