const fs = require('fs')
const path = require('path')

const create = () => {
  const data = fs.readFileSync(path.join(__dirname, './static/index.html'), 'utf8').split('\n')
  const jsonData = fs.readFileSync(path.join(__dirname, './tmp/data.json'), 'utf8')
  data.splice(10, 1, `width:${document.getElementById('form').width.value}px;`)
  data.splice(11, 1, `height:${document.getElementById('form').height.value}px;`)
  data.splice(26, 1, `var animationData = ${jsonData};`)
  fs.writeFileSync(path.join(__dirname, './tmp/index.html'), data.join('\n'), 'utf8')
}

const getDomePath = () => {
  const inputPath = `${document.getElementById('form').demo.value}`
  const path = inputPath.replace(/\\/g, '\/')
  return path
}

const setDataJson = (img) => {
  let data = fs.readFileSync(`${getDomePath()}/data.json`, 'utf8')
  if (img) {
    data = JSON.parse(data)
    data.assets.forEach((item) => {
      if (!item.p) return
      img.forEach((i) => {
        if (path.parse(item.p).name === path.parse(i.name).name) {
          item.u = ''
          item.p = i.url
        }
      })
    })
  }
  fs.writeFileSync(path.join(__dirname, './tmp/data.json'), img ? JSON.stringify(data) : data, 'utf8')
}

const output = () => {
  const data = fs.readFileSync(path.join(__dirname, './tmp/index.html'), 'utf8')
  fs.writeFileSync(`${getDomePath()}/index.html`, data, 'utf8')
}

const getBase64 = (filePath) => {
  let data = fs.readFileSync(filePath)
  const imgtype = path.extname(filePath).replace(/./, '')
  data = Buffer.from(data, 'ascii').toString('base64')
  return `data:image/${imgtype};base64,${data}`
}

const getImages = () => {
  const images = fs.readdirSync(`${getDomePath()}/images`)
  let imagesBaseed = images.map((img) => {
    return {name: img, url: getBase64(`${getDomePath()}/images/${img}`)}
  })
  return imagesBaseed
}

const setImages = () => {
  let img
  if (fsExistsSync(`${getDomePath()}/images`)) {
    img = getImages()
  }
  setDataJson(img)
}

const fsExistsSync = (path) => {
  try {
    fs.accessSync(path,fs.F_OK);
  } catch(e){
    return false
  }
  return true
}

document.getElementById('create').addEventListener('click', async() => {
  setImages()
  create()
  output()
})
