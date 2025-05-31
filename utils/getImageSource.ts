// utils/getImageSource.ts

const HOST = 'http://10.0.2.2:3000';

export const getImageSource = (filename: string) => {

  if (filename.startsWith('http') || filename.startsWith('file://')) {
    return { uri: filename };
  }

  if (filename.startsWith('/')) {
    return { uri: HOST + filename };
  }

  switch (filename) {
    // Rice
    case 'nasi_lemak.jpg':
      return require('../assets/images/nasi_lemak.jpg');
    case 'chicken_rice.jpg':
      return require('../assets/images/chicken_rice.jpg');
    case 'kung_pao_chicken_rice.jpg':
      return require('../assets/images/kung_pao_chicken_rice.jpg');
    case 'nasi_kerabu.jpg':
      return require('../assets/images/nasi_kerabu.jpg');
    case 'yangzhou_fried_rice.jpg':
      return require('../assets/images/yangzhou_fried_rice.jpg');
    case 'claypot_rice.jpg':
      return require('../assets/images/claypot_rice.jpg');
    case 'korean_chicken_bowl.jpg':
      return require('../assets/images/korean_chicken_bowl.jpg');

    // Noodle
    case 'mee_goreng_mamak.jpg':
      return require('../assets/images/mee_goreng_mamak.jpg');
    case 'char_kuey_teow.jpg':
      return require('../assets/images/char_kuey_teow.jpg');
    case 'laksa_penang.jpg':
      return require('../assets/images/laksa_penang.jpg');
    case 'mee_rebus.jpg':
      return require('../assets/images/mee_rebus.jpg');
    case 'beef_chow_fun.jpg':
      return require('../assets/images/beef_chow_fun.jpg');
    case 'wonton_noodle.jpg':
      return require('../assets/images/wonton_noodle.jpg');
    case 'korean_ramyeon.jpg':
      return require('../assets/images/korean_ramyeon.jpg');

    // Drinks
    case 'teh_tarik.jpg':
      return require('../assets/images/teh_tarik.jpg');
    case 'milo_ais.jpg':
      return require('../assets/images/milo_ais.jpg');
    case 'coca_cola.jpg':
      return require('../assets/images/coca_cola.jpg');
    case 'limau_ais.jpg':
      return require('../assets/images/limau_ais.jpg');
    case 'soy_milk.jpg':
      return require('../assets/images/soy_milk.jpg');

    // Dessert
    case 'cendol.jpg':
      return require('../assets/images/cendol.jpg');
    case 'tau_fu_fa.jpg':
      return require('../assets/images/tau_fu_fa.jpg');
    case 'pisang_goreng.jpg':
      return require('../assets/images/pisang_goreng.jpg');
    case 'mango_sago.jpg':
      return require('../assets/images/mango_sago.jpg');
    case 'egg_tart.jpg':
      return require('../assets/images/egg_tart.jpg');

    // Snacks
    case 'karipap.jpg':
      return require('../assets/images/karipap.jpg');
    case 'nuggets.jpg':
      return require('../assets/images/nuggets.jpg');
    case 'popcorn_chicken.jpg':
      return require('../assets/images/popcorn_chicken.jpg');
    case 'popiah.jpg':
      return require('../assets/images/popiah.jpg');
    case 'char_siu_bao.jpg':
      return require('../assets/images/char_siu_bao.jpg');

    // Default placeholder for any unrecognized filename
    default:
      return require('../assets/images/default.jpg');
  }
};
