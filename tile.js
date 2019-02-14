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
      numTiles;

  var tileNum = 0;

  var tilesArray = [],
      newArray = [];

  var isSame = true;

  var imagePath = process.argv[2];
  if (answers['tileSize'] == '') {
    tileSize = 16;
  } else {
    tileSize = parseInt(answers['tileSize']);
  }

  console.log(`Working with image: ${imagePath} and a ${tileSize}x${tileSize} grid.`);

  Jimp.read(imagePath, (err, image) => {
    if (err) throw err;
    iHeight = image.bitmap.height;
    iWidth = image.bitmap.width;
    tilesH = iHeight / tileSize;
    tilesW = iWidth / tileSize;
    numTiles = tilesH * tilesW;
    console.log('\x1b[42m%s\x1b[0m',`Current image is a ${tilesW}x${tilesH} tiles grid (${numTiles} tiles).`);
    // looping all tiles
    for (var i=0; i<tilesW; i++) {  // for (var i=0; i<tilesW; i++) {
      for (var j=0; j<tilesH; j++) {  // for (var j=0; j<tilesH; j++) {
        //console.log('Tile [' + j + ', ' + i + ']');
        var tilePixels = new Array(tileSize).fill(0).map(() => new Array(tileSize).fill(0));
        for (var k=0; k<tileSize; k++) {
          for (var l=0; l<tileSize; l++) {
            var currY = k + (tileSize * j);
            var currX = l + (tileSize * i);
            //console.log('Pixel [' + currY + ', ' + currX + ']');
            var color = image.getPixelColor(currX, currY);
            //var hex = Jimp.intToRGBA(color);
            tilePixels[k][l] = color;
          }
        }
        //console.log('Tile [' + j + ', ' + i + ']');
        //console.log(tilePixels);

        // if tilesArray is empty, add the first tile in it.
        if (tilesArray.length == 0){
          //console.log('Adding the first tile in the array.');
          //console.log('-------');
          tilesArray.push(tilePixels);
        } else {
          // Not empty, we need to compare all entries in the tilesArray Array
          // with the current tilePixels array.
          tileNum += 1;

          //console.log('Currently ' + tilesArray.length + ' tiles in array.');
          for (var m=0; m<tilesArray.length; m++) {
            //console.log('Comparing tile #' + tileNum + ' with tile #' + m + '...');
            isSame = true;
            for (var n=0; n<tileSize; n++) {
              for (var o=0; o<tileSize; o++) {
                if (tilesArray[m][n][o] !=  tilePixels[n][o]) {
                  isSame = false;
                }
              }
            }
          }
          if (!isSame) {
            //console.log('\x1b[42m%s\x1b[0m','Add curent tile to tilesArray.');
            tilesArray.push(tilePixels);
          }
          //console.log('-------');
          //console.log(isSame);
        }

      }
    }

    console.log('New image has ' + tilesArray.length + ' tiles.');
    //console.log(tilesArray[0]);

    var imgW = tilesArray.length * 16;
    let newImg = new Jimp(imgW, 16, function (err, newImg) {
      if (err) throw err;

      //console.log(tilesArray[0][0][0]);

      for (var i = 0; i<tilesArray.length; i++) {

        for (var j=0; j<tileSize; j++) {
          for (var k=0; k<tileSize; k++) {
            //console.log(tilesArray[i][j][k]);
            var currColor = tilesArray[i][j][k];
            var x = k + (tileSize * i);
            var y = j;
            newImg.setPixelColor(currColor, x, y);
          }
        }
      }

      newImg.write('test.png', (err) => {
        if (err) throw err;
      });

      /*

      imageData.forEach((row, y) => {
        row.forEach((color, x) => {
          image.setPixelColor(color, x, y);
        });
      });

      image.write('test.png', (err) => {
        if (err) throw err;
      });

      */
    });

  });
})
