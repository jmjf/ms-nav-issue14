# ms-nav-issue14
Small test demonstrating metalsmith-navigation Issue #14

###Issue Description
Need to be able to assign proper menu name text and sort order to navNodes with type dir.

Given the following:
```
src/
    subitem/
        test.md   (navTitle: Subitem Test, navOrder: 1 -- in submenu)
    index.md      (navTitle: Home, navOrder: 2)
    about.md      (navTitle: About, navOrder: 3)
    subitem.md    (navTitle: Subitem Menu Item, navOrder: 1)
```

I need to get the data to build the following menu tree.
```
Subitem Menu Item
    Subitem Test
Home
About
```

###Initial State
In build-noperma, the menu tree is in the expected order. The navNode for subitem.html has @root.navTitle = Subitem Menu Test and has children, indicating it is a parent menu item.

In build-perma, the menu tree is not in the expected order--subitem is last instead of first. The navNode for subitem/index.html has @root.navTitle = Subitem Menu Test and has children, indicating it is a parent menu item.

###Observations
In a no-permalinks build, the subitem directory is not in the navNode tree. The item in the tree is subitem.html. Detect parent menu status based on the presence of children.

In a permalinks build, the subitem directory is in the navNode tree. The directory node does not get metadata from its index.html (subitem.md). Can detect parent menu status based on the presence of children.

Both permalink and no-permalink builds can detect parent menu status based on the presence of children, so there is a consistent detection approach that works regardless of permalinks. No changes needed to this behavior.

The 'sortBy()` function built by `makeSortByFunc()` requires that permalink directories have only one child to link the child to the dir node. Otherwise, the dir navNode will not be sorted. All dir navNodes for submenus are disqualified and will sort after any file navNodes with sort keys defined in front matter.

###Proposed Solution
`makeSortByFunc()` should search for a file navNode for index.html in subdirectories and, if found, match it to the dir navNode regardless of the number of children the dir navNode has.

###Post-change State
In build-noperma, the navNode for subitem.html has @root.navTitle = Subitem Menu Test and has children. It appears as the first item in the menu. The navNode's navPath (`this.navPath` in templates) contains subitem.html, the link to the file associated with the menu item if it is not a dummy item.

In build-perma, the navNode for subitem/index.html has @root.navTitle = Subitem Menu Test and has children. It appears as the first item in the menu. The navNode's navPath (`this.navPath` in templates) contains subitem, the link to the file (subitem/index.html) associated with the menu item if it is not a dummy item.

In both cases, developers can choose to use the navPath if the item is live or # if the item is a dummy item.