ImageUploadCropNode
===================

Sample Node.js application to upload, crop and save cropped images to a server. This application was ported from my original .NET MVC application.

The application uses Jcrop and Jquery to manage the user interface and contains the Node.js server side code required to crop the images based on the application parameters. Some basic unit tests have also been included for reference.

The application requires a server side library to manipulate the images (cropping, scaling). The library that I used is called GraphicsMagick. More information about it, including download and installation instructions can be found here:

http://www.graphicsmagick.org/

This application also use the amazing gm library (for the integration with GraphicsMagick). More information about the gm module can be found here:

https://github.com/aheckmann/gm

Finally, for more information on Jcrop go here:

http://deepliquid.com/content/Jcrop.html
