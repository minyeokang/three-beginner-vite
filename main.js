import * as THREE from 'three';
import './style.css'
import gsap from "gsap"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();

//create sphere, high complexity to make it smooth 
const geometry = new THREE.SphereGeometry(3, 64, 64)
//add skin to a sphere which is just a clay
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83', 
  roughness: 0.5 //less value for more shine 
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//sizing 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//add light but it's like black shadow
const light = new THREE.PointLight(0xffffff,1,100)
light.position.set(0,10,10)
light.intensity = 1.25
scene.add(light)

const camera = new THREE.PerspectiveCamera(45, sizes.width  / sizes.height, 0.1, 100)//fov,ratio,near,far 
camera.position.z = 10
scene.add(camera)


//get canvas to draw
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2) //make the pixels smoother
renderer.render(scene, camera)

//control sphere with mouse movement 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true //think as adding transitions
controls.enablePan = false //make sure people can't control besize rolling the sphere
controls.enableZoom = false
controls.autoRotate = true //rotaiting in default
controls.autoRotateSpeed = 5

//re-sizing on event 
window.addEventListener('resize', () => {
  sizes.width =  window.innerWidth
  sizes.height = window.innerHeight

  //update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  //will add gsap later, not here because every pc speed is different, you need delta speed 
  controls.update() //even enableDamping = true is not enough smooth transition, call update on loop so when dragging is over it has little transition
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//basic enter motion
const tl = gsap.timeline({default: {duration: 1}})
tl.fromTo(mesh.scale, {z:0,x:0,y:0},{z:1,x:1,y:1})
tl.fromTo('nav', {y: '-100%'},{y: "0%"})
tl.fromTo('.title',{opacity:0},{opacity:1})

//mouse interaction
let mouseDown = false
let rgb = [12,23,55]
window.addEventListener('mousedown', ()=>{
  mouseDown = true
})
window.addEventListener('mouseup', ()=>{
  mouseDown = false
})
window.addEventListener('mousemove', (e)=>{
  //only change the color when mouse is DOWN 
  if(mouseDown){
    rgb = [ 
      Math.round((e.pageX / sizes.width) * 255), //255 as maxium value
      Math.round((e.pageY / sizes.height) * 255),
      150
  ]
  let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
  // new THREE.Color(`rgb(0,100,150)`)
  gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
  }
})

