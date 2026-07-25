const sharp = require('sharp');

async function split(file, prefix) {
  const w = Math.floor(4272 / 3);
  const h = 1772;
  await sharp(file).extract({ left: 0, top: 0, width: w, height: h }).toFile(`public/uploads/${prefix}-1.jpg`);
  await sharp(file).extract({ left: w, top: 0, width: w, height: h }).toFile(`public/uploads/${prefix}-2.jpg`);
  await sharp(file).extract({ left: w * 2, top: 0, width: w, height: h }).toFile(`public/uploads/${prefix}-3.jpg`);
}

async function main() {
  await split('public/uploads/bullone-galleria-1.jpg', 'g1');
  await split('public/uploads/bullone-galleria-2.jpg', 'g2');
  console.log("Done");
}
main();
