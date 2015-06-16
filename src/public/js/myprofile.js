function haveUpdated(control) {
  if (control.value.slice(-1) === ' ') {
    var tag = control.value.trim().toLowerCase();
    control.value = '';
    if (tag !== '') {
      var listNode = document.createElement('li'),
        spanNode = document.createElement('span'),
        textNode = document.createTextNode(tag);

      listNode.className = 'tag-item';

      spanNode.appendChild(textNode);
      listNode.appendChild(spanNode);

      document.getElementById('has').appendChild(listNode);
    }
  }
}

function wantUpdated(control) {
  if (control.value.slice(-1) === ' ') {
    var tag = control.value.trim().toLowerCase();
    control.value = '';
    if (tag !== '') {
      var listNode = document.createElement('li'),
        spanNode = document.createElement('span'),
        textNode = document.createTextNode(tag);

      listNode.className = 'tag-item';
      
      spanNode.appendChild(textNode);
      listNode.appendChild(spanNode);

      document.getElementById('wants').appendChild(listNode);
    }
  }
}
