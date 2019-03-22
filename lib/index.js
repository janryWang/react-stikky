"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _utils = require("./utils");

var _offset = _interopRequireDefault(require("./offset"));

var _windowScroll = _interopRequireDefault(require("window-scroll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

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

function isFn(val) {
  return typeof val === 'function';
}

var Sticky =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Sticky, _Component);

  function Sticky() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      isSticky: false,
      window: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "StickyRef", _react.default.createRef());

    return _this;
  }

  var _proto = Sticky.prototype;

  _proto.getContainerNode = function getContainerNode() {
    var stickyContainer = this.StickyRef;
    this.container = stickyContainer && stickyContainer.current;
    return this.container;
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
    var createState = context.props.createState;

    var handler = context.bindHandler || function (e) {
      requestAnimationFrame(function () {
        if (createState) {
          var state = createState();

          if (state) {
            context.setState(state);
          }
        }

        context.ifSticky(function () {
          context.setState({
            isSticky: true,
            window: {
              height: window.innerHeight,
              width: window.innerWidth
            }
          });
          context.sticky(true, e.type);
        }, function () {
          context.setState({
            isSticky: false,
            window: {
              height: window.innerHeight,
              width: window.innerWidth
            }
          });
          context.sticky(false, e.type);
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

  _proto.sticky = function sticky(isSticky, type) {
    if (isSticky === void 0) {
      isSticky = true;
    }

    var positionNode = this.getPositionNode();
    var nodeData = this.getNodeData(positionNode);
    var self = this;

    if (this.props.edge == 'top') {
      if (isSticky) {
        this.updateContainerSize();
        this.setStyle(this.container, _extends({
          position: 'fixed',
          width: nodeData.width + 'px',
          height: nodeData.height + 'px',
          top: this.props.triggerDistance + 'px',
          left: nodeData.offsetLeft + 'px',
          zIndex: self.props.zIndex || '10'
        }, this.props.stickiedStyle));
        this.sticking = true;
      } else {
        if (type === 'resize') this.wrapperNode.style.minHeight = 'auto';
        self.setStyle(self.container, _extends({
          left: '',
          zIndex: '',
          width: '',
          height: '',
          position: '',
          top: ''
        }, self.props.unstickiedStyle));
        this.sticking = false;
      }
    } else {
      if (isSticky) {
        this.updateContainerSize();
        this.setStyle(this.container, _extends({
          position: 'fixed',
          width: nodeData.width + 'px',
          height: nodeData.height + 'px',
          bottom: self.props.triggerDistance + 'px',
          left: nodeData.offsetLeft + 'px',
          zIndex: self.props.zIndex || '10'
        }, this.props.stickiedStyle));
        this.sticking = true;
      } else {
        if (type === 'resize') this.wrapperNode.style.minHeight = 'auto';
        this.setStyle(this.container, {
          bottom: self.props.triggerDistance + 'px'
        });
        var containerNode = this.container;
        self.setStyle(self.container, _extends({
          left: '',
          zIndex: '',
          width: '',
          height: '',
          position: '',
          bottom: ''
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
    var getStickyBoundary = self.props.getStickyBoundary;
    var triggerDistance = self.props.triggerDistance;
    var isNotSticky = this.state.notSticky;

    if (isFn(getStickyBoundary)) {
      if (!getStickyBoundary()) return faild.call(self);
    }

    if (isNotSticky) {
      return faild.call(self);
    }

    if (edge != 'top') {
      if (winData.scrollTop + winData.height < nodeData.offsetTop + nodeData.height + triggerDistance) {
        return ok.call(self);
      }
    } else {
      if (winData.scrollTop > nodeData.offsetTop - triggerDistance && nodeData.offsetTop > 0) {
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
        offsetLeft: offsetLeft - getNum(style['margin-left']),
        offsetTop: offsetTop - getNum(style['margin-top']),
        width: rect.width,
        height: rect.height
      };
    } else {
      return {
        height: window.innerHeight,
        width: window.innerWidth,
        scrollTop: window.pageYOffset,
        scrollLeft: window.pageXOffset
      };
    }

    return this.nodeData;
  };

  _proto.getOldNodeHeight = function getOldNodeHeight() {
    var nodeData = this.getNodeData(this.oldNode);
    return nodeData.height;
  };

  _proto.initCloneContainerNode = function initCloneContainerNode() {
    var className = this.props.className;
    if (this.wrapperNode) return this.wrapperNode;
    this.oldNode = this.getContainerNode();
    this.oldNodeHeight = this.getOldNodeHeight();
    this.wrapperNode = document.createElement('div');
    this.wrapperNode.style.minHeight = this.oldNodeHeight + 'px';
    this.wrapperNode.classList.add('sticky-wrapper');
    if (className) this.wrapperNode.classList.add(className);
    this.oldNode.parentNode.insertBefore(this.wrapperNode, this.oldNode);
    this.wrapperNode.appendChild(this.oldNode);
  };

  _proto.updateContainerSize = function updateContainerSize() {
    if (this.wrapperNode) {
      var newHeight = this.getOldNodeHeight();

      if (this.oldNodeHeight !== newHeight) {
        this.wrapperNode.style.minHeight = newHeight + 'px';
        this.oldNodeHeight = newHeight;
      }
    }
  };

  _proto.cancelEvents = function cancelEvents() {
    window.removeEventListener('scroll', this.onScrollHandler(this));
    window.removeEventListener('resize', this.onScrollHandler(this));
  };

  _proto.registerEvents = function registerEvents() {
    window.addEventListener('scroll', this.onScrollHandler(this));
    window.addEventListener('resize', this.onScrollHandler(this));
  };

  _proto.renderContainer = function renderContainer() {
    var _this$props = this.props,
        children = _this$props.children,
        className = _this$props.className;
    return _react.default.createElement("div", {
      ref: this.StickyRef,
      className: "sticky-container",
      style: this.props.style
    }, typeof children === 'function' ? children(this.state) : children);
  };

  _proto.render = function render() {
    return this.renderContainer();
  };

  return Sticky;
}(_react.Component);

_defineProperty(Sticky, "defaultProps", {
  edge: 'bottom',
  triggerDistance: 0
});

var _default = Sticky;
exports.default = _default;