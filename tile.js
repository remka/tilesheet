const Jimp = require('jimp');
const inquirer = require('inquirer');

var questions = [{
  type: 'input',
  name: 'tileSize',
  message: "Tile dimension? (default: 16)",
}]

inquirer.prompt(questions).then(answers => {

  var imagePath,
      tileSize,
      iHeight,
      iWidth,
      tilesH,
      tilesW,
      numTiles,
      newName;

  var tileNum = 0;
  var tilesArray = [];
  var isSame = true;

  var imagePath = process.argv[2];

  // getting tile size
  if (answers['tileSize'] == '') {
    tileSize = 16;
  } else {
    tileSize = parseInt(answers['tileSize']);
  }

  // name of new file
  newName = new Date();
  newName += '-tile.png';

  //console.log(`Working with image: ${imagePath} and a ${tileSize}x${tileSize} grid.`);

  Jimp.read(imagePath, (err, image) => {
    if (err) throw err;
    iHeight = image.bitmap.height;
    iWidth = image.bitmap.width;
    tilesH = iHeight / tileSize;
    tilesW = iWidth / tileSize;
    numTiles = tilesH * tilesW;
    if(iHeight % tileSize !== 0 || iWidth % tileSize !== 0) {
      console.log(`Image dimensions (${iWidth}x${iHeight}px) are not divisible by tile size (${tileSize}px).`);
    } else {
      console.log(`Current image is a ${tilesW}x${tilesH} tiles grid (${numTiles} tiles).`);
      // looping all tiles
      for (var i=0; i<tilesW; i++) {
        for (var j=0; j<tilesH; j++) {
          var tilePixels = new Array(tileSize).fill('').map(() => new Array(tileSize).fill(''));
          for (var k=0; k<tileSize; k++) {
            for (var l=0; l<tileSize; l++) {
              var currY = k + (tileSize * j);
              var currX = l + (tileSize * i);
              var color = image.getPixelColor(currX, currY);
              //var hex = Jimp.intToRGBA(color);
              tilePixels[k][l] = color;
            }
          }

          // if tilesArray is empty, add the first tile in it.
          if (tilesArray.length == 0){
            tilesArray.push(tilePixels);
          } else {
            // Not empty, we need to compare all entries in the tilesArray Array
            // with the current tilePixels array.
            tileNum += 1;
            for (var m=0; m<tilesArray.length; m++) {
              isSame = true;
              for (var n=0; n<tileSize; n++) {
                for (var o=0; o<tileSize; o++) {
                  if (tilesArray[m][n][o] !=  tilePixels[n][o]) {
                    isSame = false;
                  }
                }
              }
              if (isSame) break;
            }
            if (!isSame) {
              tilesArray.push(tilePixels);
            }
          }

        }
      }

      var pct = Math.floor((numTiles * 100)/tilesArray.length);
      console.log('New image has ' + tilesArray.length + ' tiles.' + pct);

      var imgW = tilesArray.length * tileSize;
      let newImg = new Jimp(imgW, tileSize, function (err, newImg) {
        if (err) throw err;
        for (var i = 0; i<tilesArray.length; i++) {
          for (var j=0; j<tileSize; j++) {
            for (var k=0; k<tileSize; k++) {
              var currColor = tilesArray[i][j][k];
              var x = k + (tileSize * i);
              var y = j;
              newImg.setPixelColor(currColor, x, y);
            }
          }
        }
        var newName = imagePath.split('.');
        newName = newName[0] + '-tile.png';
        newImg.write(newName, (err) => {
          if (err) throw err;
        });
      });
    }
  });
})
