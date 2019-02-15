# Tilesheet Maker  

A simple script that takes a grid-based image as a parameter and creates a tile sheet, getting rid of all duplicated tiles.  

![Image of tilesheet](https://i.imgur.com/lfqLQy8.png)

## Why I made this?

When creating tile-based games, many people work directly with tiles editors, like [Tiled](https://www.mapeditor.org/). I tend to work directly in Photoshop, copying and pasting tiles when they already exist, and creating new ones on the fly when needed.  
I usually end up with a giant image file, with a lot of duplicate tiles. What I used to do was to painstakingly pick tiles one by one, and then add manually them to a sprite sheet.

This was a fairly time-consuming process, and I wondered if I could automate it. There are a couple of very good options out there, like [TexturePacker](https://www.codeandweb.com/texturepacker), but this seemed overkill since what I needed was fairly simple.  

I ended up coding it myself :) . This is certainly not the cleanest code, and it could definitely be optimized, but it does just what I need. Of course, you are welcome to use it if you have a similar workflow and you think it could be helpful.    


## How to use    

If you don't have it already, install [Node.js](https://nodejs.org/en/).  

Clone, using `git clone https://github.com/remka/tilesheet.git` or download the repository.  

Open the Terminal, and `cd` to the repo folder, and install the dependencies with `npm install`.  

Use the script with `node tile <path-to-image>`. It should work with both absolute and relative paths.  
You can test the script with `node tile image.png` and `node tile level.png`.  

A prompt will ask you the size of your tiles. Type the size in pixels (just type the number), or leave it blank to use the default value (16px). The script won't run if the dimensions of the image you provide is not divisible by the tile size.  

The script will create a `<filename>-tile.png` in the `sprites` folder, *hopefully* removing all duplicated tiles from the original image.

## Limitations / TODO

- [x] Export tile sheet as a square-ish shape for better usability   
- [ ] Allow user to chose between square-ish and strip shapes for export  
- [ ] Support non-square tiles    

## Credits / Thanks  

* Thanks to [@blld](https://github.com/blldand-tiles) who helped me solve my *ghost tiles* issue. You rock bro!    
* The `level.png` image was created by [Clint Bellanger](https://opengameart.org/forumtopic/feedback-on-16px-robots-and-tiles) and used only for illustration purpose.    
