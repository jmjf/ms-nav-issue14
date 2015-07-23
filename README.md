# ms-nav-issue14
Small test demonstrating metalsmith-navigation Issue #14

###Issue Description
Need to be able to assign proper menu name text and sort order to navNodes with type dir.

Given the following:
```
src/
    subitem/
        test.md   (name: Subitem Test, sort: 1)
    index.md      (name: Home, sort: 2)
    about.md      (name: About, sort: 3)
    subitem.md    (name: Subitem Menu Item, sort: 1)
```

I need to get back data to build the following menu tree.
```
Subitem Menu Item
    Subitem Test
Home
About
```

###Observations
In a no-permalinks build, the subitem directory is not in the navNode tree. The item in the tree is subitem.html. Detect parent menu status based on the presence of children.

In a permalinks build, the subitem directory is in the navNode tree. The directory node does not get metadata from its index.html (subitem.md). Can detect parent menu status based on the presence of children.

Both permalink and no-permalink builds can detect parent menu status based on the presence of children, so there is a consistent detection approach that works regardless of permalinks. No changes needed to this behavior.

The `makeSortByFunc()` method requires that permalink directories have only one child to link the child to the dir node. Submenus are disqualified as a result.

###Proposed Solution
`makeSortByFunc()` should look for index.html in subdirectories and match it to the dir navNode regardless of the number of children.