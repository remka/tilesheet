⚠️ **This is a WIP, it kindof working (thanks to @blld), but not perfect. I'm just storing it now while I'm working on it!**      

# Tilesheet utility

A simple script that takes an grid-based image and outputs an other image, getting rid of of duplicated tiles.  

## How to use    

Open the Terminal, and `cd` to the folder in which is the script (type `cd`, the just drop the folder that contains the script).  
Install dependencies with `npm install`.  

Call it with `node tile <path-to-image>`. The test image should work with `node tile image.png`.  

A prompt asks you the size of your tiles. Type the size in px (just the number), or leave it blank to use the default valu (16px, but easy to change by editing the script). The script only supports quare tiles for now.  

The script will create another image in the same folder, identical *minus* duplicated tiles.

The level.png image was created by [Clint Bellanger](https://opengameart.org/forumtopic/feedback-on-16px-robots-and-tiles) ans used only for illustration purpose.  
