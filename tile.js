const Jimp = require('jimp');
const inquirer = require('inquirer');
const imagemin = require('imagemin');
const imageminPngcrush = require('imagemin-pngcrush');

var questions = [{
  type: 'input',
  name: 'tileSize',
  message: "Tile dimension? (default: 16)",
}];

function makeNewName(path, ext) {
  var newName = path.split('/');
  var index = newName.length - 1;
  newName = newName[index];
  newName = newName.split('.');
  newName = newName[0];
  newName += '-tile.' + ext;
  return newName;
};

inquirer.prompt(questions).then(answers => {

  var imagePath,
      tileSize,
      iHeight,
      iWidth,
      tilesH,
      tilesW,
      numTiles,
      newName,
      extension;

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

  //console.log(`Working with image: ${imagePath} and a ${tileSize}x${tileSize} grid.`);

  Jimp.read(imagePath, (err, image) => {
    if (err) throw err;
    extension = image.getExtension();
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

      //var pct = Math.floor((numTiles * 100)/tilesArray.length);
      var reduc = numTiles - tilesArray.length;
      console.log('New image has ' + tilesArray.length + ' tiles. Thats a ' + reduc + ' tiles reduction.');

      var squareSize = Math.ceil(Math.sqrt(tilesArray.length));
      //console.log('Building a ' + squareSize + 'x' + squareSize + ' grid.');

      var imgW = squareSize * tileSize;
      var row = 0;
      var col = 0;
      var maxY = 0;

      let newImg = new Jimp(imgW, imgW, function (err, newImg) {
        if (err) throw err;
        for (var i = 0; i<tilesArray.length; i++) {
          var xS = col * tileSize;
          var yS = row * tileSize;
          maxY = yS + tileSize;
          for (var j=0; j<tileSize; j++) {
            for (var k=0; k<tileSize; k++) {
              var currColor = tilesArray[i][j][k];
              var x = k + xS;
              var y = j + yS;
              newImg.setPixelColor(currColor, x, y);
            }
          }
          if(col >= squareSize - 1) {
            col = 0;
            row += 1;
          } else {
            col += 1;
          }
        }
        // console.log('lowest point:' + maxY);
        newName = makeNewName(imagePath, extension);
        newImg.crop(0, 0, imgW, maxY);
        newImg.write('sprites/' + newName, (err) => {
          if (err) throw err;
          imagemin(['sprites/*.png'], 'sprites/optimized', {
          	plugins: [
          		imageminPngcrush()
          	]
          }).then(() => {
          	console.log('Images optimized.');
          });
        });
      });

      /*
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
        newName = makeNewName(imagePath, extension);
        newImg.write('sprites/' + newName, (err) => {
          if (err) throw err;
        });
      });
      */

    }
  });
})
