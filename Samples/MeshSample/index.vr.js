/**
 * The examples provided by Oculus are for non-commercial testing and
 * evaluation purposes only.
 *
 * Oculus reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * OCULUS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

/**
 * MeshSample loads and displays a spinning model in React VR.
 *
 * To do this, object model is loaded and placed in the scene with the <Mesh> tag; it
 * is also illuminated with a <PointLight>. Rotation is achieved based on a React state
 * variable that is applied as a rotation transform.
 */

import React from 'react';
import {
  AppRegistry,
  asset,
  Mesh,
  Pano,
  PointLight,
  Text,
  View,
  VrButton,
} from 'react-vr';

class MeshSample extends React.Component {
  constructor() {
    super();

    const frames = new Array(7)
      .fill(null)
      .map((v, i) => ({
              mesh: asset(`Lombana0${ i + 1 }.obj`),
              mtl: asset('Lombana.mtl'),
              lit: true,
          }));

    this.state = {
      rotation: 0,
      currFrame: 0,
      isRotating: false,
    };


    this.lastUpdate = Date.now();
    this.elapsedT = 0;
    this.meshFrames = frames;
    this.updateFrame = this.updateFrame.bind(this);
  }

  /**
   * After kickoff in componentDidMount(), updateFrame is called every frame through
   * requestAnimationFrame. It updates the state.rotation variable used to rotate
   * the model based on on time measurement; this is important to account for
   * different VR headset framerates.
   */
  updateFrame() {
    const now       = Date.now();
    const delta     = now - this.lastUpdate;
    this.lastUpdate = now;
    this.elapsedT += delta;
    let frmIdx = this.state.currFrame;
    if (this.elapsedT > 1000) {
      this.elapsedT = 0;
      frmIdx++;
      if (frmIdx > 6) {
        frmIdx = 0;
      }
    }

    let rotation = this.state.isRotating ? this.state.rotation + delta / 20 : 0;
    this.setState({
      rotation,
      currFrame: frmIdx,
    });
    this.frameHandle = requestAnimationFrame(this.updateFrame);
  }

  componentDidMount() {
    this.updateFrame();
  }

  componentWillUnmount() {
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  render() {
    const frame = this.meshFrames[this.state.currFrame];
    const explodedAnim = this.meshFrames
      .map((src, i) => (<Mesh key={i}
        style={{
          transform: [
            {translate: [-50 + i * 15, -15, -70]},
            {scale : 0.1 },
          ],
        }}
        source={this.meshFrames[i]}
      />));
    return (
      <View>
        <Pano source={asset('chess-world.jpg')}/>
        {this.state.explodeMesh ?
          <Mesh
            style={{
              transform: [
                {translate: [0, -15, -70]},
                {scale : 0.1 },
              ],
            }}
            source={frame}
          />
          : explodedAnim
        }
        <PointLight style={{color:'white', transform:[{translate : [0, 400, 700]}]}} />

        <VrButton
          style={{
            backgroundColor: 'blue',
            borderRadius: 0.05,
            margin: 0.05,
          }}
          onClick={() => {
            this.setState({
              explodeMesh: !this.state.explodeMesh
            });
          }}
        >
          <Text style={{
            backgroundColor:'grey',
            padding: 0.1,
            textAlign:'center',
            textAlignVertical:'center',
            fontSize: 0.4,
            position: 'absolute',
            transform: [{translate: [0, -2.5, -7]}],
            layoutOrigin: [0.5, 0.5]}}>
            Baila</Text>
        </VrButton>
      </View>
    );
  }
};

AppRegistry.registerComponent('MeshSample', () => MeshSample);
