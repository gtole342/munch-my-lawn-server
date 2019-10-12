let db = require('../models');

const getRandomCoord = (start, end) => {
  const range = end - start + 1
  const base = Math.floor(Math.random() * range) + start
  const decimal = parseFloat(Math.random().toFixed(6))
  return String(base + decimal)
}

const goatSeed = (goatNames) => {
  goatPics = ['https://imgur.com/2Llb5Rr.jpg', 
              'https://imgur.com/V5fBKSL.jpg',
              'https://imgur.com/znAaM3I.jpg',
              'https://imgur.com/Lly2mLa.jpg',
              'https://imgur.com/o7bj6wI.jpg',
              'https://imgur.com/h728IV8.jpg',
              'https://imgur.com/LmJfDOX.jpg',]
  goatNames.forEach((name) => {
    db.User.create({
      firstname: name,
      email: `${name.split(" ").join('')}@munchmylawn.com`,
      isGoat: true,
      password: `${name.split(" ").join('')}1234`,
      address: {
        longitude: getRandomCoord(-122,-123),
        latitude: getRandomCoord(47,48)
      },
      profilePic: goatPics[Math.floor(Math.random() * goatPics.length)]
    })
    .then(goat => {
      console.log(goat, 'Successfully created.')
    })
    .catch((err)=>{
      console.log(err)
    })
  })
}


names = ['Nitch&Eacute','Jean-Peaul','Beau','Napoleon','Camus','Descartes','Galileo','Fukboi','Kepler','Goose','Pig','Giraffe','Cock-of-the-Rock','Deborah','Pigeon','Husky','Giant Baba','Festus Shears','Dumpy','Yeti','Jimmy Wang Yang','Rooster','Dumpster','Mr. Pogo','Puke','Tugboat','Virgil the Kentucky Butcher','Spanky Gazpacho','Brutus Beefcake','Chupacabra','Mr. Tickles',]
goatSeed(names)