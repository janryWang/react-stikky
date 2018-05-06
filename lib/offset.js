"use strict";

// defined by w3c
var DOCUMENT_NODE = 9;
/**
 * Returns `true` if `w` is a Document object, or `false` otherwise.
 *
 * @param {?} d - Document object, maybe
 * @return {Boolean}
 * @private
 */

function isDocument(d) {
  return d && d.nodeType === DOCUMENT_NODE;
}
/**
 * Returns the `document` object associated with the given `node`, which may be
 * a DOM element, the Window object, a Selection, a Range. Basically any DOM
 * object that references the Document in some way, this function will find it.
 *
 * @param {Mixed} node - DOM node, selection, or range in which to find the `document` object
 * @return {Document} the `document` object associated with `node`
 * @public
 */


function getDocument(node) {
  if (isDocument(node)) {
    return node;
  } else if (isDocument(node.ownerDocument)) {
    return node.ownerDocument;
  } else if (isDocument(node.document)) {
    return node.document;
  } else if (node.parentNode) {
    return getDocument(node.parentNode); // Range support
  } else if (node.commonAncestorContainer) {
    return getDocument(node.commonAncestorContainer);
  } else if (node.startContainer) {
    return getDocument(node.startContainer); // Selection support
  } else if (node.anchorNode) {
    return getDocument(node.anchorNode);
  }
}

function withinElement(child, parent) {
  // don't throw if `child` is null
  if (!child) return false; // Range support

  if (child.commonAncestorContainer) child = child.commonAncestorContainer;else if (child.endContainer) child = child.endContainer; // ask the browser if parent contains child

  if (child === window) return true;
  return parent.contains(child);
}

module.exports = function offset(el) {
  var doc = getDocument(el);
  if (!doc) return; // Make sure it's not a disconnected DOM node

  if (!withinElement(el, doc)) return;
  var body = doc.body;

  if (body === el) {
    return bodyOffset(el);
  }

  var box = {
    top: 0,
    left: 0
  };

  if (typeof el.getBoundingClientRect !== "undefined") {
    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    box = el.getBoundingClientRect();

    if (el.collapsed && box.left === 0 && box.top === 0) {
      // collapsed Range instances sometimes report 0, 0
      // see: http://stackoverflow.com/a/6847328/376773
      var span = doc.createElement("span"); // Ensure span has dimensions and position by
      // adding a zero-width space character

      span.appendChild(doc.createTextNode("\u200B"));
      el.insertNode(span);
      box = span.getBoundingClientRect(); // Remove temp SPAN and glue any broken text nodes back together

      var spanParent = span.parentNode;
      spanParent.removeChild(span);
      spanParent.normalize();
    }
  }

  var docEl = doc.documentElement;
  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;
  var scrollTop = window.pageYOffset || docEl.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft;
  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
};

function bodyOffset(body) {
  var top = body.offsetTop;
  var left = body.offsetLeft;
  top += parseFloat(body.style.marginTop || 0);
  left += parseFloat(body.style.marginLeft || 0);
  return {
    top: top,
    left: left
  };
}