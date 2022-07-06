function list_to_tree(list) {
    var map = {}, node, roots = [], i;
    
    for (i = 0; i < list.length; i += 1) {
      map[list[i]._name] = i; // initialize the map
      list[i]._children = []; // initialize the _children
    }
    
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node._parent !== "0") {
        // if you have dangling branches check that map[node._parent] exists
        list[map[node._parent]]._children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }
  
  var entries = [{
      "_name": "12",
      "_parent": "0",
      "text": "Man",
      "level": "1",
      "_children": null
    },
    {
      "_name": "6",
      "_parent": "12",
      "text": "Boy",
      "level": "2",
      "_children": null
    },
    {
      "_name": "7",
      "_parent": "12",
      "text": "Other",
      "level": "2",
      "_children": null
    },
    {
      "_name": "9",
      "_parent": "0",
      "text": "Woman",
      "level": "1",
      "_children": null
    },
    {
      "_name": "11",
      "_parent": "9",
      "text": "Girl",
      "level": "2",
      "_children": null
    }
  ];
  root = list_to_tree(entries);
  console.log(root[0]._children[0]._children);
  