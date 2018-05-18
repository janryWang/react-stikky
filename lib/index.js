"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _classnames = _interopRequireDefault(require("classnames"));

var _utils = require("./utils");

var _offset = _interopRequireDefault(require("./offset"));

var _windowScroll = _interopRequireDefault(require("window-scroll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype.__proto__ = superClass && superClass.prototype; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isValid(d) {
  return d !== undefined && d !== null;
}

function getNum(val) {
  return val !== undefined ? parseInt(val) : 0;
}

function getValidVal() {
  for (var i = 0; i < arguments.length; i++) {
    if (isValid(i < 0 || arguments.length <= i ? undefined : arguments[i])) {
      return i < 0 || arguments.length <= i ? undefined : arguments[i];
    }
  }
}

var Sticky =
/*#__PURE__*/
function (_Component) {
  function Sticky() {
    var _temp, _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_temp = _this = _Component.call.apply(_Component, [this].concat(args)) || this, _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      sticking: false
    }), _temp) || _assertThisInitialized(_this);
  }

  var _proto = Sticky.prototype;

  _proto.getContainerNode = function getContainerNode() {
    var stickyContainer = this.refs.stickyContainer;
    var findDOMNode = _reactDom.default.findDOMNode;
    this.container = stickyContainer;
    return findDOMNode(stickyContainer);
  };

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this.getContainerNode();
    this.initCloneContainerNode();
    this.registerEvents();
    setTimeout(function () {
      _this2.initSticky();
    });
  };

  _proto.initSticky = function initSticky() {
    var _this3 = this;

    this.ifSticky(function () {
      _this3.sticky();
    }, function () {
      _this3.sticky(false);
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    var _this4 = this;

    this.sticky(false);
    this.cancelEvents();
    setTimeout(function () {
      _this4.wrapperNode.remove();
    });
  };

  _proto.onScrollHandler = function onScrollHandler(context) {
    var handler = context.bindHandler || function () {
      requestAnimationFrame(function () {
        context.ifSticky(function () {
          context.sticky();
        }, function () {
          context.sticky(false);
        });
      });
    };

    context.bindHandler = handler;
    return handler;
  };

  _proto.setStyle = function setStyle(node, styles) {
    var style = node.style;
    Object.keys(styles).forEach(function (name) {
      style[name] = styles[name];
    });
  };

  _proto.sticky = function sticky(isSticky) {
    if (isSticky === void 0) {
      isSticky = true;
    }

    var positionNode = this.getPositionNode();
    var nodeData = this.getNodeData(positionNode);
    var self = this;

    if (this.props.edge == "top") {
      if (isSticky) {
        this.setStyle(this.container, _extends({
          position: "fixed",
          width: nodeData.width + "px",
          height: nodeData.height + "px",
          top: this.props.triggerDistance + "px",
          left: nodeData.offsetLeft + "px",
          zIndex: self.props.zIndex || "100000"
        }, this.props.stickiedStyle));
        if (this.sticking) return;
        this.sticking = true;
      } else {
        if (!this.sticking) return;
        self.setStyle(self.container, _extends({
          left: "",
          zIndex: "",
          width: "",
          height: "",
          position: "",
          top: ""
        }, self.props.unstickiedStyle));
        this.sticking = false;
      }
    } else {
      if (isSticky) {
        this.setStyle(this.container, _extends({
          position: "fixed",
          width: nodeData.width + "px",
          height: nodeData.height + "px",
          bottom: self.props.triggerDistance + "px",
          left: nodeData.offsetLeft + "px",
          zIndex: self.props.zIndex || "100000"
        }, this.props.stickiedStyle));
        if (this.sticking) return;
        this.sticking = true;
      } else {
        if (!this.sticking) return;
        this.setStyle(this.container, {
          bottom: self.props.triggerDistance + "px"
        });
        var containerNode = this.container;
        self.setStyle(self.container, _extends({
          left: "",
          zIndex: "",
          width: "",
          height: "",
          position: "",
          bottom: ""
        }, self.props.unstickiedStyle));
        this.sticking = false;
      }
    }
  };

  _proto.getPositionNode = function getPositionNode() {
    var node = null;
    if (this.sticking) node = this.wrapperNode;else node = this.container;
    return node;
  };

  _proto.ifSticky = function ifSticky(ok, faild) {
    var positionNode = this.getPositionNode();
    var nodeData = this.getNodeData(positionNode);
    var winData = this.getNodeData(window);
    var self = this;
    var edge = self.props.edge;
    var triggerDistance = self.props.triggerDistance;

    if (edge != "top") {
      if (winData.scrollTop + winData.height < nodeData.offsetTop + nodeData.height + triggerDistance) {
        return ok.call(self);
      }
    } else {
      if (winData.scrollTop > nodeData.offsetTop + triggerDistance) {
        return ok.call(self);
      }
    }

    faild.call(self);
  };

  _proto.getNodeData = function getNodeData(node) {
    var clientHeight = node.clientHeight,
        clientWidth = node.clientWidth,
        innerHeight = node.innerHeight,
        innerWidth = node.innerWidth;

    if (node !== window) {
      var offset = (0, _offset.default)(node);
      var offsetLeft = offset ? offset.left : 0;
      var offsetTop = offset ? offset.top : 0;
      var rect = node.getBoundingClientRect();
      var style = (0, _utils.getCompStyle)(node);
      return {
        offsetLeft: offsetLeft - getNum(style["margin-left"]),
        offsetTop: offsetTop - getNum(style["margin-top"]),
        width: rect.width,
        height: rect.height
      };
    } else {
      return {
        height: window.innerHeight,
        width: window.innerWidth,
        scrollTop: window.scrollY,
        scrollLeft: window.scrollX
      };
    }

    return this.nodeData;
  };

  _proto.initCloneContainerNode = function initCloneContainerNode() {
    if (this.wrapperNode) return this.wrapperNode;
    var oldNode = this.getContainerNode();
    var nodeData = this.getNodeData(oldNode);
    this.wrapperNode = document.createElement("div");
    this.wrapperNode.style.width = nodeData.width + "px";
    this.wrapperNode.style.height = nodeData.height + "px";
    this.wrapperNode.classList.add("sticky-wrapper");
    oldNode.parentNode.insertBefore(this.wrapperNode, oldNode);
    this.wrapperNode.appendChild(oldNode);
  };

  _proto.cancelEvents = function cancelEvents() {
    window.removeEventListener("scroll", this.onScrollHandler(this));
    window.removeEventListener("resize", this.onScrollHandler(this));
  };

  _proto.registerEvents = function registerEvents() {
    window.addEventListener("scroll", this.onScrollHandler(this));
    window.addEventListener("resize", this.onScrollHandler(this));
  };

  _proto.renderContainer = function renderContainer() {
    return _react.default.createElement("div", {
      ref: "stickyContainer",
      className: "sticky-container",
      style: this.props.style
    }, this.props.children);
  };

  _proto.render = function render() {
    return this.renderContainer();
  };

  _inheritsLoose(Sticky, _Component);

  return Sticky;
}(_react.Component);

_defineProperty(Sticky, "defaultProps", {
  edge: "bottom",
  triggerDistance: 0
});

var _default = Sticky;
exports.default = _default;