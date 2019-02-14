const Jimp = require('jimp');
const inquirer = require('inquirer');

var questions = [{
  type: 'input',
  name: 'tileSize',
  message: "Tile dimension? (default: 16)",
}]

inquirer.prompt(questions).then(answers => {

  var imagePath,
      tileSize;

  var tilesArray = [],
      newArray = [];

  var imagePath = process.argv[2];
  if (answers['tileSize'] == '') {
    tileSize = 16;
  } else {
    tileSize = parseInt(answers['tileSize']);
  }

  console.log(`Working with image: ${imagePath} and a ${tileSize}x${tileSize} grid.`);

  Jimp.read(imagePath, (err, image) => {
    if (err) throw err;
    var iHeight = image.bitmap.height;
    var iWidth = image.bitmap.width;
    var tilesH = iHeight / tileSize;
    var tilesW = iWidth / tileSize;
    console.log(`Current image is a ${tilesW}x${tilesH} tiles grid.`);
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
            var hex = Jimp.intToRGBA(color);
            tilePixels[k][l] = hex;
          }
        }
        console.log('Tile [' + j + ', ' + i + ']');
        console.log(tilePixels);
        // if tilesArray is empty, add the first tile in it.
        /*
        if (tilesArray.length == 0){
          tilesArray.push(tilePixels);
        } else {
          // Not empty, we need to compare all entries in the tilesArray Array
          // with the current tilePixels array.
          var isSame = true;
          var currLength = tilesArray.length;
          for (var i=0; i<currLength; i++) {
            for (var k=0; k<tileSize; k++) {
              for (var l=0; l<tileSize; l++) {
                if(tilesArray[i][k][l] != tilePixels[k][l]) {
                  isSame = false;
                }
              }
            }
          }
          console.log(isSame);
          if (isSame == false) {
            tilesArray.push(tilePixels);
          }
        }
        */
      }
    }
    //var col = image.getPixelColor(10, 25); // returns the colour of that pixel e.g. 0xFFFFFFFF
    //var hex = Jimp.intToRGBA(col);
    //console.log(hex);
    console.log('New image has ' + tilesArray.length + ' tiles.');
  });
})
