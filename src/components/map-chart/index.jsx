import React from 'react'
import * as THREE from 'three'

class MapChart extends React.Component {
  // constructor(props) {
  //   super()
  //   this.state = {
  //     width: props.size.width,
  //     height: props.size.height,
  //   }
  // }

  render() {
    return (
      <div
        id={this.props.id}
        style={this.state.width ? this.props.size : { width: 500, height: 500 }}
      />
    )
  }
}

export default MapChart
