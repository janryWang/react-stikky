import test from "ava"
import React from "react"
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import Propers from "../src/index"
Enzyme.configure({ adapter: new Adapter() })
