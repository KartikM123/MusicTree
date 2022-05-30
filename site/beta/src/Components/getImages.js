function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('../', '')] = r(item); });
    return images;
  }
  
 export const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));

 export const avatars = importAll(require.context('../pngavatars', false, /\.(png|jpe?g|svg)$/));
