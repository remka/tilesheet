# Tilesheet utility

A simple script that takes a grid-based image as a parameter and creates a tile sheet, getting rid of all duplicated tiles.  

![Image of tilesheet](https://i.imgur.com/lfqLQy8.png)

## How to use    

If you don't have it already, install [Node.js](https://nodejs.org/en/).  

Clone or download the repository.  

Open the Terminal, and `cd` to the repo folder, then install dependencies with `npm install`.  

Call it with `node tile <path-to-image>`.  
You can test the script with `node tile image.png` and `node tile level.png`.  

A prompt will ask you the size of your tiles. Type the size in px (just the number), or leave it blank to use the default value (16px). The script won't run if the dimensions of the image you provide is not divisible by the tile size.  

The script will create a `<filename>-tile.png` in the `sprites` folder, *hopefully* removing all duplicated tiles from the original image.

## Limitations / TODO

- [x] Export tile sheet as a square-ish shape  
- [ ] Allow user to chose between square-ish export and strip export  
- [ ] Support non-square tiles    

## Credits / Thanks  

* Thanks to [@blld](https://github.com/blldand-tiles) who helped me solve my *ghost tiles* issue. You rock bro!    
* The `level.png` image was created by [Clint Bellanger](https://opengameart.org/forumtopic/feedback-on-16px-robots-and-tiles) and used only for illustration purpose.    
