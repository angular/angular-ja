var sourceVisible = localStorage.getItem('source-visible') === 'true';

(function ($) {
  function addOriginalToggler() {
    var nodes = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, header, a, button, small');
    _.each(nodes, function (node) {
      var $node = $(node);

      if (isLink(node) || isButton(node)) {
        $node.on('click', function (event) {
          event.stopPropagation();
        });

        if (/^http?s:\/\//.test($node.attr('href')) && !$node.attr('target')) {
          $node.attr('target', '_blank');
        }
      }

      var prevNode = node.previousElementSibling;
      var $prevNode = $(prevNode);

      if (!prevNode) {
        return;
      }

      if (isTranslationResult(node, prevNode)) {
        if ($prevNode.hasClass('nav-list-item') ||
          $prevNode.hasClass('l-right') ||
          $prevNode.hasClass('l-left')) {
          return;
        }
        if ($node.text() === $prevNode.text()) {
          return;
        }

        $node.attr('id', prevNode.id);
        $node.addClass('translated');
        $prevNode.removeAttr('id');
        $prevNode.addClass('original-english');
        if (!sourceVisible) {
          $prevNode.addClass('hidden');
        }
        if (!isLink(node) && !isButton(node)) {
          var isDragging = false;
          $node.on('mousedown', function () {
            $(window).on('mousemove', function () {
              isDragging = true;
              $(window).unbind('mousemove');
            });
          });
          $prevNode.on('mousedown', function () {
            $(window).on('mousemove', function () {
              isDragging = true;
              $(window).unbind('mousemove');
            });
          });
          $node.on('mouseup', function () {
            var wasDragging = isDragging;
            isDragging = false;
            $(window).unbind('mousemove');
            if (!wasDragging) {
              $prevNode.toggleClass('hidden');
            }
          });
          $prevNode.on('mouseup', function () {
            var wasDragging = isDragging;
            isDragging = false;
            $(window).unbind('mousemove');
            if (!wasDragging) {
              $prevNode.addClass('hidden');
            }
          });
        }
        $node.after($prevNode);
      }
    })
  }

  function attributesToString(node) {
    return _.chain(node.attributes)
      .map(function (value) {
        if (value.name === 'id') {
          return '';
        } else {
          return value.name + '=' + value.value;
        }
      })
      .sortBy()
      .value()
      .join(';');
  }

  function isLink(node) {
    return node.tagName.toUpperCase() === 'A';
  }

  function isButton(node) {
    return node.tagName.toUpperCase() === 'BUTTON';
  }

  function isClonedNode(node1, node2) {
    return node1.tagName === node2.tagName &&
      attributesToString(node1) === attributesToString(node2);
  }

  function indexOfSameType(node) {
    var i = 0;
    var aNode = node.parentNode.firstChild;
    while (aNode !== node) {
      ++i;
      if (aNode.tagName !== node.tagName) {
        i = 0;
      }
      aNode = aNode.nextElementSibling;
    }
    return i;
  }

  function isTranslationResult(node, prevNode) {
    return indexOfSameType(node) % 2 === 1 && isClonedNode(node, prevNode);
  }

  addOriginalToggler();
})(angular.element);
