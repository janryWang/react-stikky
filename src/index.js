import React, { Component, cloneElement } from "react"
import ReactDOM from "react-dom"
import ClassNames from "classnames"
import { getCompStyle } from "./utils"
import docOffset from "./offset"
import scroll from "window-scroll"

function isValid(d) {
    return d !== undefined && d !== null
}

function getNum(val) {
    return val !== undefined ? parseInt(val) : 0
}

function getValidVal(...args) {
    for (let i = 0; i < args.length; i++) {
        if (isValid(args[i])) {
            return args[i]
        }
    }
}

class Sticky extends Component {
    static defaultProps = {
        edge: "bottom",
        triggerDistance: 0
    }

    state = {
        isSticky: false,
        window: {
            height: window.innerHeight,
            width: window.innerWidth
        }
    }

    getContainerNode() {
        let stickyContainer = this.stickyContainer
        let { findDOMNode } = ReactDOM
        this.container = stickyContainer
        return findDOMNode(stickyContainer)
    }

    componentDidMount() {
        this.getContainerNode()
        this.initCloneContainerNode()
        this.registerEvents()
        setTimeout(() => {
            this.initSticky()
        })
    }

    initSticky() {
        this.ifSticky(
            () => {
                this.sticky()
            },
            () => {
                this.sticky(false)
            }
        )
    }

    componentWillUnmount() {
        this.sticky(false)
        this.cancelEvents()
        setTimeout(() => {
            this.wrapperNode.remove()
        })
    }

    onScrollHandler(context) {
        let { createState } = context.props
        let handler =
            context.bindHandler ||
            function() {
                requestAnimationFrame(() => {
                    if (createState) {
                        const state = createState()
                        if (state) {
                            context.setState(state)
                        }
                    }
                    context.ifSticky(
                        () => {
                            context.setState({
                                isSticky: true,
                                window: {
                                    height: window.innerHeight,
                                    width: window.innerWidth
                                }
                            })
                            context.sticky()
                        },
                        () => {
                            context.setState({
                                isSticky: false,
                                window: {
                                    height: window.innerHeight,
                                    width: window.innerWidth
                                }
                            })
                            context.sticky(false)
                        }
                    )
                })
            }
        context.bindHandler = handler
        return handler
    }

    setStyle(node, styles) {
        let { style } = node
        Object.keys(styles).forEach(name => {
            style[name] = styles[name]
        })
    }

    sticky(isSticky = true) {
        let positionNode = this.getPositionNode()
        let nodeData = this.getNodeData(positionNode)
        let self = this
        if (this.props.edge == "top") {
            if (isSticky) {
                this.setStyle(this.container, {
                    position: "fixed",
                    width: nodeData.width + "px",
                    height: nodeData.height + "px",
                    top: this.props.triggerDistance + "px",
                    left: nodeData.offsetLeft + "px",
                    zIndex: self.props.zIndex || "100000",
                    ...this.props.stickiedStyle
                })
                if (this.sticking) return
                this.sticking = true
            } else {
                if (!this.sticking) return
                self.setStyle(self.container, {
                    left: "",
                    zIndex: "",
                    width: "",
                    height: "",
                    position: "",
                    top: "",
                    ...self.props.unstickiedStyle
                })

                this.sticking = false
            }
        } else {
            if (isSticky) {
                this.setStyle(this.container, {
                    position: "fixed",
                    width: nodeData.width + "px",
                    height: nodeData.height + "px",
                    bottom: self.props.triggerDistance + "px",
                    left: nodeData.offsetLeft + "px",
                    zIndex: self.props.zIndex || "100000",
                    ...this.props.stickiedStyle
                })
                if (this.sticking) return
                this.sticking = true
            } else {
                if (!this.sticking) return
                this.setStyle(this.container, {
                    bottom: self.props.triggerDistance + "px"
                })
                let containerNode = this.container
                self.setStyle(self.container, {
                    left: "",
                    zIndex: "",
                    width: "",
                    height: "",
                    position: "",
                    bottom: "",
                    ...self.props.unstickiedStyle
                })
                this.sticking = false
            }
        }
    }

    getPositionNode() {
        let node = null
        if (this.sticking) node = this.wrapperNode
        else node = this.container
        return node
    }

    ifSticky(ok, faild) {
        let positionNode = this.getPositionNode()
        let nodeData = this.getNodeData(positionNode)
        let winData = this.getNodeData(window)
        let self = this
        let edge = self.props.edge
        let triggerDistance = self.props.triggerDistance
        let isNotSticky = this.state.notSticky
        if (isNotSticky) {
            return faild.call(self)
        }
        if (edge != "top") {
            if (
                winData.scrollTop + winData.height <
                    nodeData.offsetTop + nodeData.height + triggerDistance &&
                stateSticky
            ) {
                return ok.call(self)
            }
        } else {
            if (
                winData.scrollTop > nodeData.offsetTop - triggerDistance &&
                stateSticky
            ) {
                return ok.call(self)
            }
        }
        faild.call(self)
    }

    getNodeData(node) {
        let { clientHeight, clientWidth, innerHeight, innerWidth } = node
        if (node !== window) {
            let offset = docOffset(node)
            let offsetLeft = offset ? offset.left : 0
            let offsetTop = offset ? offset.top : 0
            const rect = node.getBoundingClientRect()
            const style = getCompStyle(node)
            return {
                offsetLeft: offsetLeft - getNum(style["margin-left"]),
                offsetTop: offsetTop - getNum(style["margin-top"]),
                width: rect.width,
                height: rect.height
            }
        } else {
            return {
                height: window.innerHeight,
                width: window.innerWidth,
                scrollTop: window.pageYOffset,
                scrollLeft: window.pageXOffset
            }
        }
        return this.nodeData
    }

    initCloneContainerNode() {
        if (this.wrapperNode) return this.wrapperNode
        let oldNode = this.getContainerNode()
        let nodeData = this.getNodeData(oldNode)
        this.wrapperNode = document.createElement("div")
        this.wrapperNode.style.height = nodeData.height + "px"
        this.wrapperNode.classList.add("sticky-wrapper")
        oldNode.parentNode.insertBefore(this.wrapperNode, oldNode)
        this.wrapperNode.appendChild(oldNode)
    }

    cancelEvents() {
        window.removeEventListener("scroll", this.onScrollHandler(this))
        window.removeEventListener("resize", this.onScrollHandler(this))
    }

    registerEvents() {
        window.addEventListener("scroll", this.onScrollHandler(this))
        window.addEventListener("resize", this.onScrollHandler(this))
    }

    renderContainer() {
        const { children } = this.props
        return (
            <div
                ref={inst => {
                    if (inst) this.stickyContainer = inst
                }}
                className="sticky-container"
                style={this.props.style}
            >
                {typeof children === "function"
                    ? children(this.state)
                    : children}
            </div>
        )
    }

    render() {
        return this.renderContainer()
    }
}

export default Sticky
