# Compress Array
Install with: `npm i compressarray`<br>
With this package you can easily compress any Object at any Size!<br>
```
  const arrayCompress = require("compressarray");
  const compressed = arrayCompress.compress({
    test: "Hello",
    whatsUp: true,
    someNumber: 1,
  });
  
  console.log(arrayCompress.decompress(compressed));
```
It even keeps the Types and everything!<br>
It also has protection features and is fully sync, no await or Promises.<br>
To help me out you can Fund this project if you like ;D.<br>
