import React, { Component } from 'react'
import { config, initialState } from './data/config'
import {
  Container,
  Responsive,
  Segment,
  Visibility,
} from 'semantic-ui-react'

import './theme/semantic.less'

import Canvas from './components/canvas'
import Nav from './components/nav'
import KeyTypeMenu from './components/key-type-menu'
import Settings from './components/settings'
import './shake.scss'

export default class extends Component {

  constructor (props) {
    super(props)
    this.state = Object.assign({}, {
      fixed: false,
      dirty: false,
      layersVisible: false,
      buildInProgress: false,
      exportLink: '',
      exportFileName: ''
    }, initialState())

    // Bind event handlers
    this.updateZone = this._updateZone.bind(this)
    this.toggleLayers = this._toggleLayers.bind(this)
    this.setActiveKeyType = this._setActiveKeyType.bind(this)
    this.selectBoard = this._selectBoard.bind(this)
    this.selectLayer = this._selectLayer.bind(this)
    this.selectLayout = this._selectLayout.bind(this)
    this.setKey = this._setKey.bind(this)
    this.newLayout = this._newLayout.bind(this)
    this.newLayer = this._newLayer.bind(this)
    this.cloneLayout = this._cloneLayout.bind(this)
    this.cloneLayer = this._cloneLayer.bind(this)
    this.deleteLayer = this._deleteLayer.bind(this)
    this.deleteLayout = this._deleteLayout.bind(this)
  }

  render () {
    const {
      fixed,
      layersVisible,
      boards,
      activeBoard,
      activeLayout,
      activeLayer,
      activeKeyType,
      layouts,
      layers,
      zones,
      dirty
    } = this.state

    return (
      <div>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
         <Visibility
           once={false}
           onBottomPassed={this.showFixedMenu}
           onBottomPassedReverse={this.hideFixedMenu}
         >
           <Segment
             inverted
             textAlign='center'
             style={{
               padding: 0,
               margin: 0
             }}
             vertical
           >
             <Nav
              fixed={fixed}
              boards={boards}
              activeBoard={activeBoard}
              layouts={layouts}
              dirty={dirty}
              newLayout={this.newLayout}
              newLayer={this.newLayer}
              selectBoard={this.selectBoard}
            />
            <Canvas
              layers={layers}
              layouts={layouts}
              zones={zones}
              activeBoard={activeBoard}
              activeLayout={activeLayout}
              activeLayer={activeLayer}
              activeKeyType={activeKeyType}
              layersVisible={layersVisible}
              toggleLayers={this.toggleLayers}
              setKey={this.setKey}
              selectLayer={this.selectLayer}
              cloneLayer={this.cloneLayer}
              deleteLayer={this.deleteLayer}
            />
           </Segment>

           <Container>
            <KeyTypeMenu
              setActiveKeyType={this.setActiveKeyType}
              activeKeyType={activeKeyType}
            />
            <Settings
              activeKeyType={activeKeyType}
              zones={zones}
              updateZone={this.updateZone}/>
           </Container>
         </Visibility>
       </Responsive>
      </div>
    )
  }

  checkSaveState () {

  }

  _toggleLayers () {
    this.setState({ layersVisible: !this.state.layersVisible })
  }

  _selectBoard (e, data) {
    console.log(initialState(data.value))
    this.setState(initialState(data.value))
  }

  _setActiveKeyType (activeKeyType) {
    this.setState({ activeKeyType })
  }

  _selectLayer (activeLayer) {
    this.setState({ activeLayer })
  }

  _selectLayout (activeLayout) {
    this.setState({ activeLayout })
  }

  _setKey (key) {
    const {
      layers,
      activeLayer,
      lastSave
    } = this.state

    const clone = layers.slice(0)
    clone[activeLayer].keymap = layers[activeLayer].keymap.slice(0).map(row => {
      return row.map(k => {
        return k.id === key.id ? key : k
      })
    })

    this.setState({
      layers: clone,
      dirty: lastSave !== JSON.stringify(clone)
    })
  }

  _newLayout (name, layers) {
    const { activeBoard, zones, layouts } = this.state
    const layout = {
      id: this.state.layouts.length,
      name,
    }
    const layer = [{
      id: 0,
      layoutId: this.state.layouts.length,
      name: 'Default',
      keymap: config[activeBoard].keymap(
        config[activeBoard].keySections,
        zones[0].value,
        zones[1].value,
        zones[2].value
      )
    }]

    const clonedLayouts = layouts.slice(0).push(layout)

    this.setState({
      activeLayout: this.state.layouts.length,
      activeLayer: 0,
      layouts: clonedLayouts,
      layers: layer
    })
  }

  _updateZone (e, data) {
    const { zones, lastSave, activeBoard } = this.state
    let clone = zones.slice(0)
    clone = clone.map(z => {
      if (z.label === data.placeholder) {
        z.value = data.value
      }
      return z
    })

    this.setState({
      zones: clone,
      dirty: lastSave !== JSON.stringify(clone)
    })
  }

  _newLayer (layer) {}

  _cloneLayout (layout) {}

  _cloneLayer (layer) {}

  _deleteLayer (layer) {}

  _deleteLayout (layout) {}

  _save () {}

  _reset () {}

  _download () {}

}